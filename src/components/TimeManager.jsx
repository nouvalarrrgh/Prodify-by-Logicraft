import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  AlertCircle,
  Trash2,
  GripVertical,
  Calendar as CalendarIcon,
  Target,
  Inbox,
  Sun,
  Moon,
  Sparkles,
  MoveRight,
  Layers,
  X,
  BellRing,
  Check,
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
  const [newTaskEnergy, setNewTaskEnergy] = useState("1"); // 1=Low, 2=Med, 3=High

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

  // Notifications
  const [notif, setNotif] = useState(null);

  // --- SYNERGY STATE (From Habits.jsx) ---
  const [synergyState, setSynergyState] = useState(() => {
    return localStorage.getItem("stuprod_balance_state") || "balanced"; // buffed, debuffed, balanced
  });

  // Dynamic Daily Energy Capacity based on Balance Synergy
  const MAX_DAILY_ENERGY =
    synergyState === "buffed" ? 13 : synergyState === "debuffed" ? 7 : 10;

  // --- DEADLINE MANAGER STATES ---
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
          // If within 2 hours
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
    notifySound
      .play()
      .catch((e) => console.log("Audio autoplay prevented:", e));
    setActiveAlert(task);
  };

  // --- DEADLINE FUNCTIONS ---
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
      energy: 2, // Default to medium energy for transferred deadlines
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
        color: "text-rose-600 bg-rose-50",
        border: "border-rose-200",
      };
    if (timeDiff <= 7200000)
      return {
        label: "Mendesak (< 2 Jam)",
        color: "text-orange-600 bg-orange-50",
        border: "border-orange-200",
      };
    if (timeDiff <= 86400000)
      return {
        label: "Hari Ini",
        color: "text-amber-600 bg-amber-50",
        border: "border-amber-200",
      };
    return {
      label: "Aman",
      color: "text-emerald-600 bg-emerald-50",
      border: "border-emerald-200",
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

    // Chain directly into schedule modal!
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

    // Also remove from schedule if exists
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
      // Reorder in same quadrant
      const items = Array.from(tasks.filter((t) => t.quadrant === sourceQuad));
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      const newTasks = tasks.map((t) =>
        t.quadrant === sourceQuad ? items.shift() : t,
      );
      setTasks(newTasks);
    } else {
      // Move to different quadrant
      setTasks(
        tasks.map((t) =>
          t.id === result.draggableId ? { ...t, quadrant: destQuad } : t,
        ),
      );
    }
  };

  // --- 4. CALENDAR FUNCTIONS ---
  const openScheduleModal = (task) => {
    setTaskToSchedule(task);
    setShowScheduleModal(true);
  };

  const confirmSchedule = (e) => {
    e.preventDefault();
    const dateStr = scheduleDate;

    const newBlock = {
      id: Date.now().toString(),
      taskId: taskToSchedule.id,
      title: taskToSchedule.title,
      time: scheduleTime,
      quadrant: taskToSchedule.quadrant,
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
    showNotification(`Tugas dijadwalkan pada jam ${scheduleTime}`);
  };

  const removeBlock = (dateStr, blockId) => {
    setScheduledBlocks({
      ...scheduledBlocks,
      [dateStr]: scheduledBlocks[dateStr].filter((b) => b.id !== blockId),
    });
  };

  // --- 5. RENDER HELPERS ---
  const quadrants = [
    {
      id: "urgent-important",
      title: "Lakukan Sekarang",
      icon: AlertTriangle,
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-200",
    },
    {
      id: "not-urgent-important",
      title: "Jadwalkan",
      icon: Target,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      id: "urgent-not-important",
      title: "Delegasikan/Bantuan",
      icon: AlertCircle,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    {
      id: "not-urgent-not-important",
      title: "Tunda/Hapus",
      icon: Trash2,
      color: "text-slate-600",
      bg: "bg-slate-50",
      border: "border-slate-200",
    },
  ];

  const getDayFormatted = (date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const dateStrKey = currentDate.toISOString().split("T")[0];
  const todayBlocks = scheduledBlocks[dateStrKey] || [];

  // Generate Next 7 Days
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
  const energyPercentage = Math.min(
    (currentDailyEnergy / MAX_DAILY_ENERGY) * 100,
    100,
  );

  let energyColor = "bg-emerald-500 text-emerald-700";
  let barometerStatus = "Kapasitas mental optimal (Aman)";
  let isBurnout = false;

  if (currentDailyEnergy > MAX_DAILY_ENERGY) {
    energyColor = "bg-rose-500 text-rose-700";
    barometerStatus = "Bahaya Burnout! Melebihi batas energi mental.";
    isBurnout = true;
  } else if (currentDailyEnergy >= MAX_DAILY_ENERGY * 0.8) {
    // 80% of max
    energyColor = "bg-amber-500 text-amber-700";
    barometerStatus = "Hampir penuh. Selipkan istirahat ekstra.";
  }

  return (
    <div className="h-full flex flex-col items-center justify-start p-4 py-8 md:p-8 animate-fade-in custom-scrollbar overflow-y-auto">
      <div className="w-full max-w-6xl mx-auto space-y-12">
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row items-center justify-between liquid-glass p-4 rounded-3xl spatial-shadow gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-2xl">
              <Layers className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                Time & Task Hub
              </h1>
              <p className="text-sm font-medium text-slate-500">
                Prioritaskan di Matrix, Eksekusi di Kalender.
              </p>
            </div>
          </div>

          <div className="flex bg-slate-100/50 p-1.5 rounded-2xl w-full md:w-auto backdrop-blur-sm">
            <div className="px-6 py-2.5 rounded-xl font-bold bg-white/80 text-indigo-700 shadow-sm flex items-center gap-2">
              <Target className="w-4 h-4" /> Workspace Terpadu
            </div>
          </div>
        </div>

        {/* --- 1. VIEW: TASK DEADLINE MANAGER --- */}
        <div className="liquid-glass p-6 lg:p-8 rounded-3xl spatial-shadow animate-fade-in-up flex flex-col gap-6 w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Manajemen Deadline Tugas
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Pantau tenggat waktu tugasmu, otomatis mengingatkan 2 Jam
                sebelum hangus!
              </p>
            </div>
            <div className="flex bg-indigo-50 p-3 rounded-2xl border border-indigo-100 items-center justify-center">
              <BellRing className="w-6 h-6 text-indigo-500 mr-3 animate-pulse" />
              <div className="text-sm">
                <p className="font-bold text-indigo-700">Sistem Notifikasi</p>
                <p className="text-indigo-600/80 text-xs text-left">
                  Peringatan otomatis aktif
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Add Task Form */}
            <div className="w-full xl:w-1/3">
              <form
                onSubmit={handleAddDeadlineTask}
                className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white spatial-shadow lg:sticky lg:top-10"
              >
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-500" />
                  Tambah Tugas Baru
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Nama Tugas
                    </label>
                    <input
                      type="text"
                      value={newDeadlineTask}
                      onChange={(e) => setNewDeadlineTask(e.target.value)}
                      placeholder="Mengerjakan laporan..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Deadline (Tenggat Waktu)
                    </label>
                    <input
                      type="datetime-local"
                      value={newDeadlineTime}
                      onChange={(e) => setNewDeadlineTime(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-slate-700"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full mt-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" /> Tabung Tugas
                  </button>
                </div>
              </form>
            </div>

            {/* Task List */}
            <div className="w-full xl:w-2/3 flex flex-col gap-4">
              {sortedDeadlineTasks.length === 0 ? (
                <div className="bg-slate-50 p-12 text-center rounded-2xl border border-slate-200 flex flex-col items-center justify-center w-full min-h-[300px]">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">
                    Tidak Ada Deadline!
                  </h3>
                  <p className="text-slate-500 mt-2">
                    Bagus sekali! Semua tugasmu sudah selesai, wani santai
                    sejenak.
                  </p>
                </div>
              ) : (
                sortedDeadlineTasks.map((task) => {
                  const status = calculateDeadlineStatus(task.deadline);
                  const isExpired =
                    new Date(task.deadline).getTime() < new Date().getTime();

                  return (
                    <div
                      key={task.id}
                      className={`group bg-white p-5 rounded-2xl border transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between ${task.completed ? "border-slate-100 bg-slate-50/50 opacity-60" : isExpired ? "border-rose-200" : "border-slate-200 hover:border-indigo-300"}`}
                    >
                      <button
                        onClick={() => toggleDeadlineTask(task.id)}
                        className={`mt-1 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? "bg-emerald-500 border-emerald-500" : "border-slate-300 hover:border-indigo-500"}`}
                      >
                        {task.completed && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </button>

                      <div className="flex flex-col flex-1">
                        <h4
                          className={`font-bold text-lg leading-tight ${task.completed ? "text-slate-400 line-through" : "text-slate-800"}`}
                        >
                          {task.text}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-semibold">
                          <div
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${task.completed ? "bg-slate-100 text-slate-500 border-slate-200" : status.border + " " + status.color}`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            {status.label}
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            {new Date(task.deadline).toLocaleString("id-ID", {
                              dateStyle: "long",
                              timeStyle: "short",
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center sm:ml-4 sm:flex-col sm:gap-2">
                        <button
                          onClick={() => transferDeadlineTask(task)}
                          className="shrink-0 p-2 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                          title="Kirim ke Agenda / Matrix"
                        >
                          <MoveRight className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteDeadlineTask(task.id)}
                          className="shrink-0 p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                          title="Hapus Tugas"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Wrapping Calendar and Matrix in Context to enable cross-view dragging */}
        <DragDropContext onDragEnd={onDragEnd}>
          {/* --- 2. VIEW: WEEKLY CALENDAR & SCHEDULE --- */}
          <div className="pt-8 border-t border-slate-200 animate-fade-in-up space-y-6">
            {/* Weekly Horizontal Calendar */}
            <div className="liquid-glass rounded-3xl p-4 spatial-shadow">
              <div className="flex justify-between items-center mb-4 px-2">
                <h2 className="text-lg font-bold text-slate-700">
                  Kalender 7-Hari Ke Depan
                </h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                  <Plus className="w-4 h-4" /> Tambah Agenda
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2 px-2">
                {next7Days.map((day, idx) => {
                  const isSelected = isSameDay(day, currentDate);
                  const isToday = isSameDay(day, new Date());
                  const dateKey = day.toISOString().split("T")[0];
                  const blocksCount = (scheduledBlocks[dateKey] || []).length;

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentDate(day)}
                      className={`flex-shrink-0 w-[100px] flex flex-col items-center p-3 rounded-2xl transition-all cursor-pointer ${isSelected ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105" : "bg-slate-50 hover:bg-indigo-50 text-slate-600 border border-slate-200"}`}
                    >
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-indigo-200" : "text-slate-400"}`}
                      >
                        {day.toLocaleDateString("id-ID", { weekday: "short" })}
                      </span>
                      <span className="text-2xl font-black my-1">
                        {day.getDate()}
                      </span>
                      {blocksCount > 0 ? (
                        <div className="flex items-center gap-1 text-[10px] font-bold">
                          <div
                            className={`w-2 h-2 rounded-full ${isSelected ? "bg-emerald-400" : "bg-indigo-500"}`}
                          ></div>
                          {blocksCount} agenda
                        </div>
                      ) : (
                        <span
                          className={`text-[10px] font-bold ${isSelected ? "text-indigo-300" : "text-slate-400"}`}
                        >
                          {isToday ? "Hari Ini" : "Kosong"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Daily Schedule Split */}
            <div className="liquid-glass rounded-3xl p-6 spatial-shadow flex flex-col md:flex-row gap-8">
              {/* Left side: Timeline */}
              <div className="flex-1">
                <div className="flex flex-col mb-6 border-b border-slate-100 pb-4 gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                      <Clock className="w-6 h-6 text-indigo-600" />
                      Jadwal: {getDayFormatted(currentDate)}
                    </h2>
                  </div>

                  {/* Capacity Barometer & Burnout Warning */}
                  <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200/50 mt-6 animate-fade-in-up relative overflow-hidden spatial-hover">
                    {/* Subtle aesthetic element in the background */}
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                      <Sun className="w-48 h-48 text-indigo-900" />
                    </div>

                    <div className="relative z-10">
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <h3 className="text-slate-800 text-lg font-black flex items-center gap-2">
                            <Sun className="w-5 h-5 text-amber-500" />
                            Capacity Barometer
                          </h3>
                          <p className="text-slate-500 text-xs mt-1 font-medium">
                            Kapasitas mental harianmu berdasarkan Koin Energi.
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-black text-indigo-700">
                            {currentDailyEnergy}
                          </span>
                          <span className="text-slate-400 font-bold">
                            {" "}
                            / {MAX_DAILY_ENERGY}
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${energyColor}`}
                          style={{
                            width: `${Math.min((currentDailyEnergy / MAX_DAILY_ENERGY) * 100, 100)}%`,
                          }}
                        >
                          <div className="w-full h-full bg-white/20 animate-pulse"></div>
                        </div>
                      </div>

                      {isBurnout && (
                        <div className="mt-4 bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-start gap-3 animate-pulse">
                          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-rose-800 font-bold text-sm">
                              PERINGATAN: Overload Kapasitas!
                            </p>
                            <p className="text-rose-600/80 text-xs mt-1">
                              Beban kerjamu hari ini melebihi ambang batas.
                              Riskan Burnout.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Synergy State Indicator */}
                      <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-1.5 rounded-lg border ${synergyState === "buffed" ? "bg-emerald-50 border-emerald-200" : synergyState === "debuffed" ? "bg-rose-50 border-rose-200" : "bg-slate-50 border-slate-200"}`}
                          >
                            <Sparkles
                              className={`w-4 h-4 ${synergyState === "buffed" ? "text-emerald-500" : synergyState === "debuffed" ? "text-rose-500" : "text-slate-400"}`}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-500">
                            Life-RPG Synergy:{" "}
                            <span
                              className={
                                synergyState === "buffed"
                                  ? "text-emerald-600 uppercase"
                                  : synergyState === "debuffed"
                                    ? "text-rose-600 uppercase"
                                    : "text-slate-500 uppercase"
                              }
                            >
                              {synergyState === "buffed"
                                ? "ASCENDED (+3 Koin)"
                                : synergyState === "debuffed"
                                  ? "BURNOUT (-3 Koin)"
                                  : "NORMAL (10 Koin)"}
                            </span>
                          </span>
                        </div>
                        <div className="text-[10px] font-medium text-slate-400 sm:text-right max-w-xs leading-tight">
                          Kapasitas maksimal dipengaruhi oleh keseimbangan
                          rutinitas (Habits) harianmu.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {todayBlocks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                      <Sun className="w-12 h-12 text-amber-200 mb-4" />
                      <p className="font-bold">Hari ini belum ada jadwal.</p>
                      <p className="text-sm">
                        Buka tab Priority Matrix untuk menarik tugas ke
                        kalender.
                      </p>
                    </div>
                  ) : (
                    todayBlocks.map((block) => {
                      const parentTask = tasks.find(
                        (t) => t.id === block.taskId,
                      );
                      const resolvedQuadrant = parentTask
                        ? parentTask.quadrant
                        : block.quadrant;
                      const quad = quadrants.find(
                        (q) => q.id === resolvedQuadrant,
                      ) || {
                        title: "Belum diprioritaskan",
                        color: "text-slate-400",
                        bg: "bg-slate-50",
                        border: "border-slate-200",
                      };

                      return (
                        <div
                          key={block.id}
                          className={`flex items-stretch gap-4 p-4 rounded-2xl border ${quad.bg} ${quad.border} transition-all hover:scale-[1.01]`}
                        >
                          <div className="flex flex-col items-center justify-center pr-4 border-r border-slate-200/50 min-w-[80px]">
                            <span className="text-lg font-black text-slate-700">
                              {block.time}
                            </span>
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                            <h4 className="font-bold text-slate-800">
                              {block.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider ${quad.color}`}
                              >
                                {quad.title}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="text-[10px] font-bold text-indigo-500 flex items-center gap-0.5">
                                <Target className="w-3 h-3" /> {block.energy}{" "}
                                Koin
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeBlock(dateStrKey, block.id)}
                            className="text-slate-400 hover:text-rose-500 self-center p-2 rounded-xl hover:bg-white/50 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right side: Unmapped Agendas */}
              <div className="w-full md:w-80 shrink-0 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-indigo-500" />
                  Belum Diprioritaskan
                </h3>

                <Droppable droppableId="unassigned">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-3 custom-scrollbar overflow-y-auto min-h-[100px] max-h-[500px] pr-1 transition-colors ${snapshot.isDraggingOver ? "bg-indigo-50/50 rounded-xl" : ""}`}
                    >
                      {tasks
                        .filter(
                          (t) => !t.completed && t.quadrant === "unassigned",
                        )
                        .map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white p-3 rounded-xl border shadow-sm flex flex-col items-start gap-2 cursor-grab active:cursor-grabbing transition-all ${snapshot.isDragging ? "border-indigo-400 shadow-xl scale-105" : "border-slate-100"}`}
                              >
                                <div className="flex w-full items-start gap-2">
                                  <GripVertical className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-700 line-clamp-2">
                                      {task.title}
                                    </p>
                                    <span className="text-[10px] font-bold text-slate-400 mt-1 block">
                                      Seret ke Matrix di Bawah
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}

                      {tasks.filter(
                        (t) => !t.completed && t.quadrant === "unassigned",
                      ).length === 0 &&
                        !snapshot.isDraggingOver && (
                          <div className="text-xs text-slate-500 text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                            Semua agenda sudah dipetakan!
                          </div>
                        )}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          </div>

          {/* --- 3. VIEW: BALANCE MATRIX --- */}
          <div className="liquid-glass p-6 lg:p-8 rounded-3xl spatial-shadow animate-fade-in-up mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Eisenhower Priority Board
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Seret dan petakan prioritas agenda serta tugasmu di sini.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quadrants.map((quad) => (
                <Droppable droppableId={quad.id} key={quad.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-4 rounded-3xl border-2 transition-colors min-h-[250px] ${quad.bg} ${snapshot.isDraggingOver ? "border-indigo-400 border-dashed bg-indigo-50/50" : quad.border}`}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <quad.icon className={`w-5 h-5 ${quad.color}`} />
                        <h3 className={`font-bold ${quad.color}`}>
                          {quad.title}
                        </h3>
                        <span className="ml-auto bg-white/60 px-2 py-0.5 rounded-md text-xs font-bold text-slate-500">
                          {tasks.filter((t) => t.quadrant === quad.id).length}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {tasks
                          .filter((t) => t.quadrant === quad.id)
                          .map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`group bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-3 transition-all ${snapshot.isDragging ? "shadow-xl scale-105 ring-2 ring-indigo-500" : "hover:shadow-md hover:-translate-y-0.5"}`}
                                >
                                  <div
                                    {...provided.dragHandleProps}
                                    className="mt-1 text-slate-300 hover:text-slate-500"
                                  >
                                    <GripVertical className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1">
                                    <p
                                      className={`text-sm font-semibold transition-all ${task.completed ? "line-through text-slate-400" : "text-slate-700"}`}
                                    >
                                      {task.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <button
                                        onClick={() => openScheduleModal(task)}
                                        className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md hover:bg-indigo-100 flex items-center gap-1 transition-colors"
                                      >
                                        <CalendarIcon className="w-3 h-3" />{" "}
                                        Jadwalkan
                                      </button>
                                      {task.tag === "Dari Catatan" && (
                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1">
                                          <Sparkles className="w-3 h-3" />{" "}
                                          Catatan
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => toggleTaskStatus(task.id)}
                                      className={`p-1.5 rounded-lg transition-colors ${task.completed ? "text-emerald-500 bg-emerald-50" : "text-slate-400 hover:text-emerald-500 hover:bg-emerald-50"}`}
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => deleteTask(task.id)}
                                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}

                        {tasks.filter((t) => t.quadrant === quad.id).length ===
                          0 &&
                          !snapshot.isDraggingOver && (
                            <div className="text-center py-6 border-2 border-dashed border-slate-200/50 rounded-2xl text-slate-400 text-xs font-medium">
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

      {/* ADD TASK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              Buat Agenda Baru
            </h3>
            <form onSubmit={handleAddTask}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Nama Agenda / Tugas
                  </label>
                  <input
                    type="text"
                    required
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Contoh: Meeting dengan Klien"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-2">
                    <Target className="w-4 h-4 text-indigo-500" /> Kuras Energi
                  </label>
                  <p className="text-[10px] font-medium text-slate-400 mb-2">
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
                        className={`flex flex-col items-center p-3 rounded-xl border transition-all ${newTaskEnergy === opt.val
                          ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
                          : "border-slate-200 bg-white hover:bg-slate-50 text-slate-500"
                          }`}
                      >
                        <span className="text-xl mb-1">{opt.icon}</span>
                        <span
                          className={`text-xs font-bold ${newTaskEnergy === opt.val ? "text-indigo-700" : "text-slate-600"}`}
                        >
                          {opt.label}
                        </span>
                        <span
                          className={`text-[10px] ${newTaskEnergy === opt.val ? "text-indigo-500" : "text-slate-400"}`}
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
                  className="px-5 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md flex items-center gap-2"
                >
                  Lanjut Jadwalkan <MoveRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCHEDULE MODAL */}
      {showScheduleModal && taskToSchedule && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in px-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 animate-fade-in-up border border-indigo-50">
            <h3 className="text-2xl font-black text-slate-800 mb-6">
              Jadwalkan Tugas
            </h3>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
              <p className="text-sm font-medium text-slate-600 line-clamp-2">
                "{taskToSchedule.title}"
              </p>
            </div>

            <form onSubmit={confirmSchedule}>
              <div className="space-y-5 mb-8">
                <div>
                  <label className="block text-[11px] font-black tracking-widest text-slate-500 uppercase mb-2">
                    PILIH TANGGAL
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 text-indigo-900 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white text-lg font-bold transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black tracking-widest text-slate-500 uppercase mb-2">
                    PUKUL BERAPA?
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      required
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 text-indigo-900 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white text-lg font-bold transition-all shadow-sm"
                      style={{ colorScheme: "light" }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-6 py-3 rounded-2xl font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <CheckCircle className="w-5 h-5" /> Masukkan Kalender
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notif && (
        <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-6 py-3 rounded-2xl shadow-2xl animate-fade-in-up z-[200] flex items-center gap-3 font-bold">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          {notif}
        </div>
      )}
      {/* Reminder Notification Modal */}
      {activeAlert && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white max-w-md w-full rounded-[2rem] p-8 shadow-2xl border-4 border-orange-100 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-6">
              <BellRing className="w-10 h-10 animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">
              Peringatan Deadline!
            </h2>
            <p className="text-slate-500 mb-6">
              Tugas{" "}
              <strong className="text-slate-800">{activeAlert.text}</strong>{" "}
              harus selesai dalam waktu kurang dari 2 Jam!
            </p>

            <div className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 mb-8 flex justify-between items-center text-left">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">
                  Tenggat Waktu
                </p>
                <p className="font-bold text-slate-800">
                  {new Date(activeAlert.deadline).toLocaleString("id-ID", {
                    timeStyle: "short",
                    dateStyle: "medium",
                  })}
                </p>
              </div>
              <Clock className="w-8 h-8 text-slate-300" />
            </div>

            <button
              onClick={() => setActiveAlert(null)}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/30 cursor-pointer hover:scale-105"
            >
              Selesaikan Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeManager;
