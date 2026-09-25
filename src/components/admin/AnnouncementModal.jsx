import { useState } from 'react';

export default function AnnouncementModal({ isOpen, onClose, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#111518] border border-white/10 p-6 w-full max-w-lg">
        <h2 className="text-white font-bold font-rajdhani text-2xl uppercase tracking-widest mb-4">Create Broadcast</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          onSubmit(Object.fromEntries(formData));
        }}>
          <div className="space-y-4">
            <div>
              <label className="text-[#B8C0C2] text-xs uppercase mb-1 block">Title</label>
              <input type="text" name="title" required className="w-full bg-[#080A0C] border border-white/10 px-4 py-2 text-white" />
            </div>
            <div>
              <label className="text-[#B8C0C2] text-xs uppercase mb-1 block">Content</label>
              <textarea name="content" required className="w-full bg-[#080A0C] border border-white/10 px-4 py-2 text-white" rows="4"></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#B8C0C2] text-xs uppercase mb-1 block">Category</label>
                <select name="category" required className="w-full bg-[#080A0C] border border-white/10 px-4 py-2 text-white">
                  <option value="GENERAL">General</option>
                  <option value="MATCH">Match Update</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <div>
                <label className="text-[#B8C0C2] text-xs uppercase mb-1 block">Importance</label>
                <select name="importance" required className="w-full bg-[#080A0C] border border-white/10 px-4 py-2 text-white">
                  <option value="LOW">Low</option>
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="text-[#B8C0C2] hover:text-white uppercase text-sm font-bold">Cancel</button>
            <button type="submit" className="bg-[#FF6A00] text-black font-bold uppercase tracking-widest px-6 py-2">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
