import '../global.css';
import { Tabs } from 'expo-router';
import {
  BookOpen,
  Compass,
  PlusCircle,
  Users,
  User
} from 'lucide-react-native';
import { iconWithClassName } from '@/lib/icons/iconWithClassName';

iconWithClassName(BookOpen);
iconWithClassName(Compass);
iconWithClassName(PlusCircle);
iconWithClassName(Users);
iconWithClassName(User);

export default function TabsLayout() {
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
