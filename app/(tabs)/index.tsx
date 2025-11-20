import { Text, View } from "react-native";

export default function CollectionScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold mb-2 text-gray-900">
        My Bourbon Collection
      </Text>
      <Text className="text-base text-gray-600">
        Start adding your favorite bourbons!
      </Text>
    </View>
  );
}
