import { View, Text, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import type { Bourbon } from '@/lib/db/client';
import { cn } from '@/lib/utils';

interface BourbonCardProps {
  bourbon: Bourbon;
  onPress?: () => void;
  showRarity?: boolean;
}

const rarityColors = {
  common: 'bg-gray-100 text-gray-700',
  uncommon: 'bg-blue-100 text-blue-700',
  rare: 'bg-purple-100 text-purple-700',
  allocated: 'bg-amber-100 text-amber-700',
};

export function BourbonCard({ bourbon, onPress, showRarity = true }: BourbonCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/bourbon/${bourbon.id}`);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden active:opacity-70"
    >
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
          {showRarity && (
            <View className={cn('px-2 py-1 rounded-full ml-2', rarityColors[bourbon.rarity])}>
              <Text className={cn('text-xs font-medium capitalize', rarityColors[bourbon.rarity])}>
                {bourbon.rarity}
              </Text>
            </View>
          )}
        </View>

        <Text className="text-sm text-gray-600 mb-2" numberOfLines={1}>
          {bourbon.distillery}
        </Text>

        <View className="flex-row items-center justify-between">
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

        <Text className="text-sm text-gray-600 mt-3" numberOfLines={2}>
          {bourbon.description}
        </Text>
      </View>
    </Pressable>
  );
}
