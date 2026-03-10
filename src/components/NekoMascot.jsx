import React from 'react';

/**
 * KOMPONEN MASKOT UTAMA (FULL)
 * Digunakan di Halaman Login & Evaluasi Dashboard
 */
export const NekoMascotFull = ({ className, animate }) => {
    return (
        <img
            src="/IMG-20260303-WA0022.png"
            alt="StuProd Mascot"
            draggable="false"
            // FIX: Titik tengah emas (Sweet Spot). Tidak terlalu raksasa, tidak terlalu mini.
            // w-44 h-44 untuk HP, md:w-56 md:h-56 untuk Laptop/PC.
            className={`w-44 h-44 md:w-56 md:h-56 object-contain object-center transition-all pointer-events-none select-none mix-blend-multiply dark:mix-blend-screen ${className} ${animate !== false ? 'animate-float' : ''}`}
        />
    );
};

/**
 * KOMPONEN MASKOT MINI 
 * Digunakan di Modal Evaluasi, ZenNotes, dll.
 */
export const NekoMascotMini = ({ className }) => {
    return (
        <img
            src="/IMG-20260303-WA0022.png"
            alt="StuProd Mascot Mini"
            draggable="false"
            // Trik mix-blend untuk memudarkan background putih bawaan PNG
            className={`object-contain transition-all pointer-events-none select-none mix-blend-multiply dark:mix-blend-screen ${className}`}
        />
    );
};

export default { NekoMascotFull, NekoMascotMini };