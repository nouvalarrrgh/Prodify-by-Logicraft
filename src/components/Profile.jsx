import React, { useState } from 'react';
import { User, Mail, GraduationCap, MapPin, Camera, Save, Phone, AtSign } from 'lucide-react';

const getInitialProfile = () => {
    const baseProfile = {
        name: '',
        username: '',
        email: '',
        university: '',
        major: '',
        location: '',
        phone: '',
        portfolio: '',
        bio: '',
        avatar: ''
    };

    const savedInfo = localStorage.getItem('stuprod_profileInfo');
    const userSession = JSON.parse(localStorage.getItem('stuprod_user') || '{}');

    if (savedInfo) {
        const parsed = JSON.parse(savedInfo);
        if (userSession.name) parsed.name = userSession.name;
        if (userSession.email) parsed.email = userSession.email;
        if (!parsed.username) parsed.username = (userSession.name || 'student').toLowerCase().replace(/\s+/g, '');
        return { ...baseProfile, ...parsed };
    }

    if (userSession.name) {
        return {
            ...baseProfile,
            name: userSession.name,
            username: userSession.name.toLowerCase().replace(/\s+/g, ''),
            email: userSession.email || 'mahasiswa@kampus.ac.id',
            university: 'Belum diisi',
            major: 'Belum diisi'
        };
    }

    return baseProfile;
};

export default function Profile() {
    const [profile, setProfile] = useState(getInitialProfile);
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        // Sanitasi username jika diedit
        const cleanedProfile = { ...profile, username: profile.username.trim().toLowerCase().replace(/\s+/g, '') };
        localStorage.setItem('stuprod_profileInfo', JSON.stringify(cleanedProfile));

        const userSession = JSON.parse(localStorage.getItem('stuprod_user') || '{}');
        userSession.name = cleanedProfile.name;
        localStorage.setItem('stuprod_user', JSON.stringify(userSession));

        setProfile(cleanedProfile);
        setIsEditing(false);
        window.dispatchEvent(new Event('storage'));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2.5 * 1024 * 1024) {
                alert("Ukuran gambar terlalu besar! Maksimal 2.5MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                const updatedProfile = { ...profile, avatar: base64String };
                setProfile(updatedProfile);
                localStorage.setItem('stuprod_profileInfo', JSON.stringify(updatedProfile));
                window.dispatchEvent(new Event('storage'));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in-up pb-20 lg:pb-0 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm transition-colors">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Profil Mahasiswa</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Kelola informasi pribadi dan identitas akademismu.</p>
                </div>
                <button
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md cursor-pointer ${isEditing
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                        }`}
                >
                    {isEditing ? <><Save className="w-4 h-4" /> Simpan Profil</> : 'Edit Profil'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Avatar Section */}
                <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md rounded-[2rem] border border-slate-200 dark:border-slate-700/60 p-8 flex flex-col items-center justify-center gap-4 shadow-sm md:col-span-1 relative overflow-hidden transition-colors h-fit">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-500/10 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none" />

                    <div className="relative group z-10">
                        <img
                            src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name || 'Student'}&background=4F46E5&color=fff&size=512&bold=true`}
                            alt="Profile"
                            className="w-32 h-32 rounded-full ring-4 ring-indigo-50 dark:ring-indigo-900 shadow-xl object-cover transition-transform group-hover:scale-105"
                        />
                        <label
                            className="absolute bottom-1 right-1 bg-white dark:bg-slate-800 p-2.5 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all z-20 text-slate-500 dark:text-slate-400 group-hover:scale-110"
                            title="Ganti Foto Profil"
                        >
                            <Camera className="w-4 h-4" />
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                    </div>
                    <div className="text-center z-10 mt-2">
                        <h3 className="text-xl font-black text-slate-800 dark:text-white">{profile.name || 'Nama Belum Diatur'}</h3>
                        <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1 flex items-center justify-center gap-1">
                            <AtSign className="w-3.5 h-3.5" /> {profile.username || 'username'}
                        </p>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 mt-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full shadow-sm">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            Mahasiswa Aktif
                        </span>
                    </div>
                </div>

                {/* Details Form */}
                <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md rounded-[2rem] border border-slate-200 dark:border-slate-700/60 p-6 md:p-8 shadow-sm md:col-span-2 transition-colors">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-indigo-400" /> Nama Lengkap
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 disabled:opacity-70 disabled:bg-slate-50 dark:disabled:bg-slate-800/30 transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <AtSign className="w-3.5 h-3.5 text-indigo-400" /> Username
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                                <input
                                    type="text"
                                    name="username"
                                    value={profile.username}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl pl-9 pr-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 disabled:opacity-70 disabled:bg-slate-50 dark:disabled:bg-slate-800/30 transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-indigo-400" /> Alamat Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleChange}
                                disabled={true}
                                className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 outline-none cursor-not-allowed"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> Universitas / Institut
                            </label>
                            <input
                                type="text"
                                name="university"
                                value={profile.university}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 disabled:opacity-70 disabled:bg-slate-50 dark:disabled:bg-slate-800/30 transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Lokasi / Kota
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={profile.location}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 disabled:opacity-70 disabled:bg-slate-50 dark:disabled:bg-slate-800/30 transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-indigo-400" /> Nomor Telepon
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={profile.phone}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 disabled:opacity-70 disabled:bg-slate-50 dark:disabled:bg-slate-800/30 transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2 sm:col-span-2">
                            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                Biografi / Deskripsi Diri
                            </label>
                            <textarea
                                name="bio"
                                value={profile.bio}
                                onChange={handleChange}
                                disabled={!isEditing}
                                rows={3}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-4 text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:ring-2 ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 disabled:opacity-70 disabled:bg-slate-50 dark:disabled:bg-slate-800/30 transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}