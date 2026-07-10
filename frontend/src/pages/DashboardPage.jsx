import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import {
  LayoutDashboard, Upload, FileText, GitCompare, ClipboardList, Mic,
  History, BarChart2, Settings, Search, Bell, Moon, Sun, ChevronRight,
  TrendingUp, AlertTriangle, ShieldCheck, Clock, MoreVertical,
  CloudUpload, PlayCircle, Sparkles, ArrowRight, FileUp, Briefcase,
  Edit, Trash2, Share2, X, Menu, User,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts';
import UploadResumePage from './UploadResumePage';
import PrepPlanPage from './PrepPlanPage';
import JobDescriptionPage from './JobDescriptionPage';
import GapAnalysisPage from './GapAnalysisPage';
import MockInterviewPage from './MockInterviewPage';
import HistoryPage from './HistoryPage';
import SettingsPage from './SettingsPage';
import AnimatedCounter from '../components/AnimatedCounter';
import CircularProgress from '../components/CircularProgress';
import { LineTooltip, BarTooltip } from '../components/Tooltips';
import KebabMenu from '../components/KebabMenu';
import NotificationBell from '../components/NotificationBell';
import ProfileDropdown from '../components/ProfileDropdown';


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
];
const BAR_COLORS = ['#2563EB', '#4F46E5', '#7C3AED', '#10B981'];
const SPARKLINE = [40, 55, 48, 62, 58, 72, 78];
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/* ═══════════════ MAIN DASHBOARD ═══════════════ */
export default function DashboardPage({ onNavigate }) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Resume upload states
  const [hasResume, setHasResume] = useState(() => localStorage.getItem('avenir_has_resume') === 'true');
  const [resumeName, setResumeName] = useState(() => localStorage.getItem('avenir_resume_name') || '');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusText, setStatusText] = useState('Parsing document structure...');
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    simulateAnalysis(file.name);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    simulateAnalysis(file.name);
  };

  const simulateAnalysis = (name) => {
    setUploading(true);
    setUploadProgress(0);
    setStatusText('Reading file bytes...');
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress <= 100) {
        setUploadProgress(progress);
        if (progress === 20) setStatusText('Parsing resume layout and blocks...');
        if (progress === 50) setStatusText('Extracting technical skill nodes...');
        if (progress === 80) setStatusText('Checking compliance against standard ATS parsers...');
        if (progress === 100) setStatusText('Finalizing career profile analysis!');
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setHasResume(true);
          setResumeName(name);
          localStorage.setItem('avenir_has_resume', 'true');
          localStorage.setItem('avenir_resume_name', name);
          setUploading(false);
        }, 300);
      }
    }, 80);
  };

  const handleReset = () => {
    setHasResume(false);
    setResumeName('');
    localStorage.removeItem('avenir_has_resume');
    localStorage.removeItem('avenir_resume_name');
  };


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
              <p className="text-base font-extrabold text-[#2563EB] leading-tight">Avenir AI</p>
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
          <div className="w-full h-px bg-[#E5E7EB] my-2" />
          <motion.button whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }} onClick={() => { setActiveNav('settings'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeNav === 'settings' ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold' : 'text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#111827]'}`}>
            <Settings size={18} className={activeNav === 'settings' ? 'text-[#2563EB]' : 'text-[#9CA3AF]'} />
            Settings
            {activeNav === 'settings' && <motion.div layoutId="navPillBottom" className="ml-auto w-1.5 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom,#2563EB,#7C3AED)' }} />}
          </motion.button>
          <motion.button whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }} onClick={() => { setActiveNav('profile'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeNav === 'profile' ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold' : 'text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#111827]'}`}>
            <User size={18} className={activeNav === 'profile' ? 'text-[#2563EB]' : 'text-[#9CA3AF]'} />
            Profile
            {activeNav === 'profile' && <motion.div layoutId="navPillBottom" className="ml-auto w-1.5 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom,#2563EB,#7C3AED)' }} />}
          </motion.button>
        </nav>

        <div className="px-4 pb-6 pt-2">
          <div className="bg-[#EEF2FF] rounded-xl p-4 border border-[#E0E7FF]">
            <p className="text-[10px] font-bold text-[#4F46E5] uppercase tracking-widest mb-1.5">Pro Plan</p>
            <p className="text-xs text-[#4B5563] font-medium leading-relaxed mb-4">
              Unlock advanced AI analysis and unlimited resumes.
            </p>
            <button className="w-full py-2 bg-[#0051C9] hover:bg-[#0042A5] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </aside>

      {/* RIGHT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* TOP NAVBAR */}
        <header className={`sticky top-0 z-20 flex items-center gap-4 px-5 lg:px-8 py-3 bg-white/70 backdrop-blur-lg border-b border-[#E5E7EB] transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280] cursor-pointer">
            <Menu size={20} />
          </button>
          {activeNav === 'history' && (
            <span className="text-sm font-extrabold text-[#111827] mr-1 hidden sm:inline select-none">History</span>
          )}
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input type="text" 
              placeholder={activeNav === 'job' ? 'Search templates...' : activeNav === 'upload' ? 'Search files...' : activeNav === 'history' ? 'Search activities...' : 'Search insights...'}
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
            {activeNav === 'upload' ? (
              <UploadResumePage />
            ) : activeNav === 'job' ? (
              <JobDescriptionPage />
            ) : activeNav === 'gap' ? (
              <GapAnalysisPage />
            ) : activeNav === 'prep' ? (
              <PrepPlanPage />
            ) : activeNav === 'interview' ? (
              <MockInterviewPage />
            ) : activeNav === 'settings' ? (
              <SettingsPage initialTab="general" />
            ) : activeNav === 'profile' ? (
              <SettingsPage initialTab="profile" />
            ) : activeNav === 'history' ? (
              <HistoryPage />
            ) : (
              <>
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

            {/* ONBOARDING HIGHLIGHT BANNER */}
            <AnimatePresence>
              {!hasResume && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  className="mb-8 p-6 md:p-8 rounded-2xl bg-white border-2 border-dashed border-[#2563EB] shadow-[0_15px_40px_rgba(37,99,235,0.08)] relative overflow-hidden flex flex-col items-center justify-center text-center group cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => simulateAnalysis('resume_software_engineer.pdf')}
                >
                  {/* Heartbeat glowing overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB]/5 to-[#7C3AED]/5 animate-pulse pointer-events-none" />

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                  />

                  {uploading ? (
                    <div className="w-full max-w-md py-4 flex flex-col items-center relative z-10">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4 text-[#2563EB] animate-spin">
                        <CloudUpload size={24} />
                      </div>
                      <h3 className="text-base font-bold text-[#111827] mb-1">Analyzing Your Resume</h3>
                      <p className="text-xs text-[#6B7280] font-semibold mb-4">{statusText}</p>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden flex">
                        <div 
                          className="h-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] transition-all duration-150"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-[#2563EB] mt-2">{uploadProgress}%</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center relative z-10">
                      {/* Animated Cloud Icon */}
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                        className="w-16 h-16 rounded-2xl bg-[#EFF6FF] border border-[#2563EB]/10 flex items-center justify-center text-[#2563EB] mb-4 shadow-sm group-hover:scale-105 transition-transform"
                      >
                        <CloudUpload size={32} />
                      </motion.div>

                      <h2 className="text-xl font-bold text-[#111827] mb-2">
                        Upload Your Resume to Get Started
                      </h2>
                      <p className="text-xs md:text-sm text-[#6B7280] font-medium max-w-lg leading-relaxed mb-5">
                        Drag and drop your PDF or DOCX file here, or click to browse. We will analyze your experience, identify critical skill gaps, and prepare tailored mock interview questions.
                      </p>

                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white text-xs font-bold rounded-xl shadow-md group-hover:shadow-lg transition-all duration-200">
                        <span>Select File</span>
                        <ArrowRight size={13} />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 2. STAT CARDS */}
            <motion.div variants={itemVar} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Match Score */}
              <motion.div whileHover={cardHover} className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] relative overflow-hidden cursor-default">
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                  style={{ background: hasResume ? 'linear-gradient(135deg,#10B981,#059669)' : '#9CA3AF' }}>
                  {hasResume ? '+4%' : 'Pending'}
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center mb-3">
                  <TrendingUp size={20} className="text-[#2563EB]" />
                </div>
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">Match Score</p>
                <p className="text-3xl font-extrabold text-[#111827]">
                  <AnimatedCounter target={hasResume ? 78 : 0} suffix="%" />
                </p>
              </motion.div>

              {/* Missing Skills */}
              <motion.div whileHover={cardHover} className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] flex items-center justify-center mb-3">
                  <AlertTriangle size={20} className="text-[#EF4444]" />
                </div>
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">Missing Skills</p>
                <p className="text-3xl font-extrabold text-[#111827] flex items-baseline gap-1">
                  <AnimatedCounter target={hasResume ? 5 : 0} />
                  {hasResume && <span className="text-xl text-[#EF4444]">!</span>}
                </p>
              </motion.div>

              {/* Readiness */}
              <motion.div whileHover={cardHover} className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] flex items-center justify-center mb-3">
                  <ShieldCheck size={20} className="text-[#7C3AED]" />
                </div>
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">Readiness</p>
                <p className="text-3xl font-extrabold text-[#111827] flex items-center gap-2">
                  {hasResume ? 'High' : 'N/A'}
                  {hasResume && <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] inline-block" />}
                </p>
              </motion.div>

              {/* Analyzed */}
              <motion.div whileHover={cardHover} className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center mb-3">
                  <Clock size={20} className="text-[#2563EB]" />
                </div>
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">Analyzed</p>
                <p className="text-3xl font-extrabold text-[#111827]">
                  <AnimatedCounter target={hasResume ? 12 : 0} />
                </p>
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
                    {hasResume && (
                      <motion.button whileHover={{ x: 3 }}
                        className="flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:underline cursor-pointer">
                        View Full History<ArrowRight size={13} />
                      </motion.button>
                    )}
                  </div>
                  <motion.div variants={containerVar} initial="hidden" animate="visible" className="space-y-4">
                    {hasResume ? (
                      <>
                        <motion.div variants={itemVar} className="flex items-start gap-3.5 pb-4 border-b border-[#F3F4F6]">
                          <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0"><FileText size={17} className="text-[#2563EB]" /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#111827] truncate">Analyzed "{resumeName}"</p>
                            <p className="text-xs text-[#6B7280] mt-0.5">Applied to: Apple Inc. • Just now</p>
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
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-sm text-[#6B7280] font-medium">No activity recorded yet.</p>
                        <p className="text-xs text-[#9CA3AF] mt-1">Upload your resume to perform your first gap analysis.</p>
                      </div>
                    )}
                  </motion.div>
                </motion.div>

                {/* Resume & Job Status */}
                <motion.div variants={itemVar} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] p-5">
                    <div className="flex items-center gap-2 mb-3"><FileUp size={15} className="text-[#2563EB]" /><h3 className="text-sm font-bold text-[#111827]">Resume Status</h3></div>
                    {hasResume ? (
                      <>
                        <p className="text-xs font-semibold text-[#111827] truncate">{resumeName}</p>
                        <p className="text-[10px] text-[#6B7280] mt-0.5">Uploaded: Just now</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#10B981] bg-[#ECFDF5]">● Processed</span>
                          <button onClick={handleReset} className="text-[11px] font-bold text-[#2563EB] hover:underline cursor-pointer">Reset</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-semibold text-[#6B7280] truncate">No resume uploaded</p>
                        <p className="text-[10px] text-[#9CA3AF] mt-0.5">Required to unlock analysis</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-red-500 bg-red-50">● Missing</span>
                          <button onClick={() => simulateAnalysis('resume_software_engineer.pdf')} className="text-[11px] font-bold text-[#2563EB] hover:underline cursor-pointer">Upload</button>
                        </div>
                      </>
                    )}
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
                <motion.div variants={itemVar} className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] p-6 relative overflow-hidden">
                  {!hasResume && (
                    <div className="absolute inset-0 z-10 bg-white/75 backdrop-blur-[1.5px] flex flex-col items-center justify-center text-center p-4">
                      <TrendingUp size={24} className="text-[#9CA3AF] mb-2" />
                      <p className="text-sm font-bold text-[#111827]">Trend Chart Locked</p>
                      <p className="text-[11px] text-[#6B7280] font-medium max-w-[200px] mt-1">Upload your resume to view match score trends over time.</p>
                    </div>
                  )}
                  <h2 className="text-base font-bold text-[#111827] mb-0.5">Progress Overview</h2>
                  <p className="text-xs text-[#6B7280] mb-5">Match score trend — last 30 days</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={hasResume ? lineData : []} margin={{ top: 5, right: 10, left: -22, bottom: 5 }}>
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
                <motion.div variants={itemVar} className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] p-6 relative overflow-hidden">
                  {!hasResume && (
                    <div className="absolute inset-0 z-10 bg-white/75 backdrop-blur-[1.5px] flex flex-col items-center justify-center text-center p-4">
                      <BarChart2 size={24} className="text-[#9CA3AF] mb-2" />
                      <p className="text-sm font-bold text-[#111827]">Skill Metrics Locked</p>
                      <p className="text-[11px] text-[#6B7280] font-medium max-w-[200px] mt-1">Upload your resume to analyze your skill category strengths.</p>
                    </div>
                  )}
                  <h2 className="text-base font-bold text-[#111827] mb-0.5">Skill Improvement by Category</h2>
                  <p className="text-xs text-[#6B7280] mb-5">Performance score per skill area</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={hasResume ? barData : []} layout="vertical" margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
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
                  className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] p-6 flex flex-col items-center text-center relative overflow-hidden">
                  {!hasResume && (
                    <div className="absolute inset-0 z-10 bg-white/75 backdrop-blur-[1.5px] flex flex-col items-center justify-center text-center p-4">
                      <Briefcase size={24} className="text-[#9CA3AF] mb-2" />
                      <p className="text-sm font-bold text-[#111827]">Readiness Locked</p>
                      <p className="text-[11px] text-[#6B7280] font-medium max-w-[200px] mt-1">Upload your resume to calculate your career readiness score.</p>
                    </div>
                  )}
                  <h2 className="text-base font-bold text-[#111827] mb-5 self-start">Career Goal</h2>
                  <CircularProgress percentage={hasResume ? 70 : 0} />
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
                        onClick={() => {
                          if (label.includes('Upload')) simulateAnalysis('resume_software_engineer.pdf');
                        }}
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
                  className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] p-5 relative overflow-hidden">
                  {!hasResume && (
                    <div className="absolute inset-0 z-10 bg-white/75 backdrop-blur-[1.5px] flex flex-col items-center justify-center text-center p-4">
                      <Clock size={20} className="text-[#9CA3AF] mb-1" />
                      <p className="text-xs font-bold text-[#111827]">Weekly Chart Locked</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-[#111827]">Weekly Improvement</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#10B981] bg-[#ECFDF5]">{hasResume ? '+12%' : '0%'}</span>
                  </div>
                  <div className="flex items-end gap-1 h-14">
                    {(hasResume ? SPARKLINE : [0, 0, 0, 0, 0, 0, 0]).map((v, i) => {
                      const h = (v / 100) * 56;
                      const isLast = i === SPARKLINE.length - 1;
                      return (
                        <motion.div key={i} className="flex-1 rounded-t-md"
                          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                          style={{
                            height: h, originY: 1,
                            background: isLast && hasResume
                              ? 'linear-gradient(to top,#2563EB,#7C3AED)'
                              : `rgba(37,99,235,${hasResume ? 0.18 + i * 0.12 : 0.05})`
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
                <span className="text-sm font-extrabold text-[#2563EB]">Avenir AI Analyzer</span>
                <p className="text-xs text-[#6B7280] mt-0.5">© 2026 Avenir AI Analyzer. All rights reserved.</p>
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
          </>)}
          </motion.div>
        </main>
      </div>
    </motion.div>
  );
}

