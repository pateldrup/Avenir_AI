import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import {
  LayoutDashboard, Upload, FileText, GitCompare, ClipboardList, Mic,
  History, BarChart2, Settings, Search, Bell, Moon, Sun, ChevronRight,
  TrendingUp, AlertTriangle, ShieldCheck, Clock, MoreVertical,
  CloudUpload, PlayCircle, Sparkles, ArrowRight, FileUp, Briefcase,
  Edit, Trash2, Share2, X, Menu,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts';

/* ─── Mock Data ─── */
const lineData = [
  { date: 'Jun 10', score: 52 }, { date: 'Jun 13', score: 55 },
  { date: 'Jun 16', score: 58 }, { date: 'Jun 19', score: 61 },
  { date: 'Jun 22', score: 65 }, { date: 'Jun 25', score: 70 },
  { date: 'Jun 28', score: 72 }, { date: 'Jul 01', score: 74 },
  { date: 'Jul 04', score: 76 }, { date: 'Jul 07', score: 78 },
];
const barData = [
  { category: 'Technical', score: 82 }, { category: 'Communication', score: 68 },
  { category: 'Leadership', score: 55 }, { category: 'Problem-Solving', score: 74 },
];
const interviewHistory = [
  { topic: 'System Design', score: '8/10', date: 'Jul 8, 2024', colorClass: 'text-[#2563EB]' },
  { topic: 'Behavioral Questions', score: '9/10', date: 'Jul 5, 2024', colorClass: 'text-[#7C3AED]' },
  { topic: 'Technical Deep-Dive', score: '7/10', date: 'Jul 1, 2024', colorClass: 'text-[#10B981]' },
];
const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'upload', label: 'Upload Resume', icon: Upload },
  { id: 'job', label: 'Job Description', icon: FileText },
  { id: 'gap', label: 'Gap Analysis', icon: GitCompare },
  { id: 'prep', label: 'Prep Plan', icon: ClipboardList },
  { id: 'interview', label: 'Mock Interview', icon: Mic },
  { id: 'history', label: 'History', icon: History },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
];
const BAR_COLORS = ['#2563EB', '#4F46E5', '#7C3AED', '#10B981'];
const SPARKLINE = [40, 55, 48, 62, 58, 72, 78];
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, suffix = '', duration = 1.2 }) {
  const motionVal = useMotionValue(0);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const ctrl = animate(motionVal, target, {
      duration, ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return ctrl.stop;
  }, []);
  return <span>{display}{suffix}</span>;
}

/* ─── Circular Progress ─── */
function CircularProgress({ percentage = 70, size = 140, strokeWidth = 10 }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percentage / 100) * circ;
  return (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90">
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" /><stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={strokeWidth} />
        <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#ringGrad)"
          strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.6 }} />
      </svg>
      <div className="z-10 flex flex-col items-center">
        <span className="text-2xl font-extrabold text-[#111827]">{percentage}%</span>
        <span className="text-[11px] font-medium text-[#6B7280]">Ready</span>
      </div>
    </div>
  );
}

/* ─── Custom Tooltips ─── */
function LineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-md border border-[#E5E7EB] rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-bold text-[#111827]">{label}</p>
      <p className="text-[#2563EB] font-semibold">Score: {payload[0].value}%</p>
    </div>
  );
}
function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-md border border-[#E5E7EB] rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-bold text-[#111827]">{label}</p>
      <p className="text-[#7C3AED] font-semibold">Score: {payload[0].value}%</p>
    </div>
  );
}

/* ─── Kebab Menu ─── */
function KebabMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(p => !p)}
        className="p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors cursor-pointer text-[#6B7280]">
        <MoreVertical size={16} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, scale: 0.92, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -4 }} transition={{ duration: 0.14 }}
            className="absolute right-0 top-8 z-50 w-36 bg-white/95 backdrop-blur-lg border border-[#E5E7EB] rounded-xl shadow-xl overflow-hidden">
            {[{ label: 'Edit', icon: Edit }, { label: 'Delete', icon: Trash2 }, { label: 'Share', icon: Share2 }].map(({ label, icon: Icon }) => (
              <button key={label}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-[#111827] hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                <Icon size={13} className="text-[#6B7280]" />{label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Notification Bell ─── */
function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const notes = [
    { text: '3 new job matches found', time: '2 min ago', unread: true },
    { text: 'Resume analysis complete', time: '1 hr ago', unread: true },
    { text: 'Interview session reminder', time: 'Yesterday', unread: false },
  ];
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(p => !p)} id="notification-btn"
        className="relative p-2 rounded-full hover:bg-[#F3F4F6] transition-colors cursor-pointer text-[#6B7280]">
        <Bell size={20} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-white" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, scale: 0.95, y: -6 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }} transition={{ duration: 0.16 }}
            className="absolute right-0 top-11 z-50 w-72 bg-white/95 backdrop-blur-xl border border-[#E5E7EB] rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
              <span className="text-xs font-bold text-[#111827]">Notifications</span>
              <button onClick={() => setOpen(false)} className="text-[#6B7280] hover:text-[#111827] cursor-pointer"><X size={14} /></button>
            </div>
            {notes.map((n, i) => (
              <div key={i} className={`flex items-start gap-3 px-4 py-3 hover:bg-[#F8FAFC] transition-colors ${n.unread ? 'bg-blue-50/50' : ''}`}>
                <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${n.unread ? 'bg-[#2563EB]' : 'bg-[#E5E7EB]'}`} />
                <div>
                  <p className="text-xs font-medium text-[#111827]">{n.text}</p>
                  <p className="text-[10px] text-[#6B7280] mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
            <div className="px-4 py-2.5 border-t border-[#E5E7EB]">
              <button className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer">View all notifications</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Profile Dropdown ─── */
function ProfileDropdown({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(p => !p)} id="profile-btn" className="flex items-center gap-2.5 cursor-pointer">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md select-none"
          style={{ background: 'linear-gradient(135deg,#2563EB,#7C3AED)' }}>AM</div>
        <div className="hidden lg:block text-left">
          <p className="text-sm font-bold text-[#111827] leading-tight">Alex Mercer</p>
          <p className="text-[10px] font-bold uppercase tracking-wider"
            style={{ background: 'linear-gradient(135deg,#F59E0B,#EF4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Premium Member
          </p>
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, scale: 0.95, y: -6 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }} transition={{ duration: 0.16 }}
            className="absolute right-0 top-12 z-50 w-48 bg-white/95 backdrop-blur-xl border border-[#E5E7EB] rounded-xl shadow-2xl overflow-hidden">
            {['My Profile', 'Account Settings', 'Billing'].map(item => (
              <button key={item} className="w-full text-left px-4 py-2.5 text-xs font-medium text-[#111827] hover:bg-[#F8FAFC] transition-colors cursor-pointer">{item}</button>
            ))}
            <div className="border-t border-[#E5E7EB]" />
            <button onClick={() => onNavigate('landing')}
              className="w-full text-left px-4 py-2.5 text-xs font-medium text-[#EF4444] hover:bg-red-50 transition-colors cursor-pointer">
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════ MAIN DASHBOARD ═══════════════ */
export default function DashboardPage({ onNavigate }) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = document.getElementById('dash-scroll');
    if (!el) return;
    const h = () => setScrolled(el.scrollTop > 10);
    el.addEventListener('scroll', h);
    return () => el.removeEventListener('scroll', h);
  }, []);

  const containerVar = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } };
  const itemVar = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: 'easeOut' } } };
  const cardHover = { y: -4, boxShadow: '0 20px 50px rgba(37,99,235,0.15)', transition: { duration: 0.2 } };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
      className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/30 z-30 lg:hidden" />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside className={`fixed lg:static z-40 h-full w-[260px] bg-white border-r border-[#E5E7EB] flex flex-col shrink-0 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        <div className="px-6 pt-6 pb-5 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
              style={{ background: 'linear-gradient(135deg,#2563EB,#7C3AED)' }}>
              <LayoutDashboard size={15} className="text-white" />
            </div>
            <div>
              <p className="text-base font-extrabold text-[#2563EB] leading-tight">ResumeAI</p>
              <p className="text-[10px] font-medium text-[#6B7280]">Enterprise Tier</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = activeNav === id;
            return (
              <motion.button key={id} whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }}
                onClick={() => { setActiveNav(id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer
                  ${active ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold' : 'text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#111827]'}`}>
                <Icon size={18} className={active ? 'text-[#2563EB]' : 'text-[#9CA3AF]'} />
                {label}
                {active && (
                  <motion.div layoutId="navPill" className="ml-auto w-1.5 h-5 rounded-full"
                    style={{ background: 'linear-gradient(to bottom,#2563EB,#7C3AED)' }} />
                )}
              </motion.button>
            );
          })}
        </nav>

        <div className="px-3 pb-5 pt-3 border-t border-[#E5E7EB] space-y-1">
          <motion.button whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(37,99,235,0.35)' }} whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl text-sm font-bold text-white cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#2563EB,#7C3AED)' }}>
            Upgrade to Pro
          </motion.button>
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#111827] transition-colors cursor-pointer">
            <Settings size={16} />Settings
          </button>
        </div>
      </aside>

      {/* RIGHT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* TOP NAVBAR */}
        <header className={`sticky top-0 z-20 flex items-center gap-4 px-5 lg:px-8 py-3 bg-white/70 backdrop-blur-lg border-b border-[#E5E7EB] transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280] cursor-pointer">
            <Menu size={20} />
          </button>
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input type="text" placeholder="Search insights..."
              className="w-full pl-9 pr-4 py-2 bg-[#F3F4F6] rounded-full text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#2563EB]/25 transition-all" />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <NotificationBell />
            <motion.button whileTap={{ scale: 0.88 }} onClick={() => setDarkMode(p => !p)} id="dark-mode-toggle"
              className="p-2 rounded-full hover:bg-[#F3F4F6] transition-colors cursor-pointer text-[#6B7280]">
              <AnimatePresence mode="wait" initial={false}>
                {darkMode
                  ? <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><Sun size={20} /></motion.span>
                  : <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><Moon size={20} /></motion.span>
                }
              </AnimatePresence>
            </motion.button>
            <div className="w-px h-7 bg-[#E5E7EB] mx-1" />
            <ProfileDropdown onNavigate={onNavigate} />
          </div>
        </header>

        {/* MAIN SCROLLABLE */}
        <main id="dash-scroll" className="flex-1 overflow-y-auto px-5 lg:px-10 py-8">
          <motion.div variants={containerVar} initial="hidden" animate="visible" className="max-w-[1400px] mx-auto">

            {/* 1. WELCOME */}
            <motion.div variants={itemVar} className="mb-8">
              <h1 className="text-3xl lg:text-[2.2rem] font-extrabold text-[#111827] tracking-tight">
                Welcome back,{' '}
                <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.5 }}
                  style={{ background: 'linear-gradient(135deg,#2563EB,#7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Alex.
                </motion.span>
              </h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
                className="flex flex-wrap items-center gap-1.5 mt-2 text-[#6B7280] font-medium text-sm lg:text-base">
                <motion.span animate={{ scale: [1, 1.25, 1] }} transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}>
                  <Sparkles size={16} className="text-[#F59E0B]" />
                </motion.span>
                {`Your AI Coach is ready. We've identified `}
                <span className="font-extrabold text-base"
                  style={{ background: 'linear-gradient(135deg,#2563EB,#7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>3</span>
                {` new opportunities since your last visit.`}
              </motion.p>
            </motion.div>

            {/* 2. STAT CARDS */}
            <motion.div variants={itemVar} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Match Score */}
              <motion.div whileHover={cardHover} className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] relative overflow-hidden cursor-default">
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}>+4%</div>
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center mb-3">
                  <TrendingUp size={20} className="text-[#2563EB]" />
                </div>
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">Match Score</p>
                <p className="text-3xl font-extrabold text-[#111827]"><AnimatedCounter target={78} suffix="%" /></p>
              </motion.div>

              {/* Missing Skills */}
              <motion.div whileHover={cardHover} className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] flex items-center justify-center mb-3">
                  <AlertTriangle size={20} className="text-[#EF4444]" />
                </div>
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">Missing Skills</p>
                <p className="text-3xl font-extrabold text-[#111827] flex items-baseline gap-1">
                  <AnimatedCounter target={5} /><span className="text-xl text-[#EF4444]">!</span>
                </p>
              </motion.div>

              {/* Readiness */}
              <motion.div whileHover={cardHover} className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] flex items-center justify-center mb-3">
                  <ShieldCheck size={20} className="text-[#7C3AED]" />
                </div>
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">Readiness</p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.5 }}
                  className="text-3xl font-extrabold text-[#111827] flex items-center gap-2">
                  High<span className="w-2.5 h-2.5 rounded-full bg-[#10B981] inline-block" />
                </motion.p>
              </motion.div>

              {/* Analyzed */}
              <motion.div whileHover={cardHover} className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center mb-3">
                  <Clock size={20} className="text-[#2563EB]" />
                </div>
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">Analyzed</p>
                <p className="text-3xl font-extrabold text-[#111827]"><AnimatedCounter target={12} /></p>
              </motion.div>
            </motion.div>

            {/* 3. MAIN GRID */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-6 mb-8">

              {/* LEFT COL */}
              <div className="flex flex-col gap-6 min-w-0">

                {/* Recent Activity */}
                <motion.div variants={itemVar} className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-bold text-[#111827]">Recent Activity</h2>
                    <motion.button whileHover={{ x: 3 }}
                      className="flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:underline cursor-pointer">
                      View Full History<ArrowRight size={13} />
                    </motion.button>
                  </div>
                  <motion.div variants={containerVar} initial="hidden" animate="visible" className="space-y-4">
                    <motion.div variants={itemVar} className="flex items-start gap-3.5 pb-4 border-b border-[#F3F4F6]">
                      <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0"><FileText size={17} className="text-[#2563EB]" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#111827] truncate">Analyzed "Senior Product Designer_v2.pdf"</p>
                        <p className="text-xs text-[#6B7280] mt-0.5">Applied to: Apple Inc. • 2 hours ago</p>
                      </div>
                      <span className="text-sm font-bold text-[#2563EB] shrink-0">82% Match</span>
                    </motion.div>
                    <motion.div variants={itemVar} className="flex items-start gap-3.5 pb-4 border-b border-[#F3F4F6]">
                      <div className="w-9 h-9 rounded-xl bg-[#F5F3FF] flex items-center justify-center shrink-0"><Mic size={17} className="text-[#7C3AED]" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#111827]">Completed Mock Interview session</p>
                        <p className="text-xs text-[#6B7280] mt-0.5">Topic: Behavioral Questions • Yesterday</p>
                      </div>
                      <span className="text-sm font-bold text-[#7C3AED] shrink-0">9/10 Score</span>
                    </motion.div>
                    <motion.div variants={itemVar} className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-[#F3F4F6] flex items-center justify-center shrink-0"><Edit size={17} className="text-[#6B7280]" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#111827]">Updated Resume Bullet Points</p>
                        <p className="text-xs text-[#6B7280] mt-0.5">Focus: Leadership Skills • 2 days ago</p>
                      </div>
                      <KebabMenu />
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Resume & Job Status */}
                <motion.div variants={itemVar} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] p-5">
                    <div className="flex items-center gap-2 mb-3"><FileUp size={15} className="text-[#2563EB]" /><h3 className="text-sm font-bold text-[#111827]">Resume Status</h3></div>
                    <p className="text-xs font-semibold text-[#111827] truncate">Senior_Product_Designer_v2.pdf</p>
                    <p className="text-[10px] text-[#6B7280] mt-0.5">Uploaded: Jul 8, 2024</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#10B981] bg-[#ECFDF5]">● Processed</span>
                      <button className="text-[11px] font-bold text-[#2563EB] hover:underline cursor-pointer">Re-upload</button>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] p-5">
                    <div className="flex items-center gap-2 mb-3"><Briefcase size={15} className="text-[#7C3AED]" /><h3 className="text-sm font-bold text-[#111827]">Job Description</h3></div>
                    <p className="text-xs font-semibold text-[#111827]">Senior AI Product Lead</p>
                    <p className="text-[10px] text-[#6B7280] mt-0.5">Company: OpenAI</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF]">● Linked</span>
                      <button className="text-[11px] font-bold text-[#7C3AED] hover:underline cursor-pointer">Change Job</button>
                    </div>
                  </div>
                </motion.div>

                {/* Interview History */}
                <motion.div variants={itemVar} className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-[#111827]">Interview History</h2>
                    <button className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer">View All</button>
                  </div>
                  <div className="divide-y divide-[#F3F4F6]">
                    {interviewHistory.map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2.5">
                        <div>
                          <p className="text-sm font-semibold text-[#111827]">{item.topic}</p>
                          <p className="text-[11px] text-[#6B7280]">{item.date}</p>
                        </div>
                        <span className={`text-sm font-bold ${item.colorClass}`}>{item.score}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Line Chart */}
                <motion.div variants={itemVar} className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] p-6">
                  <h2 className="text-base font-bold text-[#111827] mb-0.5">Progress Overview</h2>
                  <p className="text-xs text-[#6B7280] mb-5">Match score trend — last 30 days</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={lineData} margin={{ top: 5, right: 10, left: -22, bottom: 5 }}>
                      <defs>
                        <linearGradient id="lineGradStroke" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#2563EB" /><stop offset="100%" stopColor="#7C3AED" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
                      <YAxis domain={[40, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
                      <Tooltip content={<LineTooltip />} />
                      <Line type="monotone" dataKey="score" stroke="url(#lineGradStroke)" strokeWidth={3}
                        dot={{ fill: '#2563EB', r: 4, strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, fill: '#7C3AED', stroke: '#fff', strokeWidth: 2 }}
                        isAnimationActive animationDuration={1400} animationEasing="ease-out" />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Bar Chart */}
                <motion.div variants={itemVar} className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] p-6">
                  <h2 className="text-base font-bold text-[#111827] mb-0.5">Skill Improvement by Category</h2>
                  <p className="text-xs text-[#6B7280] mb-5">Performance score per skill area</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
                      <YAxis type="category" dataKey="category" width={115} tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 500 }} tickLine={false} axisLine={false} />
                      <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(79,70,229,0.06)' }} />
                      <Bar dataKey="score" radius={[0, 6, 6, 0]} isAnimationActive animationDuration={1200} animationEasing="ease-out">
                        {barData.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>

              {/* RIGHT COL */}
              <div className="flex flex-col gap-6">

                {/* Career Goal */}
                <motion.div variants={itemVar} whileHover={cardHover}
                  className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] p-6 flex flex-col items-center text-center">
                  <h2 className="text-base font-bold text-[#111827] mb-5 self-start">Career Goal</h2>
                  <CircularProgress percentage={70} />
                  <p className="mt-4 text-sm text-[#6B7280] font-medium">Targeting: Senior AI Product Lead</p>
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={itemVar} className="rounded-2xl p-5"
                  style={{ background: 'rgba(79,70,229,0.055)', backdropFilter: 'blur(12px)' }}>
                  <p className="text-[10px] font-bold text-[#4F46E5] uppercase tracking-widest mb-4">Quick Actions</p>
                  <div className="flex flex-col gap-2.5">
                    {[
                      { icon: CloudUpload, label: 'Upload New Resume', iconColor: '#2563EB', iconBg: '#EFF6FF' },
                      { icon: PlayCircle, label: 'Start Mock Interview', iconColor: '#7C3AED', iconBg: '#F5F3FF' },
                      { icon: Sparkles, label: 'AI Polish Current', iconColor: '#F59E0B', iconBg: '#FFFBEB' },
                    ].map(({ icon: Icon, label, iconColor, iconBg }) => (
                      <motion.button key={label}
                        whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(37,99,235,0.12)' }} whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm cursor-pointer group">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: iconBg }}>
                          <Icon size={16} style={{ color: iconColor }} />
                        </div>
                        <span className="text-sm font-semibold text-[#111827] flex-1 text-left">{label}</span>
                        <ChevronRight size={14} className="text-[#9CA3AF] group-hover:text-[#2563EB] transition-colors" />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Weekly Improvement sparkline */}
                <motion.div variants={itemVar} whileHover={cardHover}
                  className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-[#111827]">Weekly Improvement</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#10B981] bg-[#ECFDF5]">+12%</span>
                  </div>
                  <div className="flex items-end gap-1 h-14">
                    {SPARKLINE.map((v, i) => {
                      const h = (v / 100) * 56;
                      const isLast = i === SPARKLINE.length - 1;
                      return (
                        <motion.div key={i} className="flex-1 rounded-t-md"
                          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                          style={{
                            height: h, originY: 1,
                            background: isLast
                              ? 'linear-gradient(to top,#2563EB,#7C3AED)'
                              : `rgba(37,99,235,${0.18 + i * 0.12})`
                          }}
                          transition={{ delay: 0.5 + i * 0.07, duration: 0.45, ease: 'easeOut' }} />
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-2">
                    {DAYS.map((d, i) => (
                      <span key={i} className="text-[10px] text-[#9CA3AF] flex-1 text-center">{d}</span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* 4. PROMO BANNER */}
            <motion.div variants={itemVar}
              whileHover={{ scale: 1.01, boxShadow: '0 24px 60px rgba(79,70,229,0.28)' }}
              transition={{ duration: 0.2 }}
              className="relative overflow-hidden rounded-2xl p-8 mb-8 cursor-default"
              style={{ background: 'linear-gradient(135deg,#1E1B4B 0%,#4F46E5 55%,#7C3AED 100%)' }}>

              <svg className="absolute right-0 top-0 h-full opacity-20 pointer-events-none" viewBox="0 0 420 220" fill="none"
                style={{ mixBlendMode: 'screen' }}>
                <motion.path d="M0 110 Q 105 30 210 110 T 420 110" stroke="white" strokeWidth="2" fill="none"
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, ease: 'easeInOut', delay: 1 }} />
                <motion.path d="M0 145 Q 105 65 210 145 T 420 145" stroke="white" strokeWidth="1.5" fill="none"
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 2, ease: 'easeInOut', delay: 1.3 }} />
                <motion.path d="M0 75 Q 105 -5 210 75 T 420 75" stroke="white" strokeWidth="1" fill="none"
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.4 }}
                  transition={{ duration: 2, ease: 'easeInOut', delay: 1.6 }} />
                <circle cx="340" cy="60" r="50" fill="white" fillOpacity="0.04" />
                <circle cx="370" cy="155" r="35" fill="white" fillOpacity="0.06" />
              </svg>

              <div className="relative z-10 max-w-xl">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">Unlock AI Interview Coaching</h2>
                <p className="text-white/80 text-sm font-medium mb-5 leading-relaxed">
                  Practice with our real-time voice coach and get instant feedback on your tone and content.
                </p>
                <motion.button whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 border border-white/40 rounded-xl text-white font-bold text-sm backdrop-blur-sm transition-all cursor-pointer">
                  Explore Coaching Features<ArrowRight size={15} />
                </motion.button>
              </div>
            </motion.div>

            {/* FOOTER */}
            <footer className="border-t border-[#E5E7EB] pt-5 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-sm font-extrabold text-[#2563EB]">ResumeAI Analyzer</span>
                <p className="text-xs text-[#6B7280] mt-0.5">© 2024 ResumeAI Analyzer. All rights reserved.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
                {['Privacy Policy', 'Terms of Service', 'Support'].map((link, i) => (
                  <React.Fragment key={link}>
                    {i > 0 && <span className="text-[#E5E7EB]">·</span>}
                    <a href="#" className="hover:text-[#2563EB] hover:underline transition-colors font-medium">{link}</a>
                  </React.Fragment>
                ))}
              </div>
            </footer>

          </motion.div>
        </main>
      </div>
    </motion.div>
  );
}

