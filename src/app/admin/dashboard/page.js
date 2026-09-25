"use client";
import { Users, AlertOctagon, CheckCircle, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* System Status */}
      <div className="bg-[#111518]/90 border border-white/10 p-5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between hud-border relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6A00]"></div>
        <div>
          <h2 className="font-rajdhani text-2xl sm:text-3xl font-bold text-white uppercase tracking-widest flex items-center gap-2 sm:gap-3">
            <ShieldAlert className="w-6 h-6 sm:w-8 sm:h-8 text-[#FF6A00]" />
            Global Overwatch
          </h2>
          <p className="font-inter text-xs sm:text-sm text-[#B8C0C2] mt-2 sm:mt-1 ml-8 sm:ml-11">Tournament Management System Online.</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#111518]/90 border border-white/10 p-5 sm:p-6 flex flex-col items-center text-center group hover:border-[#FF6A00]/50 transition-colors">
          <div className="w-12 h-12 bg-[#080A0C] border border-[#FF6A00]/30 flex items-center justify-center transform skew-x-[-10deg] mb-4 group-hover:bg-[#FF6A00]/10">
            <Users className="w-6 h-6 text-[#FF6A00] transform skew-x-10" />
          </div>
          <span className="font-orbitron text-[9px] text-[#B8C0C2] uppercase tracking-widest mb-1">Total Squads</span>
          <span className="font-rajdhani text-4xl font-bold text-white">42</span>
        </div>
        
        <div className="bg-[#111518]/90 border border-white/10 p-5 sm:p-6 flex flex-col items-center text-center group hover:border-yellow-500/50 transition-colors relative overflow-hidden">
          <div className="w-12 h-12 bg-[#080A0C] border border-yellow-500/30 flex items-center justify-center transform skew-x-[-10deg] mb-4 group-hover:bg-yellow-500/10">
            <AlertOctagon className="w-6 h-6 text-yellow-500 transform skew-x-10" />
          </div>
          <span className="font-orbitron text-[9px] text-[#B8C0C2] uppercase tracking-widest mb-1">Pending Approval</span>
          <span className="font-rajdhani text-4xl font-bold text-yellow-500">7</span>
        </div>

        <div className="bg-[#111518]/90 border border-white/10 p-5 sm:p-6 flex flex-col items-center text-center group hover:border-[#39B54A]/50 transition-colors">
          <div className="w-12 h-12 bg-[#080A0C] border border-[#39B54A]/30 flex items-center justify-center transform skew-x-[-10deg] mb-4 group-hover:bg-[#39B54A]/10">
            <CheckCircle className="w-6 h-6 text-[#39B54A] transform skew-x-10" />
          </div>
          <span className="font-orbitron text-[9px] text-[#B8C0C2] uppercase tracking-widest mb-1">Approved Squads</span>
          <span className="font-rajdhani text-4xl font-bold text-[#39B54A]">35</span>
        </div>

        <div className="bg-[#111518]/90 border border-white/10 p-5 sm:p-6 flex flex-col items-center text-center group hover:border-[#FF6A00]/50 transition-colors">
          <div className="w-12 h-12 bg-[#080A0C] border border-[#FF6A00]/30 flex items-center justify-center transform skew-x-[-10deg] mb-4 group-hover:bg-[#FF6A00]/10">
            <ShieldAlert className="w-6 h-6 text-[#FF6A00] transform skew-x-10" />
          </div>
          <span className="font-orbitron text-[9px] text-[#B8C0C2] uppercase tracking-widest mb-1">Active Matches</span>
          <span className="font-rajdhani text-4xl font-bold text-white">0</span>
        </div>
      </div>
      
      {/* Activity Log Placeholder */}
      <div className="bg-[#111518]/90 border border-white/10 p-5 sm:p-6">
        <h3 className="font-rajdhani text-lg sm:text-xl font-bold text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Recent System Activity</h3>
        <div className="space-y-2">
          <div className="bg-[#080A0C] border p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between border-l-2 border-yellow-500 gap-2 sm:gap-0">
            <div>
              <p className="font-rajdhani text-sm font-bold text-white uppercase">New Registration</p>
              <p className="font-inter text-xs text-[#B8C0C2]">Squad 'TEAM SOUL' submitted intel.</p>
            </div>
            <span className="font-orbitron text-[8px] text-[#B8C0C2] uppercase">10 MIN AGO</span>
          </div>
        </div>
      </div>
    </div>
  );
}