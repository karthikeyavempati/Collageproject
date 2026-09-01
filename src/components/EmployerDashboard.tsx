import React, { useState } from 'react';
import { Candidate, InternshipRole } from '../types';
import {
  Users,
  TrendingUp,
  PlusCircle,
  Sparkles,
  ArrowRight,
  Search,
  Building2,
  MapPin,
  Clock,
  Wallet
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
  const [searchCandidate, setSearchCandidate] = useState('');

  // ── Dashboard metrics derived from real data ──────────────────────────
  const totalApplications = postings.reduce((sum, p) => sum + p.applicantsCount, 0);
  const activePostings = postings.length;
  const shortlistedCandidates = candidates.filter(c => c.status === 'Shortlisted');
  const aiShortlistedCount = shortlistedCandidates.length;

  // Top 3 candidates by AI match score for the "Top Matches" panel
  const topMatches = [...candidates]
    .sort((a, b) => b.aiMatchScore - a.aiMatchScore)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-['Hanken_Grotesk',_sans-serif] pt-[4.5rem] sm:pt-20 pb-20 sm:pb-16">
      <main className="max-w-[1280px] mx-auto px-3 sm:px-4 md:px-12 w-full">

        {/* ── Page Header ─────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-[32px] md:text-[48px] font-bold text-[#001e40] mb-2 leading-tight sm:leading-[40px] md:leading-[56px] tracking-[-0.02em]">
            Company Dashboard
          </h1>
          <p className="text-lg text-[#43474f]">
            Welcome back. Here is an overview of your active recruitment campaigns.
          </p>
        </div>

        {/* ── Metrics Row ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {/* Metric 1: Total Applications Received */}
          <div className="bg-white border border-[#c3c6d1] rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-[#d5e3ff] rounded-lg text-[#1f477b]">
                <Users className="w-7 h-7" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium bg-[#72de5c] text-[#012200] px-2 py-1 rounded-full font-['Public_Sans']">
                <TrendingUp className="w-3.5 h-3.5" /> 12%
              </span>
            </div>
            <p className="text-sm font-semibold text-[#43474f] mb-1 font-['Public_Sans']">Total Applications Received</p>
            <p className="text-2xl sm:text-[32px] font-semibold text-[#191c1e] leading-[32px] sm:leading-[40px]">{totalApplications}</p>
          </div>

          {/* Metric 2: Active Postings */}
          <div className="bg-white border border-[#c3c6d1] rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-[#ffdcc2] rounded-lg text-[#2e1500]">
                <Building2 className="w-7 h-7" />
              </div>
            </div>
            <p className="text-sm font-semibold text-[#43474f] mb-1 font-['Public_Sans']">Active Postings</p>
            <p className="text-2xl sm:text-[32px] font-semibold text-[#191c1e] leading-[32px] sm:leading-[40px]">{activePostings}</p>
          </div>

          {/* Metric 3: AI Shortlisted Candidates */}
          <div className="bg-white border border-[#c3c6d1] rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-[#e0e3e5] rounded-lg text-[#43474f]">
                <Sparkles className="w-7 h-7" />
              </div>
            </div>
            <p className="text-sm font-semibold text-[#43474f] mb-1 font-['Public_Sans']">AI Shortlisted Candidates</p>
            <p className="text-2xl sm:text-[32px] font-semibold text-[#191c1e] leading-[32px] sm:leading-[40px]">{aiShortlistedCount}</p>
          </div>
        </div>

        {/* ── Bento Grid: Postings + AI Matches ──────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ── Left: Active Internship Postings (2 cols) ── */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[#191c1e]">Active Internship Postings</h2>
              <button className="text-sm font-semibold text-[#001e40] hover:underline flex items-center gap-1 font-['Public_Sans']">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Posting Cards */}
            <div className="flex flex-col gap-4">
              {postings.map(posting => (
                <div
                  key={posting.id}
                  className="bg-white border border-[#c3c6d1] rounded-xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-[#191c1e]">{posting.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium font-['Public_Sans'] ${
                        posting.status === 'Open'
                          ? 'bg-[#ffb77a] text-[#6d3a00]'
                          : posting.status === 'Reviewing'
                            ? 'bg-[#e6e8ea] text-[#43474f]'
                            : 'bg-[#ffdcc2] text-[#683700]'
                      }`}>
                        {posting.status === 'Open' ? 'Active' : posting.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#43474f] font-['Public_Sans']">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {posting.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {posting.duration}</span>
                      <span className="flex items-center gap-1"><Wallet className="w-3.5 h-3.5" /> {posting.stipend}</span>
                    </div>
                  </div>

                  {/* Applicant count & Manage button */}
                  <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-[#c3c6d1] pt-4 md:pt-0 md:pl-6 mt-2 md:mt-0">
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-[#001e40]">{posting.applicantsCount}</p>
                      <p className="text-xs text-[#43474f] font-['Public_Sans']">Applicants</p>
                    </div>
                    <button
                      onClick={onOpenNewPosting}
                      className="px-4 py-2 border border-[#001e40] text-[#001e40] rounded-lg text-sm font-semibold hover:bg-[#001e40] hover:text-white transition-colors font-['Public_Sans']"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: AI Shortlisted "Top Matches" (1 col) ── */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[#191c1e] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#0055AA]" />
                Top Matches
              </h2>
            </div>

            <div className="bg-white border border-[#c3c6d1] rounded-xl p-6 shadow-sm flex flex-col gap-6">
              <p className="text-base text-[#43474f] mb-2">
                AI has identified these candidates as the highest structural matches for your active postings.
              </p>

              {topMatches.map((candidate, idx) => (
                <div
                  key={candidate.id}
                  className={`flex flex-col gap-3 ${idx < topMatches.length - 1 ? 'pb-4 border-b border-[#c3c6d1]' : ''}`}
                >
                  {/* Candidate Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-[#d5e3ff] border border-[#c3c6d1] flex items-center justify-center text-sm font-bold text-[#003366]">
                        {candidate.avatarInitials}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#191c1e] font-['Public_Sans']">{candidate.name}</h4>
                        <p className="text-xs text-[#43474f] font-['Public_Sans']">{candidate.university}</p>
                      </div>
                    </div>
                    <span className="bg-[#8dfc75] text-[#012200] px-2 py-1 rounded text-xs font-bold border border-[#72de5c] font-['Public_Sans']">
                      {candidate.aiMatchScore}% Match
                    </span>
                  </div>

                  {/* Skill Chips */}
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.slice(0, 3).map(skill => (
                      <span key={skill} className="px-2 py-1 bg-[#eceef0] rounded text-[11px] text-[#191c1e] font-['Public_Sans']">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* View Profile Button */}
                  <button
                    onClick={() => onSelectCandidate(candidate)}
                    className="mt-2 w-full py-2 border border-[#c3c6d1] text-[#191c1e] rounded-lg text-sm font-semibold hover:bg-[#f2f4f6] transition-colors font-['Public_Sans']"
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
