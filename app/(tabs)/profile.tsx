import { useState, useEffect } from 'react';
import { YStack, H1, Input, Button, Text, Spinner, Label, TextArea } from 'tamagui';
import { supabase } from '../../lib/supabase/client'; // Adjust path
import { Session, User } from '@supabase/supabase-js';
import { Alert } from 'react-native';

export default function ProfileScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, full_name, avatar_url, bio`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) { // 406 is 'Not Acceptable', usually means no row found
        throw error;
      }

      if (data) {
        setUsername(data.username || '');
        setFullName(data.full_name || '');
        setAvatarUrl(data.avatar_url || '');
        setBio(data.bio || '');
      }
    } catch (error: any) {
      Alert.alert('Error fetching profile', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsUpdating(true);
    try {
      const updates = {
        id: user.id,
        username,
        full_name: fullName,
        avatar_url: avatarUrl,
        bio,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }
      Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
    } catch (error: any) {
      Alert.alert('Error updating profile', error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    setIsUpdating(true);
    await supabase.auth.signOut();
    // The router in _layout.tsx should automatically redirect to SignInScreen
    setIsUpdating(false);
  };

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
      </YStack>
    );
  }

  return (
    <YStack flex={1} padding="$4" space="$3">
      <H1 alignSelf="center">Profile</H1>

      <YStack space="$2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={user?.email || ''} editable={false} />
      </YStack>

      <YStack space="$2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChangeText={setUsername}
          placeholder="Your unique username"
        />
      </YStack>

      <YStack space="$2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Your full name (optional)"
        />
      </YStack>

      <YStack space="$2">
        <Label htmlFor="avatarUrl">Avatar URL</Label>
        <Input
          id="avatarUrl"
          value={avatarUrl}
          onChangeText={setAvatarUrl}
          placeholder="URL to your avatar image (optional)"
          keyboardType="url"
        />
      </YStack>

      <YStack space="$2">
        <Label htmlFor="bio">Bio</Label>
        <TextArea
          id="bio"
          value={bio}
          onChangeText={setBio}
          placeholder="Tell us a little about yourself (optional)"
          numberOfLines={3}
        />
      </YStack>

      <Button onPress={handleUpdateProfile} disabled={isUpdating} marginTop="$4">
        {isUpdating ? <Spinner /> : 'Update Profile'}
      </Button>

      <Button onPress={handleSignOut} disabled={isUpdating} theme="red_active" marginTop="$2">
        {isUpdating ? <Spinner /> : 'Sign Out'}
      </Button>
    </YStack>
  );
}
