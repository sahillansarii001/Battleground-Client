"use client";
import { Megaphone, Plus } from 'lucide-react';

export default function AdminAnnouncements() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111518]/90 border border-white/10 p-6">
        <div>
          <h2 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
            <Megaphone className="w-6 h-6 text-[#FF6A00]" />
            Intel Broadcasts
          </h2>
          <p className="font-inter text-xs text-[#B8C0C2] mt-1">Manage tournament announcements and system alerts.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#FF6A00] hover:bg-white text-black font-rajdhani font-bold text-lg px-6 py-2 uppercase tracking-widest transition-colors transform skew-x-[-10deg]">
          <span className="transform skew-x-10 flex items-center gap-2">
            <Plus className="w-5 h-5" /> New Broadcast
          </span>
        </button>
      </div>

      <div className="bg-[#111518]/90 border border-white/10 p-8">
        <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Recent Broadcasts</h3>
        <div className="space-y-4">
          <div className="bg-[#080A0C] border border-white/5 p-4 border-l-2 border-[#FF6A00] flex justify-between items-start">
            <div>
              <p className="font-orbitron text-[9px] text-[#FF6A00] uppercase mb-1">GLOBAL ALERT</p>
              <h4 className="font-rajdhani text-lg font-bold text-white uppercase">Registrations are now open</h4>
              <p className="font-inter text-sm text-[#B8C0C2] mt-1">Welcome to the Season 1 Battlegrounds. Secure your squad's slot immediately.</p>
            </div>
            <div className="flex gap-3 font-orbitron text-[9px] text-[#B8C0C2] uppercase">
              <button className="hover:text-white">Edit</button>
              <button className="hover:text-red-500">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}