import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Bell, Moon, LogOut, Check } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  // Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 98765 43210',
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    maintenanceRequests: true,
    rentReminders: false,
    monthlyReports: true,
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call
    setTimeout(() => setSaving(false), 800);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const inputClass = 'w-full px-3.5 py-2.5 rounded-lg bg-[var(--color-warm-white)] border border-[var(--color-mist)] text-[13px] text-[var(--color-charcoal)] focus:outline-none focus:border-[var(--color-champagne)]/50 focus:bg-white transition-colors';
  const labelClass = 'block text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-stone)] mb-1.5';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl text-[var(--color-charcoal)]" style={{ fontFamily: 'var(--font-display)' }}>Account Settings</h1>
        <p className="text-[12px] text-[var(--color-stone)] mt-1">Manage your profile, preferences, and security</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="w-full md:w-64 shrink-0 space-y-1">
          {[
            { id: 'profile', label: 'Profile Information', icon: User },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'appearance', label: 'Appearance', icon: Moon },
            { id: 'security', label: 'Security', icon: Lock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-[var(--color-charcoal)] border border-[var(--color-mist)] shadow-[var(--shadow-editorial)]'
                  : 'text-[var(--color-stone)] hover:bg-[var(--color-warm-white)] hover:text-[var(--color-charcoal)] border border-transparent'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-[var(--color-champagne-dark)]' : ''}`} />
              {tab.label}
            </button>
          ))}

          <div className="pt-6 mt-6 border-t border-[var(--color-mist)]">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="flex-1">
          <div className="bg-white rounded-2xl border border-[var(--color-mist)] overflow-hidden">
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="p-6 md:p-8">
                <h2 className="text-lg font-semibold text-[var(--color-charcoal)] mb-6">Profile Information</h2>
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-champagne)] to-[var(--color-champagne-dark)] flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-[var(--color-warm-white)] text-[var(--color-charcoal)] border border-[var(--color-mist)] rounded-lg text-[12px] font-medium hover:bg-[var(--color-mist)]/30 transition-colors">
                      Change Avatar
                    </button>
                    <p className="text-[11px] text-[var(--color-stone-light)] mt-2">JPG, GIF or PNG. Max size 2MB.</p>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-stone-light)]" />
                        <input type="text" className={`${inputClass} pl-10`} value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-stone-light)]" />
                        <input type="text" className={`${inputClass} pl-10`} value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-stone-light)]" />
                      <input type="email" className={`${inputClass} pl-10 opacity-70`} value={profileForm.email} disabled />
                    </div>
                    <p className="text-[10px] text-[var(--color-stone-light)] mt-1.5">Email address cannot be changed. Contact support for assistance.</p>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-charcoal)] text-white text-[13px] font-medium rounded-lg hover:bg-[var(--color-champagne-dark)] transition-colors disabled:opacity-50">
                      {saving ? 'Saving...' : <><Check className="w-4 h-4" /> Save Changes</>}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="p-6 md:p-8">
                <h2 className="text-lg font-semibold text-[var(--color-charcoal)] mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { key: 'emailAlerts', title: 'Email Alerts', desc: 'Receive important account alerts via email.' },
                    { key: 'maintenanceRequests', title: 'Maintenance Requests', desc: 'Get notified when a new request is logged.' },
                    { key: 'rentReminders', title: 'Rent Reminders', desc: 'Automatic alerts for upcoming rent collections.' },
                    { key: 'monthlyReports', title: 'Monthly Reports', desc: 'Receive a summary of your portfolio performance.' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-start justify-between p-4 rounded-xl border border-[var(--color-mist)]">
                      <div>
                        <h4 className="text-[14px] font-medium text-[var(--color-charcoal)]">{item.title}</h4>
                        <p className="text-[12px] text-[var(--color-stone)] mt-0.5">{item.desc}</p>
                      </div>
                      <button 
                        onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof notifications] }))}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus:outline-none ${notifications[item.key as keyof typeof notifications] ? 'bg-[var(--color-charcoal)]' : 'bg-[var(--color-mist)]'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-2' : '-translate-x-2'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Placeholders for other tabs */}
            {(activeTab === 'appearance' || activeTab === 'security') && (
              <div className="p-6 md:p-8 flex flex-col items-center justify-center h-64 text-center">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-cream)] flex items-center justify-center mb-4">
                  {activeTab === 'appearance' ? <Moon className="w-6 h-6 text-[var(--color-stone-light)]" /> : <Lock className="w-6 h-6 text-[var(--color-stone-light)]" />}
                </div>
                <h3 className="text-[15px] font-semibold text-[var(--color-charcoal)] mb-1.5 capitalize">{activeTab} Settings</h3>
                <p className="text-[13px] text-[var(--color-stone)] max-w-sm">This module is currently under development. Check back later for updates.</p>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </div>
  );
}
