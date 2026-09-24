"use client";
import { Settings, Shield, Server, Link as LinkIcon, Save, Loader2, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AdminSettings() {
  const [communityLink, setCommunityLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/admin/settings');
        if (response.success && response.data) {
          setCommunityLink(response.data.communityLink || '');
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await api.put('/admin/settings', { communityLink });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
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
            System Configuration
          </h2>
          <p className="font-inter text-xs text-[#B8C0C2] mt-1">Manage global tournament parameters and access controls.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Community & Connections */}
        <div className="bg-[#111518]/90 border border-white/10 p-6 md:col-span-2">
          <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-widest mb-4 flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-[#FF6A00]" />
              Community Links
            </div>
            {saveSuccess && (
              <span className="flex items-center gap-1 text-[#39B54A] font-orbitron text-[10px] uppercase">
                <CheckCircle className="w-3 h-3" /> Saved
              </span>
            )}
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
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#FF6A00] hover:bg-white text-black font-rajdhani font-bold px-6 uppercase tracking-widest transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform skew-x-[-10deg]"
                >
                  <div className="transform skew-x-10 flex items-center gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tournament Config */}
        <div className="bg-[#111518]/90 border border-white/10 p-6">
          <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
            <Server className="w-5 h-5 text-[#FF6A00]" />
            Tournament Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-orbitron text-[10px] text-[#B8C0C2] uppercase tracking-widest">Registration Status</span>
              <button className="bg-[#39B54A]/20 border border-[#39B54A]/50 text-[#39B54A] font-rajdhani font-bold px-3 py-1 uppercase text-sm">Open</button>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-orbitron text-[10px] text-[#B8C0C2] uppercase tracking-widest">Max Squads</span>
              <input type="number" defaultValue={100} className="w-20 bg-[#080A0C] border border-white/10 text-white text-center font-rajdhani font-bold px-2 py-1 focus:border-[#FF6A00] focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-[#111518]/90 border border-white/10 p-6">
          <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
            <Shield className="w-5 h-5 text-[#FF6A00]" />
            Access Security
          </h3>
          <div className="space-y-4">
            <button className="w-full bg-[#080A0C] border border-white/10 text-[#B8C0C2] hover:text-white hover:border-white/30 font-orbitron text-[10px] uppercase tracking-widest py-3 transition-colors">
              Reset Admin Credentials
            </button>
            <button className="w-full bg-red-950/20 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white font-orbitron text-[10px] uppercase tracking-widest py-3 transition-colors">
              Force Disconnect All Squads
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}