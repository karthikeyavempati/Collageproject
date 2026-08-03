import React, { useState } from 'react';
import { InternshipRole } from '../types';
import { 
  TrendingUp, 
  Sparkles, 
  Search, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Bot, 
  FileText, 
  Award, 
  ArrowRight,
  SlidersHorizontal
} from 'lucide-react';

interface StudentDashboardProps {
  internships: InternshipRole[];
  appliedRoleIds: string[];
  onApply: (role: InternshipRole) => void;
  onOpenAICoach: () => void;
  userName?: string;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  internships,
  appliedRoleIds,
  onApply,
  onOpenAICoach,
  userName = "Alex"
}) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'openings' | 'my-applications'>('openings');

  const topMatchRole = internships[0];

  const filteredInternships = internships.filter(role => 
    role.title.toLowerCase().includes(search.toLowerCase()) ||
    role.company.toLowerCase().includes(search.toLowerCase()) ||
    role.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const myAppliedRoles = internships.filter(role => appliedRoleIds.includes(role.id));

  return (
    <div className="relative min-h-screen bg-black text-white pt-24 pb-24 md:pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="cinematic-header-bg" />
      {/* Welcome Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
            Welcome back, {userName}.
          </h2>
          <p className="text-neutral-400 text-sm md:text-base">
            Here is your live PM Internship Scheme search, profile matching score, and AI coaching progress.
          </p>
        </div>

        <button
          onClick={onOpenAICoach}
          className="liquid-button rounded-full px-5 py-2.5 text-xs font-bold text-sky-300 flex items-center gap-2 self-start md:self-auto border border-sky-400/30 hover:text-white"
        >
          <Bot className="w-4 h-4 text-sky-400" />
          <span>Launch AI Match Coach</span>
        </button>
      </div>

      {/* Top Bento Widgets Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
        {/* Profile Strength Widget */}
        <div className="md:col-span-4 glass-panel rounded-3xl p-6 flex flex-col justify-between border border-white/10">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Profile Strength</h3>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
              Your profile verification level is looking strong. Complete university document validation to unlock top 1% match scores.
            </p>

            <div className="flex items-center gap-6 mb-6">
              <div className="relative w-24 h-24 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke="#34d399"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={2 * Math.PI * 42 * (1 - 0.85)}
                    style={{ filter: 'drop-shadow(0 0 6px rgba(52,211,153,0.6))', transition: 'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black text-white">85%</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block mb-1">
                  Verified Completion
                </span>
                <span className="text-xs text-neutral-300">Academic documents pending</span>
              </div>
            </div>

            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full w-[85%] shadow-[0_0_12px_rgba(52,211,153,0.5)]" />
            </div>
          </div>

          <button className="mt-8 w-full py-3 rounded-full border border-white/20 text-xs font-bold text-white uppercase tracking-wider hover:bg-white/10 transition-colors">
            Update Academic Documents
          </button>
        </div>

        {/* Top Match Widget */}
        {topMatchRole && (
          <div className="md:col-span-8 glass-panel rounded-3xl p-6 md:p-8 flex flex-col md:flex-row relative overflow-hidden border border-white/10">
            <div className="md:w-3/5 z-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 w-max mb-4 border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
                  #1 AI System Match
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-white mb-1">
                {topMatchRole.title}
              </h3>
              <p className="text-xs text-neutral-400 mb-4 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-neutral-500" /> {topMatchRole.company} • {topMatchRole.location}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {topMatchRole.tags.map(t => (
                  <span key={t} className="bg-white/10 text-white px-2.5 py-1 rounded-full text-[11px] font-medium">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onApply(topMatchRole)}
                  className="liquid-button rounded-full px-6 py-2.5 text-xs font-bold text-white flex items-center gap-2"
                >
                  {appliedRoleIds.includes(topMatchRole.id) ? 'Applied' : 'Instant Apply'} <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold text-emerald-400">{topMatchRole.stipend}</span>
              </div>
            </div>

            <div className="hidden md:flex md:w-2/5 items-center justify-center p-4 z-10">
              <div className="w-full h-full rounded-2xl glass-level-2 border border-white/20 p-6 flex flex-col items-center justify-center text-center">
                <div className="text-5xl font-black text-sky-400 mb-1">98%</div>
                <div className="text-xs uppercase tracking-wider font-bold text-neutral-300">Skill Fit Index</div>
                <p className="text-[10px] text-neutral-400 mt-2">Verified against Academic Records & AI Portfolio Analysis</p>
              </div>
            </div>
          </div>
        )}

        {/* Key Skills Mapped Widget */}
        <div className="md:col-span-12 glass-panel rounded-3xl p-6 md:p-8 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-6">Your Verified Skill Mapping</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">Product & Data Analysis</h4>
                <p className="text-xs text-neutral-400">Strong alignment with 80% of open roles in your area.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-400/20 text-purple-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">Cross-functional Comms</h4>
                <p className="text-xs text-neutral-400">Highlighted in your recent AI mock interview evaluation.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">System Architecture</h4>
                <p className="text-xs text-neutral-400">Recommended focus area to unlock tier-1 technical roles.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('openings')}
            className={`text-sm font-bold pb-2 transition-all border-b-2 ${
              activeTab === 'openings'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            All Recommended Roles ({internships.length})
          </button>
          <button
            onClick={() => setActiveTab('my-applications')}
            className={`text-sm font-bold pb-2 transition-all border-b-2 ${
              activeTab === 'my-applications'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            My Applications ({appliedRoleIds.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-64 hidden sm:block">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
          />
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'openings' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInternships.map((role) => {
            const isApplied = appliedRoleIds.includes(role.id);

            return (
              <div
                key={role.id}
                className="glass-panel rounded-2xl p-6 flex flex-col justify-between border border-white/10 hover:border-white/25 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/20">
                      {role.stipend}
                    </span>
                    {role.matchScore && (
                      <span className="text-xs font-semibold text-sky-300">
                        {role.matchScore}% AI Fit
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">{role.title}</h3>
                  <p className="text-xs text-neutral-400 mb-3 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" /> {role.company}
                  </p>

                  <p className="text-xs text-neutral-300 line-clamp-2 mb-4">
                    {role.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {role.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-neutral-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {role.location}
                  </span>

                  <button
                    disabled={isApplied}
                    onClick={() => onApply(role)}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                      isApplied
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1 cursor-default'
                        : 'liquid-button text-white'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                      </>
                    ) : (
                      'Apply Now'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {myAppliedRoles.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center border border-white/10">
              <FileText className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No Applications Submitted Yet</h3>
              <p className="text-xs text-neutral-400 mb-6">Browse open roles and apply with 1-click verified credentials.</p>
              <button
                onClick={() => setActiveTab('openings')}
                className="liquid-button rounded-full px-6 py-2.5 text-xs font-bold text-white"
              >
                Browse Openings
              </button>
            </div>
          ) : (
            myAppliedRoles.map((role) => (
              <div
                key={role.id}
                className="glass-panel rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-white/10"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/20 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Submission
                  </div>
                  <h3 className="text-lg font-bold text-white">{role.title}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{role.company} • {role.location}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-white">{role.stipend}</div>
                    <div className="text-[10px] text-neutral-400">Status: Under Review</div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-neutral-200">
                    Active
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
