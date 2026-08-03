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
  Star,
  UploadCloud,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface StudentDashboardProps {
  internships: InternshipRole[];
  appliedRoleIds: string[];
  onApply: (role: InternshipRole) => void;
  onOpenAICoach: () => void;
  userName?: string;
}

const TricolorBar = ({ className = '' }: { className?: string }) => (
  <div className={`flex w-full ${className}`}>
    <div className="h-1 flex-1 bg-[#FF9933]" />
    <div className="h-1 flex-1 bg-white border-y border-gray-100" />
    <div className="h-1 flex-1 bg-[#138808]" />
  </div>
);

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  internships,
  appliedRoleIds,
  onApply,
  onOpenAICoach,
  userName = "Alex"
}) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'openings' | 'my-applications'>('openings');
  
  // PDF Resume upload state
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [pdfUploadSuccess, setPdfUploadSuccess] = useState<string | null>(null);
  const [pdfUploadError, setPdfUploadError] = useState<string | null>(null);
  const [extractedProfile, setExtractedProfile] = useState<{
    name?: string;
    institution?: string;
    course?: string;
    strengths?: string;
    weaknesses?: string;
  } | null>(null);

  const topMatchRole = internships[0];

  const filteredInternships = internships.filter(role =>
    role.title.toLowerCase().includes(search.toLowerCase()) ||
    role.company.toLowerCase().includes(search.toLowerCase()) ||
    role.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const myAppliedRoles = internships.filter(role => appliedRoleIds.includes(role.id));

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setPdfUploadError('File size exceeds 5MB. Please upload a smaller PDF file.');
      return;
    }

    setIsUploadingPdf(true);
    setPdfUploadError(null);
    setPdfUploadSuccess(null);

    try {
      const base64 = await convertFileToBase64(file);
      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileData: base64, mimeType: file.type || 'application/pdf' })
      });

      const data = await res.json();
      if (res.ok && data) {
        setExtractedProfile({
          name: data.name,
          institution: data.institution,
          course: data.course,
          strengths: data.strengths,
          weaknesses: data.weaknesses
        });
        setPdfUploadSuccess('PDF Resume analyzed successfully by AI!');
      } else {
        throw new Error(data.error || 'Could not extract PDF details');
      }
    } catch (err: any) {
      console.error(err);
      setPdfUploadError('Could not process PDF automatically. Your profile is still active.');
    } finally {
      setIsUploadingPdf(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-gray-900 pt-24 pb-24 md:pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <TricolorBar className="rounded-t-xl mb-6 shadow-xs" />

      {/* Government Official Banner */}
      <div className="relative z-10 bg-white border border-gray-200 shadow-xs rounded-3xl p-6 md:p-8 mb-8 animate-in fade-in duration-500 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/70 rounded-full -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-900 mb-3">
              <span>🇮🇳</span>
              <span>PM Internship Scheme</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-600">Ministry of Corporate Affairs</span>
              <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-700 border border-green-200 rounded-full text-[10px] font-bold">Verified Candidate Portal</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#005E93] tracking-tight mb-2">
              Welcome back, {extractedProfile?.name || userName} 🎓
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl">
              Access real-time internship openings, AI skill match scores &amp; official stipend application tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAICoach}
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#005E93] text-white text-xs font-bold hover:bg-[#004A75] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-md"
            >
              <Bot className="w-4 h-4 text-sky-200" />
              <span>Launch AI Career Coach</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">

        {/* Profile Strength & PDF Resume Upload Card */}
        <div className="md:col-span-4 bg-white border border-gray-200 shadow-xs rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Candidate Profile &amp; AI Analysis</h3>
              <div className="p-2 rounded-xl bg-green-50 border border-green-200">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
            </div>

            {/* Upload PDF Section */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 mb-5">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-[#005E93]" />
                <span className="text-xs font-bold text-gray-900">Upload PDF Resume</span>
              </div>
              <p className="text-[11px] text-gray-600 mb-3">
                Upload your latest PDF resume to automatically calculate your AI Match Index across 1,200+ roles.
              </p>

              <label className="group flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-white border border-dashed border-blue-400 hover:border-blue-600 cursor-pointer transition-all shadow-xs">
                {isUploadingPdf ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-[#005E93] animate-spin" />
                    <span className="text-xs font-bold text-gray-700">Analyzing PDF with AI...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4 text-[#005E93] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-[#005E93]">Choose Resume PDF</span>
                  </>
                )}
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  disabled={isUploadingPdf}
                  onChange={handlePdfUpload}
                  className="hidden"
                />
              </label>

              {pdfUploadSuccess && (
                <div className="mt-2 p-2 rounded-lg bg-green-50 border border-green-200 text-[11px] text-green-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  <span>{pdfUploadSuccess}</span>
                </div>
              )}
              {pdfUploadError && (
                <div className="mt-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{pdfUploadError}</span>
                </div>
              )}
            </div>

            {/* Extracted Details / Progress Gauge */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke="#005E93"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={2 * Math.PI * 42 * (1 - (extractedProfile ? 0.95 : 0.85))}
                    style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-extrabold text-[#005E93]">
                    {extractedProfile ? '95%' : '85%'}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-1">
                  Profile Completion
                </span>
                <span className="text-xs font-medium text-gray-700 block">
                  {extractedProfile?.institution || "IIT Delhi - B.Tech CSE"}
                </span>
                <span className="text-[11px] text-green-700 font-bold mt-1 inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Ministry Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top AI Match Card */}
        {topMatchRole && (
          <div className="md:col-span-8 bg-white border border-gray-200 shadow-xs rounded-3xl p-6 md:p-8 flex flex-col md:flex-row relative overflow-hidden">
            <div className="md:w-3/5 z-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 w-max mb-4">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800">#1 AI Scheme Recommendation</span>
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
              <div className="w-full rounded-2xl bg-blue-50/70 border border-blue-200 p-6 flex flex-col items-center justify-center text-center">
                <div className="text-5xl font-extrabold text-[#005E93] mb-1">98%</div>
                <div className="text-xs uppercase tracking-wider font-bold text-blue-900">Skill Fit Index</div>
                <p className="text-[10px] text-gray-500 mt-2">Verified against Academic Records &amp; AI Portfolio Analysis</p>
              </div>
            </div>
          </div>
        )}

        {/* Verified Skill Mapping */}
        <div className="md:col-span-12 bg-white border border-gray-200 shadow-xs rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-gray-900">Verified Skill &amp; AI Analysis Summary</h3>
            <div className="flex items-center gap-1.5 text-[10px] text-green-700 font-bold bg-green-50 border border-green-200 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" /> Scheme Accredited
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
              <div className="p-3 rounded-xl bg-blue-100 border border-blue-200 text-[#005E93] shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-0.5">Core Technical Focus</h4>
                <p className="text-xs text-gray-600">
                  {extractedProfile?.strengths || "Full-Stack Development, System Architecture & Database Design."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
              <div className="p-3 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-0.5">Academic Qualification</h4>
                <p className="text-xs text-gray-600">
                  {extractedProfile?.course || "B.Tech Computer Science"} — {extractedProfile?.institution || "IIT Delhi"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-green-50/60 border border-green-100">
              <div className="p-3 rounded-xl bg-green-100 border border-green-200 text-green-700 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-0.5">Areas for Development</h4>
                <p className="text-xs text-gray-600">
                  {extractedProfile?.weaknesses || "Technical Documentation & Advanced Enterprise Architecture."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-4 mb-6 gap-4">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('openings')}
            className={`text-sm font-bold pb-2 transition-all border-b-2 ${
              activeTab === 'openings'
                ? 'border-[#005E93] text-[#005E93]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            All Scheme Roles ({internships.length})
          </button>
          <button
            onClick={() => setActiveTab('my-applications')}
            className={`text-sm font-bold pb-2 transition-all border-b-2 ${
              activeTab === 'my-applications'
                ? 'border-[#005E93] text-[#005E93]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            My Submitted Applications ({appliedRoleIds.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter roles or companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-xs"
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
                  className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
                        {role.stipend}
                      </span>
                      {role.matchScore && (
                        <div className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 text-amber-500" />
                          {role.matchScore}% AI Fit
                        </div>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-gray-900 mb-1">{role.title}</h3>
                    <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" /> {role.company}
                    </p>

                    <p className="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed">{role.description}</p>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {role.tags.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[10px] text-blue-700 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" /> {role.location}
                    </span>
                    <button
                      disabled={isApplied}
                      onClick={() => onApply(role)}
                      className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                        isApplied
                          ? 'bg-green-50 text-green-700 border border-green-200 flex items-center gap-1 cursor-default'
                          : 'bg-[#005E93] text-white hover:bg-[#004A75] hover:-translate-y-0.5 active:translate-y-0 shadow-xs'
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
              <div className="bg-white border border-gray-200 shadow-xs rounded-3xl p-12 text-center">
                <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-[#005E93]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No Applications Submitted Yet</h3>
                <p className="text-xs text-gray-500 mb-6">Explore recommended scheme roles above and submit applications with 1-click verification.</p>
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
                  className="bg-white border border-gray-200 shadow-xs rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-all"
                >
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs text-green-700 font-bold bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Scheme Application
                    </div>
                    <h3 className="text-base font-bold text-gray-900">{role.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{role.company} • {role.location}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{role.stipend}</div>
                      <div className="text-[10px] text-gray-500 flex items-center gap-1 justify-end mt-0.5">
                        <Clock className="w-3 h-3 text-amber-500" /> Under Review
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800">
                      Active Application
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
