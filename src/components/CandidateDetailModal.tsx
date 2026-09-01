import React from 'react';
import { Candidate } from '../types';
import { X, Sparkles, CheckCircle2, UserCheck, Mail, Phone, GraduationCap, Award } from 'lucide-react';

interface CandidateDetailModalProps {
  candidate: Candidate | null;
  onClose: () => void;
  onStatusChange: (candidateId: string, status: Candidate['status']) => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  onClose,
  onStatusChange
}) => {
  if (!candidate) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="liquid-glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-2xl w-full border border-white/20 shadow-2xl relative my-4 sm:my-8">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Candidate Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xl font-bold text-white">
            {candidate.avatarInitials}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full glass-level-2 text-xs font-bold text-sky-300 border border-sky-400/30 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{candidate.aiMatchScore}% Merit Match</span>
            </div>
            <h2 className="text-2xl font-black text-white">{candidate.name}</h2>
            <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
              <GraduationCap className="w-3.5 h-3.5" /> {candidate.university} • {candidate.roleFocus}
            </p>
          </div>
        </div>

        {/* Summary Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">Academic & Project Summary</h4>
          <p className="text-xs text-neutral-200 leading-relaxed">{candidate.summary}</p>
        </div>

        {/* Skills Tag Cloud */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Verified Skill Tags</h4>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map(s => (
              <span key={s} className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-white border border-white/15">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 mb-8">
          <div className="flex items-center gap-2 text-xs text-neutral-300">
            <Mail className="w-4 h-4 text-neutral-400" />
            <span>{candidate.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-300">
            <Phone className="w-4 h-4 text-neutral-400" />
            <span>{candidate.phone}</span>
          </div>
        </div>

        {/* Candidate Actions */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-neutral-400">Current Status: <strong className="text-white">{candidate.status}</strong></span>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={() => onStatusChange(candidate.id, 'Shortlisted')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                candidate.status === 'Shortlisted'
                  ? 'bg-sky-500 text-white'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-400/30 hover:bg-sky-500/30'
              }`}
            >
              Shortlist
            </button>

            <button
              onClick={() => onStatusChange(candidate.id, 'Interviewed')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                candidate.status === 'Interviewed'
                  ? 'bg-purple-500 text-white'
                  : 'bg-purple-500/20 text-purple-300 border border-purple-400/30 hover:bg-purple-500/30'
              }`}
            >
              Schedule Interview
            </button>

            <button
              onClick={() => onStatusChange(candidate.id, 'Offered')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                candidate.status === 'Offered'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30'
              }`}
            >
              Extend Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
