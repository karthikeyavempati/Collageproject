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
  ShieldCheck,
  Clock,
  Star
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
    <div className="relative min-h-screen pt-24 pb-24 md:pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="absolute inset-0 z-0 bg-blue-50/50" />

      {/* Government Banner Strip */}
      <div className="relative z-10 flex items-center gap-2 mb-6 px-4 py-2 bg-white border border-gray-200 rounded-2xl shadow-sm w-max animate-in fade-in duration-500">
        <span className="text-lg">🇮🇳</span>
        <span className="text-xs font-bold text-blue-900">PM Internship Scheme</span>
        <span className="text-xs text-gray-400">•</span>
        <span className="text-xs text-gray-600">Ministry of Corporate Affairs</span>
        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 border border-green-200 rounded-full text-[10px] font-bold">Active Portal</span>
      </div>

      {/* Welcome Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 tracking-tight mb-1">
            Welcome back, {userName} 🎓
          </h2>
          <p className="text-sm text-gray-600">
            Your live internship search, AI match scores &amp; application tracker.
          </p>
        </div>
        <button
          onClick={onOpenAICoach}
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#005E93] text-white text-xs font-bold hover:bg-[#004A75] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-lg self-start md:self-auto"
        >
          <Bot className="w-4 h-4" />
          <span>Launch AI Match Coach</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Top Bento Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 mb-10 animate-in fade-in duration-500">

        {/* Profile Strength Card */}
        <div className="md:col-span-4 bg-white border border-gray-200 shadow-sm rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Profile Strength</h3>
              <div className="p-2 rounded-xl bg-green-50 border border-green-200">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Your profile is strong. Complete academic document verification to unlock top 1% match scores.
            </p>

            <div className="flex items-center gap-4 mb-5">
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke="#005E93"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={2 * Math.PI * 42 * (1 - 0.85)}
                    style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-black text-blue-900">85%</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block mb-1">Verified Completion</span>
                <span className="text-xs text-gray-600">Academic documents pending</span>
              </div>
            </div>

            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#005E93] rounded-full w-[85%] transition-all duration-700" />
            </div>
          </div>

          <button className="mt-6 w-full py-2.5 rounded-2xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
            Update Academic Documents
          </button>
        </div>

        {/* Top AI Match Card */}
        {topMatchRole && (
          <div className="md:col-span-8 bg-white border border-gray-200 shadow-sm rounded-3xl p-6 md:p-8 flex flex-col md:flex-row relative overflow-hidden">
            {/* Subtle blue accent */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="md:w-3/5 z-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 w-max mb-4">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700">#1 AI System Match</span>
              </div>

              <h3 className="text-2xl font-extrabold text-gray-900 mb-1">{topMatchRole.title}</h3>
              <p className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> {topMatchRole.company} • {topMatchRole.location}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {topMatchRole.tags.map(t => (
                  <span key={t} className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-[11px] font-medium">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onApply(topMatchRole)}
                  disabled={appliedRoleIds.includes(topMatchRole.id)}
                  className="group px-6 py-2.5 rounded-2xl bg-[#005E93] text-white text-xs font-bold hover:bg-[#004A75] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-md flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {appliedRoleIds.includes(topMatchRole.id) ? 'Applied ✓' : 'Instant Apply'}
                  {!appliedRoleIds.includes(topMatchRole.id) && <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />}
                </button>
                <span className="text-sm font-bold text-green-700">{topMatchRole.stipend}</span>
              </div>
            </div>

            <div className="hidden md:flex md:w-2/5 items-center justify-center p-4 z-10">
              <div className="w-full rounded-2xl bg-blue-50 border border-blue-200 p-6 flex flex-col items-center justify-center text-center">
                <div className="text-5xl font-black text-[#005E93] mb-1">98%</div>
                <div className="text-xs uppercase tracking-wider font-bold text-blue-800">Skill Fit Index</div>
                <p className="text-[10px] text-gray-500 mt-2">Verified against Academic Records &amp; AI Portfolio Analysis</p>
              </div>
            </div>
          </div>
        )}

        {/* Verified Skill Mapping */}
        <div className="md:col-span-12 bg-white border border-gray-200 shadow-sm rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-gray-900">Your Verified Skill Mapping</h3>
            <div className="flex items-center gap-1.5 text-[10px] text-green-600 font-bold bg-green-50 border border-green-200 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" /> AI Verified
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <div className="p-3 rounded-xl bg-blue-100 border border-blue-200 text-blue-700 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-0.5">Product &amp; Data Analysis</h4>
                <p className="text-xs text-gray-500">Strong alignment with 80% of open roles in your area.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-purple-50 border border-purple-100">
              <div className="p-3 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-0.5">Cross-functional Comms</h4>
                <p className="text-xs text-gray-500">Highlighted in your recent AI mock interview evaluation.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-green-50 border border-green-100">
              <div className="p-3 rounded-xl bg-green-100 border border-green-200 text-green-700 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-0.5">System Architecture</h4>
                <p className="text-xs text-gray-500">Recommended focus area to unlock tier-1 technical roles.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="relative z-10 flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('openings')}
            className={`text-sm font-bold pb-2 transition-all border-b-2 ${
              activeTab === 'openings'
                ? 'border-[#005E93] text-[#005E93]'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            All Recommended Roles ({internships.length})
          </button>
          <button
            onClick={() => setActiveTab('my-applications')}
            className={`text-sm font-bold pb-2 transition-all border-b-2 ${
              activeTab === 'my-applications'
                ? 'border-[#005E93] text-[#005E93]'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            My Applications ({appliedRoleIds.length})
          </button>
        </div>

        <div className="relative w-64 hidden sm:block">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="relative z-10">
        {activeTab === 'openings' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredInternships.map((role) => {
              const isApplied = appliedRoleIds.includes(role.id);
              return (
                <div
                  key={role.id}
                  className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
                        {role.stipend}
                      </span>
                      {role.matchScore && (
                        <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3" />
                          {role.matchScore}% AI Fit
                        </div>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-gray-900 mb-1">{role.title}</h3>
                    <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" /> {role.company}
                    </p>

                    <p className="text-xs text-gray-600 line-clamp-2 mb-4">{role.description}</p>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {role.tags.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[10px] text-blue-700 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {role.location}
                    </span>
                    <button
                      disabled={isApplied}
                      onClick={() => onApply(role)}
                      className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
                        isApplied
                          ? 'bg-green-50 text-green-700 border border-green-200 flex items-center gap-1 cursor-default'
                          : 'bg-[#005E93] text-white hover:bg-[#004A75] hover:-translate-y-0.5 active:translate-y-0 shadow-sm'
                      }`}
                    >
                      {isApplied ? (
                        <><CheckCircle2 className="w-3.5 h-3.5" /> Applied</>
                      ) : 'Apply Now'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {myAppliedRoles.length === 0 ? (
              <div className="bg-white border border-gray-200 shadow-sm rounded-3xl p-12 text-center">
                <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No Applications Yet</h3>
                <p className="text-xs text-gray-500 mb-6">Browse open roles and apply with 1-click verified credentials.</p>
                <button
                  onClick={() => setActiveTab('openings')}
                  className="px-6 py-2.5 rounded-2xl bg-[#005E93] text-white text-xs font-bold hover:bg-[#004A75] transition-all shadow-md"
                >
                  Browse Openings
                </button>
              </div>
            ) : (
              myAppliedRoles.map((role) => (
                <div
                  key={role.id}
                  className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-all"
                >
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs text-green-700 font-bold bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Submission
                    </div>
                    <h3 className="text-base font-bold text-gray-900">{role.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{role.company} • {role.location}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{role.stipend}</div>
                      <div className="text-[10px] text-gray-500 flex items-center gap-1 justify-end mt-0.5">
                        <Clock className="w-3 h-3" /> Under Review
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700">
                      Active
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
