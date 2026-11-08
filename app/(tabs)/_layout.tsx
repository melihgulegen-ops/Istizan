import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, font, spacing } from '@/constants/theme';
export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.subtle, tabBarStyle: { height: Platform.select({ ios: insets.bottom + 60, android: insets.bottom + 60, default: 70 }), paddingTop: spacing.sm, paddingBottom: Platform.select({ ios: insets.bottom + spacing.sm, android: insets.bottom + spacing.sm, default: spacing.sm }), paddingHorizontal: spacing.md, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.border }, tabBarLabelStyle: { fontSize: font.tiny, fontWeight: '600' } }}><Tabs.Screen name="index" options={{ title: 'Genel', tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} /> }} /><Tabs.Screen name="tasks" options={{ title: 'Görevler', tabBarIcon: ({ color, size }) => <Ionicons name="checkmark-circle-outline" size={size} color={color} /> }} /><Tabs.Screen name="entries" options={{ title: 'İstizan', tabBarIcon: ({ color, size }) => <Ionicons name="wallet-outline" size={size} color={color} /> }} /><Tabs.Screen name="notes" options={{ title: 'Notlar', tabBarIcon: ({ color, size }) => <Ionicons name="reader-outline" size={size} color={color} /> }} /></Tabs>;
}
