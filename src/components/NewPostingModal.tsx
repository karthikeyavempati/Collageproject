import React, { useState } from 'react';
import { InternshipRole } from '../types';
import { X, PlusCircle, Building2, MapPin, DollarSign, Tag } from 'lucide-react';

interface NewPostingModalProps {
  onClose: () => void;
  onSubmit: (role: Omit<InternshipRole, 'id' | 'applicantsCount'>) => void;
}

export const NewPostingModal: React.FC<NewPostingModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('Tech Mahindra Business Practice');
  const [location, setLocation] = useState('New Delhi, India (Hybrid)');
  const [type, setType] = useState<'Hybrid' | 'Remote' | 'On-site'>('Hybrid');
  const [stipend, setStipend] = useState('₹22,000 / month');
  const [sector, setSector] = useState('Enterprise Tech');
  const [tagsInput, setTagsInput] = useState('Agile, Product Strategy, Wireframing');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    onSubmit({
      title,
      company,
      location,
      type,
      stipend,
      sector,
      tags,
      description,
      status: 'Open',
      featured: true
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="liquid-glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-xl w-full border border-white/20 shadow-2xl relative my-4 sm:my-8">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-300 text-xs font-bold mb-2">
            <Building2 className="w-3.5 h-3.5" /> Tech Mahindra Employer Portal
          </div>
          <h2 className="text-2xl font-black text-white">Create New Internships Posting</h2>
          <p className="text-xs text-neutral-400 mt-0.5">Post verified enterprise service internship roles to over 1.2M candidates.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">Role Title</label>
            <input
              type="text"
              required
              placeholder="e.g. AI Systems & Business Fellow"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">Partner Unit</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">Location & Mode</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">Monthly Stipend</label>
              <input
                type="text"
                required
                value={stipend}
                onChange={(e) => setStipend(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">Sector</label>
              <input
                type="text"
                required
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
              Required Tags (Comma Separated)
            </label>
            <input
              type="text"
              required
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">Role Description</label>
            <textarea
              rows={3}
              required
              placeholder="Outline role objectives, deliverables, and enterprise impact..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-white/40"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10">
            <button
              type="submit"
              className="liquid-button rounded-full px-8 py-3 text-xs font-bold text-white flex items-center gap-2"
            >
              Publish Posting Live <PlusCircle className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
