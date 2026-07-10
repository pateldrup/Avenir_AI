import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Briefcase,
  GitCompare,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Lightbulb,
  GraduationCap,
  Rocket,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Info,
  Layers,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import axios from 'axios';

const radarData = [
  { subject: 'Design', A: 95, B: 90, fullMark: 100 },
  { subject: 'Technical', A: 50, B: 85, fullMark: 100 },
  { subject: 'Collaboration', A: 85, B: 80, fullMark: 100 },
  { subject: 'Research', A: 80, B: 75, fullMark: 100 },
  { subject: 'Leadership', A: 75, B: 80, fullMark: 100 },
  { subject: 'Tools', A: 90, B: 95, fullMark: 100 },
];

const pieData = [
  { name: 'Matched', value: 65, color: '#10B981' },
  { name: 'Partial', value: 20, color: '#F59E0B' },
  { name: 'Missing', value: 15, color: '#EF4444' },
];

const barSkills = [
  { name: 'Design', percentage: 95, level: 'Excellent', color: '#10B981' },
  { name: 'Technical', percentage: 58, level: 'Needs Review', color: '#F59E0B' },
  { name: 'Collaboration', percentage: 88, level: 'Strong', color: '#10B981' },
  { name: 'Research', percentage: 80, level: 'Good', color: '#10B981' },
];

const heatMapData = [
  { category: 'Design', skill: 'UI/UX Design', match: 98, status: 'green' },
  { category: 'Design', skill: 'Design Systems', match: 92, status: 'green' },
  { category: 'Design', skill: 'Figma Prototyping', match: 95, status: 'green' },
  { category: 'Technical', skill: 'React.js', match: 60, status: 'amber' },
  { category: 'Technical', skill: 'Three.js / WebGL', match: 20, status: 'red' },
  { category: 'Technical', skill: 'Tailwind CSS', match: 90, status: 'green' },
  { category: 'Collaboration', skill: 'Cross-functional Collab', match: 85, status: 'green' },
  { category: 'Collaboration', skill: 'Agile Delivery', match: 80, status: 'green' },
  { category: 'Research', skill: 'User Interviews', match: 82, status: 'green' },
  { category: 'Research', skill: 'Usability Testing', match: 78, status: 'green' },
];

export default function GapAnalysisPage() {
  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState(null);
  
  const [visTab, setVisTab] = useState('bar'); 
  const [showExpGaps, setShowExpGaps] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const analysisId = localStorage.getItem('avenir_analysis_id');
        const token = localStorage.getItem('token');
        
        if (!analysisId) {
          setError('No recent analysis found. Please run a job description analysis first.');
          setLoading(false);
          return;
        }

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/analysis/${analysisId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setAnalysisData(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analysis:', err);
        setError('Failed to load analysis data.');
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  const containerVar = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const itemVar = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const cardHover = {
    y: -4,
    boxShadow: '0 20px 50px rgba(37,99,235,0.12)',
    transition: { duration: 0.2, ease: 'easeOut' },
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-9 w-64 bg-gray-200 rounded-lg" />
        <div className="h-5 w-full max-w-lg bg-gray-200 rounded-md mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-72 bg-gray-200 rounded-2xl" />
          <div className="h-72 bg-gray-200 rounded-2xl" />
          <div className="h-72 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertTriangle size={48} className="text-[#EF4444] mb-4" />
        <h2 className="text-xl font-bold text-[#111827]">{error}</h2>
      </div>
    );
  }

  // Derived Data
  const atsScore = analysisData?.atsScore || 0;
  const matchedSkills = analysisData?.matchedSkills || [];
  const missingSkills = analysisData?.missingSkills || [];
  const totalSkills = matchedSkills.length + missingSkills.length;
  const matchedPercentage = totalSkills > 0 ? Math.round((matchedSkills.length / totalSkills) * 100) : 0;
  const missingPercentage = totalSkills > 0 ? Math.round((missingSkills.length / totalSkills) * 100) : 0;
  
  const dynamicPieData = [
    { name: 'Matched', value: matchedPercentage, color: '#10B981' },
    { name: 'Missing', value: missingPercentage, color: '#EF4444' }
  ];

  const dynamicBarSkills = [
    ...matchedSkills.slice(0, 4).map(s => ({ name: s.name, percentage: 95, level: 'Strong', color: '#10B981' })),
    ...missingSkills.slice(0, 2).map(s => ({ name: s.name, percentage: 20, level: 'Needs Review', color: '#EF4444' }))
  ];

  return (
    <div className="relative">
      <motion.div variants={containerVar} initial="hidden" animate="visible" className="flex flex-col gap-8">
        
        <motion.div variants={itemVar}>
          <h1 className="text-3xl lg:text-[2.2rem] font-extrabold text-[#111827] tracking-tight leading-tight">
            Gap Analysis
          </h1>
          <p className="text-[#6B7280] font-medium text-sm lg:text-base mt-2">
            We've compared your resume against the <span className="font-bold text-[#111827]">{analysisData?.jobTitle}</span> role at <span className="font-bold text-[#111827]">{analysisData?.company}</span>. Here's how you stack up.
          </p>
        </motion.div>

        <motion.div variants={itemVar} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <motion.div whileHover={cardHover} className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] p-6 border border-[#E5E7EB] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <FileText size={18} className="text-[#2563EB]" />
                <h3 className="text-sm font-extrabold text-[#111827] uppercase tracking-wider">Your Resume Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map((skill, i) => (
                  <motion.div
                    key={skill.name + i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.05, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.05 }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border select-none bg-[#ECFDF5] border-emerald-200 text-emerald-700`}
                  >
                    <CheckCircle2 size={13} />
                    {skill.name}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="mt-8 text-[11px] text-[#6B7280] font-medium flex items-center gap-1.5 bg-[#F8FAFC] p-3 rounded-xl">
              <Info size={14} className="text-[#2563EB]" />
              Analysis based on your latest uploaded PDF.
            </div>
          </motion.div>

          <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg width={144} height={144} className="-rotate-90 absolute inset-0">
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
                <circle cx={72} cy={72} r={64} fill="none" stroke="#E5E7EB" strokeWidth={10} />
                <motion.circle
                  cx={72} cy={72} r={64} fill="none" stroke="url(#scoreGrad)" strokeWidth={10} strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 64}
                  initial={{ strokeDashoffset: 2 * Math.PI * 64 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 64 * (1 - (atsScore / 100)) }}
                  transition={{ duration: 1.4, ease: 'easeOut' }}
                />
              </svg>
              <div className="z-10 flex flex-col items-center">
                <span className="text-4xl font-extrabold text-[#111827]">{atsScore}%</span>
                <span className="text-[9px] font-bold text-[#6B7280] tracking-widest mt-1">MATCH SCORE</span>
              </div>
            </div>

            <div className="mt-6 relative overflow-hidden px-4.5 py-1.5 bg-gradient-to-r from-[#EFF6FF] to-[#F5F3FF] border border-[#E5E7EB] rounded-full text-xs font-bold text-[#4F46E5] flex items-center gap-1.5 shadow-sm">
              <Sparkles size={13} className="text-[#F59E0B]" />
              <span>AI Insights: Highly Compatible</span>
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 animate-shimmer"
                style={{
                  animation: 'shimmer 2.5s infinite',
                  background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)'
                }}
              />
            </div>

            <div className="mt-5 w-full max-w-[200px] flex flex-col items-center">
              <div className="flex items-center justify-between w-full text-[10px] font-bold text-[#6B7280] mb-1">
                <span>ATS Score</span>
                <span className="text-[#10B981]">85%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                  className="h-full bg-[#10B981]"
                />
              </div>
              <span className="mt-1.5 flex items-center gap-1 text-[9px] font-extrabold text-[#10B981] uppercase tracking-wider bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                Passes ATS Screening ✓
              </span>
            </div>
          </div>

          <motion.div whileHover={cardHover} className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] p-6 border border-[#E5E7EB] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <Briefcase size={18} className="text-[#7C3AED]" />
                <h3 className="text-sm font-extrabold text-[#111827] uppercase tracking-wider">Job Requirements</h3>
              </div>
              <ul className="space-y-3.5 text-xs text-[#111827] font-medium max-h-56 overflow-y-auto pr-2">
                {missingSkills.map((req, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-2.5 leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] mt-1.5 shrink-0" />
                    <span><span className="font-bold">{req.name}</span>: {req.impact}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

        </motion.div>

        <motion.div variants={itemVar} className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] border border-[#E5E7EB] p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-bold text-[#111827]">Skill Match Breakdown</h2>
              <p className="text-xs text-[#6B7280] mt-0.5">Explore details of your match profile</p>
            </div>

            <div className="inline-flex bg-[#F3F4F6] rounded-xl p-1 relative z-10 shrink-0">
              {['bar', 'radar', 'heatmap'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setVisTab(tab)}
                  className={`relative px-4.5 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer rounded-lg transition-colors z-10
                    ${visTab === tab ? 'text-[#2563EB]' : 'text-[#6B7280] hover:text-[#111827]'}
                  `}
                >
                  {visTab === tab && (
                    <motion.div
                      layoutId="activeTabOutline"
                      className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {tab === 'bar' ? 'Bar View' : tab === 'radar' ? 'Radar View' : 'Heat Map'}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[260px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              
              {visTab === 'bar' && (
                <motion.div
                  key="bar-tab"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="w-full space-y-4"
                >
                  {dynamicBarSkills.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="w-28 text-xs font-bold text-[#111827]">{item.name}</div>
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden relative">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(135deg, ${item.color}, ${item.color}bb)`
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ duration: 1.1, ease: 'easeOut', delay: idx * 0.08 }}
                        />
                      </div>
                      <div className="w-24 text-right flex items-center justify-end gap-1.5 text-xs">
                        <span className="font-bold text-[#111827]">{item.percentage}%</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase
                          ${item.level === 'Excellent' || item.level === 'Strong' ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-[#FFFBEB] text-[#F59E0B]'}
                        `}>
                          {item.level}
                        </span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {visTab === 'radar' && (
                <motion.div
                  key="radar-tab"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full h-[260px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#E5E7EB" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: '#9CA3AF' }} />
                      <Radar name="Your Skills" dataKey="A" stroke="#2563EB" fill="#2563EB" fillOpacity={0.25} />
                      <Radar name="Job Requirements" dataKey="B" stroke="#7C3AED" strokeDasharray="4 4" fill="#7C3AED" fillOpacity={0.1} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </motion.div>
              )}

              {visTab === 'heatmap' && (
                <motion.div
                  key="heatmap-tab"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="w-full grid grid-cols-2 sm:grid-cols-5 gap-3"
                >
                  {heatMapData.map((cell, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.04 }}
                      onMouseEnter={() => setHoveredCell(cell)}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`relative p-3.5 border rounded-xl flex flex-col justify-between min-h-[90px] shadow-sm select-none cursor-pointer transition-all hover:scale-102
                        ${cell.status === 'green' ? 'bg-[#ECFDF5] border-emerald-200 hover:border-emerald-400' :
                          cell.status === 'amber' ? 'bg-[#FFFBEB] border-amber-200 hover:border-amber-400' :
                          'bg-[#FEF2F2] border-red-200 hover:border-red-400'}
                      `}
                    >
                      <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">{cell.category}</span>
                      <span className="text-xs font-bold text-[#111827] mt-1.5 leading-tight truncate">{cell.skill}</span>
                      
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-black/5">
                        <span className="text-[10px] font-bold uppercase text-[#6B7280]">Match</span>
                        <span className={`text-xs font-extrabold
                          ${cell.status === 'green' ? 'text-emerald-700' :
                            cell.status === 'amber' ? 'text-amber-700' : 'text-red-700'}
                        `}>
                          {cell.match}%
                        </span>
                      </div>

                      {hoveredCell === cell && (
                        <div className="absolute left-1/2 -top-12 -translate-x-1/2 z-40 bg-white border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 shadow-lg text-[10px] font-bold text-[#111827] whitespace-nowrap pointer-events-none">
                          <p>{cell.skill}</p>
                          <p className="text-[#2563EB] mt-0.5">Match Level: {cell.match}%</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          <motion.div variants={itemVar} className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-[#111827]">Missing Skills</h3>
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="w-8 h-8 rounded-full bg-[#FEF3C7] flex items-center justify-center text-[#F59E0B]"
                >
                  <Lightbulb size={16} />
                </motion.div>
              </div>

              <div className="space-y-3.5">
                {missingSkills.map((item, idx) => (
                  <motion.div
                    key={item.name + idx}
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-xl p-4 border border-[#E5E7EB] flex items-start justify-between gap-4 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-red-50 text-red-500 border-red-200`}>
                        <Layers size={15} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#111827]">{item.name}</h4>
                        <p className="text-[11px] text-[#6B7280] mt-1 leading-relaxed">{item.impact}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider bg-[#FEF2F2] text-[#EF4444]`}>
                      Critical Gap
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 border-t border-[#E5E7EB] pt-4">
                <button
                  onClick={() => setShowExpGaps(!showExpGaps)}
                  className="flex items-center justify-between w-full text-xs font-bold text-[#6B7280] hover:text-[#111827] cursor-pointer"
                >
                  <span>Missing Experience Gaps</span>
                  <motion.span animate={{ rotate: showExpGaps ? 180 : 0 }}>
                    <ChevronDown size={14} />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {showExpGaps && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-3"
                    >
                      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm text-xs font-medium text-[#111827]">
                        <div className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] mt-1.5 shrink-0" />
                          <div>
                            <p className="font-bold">Scale Design Systems Leading</p>
                            <p className="text-[11px] text-[#6B7280] mt-0.5">3+ years leading design systems at scale — not evident in current resume.</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Column B: Bridge the Gap */}
          <motion.div variants={itemVar} className="bg-gradient-to-br from-[#EEF2FF] to-[#F5F3FF] border border-[#E5E7EB] rounded-2xl p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-[#111827] mb-2">Bridge the Gap</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed mb-6">
                We've curated a fast-track learning path to help you master these skills before your next application.
              </p>

              {/* Recommended courses */}
              <div className="space-y-3">
                {[
                  { name: '3D Web Masterclass', meta: '5.5 hours • Advanced Three.js', icon: GraduationCap, color: '#2563EB', bg: '#EFF6FF' },
                  { name: 'React for Designers', meta: '2.0 hours • Component Architecture', icon: Rocket, color: '#7C3AED', bg: '#F5F3FF' },
                ].map((course, idx) => (
                  <motion.div
                    key={course.name}
                    whileHover={{ y: -2, scale: 1.01 }}
                    className="bg-white rounded-xl p-4 border border-[#E5E7EB] flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: course.bg }}>
                        <course.icon size={15} style={{ color: course.color }} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#111827]">{course.name}</h4>
                        <p className="text-[10px] text-[#6B7280] mt-0.5">{course.meta}</p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-[#9CA3AF] group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(79,70,229,0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:from-[#3B82F6] hover:to-[#8B5CF6] text-white text-xs font-bold rounded-xl transition-all cursor-pointer mt-6"
            >
              Prep Now
              <ChevronRight size={14} />
            </motion.button>
          </motion.div>

        </div>

        {/* ════════ ROW 4: ADDITIONS ════════ */}

        {/* Strengths & Weaknesses Split Card */}
        <motion.div variants={itemVar} className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] border border-[#E5E7EB] p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-[#E5E7EB]">
          {/* Strengths */}
          <div className="pb-6 md:pb-0">
            <div className="flex items-center gap-2.5 mb-4">
              <CheckCircle2 size={18} className="text-[#10B981]" />
              <h3 className="text-sm font-bold text-[#111827]">Strengths</h3>
            </div>
            <ul className="space-y-3.5 text-xs text-[#111827] font-medium">
              <li className="flex items-start gap-2.5">
                <span className="text-[#10B981] mt-0.5">✓</span>
                <div>
                  <span className="font-bold">Strong UI/UX Foundation:</span>
                  <span className="text-[#6B7280] ml-1">Your Figma and wireframing skills exceed typical requirements.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#10B981] mt-0.5">✓</span>
                <div>
                  <span className="font-bold">Design Systems:</span>
                  <span className="text-[#6B7280] ml-1">Solid experience in managing production design systems.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="pt-6 md:pt-0 md:pl-8">
            <div className="flex items-center gap-2.5 mb-4">
              <AlertTriangle size={18} className="text-[#F59E0B]" />
              <h3 className="text-sm font-bold text-[#111827]">Weaknesses</h3>
            </div>
            <ul className="space-y-3.5 text-xs text-[#111827] font-medium">
              <li className="flex items-start gap-2.5">
                <span className="text-[#EF4444] mt-0.5">!</span>
                <div>
                  <span className="font-bold">3D Visualizations:</span>
                  <span className="text-[#6B7280] ml-1">Lack of Three.js or WebGL credentials on your resume.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#F59E0B] mt-0.5">!</span>
                <div>
                  <span className="font-bold">SaaS Engineering Alignment:</span>
                  <span className="text-[#6B7280] ml-1">Partial matching in developer tools frameworks experience.</span>
                </div>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Keywords Missing from Resume */}
        <motion.div variants={itemVar} className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] border border-[#E5E7EB] p-6 lg:p-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#111827]">Keywords Missing from Resume</h3>
              <div className="relative group">
                <Info size={14} className="text-[#9CA3AF] cursor-pointer hover:text-[#111827]" />
                <div className="absolute left-1/2 -top-10 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#111827] text-white text-[9px] px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-20">
                  ATS parses these keywords to verify matching score
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {['Design Tokens', 'WCAG Compliance', 'Component Library', 'Figma Variables'].map((kw, i) => (
              <motion.span
                key={kw}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05, type: 'spring' }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100 select-none"
              >
                <XCircle size={13} className="text-red-500" />
                {kw}
              </motion.span>
            ))}
          </div>

          <div className="border-t border-[#F3F4F6] pt-5">
            <h4 className="text-xs font-bold text-[#111827] mb-3">Recommended Keywords to Add</h4>
            <div className="flex flex-wrap gap-2">
              {['Design Systems Lead', '3D Graphics', 'React Integration', 'User Testing KPI'].map((kw, i) => (
                <motion.span
                  key={kw}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05, type: 'spring' }}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#ECFDF5] text-emerald-700 border border-emerald-100 select-none"
                >
                  <CheckCircle2 size={13} className="text-[#10B981]" />
                  {kw}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Row 5: Pie Chart Widget & Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-[4fr_6fr] gap-6">
          {/* Pie Chart Widget */}
          <motion.div variants={itemVar} whileHover={cardHover} className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] border border-[#E5E7EB] p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1">Overall Skill Composition</h3>
              <p className="text-sm font-bold text-[#111827] mb-5">Proportions of matched target skills</p>
            </div>
            
            <div className="h-44 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dynamicPieData}
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                    isAnimationActive
                  >
                    {dynamicPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-[#111827]">{totalSkills}</span>
                <span className="text-[8px] text-[#6B7280] font-bold uppercase tracking-wider">Total Skills</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-bold text-[#6B7280] mt-4 pt-3 border-t border-[#F3F4F6]">
              {dynamicPieData.map((p, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                  <span>{p.name}: {p.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Timeline Node Path */}
          <motion.div variants={itemVar} className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] border border-[#E5E7EB] p-6">
            <h3 className="text-sm font-bold text-[#111827] mb-6">Your Path to Match</h3>

            <div className="relative border-l border-[#E5E7EB] ml-3.5 pl-6 space-y-6">
              {[
                { title: 'Current State', desc: 'Match score at 72% with critical gaps.', status: 'current', time: 'Today' },
                { title: 'Complete 3D Web Masterclass', desc: 'Master Three.js basics & WebGL concepts.', status: 'pending', time: 'Step 1' },
                { title: 'Practice React Patterns', desc: 'Build scalable developer integrations.', status: 'pending', time: 'Step 2' },
                { title: 'Ready to Apply', desc: 'Reach 95% profile capability score.', status: 'success', time: 'Target' },
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  {/* Bullet */}
                  <span className={`absolute -left-[31px] w-3.5 h-3.5 rounded-full border-2 bg-white flex items-center justify-center
                    ${step.status === 'current' ? 'border-[#2563EB] shadow-sm' :
                      step.status === 'success' ? 'border-[#10B981]' : 'border-gray-300'}
                  `}>
                    {step.status === 'current' && <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />}
                  </span>

                  <div>
                    <span className="text-[9px] font-bold text-[#9CA3AF] uppercase font-mono">{step.time}</span>
                    <h4 className="text-xs font-bold text-[#111827] mt-0.5">{step.title}</h4>
                    <p className="text-[11px] text-[#6B7280] mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Footer ── */}
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
