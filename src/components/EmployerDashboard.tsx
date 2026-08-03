import React, { useState } from 'react';
import { Candidate, InternshipRole } from '../types';
import { 
  Users, 
  TrendingUp, 
  PlusCircle, 
  Sparkles, 
  ArrowRight, 
  MoreHorizontal, 
  Filter, 
  CheckCircle2, 
  Search,
  Building2,
  ChevronRight
} from 'lucide-react';

interface EmployerDashboardProps {
  candidates: Candidate[];
  postings: InternshipRole[];
  onOpenNewPosting: () => void;
  onSelectCandidate: (candidate: Candidate) => void;
  onCandidateStatusChange: (candidateId: string, status: Candidate['status']) => void;
  companyName?: string;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({
  candidates,
  postings,
  onOpenNewPosting,
  onSelectCandidate,
  onCandidateStatusChange,
  companyName = "Tech Mahindra"
}) => {
  const [candidateFilter, setCandidateFilter] = useState<string>('All');
  const [searchCandidate, setSearchCandidate] = useState<string>('');

  const filteredCandidates = candidates.filter(c => {
    const matchesFilter = candidateFilter === 'All' || c.status === candidateFilter;
    const matchesSearch = c.name.toLowerCase().includes(searchCandidate.toLowerCase()) ||
                          c.university.toLowerCase().includes(searchCandidate.toLowerCase()) ||
                          c.roleFocus.toLowerCase().includes(searchCandidate.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalApplied = 842;
  const totalShortlisted = 315;
  const totalInterviewed = 84;
  const totalOffered = 12;

  return (
    <div className="relative min-h-screen bg-black text-white pt-24 pb-24 md:pb-16 px-4 md:px-8 md:ml-64 max-w-7xl">
      <div className="cinematic-header-bg" />
      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest font-bold text-neutral-400 mb-1 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-400" /> {companyName} Employer Portal
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Employer Overview
          </h2>
          <p className="text-xs md:text-sm text-neutral-400 mt-1">
            Real-time candidate AI matching insights for active PM Internship postings.
          </p>
        </div>

        <button
          onClick={onOpenNewPosting}
          className="liquid-button rounded-full px-6 py-3 text-xs font-bold text-white flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-white" />
          <span>Post New PM Role</span>
        </button>
      </div>

      {/* Bento Grid Metrics */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
        {/* Metric 1: Total Applicants */}
        <div className="md:col-span-4 glass-panel rounded-3xl p-6 flex flex-col justify-between border border-white/10 hover:border-white/20 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Total Applicants</span>
              <Users className="w-5 h-5 text-neutral-400" />
            </div>
            <div className="text-5xl font-black text-white tracking-tight">{totalApplied}</div>
          </div>
          <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-bold">+12% from last week</span>
          </div>
        </div>

        {/* Metric 2: Recruitment Funnel */}
        <div className="md:col-span-8 glass-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Recruitment Funnel Overview
            </span>
            <MoreHorizontal className="w-5 h-5 text-neutral-400 cursor-pointer hover:text-white" />
          </div>

          <div className="space-y-3.5">
            {/* Stage 1 */}
            <div className="flex items-center gap-4">
              <div className="w-24 text-right text-xs font-semibold text-neutral-400">Applied</div>
              <div className="flex-1 h-10 bg-white/5 rounded-r-full overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full bg-white/20 w-full rounded-r-full" />
                <div className="absolute inset-y-0 right-4 flex items-center text-xs font-bold text-white">
                  {totalApplied}
                </div>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="flex items-center gap-4">
              <div className="w-24 text-right text-xs font-semibold text-neutral-400">Shortlisted</div>
              <div className="flex-1 h-10 bg-white/5 rounded-r-full overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full bg-white/40 w-[38%] rounded-r-full" />
                <div className="absolute inset-y-0 left-[40%] flex items-center text-xs font-bold text-white">
                  {totalShortlisted}
                </div>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="flex items-center gap-4">
              <div className="w-24 text-right text-xs font-semibold text-neutral-400">Interviewed</div>
              <div className="flex-1 h-10 bg-white/5 rounded-r-full overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full bg-white/60 w-[18%] rounded-r-full" />
                <div className="absolute inset-y-0 left-[20%] flex items-center text-xs font-bold text-white">
                  {totalInterviewed}
                </div>
              </div>
            </div>

            {/* Stage 4 */}
            <div className="flex items-center gap-4">
              <div className="w-24 text-right text-xs font-semibold text-neutral-400">Offered</div>
              <div className="flex-1 h-10 bg-white/5 rounded-r-full overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full bg-white w-[8%] rounded-r-full shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                <div className="absolute inset-y-0 left-[10%] flex items-center text-xs font-bold text-white">
                  {totalOffered}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Ranked Candidates Table Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-2xl font-bold text-white">Top Ranked Matches (AI Match Index)</h3>

          {/* Search & Filter */}
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchCandidate}
                onChange={(e) => setSearchCandidate(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
              />
            </div>

            <select
              value={candidateFilter}
              onChange={(e) => setCandidateFilter(e.target.value)}
              className="bg-white/10 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="All" className="bg-black text-white">All Statuses</option>
              <option value="Applied" className="bg-black text-white">Applied</option>
              <option value="Shortlisted" className="bg-black text-white">Shortlisted</option>
              <option value="Interviewed" className="bg-black text-white">Interviewed</option>
              <option value="Offered" className="bg-black text-white">Offered</option>
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-neutral-400 bg-white/[0.02]">
                  <th className="px-6 py-4">Candidate</th>
                  <th className="px-6 py-4">Role Focus</th>
                  <th className="px-6 py-4">Experience</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">AI Match</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/5">
                {filteredCandidates.map((cand) => (
                  <tr
                    key={cand.id}
                    onClick={() => onSelectCandidate(cand)}
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white text-xs">
                          {cand.avatarInitials}
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-sky-300 transition-colors">
                            {cand.name}
                          </div>
                          <div className="text-xs text-neutral-400">{cand.university}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-neutral-300 font-medium">{cand.roleFocus}</td>
                    <td className="px-6 py-4 text-neutral-400">{cand.experience}</td>

                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        cand.status === 'Shortlisted' ? 'bg-sky-500/10 text-sky-300 border-sky-400/30' :
                        cand.status === 'Interviewed' ? 'bg-purple-500/10 text-purple-300 border-purple-400/30' :
                        cand.status === 'Offered' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-400/30' :
                        'bg-white/10 text-neutral-300 border-white/20'
                      }`}>
                        {cand.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5 glass-level-2 px-3 py-1 rounded-full border border-white/20">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-bold text-white">{cand.aiMatchScore}%</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button className="p-2 rounded-full hover:bg-white/10 text-neutral-400 group-hover:text-white transition-all">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
