import { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { CollectionBourbonCard } from '@/components/ui/collection-bourbon-card';
import { getUserCollection, type BourbonWithCollection } from '@/lib/db/client';

export default function CollectionScreen() {
  const [collection, setCollection] = useState<BourbonWithCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadCollection = async () => {
    try {
      setLoading(true);
      const data = await getUserCollection();
      setCollection(data);
    } catch (error) {
      console.error('Error loading collection:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reload collection when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadCollection();
    }, [])
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 pt-12 pb-4 px-4">
        <Text className="text-3xl font-bold text-gray-900 mb-1">My Collection</Text>
        <Text className="text-sm text-gray-600">
          {collection.length} {collection.length === 1 ? 'bourbon' : 'bourbons'}
        </Text>
      </View>

      {/* Collection List */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      ) : collection.length === 0 ? (
        <View className="flex-1 justify-center items-center px-8">
          <Text className="text-2xl font-bold mb-2 text-gray-900 text-center">
            Your Collection is Empty
          </Text>
          <Text className="text-base text-gray-600 text-center mb-6">
            Start building your bourbon collection by exploring new bottles!
          </Text>
          <Text
            className="text-violet-600 font-semibold text-lg"
            onPress={() => router.push('/(tabs)/discover')}
          >
            Discover Bourbons →
          </Text>
        </View>
      ) : (
        <FlatList
          data={collection}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CollectionBourbonCard
              bourbon={item}
              onUpdate={loadCollection}
            />
          )}
          contentContainerClassName="p-4"
          ItemSeparatorComponent={() => <View className="h-4" />}
        />
      )}
    </View>
  );
}
