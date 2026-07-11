import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
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
import Sidebar from '../components/Sidebar';


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
const BAR_COLORS = ['#2563EB', '#4F46E5', '#7C3AED', '#10B981'];
const SPARKLINE = [40, 55, 48, 62, 58, 72, 78];
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/* ═══════════════ MAIN DASHBOARD ═══════════════ */
export default function DashboardPage({ onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split('/')[2] || 'dashboard';
  const [activeNav, setActiveNav] = useState(currentPath);

  useEffect(() => {
    if (activeNav === 'dashboard') {
      if (location.pathname !== '/dashboard') navigate('/dashboard', { replace: true });
    } else {
      if (location.pathname !== `/dashboard/${activeNav}`) navigate(`/dashboard/${activeNav}`, { replace: true });
    }
  }, [activeNav, navigate]);

  useEffect(() => {
    const path = location.pathname.split('/')[2] || 'dashboard';
    if (path !== activeNav) {
      setActiveNav(path);
    }
  }, [location.pathname]);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('avenir_theme') === 'dark';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settingsTab, setSettingsTab] = useState('general');

  // Sync theme when activeNav changes (in case it was changed on SettingsPage)
  useEffect(() => {
    const isDark = localStorage.getItem('avenir_theme') === 'dark';
    setDarkMode(isDark);
  }, [activeNav]);

  // Apply dark class and sync to settings object when darkMode changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('avenir_theme', darkMode ? 'dark' : 'light');
    try {
      const raw = localStorage.getItem('avenir_general_settings');
      const settings = raw ? JSON.parse(raw) : {};
      if (settings.theme !== (darkMode ? 'dark' : 'light')) {
        settings.theme = darkMode ? 'dark' : 'light';
        localStorage.setItem('avenir_general_settings', JSON.stringify(settings));
      }
    } catch (e) {
      console.error(e);
    }
  }, [darkMode]);

  // Resume upload states
  const [hasResume, setHasResume] = useState(() => localStorage.getItem('avenir_has_resume') === 'true');
  const [resumeName, setResumeName] = useState(() => localStorage.getItem('avenir_resume_name') || '');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusText, setStatusText] = useState('Parsing document structure...');
  const fileInputRef = useRef(null);

  // Real Data states
  const [analysisData, setAnalysisData] = useState(null);
  const [dynamicSessions, setDynamicSessions] = useState([]);
  const [dynamicLineData, setDynamicLineData] = useState(lineData);
  const [dynamicBarData, setDynamicBarData] = useState(barData);
  const [dynamicSparkline, setDynamicSparkline] = useState(SPARKLINE);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/users/history`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            
            if (data.analyses && data.analyses.length > 0) {
              setAnalysisData(data.analyses[0]);
              setHasResume(true);

              // 1. Line Data (Progress Overview)
              // Sort chronological (oldest to newest)
              const sortedAnalyses = [...data.analyses].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
              const mappedLineData = sortedAnalyses.map(a => ({
                date: new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                score: a.atsScore || 0
              }));
              // If only 1 data point, add a zero point so chart renders a line
              if (mappedLineData.length === 1) {
                mappedLineData.unshift({ date: 'Start', score: 0 });
              }
              setDynamicLineData(mappedLineData);

              // 2. Sparkline (Weekly Improvement)
              const sparkScores = sortedAnalyses.map(a => a.atsScore || 0).slice(-7);
              // Pad to 7 if needed
              while (sparkScores.length < 7 && sparkScores.length > 0) {
                sparkScores.unshift(sparkScores[0]); // Pad with the first score to keep trend visually stable
              }
              setDynamicSparkline(sparkScores);

              // 3. Bar Data (Pseudo-categorical data based on ATS score since we don't store categorical scores yet)
              const baseScore = data.analyses[0].atsScore || 60;
              setDynamicBarData([
                { category: 'Technical', score: baseScore },
                { category: 'Communication', score: Math.min(100, baseScore + 8) },
                { category: 'Leadership', score: Math.max(10, baseScore - 5) },
                { category: 'Problem-Solving', score: Math.min(100, baseScore + 4) },
              ]);
            }
            
            if (data.versions && data.versions.length > 0) {
              setHasResume(true);
              setResumeName(data.versions[0].originalFileName || 'Resume.pdf');
            }

            if (data.sessions) {
              setDynamicSessions(data.sessions.slice(0, 3));
            }
          }
        } catch (err) {
          console.error("Failed to fetch dashboard history:", err);
        }
      }
    };
    
    if (activeNav === 'dashboard') {
      fetchHistory();
    }
  }, [activeNav]);

  const handleReset = () => {
    setHasResume(false);
    setResumeName('');
    localStorage.removeItem('avenir_has_resume');
    localStorage.removeItem('avenir_resume_name');
    localStorage.removeItem('avenir_analysis_id');
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
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        activeNav={activeNav} 
        setActiveNav={setActiveNav} 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        onNavigate={onNavigate}
        onDashboardNav={(nav, tab) => { setActiveNav(nav); if (tab) setSettingsTab(tab); }}
      />
      
      {/* RIGHT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* MAIN SCROLLABLE */}
        <main id="dash-scroll" className="flex-1 overflow-y-auto px-5 lg:px-10 py-8">
          <motion.div variants={containerVar} initial="hidden" animate="visible" className="max-w-[1400px] mx-auto">
            {activeNav === 'upload' ? (
              <UploadResumePage onNext={() => setActiveNav('job')} />
            ) : activeNav === 'job' ? (
              <JobDescriptionPage onNext={() => setActiveNav('gap')} />
            ) : activeNav === 'gap' ? (
              <GapAnalysisPage />
            ) : activeNav === 'prep' ? (
              <PrepPlanPage />
            ) : activeNav === 'interview' ? (
              <MockInterviewPage />
            ) : activeNav === 'settings' ? (
              <SettingsPage initialTab={settingsTab} />
            ) : activeNav === 'history' ? (
              <HistoryPage onNavigate={setActiveNav} />
            ) : (
              <>
                {/* 1. WELCOME */}
                <motion.div variants={itemVar} className="mb-8">
                  <h1 className="text-3xl lg:text-[2.2rem] font-extrabold text-[#111827] tracking-tight">
                Welcome back,{' '}
                <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.5 }}
                  style={{ background: 'linear-gradient(135deg,#2563EB,#7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {localStorage.getItem('avenir_user_name')?.split(' ')[0] || 'Guest'}.
                </motion.span>
              </h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
                className="flex flex-wrap items-center gap-1.5 mt-2 text-[#6B7280] font-medium text-sm lg:text-base">
                <motion.span animate={{ scale: [1, 1.25, 1] }} transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}>
                  <Sparkles size={16} className="text-[#F59E0B]" />
                </motion.span>
                {`Your AI Coach is ready. Let's prepare you for your next interview.`}
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
                  onClick={() => setActiveNav('upload')}
                >
                  {/* Heartbeat glowing overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB]/5 to-[#7C3AED]/5 animate-pulse pointer-events-none" />

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
                      Click here to go to the Upload page. We will analyze your experience, identify critical skill gaps, and prepare tailored mock interview questions.
                    </p>

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white text-xs font-bold rounded-xl shadow-md group-hover:shadow-lg transition-all duration-200">
                      <span>Go to Upload</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {hasResume && (
              <>
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
                  {analysisData ? <AnimatedCounter target={analysisData.atsScore || 0} suffix="%" /> : 'N/A'}
                </p>
              </motion.div>

              {/* Missing Skills */}
              <motion.div whileHover={cardHover} className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] flex items-center justify-center mb-3">
                  <AlertTriangle size={20} className="text-[#EF4444]" />
                </div>
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">Missing Skills</p>
                <p className="text-3xl font-extrabold text-[#111827] flex items-baseline gap-1">
                  {analysisData ? (
                    <>
                      <AnimatedCounter target={analysisData.missingSkills?.length || 0} />
                      {analysisData.missingSkills?.length > 0 && <span className="text-xl text-[#EF4444]">!</span>}
                    </>
                  ) : 'N/A'}
                </p>
              </motion.div>

              {/* Readiness */}
              <motion.div whileHover={cardHover} className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] flex items-center justify-center mb-3">
                  <ShieldCheck size={20} className="text-[#7C3AED]" />
                </div>
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">Readiness</p>
                <p className="text-3xl font-extrabold text-[#111827] flex items-center gap-2">
                  {analysisData ? (
                    <>
                      {analysisData.atsScore > 75 ? 'High' : analysisData.atsScore > 50 ? 'Medium' : 'Low'}
                      <span className={`w-2.5 h-2.5 rounded-full inline-block ${analysisData.atsScore > 75 ? 'bg-[#10B981]' : analysisData.atsScore > 50 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`} />
                    </>
                  ) : 'N/A'}
                </p>
              </motion.div>

              {/* Analyzed */}
              <motion.div whileHover={cardHover} className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center mb-3">
                  <Clock size={20} className="text-[#2563EB]" />
                </div>
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">Analyzed</p>
                <p className="text-3xl font-extrabold text-[#111827]">
                  {hasResume ? 1 : 'N/A'}
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
                        <motion.div variants={itemVar} className="flex items-start gap-3.5 pb-4">
                          <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0"><FileText size={17} className="text-[#2563EB]" /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#111827] truncate">Analyzed "{resumeName}"</p>
                            <p className="text-xs text-[#6B7280] mt-0.5">Target Role: {analysisData?.jobTitle || 'N/A'} • Recently</p>
                          </div>
                          <span className="text-sm font-bold text-[#2563EB] shrink-0">{analysisData?.atsScore || 0}% Match</span>
                        </motion.div>
                      </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-6">
                          <p className="text-sm text-[#6B7280] font-medium">No activity recorded yet.</p>
                          <button onClick={() => setActiveNav('upload')} className="text-xs font-bold text-[#2563EB] mt-2 hover:underline">Go upload a resume to start</button>
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
                          <button onClick={() => setActiveNav('upload')} className="text-[11px] font-bold text-[#2563EB] hover:underline cursor-pointer">Upload</button>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] p-5">
                    <div className="flex items-center gap-2 mb-3"><Briefcase size={15} className="text-[#7C3AED]" /><h3 className="text-sm font-bold text-[#111827]">Job Target</h3></div>
                    <p className="text-xs font-semibold text-[#111827]">{analysisData?.jobTitle || 'Senior Role'}</p>
                    <p className="text-[10px] text-[#6B7280] mt-0.5">Company: {analysisData?.company || 'Target Company'}</p>
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
                    <button onClick={() => setActiveNav('history')} className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer">View All</button>
                  </div>
                  <div className="divide-y divide-[#F3F4F6]">
                    {dynamicSessions.length > 0 ? (
                      dynamicSessions.map((item, i) => (
                        <div key={item._id} className="flex items-center justify-between py-2.5">
                          <div>
                            <p className="text-sm font-semibold text-[#111827]">Mock Interview Session</p>
                            <p className="text-[11px] text-[#6B7280]">
                              {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                          <span className={`text-sm font-bold ${item.score >= 80 ? 'text-[#10B981]' : item.score >= 50 ? 'text-[#7C3AED]' : 'text-[#EF4444]'}`}>
                            {item.score || 0}/100
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="py-4 text-center">
                        <p className="text-sm text-[#6B7280] font-medium">No mock interviews completed.</p>
                      </div>
                    )}
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
                  <p className="text-xs text-[#6B7280] mb-5">Match score trend — based on past analyses</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={hasResume ? dynamicLineData : []} margin={{ top: 5, right: 10, left: -22, bottom: 5 }}>
                      <defs>
                        <linearGradient id="lineGradStroke" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#2563EB" /><stop offset="100%" stopColor="#7C3AED" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
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
                  <p className="text-xs text-[#6B7280] mb-5">Estimated performance score per skill area</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={hasResume ? dynamicBarData : []} layout="vertical" margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
                      <YAxis type="category" dataKey="category" width={115} tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 500 }} tickLine={false} axisLine={false} />
                      <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(79,70,229,0.06)' }} />
                      <Bar dataKey="score" radius={[0, 6, 6, 0]} isAnimationActive animationDuration={1200} animationEasing="ease-out">
                        {dynamicBarData.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
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
                  <CircularProgress percentage={analysisData?.atsScore || 0} />
                  <p className="mt-4 text-sm text-[#6B7280] font-medium text-center">Targeting: {analysisData?.jobTitle || 'Target Role'}</p>
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
                          if (label.includes('Upload')) setActiveNav('upload');
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
                    <h3 className="text-sm font-bold text-[#111827]">Trend Chart</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#10B981] bg-[#ECFDF5]">Active</span>
                  </div>
                  <div className="flex items-end gap-1 h-14">
                    {(hasResume ? dynamicSparkline : [0, 0, 0, 0, 0, 0, 0]).map((v, i) => {
                      const h = (v / 100) * 56;
                      const isLast = i === dynamicSparkline.length - 1;
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
            </>
            )}

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

