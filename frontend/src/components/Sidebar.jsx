import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Upload, FileText, GitCompare, ClipboardList, Mic,
  History, Settings, User, Sun, Moon
} from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import NotificationBell from './NotificationBell';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'upload', label: 'Upload Resume', icon: Upload },
  { id: 'job', label: 'Job Description', icon: FileText },
  { id: 'gap', label: 'Gap Analysis', icon: GitCompare },
  { id: 'prep', label: 'Prep Plan', icon: ClipboardList },
  { id: 'interview', label: 'Mock Interview', icon: Mic },
  { id: 'history', label: 'History', icon: History },
];

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeNav,
  setActiveNav,
  darkMode,
  setDarkMode,
  onNavigate,
  onDashboardNav
}) {
  return (
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
          {activeNav === 'settings' && <motion.div layoutId="navPillBottom1" className="ml-auto w-1.5 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom,#2563EB,#7C3AED)' }} />}
        </motion.button>
        <motion.button whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }} onClick={() => { setActiveNav('profile'); setSidebarOpen(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeNav === 'profile' ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold' : 'text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#111827]'}`}>
          <User size={18} className={activeNav === 'profile' ? 'text-[#2563EB]' : 'text-[#9CA3AF]'} />
          Profile
          {activeNav === 'profile' && <motion.div layoutId="navPillBottom2" className="ml-auto w-1.5 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom,#2563EB,#7C3AED)' }} />}
        </motion.button>
      </nav>

      <div className="px-4 pb-6 pt-4 flex flex-col gap-2 mt-auto border-t border-[#E5E7EB]">
        <div className="w-full">
          <ProfileDropdown onNavigate={onNavigate} onDashboardNav={onDashboardNav} />
        </div>
        <div className="flex items-center justify-center gap-3">
          <NotificationBell />
          <div className="w-px h-5 bg-[#E5E7EB] mx-1" />
          <motion.button whileTap={{ scale: 0.88 }} onClick={() => setDarkMode(p => !p)} id="dark-mode-toggle"
            className="p-2 rounded-full hover:bg-[#F3F4F6] transition-colors cursor-pointer text-[#6B7280]">
            <AnimatePresence mode="wait" initial={false}>
              {darkMode
                ? <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><Sun size={20} /></motion.span>
                : <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><Moon size={20} /></motion.span>
              }
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </aside>
  );
}
