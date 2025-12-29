import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Search, Plus, Check, Star, X } from 'lucide-react-native';
import { BourbonCard } from '@/components/ui/bourbon-card';
import {
  getAllBourbons,
  searchBourbons,
  addToCollection,
  removeFromCollection,
  isInCollection,
  updateCollectionNotes,
  type Bourbon,
} from '@/lib/db/client';
import { useFocusEffect } from 'expo-router';

interface BourbonWithStatus extends Bourbon {
  inCollection: boolean;
}

export default function AddScreen() {
  const [bourbons, setBourbons] = useState<BourbonWithStatus[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedBourbon, setSelectedBourbon] = useState<BourbonWithStatus | null>(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);

  const loadBourbons = async () => {
    try {
      setLoading(true);
      const data = searchQuery ? await searchBourbons(searchQuery) : await getAllBourbons();

      // Check collection status for each bourbon
      const bourbonsWithStatus = await Promise.all(
        data.map(async (bourbon) => ({
          ...bourbon,
          inCollection: await isInCollection(bourbon.id),
        }))
      );

      setBourbons(bourbonsWithStatus);
    } catch (error) {
      console.error('Error loading bourbons:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reload bourbons when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadBourbons();
    }, [searchQuery])
  );

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      loadBourbons();
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const handleToggleCollection = async (bourbon: BourbonWithStatus) => {
    if (bourbon.inCollection) {
      // Remove from collection
      Alert.alert(
        'Remove from Collection',
        `Remove ${bourbon.name} from your collection?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: async () => {
              await removeFromCollection(bourbon.id);
              await loadBourbons();
            },
          },
        ]
      );
    } else {
      // Show modal to add notes and rating
      setSelectedBourbon(bourbon);
      setNotes('');
      setRating(0);
      setShowNotesModal(true);
    }
  };

  const handleAddToCollection = async () => {
    if (!selectedBourbon) return;

    try {
      await addToCollection(selectedBourbon.id);
      if (notes || rating > 0) {
        await updateCollectionNotes(selectedBourbon.id, notes, rating);
      }
      setShowNotesModal(false);
      setSelectedBourbon(null);
      await loadBourbons();
    } catch (error) {
      console.error('Error adding to collection:', error);
      Alert.alert('Error', 'Failed to add bourbon to collection');
    }
  };

  const renderBourbonItem = ({ item }: { item: BourbonWithStatus }) => (
    <View className="mb-4">
      <BourbonCard bourbon={item} />
      <Pressable
        onPress={() => handleToggleCollection(item)}
        className={`mt-2 mx-4 py-3 rounded-lg flex-row items-center justify-center ${
          item.inCollection ? 'bg-red-500' : 'bg-violet-600'
        }`}
      >
        {item.inCollection ? (
          <>
            <Check size={20} color="white" strokeWidth={2.5} />
            <Text className="text-white font-semibold ml-2">In Collection</Text>
          </>
        ) : (
          <>
            <Plus size={20} color="white" strokeWidth={2.5} />
            <Text className="text-white font-semibold ml-2">Add to Collection</Text>
          </>
        )}
      </Pressable>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with Search */}
      <View className="bg-white border-b border-gray-200 pt-12 pb-4 px-4">
        <Text className="text-2xl font-bold text-gray-900 mb-4">Add to Collection</Text>
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-900"
            placeholder="Search bourbons..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
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
          renderItem={renderBourbonItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerClassName="p-4"
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-12">
              <Text className="text-gray-500 text-base">No bourbons found</Text>
            </View>
          }
        />
      )}

      {/* Add Notes Modal */}
      <Modal
        visible={showNotesModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNotesModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-2xl font-bold text-gray-900">Add to Collection</Text>
              <Pressable onPress={() => setShowNotesModal(false)}>
                <X size={24} color="#6B7280" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedBourbon && (
                <View className="mb-6">
                  <Text className="text-lg font-semibold text-gray-900 mb-1">
                    {selectedBourbon.name}
                  </Text>
                  <Text className="text-sm text-gray-600">{selectedBourbon.distillery}</Text>
                </View>
              )}

              {/* Rating */}
              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">Rating (Optional)</Text>
                <View className="flex-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Pressable key={star} onPress={() => setRating(star)} className="mr-2">
                      <Star
                        size={32}
                        color="#F59E0B"
                        fill={star <= rating ? '#F59E0B' : 'transparent'}
                        strokeWidth={2}
                      />
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Notes */}
              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">Notes (Optional)</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-base text-gray-900"
                  placeholder="Add your tasting notes, where you bought it, etc..."
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => setShowNotesModal(false)}
                  className="flex-1 py-3 rounded-lg border border-gray-300 items-center"
                >
                  <Text className="text-gray-700 font-semibold">Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleAddToCollection}
                  className="flex-1 py-3 rounded-lg bg-violet-600 items-center"
                >
                  <Text className="text-white font-semibold">Add to Collection</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
