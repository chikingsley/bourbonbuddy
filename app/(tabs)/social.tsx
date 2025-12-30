import { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Pressable,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  TrendingUp,
  Star,
  Users,
  MessageCircle,
  Heart,
  Clock,
  Award,
} from 'lucide-react-native';
import { getCollectionStats, getAllBourbons, type Bourbon } from '@/lib/db/client';

interface Activity {
  id: string;
  user: string;
  avatar: string;
  action: 'added' | 'rated' | 'reviewed';
  bourbon: string;
  rating?: number;
  comment?: string;
  timestamp: string;
  likes: number;
}

// Mock activity data - in a real app this would come from a backend
const mockActivities: Activity[] = [
  {
    id: '1',
    user: 'John Smith',
    avatar: '👤',
    action: 'added',
    bourbon: 'Buffalo Trace',
    timestamp: '2 hours ago',
    likes: 12,
  },
  {
    id: '2',
    user: 'Sarah Johnson',
    avatar: '👤',
    action: 'rated',
    bourbon: "Blanton's Single Barrel",
    rating: 5,
    timestamp: '4 hours ago',
    likes: 24,
  },
  {
    id: '3',
    user: 'Mike Wilson',
    avatar: '👤',
    action: 'reviewed',
    bourbon: 'Woodford Reserve',
    rating: 4,
    comment: 'Smooth and rich with notes of caramel and vanilla. Perfect for sipping.',
    timestamp: '6 hours ago',
    likes: 18,
  },
  {
    id: '4',
    user: 'Emily Davis',
    avatar: '👤',
    action: 'added',
    bourbon: 'Eagle Rare 10 Year',
    timestamp: '1 day ago',
    likes: 8,
  },
  {
    id: '5',
    user: 'Chris Martinez',
    avatar: '👤',
    action: 'rated',
    bourbon: 'Maker\'s Mark',
    rating: 4,
    timestamp: '1 day ago',
    likes: 15,
  },
];

export default function SocialScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState<Bourbon[]>([]);
  const [stats, setStats] = useState({ totalUsers: 2847, totalBourbons: 423, totalReviews: 12654 });

  const loadData = async () => {
    try {
      setLoading(true);
      // Get some trending bourbons (just the first 5 for now)
      const bourbons = await getAllBourbons();
      setTrending(bourbons.slice(0, 5));
    } catch (error) {
      console.error('Error loading social data:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const renderActivity = ({ item }: { item: Activity }) => {
    const actionText =
      item.action === 'added'
        ? 'added to collection'
        : item.action === 'rated'
        ? `rated ${item.rating}/5`
        : 'reviewed';

    return (
      <View className="bg-white mb-3 p-4 rounded-xl border border-gray-200">
        {/* User Header */}
        <View className="flex-row items-center mb-3">
          <View className="bg-violet-100 rounded-full w-10 h-10 items-center justify-center mr-3">
            <Text className="text-lg">{item.avatar}</Text>
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-gray-900">{item.user}</Text>
            <View className="flex-row items-center">
              <Text className="text-sm text-gray-600">
                {actionText} <Text className="font-medium text-violet-600">{item.bourbon}</Text>
              </Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <Clock size={14} color="#9CA3AF" />
            <Text className="text-xs text-gray-500 ml-1">{item.timestamp}</Text>
          </View>
        </View>

        {/* Rating */}
        {item.rating && (
          <View className="flex-row items-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                color="#F59E0B"
                fill={star <= item.rating! ? '#F59E0B' : 'transparent'}
                strokeWidth={2}
              />
            ))}
          </View>
        )}

        {/* Comment */}
        {item.comment && (
          <Text className="text-gray-700 mb-3 leading-5">{item.comment}</Text>
        )}

        {/* Actions */}
        <View className="flex-row items-center border-t border-gray-100 pt-3">
          <Pressable className="flex-row items-center mr-6">
            <Heart size={18} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1">{item.likes}</Text>
          </Pressable>
          <Pressable className="flex-row items-center">
            <MessageCircle size={18} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1">Comment</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 pt-12 pb-4 px-4">
        <Text className="text-3xl font-bold text-gray-900 mb-4">Community</Text>

        {/* Community Stats */}
        <View className="flex-row gap-3 mb-2">
          <View className="flex-1 bg-violet-50 rounded-lg p-3 border border-violet-200">
            <View className="flex-row items-center mb-1">
              <Users size={16} color="#7C3AED" />
              <Text className="text-xs text-violet-600 ml-1 font-medium">Members</Text>
            </View>
            <Text className="text-lg font-bold text-violet-900">
              {stats.totalUsers.toLocaleString()}
            </Text>
          </View>
          <View className="flex-1 bg-amber-50 rounded-lg p-3 border border-amber-200">
            <View className="flex-row items-center mb-1">
              <TrendingUp size={16} color="#F59E0B" />
              <Text className="text-xs text-amber-600 ml-1 font-medium">Bourbons</Text>
            </View>
            <Text className="text-lg font-bold text-amber-900">
              {stats.totalBourbons}
            </Text>
          </View>
          <View className="flex-1 bg-blue-50 rounded-lg p-3 border border-blue-200">
            <View className="flex-row items-center mb-1">
              <Star size={16} color="#3B82F6" />
              <Text className="text-xs text-blue-600 ml-1 font-medium">Reviews</Text>
            </View>
            <Text className="text-lg font-bold text-blue-900">
              {stats.totalReviews.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      <View className="p-4">
        {/* Trending Bourbons */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <TrendingUp size={20} color="#7C3AED" />
            <Text className="text-lg font-bold text-gray-900 ml-2">Trending This Week</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
            {trending.map((bourbon) => (
              <Pressable
                key={bourbon.id}
                onPress={() => router.push(`/bourbon/${bourbon.id}`)}
                className="bg-white rounded-xl border border-gray-200 mr-3 w-40"
              >
                <Image
                  source={{ uri: bourbon.image_url }}
                  className="w-full h-32 bg-gray-100 rounded-t-xl"
                  resizeMode="cover"
                />
                <View className="p-3">
                  <Text className="font-semibold text-gray-900 text-sm mb-1" numberOfLines={1}>
                    {bourbon.name}
                  </Text>
                  <Text className="text-xs text-gray-600" numberOfLines={1}>
                    {bourbon.distillery}
                  </Text>
                  {bourbon.msrp && (
                    <Text className="text-sm font-bold text-violet-600 mt-1">
                      ${bourbon.msrp.toFixed(2)}
                    </Text>
                  )}
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Recent Activity Feed */}
        <View className="mb-4">
          <View className="flex-row items-center mb-3">
            <Award size={20} color="#7C3AED" />
            <Text className="text-lg font-bold text-gray-900 ml-2">Recent Activity</Text>
          </View>
          <FlatList
            data={mockActivities}
            renderItem={renderActivity}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Coming Soon Section */}
        <View className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-200 mb-4">
          <View className="items-center">
            <View className="bg-violet-100 rounded-full p-3 mb-3">
              <Users size={32} color="#7C3AED" />
            </View>
            <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
              Connect with Friends
            </Text>
            <Text className="text-gray-600 text-center mb-4">
              Follow other bourbon enthusiasts, share your collection, and discover new favorites together.
            </Text>
            <View className="bg-violet-600 rounded-lg px-6 py-3">
              <Text className="text-white font-semibold">Coming Soon</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
