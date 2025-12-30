import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import { X } from 'lucide-react-native';
import type { BourbonFilters } from '@/lib/db/client';
import { cn } from '@/lib/utils';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: BourbonFilters) => void;
  initialFilters: BourbonFilters;
}

const BOURBON_TYPES = [
  { value: 'bourbon', label: 'Bourbon' },
  { value: 'rye', label: 'Rye' },
  { value: 'wheat', label: 'Wheat' },
  { value: 'malt', label: 'Malt' },
  { value: 'blend', label: 'Blend' },
];

const RARITY_LEVELS = [
  { value: 'common', label: 'Common', color: 'bg-gray-100 border-gray-300 text-gray-700' },
  { value: 'uncommon', label: 'Uncommon', color: 'bg-blue-100 border-blue-300 text-blue-700' },
  { value: 'rare', label: 'Rare', color: 'bg-purple-100 border-purple-300 text-purple-700' },
  { value: 'allocated', label: 'Allocated', color: 'bg-amber-100 border-amber-300 text-amber-700' },
];

const SORT_OPTIONS = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'price_asc', label: 'Price (Low to High)' },
  { value: 'price_desc', label: 'Price (High to Low)' },
  { value: 'proof_asc', label: 'Proof (Low to High)' },
  { value: 'proof_desc', label: 'Proof (High to Low)' },
];

export function FilterModal({ visible, onClose, onApply, initialFilters }: FilterModalProps) {
  const [types, setTypes] = useState<string[]>(initialFilters.types || []);
  const [rarities, setRarities] = useState<string[]>(initialFilters.rarities || []);
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice?.toString() || '');
  const [minProof, setMinProof] = useState(initialFilters.minProof?.toString() || '');
  const [maxProof, setMaxProof] = useState(initialFilters.maxProof?.toString() || '');
  const [sortBy, setSortBy] = useState<BourbonFilters['sortBy']>(initialFilters.sortBy || 'name');

  useEffect(() => {
    setTypes(initialFilters.types || []);
    setRarities(initialFilters.rarities || []);
    setMinPrice(initialFilters.minPrice?.toString() || '');
    setMaxPrice(initialFilters.maxPrice?.toString() || '');
    setMinProof(initialFilters.minProof?.toString() || '');
    setMaxProof(initialFilters.maxProof?.toString() || '');
    setSortBy(initialFilters.sortBy || 'name');
  }, [initialFilters, visible]);

  const toggleType = (type: string) => {
    setTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleRarity = (rarity: string) => {
    setRarities((prev) =>
      prev.includes(rarity) ? prev.filter((r) => r !== rarity) : [...prev, rarity]
    );
  };

  const handleApply = () => {
    const filters: BourbonFilters = {
      types: types.length > 0 ? types : undefined,
      rarities: rarities.length > 0 ? rarities : undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      minProof: minProof ? parseFloat(minProof) : undefined,
      maxProof: maxProof ? parseFloat(maxProof) : undefined,
      sortBy,
    };
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    setTypes([]);
    setRarities([]);
    setMinPrice('');
    setMaxPrice('');
    setMinProof('');
    setMaxProof('');
    setSortBy('name');
  };

  const hasActiveFilters =
    types.length > 0 ||
    rarities.length > 0 ||
    minPrice !== '' ||
    maxPrice !== '' ||
    minProof !== '' ||
    maxProof !== '' ||
    sortBy !== 'name';

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl max-h-[90%]">
          {/* Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-gray-200">
            <View className="flex-row items-center">
              <Text className="text-2xl font-bold text-gray-900">Filters</Text>
              {hasActiveFilters && (
                <View className="ml-2 bg-violet-600 rounded-full w-2 h-2" />
              )}
            </View>
            <Pressable onPress={onClose}>
              <X size={24} color="#6B7280" />
            </Pressable>
          </View>

          <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
            {/* Type Filter */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-3 uppercase">Type</Text>
              <View className="flex-row flex-wrap gap-2">
                {BOURBON_TYPES.map((type) => (
                  <Pressable
                    key={type.value}
                    onPress={() => toggleType(type.value)}
                    className={cn(
                      'px-4 py-2 rounded-full border-2',
                      types.includes(type.value)
                        ? 'bg-violet-600 border-violet-600'
                        : 'bg-white border-gray-300'
                    )}
                  >
                    <Text
                      className={cn(
                        'font-semibold',
                        types.includes(type.value) ? 'text-white' : 'text-gray-700'
                      )}
                    >
                      {type.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Rarity Filter */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-3 uppercase">Rarity</Text>
              <View className="flex-row flex-wrap gap-2">
                {RARITY_LEVELS.map((rarity) => (
                  <Pressable
                    key={rarity.value}
                    onPress={() => toggleRarity(rarity.value)}
                    className={cn(
                      'px-4 py-2 rounded-full border-2',
                      rarities.includes(rarity.value)
                        ? 'bg-violet-600 border-violet-600'
                        : cn('border-2', rarity.color)
                    )}
                  >
                    <Text
                      className={cn(
                        'font-semibold',
                        rarities.includes(rarity.value) ? 'text-white' : rarity.color
                      )}
                    >
                      {rarity.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Price Range */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-3 uppercase">
                Price Range
              </Text>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Text className="text-xs text-gray-500 mb-1">Min Price</Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-base text-gray-900"
                    placeholder="$0"
                    keyboardType="numeric"
                    value={minPrice}
                    onChangeText={setMinPrice}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-500 mb-1">Max Price</Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-base text-gray-900"
                    placeholder="$999"
                    keyboardType="numeric"
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>

            {/* Proof Range */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-3 uppercase">
                Proof Range
              </Text>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Text className="text-xs text-gray-500 mb-1">Min Proof</Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-base text-gray-900"
                    placeholder="0°"
                    keyboardType="numeric"
                    value={minProof}
                    onChangeText={setMinProof}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-500 mb-1">Max Proof</Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-base text-gray-900"
                    placeholder="200°"
                    keyboardType="numeric"
                    value={maxProof}
                    onChangeText={setMaxProof}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>

            {/* Sort By */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-3 uppercase">Sort By</Text>
              <View className="gap-2">
                {SORT_OPTIONS.map((option) => (
                  <Pressable
                    key={option.value}
                    onPress={() => setSortBy(option.value as BourbonFilters['sortBy'])}
                    className={cn(
                      'p-3 rounded-lg border-2',
                      sortBy === option.value
                        ? 'bg-violet-50 border-violet-600'
                        : 'bg-white border-gray-200'
                    )}
                  >
                    <Text
                      className={cn(
                        'font-semibold',
                        sortBy === option.value ? 'text-violet-600' : 'text-gray-700'
                      )}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View className="p-6 border-t border-gray-200 flex-row gap-3">
            <Pressable
              onPress={handleClear}
              className="flex-1 py-3 rounded-lg border border-gray-300 items-center"
            >
              <Text className="text-gray-700 font-semibold">Clear All</Text>
            </Pressable>
            <Pressable
              onPress={handleApply}
              className="flex-1 py-3 rounded-lg bg-violet-600 items-center"
            >
              <Text className="text-white font-semibold">Apply Filters</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
