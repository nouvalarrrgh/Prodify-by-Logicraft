import React, { useState, useEffect, useRef } from "react";
import Lottie from "lottie-react";
import plantData from "../assets/lottie/plant.json";
import {
  Play,
  Trees,
  Volume2,
  VolumeX,
  AlertTriangle,
  Sprout,
  Skull,
  X,
  Flame
} from "lucide-react";

// SINKRONISASI TEMA: Menggunakan Indigo/Purple sebagai warna utama sesi
const DURATION_OPTIONS = [
  { label: '25 Menit', seconds: 25 * 60, desc: 'Pomodoro' },
  { label: '45 Menit', seconds: 45 * 60, desc: 'Deep Work' },
  { label: '90 Menit', seconds: 90 * 60, desc: 'Ultradian' },
];

const DeepFocus = () => {
  const [selectedDuration, setSelectedDuration] = useState(0);
  const TOTAL_TIME = DURATION_OPTIONS[selectedDuration].seconds;
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const fullscreenRef = useRef(null);

  // Single Audio Track for Lofi Study
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [preCountdown, setPreCountdown] = useState(null);

  useEffect(() => {
    // Audio tetap sama (Lofi Study)
    audioRef.current = new Audio("https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem("forest_stats");
    return saved ? JSON.parse(saved) : { planted: 0, dead: 0 };
  });

  const [treeState, setTreeState] = useState("idle");
  const [showWarning, setShowWarning] = useState(false);

  const todayKey = `forest_today_${new Date().toISOString().split('T')[0]}`;
  const [todaySessions, setTodaySessions] = useState(() => parseInt(localStorage.getItem(todayKey) || '0'));

  useEffect(() => {
    localStorage.setItem("forest_stats", JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    const shouldPlay = isRunning && !showWarning && treeState === "growing" && !isMuted;
    if (!audioRef.current) return;
    if (shouldPlay) {
      audioRef.current.play().catch(() => { });
    } else {
      audioRef.current.pause();
    }
  }, [isRunning, showWarning, treeState, isMuted]);

  useEffect(() => {
    let interval;
    if (isRunning && !showWarning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setTreeState("success");
      setStats((s) => ({ ...s, planted: s.planted + 1 }));

      const currentTodayKey = `forest_today_${new Date().toISOString().split('T')[0]}`;
      const newSessionCount = parseInt(localStorage.getItem(currentTodayKey) || '0') + 1;
      localStorage.setItem(currentTodayKey, String(newSessionCount));
      setTodaySessions(newSessionCount);

      if (document.fullscreenElement) document.exitFullscreen().catch(() => { });
      setTimeout(() => {
        setTimeLeft(TOTAL_TIME);
        setTreeState("idle");
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, showWarning, TOTAL_TIME]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning && treeState === "growing") killTree();
    };
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isRunning && treeState === "growing" && !showWarning) {
        setShowWarning(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isRunning, treeState, showWarning]);

  const killTree = () => {
    setIsRunning(false);
    setShowWarning(false);
    setTreeState("dead");
    setStats((s) => ({ ...s, dead: s.dead + 1 }));
    if (document.fullscreenElement) document.exitFullscreen().catch(() => { });
    setTimeout(() => {
      setTimeLeft(TOTAL_TIME);
      setTreeState("idle");
    }, 5000);
  };

  useEffect(() => {
    let timer;
    if (preCountdown !== null) {
      if (typeof preCountdown === "number" && preCountdown > 1) {
        timer = setTimeout(() => setPreCountdown(preCountdown - 1), 1000);
      } else if (preCountdown === 1) {
        timer = setTimeout(() => setPreCountdown("Fokus!"), 1000);
      } else if (preCountdown === "Fokus!") {
        timer = setTimeout(() => {
          setPreCountdown(null);
          setIsRunning(true);
          setTreeState("growing");
          setTimeLeft(TOTAL_TIME);
        }, 1000);
      }
    }
    return () => clearTimeout(timer);
  }, [preCountdown, TOTAL_TIME]);

  const handleStart = () => {
    setTimeLeft(DURATION_OPTIONS[selectedDuration].seconds);
    if (fullscreenRef.current) {
      fullscreenRef.current.requestFullscreen().catch(() => { });
    }
    setPreCountdown(3);
  };

  const handleGiveUpClick = () => {
    if (!isRunning) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => { });
    setShowWarning(true);
  };

  const resumeFocus = () => {
    setShowWarning(false);
    if (fullscreenRef.current) {
      fullscreenRef.current.requestFullscreen().catch(() => { });
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // SVG Progress Circle calculation
  const circleRadius = 138;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = treeState === "idle" ? 0 : circleCircumference - (timeLeft / TOTAL_TIME) * circleCircumference;

  // SINKRONISASI WARNA: Menentukan warna aksen berdasarkan state (Default: Indigo)
  const getAccentColor = () => {
    if (treeState === "dead") return "text-rose-500";
    if (treeState === "success") return "text-violet-400"; // Sukses jadi ungu cerah
    return "text-indigo-400"; // Default running
  };

  const getButtonBgColor = () => {
    if (treeState === "dead") return "bg-rose-600";
    return "bg-indigo-600";
  };

  return (
    <div
      ref={fullscreenRef}
      className="min-h-full md:min-h-[calc(100vh-4rem)] rounded-3xl overflow-hidden relative flex items-center justify-center p-4 md:p-8"
    >
      {/* SINKRONISASI BUMNU: Background bernuansa Ungu/Indigo */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000"
        style={{
          // Gambar abstract night/space yang dominan ungu
          backgroundImage: `url('./public/3696aab9266c4104a9aa2a80d4c358dd.jpg')`,
          filter: treeState === "dead" ? "grayscale(100%) brightness(80%) blur(8px)" : "brightness(50%) blur(4px)",
        }}
      />
      {/* SINKRONISASI TINT: Overlay pekat bernuansa Indigo/Slate */}
      <div className={`absolute inset-0 z-0 transition-colors duration-1000 ${treeState === "dead" ? "bg-rose-950/70" : treeState === "success" ? "bg-violet-950/60" : "bg-slate-950/80"}`} />

      {/* Main Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-2xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 flex flex-col items-center shadow-2xl spatial-shadow">

        {/* Top Bar: Stats & Audio Control */}
        <div className="flex justify-between items-center w-full mb-8">
          <div className="flex gap-3">
            {/* SINKRONISASI TEXT: emerald -> indigo */}
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 text-indigo-300 font-bold text-xs" title="Pohon Berhasil Ditanam">
              <Trees className="w-4 h-4" /> {stats.planted}
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 text-rose-300 font-bold text-xs" title="Pohon Layu">
              <Skull className="w-4 h-4" /> {stats.dead}
            </div>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="bg-white/10 p-2.5 rounded-full border border-white/10 hover:bg-white/20 transition-all text-white cursor-pointer group"
          >
            {/* SINKRONISASI ICON: emerald -> indigo */}
            {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-indigo-300 group-hover:scale-110 transition-transform" />}
          </button>
        </div>

        {/* Centerpiece: Timer & Tree Ring */}
        <div className="relative flex flex-col items-center justify-center mb-8">
          <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-2xl" overflow="visible" viewBox="0 0 288 288">
              {/* Background Track */}
              <circle cx="144" cy="144" r={circleRadius} stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
              {/* Progress Track: SINKRONISASI WARNA */}
              <circle
                cx="144"
                cy="144"
                r={circleRadius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeLinecap="round"
                className={`${getAccentColor()} transition-all duration-1000 ease-linear`}
                strokeDasharray={circleCircumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>

            {/* Visual Inside the Ring */}
            {/* SINKRONISASI FILTER: Sukses tetap cerah dengan tint ungu */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ${treeState === "dead" ? "grayscale opacity-80" : ""}`}>
              {treeState === "growing" || treeState === "success" ? (
                <div className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center -mb-4 relative">
                  {/* Tambah glow ungu saat sukses */}
                  {treeState === "success" && <div className="absolute inset-4 bg-violet-500/30 rounded-full blur-2xl animate-pulse"></div>}
                  <Lottie animationData={plantData} loop={treeState === "growing"} className="w-full h-full drop-shadow-[0_0_15px_rgba(139,92,246,0.3)] relative z-10" />
                </div>
              ) : treeState === "dead" ? (
                <Skull className="w-20 h-20 text-rose-500 mb-2 drop-shadow-md" />
              ) : (
                <Sprout className="w-20 h-20 text-slate-500 mb-2 drop-shadow-md opacity-50" />
              )}
            </div>
          </div>

          {/* Huge Timer Text */}
          <div className="mt-8 flex flex-col items-center">
            <span className={`text-7xl md:text-8xl font-black tracking-tighter tabular-nums ${treeState === "dead" ? "text-rose-400" : "text-white"} drop-shadow-xl`}>
              {formatTime(timeLeft)}
            </span>
            {/* SINKRONISASI TEXT: emerald -> indigo/violet */}
            {isRunning && treeState === "growing" ? (
              <span className="text-xs uppercase font-bold text-indigo-300 tracking-widest mt-3 animate-pulse">Sesi Fokus Indigo</span>
            ) : treeState === "dead" ? (
              <span className="text-xs uppercase font-bold text-rose-400 tracking-widest mt-3">Sesi Terganggu</span>
            ) : treeState === "success" ? (
              <span className="text-xs uppercase font-bold text-violet-300 tracking-widest mt-3">Panen Berhasil! nyaa~</span>
            ) : (
              <span className="text-xs uppercase font-bold text-slate-500 tracking-widest mt-3">Siap Memulai</span>
            )}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="w-full flex flex-col items-center gap-6 mt-4">
          {treeState === "idle" || treeState === "success" || treeState === "dead" ? (
            <>
              {/* SINKRONISASI TABS: emerald -> indigo */}
              {treeState === "idle" && (
                <div className="flex bg-white/5 p-1.5 rounded-2xl w-full max-w-sm border border-white/10 backdrop-blur-md">
                  {DURATION_OPTIONS.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedDuration(i); setTimeLeft(opt.seconds); }}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${selectedDuration === i
                        ? 'bg-indigo-600 text-white shadow-lg transform scale-[1.02]'
                        : 'text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                      <div className="mb-0.5">{opt.label}</div>
                      <div className={`text-[9px] font-medium ${selectedDuration === i ? 'text-indigo-200' : 'opacity-50'}`}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* Start Button & Streak */}
              <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 max-w-sm">
                {(treeState === "idle" || treeState === "success" || treeState === "dead") && (
                  <button
                    onClick={handleStart}
                    className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${getButtonBgColor()} text-white hover:brightness-110 shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] hover:-translate-y-1`}
                  >
                    <Play className="w-5 h-5 fill-current" /> {treeState === "idle" ? "Mulai Sesi" : "Mulai Lagi"}
                  </button>
                )}

                {/* SINKRONISASI STREAK: emerald -> indigo */}
                {todaySessions > 0 && treeState === "idle" && (
                  <div className="hidden md:flex flex-col items-center justify-center px-6 py-2 bg-white/5 border border-white/10 rounded-2xl h-[60px] shrink-0">
                    <span className="flex items-center gap-1 text-indigo-300 font-bold text-sm"><Flame className="w-4 h-4 fill-current" /> {todaySessions}</span>
                    <span className="text-[9px] text-slate-400 uppercase font-bold">Hari Ini</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={handleGiveUpClick}
              disabled={treeState === "success"}
              className={`w-full max-w-sm py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 ${treeState === "success" ? "bg-white/10 text-white/40 cursor-not-allowed border border-white/10" : "bg-rose-600 text-white hover:bg-rose-700 shadow-[0_0_30px_rgba(225,29,72,0.3)] cursor-pointer hover:-translate-y-1"}`}
            >
              {treeState === "growing" && <X className="w-5 h-5" />}
              <span>
                {treeState === "growing" ? "Menyerah (Bunuh Pohon)" : "Memproses..."}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Pre-start Countdown Overlay */}
      {preCountdown !== null && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl">
          {/* SINKRONISASI GLOW: emerald -> indigo */}
          <span className="text-[12rem] font-black text-white animate-bounce drop-shadow-[0_0_80px_rgba(79,70,229,0.8)] tracking-tighter tabular-nums">
            {preCountdown}
          </span>
        </div>
      )}

      {/* Warning Modal (Give Up) */}
      {showWarning && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-fade-in p-6">
          <div className="bg-slate-900 border border-white/10 w-full max-w-sm rounded-[2.5rem] p-8 text-center shadow-2xl flex flex-col items-center spatial-shadow">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-6 animate-pulse border border-rose-500/30">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Batalkan Sesi?</h3>
            <p className="text-slate-400 font-medium mb-8 text-sm leading-relaxed">
              Pohon Indigo yang sedang tumbuh akan <strong className="text-rose-400">mati layu</strong> jika Anda keluar sekarang.
            </p>
            <div className="flex gap-3 w-full">
              {/* SINKRONISASI BUTTON: emerald -> indigo */}
              <button onClick={resumeFocus} className="flex-1 py-3.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer shadow-lg shadow-indigo-600/20">
                Lanjut Fokus
              </button>
              <button onClick={killTree} className="flex-1 py-3.5 rounded-xl font-bold bg-slate-800 hover:bg-rose-600 text-rose-300 hover:text-white transition-colors cursor-pointer border border-white/10">
                Bunuh Pohon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeepFocus;