import React from 'react';
import { Calendar as CalendarIcon, Target, Inbox, Sun, Sparkles, AlertTriangle, X, Check, CheckCircle, Edit2, Clock, MapPin, BookOpen, MoreVertical, Bell } from 'lucide-react';

const CATEGORY_META = {
  academic: { label: "Akademik", icon: "📚" },
  organization: { label: "Organisasi", icon: "🤝" },
  committee: { label: "Kepanitiaan", icon: "🎟️" },
  work: { label: "Kerja", icon: "💼" },
  personal: { label: "Pribadi", icon: "🧘" },
  project: { label: "Project", icon: "🚀" },
};

// Fungsi untuk mendapatkan gradasi warna berdasarkan Kuadran (Style Referensi)
const getTaskGradient = (quadrant) => {
  switch (quadrant) {
    case "urgent-important": return "bg-gradient-to-r from-rose-400 to-red-500 text-white shadow-rose-500/30";
    case "not-urgent-important": return "bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-blue-500/30";
    case "urgent-not-important": return "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-orange-500/30";
    case "not-urgent-not-important": return "bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-slate-500/30";
    default: return "bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-emerald-500/30";
  }
};

const WeeklyCalendar = ({
  next7Days, currentDate, setCurrentDate, isSameDay, scheduledBlocks, getDayFormatted,
  todayBlocks, isBurnout, currentDailyEnergy, MAX_DAILY_ENERGY, synergyState, tasks,
  quadrants, removeBlock, dateStrKey, globalGoal, setGlobalGoal, isEditingGoal,
  setIsEditingGoal, academicSchedule = [], onAssignQuadrant,
}) => {
  const timeGrid = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}`);
  const [upcomingEvent, setUpcomingEvent] = React.useState(null);
  const [showOptions, setShowOptions] = React.useState(false);
  const [showMapModal, setShowMapModal] = React.useState(false);
  const [taskToMap, setTaskToMap] = React.useState(null);
  const [selectedQuadrant, setSelectedQuadrant] = React.useState(quadrants[0]?.id || "urgent-important");

  const openMapModal = (task) => {
    setTaskToMap(task);
    setSelectedQuadrant(quadrants[0]?.id || "urgent-important");
    setShowMapModal(true);
  };

  const confirmMap = () => {
    if (taskToMap && selectedQuadrant && onAssignQuadrant) {
      onAssignQuadrant(taskToMap.id, selectedQuadrant);
    }
    setShowMapModal(false);
    setTaskToMap(null);
  };

  React.useEffect(() => {
    const checkUpcoming = () => {
      const now = new Date();
      // Use local date key instead of todayBlocks because todayBlocks depends on currentDate (which could be another day selected by user)
      const d = new Date(now);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      const dateKey = d.toISOString().split("T")[0];
      const realTodayBlocks = scheduledBlocks[dateKey] || [];

      let nextEvent = null;
      let minDiff = Infinity;

      // Check tasks
      realTodayBlocks.forEach(block => {
        const [h, m] = (block.time || "00:00").split(':').map(Number);
        const eventTime = new Date(now);
        eventTime.setHours(h, m, 0, 0);
        const diffMins = (eventTime - now) / 60000;

        if (diffMins > 0 && diffMins <= 20) {
          if (diffMins < minDiff) { minDiff = diffMins; nextEvent = { ...block, isClass: false, diffMins }; }
        }
      });

      // Check classes
      const currentDay = now.getDay() === 0 ? 0 : now.getDay();
      academicSchedule.forEach(acad => {
        if (Number(acad.dayOfWeek) === currentDay) {
          const [h, m] = (acad.startTime || "00:00").split(':').map(Number);
          const eventTime = new Date(now);
          eventTime.setHours(h, m, 0, 0);
          const diffMins = (eventTime - now) / 60000;
          if (diffMins > 0 && diffMins <= 20) {
            if (diffMins < minDiff) { minDiff = diffMins; nextEvent = { ...acad, title: acad.course, isClass: true, diffMins }; }
          }
        }
      });

      if (nextEvent) {
        setUpcomingEvent(nextEvent);
      } else {
        setUpcomingEvent(null);
      }
    };

    checkUpcoming();
    const intv = setInterval(checkUpcoming, 30000); // check every 30 seconds
    return () => clearInterval(intv);
  }, [scheduledBlocks, academicSchedule]);

  return (
    <div className="liquid-glass dark:bg-slate-900/60 dark:border-slate-700/50 rounded-[2.5rem] spatial-shadow overflow-hidden transition-colors flex flex-col">
      <div className="p-6 md:p-8 border-b border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-md">
            <CalendarIcon className="w-5 h-5" />
          </div>
          Kalender Produktivitas
        </h2>

        {/* Day Selector (Diubah menjadi Justify / Stretch) */}
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto custom-scrollbar pb-2 sm:pb-0">
          {next7Days.map((day, idx) => {
            const isSelected = isSameDay(day, currentDate);
            const isToday = isSameDay(day, new Date());
            const dateKey = day.toISOString().split("T")[0];
            const blocksCount = (scheduledBlocks[dateKey] || []).length;
            return (
              <button
                key={idx}
                onClick={() => setCurrentDate(day)}
                className={`flex-1 min-w-[64px] max-w-[100px] flex flex-col items-center py-2.5 px-1 rounded-2xl transition-all cursor-pointer ${isSelected ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 scale-105 z-10" : "bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"}`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-indigo-200" : ""}`}>
                  {day.toLocaleDateString("id-ID", { weekday: "short" })}
                </span>
                <span className="text-xl font-black my-0.5">{day.getDate()}</span>
                {blocksCount > 0 ? (
                  <div className="flex items-center gap-1 text-[9px] font-bold">
                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-emerald-400" : "bg-indigo-500"}`}></div>
                    {blocksCount}
                  </div>
                ) : (
                  <span className={`text-[9px] font-bold ${isSelected ? "text-indigo-300" : "opacity-50"}`}>
                    {isToday ? "Hari Ini" : "Kosong"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-0 flex-1">

        {/* KIRI: AREA TIME BLOCKING (DIROMBAK TOTAL SESUAI REFERENSI) */}
        <div className="flex-1 p-6 md:p-8 flex flex-col">

          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" /> Timeline: {getDayFormatted(currentDate)}
            </h2>
            <div className="flex items-center space-x-3 text-slate-400 relative">
              {upcomingEvent ? (
                <div className="flex items-center gap-2 mr-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 px-3 py-1.5 rounded-lg text-xs font-bold animate-pulse shadow-sm">
                  <Bell className="w-4 h-4" /> {upcomingEvent.title} dalam {Math.ceil(upcomingEvent.diffMins)} mnt
                </div>
              ) : (
                <Bell className="w-5 h-5 cursor-pointer hover:text-indigo-500 transition-colors" />
              )}

              <div className="relative">
                <MoreVertical
                  className="w-5 h-5 cursor-pointer hover:text-indigo-500 transition-colors"
                  onClick={() => setShowOptions(!showOptions)}
                />

                {showOptions && (
                  <div className="absolute right-0 top-8 mt-1 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50 animate-fade-in text-sm font-medium">
                    <button className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-2" onClick={() => { alert("Opsi: Mode Fokus Kalender akan segera hadir!"); setShowOptions(false); }}>
                      <Target className="w-4 h-4" /> Mode Fokus
                    </button>
                    <button className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-2" onClick={() => { alert("Opsi: Ekspor Kalender akan segera hadir!"); setShowOptions(false); }}>
                      <CalendarIcon className="w-4 h-4" /> Ekspor Jadwal
                    </button>
                    <div className="h-px w-full bg-slate-100 dark:bg-slate-700 my-1"></div>
                    <button className="w-full text-left px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-500 transition-colors flex items-center gap-2" onClick={() => setShowOptions(false)}>
                      <X className="w-4 h-4" /> Tutup
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Container Timeline ala Gantt */}
          <div className="flex-1 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col overflow-hidden relative">

            {/* Header Kolom (Diganti Menjadi Indikator Kapasitas Mental Task & Activity Manageran) */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 py-3 px-4 ml-[60px] bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2 shrink-0">
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 hidden sm:inline">Beban Mental Harian</span>
              </div>
              <div className="flex-1 max-w-sm bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden shadow-inner mx-4">
                <div className={`h-full rounded-full transition-all duration-700 ${isBurnout ? "bg-rose-500" : currentDailyEnergy >= MAX_DAILY_ENERGY * 0.8 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.min((currentDailyEnergy / MAX_DAILY_ENERGY) * 100, 100)}%` }} />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest shrink-0 ${isBurnout ? 'text-rose-500' : 'text-slate-400'}`}>
                {currentDailyEnergy} / {MAX_DAILY_ENERGY} Koin
              </span>
            </div>

            {/* Area Scroll Timeline */}
            <div className="relative flex-1 overflow-y-auto max-h-[500px] custom-scrollbar bg-[#fcfcfc] dark:bg-transparent">

              {/* Garis Latar Belakang (Grid Vertikal) */}
              <div className="absolute inset-0 grid grid-cols-6 border-l border-slate-100 dark:border-slate-800/50 ml-[60px] pointer-events-none z-0">
                {[...Array(6)].map((_, i) => <div key={i} className="border-r border-slate-100 dark:border-slate-800/50 h-full"></div>)}
              </div>

              {timeGrid.map((hour) => {
                const blocksInHour = todayBlocks.filter((b) => b.time.startsWith(`${hour}:`));
                const currentDay = currentDate.getDay();

                // FILTER JADWAL AKADEMIK MULTIPLE JAM
                const academicBlocksHere = academicSchedule.filter((s) => {
                  if (Number(s.dayOfWeek) !== currentDay) return false;
                  const startH = parseInt((s.startTime || "00:00").split(':')[0], 10);
                  let endH = parseInt((s.endTime || "00:00").split(':')[0], 10);
                  const endM = parseInt((s.endTime || "00:00").split(':')[1], 10);
                  if (endM === 0 && endH > startH) endH -= 1;
                  const currentH = parseInt(hour, 10);
                  return currentH >= startH && currentH <= endH;
                });

                const isDuringClass = academicBlocksHere.length > 0;
                const hasAnyBlock = blocksInHour.length > 0 || isDuringClass;

                return (
                  <div key={hour} className="flex min-h-[56px] border-b border-slate-100/80 dark:border-slate-800/80 group relative z-10 hover:bg-white dark:hover:bg-slate-800/30 transition-colors">

                    {/* Kolom Jam */}
                    <div className="w-[60px] shrink-0 py-3 pr-3 flex flex-col items-end border-r border-slate-100 dark:border-slate-800/50 bg-white/50 dark:bg-transparent">
                      <span className={`text-xs font-bold transition-colors ${hasAnyBlock ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600'}`}>
                        {hour}:00
                      </span>
                    </div>

                    {/* Area Bar Tugas */}
                    <div className="flex-1 p-2 flex flex-col justify-center gap-2 relative">

                      {/* 1. Bar Jadwal Akademik (Solid Dark Blue/Slate Pill) */}
                      {academicBlocksHere.map((acad) => (
                        <div key={`acad-${acad.id}`} className="h-9 w-11/12 md:w-4/5 rounded-full flex items-center justify-between px-4 text-xs font-bold text-white shadow-md bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-700 dark:to-slate-600 hover:scale-[1.01] transition-transform ml-2">
                          <div className="flex items-center gap-2 truncate">
                            <BookOpen className="w-3.5 h-3.5 opacity-70 shrink-0" />
                            <span className="truncate drop-shadow-sm">{acad.course}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 opacity-80 font-medium">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {acad.startTime}-{acad.endTime}</span>
                            {acad.location && <span className="hidden sm:flex items-center gap-1"><MapPin className="w-3 h-3" /> {acad.location}</span>}
                          </div>
                        </div>
                      ))}

                      {/* 2. Bar Tugas Dinamis (Colorful Pill) */}
                      {blocksInHour.map((block, index) => {
                        const parentTask = tasks.find((t) => t.id === block.taskId);
                        const resolvedQuadrant = parentTask ? parentTask.quadrant : block.quadrant;
                        const categoryKey = block.category || parentTask?.category || "academic";
                        const catMeta = CATEGORY_META[categoryKey] || CATEGORY_META.academic;

                        // Buat bar sedikit bergeser (margin-left) jika ada lebih dari 1 tugas di jam yang sama agar terlihat dinamis
                        const marginLeft = index === 1 ? 'ml-6' : index === 2 ? 'ml-12' : 'ml-2';
                        const barWidth = index === 0 ? 'w-full md:w-5/6' : 'w-11/12 md:w-3/4';

                        return (
                          <div key={block.id} className={`h-9 ${barWidth} ${marginLeft} rounded-full flex items-center justify-between px-4 text-xs font-bold shadow-md hover:shadow-lg hover:scale-[1.01] transition-all cursor-default group/bar ${getTaskGradient(resolvedQuadrant)}`}>
                            <div className="flex items-center gap-2 truncate">
                              <span className="text-sm shrink-0 drop-shadow-md">{catMeta.icon}</span>
                              <span className="truncate drop-shadow-md tracking-wide">{block.title}</span>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <span className="hidden sm:flex items-center gap-1 opacity-90 drop-shadow-sm bg-black/10 px-2 py-0.5 rounded-full">
                                <Target className="w-3 h-3" /> {block.energy} Koin
                              </span>
                              <button
                                onClick={() => removeBlock(dateStrKey, block.id)}
                                className="opacity-0 group-hover/bar:opacity-100 p-1 hover:bg-white/20 rounded-full transition-all cursor-pointer"
                                title="Hapus dari jadwal"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* KANAN: PANEL GOAL & UNASSIGNED (Sidebar Kanan ala Referensi) */}
        <aside className="w-full xl:w-80 shrink-0 bg-slate-50/50 dark:bg-slate-800/40 border-t xl:border-t-0 xl:border-l border-slate-200/60 dark:border-slate-700/60 p-6 md:p-8 flex flex-col gap-6 transition-colors">

          {/* Card Goal (Dirombak lebih bersih) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-3xl p-5 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 dark:bg-indigo-500/10 rounded-full -mr-8 -mt-8 blur-xl pointer-events-none transition-colors"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Target className="w-4 h-4" /> Goal Utama
                </h3>
                <button onClick={() => setIsEditingGoal(!isEditingGoal)} className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
                  {isEditingGoal ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                </button>
              </div>
              {isEditingGoal ? (
                <textarea
                  autoFocus
                  value={globalGoal}
                  onChange={(e) => setGlobalGoal(e.target.value)}
                  onBlur={() => setIsEditingGoal(false)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm font-semibold rounded-xl p-3 outline-none border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 resize-none custom-scrollbar"
                  rows={3}
                  placeholder="Apa target besarmu semester ini?"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 leading-relaxed cursor-pointer p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors line-clamp-3" onClick={() => setIsEditingGoal(true)}>
                  "{globalGoal}"
                </p>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-3xl p-5 shadow-sm">
            <h3 className="font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2 text-sm">
              <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500"><Inbox className="w-4 h-4" /></div>
              Belum Dipetakkan
            </h3>

            <div className="space-y-3 overflow-y-auto flex-1 min-h-[150px] max-h-[350px] custom-scrollbar pr-1 transition-colors rounded-2xl">
              {tasks.filter((t) => !t.completed && t.quadrant === "unassigned").map((task) => (
                <div
                  key={task.id}
                  className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border shadow-sm flex items-start gap-3 border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500/50 hover:shadow-md transition-shadow transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 line-clamp-2 leading-snug">{task.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[9px] font-black uppercase text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">
                        {task.energy} Koin
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium truncate">
                        {CATEGORY_META[task.category]?.icon} {CATEGORY_META[task.category]?.label}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openMapModal(task)}
                    className="shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Petakkan
                  </button>
                </div>
              ))}
              {tasks.filter((t) => !t.completed && t.quadrant === "unassigned").length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 opacity-60">
                  <CheckCircle className="w-8 h-8 mb-2 text-emerald-400" />
                  <p className="text-xs font-bold uppercase tracking-widest">Semua Terpetakan!</p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {showMapModal && taskToMap && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-5">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" /> Petakkan Aktivitas
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Pilih prioritas di Matrix untuk aktivitas ini.
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setShowMapModal(false); setTaskToMap(null); }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-3">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Aktivitas</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-2">
                {taskToMap.title}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Pilih Prioritas
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quadrants.map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setSelectedQuadrant(q.id)}
                    className={`flex items-start gap-2 p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      selectedQuadrant === q.id
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 ring-2 ring-indigo-200"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 hover:border-indigo-300 dark:hover:border-indigo-500/60"
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${q.bg}`}>
                      <q.icon className={`w-4 h-4 ${q.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-xs font-black uppercase tracking-widest ${q.color}`}>{q.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {q.id === "urgent-important" && "Segera dikerjakan hari ini."}
                        {q.id === "not-urgent-important" && "Jadwalkan di momen fokus terbaik."}
                        {q.id === "urgent-not-important" && "Bisa dibantu / didelegasikan."}
                        {q.id === "not-urgent-not-important" && "Pertimbangkan untuk ditunda atau dihapus."}
                      </p>
                    </div>
                    {selectedQuadrant === q.id && (
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setShowMapModal(false); setTaskToMap(null); }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmMap}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Petakkan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyCalendar;