import React, { useState, useEffect } from 'react';
import { User, Mail, GraduationCap, MapPin, Camera, Save, Phone, Link as LinkIcon } from 'lucide-react';

export default function Profile() {
    const [profile, setProfile] = useState({
        name: 'Nouval',
        email: 'nouval@student.univ.id',
        university: 'Universitas Indonesia',
        major: 'Computer Science',
        location: 'Jakarta, Indonesia',
        phone: '+62 812 3456 7890',
        portfolio: 'github.com/nouval',
        bio: 'Passionate student developer exploring the intersection of productivity and technology.'
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const savedInfo = localStorage.getItem('stuprod_profileInfo');
        if (savedInfo) {
            setProfile(JSON.parse(savedInfo));
        }
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        localStorage.setItem('stuprod_profileInfo', JSON.stringify(profile));
        setIsEditing(false);
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in-up pb-20 lg:pb-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">My Profile</h2>
                    <p className="text-slate-500 text-sm">Manage your personal information and student details.</p>
                </div>
                <button
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${isEditing
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                        }`}
                >
                    {isEditing ? <><Save className="w-4 h-4" /> Save Profile</> : 'Edit Profile'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Avatar Section */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col items-center justify-center gap-4 shadow-sm md:col-span-1">
                    <div className="relative group cursor-pointer">
                        <img
                            src={`https://ui-avatars.com/api/?name=${profile.name || 'User'}&background=4F46E5&color=fff&size=512`}
                            alt="Profile"
                            className="w-32 h-32 rounded-full ring-4 ring-indigo-50 shadow-lg object-cover"
                        />
                        {isEditing && (
                            <div className="absolute inset-0 bg-slate-900/50 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-6 h-6 mb-1" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
                            </div>
                        )}
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-slate-800">{profile.name}</h3>
                        <p className="text-sm font-medium text-indigo-600">{profile.major}</p>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 mt-3 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            Active Student
                        </span>
                    </div>
                </div>

                {/* Details Form */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm md:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                <User className="w-3.5 h-3.5" /> Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 border-none outline-none focus:ring-2 ring-indigo-500 disabled:opacity-70 disabled:bg-slate-50/50 transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5" /> Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 border-none outline-none focus:ring-2 ring-indigo-500 disabled:opacity-70 disabled:bg-slate-50/50 transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                <GraduationCap className="w-3.5 h-3.5" /> University / Institute
                            </label>
                            <input
                                type="text"
                                name="university"
                                value={profile.university}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 border-none outline-none focus:ring-2 ring-indigo-500 disabled:opacity-70 disabled:bg-slate-50/50 transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5" /> Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={profile.location}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 border-none outline-none focus:ring-2 ring-indigo-500 disabled:opacity-70 disabled:bg-slate-50/50 transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5" /> Phone Number
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={profile.phone}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 border-none outline-none focus:ring-2 ring-indigo-500 disabled:opacity-70 disabled:bg-slate-50/50 transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                <LinkIcon className="w-3.5 h-3.5" /> Portfolio / LinkedIn
                            </label>
                            <input
                                type="text"
                                name="portfolio"
                                value={profile.portfolio}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 border-none outline-none focus:ring-2 ring-indigo-500 disabled:opacity-70 disabled:bg-slate-50/50 transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                Bio
                            </label>
                            <textarea
                                name="bio"
                                value={profile.bio}
                                onChange={handleChange}
                                disabled={!isEditing}
                                rows={3}
                                className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 border-none outline-none focus:ring-2 ring-indigo-500 disabled:opacity-70 disabled:bg-slate-50/50 transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
