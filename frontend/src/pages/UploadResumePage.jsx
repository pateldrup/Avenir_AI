import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  FileUp,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  FileText,
  X,
  Eye,
  RefreshCw,
  Trash2,
  Download,
  Brain,
  ShieldCheck,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

export default function UploadResumePage({ onNext }) {
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle | uploading | success
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [parsedText, setParsedText] = useState('');
  const [confettiParticles, setConfettiParticles] = useState([]);

  // Simulate initial page skeleton load
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Handle toast auto-dismiss
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Handle error auto-dismiss
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Generate success confetti particles
  const triggerConfetti = () => {
    const particles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 200 - 100,
      y: Math.random() * -150 - 50,
      size: Math.random() * 6 + 4,
      color: ['#2563EB', '#4F46E5', '#7C3AED', '#10B981', '#F59E0B'][i % 5],
      delay: Math.random() * 0.2,
    }));
    setConfettiParticles(particles);
  };

  const onDrop = (acceptedFiles, fileRejections) => {
    setError(null);

    // Handle rejections
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors[0].code === 'file-invalid-type') {
        setError({
          type: 'type',
          message: 'Only PDF or DOCX files are supported',
        });
      } else if (rejection.errors[0].code === 'file-too-large') {
        setError({
          type: 'size',
          message: 'File size exceeds 10MB limit. Please upload a smaller file.',
        });
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      uploadFile(selectedFile);
    }
  };

  const uploadFile = async (fileToUpload) => {
    setUploadStatus('uploading');
    setProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append('resume', fileToUpload);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/resumes/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });
      
      setUploadStatus('success');
      setShowToast(true);
      setParsedText(res.data.extractedText);
      localStorage.setItem('avenir_resume_id', res.data.resumeId);
      triggerConfetti();
    } catch (err) {
      setUploadStatus('idle');
      setError({
        type: 'upload',
        message: err.response?.data?.message || 'Failed to upload resume'
      });
    }
  };

  const handleCancelUpload = () => {
    setUploadStatus('idle');
    setFile(null);
    setProgress(0);
  };

  const handleRemoveFile = () => {
    setUploadStatus('idle');
    setFile(null);
    setProgress(0);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  // Formats file sizes
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const containerVar = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const itemVar = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  // Skeleton Loader markup
  if (loading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 animate-pulse">
        {/* Left Column Skeleton */}
        <div className="flex flex-col gap-6">
          <div className="h-9 w-64 bg-gray-200 rounded-lg" />
          <div className="h-5 w-full max-w-lg bg-gray-200 rounded-md" />
          <div className="h-80 w-full bg-gray-200 rounded-2xl mt-4" />
          <div className="flex justify-between items-center mt-2">
            <div className="h-5 w-40 bg-gray-200 rounded" />
            <div className="h-4 w-60 bg-gray-200 rounded" />
          </div>
        </div>
        {/* Right Column Skeleton */}
        <div className="h-[480px] bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Toast Notification */}
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
              <p className="text-xs font-bold text-[#111827]">Upload Success</p>
              <p className="text-[10px] text-[#6B7280]">Resume uploaded successfully!</p>
            </div>
            <button onClick={() => setShowToast(false)} className="text-[#9CA3AF] hover:text-[#111827] ml-2">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={containerVar}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8"
      >
        {/* ════════════ LEFT COLUMN ════════════ */}
        <div className="flex flex-col gap-6">
          {/* Header */}
          <motion.div variants={itemVar}>
            <h1 className="text-3xl lg:text-[2.2rem] font-extrabold text-[#111827] tracking-tight leading-tight">
              Upload Your Resume
            </h1>
            <p className="text-[#6B7280] font-medium text-sm lg:text-base mt-2">
              Our AI will analyze your skills, experience, and formatting to help you land your dream job.
            </p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-red-700 font-medium"
              >
                {error.type === 'size' ? (
                  <AlertTriangle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
                )}
                <span className="flex-1">{error.message}</span>
                <button onClick={() => setError(null)} className="text-red-700 hover:text-red-950">
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Dropzone Card */}
          <motion.div variants={itemVar}>
            <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] p-6 relative overflow-hidden">
              {/* Confetti Rendering */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {confettiParticles.map((p) => (
                  <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                      width: p.size,
                      height: p.size,
                      backgroundColor: p.color,
                    }}
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{
                      x: p.x,
                      y: p.y,
                      opacity: 0,
                      scale: [1, 1.2, 0.5],
                    }}
                    transition={{
                      duration: 0.8,
                      delay: p.delay,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* 1. Empty/Default State */}
                {uploadStatus === 'idle' && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      {...getRootProps()}
                      animate={{
                        scale: isDragActive ? 1.01 : 1,
                        borderColor: error ? '#EF4444' : isDragActive ? '#2563EB' : '#93C5FD',
                        backgroundColor: isDragActive ? 'rgba(37,99,235,0.02)' : 'rgba(255,255,255,1)',
                      }}
                      className="border-2 border-dashed rounded-2xl flex flex-col items-center justify-center py-16 px-6 cursor-pointer group transition-colors"
                      style={{ outline: 'none' }}
                    >
                      <input {...getInputProps()} />

                      {/* Icon */}
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                        className="w-16 h-16 rounded-full bg-[#EFF6FF] flex items-center justify-center mb-4 transition-colors group-hover:bg-[#DBEAFE]"
                      >
                        <FileUp size={28} className="text-[#2563EB]" />
                      </motion.div>

                      <h3 className="text-base font-bold text-[#111827] text-center">
                        Drag and drop your file here
                      </h3>
                      <p className="text-xs text-[#6B7280] text-center mt-1">
                        or click to browse from your computer
                      </p>

                      <motion.div
                        whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(37,99,235,0.2)' }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:from-[#3B82F6] hover:to-[#8B5CF6] text-white text-xs font-bold rounded-xl transition-all"
                      >
                        <UploadCloud size={15} />
                        Upload PDF
                      </motion.div>

                      {/* Badges */}
                      <div className="flex gap-4 mt-8">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider bg-[#F3F4F6] px-2.5 py-1 rounded-full">
                          <CheckCircle2 size={12} className="text-[#10B981]" />
                          PDF, DOCX
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider bg-[#F3F4F6] px-2.5 py-1 rounded-full">
                          <CheckCircle2 size={12} className="text-[#10B981]" />
                          Max size 10MB
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* 2. Uploading State */}
                {uploadStatus === 'uploading' && (
                  <motion.div
                    key="uploading"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="border border-[#E5E7EB] rounded-2xl p-8 relative"
                  >
                    <button
                      onClick={handleCancelUpload}
                      className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#111827] cursor-pointer"
                    >
                      <X size={16} />
                    </button>

                    <div className="flex items-center gap-4">
                      {/* Colored file icon based on file type */}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          file?.name.endsWith('.pdf') ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                        }`}
                      >
                        <FileText size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#111827] truncate">{file?.name}</p>
                        <p className="text-xs text-[#6B7280] mt-0.5">
                          {file ? formatFileSize(file.size) : ''}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-4">
                      <div className="flex-1 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED]"
                          initial={{ width: '0%' }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.1, ease: 'easeOut' }}
                        />
                      </div>
                      <span className="text-xs font-bold text-[#111827] w-8 text-right">{progress}%</span>
                    </div>
                  </motion.div>
                )}

                {/* 3. Success State */}
                {uploadStatus === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="border border-[#E5E7EB] rounded-2xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4">
                      {/* Bounce in Check Badge */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.25, 1] }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="w-12 h-12 rounded-full bg-[#D1FAE5] flex items-center justify-center text-[#10B981] shrink-0"
                      >
                        <CheckCircle2 size={24} />
                      </motion.div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#111827] truncate">{file?.name}</p>
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1 text-xs text-[#6B7280]">
                          <span>{file ? formatFileSize(file.size) : ''}</span>
                          <span>•</span>
                          <span>Uploaded just now</span>
                        </div>
                        <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#10B981] bg-[#ECFDF5]">
                          Ready for Analysis ✓
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowPreviewModal(true)}
                        className="flex items-center gap-1.5 px-3.5 py-2 border border-[#E5E7EB] hover:bg-[#F8FAFC] text-xs font-semibold text-[#111827] rounded-xl cursor-pointer"
                      >
                        <Eye size={14} />
                        Preview
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onNext && onNext()}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2563EB] text-white text-xs font-semibold rounded-xl cursor-pointer"
                      >
                        Continue
                        <ArrowRight size={14} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleRemoveFile}
                        className="flex items-center gap-1.5 px-3.5 py-2 border border-[#E5E7EB] hover:bg-[#F8FAFC] text-xs font-semibold text-[#111827] rounded-xl cursor-pointer"
                      >
                        <RefreshCw size={14} />
                        Replace
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleRemoveFile}
                        className="flex items-center gap-1.5 px-3.5 py-2 border border-red-100 hover:bg-red-50 text-xs font-semibold text-[#EF4444] rounded-xl cursor-pointer"
                      >
                        <Trash2 size={14} />
                        Remove
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Dropzone Footer Links */}
          <motion.div variants={itemVar} className="flex justify-between items-center text-xs mt-2 px-1">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert('Downloading sample resume...');
              }}
              className="flex items-center gap-1.5 font-bold text-[#2563EB] hover:underline cursor-pointer"
            >
              <Download size={14} />
              Download Sample Resume
            </a>
            <span className="text-[#6B7280]">
              By uploading, you agree to our{' '}
              <a href="#" className="font-semibold text-[#111827] hover:underline">
                Terms of Service
              </a>
              .
            </span>
          </motion.div>
        </div>

        {/* ════════════ RIGHT COLUMN ════════════ */}
        <motion.div
          variants={itemVar}
          className="relative rounded-2xl p-8 flex flex-col justify-between overflow-hidden shadow-[0_10px_30px_rgba(15,23,42,0.08)] bg-white/70 backdrop-blur-xl border border-[#E5E7EB]"
        >
          {/* Faint large sparkle badge watermark */}
          <div className="absolute top-2 right-2 text-[#7C3AED]/5 pointer-events-none rotate-12 select-none">
            <Sparkles size={160} />
          </div>

          <div className="relative z-10">
            <h2 className="text-lg font-bold text-[#111827] mb-6">Why analyze with AI?</h2>

            <div className="space-y-6">
              {/* Feature 1 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] flex items-center justify-center shrink-0 text-[#7C3AED]">
                  <Brain size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#111827]">Semantic Skill Mapping</h3>
                  <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                    We don't just find keywords; we understand your career trajectory and hidden talents.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0 text-[#2563EB]">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#111827]">ATS Optimization</h3>
                  <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                    Ensure your resume passes through Applicant Tracking Systems used by{' '}
                    <span className="font-semibold text-[#111827]">99%</span> of Fortune 500 companies.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0 text-[#2563EB]">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#111827]">Market Benchmarking</h3>
                  <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                    Compare your profile against thousands of successful hires in your target industry.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Scan Simulation panel */}
          <div className="relative z-10 mt-8 rounded-xl p-4 bg-gradient-to-br from-[#1E1B4B] via-[#2E1065] to-[#4F46E5] overflow-hidden border border-[#E5E7EB]/10">
            {/* Glowing lines scanning */}
            <div className="absolute inset-0">
              <motion.div
                className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent opacity-85"
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                style={{ position: 'absolute' }}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shrink-0" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                AI Scan Simulation active
              </span>
            </div>
            <div className="mt-2.5 h-12 flex items-center justify-center border border-white/5 bg-white/5 rounded-lg">
              <span className="text-[10px] text-white/50 font-medium">Scanning formatting & sections...</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* FOOTER */}
      <footer className="border-t border-[#E5E7EB] pt-5 pb-6 mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-sm font-extrabold text-[#2563EB]">ResumeAI Analyzer</span>
          <p className="text-xs text-[#6B7280] mt-0.5">© 2024 ResumeAI Analyzer. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
          {['Sitemap', 'Privacy Policy', 'Terms of Service', 'Support'].map((link, i) => (
            <React.Fragment key={link}>
              {i > 0 && <span className="text-[#E5E7EB]">·</span>}
              <a href="#" className="hover:text-[#2563EB] hover:underline transition-colors font-medium">{link}</a>
            </React.Fragment>
          ))}
        </div>
      </footer>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreviewModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-[#E5E7EB]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
                <h3 className="text-base font-bold text-[#111827]">Document Preview</h3>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#111827] cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto flex-1 bg-[#F8FAFC]">
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 shadow-sm flex flex-col gap-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-[#111827]">Raw Extracted Text</h2>
                    <p className="text-xs text-[#6B7280] mt-1">This is exactly what the AI will see when analyzing your resume.</p>
                  </div>
                  <div className="border-t border-[#E5E7EB] pt-4">
                    <pre className="text-xs text-[#111827] mt-1.5 leading-relaxed whitespace-pre-wrap font-mono bg-gray-50 p-4 rounded-lg border border-gray-100 max-h-[50vh] overflow-y-auto">
                      {parsedText || 'No text extracted.'}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[#E5E7EB] flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPreviewModal(false)}
                  className="px-5 py-2.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Close Preview
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
