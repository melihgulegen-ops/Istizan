import type { ConfigContext, ExpoConfig } from 'expo/config';
export default function appConfig({ config }: ConfigContext): ExpoConfig {
  return {
    ...config,
    name: 'İstizan',
    slug: config.slug || 'istizan',
    version: '1.0.0',
    scheme: 'istizan',
    userInterfaceStyle: 'dark',
    orientation: 'default',
    updates: { ...config.updates, enabled: false },
    android: { ...config.android, package: config.android?.package || 'com.mgn.istizan', versionCode: 1 },
    ios: { ...config.ios, supportsTablet: true },
    plugins: Array.from(new Set([...(config.plugins || []), 'expo-router'])),
  };
}
