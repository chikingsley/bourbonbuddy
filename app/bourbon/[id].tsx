import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Star, Plus, Check, Edit2, X } from 'lucide-react-native';
import {
  getBourbonById,
  isInCollection,
  addToCollection,
  removeFromCollection,
  updateCollectionNotes,
  getUserCollection,
  type Bourbon,
  type BourbonWithCollection,
} from '@/lib/db/client';
import { cn } from '@/lib/utils';

export default function BourbonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [bourbon, setBourbon] = useState<Bourbon | null>(null);
  const [collectionData, setCollectionData] = useState<BourbonWithCollection | null>(null);
  const [inCollection, setInCollection] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);

  const loadBourbonData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const bourbonData = await getBourbonById(Number(id));
      if (!bourbonData) {
        Alert.alert('Error', 'Bourbon not found');
        router.back();
        return;
      }

      setBourbon(bourbonData);

      // Check if in collection and get collection data
      const inColl = await isInCollection(Number(id));
      setInCollection(inColl);

      if (inColl) {
        const userCollection = await getUserCollection();
        const collectionItem = userCollection.find((item) => item.id === Number(id));
        if (collectionItem) {
          setCollectionData(collectionItem);
          setNotes(collectionItem.collection_notes || '');
          setRating(collectionItem.collection_rating || 0);
        }
      }
    } catch (error) {
      console.error('Error loading bourbon:', error);
      Alert.alert('Error', 'Failed to load bourbon details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBourbonData();
  }, [id]);

  const handleAddToCollection = async () => {
    if (!bourbon) return;

    try {
      await addToCollection(bourbon.id);
      if (notes || rating > 0) {
        await updateCollectionNotes(bourbon.id, notes, rating);
      }
      setShowNotesModal(false);
      await loadBourbonData();
    } catch (error) {
      console.error('Error adding to collection:', error);
      Alert.alert('Error', 'Failed to add to collection');
    }
  };

  const handleUpdateNotes = async () => {
    if (!bourbon) return;

    try {
      await updateCollectionNotes(bourbon.id, notes, rating);
      setShowNotesModal(false);
      await loadBourbonData();
    } catch (error) {
      console.error('Error updating notes:', error);
      Alert.alert('Error', 'Failed to update notes');
    }
  };

  const handleRemoveFromCollection = () => {
    if (!bourbon) return;

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
              await loadBourbonData();
            } catch (error) {
              console.error('Error removing from collection:', error);
              Alert.alert('Error', 'Failed to remove from collection');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  if (!bourbon) {
    return null;
  }

  const rarityColors = {
    common: 'bg-gray-100 text-gray-700',
    uncommon: 'bg-blue-100 text-blue-700',
    rare: 'bg-purple-100 text-purple-700',
    allocated: 'bg-amber-100 text-amber-700',
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView>
        {/* Header Image */}
        <View className="relative">
          <Image
            source={{ uri: bourbon.image_url }}
            className="w-full h-96 bg-gray-100"
            resizeMode="cover"
          />
          {/* Back Button */}
          <Pressable
            onPress={() => router.back()}
            className="absolute top-12 left-4 bg-white/90 rounded-full p-2 shadow-lg"
          >
            <ArrowLeft size={24} color="#000" />
          </Pressable>
          {/* Rarity Badge */}
          <View className="absolute top-12 right-4">
            <View className={cn('px-3 py-1.5 rounded-full shadow-lg', rarityColors[bourbon.rarity])}>
              <Text className={cn('text-sm font-semibold capitalize', rarityColors[bourbon.rarity])}>
                {bourbon.rarity}
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="p-6">
          {/* Title and Distillery */}
          <Text className="text-3xl font-bold text-gray-900 mb-2">{bourbon.name}</Text>
          <Text className="text-lg text-gray-600 mb-4">{bourbon.distillery}</Text>

          {/* Price */}
          {bourbon.msrp && (
            <Text className="text-3xl font-bold text-violet-600 mb-6">
              ${bourbon.msrp.toFixed(2)}
            </Text>
          )}

          {/* Specs Grid */}
          <View className="bg-gray-50 rounded-xl p-4 mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-3 uppercase">Specifications</Text>
            <View className="flex-row flex-wrap">
              <View className="w-1/2 mb-4">
                <Text className="text-xs text-gray-500 mb-1">Type</Text>
                <Text className="text-base font-semibold text-gray-900 capitalize">{bourbon.type}</Text>
              </View>
              <View className="w-1/2 mb-4">
                <Text className="text-xs text-gray-500 mb-1">Proof</Text>
                <Text className="text-base font-semibold text-gray-900">{bourbon.proof}°</Text>
              </View>
              {bourbon.age_statement && (
                <View className="w-1/2 mb-4">
                  <Text className="text-xs text-gray-500 mb-1">Age</Text>
                  <Text className="text-base font-semibold text-gray-900">{bourbon.age_statement}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2 uppercase">Description</Text>
            <Text className="text-base text-gray-700 leading-6">{bourbon.description}</Text>
          </View>

          {/* Collection Notes (if in collection) */}
          {inCollection && collectionData && (
            <View className="bg-violet-50 rounded-xl p-4 mb-6 border border-violet-200">
              <Text className="text-sm font-semibold text-violet-900 mb-3 uppercase">My Notes</Text>

              {/* Rating Display */}
              {collectionData.collection_rating && collectionData.collection_rating > 0 && (
                <View className="flex-row items-center mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      color="#F59E0B"
                      fill={star <= (collectionData.collection_rating || 0) ? '#F59E0B' : 'transparent'}
                      strokeWidth={2}
                    />
                  ))}
                  <Text className="text-sm text-gray-700 ml-2 font-medium">
                    {collectionData.collection_rating}/5
                  </Text>
                </View>
              )}

              {/* Notes */}
              {collectionData.collection_notes ? (
                <Text className="text-base text-gray-700 leading-6 mb-3">
                  {collectionData.collection_notes}
                </Text>
              ) : (
                <Text className="text-base text-gray-500 italic mb-3">No notes yet</Text>
              )}

              {/* Edit Button */}
              <Pressable
                onPress={() => {
                  setNotes(collectionData.collection_notes || '');
                  setRating(collectionData.collection_rating || 0);
                  setShowNotesModal(true);
                }}
                className="bg-violet-600 py-2 px-4 rounded-lg flex-row items-center justify-center"
              >
                <Edit2 size={16} color="white" />
                <Text className="text-white font-semibold ml-2">Edit Notes</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="border-t border-gray-200 p-4 bg-white">
        {inCollection ? (
          <View className="flex-row gap-3">
            <Pressable
              onPress={handleRemoveFromCollection}
              className="flex-1 py-4 rounded-xl border-2 border-red-500 items-center"
            >
              <Text className="text-red-500 font-bold text-base">Remove from Collection</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setNotes(collectionData?.collection_notes || '');
                setRating(collectionData?.collection_rating || 0);
                setShowNotesModal(true);
              }}
              className="flex-1 py-4 rounded-xl bg-violet-600 items-center flex-row justify-center"
            >
              <Edit2 size={20} color="white" />
              <Text className="text-white font-bold text-base ml-2">Edit</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={() => {
              setNotes('');
              setRating(0);
              setShowNotesModal(true);
            }}
            className="py-4 rounded-xl bg-violet-600 items-center flex-row justify-center"
          >
            <Plus size={24} color="white" strokeWidth={2.5} />
            <Text className="text-white font-bold text-lg ml-2">Add to Collection</Text>
          </Pressable>
        )}
      </View>

      {/* Notes Modal */}
      <Modal
        visible={showNotesModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNotesModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-2xl font-bold text-gray-900">
                {inCollection ? 'Edit Notes' : 'Add to Collection'}
              </Text>
              <Pressable onPress={() => setShowNotesModal(false)}>
                <X size={24} color="#6B7280" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-900 mb-1">{bourbon.name}</Text>
                <Text className="text-sm text-gray-600">{bourbon.distillery}</Text>
              </View>

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
                  onPress={inCollection ? handleUpdateNotes : handleAddToCollection}
                  className="flex-1 py-3 rounded-lg bg-violet-600 items-center"
                >
                  <Text className="text-white font-semibold">
                    {inCollection ? 'Save Changes' : 'Add to Collection'}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
