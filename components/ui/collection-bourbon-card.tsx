import { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Star, Edit2, X, Trash2 } from 'lucide-react-native';
import type { BourbonWithCollection } from '@/lib/db/client';
import { updateCollectionNotes, removeFromCollection } from '@/lib/db/client';
import { cn } from '@/lib/utils';

interface CollectionBourbonCardProps {
  bourbon: BourbonWithCollection;
  onUpdate?: () => void;
}

export function CollectionBourbonCard({ bourbon, onUpdate }: CollectionBourbonCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [notes, setNotes] = useState(bourbon.collection_notes || '');
  const [rating, setRating] = useState(bourbon.collection_rating || 0);

  const handleSaveNotes = async () => {
    try {
      await updateCollectionNotes(bourbon.id, notes, rating);
      setShowEditModal(false);
      onUpdate?.();
    } catch (error) {
      console.error('Error updating notes:', error);
      Alert.alert('Error', 'Failed to update notes');
    }
  };

  const handleRemove = () => {
    Alert.alert(
      'Remove from Collection',
      `Remove ${bourbon.name} from your collection?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeFromCollection(bourbon.id);
              onUpdate?.();
            } catch (error) {
              console.error('Error removing bourbon:', error);
              Alert.alert('Error', 'Failed to remove bourbon');
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <View className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Image
          source={{ uri: bourbon.image_url }}
          className="w-full h-40 bg-gray-100"
          resizeMode="cover"
        />
        <View className="p-4">
          <View className="flex-row items-start justify-between mb-2">
            <Text className="text-lg font-bold text-gray-900 flex-1" numberOfLines={2}>
              {bourbon.name}
            </Text>
          </View>

          <Text className="text-sm text-gray-600 mb-2" numberOfLines={1}>
            {bourbon.distillery}
          </Text>

          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center space-x-4">
              <View>
                <Text className="text-xs text-gray-500">Proof</Text>
                <Text className="text-sm font-semibold text-gray-900">{bourbon.proof}°</Text>
              </View>
              {bourbon.age_statement && (
                <View>
                  <Text className="text-xs text-gray-500">Age</Text>
                  <Text className="text-sm font-semibold text-gray-900">{bourbon.age_statement}</Text>
                </View>
              )}
            </View>
            {bourbon.msrp && (
              <Text className="text-lg font-bold text-violet-600">
                ${bourbon.msrp.toFixed(2)}
              </Text>
            )}
          </View>

          {/* Rating Display */}
          {bourbon.collection_rating && bourbon.collection_rating > 0 && (
            <View className="flex-row items-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  color="#F59E0B"
                  fill={star <= (bourbon.collection_rating || 0) ? '#F59E0B' : 'transparent'}
                  strokeWidth={2}
                />
              ))}
              <Text className="text-sm text-gray-600 ml-2">
                {bourbon.collection_rating}/5
              </Text>
            </View>
          )}

          {/* Notes Display */}
          {bourbon.collection_notes && (
            <View className="bg-gray-50 rounded-lg p-3 mb-3">
              <Text className="text-xs font-medium text-gray-500 mb-1">My Notes</Text>
              <Text className="text-sm text-gray-700" numberOfLines={3}>
                {bourbon.collection_notes}
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => {
                setNotes(bourbon.collection_notes || '');
                setRating(bourbon.collection_rating || 0);
                setShowEditModal(true);
              }}
              className="flex-1 py-2 px-3 rounded-lg bg-violet-600 flex-row items-center justify-center"
            >
              <Edit2 size={16} color="white" />
              <Text className="text-white font-semibold ml-1">Edit</Text>
            </Pressable>
            <Pressable
              onPress={handleRemove}
              className="py-2 px-3 rounded-lg border border-red-300 bg-red-50 flex-row items-center justify-center"
            >
              <Trash2 size={16} color="#EF4444" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-2xl font-bold text-gray-900">Edit Notes</Text>
              <Pressable onPress={() => setShowEditModal(false)}>
                <X size={24} color="#6B7280" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-900 mb-1">
                  {bourbon.name}
                </Text>
                <Text className="text-sm text-gray-600">{bourbon.distillery}</Text>
              </View>

              {/* Rating */}
              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">Rating</Text>
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
                <Text className="text-sm font-medium text-gray-700 mb-2">Notes</Text>
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
                  onPress={() => setShowEditModal(false)}
                  className="flex-1 py-3 rounded-lg border border-gray-300 items-center"
                >
                  <Text className="text-gray-700 font-semibold">Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleSaveNotes}
                  className="flex-1 py-3 rounded-lg bg-violet-600 items-center"
                >
                  <Text className="text-white font-semibold">Save Changes</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
