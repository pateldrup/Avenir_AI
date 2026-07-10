import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';

const allNotes = [
  { text: '3 new job matches found', time: '2 min ago', unread: true },
  { text: 'Resume analysis complete', time: '1 hr ago', unread: true },
  { text: 'Interview session reminder', time: 'Yesterday', unread: false },
  { text: 'Gap analysis report ready', time: '2 days ago', unread: false },
  { text: 'New AI coaching tips available', time: '3 days ago', unread: false },
  { text: 'Your weekly progress report is ready', time: '5 days ago', unread: false },
];

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Reset to collapsed when dropdown closes
  useEffect(() => {
    if (!open) setShowAll(false);
  }, [open]);

  const visibleNotes = showAll ? allNotes : allNotes.slice(0, 3);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(p => !p)} id="notification-btn"
        className="relative p-2 rounded-full hover:bg-[#F3F4F6] transition-colors cursor-pointer text-[#6B7280]">
        <Bell size={20} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-white" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 6 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 6 }} transition={{ duration: 0.16 }}
            className="absolute left-[-100px] bottom-full mb-2 z-50 w-72 bg-white/95 backdrop-blur-xl border border-[#E5E7EB] rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
              <span className="text-xs font-bold text-[#111827]">Notifications</span>
              <button onClick={() => setOpen(false)} className="text-[#6B7280] hover:text-[#111827] cursor-pointer"><X size={14} /></button>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {visibleNotes.map((n, i) => (
                <motion.div
                  key={i}
                  initial={i >= 3 ? { opacity: 0, y: -8 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i >= 3 ? (i - 3) * 0.06 : 0 }}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-[#F8FAFC] transition-colors ${n.unread ? 'bg-blue-50/50' : ''}`}
                >
                  <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${n.unread ? 'bg-[#2563EB]' : 'bg-[#E5E7EB]'}`} />
                  <div>
                    <p className="text-xs font-medium text-[#111827]">{n.text}</p>
                    <p className="text-[10px] text-[#6B7280] mt-0.5">{n.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            {!showAll && (
              <div className="px-4 py-2.5 border-t border-[#E5E7EB]">
                <button onClick={() => setShowAll(true)} className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer">
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
