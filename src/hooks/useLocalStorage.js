import { useState, useEffect } from 'react';

// Hook pintar untuk mencegah Error jika JSON rusak (Graceful Error Handling)
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`[StuProd Warn] Membaca localStorage ${key} gagal, menggunakan default.`, error);
      return initialValue; // Fallback otomatis tanpa merusak aplikasi
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        window.dispatchEvent(new Event('storage')); // Sinkronisasi antar komponen
      }
    } catch (error) {
      console.error(`[StuProd Error] Gagal menyimpan ke localStorage: ${key}`, error);
    }
  };

  return [storedValue, setValue];
}