import React, { useState } from 'react';
import { ArrowRight, Mail, Lock, User as UserIcon, Zap, BookOpen, GraduationCap, MapPin, Target, ChevronLeft, AtSign, BarChart2, Flame, Focus } from 'lucide-react';
import { NekoMascotFull } from './NekoMascot';

export default function Login({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [step, setStep] = useState('auth');
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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
        const cleanUsername = profileData.username.trim().toLowerCase().replace(/\s+/g, '') || formData.name.toLowerCase().replace(/\s+/g, '');

        const initialProfile = {
            name: formData.name,
            email: formData.email,
            username: cleanUsername,
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

    const FEATURES_LIST = [
        { icon: BarChart2, label: "Dashboard", color: "from-blue-500 to-cyan-400" },
        { icon: BookOpen, label: "Smart Notes", color: "from-emerald-500 to-teal-400" },
        { icon: Flame, label: "Habit Tracker", color: "from-orange-500 to-amber-400" },
        { icon: Focus, label: "Deep Focus", color: "from-purple-500 to-pink-400" },
        { icon: Zap, label: "Activities", color: "from-indigo-500 to-violet-400" },
    ];

    return (
        <div className="min-h-[100dvh] flex flex-col lg:flex-row bg-slate-50 relative overflow-x-hidden overflow-y-auto">
            {/* === LEFT PANEL: BRAND SHOWCASE === */}
            <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 flex-col items-center justify-center p-10 overflow-hidden shrink-0">
                {/* Decorative Background Elements */}
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="absolute top-10 right-10 w-28 h-28 border-2 border-white/15 rounded-full animate-spin-slow" />
                <div className="absolute bottom-14 left-14 w-16 h-16 border-2 border-white/10 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />

                <div className="relative z-10 flex flex-col items-center gap-6 max-w-sm">
                    {/* Neko Mascot */}
                    <div className="animate-float">
                        <NekoMascotFull className="w-32 h-32 drop-shadow-[0_0_30px_rgba(255,255,255,0.25)]" animate={false} />
                    </div>

                    {/* Speech bubble */}
                    <div className="relative bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl rounded-tl-none px-4 py-2.5 self-start ml-6">
                        <div className="absolute -top-2.5 left-4 w-3 h-3 bg-white/15 border-t border-l border-white/25 rotate-45 rounded-tl" />
                        <p className="text-sm font-bold text-white/90 italic">"Nyaa! Ayo semangat belajar hari ini! 🐾"</p>
                    </div>

                    {/* Brand */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2.5 mb-2">
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 border border-white/30">
                                <Zap className="h-5 w-5 text-white" />
                            </div>
                            <h1 className="text-4xl font-black text-white tracking-tight">
                                Prodi<span className="text-yellow-300">fy</span>
                            </h1>
                        </div>
                        <p className="text-indigo-200/80 text-xs font-bold tracking-[0.2em] uppercase">Student Productivity Ecosystem</p>
                    </div>

                    {/* Feature Pills */}
                    <div className="grid grid-cols-3 gap-2 mt-2 w-full">
                        {FEATURES_LIST.slice(0, 3).map((f) => (
                            <div key={f.label} className="flex flex-col items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-3 py-3 group hover:bg-white/15 transition-all">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                    <f.icon className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-[10px] font-bold text-white/80 text-center leading-tight">{f.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 w-2/3">
                        {FEATURES_LIST.slice(3).map((f) => (
                            <div key={f.label} className="flex flex-col items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-3 py-3 group hover:bg-white/15 transition-all">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                    <f.icon className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-[10px] font-bold text-white/80 text-center leading-tight">{f.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Social proof */}
                    <div className="flex items-center gap-3 mt-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2.5">
                        <div className="flex -space-x-2">
                            {['RS', 'AF', 'DM'].map((initials, i) => (
                                <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 border-2 border-white/30 flex items-center justify-center text-[9px] font-black text-white">
                                    {initials}
                                </div>
                            ))}
                        </div>
                        <p className="text-xs font-bold text-white/80">1.2K+ mahasiswa aktif</p>
                    </div>
                </div>
            </div>

            {/* === RIGHT PANEL: FORM === */}
            <div className="flex-1 flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8 md:p-12 relative">
                <div className="lg:hidden absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="lg:hidden absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="w-full max-w-md z-10">
                    {/* Mobile Brand Header */}
                    <div className="lg:hidden flex flex-col items-center mb-5 sm:mb-8 animate-fade-in-up">
                        <div className="animate-float">
                            <NekoMascotFull className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md" animate={false} />
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-1.5">
                                <Zap className="h-4 w-4 text-white" />
                            </div>
                            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Prodi<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">fy</span></h1>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-white p-5 sm:p-7 md:p-10 animate-fade-in-up relative overflow-visible">

                        {step === 'auth' ? (
                            <>
                                <div className="mb-4 sm:mb-7 text-center">
                                    <h2 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight">
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
                                        className="w-full group mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl px-4 py-4 font-bold transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 active:scale-95 text-base cursor-pointer">
                                        {isLogin ? "Masuk ke Prodify" : "Lanjut Buat Profil"}
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </form>

                                {/* Divider */}
                                <div className="flex items-center gap-4 my-6">
                                    <div className="flex-1 h-px bg-slate-200" />
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">atau</span>
                                    <div className="flex-1 h-px bg-slate-200" />
                                </div>

                                <div className="text-center">
                                    <p className="text-sm text-slate-500 font-medium">
                                        {isLogin ? "Mahasiswa baru? " : "Sudah punya akun? "}
                                        <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 font-bold hover:underline transition-all cursor-pointer">
                                            {isLogin ? "Daftar sekarang" : "Masuk di sini"}
                                        </button>
                                    </p>
                                </div>
                            </>
                ) : (
                            /* --- SETUP PROFIL AWAL (ONBOARDING) --- */
                            <div className="animate-fade-in">
                                <button
                                    onClick={() => setStep('auth')}
                                    className="inline-flex items-center gap-1.5 mb-4 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors cursor-pointer text-xs font-medium"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Kembali
                                </button>
                                <div className="mb-5 sm:mb-7 text-left sm:text-center">
                                    <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Halo, {formData.name}! ✨</h2>
                                    <p className="text-slate-500 mt-1.5 text-sm font-medium">
                                        Lengkapi profil akademikmu agar Prodify bisa menyesuaikan pengalamanmu.
                                    </p>
                                </div>

                                <form onSubmit={handleProfileSetupSubmit} className="flex flex-col gap-3.5 sm:gap-4">
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

                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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
                                        className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl px-4 py-4 font-bold transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 active:scale-95 text-base cursor-pointer">
                                        Mulai Gunakan Prodify <Zap className="w-5 h-5 fill-current text-yellow-300" />
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* Trust badges */}
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-4 sm:mt-6 text-[11px] sm:text-xs text-slate-400 font-semibold animate-fade-in-up">
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Gratis Selamanya
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            Tanpa Backend
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                            Data Lokal Aman
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}