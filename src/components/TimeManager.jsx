import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Plus, CheckCircle, Clock, AlertTriangle, AlertCircle, Trash2, GripVertical, Calendar as CalendarIcon, Target, Inbox, Sun, Moon, Sparkles, MoveRight, Layers, X, BellRing, Check, Edit2
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const notifySound = new Audio(
  "https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3",
);

const TimeManager = () => {
  // --- 1. STATE MANAGEMENT ---
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("matrix_tasks");
    if (saved) {
      const parsed = JSON.parse(saved);
      const migrated = parsed.map((t) => {
        let q = t.quadrant;
        if (q === "q1") q = "urgent-important";
        if (q === "q2") q = "not-urgent-important";
        if (q === "q3") q = "urgent-not-important";
        if (q === "q4") q = "not-urgent-not-important";
        return { ...t, quadrant: q };
      });

      const validIds = [
        "urgent-important",
        "not-urgent-important",
        "urgent-not-important",
        "not-urgent-not-important",
      ];
      return migrated.filter((t) => validIds.includes(t.quadrant));
    }
    return [];
  });

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedQuadrant, setSelectedQuadrant] = useState("urgent-important");
  const [newTaskEnergy, setNewTaskEnergy] = useState("1");

  const [showAddModal, setShowAddModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduledBlocks, setScheduledBlocks] = useState(() => {
    const saved = localStorage.getItem("time_blocks");
    if (saved) {
      const parsed = JSON.parse(saved);
      const migrated = {};
      for (const date in parsed) {
        migrated[date] = parsed[date].map((b) => {
          let q = b.quadrant;
          if (q === "q1") q = "urgent-important";
          if (q === "q2") q = "not-urgent-important";
          if (q === "q3") q = "urgent-not-important";
          if (q === "q4") q = "not-urgent-not-important";
          return { ...b, quadrant: q };
        });
      }
      return migrated;
    }
    return {};
  });
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [taskToSchedule, setTaskToSchedule] = useState(null);
  const [scheduleTime, setScheduleTime] = useState("08:00");
  const [scheduleDate, setScheduleDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // GOALS WIDGET
  const [globalGoal, setGlobalGoal] = useState(() => {
    return localStorage.getItem("stuprod_global_goal") || "Ketik target IPK/Organisasimu semester ini...";
  });
  const [isEditingGoal, setIsEditingGoal] = useState(false);

  useEffect(() => {
    localStorage.setItem("stuprod_global_goal", globalGoal);
  }, [globalGoal]);

  const [notif, setNotif] = useState(null);

  const [synergyState, setSynergyState] = useState(() => {
    return localStorage.getItem("stuprod_balance_state") || "balanced";
  });

  const MAX_DAILY_ENERGY = synergyState === "buffed" ? 13 : synergyState === "debuffed" ? 7 : 10;

  const [deadlineTasks, setDeadlineTasks] = useState(() => {
    const saved = localStorage.getItem("stuprod_tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [newDeadlineTask, setNewDeadlineTask] = useState("");
  const [newDeadlineTime, setNewDeadlineTime] = useState("");
  const [activeAlert, setActiveAlert] = useState(null);

  // --- 2. EFFECTS ---
  useEffect(() => {
    localStorage.setItem("stuprod_tasks", JSON.stringify(deadlineTasks));
  }, [deadlineTasks]);

  useEffect(() => {
    const checkDeadlines = () => {
      const now = new Date().getTime();
      let updated = false;
      const newTasks = deadlineTasks.map((t) => {
        if (!t.completed && !t.notified && t.deadline) {
          const deadlineTime = new Date(t.deadline).getTime();
          const timeDiff = deadlineTime - now;
          if (timeDiff > 0 && timeDiff <= 7200000) {
            triggerNotification(t);
            updated = true;
            return { ...t, notified: true };
          }
        }
        return t;
      });
      if (updated) {
        setDeadlineTasks(newTasks);
      }
    };

    const interval = setInterval(checkDeadlines, 30000);
    return () => clearInterval(interval);
  }, [deadlineTasks]);

  const triggerNotification = (task) => {
    notifySound.play().catch((e) => console.log("Audio autoplay prevented:", e));
    setActiveAlert(task);
  };

  const handleAddDeadlineTask = (e) => {
    e.preventDefault();
    if (!newDeadlineTask.trim() || !newDeadlineTime) return;

    setDeadlineTasks([
      ...deadlineTasks,
      {
        id: Date.now().toString(),
        text: newDeadlineTask,
        deadline: newDeadlineTime,
        completed: false,
        notified: false,
        createdAt: new Date().toISOString(),
      },
    ]);
    setNewDeadlineTask("");
    setNewDeadlineTime("");
  };

  const toggleDeadlineTask = (id) => {
    setDeadlineTasks(
      deadlineTasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      ),
    );
  };

  const deleteDeadlineTask = (id) => {
    setDeadlineTasks(deadlineTasks.filter((t) => t.id !== id));
  };

  const transferDeadlineTask = (dt) => {
    const newTask = {
      id: Date.now().toString(),
      title: dt.text,
      quadrant: "unassigned",
      energy: 2,
      tag: "Deadline",
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setTaskToSchedule(newTask);
    setShowScheduleModal(true);
    showNotification("Tugas dikirim ke Agenda & Kalender!");
  };

  const calculateDeadlineStatus = (deadline) => {
    const timeDiff = new Date(deadline).getTime() - new Date().getTime();
    if (timeDiff < 0)
      return {
        label: "Terlewat",
        color: "text-rose-600 dark:text-rose-400",
        border: "border-rose-200 dark:border-rose-500/30",
        bg: "bg-rose-50 dark:bg-rose-500/10"
      };
    if (timeDiff <= 7200000)
      return {
        label: "Mendesak (< 2 Jam)",
        color: "text-orange-600 dark:text-orange-400",
        border: "border-orange-200 dark:border-orange-500/30",
        bg: "bg-orange-50 dark:bg-orange-500/10"
      };
    if (timeDiff <= 86400000)
      return {
        label: "Hari Ini",
        color: "text-amber-600 dark:text-amber-400",
        border: "border-amber-200 dark:border-amber-500/30",
        bg: "bg-amber-50 dark:bg-amber-500/10"
      };
    return {
      label: "Aman",
      color: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-500/30",
      bg: "bg-emerald-50 dark:bg-emerald-500/10"
    };
  };

  const sortedDeadlineTasks = [...deadlineTasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  useEffect(() => {
    localStorage.setItem("matrix_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("time_blocks", JSON.stringify(scheduledBlocks));
  }, [scheduledBlocks]);

  const showNotification = (message) => {
    setNotif(message);
    setTimeout(() => setNotif(null), 3000);
  };

  const clearCompletedTasks = () => {
    setTasks(tasks.filter((t) => !t.completed));
    setDeadlineTasks(deadlineTasks.filter((t) => !t.completed));
    showNotification("Semua tugas selesai telah dibersihkan!");
  };

  // --- 3. MATRIX / AGENDA FUNCTIONS ---
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      quadrant: "unassigned",
      energy: parseInt(newTaskEnergy),
      tag: "Umum",
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setNewTaskEnergy("1");
    setShowAddModal(false);

    setTaskToSchedule(newTask);
    setShowScheduleModal(true);
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t,
      ),
    );
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((t) => t.id !== taskId));

    const newBlocks = { ...scheduledBlocks };
    Object.keys(newBlocks).forEach((date) => {
      newBlocks[date] = newBlocks[date].filter((b) => b.taskId !== taskId);
    });
    setScheduledBlocks(newBlocks);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const sourceQuad = result.source.droppableId;
    const destQuad = result.destination.droppableId;

    if (sourceQuad === destQuad) {
      const items = Array.from(tasks.filter((t) => t.quadrant === sourceQuad));
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      const newTasks = tasks.map((t) =>
        t.quadrant === sourceQuad ? items.shift() : t,
      );
      setTasks(newTasks);
    } else {
      setTasks(
        tasks.map((t) =>
          t.id === result.draggableId ? { ...t, quadrant: destQuad } : t,
        ),
      );
    }
  };

  const onDragUpdate = (update) => {
    if (!update.destination) return;
    const scrollEdge = 100;
    const maxScrollStep = 20;

    const handleScroll = (e) => {
      const clientY = e.clientY || e.touches?.[0]?.clientY;
      if (!clientY) return;

      if (clientY < scrollEdge) {
        window.scrollBy({ top: -maxScrollStep, behavior: 'instant' });
      } else if (window.innerHeight - clientY < scrollEdge) {
        window.scrollBy({ top: maxScrollStep, behavior: 'instant' });
      }
    };
  };

  // --- 4. CALENDAR FUNCTIONS ---
  const openScheduleModal = (task) => {
    setTaskToSchedule({ ...task });
    setScheduleTime("08:00");
    setScheduleDate(new Date().toISOString().split("T")[0]);
    setShowScheduleModal(true);
  };

  const confirmSchedule = (e) => {
    e.preventDefault();
    if (!taskToSchedule || !scheduleDate || !scheduleTime) return;
    const dateStr = scheduleDate;

    const newBlock = {
      id: Date.now().toString(),
      taskId: taskToSchedule.id,
      title: taskToSchedule.title,
      time: scheduleTime || "00:00",
      quadrant: taskToSchedule.quadrant || "unassigned",
      energy: taskToSchedule.energy || 1,
      completed: false,
    };

    setScheduledBlocks({
      ...scheduledBlocks,
      [dateStr]: [...(scheduledBlocks[dateStr] || []), newBlock].sort((a, b) =>
        a.time.localeCompare(b.time),
      ),
    });

    setShowScheduleModal(false);
    showNotification(`Tugas dijadwalkan pada jam ${scheduleTime} `);
    setTimeout(() => setTaskToSchedule(null), 300);
  };

  const removeBlock = (dateStr, blockId) => {
    setScheduledBlocks({
      ...scheduledBlocks,
      [dateStr]: scheduledBlocks[dateStr].filter((b) => b.id !== blockId),
    });
  };

  // --- 5. RENDER HELPERS ---
  const quadrants = [
    { id: "urgent-important", title: "Lakukan Sekarang", icon: AlertTriangle, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-500/10", border: "border-rose-200 dark:border-rose-500/20" },
    { id: "not-urgent-important", title: "Jadwalkan", icon: Target, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-200 dark:border-blue-500/20" },
    { id: "urgent-not-important", title: "Delegasikan/Bantuan", icon: AlertCircle, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-200 dark:border-amber-500/20" },
    { id: "not-urgent-not-important", title: "Tunda/Hapus", icon: Trash2, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-50 dark:bg-slate-800/50", border: "border-slate-200 dark:border-slate-700" },
  ];

  const getDayFormatted = (date) => {
    return date.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  const dateStrKey = currentDate.toISOString().split("T")[0];
  const todayBlocks = scheduledBlocks[dateStrKey] || [];

  const next7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const calculateDailyEnergy = (blocks) => {
    return blocks.reduce((acc, block) => acc + (block.energy || 1), 0);
  };

  const currentDailyEnergy = calculateDailyEnergy(todayBlocks);
  const energyPercentage = Math.min((currentDailyEnergy / MAX_DAILY_ENERGY) * 100, 100);

  let isBurnout = false;
  if (currentDailyEnergy > MAX_DAILY_ENERGY) {
    isBurnout = true;
  }

  return (
    <>
      <div className="min-h-full flex flex-col p-4 md:p-8 animate-fade-in pb-32">
        <div className="w-full max-w-6xl mx-auto space-y-8">

          {/* ===== HEADER ===== */}
          <div className="animated-gradient-border liquid-glass dark:bg-slate-900/60 dark:border-slate-700/50 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 spatial-shadow transition-colors">
            <div className="flex items-center gap-5 z-10 relative">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center border-2 border-indigo-200 dark:border-indigo-500/30 shadow-inner">
                <Layers className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">Time &amp; Task Hub</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">Prioritaskan di Matrix, Eksekusi di Kalender.</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md shadow-indigo-600/20 w-full md:w-auto justify-center cursor-pointer"
            >
              <Plus className="w-5 h-5" /> Tambah Agenda Baru
            </button>
          </div>

          {/* ===== SECTION 1: DEADLINE TRACKER ===== */}
          <div className="liquid-glass dark:bg-slate-900/60 dark:border-slate-700/50 p-6 lg:p-8 rounded-3xl spatial-shadow transition-colors">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                  <span className="w-9 h-9 bg-rose-100 dark:bg-rose-500/20 rounded-xl flex items-center justify-center">
                    <BellRing className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </span>
                  Manajemen Deadline Tugas
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 ml-12">Pantau tenggat waktu, otomatis mengingatkan 2 jam sebelum hangus.</p>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-4 py-2 rounded-xl text-sm font-bold shrink-0">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Notifikasi Aktif
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Add Deadline Form */}
              <div className="w-full lg:w-80 shrink-0">
                <form
                  onSubmit={handleAddDeadlineTask}
                  className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm lg:sticky lg:top-24 space-y-4 transition-colors"
                >
                  <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Plus className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> Tugas Baru
                  </h3>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Nama Tugas</label>
                    <input
                      type="text"
                      value={newDeadlineTask}
                      onChange={(e) => setNewDeadlineTask(e.target.value)}
                      placeholder="Mengerjakan laporan..."
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-white text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Deadline</label>
                    <input
                      type="datetime-local"
                      value={newDeadlineTime}
                      onChange={(e) => setNewDeadlineTime(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-slate-700 dark:text-slate-200 text-sm"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Tambahkan
                  </button>
                </form>
              </div>

              {/* Task List */}
              <div className="flex-1 flex flex-col gap-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                {sortedDeadlineTasks.length === 0 ? (
                  <div className="bg-emerald-50/80 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-12 text-center rounded-2xl flex flex-col items-center justify-center min-h-[250px]">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4 shadow-sm">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Tidak Ada Deadline Aktif!</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">Kamu bebas! Semua tugasmu sudah terkendali.</p>
                  </div>
                ) : (
                  sortedDeadlineTasks.map((task) => {
                    const status = calculateDeadlineStatus(task.deadline);
                    const isExpired = new Date(task.deadline).getTime() < new Date().getTime();
                    return (
                      <div
                        key={task.id}
                        className={`group bg-white dark:bg-slate-800 p-4 rounded-2xl border transition-all flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm ${task.completed ? "border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 opacity-60" : isExpired ? "border-rose-200 dark:border-rose-500/30 bg-rose-50/30 dark:bg-rose-500/5" : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md"}`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <button
                            onClick={() => toggleDeadlineTask(task.id)}
                            className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer ${task.completed ? "bg-emerald-500 border-emerald-500" : "border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400"}`}
                          >
                            {task.completed && <Check className="w-3.5 h-3.5 text-white" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-bold text-base leading-tight truncate ${task.completed ? "text-slate-400 dark:text-slate-500 line-through" : "text-slate-800 dark:text-slate-200"}`}>
                              {task.text}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                              <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${task.completed ? "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600" : status.border + " " + status.color + " " + status.bg}`}>
                                <Clock className="w-3 h-3" /> {status.label}
                              </span>
                              <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-medium">
                                <CalendarIcon className="w-3 h-3" />
                                {new Date(task.deadline).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:ml-2">
                          {!task.completed && (
                            <button
                              onClick={() => transferDeadlineTask(task)}
                              className="shrink-0 p-2 text-indigo-500 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-700 dark:hover:text-indigo-300 rounded-xl transition-colors cursor-pointer"
                              title="Kirim ke Matrix"
                            >
                              <MoveRight className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteDeadlineTask(task.id)}
                            className="shrink-0 p-2 text-slate-400 dark:text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-colors cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* ===== DragDropContext wraps Calendar + Matrix ===== */}
          <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>

            {/* ===== SECTION 2: WEEKLY CALENDAR + SCHEDULE ===== */}
            <div className="liquid-glass dark:bg-slate-900/60 dark:border-slate-700/50 rounded-3xl spatial-shadow overflow-hidden transition-colors">
              {/* 7-Day Pill Selector */}
              <div className="p-5 border-b border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="text-base font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" /> Kalender 7-Hari Ke Depan
                </h2>
              </div>
              <div className="flex gap-2 overflow-x-auto p-4 border-b border-slate-100 dark:border-slate-800 custom-scrollbar pb-4">
                {next7Days.map((day, idx) => {
                  const isSelected = isSameDay(day, currentDate);
                  const isToday = isSameDay(day, new Date());
                  const dateKey = day.toISOString().split("T")[0];
                  const blocksCount = (scheduledBlocks[dateKey] || []).length;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentDate(day)}
                      className={`shrink-0 w-[88px] flex flex-col items-center p-3 rounded-2xl transition-all cursor-pointer ${isSelected ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 scale-105" : "bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"}`}
                    >
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-indigo-200" : "text-slate-400 dark:text-slate-500"}`}>
                        {day.toLocaleDateString("id-ID", { weekday: "short" })}
                      </span>
                      <span className="text-2xl font-black my-1">{day.getDate()}</span>
                      {blocksCount > 0 ? (
                        <div className="flex items-center gap-1 text-[10px] font-bold">
                          <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-emerald-400" : "bg-indigo-500 dark:bg-indigo-400"}`}></div>
                          {blocksCount}
                        </div>
                      ) : (
                        <span className={`text-[10px] font-bold ${isSelected ? "text-indigo-300" : "text-slate-400 dark:text-slate-500"}`}>
                          {isToday ? "Hari Ini" : "Kosong"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Schedule Content */}
              <div className="flex flex-col md:flex-row gap-0">
                {/* Timeline */}
                <div className="flex-1 p-6">
                  {/* Energy Barometer */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-5 mb-6 shadow-sm relative overflow-hidden transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-black text-slate-700 dark:text-slate-200 flex items-center gap-2">
                          <Sun className="w-4 h-4 text-amber-500" /> Kapasitas Mental Harian
                        </h3>
                        <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-md border ${isBurnout ? "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20" : currentDailyEnergy >= MAX_DAILY_ENERGY * 0.8 ? "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"}`}>
                          {currentDailyEnergy} / {MAX_DAILY_ENERGY} Koin
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${isBurnout ? "bg-rose-500" : currentDailyEnergy >= MAX_DAILY_ENERGY * 0.8 ? "bg-amber-500" : "bg-emerald-500"}`}
                          style={{ width: `${Math.min((currentDailyEnergy / MAX_DAILY_ENERGY) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1.5">
                          <div className={`p-1 rounded-lg border ${synergyState === "buffed" ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" : synergyState === "debuffed" ? "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20" : "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"}`}>
                            <Sparkles className={`w-3.5 h-3.5 ${synergyState === "buffed" ? "text-emerald-500 dark:text-emerald-400" : synergyState === "debuffed" ? "text-rose-500 dark:text-rose-400" : "text-slate-400 dark:text-slate-500"}`} />
                          </div>
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            Synergy: <span className={synergyState === "buffed" ? "text-emerald-600 dark:text-emerald-400" : synergyState === "debuffed" ? "text-rose-600 dark:text-rose-400" : "text-slate-600 dark:text-slate-300"}>
                              {synergyState === "buffed" ? "ASCENDED (+3)" : synergyState === "debuffed" ? "BURNOUT (-3)" : "NORMAL"}
                            </span>
                          </span>
                        </div>
                        {isBurnout && (
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5" /> Overload!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Schedule Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-black text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> {getDayFormatted(currentDate)}
                    </h2>
                  </div>

                  {/* Timeline Blocks */}
                  <div className="space-y-3">
                    {todayBlocks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl transition-colors">
                        <Sun className="w-10 h-10 text-amber-200 dark:text-amber-500/30 mb-3" />
                        <p className="font-bold text-slate-600 dark:text-slate-400">Hari ini belum ada jadwal.</p>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Seret tugas dari panel kanan ke matrix di bawah, lalu jadwalkan.</p>
                      </div>
                    ) : (
                      todayBlocks.map((block) => {
                        const parentTask = tasks.find((t) => t.id === block.taskId);
                        const resolvedQuadrant = parentTask ? parentTask.quadrant : block.quadrant;
                        const quad = quadrants.find((q) => q.id === resolvedQuadrant) || {
                          title: "Belum diprioritaskan",
                          color: "text-slate-400",
                          bg: "bg-slate-50 dark:bg-slate-800",
                          border: "border-slate-200 dark:border-slate-700",
                        };
                        return (
                          <div
                            key={block.id}
                            // FIX: Diubah dari items-stretch menjadi items-center agar tidak melebar
                            className={`flex items-center gap-4 p-3.5 rounded-2xl border transition-colors hover:shadow-md ${quad.bg} ${quad.border}`}
                          >
                            <div className="flex flex-col items-center justify-center pr-4 border-r border-slate-200/50 dark:border-slate-700/50 shrink-0 min-w-[70px]">
                              <span className="text-base font-black text-slate-700 dark:text-slate-200">{block.time}</span>
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                              <h4 className="font-bold text-slate-800 dark:text-white text-sm">{block.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[9px] font-bold uppercase tracking-wider ${quad.color}`}>{quad.title}</span>
                                <span className="text-slate-300 dark:text-slate-600">•</span>
                                <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 flex items-center gap-0.5">
                                  <Target className="w-3 h-3" /> {block.energy} Koin
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => removeBlock(dateStrKey, block.id)}
                              className="text-slate-300 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 self-center p-1.5 rounded-xl hover:bg-white/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right Panel: Goals & Unassigned Drop Zone */}
                <div className="w-full md:w-72 shrink-0 bg-white/60 dark:bg-slate-800/40 border-t md:border-t-0 md:border-l border-slate-200/60 dark:border-slate-700/60 p-5 flex flex-col gap-6 transition-colors">

                  {/* WIDGET GOALS / TARGET SEMESTER */}
                  <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 dark:from-indigo-600 dark:via-indigo-800 dark:to-violet-900 rounded-[1.5rem] p-5 text-white shadow-lg relative overflow-hidden group transition-colors">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 blur-xl pointer-events-none"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-[9px] font-black uppercase tracking-widest text-indigo-200 dark:text-indigo-300 flex items-center gap-1.5 bg-black/20 dark:bg-black/40 px-2 py-1 rounded-md">
                          <Target className="w-3 h-3 text-amber-300" /> Goal Utama Semester
                        </h3>
                        <button onClick={() => setIsEditingGoal(!isEditingGoal)} className="p-1 hover:bg-white/20 dark:hover:bg-white/10 rounded-md transition-colors cursor-pointer bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10">
                          {isEditingGoal ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Edit2 className="w-3.5 h-3.5 text-indigo-100" />}
                        </button>
                      </div>
                      {isEditingGoal ? (
                        <textarea
                          autoFocus
                          value={globalGoal}
                          onChange={(e) => setGlobalGoal(e.target.value)}
                          onBlur={() => setIsEditingGoal(false)}
                          className="w-full bg-black/20 dark:bg-black/40 text-white text-sm font-bold rounded-xl p-3 outline-none focus:ring-2 focus:ring-white/50 resize-none border border-white/20 dark:border-white/10 custom-scrollbar"
                          rows={3}
                          placeholder="Apa target besarmu semester ini?"
                        />
                      ) : (
                        <p className="text-sm font-bold leading-relaxed shadow-sm cursor-pointer hover:bg-white/5 dark:hover:bg-black/20 p-2 rounded-xl transition-colors -mx-2 border border-transparent hover:border-white/10 dark:hover:border-white/5 line-clamp-3" onClick={() => setIsEditingGoal(true)}>
                          "{globalGoal}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <h3 className="font-bold text-slate-600 dark:text-slate-300 mb-3 flex items-center gap-2 text-sm">
                      <Inbox className="w-4 h-4 text-indigo-400" /> Belum Diprioritaskan
                    </h3>
                    <Droppable droppableId="unassigned">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`space-y-2 overflow-y-auto flex-1 min-h-[120px] max-h-[300px] custom-scrollbar pr-1 transition-colors rounded-xl p-2 ${snapshot.isDraggingOver ? "bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-500/30 border-dashed" : ""}`}
                        >
                          {tasks.filter((t) => !t.completed && t.quadrant === "unassigned").map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={provided.draggableProps.style}
                                  // FIX: Menggunakan items-center
                                  className={`bg-white dark:bg-slate-800 p-3 rounded-xl border shadow-sm flex items-center gap-2 cursor-grab active:cursor-grabbing transition-shadow transition-colors ${snapshot.isDragging ? "border-indigo-400 shadow-xl scale-105 ring-2 ring-indigo-300 z-50 relative" : "border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500/50"}`}
                                >
                                  <GripVertical className="w-4 h-4 text-slate-300 dark:text-slate-500 shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 line-clamp-2 leading-tight">{task.title}</p>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          {tasks.filter((t) => !t.completed && t.quadrant === "unassigned").length === 0 && !snapshot.isDraggingOver && (
                            <div className="text-xs text-slate-400 dark:text-slate-500 text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                              Semua agenda sudah dipetakan! ✅
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== SECTION 3: EISENHOWER MATRIX ===== */}
            <div className="liquid-glass dark:bg-slate-900/60 dark:border-slate-700/50 p-6 lg:p-8 rounded-3xl spatial-shadow transition-colors">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                    <span className="w-9 h-9 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center">
                      <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </span>
                    Balance Priority Matrix
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 ml-12">Seret dan petakan prioritas agendamu di 4 kuadran ini.</p>
                </div>

                <button
                  onClick={clearCompletedTasks}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl text-xs font-bold transition-colors shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Bersihkan Selesai
                </button>
              </div>

              {/* FIX: Menambahkan items-start pada grid container agar quadrant tidak memanjang setara dengan tetangganya */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                {quadrants.map((quad) => (
                  <Droppable droppableId={quad.id} key={quad.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`p-4 rounded-2xl border-2 transition-colors min-h-[220px] flex flex-col ${quad.bg} ${snapshot.isDraggingOver ? "border-indigo-400 border-dashed bg-indigo-50/60 dark:bg-indigo-900/20" : quad.border}`}
                      >
                        <div className="flex items-center gap-2 mb-4 shrink-0">
                          <quad.icon className={`w-5 h-5 ${quad.color}`} />
                          <h3 className={`font-black text-sm ${quad.color}`}>{quad.title}</h3>
                          <span className="ml-auto bg-white/70 dark:bg-slate-900/50 px-2 py-0.5 rounded-md text-xs font-bold text-slate-500 dark:text-slate-400 shadow-sm">
                            {tasks.filter((t) => t.quadrant === quad.id).length}
                          </span>
                        </div>

                        <div className="space-y-2 flex-1">
                          {tasks.filter((t) => t.quadrant === quad.id).map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  style={provided.draggableProps.style}
                                  // FIX: Mengubah items-start menjadi items-center agar proporsional
                                  className={`group bg-white/85 dark:bg-slate-800/85 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-slate-100/80 dark:border-slate-700/80 flex items-center gap-2 transition-shadow transition-colors ${snapshot.isDragging ? "shadow-xl scale-105 ring-2 ring-indigo-400 z-50 relative" : "hover:shadow-md hover:-translate-y-0.5"}`}
                                >
                                  <div {...provided.dragHandleProps} className="text-slate-300 dark:text-slate-500 hover:text-slate-500 cursor-grab active:cursor-grabbing shrink-0">
                                    <GripVertical className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-semibold leading-tight ${task.completed ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-700 dark:text-slate-200"}`}>
                                      {task.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                      <button
                                        onClick={() => openScheduleModal(task)}
                                        className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-500/20 flex items-center gap-1 transition-colors cursor-pointer"
                                      >
                                        <CalendarIcon className="w-3 h-3" /> Jadwalkan
                                      </button>
                                      {task.tag === "Dari Catatan" && (
                                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                                          <Sparkles className="w-3 h-3" /> Catatan
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                    <button
                                      onClick={() => toggleTaskStatus(task.id)}
                                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${task.completed ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" : "text-slate-300 dark:text-slate-500 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"}`}
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => deleteTask(task.id)}
                                      className="p-1.5 rounded-lg text-slate-300 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}

                          {tasks.filter((t) => t.quadrant === quad.id).length === 0 && !snapshot.isDraggingOver && (
                            <div className="text-center py-6 border-2 border-dashed border-slate-200/60 dark:border-slate-700/60 rounded-xl text-slate-400 dark:text-slate-500 text-xs font-medium">
                              Seret tugas ke sini
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </div>

          </DragDropContext>
        </div>
      </div>

      {/* ADD TASK MODAL */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in px-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md p-6 md:p-8 animate-fade-in-up border dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
              Buat Agenda Baru
            </h3>
            <form onSubmit={handleAddTask}>
              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                    Nama Agenda / Tugas
                  </label>
                  <input
                    type="text"
                    required
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Contoh: Meeting dengan Klien"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                    <Target className="w-4 h-4 text-indigo-500" /> Kuras Energi
                  </label>
                  <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mb-3">
                    Berapa koin mental yang dibutuhkan untuk agenda ini?
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: "1", label: "Ringan", icon: "🟢", desc: "1 Koin" },
                      { val: "2", label: "Sedang", icon: "🟡", desc: "2 Koin" },
                      { val: "3", label: "Berat", icon: "🔴", desc: "3 Koin" },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setNewTaskEnergy(opt.val)}
                        className={`flex flex-col items-center p-3 rounded-xl border transition-all cursor-pointer ${newTaskEnergy === opt.val
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 ring-2 ring-indigo-200"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                          } `}
                      >
                        <span className="text-xl mb-1">{opt.icon}</span>
                        <span
                          className={`text-xs font-bold ${newTaskEnergy === opt.val ? "text-indigo-700 dark:text-indigo-400" : "text-slate-600 dark:text-slate-300"} `}
                        >
                          {opt.label}
                        </span>
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${newTaskEnergy === opt.val ? "text-indigo-500 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"} `}
                        >
                          {opt.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  Simpan <MoveRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
        , document.body)
      }

      {/* SCHEDULE MODAL */}
      {showScheduleModal && taskToSchedule && createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in px-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-lg p-8 animate-fade-in-up border border-indigo-50 dark:border-slate-700">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-6">
              Jadwalkan Tugas
            </h3>

            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 mb-6">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 line-clamp-2">
                "{taskToSchedule.title}"
              </p>
            </div>

            <form onSubmit={confirmSchedule}>
              <div className="space-y-5 mb-8">
                <div>
                  <label className="block text-[11px] font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase mb-2">
                    PILIH TANGGAL
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-900 dark:text-indigo-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500 text-lg font-bold transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase mb-2">
                    PUKUL BERAPA?
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      required
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-900 dark:text-indigo-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500 text-lg font-bold transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-6 py-3 rounded-2xl font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
                >
                  <CheckCircle className="w-5 h-5" /> Masukkan Kalender
                </button>
              </div>
            </form>
          </div>
        </div>
        , document.body)
      }

      {/* Notification Toast */}
      {notif && createPortal(
        <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-6 py-3 rounded-2xl shadow-2xl animate-fade-in-up z-[300] flex items-center gap-3 font-bold">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          {notif}
        </div>
        , document.body)
      }

      {/* Reminder Notification Modal */}
      {activeAlert && createPortal(
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-[2rem] p-8 shadow-2xl border-4 border-orange-100 dark:border-slate-700 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-500/20 text-orange-500 dark:text-orange-400 rounded-full flex items-center justify-center mb-6">
              <BellRing className="w-10 h-10 animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
              Peringatan Deadline!
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Tugas <strong className="text-slate-800 dark:text-slate-200">{activeAlert.text}</strong> harus selesai dalam waktu kurang dari 2 Jam!
            </p>

            <div className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 mb-8 flex justify-between items-center text-left">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">
                  Tenggat Waktu
                </p>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {new Date(activeAlert.deadline).toLocaleString("id-ID", {
                    timeStyle: "short",
                    dateStyle: "medium",
                  })}
                </p>
              </div>
              <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>

            <button
              onClick={() => setActiveAlert(null)}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/30 cursor-pointer hover:scale-105"
            >
              Selesaikan Nanti (Tutup)
            </button>
          </div>
        </div>
        , document.body)
      }
    </>
  );
};

export default TimeManager;