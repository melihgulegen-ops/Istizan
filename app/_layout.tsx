import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '@/template';
import { RecordsProvider } from '@/contexts/RecordsContext';
import { colors } from '@/constants/theme';
export default function RootLayout() {
  return <AlertProvider><SafeAreaProvider><RecordsProvider><StatusBar style="light" /><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background }, headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.primary, headerTitleStyle: { color: colors.text }, headerShadowVisible: false }}><Stack.Screen name="index" /><Stack.Screen name="(tabs)" /><Stack.Screen name="editor" options={{ headerShown: true, title: 'Kayıt', presentation: 'card' }} /><Stack.Screen name="report" options={{ headerShown: true, title: 'Rapor oluştur', presentation: 'card' }} /></Stack></RecordsProvider></SafeAreaProvider></AlertProvider>;
}
