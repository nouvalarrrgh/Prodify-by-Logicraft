import React, { useState, useEffect } from 'react';
import { Bell, Shield, Moon, Monitor, Palette, LogOut, Check, ChevronRight } from 'lucide-react';

export default function Settings({ onLogout }) {
    const [settings, setSettings] = useState({
        notifications: true,
        weeklyReport: true,
        darkMode: false,
        themeColor: 'indigo',
        focusSounds: true,
        privacyMode: false,
    });

    const [savedMessage, setSavedMessage] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('stuprod_settings');
        if (saved) {
            setSettings(JSON.parse(saved));
        }
    }, []);

    const handleToggle = (key) => {
        const newSettings = { ...settings, [key]: !settings[key] };
        setSettings(newSettings);
        localStorage.setItem('stuprod_settings', JSON.stringify(newSettings));

        // Show mini toast
        setSavedMessage('Settings auto-saved');
        setTimeout(() => setSavedMessage(''), 2000);
    };

    const handleColorChange = (color) => {
        const newSettings = { ...settings, themeColor: color };
        setSettings(newSettings);
        localStorage.setItem('stuprod_settings', JSON.stringify(newSettings));
    };

    const currentTheme = settings.darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
    const textColor = settings.darkMode ? 'text-white' : 'text-slate-800';

    return (
        <div className="flex flex-col gap-6 animate-fade-in-up pb-20 lg:pb-0 max-w-4xl">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={`text-2xl font-bold ${textColor}`}>Settings & Preferences</h2>
                    <p className="text-slate-500 text-sm">Customize your StuProd experience.</p>
                </div>
                {savedMessage && (
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-full flex items-center gap-1 animate-pulse">
                        <Check className="w-3.5 h-3.5" /> {savedMessage}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Appearance */}
                <div className={`${currentTheme} rounded-3xl border p-6 shadow-sm flex flex-col gap-5 transition-colors`}>
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Monitor className="w-5 h-5" /></div>
                        <h3 className={`font-bold ${textColor}`}>Appearance</h3>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-semibold ${textColor}`}>Dark Mode</p>
                            <p className="text-xs text-slate-500">Easier on eyes during late-night studies</p>
                        </div>
                        <Toggle isOn={settings.darkMode} onClick={() => handleToggle('darkMode')} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-semibold ${textColor}`}>Theme Accent</p>
                            <p className="text-xs text-slate-500">Personalize button colors (mock)</p>
                        </div>
                        <div className="flex gap-2">
                            {['indigo', 'rose', 'emerald', 'amber'].map(color => (
                                <button
                                    key={color}
                                    onClick={() => handleColorChange(color)}
                                    className={`w-6 h-6 rounded-full border-2 transition-all ${settings.themeColor === color ? 'border-slate-800 scale-110' : 'border-transparent hover:scale-105'
                                        }`}
                                    style={{
                                        backgroundColor: color === 'indigo' ? '#4F46E5' : color === 'rose' ? '#F43F5E' : color === 'emerald' ? '#10B981' : '#F59E0B'
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className={`${currentTheme} rounded-3xl border p-6 shadow-sm flex flex-col gap-5 transition-colors`}>
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                        <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Bell className="w-5 h-5" /></div>
                        <h3 className={`font-bold ${textColor}`}>Notifications</h3>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-semibold ${textColor}`}>Push Notifications</p>
                            <p className="text-xs text-slate-500">Get reminders for blocks & tasks</p>
                        </div>
                        <Toggle isOn={settings.notifications} onClick={() => handleToggle('notifications')} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-semibold ${textColor}`}>Weekly Report</p>
                            <p className="text-xs text-slate-500">Receive productivity stats via email</p>
                        </div>
                        <Toggle isOn={settings.weeklyReport} onClick={() => handleToggle('weeklyReport')} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-semibold ${textColor}`}>Focus Shift Sounds</p>
                            <p className="text-xs text-slate-500">Play chimes on Pomodoro end</p>
                        </div>
                        <Toggle isOn={settings.focusSounds} onClick={() => handleToggle('focusSounds')} />
                    </div>
                </div>

                {/* Privacy & Data */}
                <div className={`${currentTheme} rounded-3xl border p-6 shadow-sm flex flex-col gap-5 transition-colors md:col-span-2`}>
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                        <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><Shield className="w-5 h-5" /></div>
                        <h3 className={`font-bold ${textColor}`}>Account & Data</h3>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <p className={`text-sm font-semibold ${textColor}`}>Local Storage Usage</p>
                            <p className="text-xs text-slate-500 mb-2">All tasks and notes are saved entirely on your device browser.</p>
                            <div className="w-full bg-slate-100 rounded-full h-2 max-w-[200px]">
                                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">1.2 MB / 5.0 MB Used</p>
                        </div>
                        <button className="px-4 py-2 border border-slate-200 hover:border-slate-300 rounded-xl text-sm font-semibold text-slate-600 bg-white transition-all w-fit">
                            Clear Local Data
                        </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center bg-rose-50/50 -mx-6 -mb-6 p-6 rounded-b-3xl">
                        <div>
                            <p className="text-sm font-bold text-rose-600">Log Out</p>
                            <p className="text-xs text-rose-500/70">Clear session and return to login</p>
                        </div>
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-sm font-semibold transition-all shadow-sm"
                        >
                            <LogOut className="w-4 h-4" /> Log Out Fast
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Reusable Toggle Component
function Toggle({ isOn, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isOn ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOn ? 'translate-x-6' : 'translate-x-1'
                    }`}
            />
        </button>
    );
}
