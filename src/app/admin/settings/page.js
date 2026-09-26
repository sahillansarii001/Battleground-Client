"use client";
import { Settings, Shield, Server, Link as LinkIcon, Save, Loader2, CheckCircle, User, Key, Image as ImageIcon, Trophy } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export default function AdminSettings() {
  const { user, login } = useAuth();
  const [communityLink, setCommunityLink] = useState('');
  const [prizePool, setPrizePool] = useState('50K');
  const [mapsStr, setMapsStr] = useState('ERANGEL, MIRAMAR, SANHOK, VIKENDI');
  
  // Points System State
  const [perKill, setPerKill] = useState(1);
  const [placementPoints, setPlacementPoints] = useState({
    "1": 15, "2": 12, "3": 10, "4": 8
  });
  
  // Profile state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [settingsRes, profileRes] = await Promise.all([
          api.get('/admin/settings'),
          api.get('/admin/profile')
        ]);
        
        if (settingsRes.success && settingsRes.data) {
          setCommunityLink(settingsRes.data.communityLink || '');
          setPrizePool(settingsRes.data.prizePool || '50K');
          if (settingsRes.data.maps) setMapsStr(settingsRes.data.maps.join(', '));
          if (settingsRes.data.pointsSystem) {
            setPerKill(settingsRes.data.pointsSystem.perKill ?? 1);
            if (settingsRes.data.pointsSystem.placementPoints) {
              setPlacementPoints(settingsRes.data.pointsSystem.placementPoints);
            }
          }
        }
        if (profileRes.success && profileRes.data) {
          setName(profileRes.data.name || 'Global Admin');
          setEmail(profileRes.data.email || '');
          if (profileRes.data.profilePhoto) {
            setPhotoPreview(profileRes.data.profilePhoto);
          }
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
        setErrorMsg('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true);
      setErrorMsg('');
      await api.put('/admin/settings', { 
        communityLink,
        prizePool,
        pointsSystem: {
          perKill: Number(perKill),
          placementPoints
        },
        maps: mapsStr.split(',').map(m => m.trim()).filter(Boolean)
      });
      setSuccessMsg('System settings saved successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setErrorMsg('');
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto);
      }
      
      const res = await api.put('/admin/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.success) {
        setSuccessMsg('Profile updated successfully');
        // Update user context with new email if it changed
        const updatedUser = { ...user, email: res.data.email, name: res.data.name, profilePhoto: res.data.profilePhoto };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    try {
      setSavingPassword(true);
      setErrorMsg('');
      
      if (newPassword !== confirmPassword) {
        throw new Error('New passwords do not match');
      }

      await api.put('/admin/settings/password', { currentPassword, newPassword, confirmPassword });
      
      setSuccessMsg('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-[#FF6A00] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-[#111518]/90 border border-white/10 p-6 flex items-center justify-between hud-border relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6A00]"></div>
        <div>
          <h2 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
            <Settings className="w-6 h-6 text-[#FF6A00]" />
            Settings
          </h2>
          <p className="font-inter text-xs text-[#B8C0C2] mt-1">Manage profile, security, and global tournament parameters.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 text-sm">
          {errorMsg}
        </div>
      )}
      
      {successMsg && (
        <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Settings */}
        <div className="bg-[#111518]/90 border border-white/10 p-6">
          <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
            <User className="w-5 h-5 text-[#FF6A00]" />
            My Profile
          </h3>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-16 h-16 rounded-full border border-white/20 bg-black overflow-hidden flex items-center justify-center cursor-pointer relative group"
                onClick={() => fileInputRef.current?.click()}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-white/50" />
                )}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ImageIcon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <p className="text-xs text-[#B8C0C2] mb-1">Upload Profile Photo</p>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-[#FF6A00] uppercase tracking-widest font-bold"
                >
                  Choose Image
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            </div>

            <div>
              <label className="block font-orbitron text-[10px] text-[#B8C0C2] uppercase tracking-widest mb-2">Display Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#080A0C] border border-white/10 text-white font-inter text-sm px-4 py-2 focus:border-[#FF6A00] focus:outline-none" 
              />
            </div>
            <div>
              <label className="block font-orbitron text-[10px] text-[#B8C0C2] uppercase tracking-widest mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#080A0C] border border-white/10 text-white font-inter text-sm px-4 py-2 focus:border-[#FF6A00] focus:outline-none" 
              />
            </div>
            <div className="pt-2">
              <button 
                type="submit"
                disabled={savingProfile}
                className="w-full bg-[#FF6A00] hover:bg-white text-black font-rajdhani font-bold py-2 uppercase tracking-widest transition-colors flex items-center justify-center gap-2 transform skew-x-[-10deg]"
              >
                <div className="transform skew-x-10 flex items-center gap-2">
                  {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Update Profile
                </div>
              </button>
            </div>
          </form>
        </div>

        {/* Security Settings */}
        <div className="bg-[#111518]/90 border border-white/10 p-6">
          <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
            <Key className="w-5 h-5 text-[#FF6A00]" />
            Change Password
          </h3>
          <form onSubmit={handleSavePassword} className="space-y-4">
            <div>
              <label className="block font-orbitron text-[10px] text-[#B8C0C2] uppercase tracking-widest mb-2">Current Password</label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full bg-[#080A0C] border border-white/10 text-white font-inter text-sm px-4 py-2 focus:border-[#FF6A00] focus:outline-none" 
              />
            </div>
            <div>
              <label className="block font-orbitron text-[10px] text-[#B8C0C2] uppercase tracking-widest mb-2">New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full bg-[#080A0C] border border-white/10 text-white font-inter text-sm px-4 py-2 focus:border-[#FF6A00] focus:outline-none" 
              />
            </div>
            <div>
              <label className="block font-orbitron text-[10px] text-[#B8C0C2] uppercase tracking-widest mb-2">Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-[#080A0C] border border-white/10 text-white font-inter text-sm px-4 py-2 focus:border-[#FF6A00] focus:outline-none" 
              />
            </div>
            <div className="pt-2">
              <button 
                type="submit"
                disabled={savingPassword}
                className="w-full bg-[#FF6A00] hover:bg-white text-black font-rajdhani font-bold py-2 uppercase tracking-widest transition-colors flex items-center justify-center gap-2 transform skew-x-[-10deg]"
              >
                <div className="transform skew-x-10 flex items-center gap-2">
                  {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Change Password
                </div>
              </button>
            </div>
          </form>
        </div>

        {/* Community & Connections */}
        <div className="bg-[#111518]/90 border border-white/10 p-6 md:col-span-2">
          <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
            <LinkIcon className="w-5 h-5 text-[#FF6A00]" />
            Community Links
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block font-orbitron text-[10px] text-[#B8C0C2] uppercase tracking-widest mb-2">Telegram Community Link (Sent in Approval Email)</label>
              <div className="flex gap-2">
                <input 
                  type="url" 
                  value={communityLink}
                  onChange={(e) => setCommunityLink(e.target.value)}
                  placeholder="https://t.me/your_community" 
                  className="flex-1 bg-[#080A0C] border border-white/10 text-white font-inter text-sm px-4 py-2 focus:border-[#FF6A00] focus:outline-none placeholder-white/20" 
                />
                <button 
                  onClick={handleSaveSettings}
                  disabled={savingSettings}
                  className="bg-[#FF6A00] hover:bg-white text-black font-rajdhani font-bold px-6 uppercase tracking-widest transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform skew-x-[-10deg]"
                >
                  <div className="transform skew-x-10 flex items-center gap-2">
                    {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Settings
                  </div>
                </button>
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/5">
              <label className="block font-orbitron text-[10px] text-[#B8C0C2] uppercase tracking-widest mb-2">Tournament Prize Pool (e.g. "50K", "1 Lakh", "Medals")</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={prizePool}
                  onChange={(e) => setPrizePool(e.target.value)}
                  placeholder="e.g. 50K" 
                  className="flex-1 bg-[#080A0C] border border-white/10 text-white font-inter text-sm px-4 py-2 focus:border-[#FF6A00] focus:outline-none placeholder-white/20 max-w-50" 
                />
                <button 
                  onClick={handleSaveSettings}
                  disabled={savingSettings}
                  className="bg-[#FF6A00] hover:bg-white text-black font-rajdhani font-bold px-6 uppercase tracking-widest transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform skew-x-[-10deg]"
                >
                  <div className="transform skew-x-10 flex items-center gap-2">
                    {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Settings
                  </div>
                </button>
              </div>
            </div>

            
            <div className="pt-4 border-t border-white/5">
              <label className="block font-orbitron text-[10px] text-[#B8C0C2] uppercase tracking-widest mb-2">Available Maps (Comma separated)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={mapsStr}
                  onChange={(e) => setMapsStr(e.target.value)}
                  placeholder="e.g. ERANGEL, MIRAMAR" 
                  className="flex-1 bg-[#080A0C] border border-white/10 text-white font-inter text-sm px-4 py-2 focus:border-[#FF6A00] focus:outline-none placeholder-white/20" 
                />
                <button 
                  onClick={handleSaveSettings}
                  disabled={savingSettings}
                  className="bg-[#FF6A00] hover:bg-white text-black font-rajdhani font-bold px-6 uppercase tracking-widest transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform skew-x-[-10deg]"
                >
                  <div className="transform skew-x-10 flex items-center gap-2">
                    {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Settings
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Points System Configuration */}
        <div className="bg-[#111518]/90 border border-white/10 p-6 md:col-span-2">
          <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-white/10 pb-2">
            <Trophy className="w-5 h-5 text-[#FF6A00]" />
            Points System Configuration
          </h3>
          
          <div className="flex flex-wrap gap-6 items-center">
            
            {/* Per Kill */}
            <div className="flex flex-col w-24">
              <span className="text-[#B8C0C2] font-orbitron text-[10px] font-bold mb-2 tracking-widest text-center uppercase">Per Kill</span>
              <div className="hud-border p-1 bg-[#1A2023]">
                <input 
                  type="number" 
                  value={perKill}
                  onChange={(e) => setPerKill(e.target.value)}
                  min="0"
                  className="w-full bg-black/50 border-none text-white font-rajdhani font-bold text-xl px-2 py-2 focus:outline-none text-center focus:bg-[#FF6A00]/10 transition-colors" 
                />
              </div>
            </div>

            {/* Separator */}
            <div className="h-16 w-px bg-white/10 hidden sm:block"></div>

            {/* Placement Points */}
            {Array.from({ length: 4 }, (_, i) => i + 1).map((pos) => (
              <div key={pos} className="flex flex-col w-24">
                <span className="text-[#FF6A00] font-orbitron text-[10px] font-bold mb-2 tracking-widest text-center uppercase">Rank #{pos}</span>
                <div className="hud-border p-1 bg-[#1A2023]">
                  <input 
                    type="number" 
                    value={placementPoints[pos] || 0}
                    onChange={(e) => setPlacementPoints({ ...placementPoints, [pos]: Number(e.target.value) })}
                    min="0"
                    className="w-full bg-black/50 border-none text-white font-rajdhani font-bold text-xl px-2 py-2 focus:outline-none text-center focus:bg-[#FF6A00]/10 transition-colors" 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 mt-6 border-t border-white/10">
            <button 
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="bg-[#FF6A00] hover:bg-white text-black font-rajdhani font-bold px-8 py-3 uppercase tracking-widest transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform skew-x-[-10deg] ml-auto"
            >
              <div className="transform skew-x-10 flex items-center gap-2">
                {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Points System
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
