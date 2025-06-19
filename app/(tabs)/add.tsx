import { useState, useEffect } from 'react';
import { YStack, H1, Input, Button, Text, Spinner, Label, Separator, ScrollView } from 'tamagui';
import { supabase } from '../../lib/supabase/client'; // Adjust path
import { User } from '@supabase/supabase-js';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function AddScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // General loading for the page/user check
  const [isSubmitting, setIsSubmitting] = useState(false); // Specific loading for form submission
  const [bourbonName, setBourbonName] = useState('');
  const [distillery, setDistillery] = useState('');
  // Add more fields here if extending the form e.g. proof, age, type

  useEffect(() => {
    setLoading(true); // Start loading when component mounts
    const getInitialUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      if (!currentUser) {
        Alert.alert("Authentication Error", "You must be signed in to add to your collection.");
        router.replace('/auth/SignInScreen');
      }
      setLoading(false); // Stop loading once user is fetched
    }
    getInitialUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (!currentUser && router.canGoBack()) {
        // Only redirect if user becomes null after initial load
        // Alert.alert("Session Expired", "Your session has expired. Please sign in again.");
        // router.replace('/auth/SignInScreen');
      }
    });

    return () => {
      authListener.unsubscribe();
    };
  }, [router]);

  const handleAddBourbon = async () => {
    if (!user) {
      Alert.alert("Not Authenticated", "Please sign in to add a bourbon.");
      return;
    }
    if (!bourbonName.trim()) {
      Alert.alert("Name Required", "Please enter the bourbon name.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Step 1: Upsert Bourbon into the 'bourbons' table
      const { data: bourbonData, error: bourbonError } = await supabase
        .from('bourbons')
        .upsert(
          {
            name: bourbonName.trim(),
            distillery: distillery.trim() || null,
            // type: 'bourbon', // Default type if not provided, or add to form
            // proof: 0, // Default proof if not provided, or add to form
          },
          {
            onConflict: 'name',
          }
        )
        .select('id')
        .single();

      if (bourbonError) throw bourbonError;
      if (!bourbonData || !bourbonData.id) throw new Error("Failed to upsert bourbon or retrieve its ID.");

      const bourbonId = bourbonData.id;

      // Step 2: Add to 'collections' table
      const { data: existingCollectionItem, error: collectionCheckError } = await supabase
        .from('collections')
        .select('id')
        .eq('user_id', user.id)
        .eq('bourbon_id', bourbonId)
        .maybeSingle();

      if (collectionCheckError) throw collectionCheckError;

      if (existingCollectionItem) {
        Alert.alert("Already in Collection", `${bourbonName} is already in your collection.`);
      } else {
        const { error: collectionInsertError } = await supabase
          .from('collections')
          .insert({
            user_id: user.id,
            bourbon_id: bourbonId,
          });

        if (collectionInsertError) throw collectionInsertError;
        Alert.alert("Success", `${bourbonName} added to your collection!`);
        setBourbonName('');
        setDistillery('');
        // router.push('/(tabs)');
      }
    } catch (error: any) {
      console.error("Error adding bourbon:", error);
      Alert.alert("Error", `Failed to add bourbon: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) { // Shows spinner while checking for user
    return (
        <YStack flex={1} justifyContent="center" alignItems="center">
            <Spinner size="large" />
            <Text>Loading...</Text>
        </YStack>
    );
  }

  // if (!user && !loading) {
  //   // This case should be handled by redirection, but as a fallback:
  //   return (
  //       <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
  //           <Text>Please sign in to add bourbons.</Text>
  //           <Button onPress={() => router.replace('/auth/SignInScreen')}>Go to Sign In</Button>
  //       </YStack>
  //   );
  // }


  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <YStack flex={1} padding="$4" space="$3" justifyContent="flex-start" paddingTop="$8">
        <H1 alignSelf="center" marginBottom="$4">Add New Bourbon</H1>

        <YStack space="$2">
          <Label htmlFor="bourbonName">Bourbon Name*</Label>
          <Input
            id="bourbonName"
            value={bourbonName}
            onChangeText={setBourbonName}
            placeholder="e.g., Eagle Rare 10 Year"
          />
        </YStack>

        <YStack space="$2">
          <Label htmlFor="distillery">Distillery</Label>
          <Input
            id="distillery"
            value={distillery}
            onChangeText={setDistillery}
            placeholder="e.g., Buffalo Trace"
          />
        </YStack>

        {/* Add more form fields here for proof, age, type etc. */}

        <Separator marginVertical="$3" />

        <Button onPress={handleAddBourbon} disabled={isSubmitting} theme="green_active" icon={isSubmitting ? () => <Spinner /> : undefined}>
          Add to My Collection
        </Button>
      </YStack>
    </ScrollView>
  );
}
