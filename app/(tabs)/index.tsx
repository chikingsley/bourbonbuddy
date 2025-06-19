import { useState, useEffect } from 'react';
import { YStack, H1, Text, Spinner, H3, Paragraph, ScrollView, Separator } from 'tamagui';
import { supabase } from '../../lib/supabase/client'; // Adjust path
import { User } from '@supabase/supabase-js';
import { Alert } from 'react-native';

// Define an interface for the shape of joined collection items
interface CollectionItem {
  id: number; // Or string, depending on your 'collections.id' type
  created_at: string;
  user_id: string;
  bourbon_id: string; // Changed to string to match UUID from schema
  bourbons: {
    id: string; // Changed to string to match UUID from schema
    name: string;
    distillery: string | null;
    // Add other bourbon properties you might want to display
  } | null;
}

export default function CollectionScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getInitialUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchCollection();
    } else {
      // No user, clear collection and stop loading
      setCollection([]);
      setLoading(false);
    }
  }, [user]);

  const fetchCollection = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          id,
          created_at,
          user_id,
          bourbon_id,
          bourbons (
            id,
            name,
            distillery
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setCollection(data?.filter(item => item.bourbons) as CollectionItem[] || []);

    } catch (error: any) {
      Alert.alert('Error fetching collection', error.message);
      setCollection([]); // Clear collection on error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
      </YStack>
    );
  }

  if (!user) {
     return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <H1>My Collection</H1>
        <Text>Please sign in to see your collection.</Text>
      </YStack>
    );
  }

  return (
    <ScrollView flex={1}>
      <YStack padding="$4" space="$3">
        <H1 alignSelf="center">My Collection</H1>
        {collection.length === 0 ? (
          <Text textAlign="center" marginTop="$4">Your collection is empty. Start by adding some bourbons!</Text>
        ) : (
          collection.map((item, index) => (
            <YStack key={item.id} space="$2" padding="$3" borderRadius="$4" backgroundColor="$backgroundHover">
              {item.bourbons ? (
                <>
                  <H3>{item.bourbons.name}</H3>
                  {item.bourbons.distillery && <Paragraph>Distillery: {item.bourbons.distillery}</Paragraph>}
                  <Text fontSize="$2" color="$gray10">Added: {new Date(item.created_at).toLocaleDateString()}</Text>
                </>
              ) : (
                <Text>Bourbon details not available</Text>
              )}
              {index < collection.length - 1 && <Separator marginVertical="$2" />}
            </YStack>
          ))
        )}
      </YStack>
    </ScrollView>
  );
}
