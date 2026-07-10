import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Briefcase,
  History,
  Grid,
  List,
  GitCommit,
  Download,
  Filter,
  MoreVertical,
  Calendar,
  RefreshCw,
  Trash2,
  RotateCcw,
  Mic,
  Play,
  Pause,
  Headphones,
  FileCheck,
  PlusCircle,
  ChevronRight,
  ChevronLeft,
  X,
  Search,
  Star,
  Check,
  ChevronDown,
} from 'lucide-react';

/* ─── Mock Data ─── */
const initialAnalyses = [
  { id: '1', role: 'Senior Product Manager', company: 'Google Cloud', category: 'PRODUCT MANAGEMENT', score: 88, date: 'Oct 24, 2023', version: 'v2.4', active: true },
  { id: '2', role: 'Full Stack Architect', company: 'Stripe', category: 'ENGINEERING', score: 72, date: 'Oct 12, 2023', version: 'v2.1', active: false },
  { id: '3', role: 'Senior UI Designer', company: 'Airbnb', category: 'DESIGN', score: 94, date: 'Sep 28, 2023', version: 'v1.8', active: false },
];

const initialSessions = [
  { id: '1', title: 'General Behavioral Interview', duration: '18m 42s', date: 'Oct 22, 2023', score: 84, confidence: 'HIGH' },
  { id: '2', title: 'Frontend Engineering Mock', duration: '12m 15s', date: 'Oct 18, 2023', score: 76, confidence: 'MEDIUM' },
];

const initialVersions = [
  { id: '1', name: 'Resume_v2.4_final.pdf', date: '2 days ago', active: true },
  { id: '2', name: 'Resume_v2.3_pm_focus.pdf', date: '12 days ago', active: false },
  { id: '3', name: 'Resume_v1.0_baseline.pdf', date: '1 month ago', active: false },
];

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState('card'); // card | table | timeline
  
  // Data lists
  const [analyses, setAnalyses] = useState(initialAnalyses);
  const [sessions, setSessions] = useState(initialSessions);
  const [versions, setVersions] = useState(initialVersions);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Newest'); // Newest | Oldest | Highest Score
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');
  const [selectedScoreFilter, setSelectedScoreFilter] = useState('Any');

  // Interactive UI States
  const [activeKebab, setActiveKebab] = useState(null); // id of active menu
  const [activeVersionKebab, setActiveVersionKebab] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // item to delete
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeAudioPlayer, setActiveAudioPlayer] = useState(null); // id of active session audio
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }

  // Sorting / Filter Options Dropdowns
  const [activeFilterDropdown, setActiveFilterDropdown] = useState(null); // 'date' | 'role' | 'score'

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Trigger auto-dismiss toast
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Simulated handlers
  const handleExportPDF = (name) => {
    triggerToast(`Exporting ${name || 'report'} as PDF...`);
    setActiveKebab(null);
    setActiveVersionKebab(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'analysis') {
      setAnalyses(analyses.filter((a) => a.id !== deleteTarget.id));
      triggerToast('Analysis deleted successfully!', 'success');
    } else if (deleteTarget.type === 'session') {
      setSessions(sessions.filter((s) => s.id !== deleteTarget.id));
      triggerToast('Interview session deleted successfully!', 'success');
    } else if (deleteTarget.type === 'version') {
      setVersions(versions.filter((v) => v.id !== deleteTarget.id));
      triggerToast('Resume version deleted successfully!', 'success');
    }

    setShowDeleteModal(false);
    setDeleteTarget(null);
    setActiveKebab(null);
    setActiveVersionKebab(null);
  };

  const handleRestoreVersion = (version) => {
    setVersions(
      versions.map((v) => ({
        ...v,
        active: v.id === version.id,
      }))
    );
    triggerToast('Version restored successfully!', 'success');
    setActiveVersionKebab(null);
  };

  const handleUploadNewVersion = (e) => {
    e.preventDefault();
    const newVer = {
      id: String(versions.length + 1),
      name: `Resume_v2.5_uploaded.pdf`,
      date: 'Just now',
      active: true,
    };
    setVersions([newVer, ...versions.map(v => ({ ...v, active: false }))]);
    triggerToast('New version uploaded and set as active!');
  };

  // Toggle audio player simulation
  const toggleAudio = (id) => {
    if (activeAudioPlayer === id) {
      setAudioPlaying(!audioPlaying);
    } else {
      setActiveAudioPlayer(id);
      setAudioPlaying(true);
    }
  };

  // Filter and sort analyses
  const filteredAnalyses = analyses
    .filter((a) => {
      const matchSearch = a.role.toLowerCase().includes(searchQuery.toLowerCase()) || a.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = selectedRoleFilter === 'All' || a.category === selectedRoleFilter;
      const matchScore = selectedScoreFilter === 'Any' || 
                         (selectedScoreFilter === 'High' && a.score >= 85) ||
                         (selectedScoreFilter === 'Medium' && a.score >= 70 && a.score < 85) ||
                         (selectedScoreFilter === 'Low' && a.score < 70);
      return matchSearch && matchRole && matchScore;
    })
    .sort((a, b) => {
      if (sortBy === 'Newest') return b.id.localeCompare(a.id);
      if (sortBy === 'Oldest') return a.id.localeCompare(b.id);
      if (sortBy === 'Highest Score') return b.score - a.score;
      return 0;
    });

  const containerVar = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const itemVar = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  };

  const cardHover = {
    y: -4,
    boxShadow: '0 20px 50px rgba(37,99,235,0.12)',
    transition: { duration: 0.2 },
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-9 w-64 bg-gray-200 rounded-lg" />
        <div className="h-5 w-full max-w-lg bg-gray-200 rounded-md mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-gray-200 rounded-2xl" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 50, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3.5 bg-white border border-[#E5E7EB] rounded-xl shadow-2xl"
          >
            <div className="w-6 h-6 rounded-full bg-[#ECFDF5] flex items-center justify-center">
              <Check size={14} className="text-[#10B981]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#111827]">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-[#9CA3AF] hover:text-[#111827] ml-2">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-[#E5E7EB] text-center"
            >
              <Trash2 className="w-12 h-12 text-[#EF4444] mx-auto mb-4" />
              <h3 className="text-base font-extrabold text-[#111827] mb-2">Are you sure?</h3>
              <p className="text-xs text-[#6B7280] mb-6 leading-relaxed">
                This action cannot be undone. All report metrics and data for this item will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2.5 border border-[#E5E7EB] text-xs font-bold rounded-xl text-[#6B7280] hover:bg-[#F8FAFC] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-2.5 bg-[#EF4444] hover:bg-red-600 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm hover:shadow-red-200"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Advanced Filter Side Drawer */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdvancedFilters(false)}
              className="absolute inset-0 bg-black/30 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-full w-80 bg-white shadow-2xl border-l border-[#E5E7EB] p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] mb-6">
                  <h3 className="text-sm font-extrabold text-[#111827] uppercase tracking-wider">Advanced Filters</h3>
                  <button onClick={() => setShowAdvancedFilters(false)} className="p-1 rounded hover:bg-gray-100 text-[#9CA3AF] hover:text-[#111827]">
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Category check */}
                  <div>
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest block mb-2.5">Category</label>
                    <div className="space-y-2">
                      {['All', 'PRODUCT MANAGEMENT', 'ENGINEERING', 'DESIGN'].map((cat) => (
                        <label key={cat} className="flex items-center gap-2 text-xs font-medium text-[#111827] cursor-pointer">
                          <input
                            type="radio"
                            name="cat-filter"
                            checked={selectedRoleFilter === cat}
                            onChange={() => setSelectedRoleFilter(cat)}
                            className="accent-[#2563EB]"
                          />
                          <span>{cat === 'All' ? 'All Roles' : cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Score Tier */}
                  <div>
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest block mb-2.5">Score Range</label>
                    <div className="space-y-2">
                      {[
                        { label: 'Any Score', val: 'Any' },
                        { label: 'High (85%+)', val: 'High' },
                        { label: 'Medium (70% - 84%)', val: 'Medium' },
                        { label: 'Low (<70%)', val: 'Low' },
                      ].map((tier) => (
                        <label key={tier.val} className="flex items-center gap-2 text-xs font-medium text-[#111827] cursor-pointer">
                          <input
                            type="radio"
                            name="score-filter"
                            checked={selectedScoreFilter === tier.val}
                            onChange={() => setSelectedScoreFilter(tier.val)}
                            className="accent-[#2563EB]"
                          />
                          <span>{tier.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#E5E7EB]">
                <button
                  onClick={() => setShowAdvancedFilters(false)}
                  className="w-full py-3 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:from-[#3B82F6] hover:to-[#8B5CF6] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div variants={containerVar} initial="hidden" animate="visible" className="flex flex-col gap-8">
        
        {/* Header */}
        <motion.div variants={itemVar} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-[2.2rem] font-extrabold text-[#111827] tracking-tight leading-tight">
              Activity Log
            </h1>
            <p className="text-[#6B7280] font-medium text-sm lg:text-base mt-2">
              Track your progress and revisit past insights.
            </p>
          </div>

          {/* Quick Date/Role/Score Filters */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Filter 1: Date */}
            <div className="relative">
              <button
                onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'date' ? null : 'date')}
                className="px-4 py-2 bg-white border border-[#E5E7EB] hover:bg-[#F8FAFC] rounded-full text-xs font-bold text-[#111827] flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Date: Last 30 Days</span>
                <ChevronDown size={14} />
              </button>
              {activeFilterDropdown === 'date' && (
                <div className="absolute right-0 mt-2 z-30 w-40 bg-white border border-[#E5E7EB] rounded-xl shadow-lg p-1.5 flex flex-col gap-1">
                  {['Today', 'Last 7 Days', 'Last 30 Days', 'All Time'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setActiveFilterDropdown(null)}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] cursor-pointer"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter 2: Role */}
            <div className="relative">
              <button
                onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'role' ? null : 'role')}
                className={`px-4 py-2 bg-white border border-[#E5E7EB] hover:bg-[#F8FAFC] rounded-full text-xs font-bold text-[#111827] flex items-center gap-1.5 cursor-pointer shadow-sm
                  ${selectedRoleFilter !== 'All' ? 'bg-blue-50/70 border-blue-200 text-[#2563EB]' : ''}
                `}
              >
                <span>Role: {selectedRoleFilter === 'All' ? 'All' : selectedRoleFilter.substring(0, 10)}</span>
                <ChevronDown size={14} />
              </button>
              {activeFilterDropdown === 'role' && (
                <div className="absolute right-0 mt-2 z-30 w-44 bg-white border border-[#E5E7EB] rounded-xl shadow-lg p-1.5 flex flex-col gap-1">
                  {['All', 'PRODUCT MANAGEMENT', 'ENGINEERING', 'DESIGN'].map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setSelectedRoleFilter(role);
                        setActiveFilterDropdown(null);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] cursor-pointer flex items-center justify-between"
                    >
                      <span>{role === 'All' ? 'All Roles' : role}</span>
                      {selectedRoleFilter === role && <Check size={12} className="text-[#2563EB]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter 3: Score */}
            <div className="relative">
              <button
                onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'score' ? null : 'score')}
                className={`px-4 py-2 bg-white border border-[#E5E7EB] hover:bg-[#F8FAFC] rounded-full text-xs font-bold text-[#111827] flex items-center gap-1.5 cursor-pointer shadow-sm
                  ${selectedScoreFilter !== 'Any' ? 'bg-blue-50/70 border-blue-200 text-[#2563EB]' : ''}
                `}
              >
                <span>Score: {selectedScoreFilter === 'Any' ? 'Any' : selectedScoreFilter}</span>
                <ChevronDown size={14} />
              </button>
              {activeFilterDropdown === 'score' && (
                <div className="absolute right-0 mt-2 z-30 w-44 bg-white border border-[#E5E7EB] rounded-xl shadow-lg p-1.5 flex flex-col gap-1">
                  {['Any', 'High', 'Medium', 'Low'].map((score) => (
                    <button
                      key={score}
                      onClick={() => {
                        setSelectedScoreFilter(score);
                        setActiveFilterDropdown(null);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] cursor-pointer flex items-center justify-between"
                    >
                      <span>{score === 'Any' ? 'Any Score' : `${score} Range`}</span>
                      {selectedScoreFilter === score && <Check size={12} className="text-[#2563EB]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Toolbar */}
        <motion.div variants={itemVar} className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Inner search field */}
            <div className="relative w-full sm:w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Filter search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#F8FAFC] border border-[#E5E7EB] focus:border-[#2563EB] focus:bg-white rounded-xl text-xs font-medium outline-none transition-all"
              />
            </div>

            {/* Sort by dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-3 pr-8 py-1.5 bg-[#F8FAFC] border border-[#E5E7EB] focus:border-[#2563EB] focus:bg-white rounded-xl text-xs font-bold text-[#6B7280] outline-none appearance-none cursor-pointer"
              >
                <option>Newest</option>
                <option>Oldest</option>
                <option>Highest Score</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
            </div>

            {/* View toggle */}
            <div className="flex bg-[#F3F4F6] p-0.5 rounded-lg relative">
              {['card', 'table', 'timeline'].map((type) => (
                <button
                  key={type}
                  onClick={() => setViewType(type)}
                  className={`relative p-1.5 rounded-md cursor-pointer text-[#6B7280] hover:text-[#111827] transition-colors z-10`}
                >
                  {viewType === type && (
                    <motion.div
                      layoutId="viewTypeIndicator"
                      className="absolute inset-0 bg-white rounded-md shadow-xs -z-10"
                    />
                  )}
                  {type === 'card' ? <Grid size={14} /> : type === 'table' ? <List size={14} /> : <GitCommit size={14} />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={() => handleExportPDF('all_reports')}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E5E7EB] hover:bg-[#F8FAFC] rounded-xl text-xs font-bold text-[#6B7280] cursor-pointer"
            >
              <Download size={13} />
              Export All (PDF)
            </button>
            <button
              onClick={() => setShowAdvancedFilters(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EFF6FF] border border-blue-100 hover:bg-blue-100/70 rounded-xl text-xs font-bold text-[#2563EB] cursor-pointer"
            >
              <Filter size={13} />
              Filters
            </button>
          </div>

        </motion.div>

        {/* ════════ SECTION 1: RECENT RESUME ANALYSES ════════ */}
        <motion.div variants={itemVar} className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-[#6B7280]" />
            <span className="text-[10px] font-extrabold text-[#6B7280] uppercase tracking-widest">Recent Resume Analyses</span>
          </div>

          <AnimatePresence mode="wait">
            
            {/* A. CARD VIEW */}
            {viewType === 'card' && (
              <motion.div
                key="card-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {filteredAnalyses.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    variants={itemVar}
                    whileHover={cardHover}
                    className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all relative flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Row */}
                      <div className="flex items-start justify-between mb-4">
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider
                          ${item.category === 'PRODUCT MANAGEMENT' ? 'bg-[#F5F3FF] text-[#7C3AED]' :
                            item.category === 'ENGINEERING' ? 'bg-[#EFF6FF] text-[#2563EB]' :
                            'bg-[#EEF2FF] text-[#4F46E5]'}
                        `}>
                          {item.category}
                        </span>

                        <div className="text-right">
                          <span className={`text-2xl font-extrabold block
                            ${item.score >= 85 ? 'text-[#2563EB]' : item.score >= 70 ? 'text-[#7C3AED]' : 'text-[#EF4444]'}
                          `}>
                            {item.score}%
                          </span>
                          <span className="text-[8px] font-extrabold text-[#9CA3AF] uppercase tracking-wider">Match Score</span>
                        </div>
                      </div>

                      <h3 className="text-sm font-extrabold text-[#111827]">{item.role}</h3>
                      <p className="text-xs text-[#6B7280] mt-1">Applied at: {item.company}</p>

                      {/* Progress Bar */}
                      <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED]"
                          initial={{ width: 0 }}
                          animate={{ width: `${item.score}%` }}
                          transition={{ duration: 1.1, ease: 'easeOut', delay: idx * 0.1 }}
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      {/* Meta information */}
                      <div className="flex items-center gap-3 text-[10px] text-[#9CA3AF] font-medium mb-4">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {item.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><History size={12} /> {item.version}</span>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => alert(`Opening report for ${item.role}`)}
                          className="flex-1 py-2 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:from-[#3B82F6] hover:to-[#8B5CF6] text-white text-xs font-bold rounded-xl cursor-pointer"
                        >
                          View Report
                        </button>
                        <button
                          onClick={() => triggerToast(`Re-analyzing ${item.role}...`)}
                          className="p-2 border border-[#E5E7EB] hover:bg-[#F8FAFC] rounded-xl text-[#6B7280] cursor-pointer"
                          title="Re-analyze"
                        >
                          <RefreshCw size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Kebab action dropdown */}
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => setActiveKebab(activeKebab === item.id ? null : item.id)}
                        className="p-1 rounded-full hover:bg-gray-100 text-[#9CA3AF] hover:text-[#111827] cursor-pointer"
                      >
                        <MoreVertical size={16} />
                      </button>

                      <AnimatePresence>
                        {activeKebab === item.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 mt-1 w-36 bg-white border border-[#E5E7EB] rounded-xl shadow-lg p-1 z-20 flex flex-col"
                          >
                            <button
                              onClick={() => handleExportPDF(item.role)}
                              className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] rounded-lg text-left"
                            >
                              <Download size={12} /> Export PDF
                            </button>
                            <button
                              onClick={() => {
                                setDeleteTarget({ id: item.id, type: 'analysis' });
                                setShowDeleteModal(true);
                              }}
                              className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#EF4444] hover:bg-red-50 rounded-lg text-left"
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* B. TABLE VIEW */}
            {viewType === 'table' && (
              <motion.div
                key="table-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm"
              >
                <table className="w-full text-left border-collapse text-xs font-medium text-[#111827]">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[#6B7280]">
                      <th className="px-6 py-3.5">Role</th>
                      <th className="px-6 py-3.5">Company</th>
                      <th className="px-6 py-3.5">Category</th>
                      <th className="px-6 py-3.5">Match Score</th>
                      <th className="px-6 py-3.5">Date</th>
                      <th className="px-6 py-3.5">Version</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAnalyses.map((item) => (
                      <tr key={item.id} className="border-b border-[#F3F4F6] hover:bg-[#F8FAFC]/50 transition-colors">
                        <td className="px-6 py-4 font-bold">{item.role}</td>
                        <td className="px-6 py-4 text-[#6B7280]">{item.company}</td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-bold uppercase tracking-wider">{item.category}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-[#2563EB]">{item.score}%</td>
                        <td className="px-6 py-4 text-[#6B7280]">{item.date}</td>
                        <td className="px-6 py-4 text-[#6B7280]">{item.version}</td>
                        <td className="px-6 py-4 text-right flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => alert(`Opening report for ${item.role}`)}
                            className="p-1.5 hover:bg-[#EFF6FF] text-[#2563EB] rounded"
                            title="View report"
                          >
                            <FileText size={14} />
                          </button>
                          <button
                            onClick={() => handleExportPDF(item.role)}
                            className="p-1.5 hover:bg-[#F5F3FF] text-[#7C3AED] rounded"
                            title="Export PDF"
                          >
                            <Download size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteTarget({ id: item.id, type: 'analysis' });
                              setShowDeleteModal(true);
                            }}
                            className="p-1.5 hover:bg-red-50 text-[#EF4444] rounded"
                            title="Delete record"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {/* C. TIMELINE VIEW */}
            {viewType === 'timeline' && (
              <motion.div
                key="timeline-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative border-l border-[#E5E7EB] ml-32 pl-8 space-y-6"
              >
                {filteredAnalyses.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="relative"
                  >
                    {/* Date label left axis */}
                    <div className="absolute -left-40 top-1 text-right w-28 text-[10px] font-bold text-[#9CA3AF] uppercase">
                      {item.date}
                    </div>

                    {/* Bullet */}
                    <span className={`absolute -left-[39px] w-3.5 h-3.5 rounded-full border-2 bg-white flex items-center justify-center
                      ${item.score >= 85 ? 'border-[#2563EB]' : 'border-[#7C3AED]'}
                    `}>
                      <span className={`w-1.5 h-1.5 rounded-full
                        ${item.score >= 85 ? 'bg-[#2563EB]' : 'bg-[#7C3AED]'}
                      `} />
                    </span>

                    {/* Compact Card right */}
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-xs max-w-md flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-extrabold text-[#111827]">{item.role}</h4>
                        <p className="text-[10px] text-[#6B7280] mt-0.5">{item.company} • Version {item.version}</p>
                      </div>
                      <span className={`text-xs font-extrabold
                        ${item.score >= 85 ? 'text-[#2563EB]' : 'text-[#7C3AED]'}
                      `}>
                        {item.score}% Match
                      </span>
                    </div>

                  </motion.div>
                ))}
              </motion.div>
            )}

          </AnimatePresence>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-xs font-semibold text-[#6B7280] pt-4">
            <span>Showing 1-3 of 24 results</span>
            
            <div className="flex items-center gap-1.5">
              <button className="p-1.5 border border-[#E5E7EB] rounded-lg hover:bg-gray-50 text-[#9CA3AF] disabled:opacity-40" disabled>
                <ChevronLeft size={14} />
              </button>
              <button className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white text-xs font-bold shadow-sm">1</button>
              <button className="w-8 h-8 rounded-lg border border-[#E5E7EB] hover:bg-gray-50 text-xs font-bold">2</button>
              <button className="w-8 h-8 rounded-lg border border-[#E5E7EB] hover:bg-gray-50 text-xs font-bold">3</button>
              <button className="p-1.5 border border-[#E5E7EB] rounded-lg hover:bg-gray-50 text-[#6B7280]">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ════════ SECTION 2: TWO-COLUMN SPLIT ════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-[6fr_4fr] gap-6 items-stretch">
          
          {/* Left Column: Interview Sessions */}
          <motion.div variants={itemVar} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic size={16} className="text-[#6B7280]" />
                <span className="text-[10px] font-extrabold text-[#6B7280] uppercase tracking-widest">Interview Sessions</span>
              </div>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert('Redirecting to full sessions history...'); }}
                className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-0.5"
              >
                See All Sessions <ChevronRight size={13} className="mt-0.5" />
              </a>
            </div>

            <div className="space-y-4">
              {sessions.map((item) => (
                <div key={item.id} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Interactive audio play button */}
                      <button
                        onClick={() => toggleAudio(item.id)}
                        className="w-10 h-10 rounded-full bg-[#EFF6FF] hover:bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer shadow-xs"
                      >
                        {activeAudioPlayer === item.id && audioPlaying ? (
                          <Pause size={15} fill="currentColor" />
                        ) : (
                          <Play size={15} fill="currentColor" className="ml-0.5" />
                        )}
                      </button>
                      <div>
                        <h4 className="text-xs font-extrabold text-[#111827]">{item.title}</h4>
                        <p className="text-[10px] text-[#6B7280] mt-1">Duration: {item.duration} • {item.date}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-extrabold text-[#111827] block">Score: {item.score}/100</span>
                      <span className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded mt-1
                        ${item.confidence === 'HIGH' ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-[#FFFBEB] text-[#F59E0B]'}
                      `}>
                        CONFIDENCE: {item.confidence}
                      </span>
                    </div>
                  </div>

                  {/* Audio player expander */}
                  <AnimatePresence>
                    {activeAudioPlayer === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden border-t border-[#F3F4F6] pt-3.5"
                      >
                        <div className="flex items-center gap-4 bg-[#F8FAFC] rounded-xl p-3 border border-[#E5E7EB]">
                          <span className="text-[9px] font-bold text-[#6B7280] font-mono">0:12</span>
                          
                          {/* Pulsing visual waves */}
                          <div className="flex-1 flex items-end gap-0.5 h-6 select-none">
                            {Array.from({ length: 28 }).map((_, i) => (
                              <motion.span
                                key={i}
                                className="w-1 bg-[#2563EB] rounded-full flex-1"
                                animate={audioPlaying ? {
                                  height: [4, Math.random() * 20 + 4, 4]
                                } : { height: 4 }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 0.8 + Math.random() * 0.4,
                                  ease: 'easeInOut'
                                }}
                                style={{ height: 4 }}
                              />
                            ))}
                          </div>

                          <span className="text-[9px] font-bold text-[#6B7280] font-mono">18:42</span>
                          <button
                            onClick={() => toggleAudio(item.id)}
                            className="p-1 rounded hover:bg-gray-200 text-[#6B7280] cursor-pointer"
                          >
                            <Headphones size={13} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Resume Versions */}
          <motion.div variants={itemVar} className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <History size={16} className="text-[#6B7280]" />
              <span className="text-[10px] font-extrabold text-[#6B7280] uppercase tracking-widest">Resume Versions</span>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between h-full">
              <div className="divide-y divide-[#F3F4F6] flex-1">
                {versions.map((ver) => (
                  <div
                    key={ver.id}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-[#F8FAFC]/50 transition-colors group relative"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border
                        ${ver.active ? 'bg-blue-50 text-[#2563EB] border-blue-200' : 'bg-gray-50 text-[#9CA3AF] border-[#E5E7EB]'}
                      `}>
                        <FileCheck size={16} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#111827] truncate max-w-[150px]">{ver.name}</span>
                          {ver.active && (
                            <span className="px-2 py-0.5 rounded text-[8px] font-extrabold text-[#2563EB] bg-[#EFF6FF] tracking-wider uppercase">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#9CA3AF] mt-0.5">Updated {ver.date}</p>
                      </div>
                    </div>

                    {/* Kebab versions button */}
                    <div>
                      <button
                        onClick={() => setActiveVersionKebab(activeVersionKebab === ver.id ? null : ver.id)}
                        className="p-1 rounded-full hover:bg-gray-100 text-[#9CA3AF] hover:text-[#111827] cursor-pointer"
                      >
                        <MoreVertical size={14} />
                      </button>

                      <AnimatePresence>
                        {activeVersionKebab === ver.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-4 mt-1 w-36 bg-white border border-[#E5E7EB] rounded-xl shadow-lg p-1 z-20 flex flex-col"
                          >
                            {!ver.active && (
                              <button
                                onClick={() => handleRestoreVersion(ver)}
                                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] rounded-lg text-left"
                              >
                                <Star size={12} className="text-amber-400" /> Set as Active
                              </button>
                            )}
                            <button
                              onClick={() => handleExportPDF(ver.name)}
                              className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] rounded-lg text-left"
                            >
                              <Download size={12} /> Export
                            </button>
                            <button
                              onClick={() => {
                                setDeleteTarget({ id: ver.id, type: 'version' });
                                setShowDeleteModal(true);
                              }}
                              className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#EF4444] hover:bg-red-50 rounded-lg text-left"
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>
                ))}
              </div>

              {/* Upload new version dashed row */}
              <a
                href="#"
                onClick={handleUploadNewVersion}
                className="m-4 py-3 border border-dashed border-[#2563EB]/40 hover:border-[#2563EB] rounded-xl bg-[#EFF6FF]/20 hover:bg-[#EFF6FF]/40 text-[#2563EB] flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer select-none"
              >
                <PlusCircle size={15} />
                Upload New Version
              </a>
            </div>
          </motion.div>

        </div>

        {/* Footer */}
        <footer className="border-t border-[#E5E7EB] pt-6 pb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B7280] mt-8">
          <div>
            <span className="font-extrabold text-[#2563EB] text-sm">ResumeAI Analyzer</span>
            <p className="mt-0.5">© 2024 ResumeAI Analyzer. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {['Sitemap', 'Privacy Policy', 'Terms of Service', 'Support'].map((link, i) => (
              <React.Fragment key={link}>
                {i > 0 && <span className="text-[#E5E7EB]">·</span>}
                <a href="#" className="hover:text-[#2563EB] hover:underline transition-colors font-medium">{link}</a>
              </React.Fragment>
            ))}
          </div>
        </footer>

      </motion.div>
    </div>
  );
}
