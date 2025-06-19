import { useState } from 'react';
import { YStack, H1, Input, Button, Text, Spinner } from 'tamagui';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase/client'; // Adjust path if necessary
import { Alert } from 'react-native';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!username.trim()) {
      Alert.alert('Username required', 'Please enter a username.');
      return;
    }
    setLoading(true);
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      Alert.alert('Sign Up Error', authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // Insert into profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: authData.user.id, username: username.trim() }]);

      if (profileError) {
        // Potentially handle this error more gracefully
        // e.g., tell the user their account was created but profile setup failed
        // and maybe delete the auth user if profile creation is critical
        Alert.alert('Profile Creation Error', profileError.message);
      } else {
        // Navigate to the main app section or show a confirmation message
        Alert.alert('Sign Up Successful', 'Please check your email to confirm your account.');
        // router.replace('/(tabs)'); // Or router.replace('/auth/SignInScreen'); to have them sign in
        router.replace('/auth/SignInScreen');
      }
    }
    setLoading(false);
  };

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" space="$4">
      <H1>Sign Up</H1>
      <Input
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        width="100%"
      />
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        width="100%"
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        width="100%"
      />
      <Button onPress={handleSignUp} disabled={loading} width="100%">
        {loading ? <Spinner /> : 'Sign Up'}
      </Button>
      <Text>
        Already have an account?{' '}
        <Text color="$blue10" onPress={() => router.push('/auth/SignInScreen')}>
          Sign In
        </Text>
      </Text>
    </YStack>
  );
}
