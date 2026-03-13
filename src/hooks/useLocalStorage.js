import { useState, useEffect } from 'react';
import { getJson, setJson } from '../utils/storage';

// Hook pintar untuk mencegah Error jika JSON rusak (Graceful Error Handling)
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      return getJson(key, initialValue);
    } catch (error) {
      console.warn(`[Prodify Warn] Membaca storage ${key} gagal, menggunakan default.`, error);
      return initialValue; // Fallback otomatis tanpa merusak aplikasi
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        setJson(key, valueToStore);
      }
    } catch (error) {
      console.error(`[Prodify Error] Gagal menyimpan ke storage: ${key}`, error);
    }
  };

  return [storedValue, setValue];
}