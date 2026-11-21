"use client";
import { Settings, Shield, Server, Link as LinkIcon, Save, Loader2, CheckCircle, User, Key, Image as ImageIcon, Trophy, Plus, Trash2, FlaskConical, BellOff, ShieldAlert } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export default function AdminSettings() {
  const { user, login, refreshUser } = useAuth();
  const [communityLink, setCommunityLink] = useState('');
  const [prizePool, setPrizePool] = useState('50K');
  const [mapsStr, setMapsStr] = useState('ERANGEL, MIRAMAR, SANHOK, VIKENDI');
  const [testingMode, setTestingMode] = useState(false);
  const [savingTestingMode, setSavingTestingMode] = useState(false);
  
  // Points System State
  const [perKill, setPerKill] = useState(1);
  const [placementPoints, setPlacementPoints] = useState({
    "1": 15, "2": 12, "3": 10, "4": 8
  });
  
  // Profile state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user?.profilePhoto || null);
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
          setTestingMode(Boolean(settingsRes.data.testingMode));
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
          } else if (user?.profilePhoto) {
            setPhotoPreview(user.profilePhoto);
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


  const rankList = Object.keys(placementPoints || {})
    .map(Number)
    .filter(n => !isNaN(n) && n > 0)
    .sort((a, b) => a - b);
  const activeRanks = rankList.length > 0 ? rankList : [1, 2, 3, 4];

  const handleAddRank = () => {
    const nextRank = activeRanks.length > 0 ? Math.max(...activeRanks) + 1 : 1;
    if (nextRank <= 25) {
      setPlacementPoints(prev => ({ ...prev, [nextRank]: 0 }));
    }
  };

  const handleRemoveRank = (rankToRemove) => {
    setPlacementPoints(prev => {
      const next = { ...prev };
      delete next[rankToRemove];
      delete next[String(rankToRemove)];
      return next;
    });
  };

  const handleToggleTestingMode = async () => {
    const nextVal = !testingMode;
    try {
      setSavingTestingMode(true);
      setErrorMsg('');
      const res = await api.put('/admin/settings', { testingMode: nextVal });
      if (res.success) {
        setTestingMode(nextVal);
        setSuccessMsg(nextVal 
          ? 'Testing Mode ENABLED: All team update emails are now suppressed' 
          : 'Testing Mode DISABLED: Team update emails are now LIVE'
        );
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update testing mode');
    } finally {
      setSavingTestingMode(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true);
      setErrorMsg('');
      await api.put('/admin/settings', { 
        communityLink,
        prizePool,
        testingMode,
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
      
      const res = await api.put('/admin/profile', formData);
      
      if (res.success) {
        setSuccessMsg('Profile updated successfully');
        const updatedPhoto = res.data.profilePhoto || photoPreview;
        setPhotoPreview(updatedPhoto);
        // Update user context with new email if it changed
        const updatedUser = { 
          ...user, 
          email: res.data.email, 
          name: res.data.name, 
          profilePhoto: updatedPhoto 
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        if (refreshUser) refreshUser();
        setTimeout(() => window.location.reload(), 1200);
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
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 800;
          
          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            const compressedFile = new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() });
            setProfilePhoto(compressedFile);
          }, 'image/jpeg', 0.8);
        };
        img.src = reader.result;
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
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
                <img 
                  src={photoPreview || user?.profilePhoto || "/BattlegroundLogo.png"} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
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

        {/* Testing Mode Section */}
        <div className={`border p-6 md:col-span-2 transition-all duration-300 relative overflow-hidden ${
          testingMode 
            ? 'bg-amber-950/20 border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.15)]' 
            : 'bg-[#111518]/90 border-white/10'
        }`}>
          {testingMode && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-500 via-[#FF6A00] to-amber-500 animate-pulse"></div>
          )}
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-none border ${
                testingMode 
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' 
                  : 'bg-[#1A2023] border-white/10 text-[#B8C0C2]'
              }`}>
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest">
                    Testing Mode
                  </h3>
                  <span className={`font-orbitron text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider border ${
                    testingMode 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {testingMode ? '● ACTIVE // TEAM EMAILS MUTED' : '● OFF // LIVE DELIVERY'}
                  </span>
                </div>
                <p className="font-inter text-xs text-[#B8C0C2] mt-0.5">
                  Mute all tournament update emails to teams during testing, rehearsal, and system verification.
                </p>
              </div>
            </div>

            {/* Tactical Toggle Switch Button */}
            <button
              type="button"
              onClick={handleToggleTestingMode}
              disabled={savingTestingMode}
              className={`flex items-center gap-3 px-5 py-2.5 font-rajdhani font-bold text-sm uppercase tracking-widest transition-all cursor-pointer transform skew-x-[-10deg] border ${
                testingMode
                  ? 'bg-amber-500 hover:bg-amber-400 text-black border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'bg-[#1A2023] hover:bg-white hover:text-black text-white border-white/20'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="transform skew-x-10 flex items-center gap-2">
                {savingTestingMode ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : testingMode ? (
                  <BellOff className="w-4 h-4 text-black" />
                ) : (
                  <FlaskConical className="w-4 h-4 text-[#FF6A00]" />
                )}
                <span>{testingMode ? 'DISABLE TESTING MODE' : 'ENABLE TESTING MODE'}</span>
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <p className="font-inter text-xs text-[#B8C0C2] leading-relaxed">
                When <strong className="text-white">Testing Mode</strong> is ON, <span className="text-amber-400 font-semibold">no team or player will receive any email updates</span>. You can safely create or update matches, assign room credentials, post announcements, and record match results without triggering emails to registered squads.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[10px] font-mono bg-[#080A0C] border border-white/10 px-2 py-1 text-[#B8C0C2] flex items-center gap-1">
                  <span className={testingMode ? "text-amber-400" : "text-emerald-400"}>{testingMode ? "🚫" : "✓"}</span> Match Schedules
                </span>
                <span className="text-[10px] font-mono bg-[#080A0C] border border-white/10 px-2 py-1 text-[#B8C0C2] flex items-center gap-1">
                  <span className={testingMode ? "text-amber-400" : "text-emerald-400"}>{testingMode ? "🚫" : "✓"}</span> Room ID & Passwords
                </span>
                <span className="text-[10px] font-mono bg-[#080A0C] border border-white/10 px-2 py-1 text-[#B8C0C2] flex items-center gap-1">
                  <span className={testingMode ? "text-amber-400" : "text-emerald-400"}>{testingMode ? "🚫" : "✓"}</span> Intel Announcements
                </span>
                <span className="text-[10px] font-mono bg-[#080A0C] border border-white/10 px-2 py-1 text-[#B8C0C2] flex items-center gap-1">
                  <span className={testingMode ? "text-amber-400" : "text-emerald-400"}>{testingMode ? "🚫" : "✓"}</span> Squad Approvals & Rejections
                </span>
              </div>
            </div>

            <div className={`p-4 border flex flex-col justify-center ${
              testingMode 
                ? 'bg-amber-950/40 border-amber-500/30 text-amber-200' 
                : 'bg-[#080A0C] border-white/10 text-[#B8C0C2]'
            }`}>
              <div className="font-orbitron text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1 text-white">
                <ShieldAlert className={`w-4 h-4 ${testingMode ? 'text-amber-400' : 'text-[#FF6A00]'}`} />
                Mode Status
              </div>
              <p className="font-inter text-xs leading-normal">
                {testingMode ? (
                  <span className="text-amber-300 font-semibold">
                    Emails to squads are MUTED. Safely test tournament flows without sending player emails.
                  </span>
                ) : (
                  <span>
                    Emails are LIVE. Team updates and room details will be dispatched immediately.
                  </span>
                )}
              </p>
            </div>
          </div>
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
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
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
                  className="bg-[#FF6A00] hover:bg-white text-black font-rajdhani font-bold px-6 py-2 uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform skew-x-[-10deg]"
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
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <input 
                  type="text" 
                  value={prizePool}
                  onChange={(e) => setPrizePool(e.target.value)}
                  placeholder="e.g. 50K" 
                  className="flex-1 bg-[#080A0C] border border-white/10 text-white font-inter text-sm px-4 py-2 focus:border-[#FF6A00] focus:outline-none placeholder-white/20" 
                />
                <button 
                  onClick={handleSaveSettings}
                  disabled={savingSettings}
                  className="bg-[#FF6A00] hover:bg-white text-black font-rajdhani font-bold px-6 py-2 uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform skew-x-[-10deg]"
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
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
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
                  className="bg-[#FF6A00] hover:bg-white text-black font-rajdhani font-bold px-6 py-2 uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform skew-x-[-10deg]"
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
            {activeRanks.map((pos) => (
              <div key={pos} className="flex flex-col w-24">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[#FF6A00] font-orbitron text-[10px] font-bold tracking-widest uppercase">Rank #{pos}</span>
                  {activeRanks.length > 1 && pos === activeRanks[activeRanks.length - 1] && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRank(pos)}
                      title={`Remove Rank #${pos}`}
                      className="text-[#B8C0C2] hover:text-red-500 transition-colors p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div className="hud-border p-1 bg-[#1A2023]">
                  <input 
                    type="number" 
                    value={placementPoints[pos] ?? 0}
                    onChange={(e) => setPlacementPoints({ ...placementPoints, [pos]: Number(e.target.value) })}
                    min="0"
                    className="w-full bg-black/50 border-none text-white font-rajdhani font-bold text-xl px-2 py-2 focus:outline-none text-center focus:bg-[#FF6A00]/10 transition-colors" 
                  />
                </div>
              </div>
            ))}

            {/* Add Rank Button */}
            {activeRanks.length < 25 && (
              <div className="flex flex-col w-24 justify-end">
                <button
                  type="button"
                  onClick={handleAddRank}
                  className="h-13 border border-dashed border-white/20 hover:border-[#FF6A00] text-[#B8C0C2] hover:text-[#FF6A00] transition-colors flex flex-col items-center justify-center gap-1 group bg-[#111518]/50"
                  title="Add next placement rank"
                >
                  <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-orbitron text-[9px] uppercase font-bold tracking-wider">+ Rank</span>
                </button>
              </div>
            )}
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
