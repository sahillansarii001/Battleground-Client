"use client";
import { useState, useEffect } from 'react';
import { BookOpen, Edit, Save, Upload, Trash2, X } from 'lucide-react';
import api from '@/lib/api';
import ActionModal from '@/components/admin/ActionModal';

export default function AdminRules() {
  const [rulebooks, setRulebooks] = useState([]);
  const [currentRulebook, setCurrentRulebook] = useState(null);
  
  // Editor state
  const [title, setTitle] = useState('');
  const [version, setVersion] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [actionModal, setActionModal] = useState({ isOpen: false });

  useEffect(() => {
    fetchRulebooks();
  }, []);

  const fetchRulebooks = async () => {
    try {
      const res = await api.get('/rules');
      if (res?.success) {
        const data = res.data || [];
        setRulebooks(data);
        const published = data.find(r => r.status === 'PUBLISHED');
        if (published) {
          setCurrentRulebook(published);
          setTitle(published.title || '');
          setVersion(published.version || '');
          setContent(published.content || '');
        }
      }
    } catch (error) {
      console.error("Failed to fetch rulebooks:", error?.message || error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!title || !version || !content) {
      setActionModal({ isOpen: true, isAlert: true, title: 'Error', message: 'Please fill in all fields (Title, Version, and Content) before saving.', confirmText: 'OK', onConfirm: () => setActionModal({ isOpen: false }) });
      return;
    }
    try {
      if (editingId) {
        await api.put(`/rules/${editingId}`, { title, version, content });
        setActionModal({ isOpen: true, isAlert: true, title: 'Success', message: 'Rulebook updated!', confirmText: 'OK', onConfirm: () => setActionModal({ isOpen: false }) });
      } else {
        await api.post('/rules', { title, version, content });
        setActionModal({ isOpen: true, isAlert: true, title: 'Success', message: 'Rulebook draft saved!', confirmText: 'OK', onConfirm: () => setActionModal({ isOpen: false }) });
      }
      setEditingId(null);
      setTitle('');
      setVersion('');
      setContent('');
      fetchRulebooks();
    } catch (error) {
      setActionModal({ isOpen: true, isAlert: true, title: 'Error', message: error?.message || "Failed to save draft", confirmText: 'OK', onConfirm: () => setActionModal({ isOpen: false }) });
      console.error(error?.message || error);
    }
  };

  const handleEdit = (rulebook) => {
    setEditingId(rulebook._id);
    setTitle(rulebook.title);
    setVersion(rulebook.version);
    setContent(rulebook.content);
  };

  const handleDelete = async (id) => {
    setActionModal({
      isOpen: true,
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this rulebook?',
      confirmText: 'Delete',
      isDanger: true,
      onConfirm: async () => {
        try {
          await api.delete(`/rules/${id}`);
          if (editingId === id) {
            setEditingId(null);
            setTitle('');
            setVersion('');
            setContent('');
          }
          fetchRulebooks();
          setActionModal({ isOpen: false });
        } catch (error) {
          setActionModal({ isOpen: true, isAlert: true, title: 'Error', message: error?.message || "Failed to delete rulebook", confirmText: 'OK', onConfirm: () => setActionModal({ isOpen: false }) });
        }
      }
    });
  };

  const handlePublish = async (id) => {
    try {
      await api.put(`/rules/${id}/publish`);
      setActionModal({ isOpen: true, isAlert: true, title: 'Success', message: 'Rulebook published globally!', confirmText: 'OK', onConfirm: () => setActionModal({ isOpen: false }) });
      fetchRulebooks();
    } catch (error) {
      setActionModal({ isOpen: true, isAlert: true, title: 'Error', message: error?.message || "Failed to publish rulebook", confirmText: 'OK', onConfirm: () => setActionModal({ isOpen: false }) });
      console.error(error?.message || error);
    }
  };

  if (loading) return <div className="p-10 text-white">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111518]/90 border border-white/10 p-6">
        <div>
          <h2 className="font-rajdhani text-2xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-[#FF6A00]" />
            Rulebook Editor
          </h2>
          <p className="font-inter text-xs text-[#B8C0C2] mt-1">Modify the Standard Operating Procedures.</p>
        </div>
        <div className="flex gap-2">
          {editingId && (
            <button 
              onClick={() => {
                setEditingId(null);
                setTitle('');
                setVersion('');
                setContent('');
              }}
              className="flex items-center gap-2 bg-[#1A2023] border border-white/10 hover:border-white/30 text-[#B8C0C2] font-rajdhani font-bold text-lg px-6 py-2 uppercase tracking-widest transition-colors transform skew-x-[-10deg]"
            >
              <span className="transform skew-x-10 flex items-center gap-2">
                <X className="w-5 h-5" /> Cancel
              </span>
            </button>
          )}
          <button 
            onClick={handleSaveDraft}
            className="flex items-center gap-2 bg-[#1A2023] border border-white/10 hover:border-[#FF6A00] text-white font-rajdhani font-bold text-lg px-6 py-2 uppercase tracking-widest transition-colors transform skew-x-[-10deg]"
          >
            <span className="transform skew-x-10 flex items-center gap-2">
              <Save className="w-5 h-5" /> {editingId ? 'Update Draft' : 'Save Draft'}
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111518]/90 border border-white/10 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#B8C0C2] text-xs uppercase mb-1 block">Document Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. BATTLEGROUNDS Official Rulebook"
                className="w-full bg-[#080A0C] border border-white/10 px-4 py-2 text-white" 
              />
            </div>
            <div>
              <label className="text-[#B8C0C2] text-xs uppercase mb-1 block">Version</label>
              <input 
                type="text" 
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="e.g. 1.0.0"
                className="w-full bg-[#080A0C] border border-white/10 px-4 py-2 text-white" 
              />
            </div>
          </div>
          <div>
            <label className="text-[#B8C0C2] text-xs uppercase mb-1 block">Markdown Content</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#080A0C] border border-white/10 px-4 py-4 text-white font-mono text-sm h-125"
              placeholder="# Official Rules..."
            ></textarea>
          </div>
        </div>

        <div className="bg-[#111518]/90 border border-white/10 p-6">
          <h3 className="font-rajdhani text-xl font-bold text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Version History</h3>
          <div className="space-y-4">
            {rulebooks.map(rulebook => (
              <div key={rulebook._id} className={`bg-[#080A0C] border p-4 ${rulebook.status === 'PUBLISHED' ? 'border-[#39B54A]' : 'border-white/10'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className={`text-[9px] font-bold font-orbitron uppercase tracking-widest px-2 py-1 ${rulebook.status === 'PUBLISHED' ? 'bg-[#39B54A]/20 text-[#39B54A]' : 'bg-white/10 text-[#B8C0C2]'}`}>
                      {rulebook.status}
                    </span>
                    <h4 className="font-rajdhani text-lg font-bold text-white mt-1 uppercase">{rulebook.title || 'Untitled'} v{rulebook.version}</h4>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(rulebook)} className="text-[#B8C0C2] hover:text-white transition-colors" title="Edit Rulebook">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(rulebook._id)} className="text-red-500/70 hover:text-red-500 transition-colors" title="Delete Rulebook">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-[#B8C0C2] font-inter mb-4">
                  Created: {new Date(rulebook.createdAt).toLocaleDateString()}
                </div>
                {rulebook.status === 'DRAFT' && (
                  <button 
                    onClick={() => handlePublish(rulebook._id)}
                    className="w-full bg-[#FF6A00] text-black font-rajdhani font-bold py-2 uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" /> Publish
                  </button>
                )}
              </div>
            ))}
            {rulebooks.length === 0 && (
              <div className="text-[#B8C0C2] text-center text-sm py-4">No drafts found.</div>
            )}
          </div>
        </div>
      </div>
      
      {actionModal.isOpen && (
        <ActionModal
          isOpen={actionModal.isOpen}
          onClose={() => setActionModal({ isOpen: false })}
          title={actionModal.title}
          message={actionModal.message}
          confirmText={actionModal.confirmText}
          isDanger={actionModal.isDanger}
          onConfirm={actionModal.onConfirm}
          isAlert={actionModal.isAlert}
        />
      )}
    </div>
  );
}
