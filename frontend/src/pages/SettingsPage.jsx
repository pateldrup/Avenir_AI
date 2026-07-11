import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, Shield, Code, Edit2, ChevronDown, Globe, Bell, Monitor, Check, Lock, Eye, EyeOff, LogOut, MapPin } from 'lucide-react';

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
function SaveToast({ show, message = 'Preferences saved successfully!' }) {
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
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Profile Tab Component ─── */
function ProfileTab({ profile, setProfile, showToast }) {
  const [draft, setDraft] = useState(profile);
  const photoRef = React.useRef(null);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setDraft(prev => ({ ...prev, photoUrl: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: draft.fullName,
          currentRole: draft.currentRole,
          targetRole: draft.targetRole,
          photoUrl: draft.photoUrl
        })
      });

      if (res.ok) {
        const data = await res.json();
        setProfile({
          fullName: data.name,
          email: data.email,
          currentRole: data.currentRole,
          targetRole: data.targetRole,
          photoUrl: data.photoUrl,
          authProvider: data.authProvider
        });
        showToast('Profile updated successfully!');
      }
    } catch (err) {
      console.error(err);
    }
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
            {profile.authProvider && (
              <span className="px-3 py-1 bg-[#F5F3FF] text-[#7C3AED] text-[11px] font-bold rounded-full border border-[#DDD6FE] uppercase">
                {profile.authProvider} Login
              </span>
            )}
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
function SecurityTab({ settings, updateSetting, profile }) {
  const [currentPw, setCurrentPw]   = useState('');
  const [newPw,     setNewPw]       = useState('');
  const [confirmPw, setConfirmPw]   = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwStatus,  setPwStatus]    = useState(null); 

  const handlePasswordSave = async () => {
    setPwStatus(null);
    if (!currentPw)            return setPwStatus('Please enter your current password.');
    if (newPw.length < 6)      return setPwStatus('New password must be at least 6 characters.');
    if (newPw !== confirmPw)   return setPwStatus('Passwords do not match.');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw })
      });

      const data = await res.json();
      if (res.ok) {
        setPwStatus('success');
        setCurrentPw(''); setNewPw(''); setConfirmPw('');
        setTimeout(() => setPwStatus(null), 4000);
      } else {
        setPwStatus(data.message || 'Failed to update password');
      }
    } catch (err) {
      setPwStatus('An error occurred');
    }
  };

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

        {profile.authProvider !== 'local' ? (
          <div className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-sm font-medium text-[#6B7280]">
            Your account is authenticated via {profile.authProvider}. Password changes must be handled through your provider.
          </div>
        ) : (
          <div className="space-y-4 max-w-md">
            {[
              { label: 'Current Password',     value: currentPw, set: setCurrentPw, show: showCurrent, toggle: setShowCurrent, placeholder: 'Enter current password' },
              { label: 'New Password',          value: newPw,     set: setNewPw,     show: showNew,     toggle: setShowNew,     placeholder: 'Min 6 characters' },
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
        )}
      </div>

    </motion.div>
  );
}

const SettingsPage = ({ initialTab = 'profile' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    fullName: '', email: '', currentRole: '', targetRole: '', photoUrl: '', authProvider: 'local'
  });

  const [settings, setSettings] = useState({
    compactMode: false, theme: 'light', language: 'English (US)', timezone: '(GMT+5:30) India Standard Time', twoFactorAuth: false
  });

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setProfile({
          fullName: data.name || '',
          email: data.email || '',
          currentRole: data.currentRole || '',
          targetRole: data.targetRole || '',
          photoUrl: data.photoUrl || '',
          authProvider: data.authProvider || 'local'
        });
        if (data.settings) {
          setSettings(data.settings);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Apply compact mode to root
  useEffect(() => {
    document.documentElement.classList.toggle('compact-mode', settings.compactMode);
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings.compactMode, settings.theme]);

  const updateSetting = useCallback(async (key, value) => {
    const nextSettings = { ...settings, [key]: value };
    setSettings(nextSettings);

    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL}/users/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(nextSettings)
      });
    } catch (err) {
      console.error('Failed to save settings to backend');
    }
  }, [settings]);

  const handleGeneralSettingsSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL}/users/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      setToastMessage('Preferences saved successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'general', label: 'General Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  if (loading) {
    return (
      <div className="animate-pulse space-y-6 max-w-4xl">
        <div className="h-8 w-64 bg-gray-200 rounded-md"></div>
        <div className="flex gap-8">
          <div className="w-64 space-y-2">
            {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-200 rounded-xl"></div>)}
          </div>
          <div className="flex-1 h-96 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <SaveToast show={showToast} message={toastMessage} />

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
            <ProfileTab 
              profile={profile} 
              setProfile={setProfile} 
              showToast={(msg) => { setToastMessage(msg); setShowToast(true); setTimeout(() => setShowToast(false), 2500); }} 
            />
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
                  onClick={handleGeneralSettingsSave}
                  className="px-6 py-3 bg-[#0051C9] hover:bg-[#0042A5] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Save Preferences
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <SecurityTab settings={settings} updateSetting={updateSetting} profile={profile} />
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
