import { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TextInput, Pressable } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { BourbonCard } from '@/components/ui/bourbon-card';
import { getAllBourbons, searchBourbons, type Bourbon } from '@/lib/db/client';
import { iconWithClassName } from '@/lib/icons/iconWithClassName';

iconWithClassName(Search);
iconWithClassName(X);

export default function DiscoverScreen() {
  const [bourbons, setBourbons] = useState<Bourbon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadBourbons = async () => {
    try {
      setLoading(true);
      const data = searchQuery
        ? await searchBourbons(searchQuery)
        : await getAllBourbons();
      setBourbons(data);
    } catch (error) {
      console.error('Error loading bourbons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBourbons();
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 pt-12 pb-4 px-4">
        <Text className="text-3xl font-bold text-gray-900 mb-4">Discover</Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-900"
            placeholder="Search bourbons..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={clearSearch}>
              <X size={20} color="#9CA3AF" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Bourbon List */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      ) : (
        <FlatList
          data={bourbons}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <BourbonCard bourbon={item} />}
          contentContainerClassName="p-4"
          ItemSeparatorComponent={() => <View className="h-4" />}
          ListEmptyComponent={() => (
            <View className="items-center py-12">
              <Text className="text-gray-500 text-center">
                {searchQuery ? 'No bourbons found' : 'No bourbons available'}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
