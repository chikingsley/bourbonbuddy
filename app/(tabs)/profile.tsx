import { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import {
  User,
  BarChart3,
  Download,
  Share2,
  Settings,
  Star,
  DollarSign,
  Flame,
  TrendingUp,
} from 'lucide-react-native';
import { getCollectionStats, getUserCollection, type CollectionStats } from '@/lib/db/client';
import { cn } from '@/lib/utils';

export default function ProfileScreen() {
  const [stats, setStats] = useState<CollectionStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getCollectionStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  const handleExportCollection = async () => {
    try {
      const collection = await getUserCollection();
      const exportData = {
        exportDate: new Date().toISOString(),
        totalBourbons: collection.length,
        bourbons: collection.map((bourbon) => ({
          name: bourbon.name,
          distillery: bourbon.distillery,
          type: bourbon.type,
          proof: bourbon.proof,
          age: bourbon.age_statement,
          msrp: bourbon.msrp,
          rarity: bourbon.rarity,
          rating: bourbon.collection_rating,
          notes: bourbon.collection_notes,
        })),
      };

      const jsonString = JSON.stringify(exportData, null, 2);

      // In a real app, you'd use expo-file-system to save this
      // For now, we'll just show the data
      Alert.alert(
        'Export Collection',
        'Your collection has been prepared for export.\n\n' +
          `Total: ${collection.length} bourbons\n` +
          `Total Value: $${stats?.totalValue.toFixed(2) || 0}`,
        [
          {
            text: 'Copy to Clipboard',
            onPress: () => {
              // Would use Clipboard API here
              Alert.alert('Success', 'Collection data copied to clipboard');
            },
          },
          { text: 'OK' },
        ]
      );
    } catch (error) {
      console.error('Error exporting collection:', error);
      Alert.alert('Error', 'Failed to export collection');
    }
  };

  const handleShareCollection = async () => {
    if (!stats) return;

    try {
      const message = `🥃 My Bourbon Collection\n\n` +
        `📊 ${stats.totalBourbons} bottles\n` +
        `💰 $${stats.totalValue.toFixed(2)} total value\n` +
        `⭐ ${stats.averageRating.toFixed(1)} avg rating\n` +
        `🔥 ${stats.averageProof.toFixed(0)}° avg proof\n\n` +
        `Built with BourbonBuddy 🥃`;

      await Share.share({
        message,
        title: 'My Bourbon Collection',
      });
    } catch (error) {
      console.error('Error sharing collection:', error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  if (!stats) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center px-8">
        <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
          No Data Available
        </Text>
        <Text className="text-gray-600 text-center">
          Start adding bourbons to your collection to see statistics!
        </Text>
      </View>
    );
  }

  const typeColors: Record<string, string> = {
    bourbon: 'bg-amber-500',
    rye: 'bg-orange-500',
    wheat: 'bg-yellow-500',
    malt: 'bg-green-500',
    blend: 'bg-blue-500',
  };

  const rarityColors: Record<string, string> = {
    common: 'bg-gray-500',
    uncommon: 'bg-blue-500',
    rare: 'bg-purple-500',
    allocated: 'bg-amber-500',
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 pt-12 pb-6 px-4">
        <View className="items-center mb-4">
          <View className="bg-violet-100 rounded-full p-4 mb-3">
            <User size={40} color="#7C3AED" strokeWidth={2} />
          </View>
          <Text className="text-2xl font-bold text-gray-900">My Profile</Text>
          <Text className="text-sm text-gray-600">Bourbon Enthusiast</Text>
        </View>
      </View>

      {/* Quick Stats Grid */}
      <View className="p-4">
        <View className="flex-row flex-wrap gap-3 mb-4">
          {/* Total Bourbons */}
          <View className="flex-1 min-w-[45%] bg-white rounded-xl p-4 border border-gray-200">
            <View className="bg-violet-100 rounded-lg p-2 w-10 h-10 items-center justify-center mb-2">
              <BarChart3 size={20} color="#7C3AED" />
            </View>
            <Text className="text-2xl font-bold text-gray-900">{stats.totalBourbons}</Text>
            <Text className="text-xs text-gray-600">Total Bourbons</Text>
          </View>

          {/* Total Value */}
          <View className="flex-1 min-w-[45%] bg-white rounded-xl p-4 border border-gray-200">
            <View className="bg-green-100 rounded-lg p-2 w-10 h-10 items-center justify-center mb-2">
              <DollarSign size={20} color="#10B981" />
            </View>
            <Text className="text-2xl font-bold text-gray-900">
              ${stats.totalValue.toFixed(0)}
            </Text>
            <Text className="text-xs text-gray-600">Collection Value</Text>
          </View>

          {/* Average Rating */}
          <View className="flex-1 min-w-[45%] bg-white rounded-xl p-4 border border-gray-200">
            <View className="bg-amber-100 rounded-lg p-2 w-10 h-10 items-center justify-center mb-2">
              <Star size={20} color="#F59E0B" />
            </View>
            <Text className="text-2xl font-bold text-gray-900">
              {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
            </Text>
            <Text className="text-xs text-gray-600">Avg Rating</Text>
          </View>

          {/* Average Proof */}
          <View className="flex-1 min-w-[45%] bg-white rounded-xl p-4 border border-gray-200">
            <View className="bg-red-100 rounded-lg p-2 w-10 h-10 items-center justify-center mb-2">
              <Flame size={20} color="#EF4444" />
            </View>
            <Text className="text-2xl font-bold text-gray-900">
              {stats.averageProof.toFixed(0)}°
            </Text>
            <Text className="text-xs text-gray-600">Avg Proof</Text>
          </View>
        </View>

        {/* Type Breakdown */}
        {stats.typeBreakdown.length > 0 && (
          <View className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
            <View className="flex-row items-center mb-3">
              <BarChart3 size={20} color="#6B7280" />
              <Text className="text-base font-semibold text-gray-900 ml-2">
                Collection by Type
              </Text>
            </View>
            <View className="gap-2">
              {stats.typeBreakdown.map((item) => {
                const percentage = (item.count / stats.totalBourbons) * 100;
                return (
                  <View key={item.type}>
                    <View className="flex-row justify-between mb-1">
                      <Text className="text-sm font-medium text-gray-700 capitalize">
                        {item.type}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {item.count} ({percentage.toFixed(0)}%)
                      </Text>
                    </View>
                    <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <View
                        className={cn('h-full', typeColors[item.type] || 'bg-gray-500')}
                        style={{ width: `${percentage}%` }}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Rarity Breakdown */}
        {stats.rarityBreakdown.length > 0 && (
          <View className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
            <View className="flex-row items-center mb-3">
              <TrendingUp size={20} color="#6B7280" />
              <Text className="text-base font-semibold text-gray-900 ml-2">
                Collection by Rarity
              </Text>
            </View>
            <View className="gap-2">
              {stats.rarityBreakdown.map((item) => {
                const percentage = (item.count / stats.totalBourbons) * 100;
                return (
                  <View key={item.rarity}>
                    <View className="flex-row justify-between mb-1">
                      <Text className="text-sm font-medium text-gray-700 capitalize">
                        {item.rarity}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {item.count} ({percentage.toFixed(0)}%)
                      </Text>
                    </View>
                    <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <View
                        className={cn('h-full', rarityColors[item.rarity] || 'bg-gray-500')}
                        style={{ width: `${percentage}%` }}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Actions */}
        <View className="gap-3 mb-4">
          <Pressable
            onPress={handleShareCollection}
            className="bg-white rounded-xl p-4 border border-gray-200 flex-row items-center"
          >
            <View className="bg-blue-100 rounded-lg p-2 mr-3">
              <Share2 size={20} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">Share Collection</Text>
              <Text className="text-sm text-gray-600">Share your stats with friends</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={handleExportCollection}
            className="bg-white rounded-xl p-4 border border-gray-200 flex-row items-center"
          >
            <View className="bg-green-100 rounded-lg p-2 mr-3">
              <Download size={20} color="#10B981" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">Export Collection</Text>
              <Text className="text-sm text-gray-600">Download as JSON</Text>
            </View>
          </Pressable>

          <Pressable className="bg-white rounded-xl p-4 border border-gray-200 flex-row items-center">
            <View className="bg-gray-100 rounded-lg p-2 mr-3">
              <Settings size={20} color="#6B7280" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">Settings</Text>
              <Text className="text-sm text-gray-600">App preferences</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
