import { useEffect, useState } from 'react';
import { Slot, SplashScreen, useRouter, useSegments } from 'expo-router';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from '../tamagui.config'; // Correct path from app/_layout.tsx
import { supabase } from '../lib/supabase/client'; // Correct path from app/_layout.tsx
import { Session } from '@supabase/supabase-js';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
      SplashScreen.hideAsync(); // Hide splash screen once session is determined
    });

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        // Small delay to ensure navigation context is ready if needed
        setTimeout(() => {
          if (!session && segments[0] !== '(auth)') {
            router.replace('/auth/SignInScreen');
          } else if (session && segments[0] === '(auth)') {
            router.replace('/(tabs)');
          }
        }, 0);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (session && !inAuthGroup) {
      // User is signed in but not in the main app group, redirect to tabs
      router.replace('/(tabs)');
    } else if (!session && !inAuthGroup && segments.length > 0 && segments[0] !== '_sitemap') {
      // User is not signed in and not in auth group, redirect to sign in
      // Added segments.length > 0 and !== '_sitemap' to prevent issues during initial load or with dev tools
      router.replace('/auth/SignInScreen');
    }
     // If session changes and user is in auth group, they will be redirected by onAuthStateChange
     // If user is signed out and already in auth group, they stay there.

  }, [session, initialized, segments, router]);


  if (!initialized) {
    // While checking auth state, you can return a loading indicator or null
    return null;
  }

  // Ensure TamaguiProvider wraps the Slot
  // The Slot will render either the (auth) or (tabs) layout based on navigation state.
  return (
    <TamaguiProvider config={tamaguiConfig}>
        <Slot />
    </TamaguiProvider>
  );
}
