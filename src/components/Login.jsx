import React, { useState } from 'react';
import { ArrowRight, Mail, Lock, User as UserIcon, Star, Zap, BookOpen, GraduationCap, MapPin, Target, ChevronLeft, AtSign } from 'lucide-react';
import { NekoMascotFull } from './NekoMascot';

const StudentHeroIllustration = () => (
    <svg viewBox="0 0 380 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[380px] drop-shadow-2xl">
        <rect x="30" y="220" width="320" height="12" rx="6" fill="#E2E8F0" />
        <rect x="60" y="232" width="12" height="60" rx="4" fill="#CBD5E1" />
        <rect x="308" y="232" width="12" height="60" rx="4" fill="#CBD5E1" />
        <rect x="90" y="195" width="200" height="28" rx="8" fill="#94A3B8" />
        <rect x="102" y="198" width="176" height="22" rx="4" fill="#64748B" />
        <ellipse cx="190" cy="222" rx="8" ry="2" fill="#7C3AED" />
        <rect x="95" y="80" width="190" height="120" rx="10" fill="#1E293B" />
        <rect x="101" y="86" width="178" height="108" rx="6" fill="#0F172A" />
        <rect x="110" y="98" width="80" height="5" rx="2" fill="#4F46E5" opacity="0.8" />
        <rect x="110" y="110" width="120" height="5" rx="2" fill="#06B6D4" opacity="0.6" />
        <rect x="118" y="122" width="60" height="5" rx="2" fill="#818CF8" opacity="0.8" />
        <rect x="118" y="134" width="90" height="5" rx="2" fill="#34D399" opacity="0.7" />
        <rect x="110" y="146" width="70" height="5" rx="2" fill="#F59E0B" opacity="0.8" />
        <rect x="110" y="158" width="110" height="5" rx="2" fill="#4F46E5" opacity="0.6" />
        <rect x="118" y="170" width="50" height="5" rx="2" fill="#F472B6" opacity="0.8" />
        <rect x="172" y="170" width="3" height="10" rx="1" fill="white" opacity="0.9" />
        <ellipse cx="300" cy="210" rx="40" ry="18" fill="#F1F5F9" />
        <rect x="280" y="140" width="8" height="85" rx="4" fill="#CBD5E1" />
        <rect x="265" y="160" width="70" height="55" rx="20" fill="#4F46E5" />
        <circle cx="300" cy="135" r="28" fill="#FBBF24" />
        <path d="M273 125 Q280 100 300 108 Q320 100 327 125" fill="#1E293B" />
        <circle cx="291" cy="132" r="5" fill="white" />
        <circle cx="309" cy="132" r="5" fill="white" />
        <circle cx="292" cy="133" r="3" fill="#1E293B" />
        <circle cx="310" cy="133" r="3" fill="#1E293B" />
        <circle cx="293" cy="132" r="1" fill="white" />
        <circle cx="311" cy="132" r="1" fill="white" />
        <path d="M292 144 Q300 150 308 144" stroke="#92400E" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M272 185 Q230 205 180 215" stroke="#FBBF24" strokeWidth="14" strokeLinecap="round" />
        <path d="M328 185 Q340 200 340 220" stroke="#4F46E5" strokeWidth="14" strokeLinecap="round" />
        <rect x="30" y="190" width="50" height="12" rx="4" fill="#EF4444" />
        <rect x="33" y="178" width="44" height="12" rx="4" fill="#4F46E5" />
        <rect x="36" y="166" width="38" height="12" rx="4" fill="#10B981" />
        <rect x="340" y="198" width="24" height="24" rx="6" fill="white" stroke="#E2E8F0" strokeWidth="2" />
        <path d="M364 206 Q374 206 374 214 Q374 222 364 222" stroke="#E2E8F0" strokeWidth="2" fill="none" />
        <ellipse cx="352" cy="200" rx="8" ry="3" fill="#D97706" opacity="0.4" />
        <path d="M50 60 L53 70 L63 70 L55 76 L58 86 L50 80 L42 86 L45 76 L37 70 L47 70 Z" fill="#FCD34D" opacity="0.6" className="animate-pulse" />
        <path d="M340 50 L342 57 L349 57 L343 61 L346 68 L340 64 L334 68 L337 61 L331 57 L338 57 Z" fill="#A78BFA" opacity="0.7" className="animate-pulse" style={{ animationDelay: '1s' }} />
    </svg>
);

export default function Login({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [step, setStep] = useState('auth');
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    // DITAMBAHKAN: field username pada state profileData
    const [profileData, setProfileData] = useState({ username: '', university: '', major: '', semester: '', targetIpk: '' });

    const handleAuthSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            if (formData.email && formData.password) {
                const storedProfile = JSON.parse(localStorage.getItem('stuprod_profileInfo') || '{}');
                const userName = storedProfile.name || formData.email.split('@')[0];
                const user = { name: userName, email: formData.email, token: 'mock-jwt-token-123' };
                localStorage.setItem('stuprod_user', JSON.stringify(user));
                onLogin(user);
            }
        } else {
            if (formData.name && formData.email && formData.password) {
                setStep('setup');
            }
        }
    };

    const handleProfileSetupSubmit = (e) => {
        e.preventDefault();
        // Sanitasi username (hapus spasi & ubah ke lowercase)
        const cleanUsername = profileData.username.trim().toLowerCase().replace(/\s+/g, '') || formData.name.toLowerCase().replace(/\s+/g, '');

        const initialProfile = {
            name: formData.name,
            email: formData.email,
            username: cleanUsername, // Simpan username
            university: profileData.university || 'Belum diisi',
            major: profileData.major || 'Belum diisi',
            location: 'Indonesia',
            phone: '-',
            portfolio: '',
            bio: `Mahasiswa semester ${profileData.semester || '-'} yang sedang berjuang mencapai IPK ${profileData.targetIpk || '-'}.`
        };

        localStorage.setItem('stuprod_profileInfo', JSON.stringify(initialProfile));

        const user = { name: formData.name, email: formData.email, token: 'mock-jwt-token-abc' };
        localStorage.setItem('stuprod_user', JSON.stringify(user));
        onLogin(user);
    };

    const handleAuthChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });

    return (
        <div className="min-h-[100dvh] flex flex-col lg:flex-row bg-slate-50 relative overflow-hidden">
            {/* === LEFT PANEL: HERO ILLUSTRATION === */}
            <div className="hidden lg:flex lg:flex-1 relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 flex-col items-center justify-center p-12 overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                <div className="absolute top-10 right-10 w-32 h-32 border-2 border-white/20 rounded-full animate-spin-slow" />
                <div className="absolute bottom-16 left-16 w-20 h-20 border-2 border-white/15 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />

                <div className="relative z-10 text-center flex flex-col items-center gap-6 max-w-md">
                    <div className="animate-float">
                        <NekoMascotFull className="w-36 h-36 drop-shadow-[0_0_30px_rgba(255,255,255,0.25)]" animate={false} />
                    </div>
                    <div className="relative bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl rounded-tl-none px-4 py-2.5 self-start ml-4">
                        <div className="absolute -top-3 left-4 w-4 h-4 bg-white/20 border-t border-l border-white/30 rotate-45 rounded-tl" />
                        <p className="text-sm font-bold text-white italic">"Nyaa! Ayo semangat belajar hari ini! 🐾"</p>
                    </div>

                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tight mb-2">
                            Stu<span className="text-yellow-300">Prod</span><span className="text-yellow-300">.</span>
                        </h1>
                        <p className="text-indigo-200 text-sm font-bold tracking-widest uppercase">Student Productivity Ecosystem</p>
                    </div>

                    <div className="animate-float-slow">
                        <StudentHeroIllustration />
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 mt-2">
                        {[
                            { icon: <BookOpen className="w-3.5 h-3.5" />, label: "Notes" },
                            { icon: <Zap className="w-3.5 h-3.5" />, label: "Focus" },
                            { icon: <Star className="w-3.5 h-3.5" />, label: "Habits" },
                        ].map((f) => (
                            <div key={f.label} className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                                {f.icon}<span>{f.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* === RIGHT PANEL: FORM === */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
                <div className="lg:hidden absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="lg:hidden absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="w-full max-w-md z-10">
                    <div className="lg:hidden flex flex-col items-center mb-8 animate-fade-in-up">
                        <div className="animate-float">
                            <NekoMascotFull className="w-20 h-20 drop-shadow-md" animate={false} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 mt-3">StuProd<span className="text-indigo-600">.</span></h1>
                    </div>

                    <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-white p-8 md:p-10 animate-fade-in-up relative overflow-hidden">

                        {step === 'auth' ? (
                            <>
                                <div className="mb-8 text-center">
                                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                                        {isLogin ? "Selamat Kembali 👋" : "Bergabung Sekarang 🚀"}
                                    </h2>
                                    <p className="text-slate-500 mt-1.5 text-sm font-medium">
                                        {isLogin ? "Masuk untuk melanjutkan progresmu." : "Kelola kehidupan kampusmu lebih teratur."}
                                    </p>
                                </div>

                                <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
                                    {!isLogin && (
                                        <div className="relative group">
                                            <input type="text" name="name" required placeholder="Nama Panggilan"
                                                className="w-full bg-slate-50 border border-slate-200 group-focus-within:border-indigo-400 rounded-2xl px-4 py-3.5 pl-12 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                                                onChange={handleAuthChange} />
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><UserIcon className="w-5 h-5" /></div>
                                        </div>
                                    )}

                                    <div className="relative group">
                                        <input type="email" name="email" required placeholder="Alamat Email"
                                            className="w-full bg-slate-50 border border-slate-200 group-focus-within:border-indigo-400 rounded-2xl px-4 py-3.5 pl-12 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                                            onChange={handleAuthChange} />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Mail className="w-5 h-5" /></div>
                                    </div>

                                    <div className="relative group">
                                        <input type="password" name="password" required placeholder="Kata Sandi"
                                            className="w-full bg-slate-50 border border-slate-200 group-focus-within:border-indigo-400 rounded-2xl px-4 py-3.5 pl-12 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                                            onChange={handleAuthChange} />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock className="w-5 h-5" /></div>
                                    </div>

                                    {isLogin && (
                                        <div className="flex justify-end">
                                            <button type="button" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                                                Lupa password?
                                            </button>
                                        </div>
                                    )}

                                    <button type="submit"
                                        className="w-full group mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-4 py-4 font-bold transition-all shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 active:scale-95 text-base">
                                        {isLogin ? "Masuk ke StuProd" : "Lanjut Buat Profil"}
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </form>

                                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                                    <p className="text-sm text-slate-500 font-medium">
                                        {isLogin ? "Mahasiswa baru? " : "Sudah punya akun? "}
                                        <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 font-bold hover:underline transition-all">
                                            {isLogin ? "Daftar sekarang" : "Masuk di sini"}
                                        </button>
                                    </p>
                                </div>
                            </>
                        ) : (
                            /* --- SETUP PROFIL AWAL (ONBOARDING) --- */
                            <div className="animate-fade-in">
                                <button onClick={() => setStep('auth')} className="absolute top-6 left-6 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="mb-8 text-center mt-2">
                                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Halo, {formData.name}! ✨</h2>
                                    <p className="text-slate-500 mt-1.5 text-sm font-medium">
                                        Lengkapi profil akademikmu agar StuProd bisa menyesuaikan pengalamanmu.
                                    </p>
                                </div>

                                <form onSubmit={handleProfileSetupSubmit} className="flex flex-col gap-4">
                                    {/* INPUT USERNAME BARU */}
                                    <div className="relative group">
                                        <input type="text" name="username" required placeholder="Username unik (misal: nouval_ui)"
                                            className="w-full bg-slate-50 border border-slate-200 group-focus-within:border-indigo-400 rounded-2xl px-4 py-3.5 pl-12 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-800 placeholder:text-slate-400 font-medium text-sm"
                                            onChange={handleProfileChange} />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><AtSign className="w-5 h-5" /></div>
                                    </div>

                                    <div className="relative group">
                                        <input type="text" name="university" required placeholder="Nama Kampus / Universitas"
                                            className="w-full bg-slate-50 border border-slate-200 group-focus-within:border-indigo-400 rounded-2xl px-4 py-3.5 pl-12 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-800 placeholder:text-slate-400 font-medium text-sm"
                                            onChange={handleProfileChange} />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><GraduationCap className="w-5 h-5" /></div>
                                    </div>

                                    <div className="relative group">
                                        <input type="text" name="major" required placeholder="Jurusan / Program Studi"
                                            className="w-full bg-slate-50 border border-slate-200 group-focus-within:border-indigo-400 rounded-2xl px-4 py-3.5 pl-12 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-800 placeholder:text-slate-400 font-medium text-sm"
                                            onChange={handleProfileChange} />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><BookOpen className="w-5 h-5" /></div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="relative group flex-1">
                                            <input type="number" name="semester" placeholder="Semester" min="1" max="14"
                                                className="w-full bg-slate-50 border border-slate-200 group-focus-within:border-indigo-400 rounded-2xl px-4 py-3.5 pl-11 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-800 placeholder:text-slate-400 font-medium text-sm"
                                                onChange={handleProfileChange} />
                                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><MapPin className="w-4 h-4" /></div>
                                        </div>
                                        <div className="relative group flex-1">
                                            <input type="number" name="targetIpk" placeholder="Target IPK" step="0.01" min="0" max="4.00"
                                                className="w-full bg-slate-50 border border-slate-200 group-focus-within:border-indigo-400 rounded-2xl px-4 py-3.5 pl-11 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-800 placeholder:text-slate-400 font-medium text-sm"
                                                onChange={handleProfileChange} />
                                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><Target className="w-4 h-4" /></div>
                                        </div>
                                    </div>

                                    <button type="submit"
                                        className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl px-4 py-4 font-bold transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 active:scale-95 text-base">
                                        Mulai Gunakan StuProd <Zap className="w-5 h-5 fill-current text-yellow-300" />
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center gap-6 mt-6 text-xs text-slate-400 font-medium animate-fade-in-up">
                        <span>✦ Gratis Selamanya</span>
                        <span>✦ Tanpa Backend</span>
                        <span>✦ Data Lokal Aman</span>
                    </div>
                </div>
            </div>
        </div>
    );
}