import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Mic, Phone, User, MoreHorizontal, Send, X, AlertTriangle } from 'lucide-react';

const MockInterviewPage = () => {
  const [mounted, setMounted] = useState(false);
  const [interviewSession, setInterviewSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [interimValue, setInterimValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [triggerAutoSend, setTriggerAutoSend] = useState(false);
  const [silenceRemaining, setSilenceRemaining] = useState(null);
  const lastSpokeTime = useRef(Date.now());
  const checkIntervalRef = useRef(null);
  
  // Voice states
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // End session modal states
  const [showEndModal, setShowEndModal] = useState(false);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState([]);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => scrollToBottom(), [messages, isSending]);

  // Silence Timeout Logic
  useEffect(() => {
    if (isListening) {
      lastSpokeTime.current = Date.now();
      setSilenceRemaining(4);
      
      checkIntervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - lastSpokeTime.current) / 1000;
        const remaining = Math.max(0, 4 - elapsed);
        setSilenceRemaining(Math.ceil(remaining));
        
        if (remaining <= 0) {
          clearInterval(checkIntervalRef.current);
          setTriggerAutoSend(true);
        }
      }, 200);
    } else {
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
      setSilenceRemaining(null);
    }
    return () => {
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    }
  }, [isListening]);

  useEffect(() => {
    if (triggerAutoSend) {
      setTriggerAutoSend(false);
      handleSend(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerAutoSend]);

  // Setup Speech Recognition
  useEffect(() => {
    setMounted(true);
    
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        let currentFinal = '';
        let currentInterim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            currentFinal += transcript + ' ';
          } else {
            currentInterim += transcript;
          }
        }
        
        if (currentFinal) {
          setInputValue((prev) => prev + currentFinal);
        }
        setInterimValue(currentInterim);
        
        lastSpokeTime.current = Date.now();
        setSilenceRemaining(4);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    startInterview();
  }, []);

  // Text to Speech
  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    // Standard system voice
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  // Start Interview via API
  const startInterview = async () => {
    try {
      let analysisId = localStorage.getItem('avenir_analysis_id');
      const token = localStorage.getItem('token');
      if (!token) return;

      // Fallback: If no analysisId, fetch the most recent one
      if (!analysisId) {
        const histRes = await fetch(`${import.meta.env.VITE_API_URL}/users/history`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (histRes.ok) {
          const histData = await histRes.json();
          if (histData.analyses && histData.analyses.length > 0) {
            analysisId = histData.analyses[0]._id;
            // Optionally, we could set it in local storage here
          }
        }
      }

      if (!analysisId) {
        setMessages([{ role: 'interviewer', content: 'No recent analysis found. Please run a job description analysis first to start a mock interview.' }]);
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/interviews/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ analysisId })
      });

      if (res.ok) {
        const data = await res.json();
        setInterviewSession(data);
        
        // Filter out system messages for UI
        const visibleMessages = data.messages.filter(m => m.role !== 'system');
        setMessages(visibleMessages);

        // Read the very first question
        if (visibleMessages.length > 0) {
          const firstQuestion = visibleMessages[0].content;
          speakText(firstQuestion);
        }
      } else {
        setMessages([{ role: 'interviewer', content: 'Failed to connect to the AI interviewer service. Please ensure the backend and AI models are running.' }]);
      }
    } catch (error) {
      console.error("Error starting interview:", error);
      setMessages([{ role: 'interviewer', content: 'An unexpected error occurred while starting the interview.' }]);
    }
  };

  // Submit Answer
  const handleSend = async (isAuto = false) => {
    let answer = (inputValue + ' ' + interimValue).trim();
    
    // If it's an auto-send and the user didn't say anything
    if (!answer && isAuto === true) {
      answer = "[Candidate remained silent]";
    }

    if (!answer || !interviewSession || isSending) return;

    setInputValue('');
    setInterimValue('');
    setSilenceRemaining(null);
    if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    
    // Optimistic UI update
    setMessages(prev => [...prev, { role: 'candidate', content: answer }]);
    setIsSending(true);

    // Stop speaking if user interrupts
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    
    // Stop listening if mic was on
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/interviews/${interviewSession._id}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answer })
      });

      if (res.ok) {
        const data = await res.json();
        setInterviewSession(data);
        
        const visibleMessages = data.messages.filter(m => m.role !== 'system');
        setMessages(visibleMessages);

        // Read the latest AI response
        const latestMessage = visibleMessages[visibleMessages.length - 1];
        if (latestMessage.role === 'interviewer') {
          speakText(latestMessage.content);
        }
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setIsSending(false);
    }
  };

  // Toggle Mic
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Stop AI speech if user starts talking
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // End Session
  const handleEndSession = async () => {
    if (!interviewSession) return;
    
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (isListening && recognitionRef.current) recognitionRef.current.stop();
    
    setIsSending(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/interviews/${interviewSession._id}/end`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setScore(data.score);
        setFeedback(data.finalFeedback || []);
        setShowEndModal(true);
      }
    } catch (error) {
      console.error("Error ending session:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Compute the current question to display in the floating card
  const currentQuestion = messages.length > 0 
    ? [...messages].reverse().find(m => m.role === 'interviewer')?.content
    : "Initializing AI Interviewer...";

  return (
    <div className="-mx-5 lg:-mx-10 -my-8 h-[calc(100vh-73px)] flex flex-col bg-white overflow-hidden animate-in fade-in duration-500 relative">
      
      {/* End Session Popup Modal (Option B) */}
      <AnimatePresence>
        {showEndModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowEndModal(false)}
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full flex flex-col items-center"
            >
              <button 
                onClick={() => setShowEndModal(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center mb-6 shadow-lg">
                <span className="text-2xl font-extrabold text-white">{score || 0}</span>
              </div>
              
              <h2 className="text-2xl font-extrabold text-[#111827] mb-2 text-center">Interview Completed</h2>
              <p className="text-sm text-[#6B7280] text-center mb-8 px-4">
                Here is a summary of the concepts you missed or lacked depth in during this mock session.
              </p>

              <div className="w-full space-y-3 mb-8 max-h-64 overflow-y-auto pr-2">
                {feedback.length > 0 ? (
                  feedback.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-[#FEF2F2] border border-[#FECACA] p-3 rounded-xl">
                      <AlertTriangle size={16} className="text-[#EF4444] shrink-0 mt-0.5" />
                      <p className="text-[13px] font-semibold text-[#111827] leading-relaxed">{item}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-center font-medium text-[#10B981]">Excellent job! No major weak points detected.</p>
                )}
              </div>

              <button 
                onClick={() => setShowEndModal(false)}
                className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95"
              >
                Close & Review Transcript
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel - Visualizer */}
        <div className="flex-1 bg-[#F8FAFC] relative flex flex-col items-center justify-center border-r border-[#E5E7EB]">
          
          {/* Top Floating Card: Current Question */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="absolute top-8 w-[90%] max-w-lg bg-white border border-[#E5E7EB] rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.04)] p-5 z-10"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center shrink-0 shadow-inner">
                <MessageSquare size={18} className="text-white" fill="white" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider mb-1.5">Current AI Question</p>
                <p className="text-[14px] font-semibold text-[#111827] leading-relaxed line-clamp-3">
                  "{currentQuestion}"
                </p>
              </div>
            </div>
          </motion.div>

          {/* Center Circular Visualizer */}
          <div className="relative flex flex-col items-center mt-8">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-[340px] h-[340px] rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] shadow-[0_0_80px_rgba(37,99,235,0.25)] relative flex items-center justify-center overflow-hidden"
            >
              {/* Inner subtle rings */}
              <div className="absolute inset-0 rounded-full border border-white/10 m-4"></div>
              <div className="absolute inset-0 rounded-full border border-white/5 m-12"></div>
              
              {/* Soundwaves */}
              <div className="flex items-center gap-1.5 z-10 h-24">
                {mounted && Array.from({ length: 45 }).map((_, i) => {
                  const distanceFromCenter = Math.abs(22 - i);
                  
                  // Make waves highly active if listening or speaking
                  const isActive = isListening || isSpeaking;
                  const maxH = isActive ? Math.max(20, 100 - distanceFromCenter * 4) : 15;
                  const minH = isActive ? Math.max(10, 25 - distanceFromCenter) : 5;
                  const duration = isActive ? 0.3 + Math.random() * 0.3 : 2 + Math.random();
                  
                  return (
                    <motion.div
                      key={i}
                      animate={{ height: [minH, Math.random() * maxH + minH, minH] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: duration, 
                        ease: 'easeInOut',
                        delay: i * 0.05
                      }}
                      className="w-[3px] bg-white rounded-full"
                      style={{ height: minH }}
                    />
                  );
                })}
              </div>
            </motion.div>
            
            {/* Listening / Speaking Badge */}
            <AnimatePresence mode="wait">
              {isListening && (
                <motion.div 
                  key="listening"
                  initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
                  className="absolute -bottom-5 bg-white border border-[#10B981] shadow-[0_4px_15px_rgba(16,185,129,0.15)] rounded-full px-5 py-2 flex items-center gap-2.5 z-20"
                >
                  <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-[11px] font-bold text-[#10B981] tracking-widest">LISTENING (MIC ON)</span>
                </motion.div>
              )}
              {isSpeaking && !isListening && (
                <motion.div 
                  key="speaking"
                  initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
                  className="absolute -bottom-5 bg-white border border-[#2563EB] shadow-[0_4px_15px_rgba(37,99,235,0.15)] rounded-full px-5 py-2 flex items-center gap-2.5 z-20"
                >
                  <div className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
                  <span className="text-[11px] font-bold text-[#2563EB] tracking-widest">AI IS SPEAKING</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
        
        {/* Right Panel - Chat Area */}
        <div className="w-[420px] bg-[#FAFBFC] flex flex-col shrink-0">
          <div className="flex justify-end p-4">
            <span className="text-[9px] font-bold bg-[#E5E7EB] px-2.5 py-1 rounded-sm text-[#4B5563] tracking-wider">
              AUTO-SAVE ON
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2 space-y-6">
            
            {messages.length === 0 && !isSending && (
              <div className="flex flex-col items-center justify-center h-full text-[#9CA3AF]">
                <MessageSquare size={32} className="mb-2 opacity-50" />
                <p className="text-xs font-semibold">Starting interview...</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col gap-1 ${msg.role === 'interviewer' ? 'items-start' : 'items-end'}`}
              >
                {msg.role === 'candidate' && (
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-bold text-[#4F46E5] uppercase tracking-wide">You</span>
                    <div className="w-6 h-6 rounded bg-[#E0E7FF] flex items-center justify-center text-[#4F46E5]">
                      <User size={12} />
                    </div>
                  </div>
                )}
                
                <div className={`px-5 py-3.5 max-w-[92%] shadow-sm text-left ${
                  msg.role === 'interviewer' 
                    ? 'bg-[#F3F4F6] border border-[#E5E7EB]/50 rounded-2xl rounded-tl-sm' 
                    : 'bg-[#EFF6FF] border border-[#BFDBFE]/50 rounded-2xl rounded-tr-sm'
                }`}>
                  <p className={`text-[13px] leading-relaxed font-medium ${msg.role === 'interviewer' ? 'text-[#111827]' : 'text-[#1E40AF]'}`}>
                    {msg.content}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {isSending && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 pt-2"
              >
                <div className="w-8 h-8 rounded-lg bg-[#F3F4F6] border border-[#E5E7EB]/50 flex items-center justify-center shrink-0">
                  <MoreHorizontal size={16} className="text-[#9CA3AF]" />
                </div>
                <div className="h-3.5 w-32 bg-[#F3F4F6] rounded-full animate-pulse" />
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="h-[84px] border-t border-[#E5E7EB] bg-white flex items-center px-6 gap-4 shrink-0 shadow-[0_-5px_15px_rgba(0,0,0,0.02)] z-20">
        
        {/* Mic Toggle */}
        <button 
          onClick={toggleListening}
          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-md transition-all hover:scale-105 active:scale-95 ${
            isListening 
              ? 'bg-[#EF4444] hover:bg-[#DC2626] text-white animate-pulse' 
              : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'
          }`}
        >
          <Mic size={22} />
        </button>
        
        {/* Text Input */}
        <div className="flex-1 relative">
          <input 
            type="text"
            value={inputValue + interimValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={isListening ? `Listening... (Auto-send in ${silenceRemaining}s)` : "Type your response..."}
            className="w-full bg-[#EFF6FF] rounded-2xl h-[52px] pl-5 pr-12 border border-[#BFDBFE]/50 text-[#1E3A8A] text-[13px] font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 transition-all placeholder:text-[#93C5FD]"
          />
          <button 
            onClick={handleSend}
            disabled={(!inputValue.trim() && !interimValue.trim()) || isSending}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-xl bg-[#2563EB] text-white hover:bg-[#1D4ED8] disabled:opacity-50 disabled:hover:bg-[#2563EB] transition-colors"
          >
            <Send size={16} />
          </button>
        </div>

        <div className="text-center px-6 border-l border-[#E5E7EB] shrink-0 hidden sm:block">
          <p className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">Status</p>
          <p className="text-[13px] font-extrabold text-[#111827]">
            {isSending ? 'Thinking...' : isListening ? `Listening... ${silenceRemaining !== null ? `(${silenceRemaining}s)` : ''}` : 'Active'}
          </p>
        </div>
        
        <button 
          onClick={handleEndSession}
          disabled={!interviewSession || showEndModal || isSending}
          className="h-[52px] px-6 bg-[#FEE2E2] hover:bg-[#FECACA] text-[#EF4444] disabled:opacity-50 rounded-2xl font-bold text-[13px] flex items-center gap-2.5 transition-colors shrink-0 border border-[#FECACA]/50"
        >
          <Phone size={16} className="transform rotate-[135deg]" fill="currentColor" /> 
          <span className="hidden sm:inline">End Session</span>
        </button>
      </div>
    </div>
  );
};

export default MockInterviewPage;
