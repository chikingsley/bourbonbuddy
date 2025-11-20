import '../global.css';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Tabs } from 'expo-router';
import {
  BookOpen,
  Compass,
  PlusCircle,
  Users,
  User
} from 'lucide-react-native';
import { iconWithClassName } from '@/lib/icons/iconWithClassName';
import { initDatabase } from '@/lib/db/client';

iconWithClassName(BookOpen);
iconWithClassName(Compass);
iconWithClassName(PlusCircle);
iconWithClassName(Users);
iconWithClassName(User);

export default function TabsLayout() {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initDatabase();
        setIsDbReady(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    setupDatabase();
  }, []);

  if (!isDbReady) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }
  return (
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
        name="(tabs)/index"
        options={{
          title: 'Collection',
          tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(tabs)/discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color }) => <Compass size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(tabs)/add"
        options={{
          title: 'Add',
          tabBarIcon: ({ color }) => <PlusCircle size={32} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(tabs)/social"
        options={{
          title: 'Social',
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(tabs)/profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
