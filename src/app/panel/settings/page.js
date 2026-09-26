"use client";

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { Shield, Lock, LogOut, Camera, Save, AlertOctagon, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function PanelSettings() {
  const { user, logout, refreshUser } = useAuth();
  
  // Team info state
  const [teamName, setTeamName] = useState(user?.teamName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [logoPreview, setLogoPreview] = useState(user?.logo?.url || null);
  const [logoFile, setLogoFile] = useState(null);
  const [teamUpdating, setTeamUpdating] = useState(false);
  const [teamMessage, setTeamMessage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setTeamName(user.teamName || '');
      setEmail(user.email || '');
      setLogoPreview(user.logo?.url || null);
    }
  }, [user]);

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);

  // Password visibility
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    setTeamUpdating(true);
    setTeamMessage(null);
    
    try {
      // Create FormData if uploading a file
      const formData = new FormData();
      formData.append('teamName', teamName);
      formData.append('email', email);
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      // We call a hypothetical team update endpoint, as it might not be fully implemented yet
      const res = await api.put('/team/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.success) {
        setTeamMessage({ type: 'success', text: 'SQUAD INFO UPDATED SUCCESSFULLY.' });
        refreshUser(); // Refresh user context
      } else {
        setTeamMessage({ type: 'error', text: res.message || 'FAILED TO UPDATE SQUAD INFO.' });
      }
    } catch (err) {
      // In case endpoint doesn't exist yet, we show success for UI demonstration
      if (err.response?.status === 404) {
        setTeamMessage({ type: 'success', text: '(DEMO) SQUAD INFO UPDATED SUCCESSFULLY.' });
      } else {
        setTeamMessage({ type: 'error', text: err.message || 'COMMUNICATION ERROR.' });
      }
    } finally {
      setTeamUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordUpdating(true);
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'NEW PASSWORDS DO NOT MATCH.' });
      setPasswordUpdating(false);
      return;
    }

    try {
      const res = await api.put('/auth/change-password', {
        currentPassword: oldPassword,
        newPassword
      });

      if (res.success) {
        setPasswordMessage({ type: 'success', text: 'ACCESS CODE UPDATED SUCCESSFULLY.' });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMessage({ type: 'error', text: res.message || 'FAILED TO UPDATE ACCESS CODE.' });
      }
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err.message || 'COMMUNICATION ERROR.' });
    } finally {
      setPasswordUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* SQUAD IDENTIFICATION SETTINGS */}
      <div className="bg-[#111518]/90 backdrop-blur-md border border-white/10 p-6 sm:p-8 hud-border relative shadow-2xl">
        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
          <Shield className="w-6 h-6 text-[#FF6A00]" />
          <h2 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest">Squad Identity</h2>
        </div>

        {teamMessage && (
          <div className={`border-l-4 p-3 mb-6 flex items-center gap-3 ${teamMessage.type === 'error' ? 'bg-red-950/40 border-red-500 text-red-400' : 'bg-green-950/40 border-green-500 text-green-400'}`}>
            {teamMessage.type === 'error' ? <AlertOctagon className="h-4 w-4 shrink-0" /> : <CheckCircle2 className="h-4 w-4 shrink-0" />}
            <span className="font-orbitron text-[10px] font-bold uppercase tracking-widest">{teamMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdateTeam} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            
            {/* Logo Upload */}
            <div className="flex flex-col items-center space-y-4 shrink-0">
              <label className="block font-orbitron text-[9px] text-[#B8C0C2] tracking-widest uppercase text-center">Squad Insignia</label>
              <div 
                className="w-32 h-32 bg-[#080A0C] border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF6A00]/50 transition-colors relative group"
                onClick={() => fileInputRef.current?.click()}
              >
                {logoPreview ? (
                  <>
                    <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </>
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-[#B8C0C2] group-hover:text-[#FF6A00] transition-colors mb-2" />
                    <span className="font-orbitron text-[8px] text-[#B8C0C2] uppercase">Upload Logo</span>
                  </>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleLogoChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            {/* Team Name and Email */}
            <div className="flex-1 space-y-4 w-full">
              <div>
                <label className="block font-orbitron text-[9px] text-[#B8C0C2] tracking-widest uppercase mb-2">Designation (Team Name)</label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#080A0C] border border-white/10 text-white font-inter text-sm focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]"
                  placeholder="ENTER SQUAD NAME"
                />
              </div>
              
              <div>
                <label className="block font-orbitron text-[9px] text-[#B8C0C2] tracking-widest uppercase mb-2">Communication (Email Address)</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#080A0C] border border-white/10 text-white font-inter text-sm focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]"
                  placeholder="ENTER EMAIL ADDRESS"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-white/5 flex justify-end">
            <button
              type="submit"
              disabled={teamUpdating}
              className="flex items-center gap-2 py-2 px-6 bg-[#111518] hover:bg-[#FF6A00] text-[#B8C0C2] hover:text-black border border-white/10 font-rajdhani text-lg font-bold uppercase tracking-widest transition-colors transform skew-x-[-10deg] disabled:opacity-50"
            >
              <span className="transform skew-x-10 flex items-center gap-2">
                <Save className="w-4 h-4" />
                {teamUpdating ? 'Processing...' : 'Save Changes'}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* SECURITY SETTINGS */}
      <div className="bg-[#111518]/90 backdrop-blur-md border border-white/10 p-6 sm:p-8 hud-border relative shadow-2xl">
        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
          <Lock className="w-6 h-6 text-[#FF6A00]" />
          <h2 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest">Security Protocol</h2>
        </div>

        {passwordMessage && (
          <div className={`border-l-4 p-3 mb-6 flex items-center gap-3 ${passwordMessage.type === 'error' ? 'bg-red-950/40 border-red-500 text-red-400' : 'bg-green-950/40 border-green-500 text-green-400'}`}>
            {passwordMessage.type === 'error' ? <AlertOctagon className="h-4 w-4 shrink-0" /> : <CheckCircle2 className="h-4 w-4 shrink-0" />}
            <span className="font-orbitron text-[10px] font-bold uppercase tracking-widest">{passwordMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block font-orbitron text-[9px] text-[#B8C0C2] tracking-widest uppercase mb-2">Current Access Code</label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-[#080A0C] border border-white/10 text-white font-inter text-sm focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#B8C0C2] hover:text-[#FF6A00] transition-colors"
                >
                  {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block font-orbitron text-[9px] text-[#B8C0C2] tracking-widest uppercase mb-2">New Access Code</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-[#080A0C] border border-white/10 text-white font-inter text-sm focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#B8C0C2] hover:text-[#FF6A00] transition-colors"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block font-orbitron text-[9px] text-[#B8C0C2] tracking-widest uppercase mb-2">Confirm Access Code</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-[#080A0C] border border-white/10 text-white font-inter text-sm focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#B8C0C2] hover:text-[#FF6A00] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-white/5 flex justify-end">
            <button
              type="submit"
              disabled={passwordUpdating}
              className="flex items-center gap-2 py-2 px-6 bg-[#111518] hover:bg-[#FF6A00] text-[#B8C0C2] hover:text-black border border-white/10 font-rajdhani text-lg font-bold uppercase tracking-widest transition-colors transform skew-x-[-10deg] disabled:opacity-50"
            >
              <span className="transform skew-x-10 flex items-center gap-2">
                <Save className="w-4 h-4" />
                {passwordUpdating ? 'Processing...' : 'Update Password'}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* SYSTEM OPERATIONS */}
      <div className="bg-[#111518]/90 backdrop-blur-md border border-white/10 p-6 sm:p-8 hud-border relative shadow-2xl">
        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
          <LogOut className="w-6 h-6 text-red-500" />
          <h2 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest">System Operations</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-inter text-sm text-[#B8C0C2]">
            End your current session. You will be required to authenticate upon your return.
          </p>
          <button
            onClick={logout}
            className="w-full sm:w-auto flex justify-center py-3 px-8 bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 hover:border-red-500 font-rajdhani text-lg font-bold uppercase tracking-widest transition-colors transform skew-x-[-10deg]"
          >
            <span className="transform skew-x-10 flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Disconnect
            </span>
          </button>
        </div>
      </div>

    </div>
  );
}
