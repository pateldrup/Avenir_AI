import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link as LinkIcon,
  Zap,
  Globe,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  FileText,
  Copy,
  Trash2,
  ChevronDown,
  Briefcase,
  Building,
  MapPin,
  Plus,
  X,
  Rocket,
  Info,
  Loader2,
} from 'lucide-react';
import axios from 'axios';

/* ─── Mock Extracted Data ─── */
const MOCK_EXTRACTED_JD = `Job Title: Senior AI Product Lead
Company: OpenAI
Location: San Francisco, CA (Hybrid)

Responsibilities:
• Drive product strategy and execution for our core LLM models and APIs.
• Partner closely with Research, Engineering, and Design teams to build next-generation AI agents.
• Engage with enterprise customers to understand integration requirements and feedback loops.
• Define KPIs and product requirements for developer platforms.

Required Skills:
• 5+ years of Product Management experience, preferably in AI, machine learning, or developer platforms.
• Deep technical understanding of transformer architectures, embeddings, and fine-tuning.
• Excellent communication skills with the ability to translate complex AI research into user value.
• Experience managing high-scale SaaS or developer API platforms.`;

export default function JobDescriptionPage({ onNext }) {
  const [loading, setLoading] = useState(true);
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState(null);
  const [urlValid, setUrlValid] = useState(false);
  const [fetching, setFetching] = useState(false);
  
  const [jdText, setJdText] = useState('');
  const [jdError, setJdError] = useState(null);
  const [copyTooltip, setCopyTooltip] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Manual form state
  const [showManual, setShowManual] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualCompany, setManualCompany] = useState('');
  const [manualLocation, setManualLocation] = useState('');
  const [manualType, setManualType] = useState('Full-time');
  const [manualResp, setManualResp] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [manualSkills, setManualSkills] = useState(['React', 'Tailwind CSS', 'Framer Motion']);

  // UI state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const rightCardRef = useRef(null);

  // Initial skeleton load simulation
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Validate URL format
  const validateUrl = (val) => {
    if (!val) {
      setUrlError(null);
      setUrlValid(false);
      return;
    }
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    );
    if (pattern.test(val)) {
      setUrlError(null);
      setUrlValid(true);
    } else {
      setUrlError('Please enter a valid URL');
      setUrlValid(false);
    }
  };

  const handleUrlBlur = () => {
    validateUrl(urlInput);
  };

  // Fetch URL via Backend
  const handleFetchUrl = async () => {
    if (!urlValid || !urlInput) {
      setUrlError('Please enter a valid URL first');
      return;
    }

    setFetching(true);
    setUrlError(null);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/analysis/scrape`, { url: urlInput }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFetching(false);
      setToastMessage('Job details extracted successfully!');
      setShowToast(true);
      
      setJdText('');
      
      const textToType = res.data.text || 'No content could be extracted.';

      // Typewriter streaming simulation for Right Card Textarea
      let index = 0;
      const interval = setInterval(() => {
        setJdText((prev) => prev + textToType[index]);
        index++;
        if (index >= textToType.length - 1) {
          clearInterval(interval);
        }
      }, 2); // Faster typing speed
    } catch (err) {
      setFetching(false);
      setUrlError(err.response?.data?.message || 'Failed to fetch URL. Ensure it is accessible.');
    }
  };

  // Switch to manual text scrolling & glow highlight
  const handleSwitchToManual = () => {
    rightCardRef.current?.scrollIntoView({ behavior: 'smooth' });
    const el = rightCardRef.current;
    if (el) {
      el.classList.add('ring-4', 'ring-[#4F46E5]/40');
      setTimeout(() => {
        el.classList.remove('ring-4', 'ring-[#4F46E5]/40');
      }, 1500);
    }
  };

  // Textarea tools
  const handleCopyText = () => {
    if (!jdText) return;
    navigator.clipboard.writeText(jdText);
    setCopyTooltip(true);
    setTimeout(() => setCopyTooltip(false), 1500);
  };

  const handleClearText = () => {
    setJdText('');
  };

  // Manual skills tag additions
  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!manualSkills.includes(skillInput.trim())) {
        setManualSkills([...manualSkills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setManualSkills(manualSkills.filter((s) => s !== skill));
  };

  // Main submission validator
  const isFormValid = () => {
    if (jdText.length >= 50) return true;
    if (manualTitle && manualCompany && manualLocation && manualResp) return true;
    return false;
  };

  // Submit trigger
  const handleAnalyzeMatch = async () => {
    if (!isFormValid()) {
      if (jdText.length > 0 && jdText.length < 50) {
        setJdError('This looks too short — add more detail for better analysis');
      } else {
        setJdError('Please paste a job description to continue');
      }
      return;
    }

    setJdError(null);
    setIsAnalyzing(true);

    try {
      const token = localStorage.getItem('token');
      const resumeId = localStorage.getItem('avenir_resume_id');

      if (!resumeId) {
        setJdError('No resume uploaded. Please go back and upload your resume first.');
        setIsAnalyzing(false);
        return;
      }

      // Combine JD text and manual skills if any
      const fullJdText = jdText + (manualSkills.length > 0 ? `\n\nRequired Skills:\n${manualSkills.join(', ')}` : '');

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/analysis/gap`, {
        resumeId,
        jobDescription: fullJdText,
        jobTitle: manualTitle || 'Target Role',
        company: manualCompany || 'Target Company'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsAnalyzing(false);
      
      // Save analysis ID to local storage so GapAnalysisPage can read it
      localStorage.setItem('avenir_analysis_id', res.data._id);

      setToastMessage('Analysis completed successfully!');
      setShowToast(true);
      
      if (onNext) onNext();
      
    } catch (err) {
      setIsAnalyzing(false);
      setJdError(err.response?.data?.message || 'AI Engine failed to generate analysis.');
    }
  };

  // Helpers for text counts
  const charCount = jdText.length;
  const wordCount = jdText ? jdText.trim().split(/\s+/).length : 0;

  // Stagger configurations
  const containerVar = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVar = {
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-9 w-64 bg-gray-200 rounded-lg" />
        <div className="h-5 w-full max-w-lg bg-gray-200 rounded-md mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-[4fr_6fr] gap-6">
          <div className="h-[480px] bg-gray-200 rounded-2xl" />
          <div className="h-[480px] bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Toast alert */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, x: 50, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3.5 bg-white border border-[#E5E7EB] rounded-xl shadow-2xl"
          >
            <div className="w-6 h-6 rounded-full bg-[#ECFDF5] flex items-center justify-center">
              <CheckCircle2 size={16} className="text-[#10B981]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#111827]">Success</p>
              <p className="text-[10px] text-[#6B7280]">{toastMessage}</p>
            </div>
            <button onClick={() => setShowToast(false)} className="text-[#9CA3AF] hover:text-[#111827] ml-2">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={containerVar} initial="hidden" animate="visible" className="flex flex-col gap-8">
        
        {/* Header */}
        <motion.div variants={itemVar}>
          <h1 className="text-3xl lg:text-[2.2rem] font-extrabold text-[#111827] tracking-tight leading-tight">
            Job Description Details
          </h1>
          <p className="text-[#6B7280] font-medium text-sm lg:text-base mt-2 max-w-2xl">
            To accurately analyze your match, we need the specific requirements of the role. Choose how you'd like to provide the job description below.
          </p>
        </motion.div>

        {/* ── Two Card Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[4fr_6fr] gap-6 items-stretch">
          
          {/* ════════ LEFT COLUMN: URL IMPORT ════════ */}
          <motion.div variants={itemVar} className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] p-8 flex flex-col justify-between border border-[#E5E7EB] h-full min-h-[460px]">
              <div>
                {/* Header */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
                    <LinkIcon size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-[#111827]">Import from URL</h2>
                </div>

                <p className="text-xs text-[#6B7280] leading-relaxed mb-6">
                  Paste a link from LinkedIn, Indeed, or any company career page. Our AI will extract the key requirements automatically.
                </p>

                {/* Input row */}
                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <Globe size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input
                      type="text"
                      placeholder="https://linkedin.com/jobs/view/..."
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onBlur={handleUrlBlur}
                      disabled={fetching}
                      className={`w-full pl-10 pr-10 py-3 bg-[#F8FAFC] border rounded-xl text-sm font-medium outline-none transition-all
                        ${urlError ? 'border-red-400 focus:border-red-500 bg-red-50/20' : 'border-[#E5E7EB] focus:border-[#2563EB] focus:bg-white'}
                      `}
                    />
                    {urlValid && !fetching && (
                      <CheckCircle2 size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#10B981]" />
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(37,99,235,0.2)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFetchUrl}
                    disabled={fetching}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:from-[#3B82F6] hover:to-[#8B5CF6] text-white text-sm font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    {fetching ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Fetching...
                      </>
                    ) : (
                      <>
                        <Zap size={16} />
                        Fetch details
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Input progress / error details */}
                {fetching && (
                  <div className="mt-4 h-1 bg-[#F3F4F6] rounded-full overflow-hidden relative">
                    <motion.div
                      className="absolute inset-y-0 bg-gradient-to-r from-[#2563EB] to-[#7C3AED]"
                      initial={{ left: '-30%', width: '30%' }}
                      animate={{ left: '100%' }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                    />
                  </div>
                )}

                <AnimatePresence>
                  {urlError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-2 text-xs text-red-600 mt-3 font-semibold"
                    >
                      <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      <span>{urlError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Extra trouble info */}
              <div className="bg-[#EFF6FF] border border-blue-100 rounded-2xl p-5 flex items-start gap-3 mt-6">
                <Info size={18} className="text-[#2563EB] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-[#111827]">Having trouble fetching?</h4>
                  <p className="text-[11px] text-[#6B7280] mt-1 leading-relaxed">
                    If the URL is behind a login or blocked by a firewall, please use the manual paste option to ensure the AI analyzes the full text.
                  </p>
                  <button
                    onClick={handleSwitchToManual}
                    className="text-[11px] font-bold text-[#2563EB] hover:underline flex items-center gap-0.5 mt-2 cursor-pointer"
                  >
                    Switch to Manual <ChevronDown size={12} className="rotate-270" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ════════ RIGHT COLUMN: PASTE TEXT ════════ */}
          <motion.div ref={rightCardRef} variants={itemVar} className="transition-all duration-300">
            <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] p-8 border border-[#E5E7EB] h-full flex flex-col justify-between min-h-[460px]">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] flex items-center justify-center text-[#7C3AED]">
                      <FileText size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-[#111827]">Paste Text</h2>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-[#4F46E5] bg-[#EEF2FF] uppercase tracking-wider">
                    Recommended
                  </span>
                </div>

                {/* Textarea Wrapper */}
                <div className="relative border border-[#E5E7EB] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#2563EB]/25 focus-within:border-[#2563EB] transition-all">
                  <textarea
                    rows={12}
                    placeholder="Paste the full job title, description, and requirements here..."
                    value={jdText}
                    onChange={(e) => {
                      setJdText(e.target.value);
                      if (jdError) setJdError(null);
                    }}
                    className="w-full p-4 text-xs font-medium text-[#111827] outline-none border-0 resize-none bg-white min-h-[300px]"
                  />

                  {/* Textarea Toolbar */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/70 backdrop-blur-md border border-[#E5E7EB] rounded-lg p-1 shadow-sm">
                    <div className="relative">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleCopyText}
                        title="Copy text"
                        className="p-1.5 rounded hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#111827] cursor-pointer"
                      >
                        <Copy size={13} />
                      </motion.button>
                      <AnimatePresence>
                        {copyTooltip && (
                          <motion.span
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: -25 }}
                            exit={{ opacity: 0 }}
                            className="absolute -left-5 bg-[#111827] text-white text-[9px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap"
                          >
                            Copied!
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleClearText}
                      title="Clear text"
                      className="p-1.5 rounded hover:bg-red-50 text-[#6B7280] hover:text-[#EF4444] cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </motion.button>
                  </div>

                  {/* Character Valid indicator */}
                  {charCount >= 50 && (
                    <span className="absolute bottom-3 right-3 flex items-center gap-1 text-[10px] font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full select-none">
                      Looks good ✓
                    </span>
                  )}
                </div>

                {/* Error/Warning Message */}
                <AnimatePresence>
                  {jdError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-2 text-xs mt-3 font-semibold text-red-600"
                    >
                      <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      <span>{jdError}</span>
                    </motion.div>
                  )}
                  {!jdError && charCount > 0 && charCount < 50 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex items-start gap-2 text-xs mt-3 font-semibold text-amber-600"
                    >
                      <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                      <span>This looks too short — add more detail for better analysis</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom statistics and counter */}
              <div className="flex items-center justify-between text-[11px] text-[#9CA3AF] mt-4 pt-4 border-t border-[#F3F4F6] font-mono">
                <div className="flex items-center gap-3">
                  <span>{charCount} characters</span>
                  <span>•</span>
                  <span>{wordCount} words</span>
                </div>
                <span className={charCount > 4500 ? 'text-red-500 animate-pulse' : charCount > 4000 ? 'text-amber-500' : ''}>
                  {charCount}/5000
                </span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* ── Manual Expandable Toggle Section ── */}
        <motion.div variants={itemVar} className="w-full">
          <button
            onClick={() => setShowManual(!showManual)}
            className="flex items-center gap-2 text-xs font-bold text-[#6B7280] hover:text-[#111827] cursor-pointer"
          >
            <span>Prefer to enter details manually? Click here</span>
            <motion.span animate={{ rotate: showManual ? 180 : 0 }}>
              <ChevronDown size={14} />
            </motion.span>
          </button>

          <AnimatePresence>
            {showManual && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-4"
              >
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col gap-6">
                  {/* Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Job Title */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-[#111827] uppercase tracking-wider">Job Title *</label>
                      <div className="relative">
                        <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                        <input
                          type="text"
                          placeholder="e.g. Senior AI Product Lead"
                          value={manualTitle}
                          onChange={(e) => setManualTitle(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] focus:border-[#2563EB] focus:bg-white rounded-xl text-xs font-medium outline-none transition-all"
                        />
                      </div>
                    </div>
                    {/* Company */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-[#111827] uppercase tracking-wider">Company Name *</label>
                      <div className="relative">
                        <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                        <input
                          type="text"
                          placeholder="e.g. OpenAI"
                          value={manualCompany}
                          onChange={(e) => setManualCompany(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] focus:border-[#2563EB] focus:bg-white rounded-xl text-xs font-medium outline-none transition-all"
                        />
                      </div>
                    </div>
                    {/* Location */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-[#111827] uppercase tracking-wider">Location *</label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                        <input
                          type="text"
                          placeholder="e.g. San Francisco, CA (Hybrid)"
                          value={manualLocation}
                          onChange={(e) => setManualLocation(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] focus:border-[#2563EB] focus:bg-white rounded-xl text-xs font-medium outline-none transition-all"
                        />
                      </div>
                    </div>
                    {/* Select Type */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-[#111827] uppercase tracking-wider">Employment Type</label>
                      <div className="relative">
                        <select
                          value={manualType}
                          onChange={(e) => setManualType(e.target.value)}
                          className="w-full pl-4 pr-10 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] focus:border-[#2563EB] focus:bg-white rounded-xl text-xs font-medium outline-none appearance-none cursor-pointer transition-all"
                        >
                          <option>Full-time</option>
                          <option>Part-time</option>
                          <option>Contract</option>
                          <option>Internship</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Key Responsibilities */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#111827] uppercase tracking-wider">Key Responsibilities *</label>
                    <textarea
                      rows={4}
                      placeholder="e.g. Drive product strategy, partner with engineering..."
                      value={manualResp}
                      onChange={(e) => setManualResp(e.target.value)}
                      className="w-full p-4 bg-[#F8FAFC] border border-[#E5E7EB] focus:border-[#2563EB] focus:bg-white rounded-xl text-xs font-medium outline-none transition-all"
                    />
                  </div>

                  {/* Skills input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#111827] uppercase tracking-wider">Required Skills (Press Enter to add)</label>
                    <div className="border border-[#E5E7EB] rounded-xl p-3 bg-[#F8FAFC]">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {manualSkills.map((skill) => (
                          <span
                            key={skill}
                            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white text-[10px] font-bold rounded-full"
                          >
                            {skill}
                            <button
                              onClick={() => handleRemoveSkill(skill)}
                              className="hover:bg-white/20 rounded-full p-0.5 cursor-pointer"
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Add required skill..."
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleAddSkill}
                        className="w-full border-0 bg-transparent text-xs font-medium outline-none py-1 px-1 text-[#111827]"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Bottom Section: Progress + Action ── */}
        <motion.div
          variants={itemVar}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E5E7EB] mt-4"
        >
          {/* Left step indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#ECFDF5] border border-emerald-100 rounded-full p-1 text-[#10B981]">
              <CheckCircle2 size={14} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2563EB] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2563EB]"></span>
              </span>
              <span className="text-xs font-semibold text-[#111827]">Step 2 of 4: Match Analysis Pending</span>
            </div>
          </div>

          {/* Right Action CTA */}
          <div className="relative">
            <motion.button
              whileHover={isFormValid() ? { scale: 1.02, boxShadow: '0 8px 30px rgba(37,99,235,0.35)' } : {}}
              whileTap={isFormValid() ? { scale: 0.98 } : {}}
              onClick={handleAnalyzeMatch}
              disabled={!isFormValid() || isAnalyzing}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white transition-all cursor-pointer relative overflow-hidden
                ${isFormValid()
                  ? 'bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:from-[#3B82F6] hover:to-[#8B5CF6] shadow-md'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Rocket size={16} />
                  Analyze Match
                </>
              )}

              {/* Glowing bar for analysis in-progress */}
              {isAnalyzing && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2.2, ease: 'easeInOut' }}
                  />
                </div>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* ── Footer ── */}
        <footer className="border-t border-[#E5E7EB] pt-6 pb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B7280] mt-8">
          <div>
            <span className="font-extrabold text-[#2563EB] text-sm">ResumeAI</span>
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
