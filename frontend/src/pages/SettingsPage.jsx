import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, Shield, Code, Edit2, ChevronDown, Globe, Bell, Monitor, Check, Lock, Eye, EyeOff, Smartphone, LogOut, MapPin } from 'lucide-react';

/* ─── Helper: read/write settings from localStorage ─── */
const SETTINGS_KEY = 'avenir_general_settings';

const defaultSettings = {
  compactMode: false,
  theme: 'light',
  language: 'English (US)',
  timezone: '(GMT+5:30) India Standard Time',
  emailNotifications: true,
  interviewReminders: true,
  weeklyProgressReport: false,
  marketingEmails: false,
  twoFactorAuth: false,
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const theme = localStorage.getItem('avenir_theme') || 'light';
    return { ...defaultSettings, ...parsed, theme };
  } catch {
    return { ...defaultSettings, theme: localStorage.getItem('avenir_theme') || 'light' };
  }
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  localStorage.setItem('avenir_theme', settings.theme);
  document.documentElement.classList.toggle('dark', settings.theme === 'dark');
}

/* ─── Toggle Switch Component ─── */
function Toggle({ checked, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:ring-2 peer-focus:ring-[#2563EB]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#2563EB] after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm"></div>
    </label>
  );
}

/* ─── Toast Notification ─── */
function SaveToast({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2.5 px-5 py-3 bg-[#111827] text-white text-sm font-semibold rounded-xl shadow-2xl"
        >
          <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center">
            <Check size={12} strokeWidth={3} />
          </div>
          Preferences saved successfully!
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Profile Helpers ─── */
const PROFILE_KEY = 'avenir_profile';
const defaultProfile = {
  fullName: 'Alex Mercer',
  email: 'alex.mercer@enterprise-ai.com',
  currentRole: 'Senior Product Designer',
  targetRole: 'Principal Product Designer',
  photoUrl: '',
};

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? { ...defaultProfile, ...JSON.parse(raw) } : { ...defaultProfile };
  } catch {
    return { ...defaultProfile };
  }
}

function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

/* ─── Profile Tab Component ─── */
function ProfileTab({ showToast }) {
  const [profile, setProfile] = useState(loadProfile);
  const [draft, setDraft] = useState(loadProfile);
  const photoRef = React.useRef(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setDraft(prev => ({ ...prev, photoUrl: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveProfile(draft);
    setProfile(draft);
    // Notify same-tab listeners (e.g. ProfileDropdown in sidebar)
    window.dispatchEvent(new StorageEvent('storage', { key: 'avenir_profile' }));
    showToast();
  };

  const initials = (draft.fullName || 'AM')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-8"
    >
      {/* Avatar */}
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#F8FAFC] shadow-sm bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center">
            {draft.photoUrl
              ? <img src={draft.photoUrl} alt="Profile" className="w-full h-full object-cover" />
              : <span className="text-white text-2xl font-extrabold select-none">{initials}</span>
            }
          </div>
          <button
            onClick={() => photoRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 bg-[#2563EB] hover:bg-[#1D4ED8] rounded-full flex items-center justify-center text-white shadow-md transition-colors cursor-pointer border-2 border-white"
          >
            <Edit2 size={14} />
          </button>
          <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#111827] mb-1">{profile.fullName}</h2>
          <p className="text-sm font-medium text-[#6B7280] mb-3">{profile.email}</p>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#EFF6FF] text-[#2563EB] text-[11px] font-bold rounded-full border border-[#BFDBFE]">Verified User</span>
            <span className="px-3 py-1 bg-[#F5F3FF] text-[#7C3AED] text-[11px] font-bold rounded-full border border-[#DDD6FE]">Enterprise Tier</span>
          </div>
        </div>
      </div>

      <hr className="border-[#E5E7EB] mb-8" />

      {/* Form Fields */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-[#4B5563] mb-2 tracking-wide">Full Name</label>
            <input
              type="text"
              value={draft.fullName}
              onChange={(e) => setDraft(prev => ({ ...prev, fullName: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[#111827] text-sm font-medium focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#4B5563] mb-2 tracking-wide">Current Role</label>
            <input
              type="text"
              value={draft.currentRole}
              onChange={(e) => setDraft(prev => ({ ...prev, currentRole: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[#111827] text-sm font-medium focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#4B5563] mb-2 tracking-wide">Target Role (AI Optimization Goal)</label>
          <input
            type="text"
            value={draft.targetRole}
            onChange={(e) => setDraft(prev => ({ ...prev, targetRole: e.target.value }))}
            placeholder="e.g. Principal Product Designer"
            className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[#111827] text-sm font-medium focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-[#0051C9] hover:bg-[#0042A5] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
        >
          Save Changes
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Security Tab ─── */
function SecurityTab({ settings, updateSetting }) {
  /* ── Password State ── */
  const [currentPw, setCurrentPw]   = useState('');
  const [newPw,     setNewPw]       = useState('');
  const [confirmPw, setConfirmPw]   = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwStatus,  setPwStatus]    = useState(null); // null | 'success' | string(error)

  /* ── Sessions State ── */
  const [sessions, setSessions] = useState([
    { id: 1, device: 'Chrome on Windows',   location: 'Mumbai, India',    time: 'Active now',  current: true  },
    { id: 2, device: 'Safari on iPhone 15', location: 'Mumbai, India',    time: '2 hours ago', current: false },
    { id: 3, device: 'Firefox on MacBook',  location: 'Delhi, India',     time: '3 days ago',  current: false },
  ]);
  const [revokeAllDone, setRevokeAllDone] = useState(false);

  /* ── Login History ── */
  const loginHistory = [
    { date: 'Jul 10, 2024 — 2:30 PM', device: 'Chrome on Windows',  location: 'Mumbai, India',    status: 'Success' },
    { date: 'Jul 9, 2024 — 11:15 AM', device: 'Safari on iPhone',   location: 'Mumbai, India',    status: 'Success' },
    { date: 'Jul 8, 2024 — 8:45 PM',  device: 'Unknown Device',     location: 'Bangalore, India', status: 'Failed'  },
    { date: 'Jul 7, 2024 — 3:00 PM',  device: 'Chrome on Windows',  location: 'Mumbai, India',    status: 'Success' },
  ];

  /* ── Handlers ── */
  const handlePasswordSave = () => {
    setPwStatus(null);
    if (!currentPw)            return setPwStatus('Please enter your current password.');
    if (newPw.length < 8)      return setPwStatus('New password must be at least 8 characters.');
    if (newPw !== confirmPw)   return setPwStatus('Passwords do not match.');
    // Simulate password update (replace with API call when backend is ready)
    setPwStatus('success');
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    setTimeout(() => setPwStatus(null), 4000);
  };

  const handleRevoke = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const handleRevokeAll = () => {
    setSessions(prev => prev.filter(s => s.current));
    setRevokeAllDone(true);
    setTimeout(() => setRevokeAllDone(false), 3000);
  };

  const nonCurrentSessions = sessions.filter(s => !s.current);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

      {/* ── Change Password ── */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] flex items-center justify-center">
            <Lock size={18} className="text-[#EF4444]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#111827]">Change Password</h2>
            <p className="text-xs text-[#6B7280]">Update your password to keep your account secure.</p>
          </div>
        </div>

        <div className="space-y-4 max-w-md">
          {/* Current Password */}
          {[
            { label: 'Current Password',     value: currentPw, set: setCurrentPw, show: showCurrent, toggle: setShowCurrent, placeholder: 'Enter current password' },
            { label: 'New Password',          value: newPw,     set: setNewPw,     show: showNew,     toggle: setShowNew,     placeholder: 'Min 8 characters' },
            { label: 'Confirm New Password',  value: confirmPw, set: setConfirmPw, show: showConfirm, toggle: setShowConfirm, placeholder: 'Re-enter new password' },
          ].map(({ label, value, set, show, toggle, placeholder }) => (
            <div key={label}>
              <label className="block text-xs font-bold text-[#4B5563] mb-2 tracking-wide">{label}</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[#111827] text-sm font-medium focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all pr-11"
                />
                <button type="button" onClick={() => toggle(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] cursor-pointer">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          ))}

          {/* Strength Bar */}
          {newPw && (
            <div>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4].map(i => {
                  const strength = Math.min(4, Math.floor(newPw.length / 3));
                  const color = strength <= 1 ? '#EF4444' : strength === 2 ? '#F59E0B' : strength === 3 ? '#3B82F6' : '#10B981';
                  return (
                    <div key={i} className="h-1 flex-1 rounded-full transition-all"
                      style={{ background: i <= strength ? color : '#E5E7EB' }} />
                  );
                })}
              </div>
              <p className="text-[10px] text-[#6B7280] mt-1">
                {newPw.length < 4 ? 'Weak' : newPw.length < 7 ? 'Fair' : newPw.length < 10 ? 'Good' : 'Strong'} password
              </p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {pwStatus && pwStatus !== 'success' && (
              <motion.p key="error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-xs font-semibold text-[#EF4444] flex items-center gap-1.5">
                ⚠ {pwStatus}
              </motion.p>
            )}
            {pwStatus === 'success' && (
              <motion.p key="success" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-xs font-semibold text-[#10B981] flex items-center gap-1.5">
                <Check size={14} /> Password updated successfully!
              </motion.p>
            )}
          </AnimatePresence>

          <button onClick={handlePasswordSave}
            className="px-5 py-2.5 bg-[#0051C9] hover:bg-[#0042A5] text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer">
            Update Password
          </button>
        </div>
      </div>

      {/* ── Two-Factor Authentication ── */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#F5F3FF] flex items-center justify-center">
            <Smartphone size={18} className="text-[#7C3AED]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#111827]">Two-Factor Authentication</h2>
            <p className="text-xs text-[#6B7280]">Add an extra layer of security to your account.</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#111827]">Enable 2FA</p>
            <p className="text-xs text-[#6B7280] mt-0.5">
              {settings.twoFactorAuth
                ? 'Two-factor authentication is enabled. Your account is protected.'
                : 'Protect your account with an authenticator app.'}
            </p>
          </div>
          <Toggle checked={settings.twoFactorAuth} onChange={(v) => updateSetting('twoFactorAuth', v)} />
        </div>

        <AnimatePresence>
          {settings.twoFactorAuth && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="mt-5 space-y-3">
                <div className="p-4 bg-[#F5F3FF] border border-[#DDD6FE] rounded-xl">
                  <p className="text-xs font-bold text-[#7C3AED] mb-1">✓ 2FA is Active</p>
                  <p className="text-[11px] text-[#6B7280]">Use your authenticator app (Google Authenticator, Authy) to generate codes when signing in.</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-xs font-bold text-[#7C3AED] bg-[#F5F3FF] border border-[#DDD6FE] rounded-xl hover:bg-[#EDE9FE] transition-colors cursor-pointer">
                    View Recovery Codes
                  </button>
                  <button className="px-4 py-2 text-xs font-bold text-[#6B7280] bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl hover:bg-[#F3F4F6] transition-colors cursor-pointer">
                    Reset Authenticator
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Active Sessions ── */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
              <Monitor size={18} className="text-[#2563EB]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111827]">Active Sessions</h2>
              <p className="text-xs text-[#6B7280]">Manage devices where you're currently signed in.</p>
            </div>
          </div>
          {nonCurrentSessions.length > 0 && (
            <button onClick={handleRevokeAll}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#EF4444] bg-[#FEF2F2] border border-[#FECACA] rounded-xl hover:bg-[#FEE2E2] transition-colors cursor-pointer">
              <LogOut size={13} /> Revoke All
            </button>
          )}
        </div>

        <AnimatePresence>
          {revokeAllDone && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-4 px-4 py-2.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-xs font-semibold text-[#10B981] flex items-center gap-2">
              <Check size={13} /> All other sessions have been revoked.
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          <AnimatePresence>
            {sessions.map((s) => (
              <motion.div key={s.id}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-xl hover:bg-[#F8FAFC] transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.current ? 'bg-[#10B981]' : 'bg-[#D1D5DB]'}`} />
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">{s.device}</p>
                    <p className="text-[11px] text-[#6B7280] flex items-center gap-1 mt-0.5">
                      <MapPin size={10} /> {s.location} • {s.time}
                    </p>
                  </div>
                </div>
                {s.current ? (
                  <span className="px-2.5 py-0.5 text-[10px] font-bold text-[#10B981] bg-[#ECFDF5] rounded-full border border-[#A7F3D0]">
                    This device
                  </span>
                ) : (
                  <button onClick={() => handleRevoke(s.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#EF4444] hover:text-[#DC2626] hover:underline cursor-pointer transition-colors">
                    <LogOut size={13} /> Revoke
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {sessions.length === 1 && (
            <p className="text-xs text-[#6B7280] text-center py-4">No other active sessions.</p>
          )}
        </div>
      </div>

      {/* ── Login History ── */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] flex items-center justify-center">
            <Shield size={18} className="text-[#D97706]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#111827]">Login History</h2>
            <p className="text-xs text-[#6B7280]">Recent sign-in activity on your account.</p>
          </div>
        </div>

        <div className="divide-y divide-[#F3F4F6] border border-[#E5E7EB] rounded-xl overflow-hidden">
          {loginHistory.map((log, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 bg-white hover:bg-[#F8FAFC] transition-colors">
              <div>
                <p className="text-xs font-semibold text-[#111827]">{log.date}</p>
                <p className="text-[11px] text-[#6B7280]">{log.device} • {log.location}</p>
              </div>
              <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                log.status === 'Success' ? 'text-[#10B981] bg-[#ECFDF5]' : 'text-[#EF4444] bg-[#FEF2F2]'
              }`}>{log.status}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const SettingsPage = ({ initialTab = 'profile' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [settings, setSettings] = useState(loadSettings);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Apply compact mode to root
  useEffect(() => {
    document.documentElement.classList.toggle('compact-mode', settings.compactMode);
  }, [settings.compactMode]);

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      saveSettings(next);
      return next;
    });
  }, []);

  const handleSave = () => {
    saveSettings(settings);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'general', label: 'General Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
  ];



  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <SaveToast show={showToast} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight mb-2">
          Account & Preferences
        </h1>
        <p className="text-sm font-medium text-[#6B7280]">
          Manage your personal information, AI goals, and security settings.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Inner Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    active 
                      ? 'bg-[#EFF6FF] text-[#2563EB]' 
                      : 'text-[#4B5563] hover:bg-white hover:text-[#111827]'
                  }`}
                >
                  <tab.icon size={18} className={active ? 'text-[#2563EB]' : 'text-[#6B7280]'} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <ProfileTab showToast={() => { setShowToast(true); setTimeout(() => setShowToast(false), 2500); }} />
          )}

          {activeTab === 'general' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Appearance */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-[#F5F3FF] flex items-center justify-center">
                    <Monitor size={18} className="text-[#7C3AED]" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#111827]">Appearance</h2>
                    <p className="text-xs text-[#6B7280]">Customize how Avenir AI looks on your device.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#111827]">Theme</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">Choose between light and dark mode.</p>
                    </div>
                    <div className="relative">
                      <select
                        value={settings.theme}
                        onChange={(e) => updateSetting('theme', e.target.value)}
                        className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[#111827] text-sm font-medium appearance-none pr-9 focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all cursor-pointer"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                    </div>
                  </div>

                  <hr className="border-[#F3F4F6]" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#111827]">Compact Mode</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">Reduce spacing for a denser layout.</p>
                    </div>
                    <Toggle checked={settings.compactMode} onChange={(v) => updateSetting('compactMode', v)} />
                  </div>
                </div>
              </div>

              {/* Language & Region */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                    <Globe size={18} className="text-[#2563EB]" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#111827]">Language & Region</h2>
                    <p className="text-xs text-[#6B7280]">Set your preferred language and timezone.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[#4B5563] mb-2 tracking-wide">Language</label>
                    <div className="relative">
                      <select
                        value={settings.language}
                        onChange={(e) => updateSetting('language', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[#111827] text-sm font-medium appearance-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all cursor-pointer"
                      >
                        <option>English (US)</option>
                        <option>Hindi</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#4B5563] mb-2 tracking-wide">Timezone</label>
                    <div className="relative">
                      <select
                        value={settings.timezone}
                        onChange={(e) => updateSetting('timezone', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-[#111827] text-sm font-medium appearance-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all cursor-pointer"
                      >
                        <option>(GMT+5:30) India Standard Time</option>
                        <option>(GMT-8:00) Pacific Time</option>
                        <option>(GMT-5:00) Eastern Time</option>
                        <option>(GMT+0:00) UTC</option>
                        <option>(GMT+1:00) Central European Time</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>



              {/* Save */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-[#0051C9] hover:bg-[#0042A5] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Save Preferences
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <SecurityTab settings={settings} updateSetting={updateSetting} />
          )}

          {activeTab !== 'profile' && activeTab !== 'general' && activeTab !== 'security' && (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-8 flex items-center justify-center h-64">
              <p className="text-[#6B7280] font-medium text-sm">
                This section is under construction.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
