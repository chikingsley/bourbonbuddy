import { Tabs } from 'expo-router';
import {
  BookOpen,
  Compass,
  PlusCircle,
  Users,
  User
} from '@tamagui/lucide-icons';
// Removed TamaguiProvider and config import

export default function TabsLayout() {
  return (
    // <TamaguiProvider config={config}> // This line is removed
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#F8F4F1',
            borderTopWidth: 1,
            borderTopColor: '#E4E4E7',
          },
          tabBarActiveTintColor: '#7C3AED',
          tabBarInactiveTintColor: '#71717A',
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Collection',
            tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="discover"
          options={{
            title: 'Discover',
            tabBarIcon: ({ color }) => <Compass size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: 'Add',
            tabBarIcon: ({ color }) => <PlusCircle size={32} color={color} />,
          }}
        />
        <Tabs.Screen
          name="social"
          options={{
            title: 'Social',
            tabBarIcon: ({ color }) => <Users size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <User size={24} color={color} />,
          }}
        />
      </Tabs>
    // </TamaguiProvider> // This line is removed
  );
}
