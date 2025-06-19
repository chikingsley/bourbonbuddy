import { useState } from 'react';
import { YStack, H1, Input, Button, Text, Spinner } from 'tamagui';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase/client'; // Adjust path if necessary
import { Alert } from 'react-native';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Sign In Error', error.message);
    } else {
      // Navigate to the main app section, e.g., home screen
      // This might need adjustment based on your navigation setup in _layout.tsx
      router.replace('/(tabs)');
    }
    setLoading(false);
  };

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$4" space="$4">
      <H1>Sign In</H1>
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
      <Button onPress={handleSignIn} disabled={loading} width="100%">
        {loading ? <Spinner /> : 'Sign In'}
      </Button>
      <Text>
        Don't have an account?{' '}
        <Text color="$blue10" onPress={() => router.push('/auth/SignUpScreen')}>
          Sign Up
        </Text>
      </Text>
    </YStack>
  );
}
