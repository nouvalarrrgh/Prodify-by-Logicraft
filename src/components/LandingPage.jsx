import React from 'react';
import { motion } from 'framer-motion';
import { Layers, CheckCircle2, ChevronRight, Brain, Target, Zap, Clock, ShieldCheck } from 'lucide-react';

export default function LandingPage({ onStart }) {
  const FADE_UP = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const STAGGER = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 selection:bg-indigo-500 selection:text-white font-sans overflow-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative p-2 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-black text-2xl tracking-tight">
              Stu<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Prod</span>
            </h1>
          </div>
          <button 
            onClick={onStart}
            className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-full hover:scale-105 transition-transform shadow-lg cursor-pointer"
          >
            Buka Workspace
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] rounded-full rounded-tr-[100px] pointer-events-none" />
        
        <motion.div 
          initial="hidden" animate="visible" variants={STAGGER}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-8">
            <Zap className="w-4 h-4" /> Finalis IFest WDC 2026
          </motion.div>
          
          <motion.h1 variants={FADE_UP} className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6 text-slate-900 dark:text-white">
            Empowering Students Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-500">Innovative Productivity Tools</span>
          </motion.h1>
          
          <motion.p variants={FADE_UP} className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-3xl mx-auto font-medium">
            Ubah kekacauan jadwal kuliah, tugas, dan organisasi menjadi ekosistem yang terstruktur. StuProd adalah solusi *all-in-one* berbasis *Local-First* untuk mahasiswa aktif.
          </motion.p>
          
          <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-[0_10px_40px_-10px_rgba(79,70,229,0.8)] transition-all hover:-translate-y-1 flex items-center justify-center gap-2 text-lg cursor-pointer"
            >
              Mulai Gratis <ChevronRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-slate-500 dark:text-slate-500 font-bold mt-4 sm:mt-0 sm:ml-4">
              ✨ 100% Local Storage. Tanpa Login Server.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* 5 PILAR FEATURES (Sesuai Batasan Rulebook) */}
      <section className="py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-4">5 Pilar Produktivitas Mahasiswa</h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Sistem yang saling terhubung untuk mencegah *burnout* akademik.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <motion.div whileHover={{ y: -5 }} className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700/50 spatial-shadow">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                <Brain className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">Smart Notes (ZenNotes)</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">Catatan perkuliahan & papan tulis *whiteboard* interaktif. Integrasi langsung pemecahan paragraf menjadi target tugas.</p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div whileHover={{ y: -5 }} className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700/50 spatial-shadow">
              <div className="w-14 h-14 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">Balance Matrix</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">Berhenti memikirkan semuanya sekaligus. Filter tugas organisasimu menggunakan *Eisenhower Matrix* & Jadwal Mingguan.</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div whileHover={{ y: -5 }} className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700/50 spatial-shadow">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">Deep Focus Workspace</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">Teknik Pomodoro dengan Anti-Cheat. Pindah *tab* browser untuk buka sosmed? Pohon fokusmu akan mati layu!</p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div whileHover={{ y: -5 }} className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700/50 spatial-shadow lg:col-span-1 md:col-span-2">
              <div className="w-14 h-14 bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">Synergy Habit</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">Bangun pilar kebiasaan vitalitas & mindfulness untuk meningkatkan batas Energi Koin harianmu.</p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div whileHover={{ y: -5 }} className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700/50 spatial-shadow lg:col-span-2 md:col-span-2 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6 relative z-10">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 relative z-10">Student Intelligence Hub</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm relative z-10 max-w-lg">Dashboard cerdas yang menganalisis progresmu, memvisualisasikan Radar Keseimbangan Mental, dan mendeteksi titik *burnout* secara otomatis (*Cognitive Guard*).</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-slate-900 text-slate-400 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-indigo-400" />
          <span className="text-xl font-black text-white">StuProd</span>
        </div>
        <p className="text-sm mb-2">Developed specifically for IFest Web Development Competition 2026</p>
        <p className="text-xs">&copy; 2026 StuProd Team. All systems operational.</p>
      </footer>
    </div>
  );
}