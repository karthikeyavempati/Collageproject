import React, { useState } from 'react';
import { InternshipRole, ApplicationFormData } from '../types';
import { X, CheckCircle2, ShieldCheck, ArrowRight, User, GraduationCap, FileText } from 'lucide-react';

interface ApplicationModalProps {
  role: InternshipRole | null;
  onClose: () => void;
  onSubmit: (formData: ApplicationFormData) => void;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({ role, onClose, onSubmit }) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<ApplicationFormData>({
    internshipId: role?.id || '',
    fullName: 'Alex Morgan',
    email: 'alex.morgan@university.edu',
    phone: '+91 98765 12345',
    university: 'Delhi Technological University',
    degree: 'B.Tech in Computer Science / Product Engineering',
    graduationYear: '2025',
    sop: 'Passionate about leveraging digital infrastructure and product design principles for enterprise welfare programs.',
    skills: role?.tags || ['Figma', 'Product Strategy', 'System Architecture']
  });

  if (!role) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="liquid-glass rounded-3xl p-6 md:p-8 max-w-xl w-full border border-white/20 shadow-2xl relative my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> PM Internship Official Gateway
          </div>
          <h2 className="text-2xl font-black text-white">{role.title}</h2>
          <p className="text-xs text-neutral-400 mt-0.5">{role.company} • {role.stipend}</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8 text-xs font-semibold text-neutral-400 border-b border-white/10 pb-4">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-white font-bold' : ''}`}>
            <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">1</span>
            <span>Personal Details</span>
          </div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-white font-bold' : ''}`}>
            <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">2</span>
            <span>SOP & Skills</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">University / Institute</label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="liquid-button rounded-full px-6 py-2.5 text-xs font-bold text-white flex items-center gap-2"
                >
                  Continue to SOP <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                  Statement of Purpose (SOP)
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.sop}
                  onChange={(e) => setFormData({ ...formData, sop: e.target.value })}
                  placeholder="Explain why you want to serve in this enterprise scheme role..."
                  className="w-full bg-white/5 border border-white/15 rounded-xl p-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  Matching Skill Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-white border border-white/20">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Back
                </button>

                <button
                  type="submit"
                  className="liquid-button rounded-full px-8 py-3 text-xs font-bold text-white flex items-center gap-2"
                >
                  Confirm & Submit Application <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
