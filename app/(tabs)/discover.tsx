import { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TextInput, Pressable } from 'react-native';
import { Search, X, SlidersHorizontal } from 'lucide-react-native';
import { BourbonCard } from '@/components/ui/bourbon-card';
import { FilterModal } from '@/components/ui/filter-modal';
import {
  getFilteredBourbons,
  type Bourbon,
  type BourbonFilters,
} from '@/lib/db/client';
import { iconWithClassName } from '@/lib/icons/iconWithClassName';

iconWithClassName(Search);
iconWithClassName(X);
iconWithClassName(SlidersHorizontal);

export default function DiscoverScreen() {
  const [bourbons, setBourbons] = useState<Bourbon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<BourbonFilters>({ sortBy: 'name' });

  const loadBourbons = async () => {
    try {
      setLoading(true);
      const data = await getFilteredBourbons(filters, searchQuery);
      setBourbons(data);
    } catch (error) {
      console.error('Error loading bourbons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      loadBourbons();
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery, filters]);

  const handleApplyFilters = (newFilters: BourbonFilters) => {
    setFilters(newFilters);
  };

  const hasActiveFilters =
    (filters.types && filters.types.length > 0) ||
    (filters.rarities && filters.rarities.length > 0) ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.minProof !== undefined ||
    filters.maxProof !== undefined ||
    filters.sortBy !== 'name';

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 pt-12 pb-4 px-4">
        <Text className="text-3xl font-bold text-gray-900 mb-4">Discover</Text>

        {/* Search and Filter Bar */}
        <View className="flex-row gap-2">
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
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
          <Pressable
            onPress={() => setShowFilters(true)}
            className="bg-gray-100 rounded-lg px-3 py-2 justify-center items-center relative"
          >
            <SlidersHorizontal size={20} color="#6B7280" />
            {hasActiveFilters && (
              <View className="absolute top-1 right-1 bg-violet-600 rounded-full w-2 h-2" />
            )}
          </Pressable>
        </View>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <View className="mt-3">
            <Text className="text-xs text-gray-600">
              {[
                filters.types && filters.types.length > 0 && `${filters.types.length} type(s)`,
                filters.rarities && filters.rarities.length > 0 && `${filters.rarities.length} rarity`,
                (filters.minPrice || filters.maxPrice) && 'price range',
                (filters.minProof || filters.maxProof) && 'proof range',
              ]
                .filter(Boolean)
                .join(', ')}
            </Text>
          </View>
        )}
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

      {/* Filter Modal */}
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        initialFilters={filters}
      />
    </View>
  );
}
