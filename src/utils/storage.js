// src/utils/storage.js

/**
 * Mengambil dan memparsing data dari LocalStorage dengan aman (Graceful Fallback)
 */
export function getJson(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
    } catch (e) {
        console.warn(`[StuProd Storage] Gagal parsing key: ${key}, data mungkin rusak. Menggunakan default.`, e);
        return fallback; // Anti White-Screen of Death!
    }
}

/**
 * Menyimpan data ke LocalStorage dengan aman dan memicu auto-sync antar komponen
 */
export function setJson(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        // Memicu event agar komponen lain (yang pakai useEffect storage) langsung terupdate tanpa perlu reload!
        window.dispatchEvent(new Event('storage')); 
    } catch (e) {
        console.error(`[StuProd Storage] Quota penuh atau error saat menyimpan: ${key}`, e);
        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            alert("🚨 PENYIMPANAN LOKAL PENUH!\n\nHarap lakukan backup data di menu Pengaturan dan hapus catatan (Whiteboard) yang sudah tidak terpakai.");
        }
    }
}

/**
 * Mendapatkan string tanggal hari ini disesuaikan dengan zona waktu lokal (YYYY-MM-DD)
 */
export function getLocalDateKey(dateObj = new Date()) {
    const d = new Date(dateObj);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
}

/**
 * Utilitas untuk menghitung estimasi penggunaan memori LocalStorage (dalam satuan MB)
 */
export function getStorageUsageMB() {
    try {
        let total = 0;
        for (let x in localStorage) {
            if (!localStorage.hasOwnProperty(x)) continue;
            total += ((localStorage[x].length + x.length) * 2); // JavaScript strings are UTF-16 (2 bytes per char)
        }
        return (total / 1024 / 1024).toFixed(2);
    } catch (e) {
        console.error("[StuProd Storage] Gagal menghitung kuota:", e);
        return "0.00";
    }
}