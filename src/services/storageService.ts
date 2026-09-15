// Storage abstraction layer with AsyncStorage and fallback memory cache
import AsyncStorage from '@react-native-async-storage/async-storage';

const memoryFallback = new Map<string, string>();

export const storageService = {
  async getItem<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const val = await AsyncStorage.getItem(key);
      if (val !== null) {
        return JSON.parse(val) as T;
      }
    } catch {
      const fallbackVal = memoryFallback.get(key);
      if (fallbackVal) {
        return JSON.parse(fallbackVal) as T;
      }
    }
    return defaultValue;
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const stringified = JSON.stringify(value);
      await AsyncStorage.setItem(key, stringified);
    } catch {
      memoryFallback.set(key, JSON.stringify(value));
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      memoryFallback.delete(key);
    }
  },
};
