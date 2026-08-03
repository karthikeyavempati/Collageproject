import React, { useState } from 'react';
import { Candidate, InternshipRole } from '../types';
import {
  Users,
  TrendingUp,
  PlusCircle,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Search,
  Building2,
  ChevronRight,
  ShieldCheck,
  Clock,
  BarChart3
} from 'lucide-react';

interface EmployerDashboardProps {
  candidates: Candidate[];
  postings: InternshipRole[];
  onOpenNewPosting: () => void;
  onSelectCandidate: (candidate: Candidate) => void;
  onCandidateStatusChange: (candidateId: string, status: Candidate['status']) => void;
  companyName?: string;
}

const TricolorBar = ({ className = '' }: { className?: string }) => (
  <div className={`flex w-full ${className}`}>
    <div className="h-1 flex-1 bg-[#FF9933]" />
    <div className="h-1 flex-1 bg-white border-y border-gray-100" />
    <div className="h-1 flex-1 bg-[#138808]" />
  </div>
);

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
    const matchesSearch =
      c.name.toLowerCase().includes(searchCandidate.toLowerCase()) ||
      c.university.toLowerCase().includes(searchCandidate.toLowerCase()) ||
      c.roleFocus.toLowerCase().includes(searchCandidate.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalApplied = 842;
  const totalShortlisted = 315;
  const totalInterviewed = 84;
  const totalOffered = 12;

  const statusBadge = (status: Candidate['status']) => {
    switch (status) {
      case 'Shortlisted': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Interviewed': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Offered':     return 'bg-green-50 text-green-700 border-green-200';
      default:            return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-gray-900 pt-24 pb-24 md:pb-16 px-4 md:px-8 md:ml-64 max-w-7xl">
      <TricolorBar className="rounded-t-xl mb-6 shadow-xs" />

      {/* Government Banner Strip */}
      <div className="relative z-10 flex items-center gap-2 mb-6 px-4 py-2 bg-white border border-gray-200 rounded-2xl shadow-xs w-max animate-in fade-in duration-500">
        <span className="text-lg">🇮🇳</span>
        <span className="text-xs font-bold text-[#005E93]">PM Internship Scheme</span>
        <span className="text-xs text-gray-400">•</span>
        <span className="text-xs text-gray-600">Partner Employer Portal</span>
        <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-800 border border-purple-200 rounded-full text-[10px] font-bold">Verified Corporate Partner</span>
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <div className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#005E93]" /> {companyName} — Corporate Partner Command
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#005E93] tracking-tight">
            Employer Dashboard 🏢
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Real-time candidate AI matching insights and quota allocation for PM Internship openings.
          </p>
        </div>

        <button
          onClick={onOpenNewPosting}
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#005E93] text-white text-xs font-bold hover:bg-[#004A75] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-md self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Scheme Internship</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Metric Cards */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-in fade-in duration-500">
        {/* Total Applicants */}
        <div className="bg-white border border-gray-200 shadow-xs rounded-3xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Total Applicants</span>
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-200">
              <Users className="w-4 h-4 text-[#005E93]" />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-[#005E93]">{totalApplied}</div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-green-700 font-bold">
            <TrendingUp className="w-3.5 h-3.5" /> +12% this week
          </div>
        </div>

        {/* Shortlisted */}
        <div className="bg-white border border-gray-200 shadow-xs rounded-3xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Shortlisted</span>
            <div className="p-2 rounded-xl bg-purple-50 border border-purple-200">
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-[#005E93]">{totalShortlisted}</div>
          <div className="mt-3 text-[10px] text-gray-500 font-medium">37% conversion rate</div>
        </div>

        {/* Interviewed */}
        <div className="bg-white border border-gray-200 shadow-xs rounded-3xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Interviewed</span>
            <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
              <BarChart3 className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-[#005E93]">{totalInterviewed}</div>
          <div className="mt-3 text-[10px] text-gray-500 font-medium">27% of shortlisted</div>
        </div>

        {/* Offered */}
        <div className="bg-white border border-gray-200 shadow-xs rounded-3xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Offer Letters</span>
            <div className="p-2 rounded-xl bg-green-50 border border-green-200">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-[#005E93]">{totalOffered}</div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-green-700 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> Scheme Verified
          </div>
        </div>
      </div>

      {/* Recruitment Funnel */}
      <div className="relative z-10 bg-white border border-gray-200 shadow-xs rounded-3xl p-6 mb-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-gray-900">Recruitment Funnel &amp; Selection Analytics</h3>
          <span className="text-[10px] text-gray-500 font-mono">Real-time Data</span>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Applied', count: totalApplied, width: '100%', color: 'bg-blue-200' },
            { label: 'Shortlisted', count: totalShortlisted, width: '37%', color: 'bg-[#005E93]' },
            { label: 'Interviewed', count: totalInterviewed, width: '10%', color: 'bg-purple-500' },
            { label: 'Offered', count: totalOffered, width: '1.4%', color: 'bg-green-500' },
          ].map(stage => (
            <div key={stage.label} className="flex items-center gap-4">
              <div className="w-24 text-right text-xs font-semibold text-gray-500">{stage.label}</div>
              <div className="flex-1 h-8 bg-slate-100 rounded-full overflow-hidden relative">
                <div className={`absolute top-0 left-0 h-full ${stage.color} rounded-full transition-all duration-700`} style={{ width: stage.width }} />
                <div className="absolute inset-y-0 left-3 flex items-center text-xs font-bold text-gray-700">
                  {stage.count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Candidates Table */}
      <div className="relative z-10 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-4">
          <h3 className="text-lg font-extrabold text-[#005E93]">Candidate Roster &amp; Match Index</h3>

          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchCandidate}
                onChange={(e) => setSearchCandidate(e.target.value)}
                className="bg-white border border-gray-300 rounded-xl pl-8 pr-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-xs"
              />
            </div>

            <select
              value={candidateFilter}
              onChange={(e) => setCandidateFilter(e.target.value)}
              className="bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interviewed">Interviewed</option>
              <option value="Offered">Offered</option>
            </select>
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-xs rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-slate-50 text-[11px] uppercase font-bold text-gray-500 tracking-wider">
                  <th className="py-4 px-6">Candidate</th>
                  <th className="py-4 px-6">Institution</th>
                  <th className="py-4 px-6">Role Focus</th>
                  <th className="py-4 px-6 text-center">AI Fit</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredCandidates.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-900">{c.name}</td>
                    <td className="py-4 px-6 text-gray-600">{c.university}</td>
                    <td className="py-4 px-6 text-gray-600">{c.roleFocus}</td>
                    <td className="py-4 px-6 text-center font-bold text-[#005E93]">
                      {c.aiMatchScore}%
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => onSelectCandidate(c)}
                        className="text-xs font-bold text-[#005E93] hover:underline"
                      >
                        View Profile
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
