import React from 'react';

// ============================================================
//  StuProd "Neko" — Calico Cat Mascot (Pure SVG Vector)
//  Inspired by the user-provided reference image:
//    - Calico (orange/black/white patches)
//    - Blue star-print scarf
//    - Bell charm
//    - Fluffy curly tail raised high
//    - Bright cyan-green eyes, happy expression
//    - One paw raised in greeting
// ============================================================

export function NekoMascotFull({ className = "w-32 h-32", animate = true }) {
    return (
        <div className={`relative inline-block ${animate ? 'animate-float' : ''}`} style={animate ? { animationDuration: '3.5s' } : {}}>
            <svg className={className} viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">

                {/* ── TAIL (behind body, raised) ── */}
                <path d="M95 160 Q135 130 140 90 Q145 60 125 55 Q110 52 112 70 Q115 80 108 90 Q100 100 100 115 Q100 135 95 160Z"
                    fill="#F5E6C8" stroke="#C8A96E" strokeWidth="1.5" />
                <path d="M115 56 Q118 64 113 72 Q110 78 112 70"
                    fill="#D4763A" stroke="none" opacity="0.6" />
                {/* Tail tip fluffy curl */}
                <ellipse cx="130" cy="57" rx="12" ry="10" fill="#F5E6C8" stroke="#C8A96E" strokeWidth="1.5" transform="rotate(-30 130 57)" />
                <ellipse cx="131" cy="56" rx="7" ry="6" fill="white" opacity="0.7" transform="rotate(-30 131 56)" />

                {/* ── BODY ── */}
                <ellipse cx="80" cy="148" rx="42" ry="48" fill="#F5E6C8" stroke="#C8A96E" strokeWidth="1.5" />
                {/* Calico patches on body */}
                <path d="M55 125 Q60 115 75 120 Q78 130 65 135Z" fill="#D4763A" opacity="0.85" />
                <path d="M90 155 Q100 145 112 155 Q110 168 95 168Z" fill="#2C1810" opacity="0.8" />
                <path d="M48 148 Q43 138 52 130 Q62 135 58 148Z" fill="#D4763A" opacity="0.7" />
                {/* White belly */}
                <ellipse cx="80" cy="158" rx="24" ry="28" fill="white" opacity="0.7" />

                {/* ── SCARF (blue with stars) ── */}
                <path d="M46 112 Q80 106 114 112 Q112 125 80 128 Q48 125 46 112Z"
                    fill="#4A6FD4" stroke="#3558C0" strokeWidth="1" />
                {/* Knot in front */}
                <ellipse cx="80" cy="120" rx="10" ry="7" fill="#3558C0" />
                {/* Scarf stars */}
                {[[60, 114], [70, 109], [92, 110], [103, 115], [75, 122], [88, 122]].map(([x, y], i) => (
                    <path key={i}
                        d={`M${x} ${y} L${x + 1.5} ${y + 3.5} L${x + 4} ${y + 3.5} L${x + 2} ${y + 5.5} L${x + 3} ${y + 9} L${x} ${y + 7} L${x - 3} ${y + 9} L${x - 2} ${y + 5.5} L${x - 4} ${y + 3.5} L${x - 1.5} ${y + 3.5} Z`}
                        fill="#FCD34D" opacity="0.9" transform={`scale(0.5) translate(${x},${y})`}
                    />
                ))}
                {/* Star dots — simpler version */}
                <circle cx="62" cy="115" r="1.2" fill="#FCD34D" opacity="0.9" />
                <circle cx="74" cy="111" r="1.2" fill="#FCD34D" opacity="0.9" />
                <circle cx="95" cy="112" r="1.2" fill="#FCD34D" opacity="0.9" />
                <circle cx="105" cy="117" r="1.2" fill="#FCD34D" opacity="0.9" />

                {/* Bell charm */}
                <circle cx="80" cy="128" r="5" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
                <ellipse cx="80" cy="126" rx="3" ry="2" fill="white" opacity="0.4" />
                <line x1="80" y1="131" x2="80" y2="134" stroke="#D97706" strokeWidth="1" />

                {/* ── LEFT ARM / PAW (raised greeting) ── */}
                <path d="M42 128 Q28 108 32 88 Q36 72 48 76 Q56 80 52 96 Q48 110 50 122Z"
                    fill="#F5E6C8" stroke="#C8A96E" strokeWidth="1.5" />
                {/* Orange patches on arm */}
                <path d="M34 92 Q38 82 46 86 Q44 96 36 96Z" fill="#D4763A" opacity="0.7" />
                {/* Paw pads */}
                <ellipse cx="38" cy="80" rx="9" ry="10" fill="#F5E6C8" stroke="#C8A96E" strokeWidth="1.2" />
                <ellipse cx="38" cy="82" rx="5" ry="4.5" fill="#F5B8B8" opacity="0.6" />
                <ellipse cx="33" cy="77" rx="2.5" ry="2" fill="#F5B8B8" opacity="0.5" />
                <ellipse cx="44" cy="77" rx="2.5" ry="2" fill="#F5B8B8" opacity="0.5" />
                <ellipse cx="31" cy="84" rx="2.5" ry="2" fill="#F5B8B8" opacity="0.5" />
                <ellipse cx="45" cy="84" rx="2.5" ry="2" fill="#F5B8B8" opacity="0.5" />

                {/* ── RIGHT ARM (relaxed/down) ── */}
                <path d="M118 128 Q128 118 126 102 Q124 90 114 92 Q106 94 108 110 Q110 122 112 128Z"
                    fill="#F5E6C8" stroke="#C8A96E" strokeWidth="1.5" />
                {/* Paw */}
                <ellipse cx="122" cy="92" rx="8" ry="9" fill="#F5E6C8" stroke="#C8A96E" strokeWidth="1.2" />
                <ellipse cx="122" cy="94" rx="4.5" ry="4" fill="#F5B8B8" opacity="0.6" />

                {/* ── FEET ── */}
                <ellipse cx="65" cy="192" rx="16" ry="9" fill="#F5E6C8" stroke="#C8A96E" strokeWidth="1.2" />
                <ellipse cx="95" cy="192" rx="16" ry="9" fill="#F5E6C8" stroke="#C8A96E" strokeWidth="1.2" />
                {/* Toe beans */}
                <ellipse cx="65" cy="195" rx="8" ry="4" fill="#F5B8B8" opacity="0.4" />
                <ellipse cx="95" cy="195" rx="8" ry="4" fill="#F5B8B8" opacity="0.4" />

                {/* ── HEAD ── */}
                <circle cx="80" cy="72" r="42" fill="#F5E6C8" stroke="#C8A96E" strokeWidth="1.5" />
                {/* Calico patches on head */}
                <path d="M58 50 Q65 38 78 44 Q80 56 65 60Z" fill="#D4763A" opacity="0.85" />
                <path d="M88 42 Q98 36 108 44 Q106 58 92 55Z" fill="#2C1810" opacity="0.8" />
                <path d="M48 72 Q44 60 54 56 Q62 62 58 74Z" fill="#D4763A" opacity="0.7" />
                <path d="M100 80 Q108 70 116 76 Q114 88 104 85Z" fill="#2C1810" opacity="0.65" />
                {/* White muzzle area */}
                <ellipse cx="80" cy="82" rx="22" ry="16" fill="white" opacity="0.75" />

                {/* ── EARS ── */}
                {/* Left ear */}
                <path d="M48 38 Q44 12 62 18 Q66 32 58 44Z" fill="#F5E6C8" stroke="#C8A96E" strokeWidth="1.2" />
                <path d="M50 36 Q47 18 61 22 Q64 30 57 40Z" fill="#F9B8B8" opacity="0.7" />
                {/* Right ear */}
                <path d="M112 38 Q116 12 98 18 Q94 32 102 44Z" fill="#F5E6C8" stroke="#C8A96E" strokeWidth="1.2" />
                <path d="M110 36 Q113 18 99 22 Q96 30 103 40Z" fill="#F9B8B8" opacity="0.7" />
                {/* Orange tufts on ears */}
                <path d="M50 32 Q48 20 58 24" stroke="#D4763A" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
                <path d="M110 32 Q112 20 102 24" stroke="#D4763A" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />

                {/* ── EYES ── */}
                {/* Left eye */}
                <ellipse cx="64" cy="70" rx="10" ry="12" fill="white" />
                <ellipse cx="64" cy="71" rx="7" ry="9" fill="#4DD0B8" />
                <ellipse cx="64" cy="72" rx="4" ry="6" fill="#1B3A4B" />
                <circle cx="62" cy="69" r="2" fill="white" opacity="0.9" />
                <circle cx="66" cy="74" r="1" fill="white" opacity="0.6" />
                {/* Right eye */}
                <ellipse cx="96" cy="70" rx="10" ry="12" fill="white" />
                <ellipse cx="96" cy="71" rx="7" ry="9" fill="#4DD0B8" />
                <ellipse cx="96" cy="72" rx="4" ry="6" fill="#1B3A4B" />
                <circle cx="94" cy="69" r="2" fill="white" opacity="0.9" />
                <circle cx="98" cy="74" r="1" fill="white" opacity="0.6" />
                {/* Eye shine sparkle */}
                <path d="M59 66 L60 68 L62 68 L60.5 69.5 L61 72 L59 70 L57 72 L57.5 69.5 L56 68 L58 68Z" fill="white" opacity="0.5" transform="scale(0.6) translate(40,44)" />

                {/* ── NOSE & MOUTH ── */}
                <path d="M77 83 L80 80 L83 83" fill="#F5A0A0" stroke="#E88080" strokeWidth="0.5" />
                {/* Happy mouth */}
                <path d="M73 87 Q80 95 87 87" stroke="#C47070" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                <path d="M80 83 L80 87" stroke="#C47070" strokeWidth="1.5" strokeLinecap="round" />

                {/* ── WHISKERS ── */}
                <line x1="40" y1="80" x2="64" y2="84" stroke="#C8A96E" strokeWidth="1" opacity="0.7" />
                <line x1="40" y1="84" x2="64" y2="86" stroke="#C8A96E" strokeWidth="1" opacity="0.7" />
                <line x1="40" y1="88" x2="63" y2="88" stroke="#C8A96E" strokeWidth="1" opacity="0.7" />
                <line x1="120" y1="80" x2="96" y2="84" stroke="#C8A96E" strokeWidth="1" opacity="0.7" />
                <line x1="120" y1="84" x2="96" y2="86" stroke="#C8A96E" strokeWidth="1" opacity="0.7" />
                <line x1="120" y1="88" x2="97" y2="88" stroke="#C8A96E" strokeWidth="1" opacity="0.7" />

                {/* ── HEAD HAIR / FUR tufts ── */}
                <path d="M68 30 Q64 20 70 26" stroke="#2C1810" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M78 28 Q76 16 80 24" stroke="#2C1810" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M88 30 Q90 18 86 26" stroke="#D4763A" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
        </div>
    );
}

// Compact version for sidebar, 60x60 viewBox
export function NekoMascotMini({ className = "w-10 h-10" }) {
    return (
        <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Tail */}
            <path d="M52 60 Q70 48 72 32 Q73 22 64 22 Q58 20 59 30 Q60 36 56 42 Q52 48 52 55Z"
                fill="#F5E6C8" stroke="#C8A96E" strokeWidth="0.8" />
            <ellipse cx="67" cy="22" rx="7" ry="6" fill="white" stroke="#C8A96E" strokeWidth="0.8" transform="rotate(-20 67 22)" />
            {/* Body */}
            <ellipse cx="40" cy="56" rx="24" ry="24" fill="#F5E6C8" stroke="#C8A96E" strokeWidth="0.8" />
            <path d="M28 46 Q32 40 40 43 Q41 49 32 52Z" fill="#D4763A" opacity="0.8" />
            <path d="M48 60 Q54 54 62 60 Q61 68 50 68Z" fill="#2C1810" opacity="0.75" />
            <ellipse cx="40" cy="62" rx="14" ry="14" fill="white" opacity="0.6" />
            {/* Scarf */}
            <path d="M20 41 Q40 37 60 41 Q59 47 40 49 Q21 47 20 41Z" fill="#4A6FD4" stroke="#3558C0" strokeWidth="0.6" />
            <ellipse cx="40" cy="45" rx="6" ry="4" fill="#3558C0" />
            <circle cx="24" cy="42" r="0.8" fill="#FCD34D" />
            <circle cx="34" cy="39" r="0.8" fill="#FCD34D" />
            <circle cx="50" cy="40" r="0.8" fill="#FCD34D" />
            <circle cx="57" cy="43" r="0.8" fill="#FCD34D" />
            {/* Bell */}
            <circle cx="40" cy="49" r="3" fill="#F59E0B" stroke="#D97706" strokeWidth="0.6" />
            {/* Left arm raised */}
            <path d="M18 44 Q10 32 12 22 Q14 16 20 18 Q24 20 22 30 Q20 38 20 42Z"
                fill="#F5E6C8" stroke="#C8A96E" strokeWidth="0.8" />
            <ellipse cx="14" cy="18" rx="6" ry="6" fill="#F5E6C8" stroke="#C8A96E" strokeWidth="0.8" />
            <ellipse cx="14" cy="20" rx="3.5" ry="3" fill="#F5B8B8" opacity="0.6" />
            {/* Head */}
            <circle cx="40" cy="26" r="22" fill="#F5E6C8" stroke="#C8A96E" strokeWidth="0.8" />
            {/* Patches */}
            <path d="M28 14 Q32 8 40 12 Q40 20 30 20Z" fill="#D4763A" opacity="0.85" />
            <path d="M46 10 Q52 7 56 13 Q54 22 46 19Z" fill="#2C1810" opacity="0.75" />
            <path d="M20 26 Q18 18 24 16 Q28 20 26 28Z" fill="#D4763A" opacity="0.7" />
            {/* Muzzle */}
            <ellipse cx="40" cy="32" rx="12" ry="8" fill="white" opacity="0.7" />
            {/* Ears */}
            <path d="M24 12 Q21 2 30 6 Q32 12 28 18Z" fill="#F5E6C8" stroke="#C8A96E" strokeWidth="0.8" />
            <path d="M25 11 Q23 4 29 7 Q31 11 27 16Z" fill="#F9B8B8" opacity="0.7" />
            <path d="M56 12 Q59 2 50 6 Q48 12 52 18Z" fill="#F5E6C8" stroke="#C8A96E" strokeWidth="0.8" />
            <path d="M55 11 Q57 4 51 7 Q49 11 53 16Z" fill="#F9B8B8" opacity="0.7" />
            {/* Eyes */}
            <ellipse cx="33" cy="25" rx="5.5" ry="6.5" fill="white" />
            <ellipse cx="33" cy="25.5" rx="3.5" ry="4.5" fill="#4DD0B8" />
            <ellipse cx="33" cy="26" rx="2" ry="3" fill="#1B3A4B" />
            <circle cx="32" cy="24" r="1.2" fill="white" opacity="0.9" />
            <ellipse cx="47" cy="25" rx="5.5" ry="6.5" fill="white" />
            <ellipse cx="47" cy="25.5" rx="3.5" ry="4.5" fill="#4DD0B8" />
            <ellipse cx="47" cy="26" rx="2" ry="3" fill="#1B3A4B" />
            <circle cx="46" cy="24" r="1.2" fill="white" opacity="0.9" />
            {/* Nose & mouth */}
            <path d="M38 32 L40 30 L42 32" fill="#F5A0A0" />
            <path d="M36 35 Q40 40 44 35" stroke="#C47070" strokeWidth="1" fill="none" strokeLinecap="round" />
            <line x1="40" y1="32" x2="40" y2="35" stroke="#C47070" strokeWidth="0.8" strokeLinecap="round" />
            {/* Whiskers */}
            <line x1="16" y1="30" x2="30" y2="33" stroke="#C8A96E" strokeWidth="0.5" opacity="0.7" />
            <line x1="16" y1="33" x2="30" y2="35" stroke="#C8A96E" strokeWidth="0.5" opacity="0.7" />
            <line x1="64" y1="30" x2="50" y2="33" stroke="#C8A96E" strokeWidth="0.5" opacity="0.7" />
            <line x1="64" y1="33" x2="50" y2="35" stroke="#C8A96E" strokeWidth="0.5" opacity="0.7" />
            {/* Hair tufts */}
            <path d="M36 6 Q34 0 37 4" stroke="#2C1810" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M40 4 Q39 -2 41 2" stroke="#2C1810" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M44 6 Q46 0 43 4" stroke="#D4763A" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </svg>
    );
}

// ============================================================
//  Speech Bubble Wrapper — renders Neko + a speech bubble
//  pointing from the cat's mouth area
// ============================================================
export function NekoSpeechBubble({
    message = "Hai! Semangat ya! 🐾",
    size = "mini", // "mini" | "full"
    className = "",
    mascotClassName = "",
}) {
    const MascotComponent = size === "full" ? NekoMascotFull : NekoMascotMini;
    const mcls = size === "full" ? "w-24 h-24" : "w-14 h-14";

    return (
        <div className={`flex items-end gap-3 ${className}`}>
            <MascotComponent className={mascotClassName || mcls} />
            {/* Speech bubble */}
            <div className="relative bg-white border border-indigo-100 rounded-2xl rounded-bl-none px-4 py-2.5 shadow-lg max-w-xs">
                {/* Tail of bubble */}
                <div className="absolute -bottom-3 left-3 w-4 h-4 bg-white border-b border-l border-indigo-100 rotate-45" />
                <p className="text-sm font-bold text-indigo-700 leading-snug relative z-10">{message}</p>
            </div>
        </div>
    );
}
