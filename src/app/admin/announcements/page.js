"use client";
import { useState, useEffect } from 'react';
import { Megaphone, Plus, Send } from 'lucide-react';
import api from '@/lib/api';
import AnnouncementModal from '@/components/admin/AnnouncementModal';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/announcements');
      if (res.success) {
        setAnnouncements(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch announcements', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (data) => {
    try {
      const res = await api.post('/announcements', data);
      if (res.success) {
        setIsModalOpen(false);
        fetchAnnouncements();
      }
    } catch (error) {
      console.error('Failed to create announcement', error);
    }
  };

  const publishAnnouncement = async (id) => {
    try {
      await api.put(`/announcements/${id}/publish`);
      fetchAnnouncements();
    } catch (error) {
      console.error('Failed to publish', error);
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      if (!window.confirm("Delete this broadcast?")) return;
      await api.delete(`/announcements/${id}`);
      fetchAnnouncements();
    } catch (error) {
      console.error('Failed to delete', error);
      alert(error.response?.data?.message || 'Failed to delete');
    }
  };

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
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#FF6A00] hover:bg-white text-black font-rajdhani font-bold text-lg px-6 py-2 uppercase tracking-widest transition-colors transform skew-x-[-10deg]"
        >
          <span className="transform skew-x-10 flex items-center gap-2">
            <Plus className="w-5 h-5" /> New Broadcast
          </span>
        </button>
      </div>

      <div className="bg-[#111518]/90 border border-white/10 p-8">
        <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Recent Broadcasts</h3>
        
        {loading ? (
          <div className="text-white text-center py-4">Loading...</div>
        ) : announcements.length === 0 ? (
          <div className="text-[#B8C0C2] text-center py-4">No broadcasts found.</div>
        ) : (
          <div className="space-y-4">
            {announcements.map((ann) => (
              <div key={ann._id} className={`bg-[#080A0C] border border-white/5 p-4 border-l-2 flex flex-col md:flex-row justify-between items-start gap-4 ${ann.status === 'PUBLISHED' ? 'border-l-[#FF6A00]' : 'border-l-gray-600'}`}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`font-orbitron text-[9px] uppercase ${ann.importance === 'CRITICAL' ? 'text-red-500' : 'text-[#FF6A00]'}`}>
                      {ann.category} ALERT
                    </p>
                    <span className="text-[9px] text-[#B8C0C2] uppercase font-bold px-2 py-0.5 bg-white/10">{ann.status}</span>
                  </div>
                  <h4 className="font-rajdhani text-lg font-bold text-white uppercase">{ann.title}</h4>
                  <p className="font-inter text-sm text-[#B8C0C2] mt-1">{ann.content}</p>
                </div>
                <div className="flex gap-3 font-orbitron text-[9px] text-[#B8C0C2] uppercase">
                  {ann.status === 'DRAFT' && (
                    <button onClick={() => publishAnnouncement(ann._id)} className="flex items-center gap-1 text-[#FF6A00] hover:text-white">
                      <Send className="w-3 h-3" /> Publish
                    </button>
                  )}
                  <button onClick={() => deleteAnnouncement(ann._id)} className="hover:text-red-500">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnnouncementModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateAnnouncement}
      />
    </div>
  );
}
