import React, { useState } from 'react';
import { StateDistribution, VerificationBatch } from '../types';
import { 
  BarChart3, 
  ShieldAlert, 
  CheckCircle2, 
  Users, 
  FileCheck, 
  MapPin, 
  MoreHorizontal, 
  ArrowRight,
  Sparkles,
  Activity,
  ShieldCheck
} from 'lucide-react';

interface AdminDashboardProps {
  stateDistributions: StateDistribution[];
  verificationBatches: VerificationBatch[];
  onApproveBatch: (batchId: string) => void;
}

const TricolorBar = ({ className = '' }: { className?: string }) => (
  <div className={`flex w-full ${className}`}>
    <div className="h-1 flex-1 bg-[#FF9933]" />
    <div className="h-1 flex-1 bg-white border-y border-gray-100" />
    <div className="h-1 flex-1 bg-[#138808]" />
  </div>
);

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stateDistributions,
  verificationBatches,
  onApproveBatch
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  const filteredStates = stateDistributions.filter(s => {
    if (selectedRegion === 'North') return s.state === 'Delhi NCR' || s.state === 'Uttar Pradesh';
    if (selectedRegion === 'South') return s.state === 'Karnataka' || s.state === 'Tamil Nadu';
    if (selectedRegion === 'West') return s.state === 'Maharashtra';
    return true;
  });

  return (
    <div className="relative min-h-screen bg-slate-50 text-gray-900 pt-24 pb-24 md:pb-16 px-4 md:px-8 md:ml-64 max-w-7xl">
      <TricolorBar className="rounded-t-xl mb-6 shadow-xs" />

      {/* Official Government Strip */}
      <div className="relative z-10 flex items-center gap-2 mb-6 px-4 py-2 bg-white border border-gray-200 rounded-2xl shadow-xs w-max animate-in fade-in duration-500">
        <span className="text-lg">🇮🇳</span>
        <span className="text-xs font-bold text-[#005E93]">PM Internship Scheme</span>
        <span className="text-xs text-gray-400">•</span>
        <span className="text-xs text-gray-600">Ministry of Corporate Affairs</span>
        <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 rounded-full text-[10px] font-bold">System Command Center</span>
      </div>

      {/* Top Banner */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <div className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#005E93]" /> Scheme Oversight &amp; Audit Command
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#005E93] tracking-tight">
            System Overview 🏛️
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Real-time verification metrics, batch audits &amp; platform-wide applicant distribution for the PM Internship Scheme.
          </p>
        </div>

        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white border border-gray-200 shadow-xs self-start md:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-gray-800">System Status: <strong className="text-emerald-700">99.9% Operational</strong></span>
        </div>
      </div>

      {/* KPI Grid (Bento style) */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-in fade-in duration-500">
        {/* KPI 1 */}
        <div className="bg-white border border-gray-200 shadow-xs rounded-3xl p-6 flex flex-col justify-between h-48 relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <span className="text-xs uppercase tracking-wider font-bold text-gray-500">Total System Applications</span>
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-200">
              <Users className="w-5 h-5 text-[#005E93]" />
            </div>
          </div>
          <div className="z-10">
            <div className="text-5xl font-extrabold text-[#005E93] tracking-tight">1.2M</div>
            <div className="text-xs text-green-700 font-bold mt-2 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-green-600" /> +12% growth from previous month
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-gray-200 shadow-xs rounded-3xl p-6 flex flex-col justify-between h-48 relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <span className="text-xs uppercase tracking-wider font-bold text-gray-500">Pending Verification</span>
            <div className="p-2 rounded-xl bg-rose-50 border border-rose-200">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
            </div>
          </div>
          <div className="z-10">
            <div className="text-5xl font-extrabold text-[#005E93] tracking-tight">45K</div>
            <div className="text-xs text-rose-700 font-bold mt-2">Zone C Document Verification Queue</div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-gray-200 shadow-xs rounded-3xl p-6 flex flex-col justify-between h-48 relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <span className="text-xs uppercase tracking-wider font-bold text-gray-500">Verification Approval Rate</span>
            <div className="p-2 rounded-xl bg-green-50 border border-green-200">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="z-10">
            <div className="text-5xl font-extrabold text-[#005E93] tracking-tight">78%</div>
            <div className="text-xs text-gray-500 mt-2 font-medium">Rolling 30-day verified average</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Regional Analytics & Verification Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* State-wise Distribution Area */}
        <div className="lg:col-span-2 bg-white border border-gray-200 shadow-xs rounded-3xl p-6 md:p-8 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#005E93]" /> State-wise Application Volume
            </h3>

            <div className="flex gap-1.5">
              {['All', 'North', 'South', 'West'].map(region => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    selectedRegion === region
                      ? 'bg-[#005E93] text-white font-bold'
                      : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 my-2">
            {filteredStates.map((st) => (
              <div key={st.state} className="p-4 rounded-2xl bg-slate-50 border border-gray-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-900">{st.state}</span>
                  <span className="text-xs font-mono font-bold text-[#005E93]">
                    {st.applications.toLocaleString()} Applications
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-[#005E93] rounded-full"
                    style={{ width: `${(st.applications / 250000) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-600 font-medium">
                  <span>Verified: <strong className="text-gray-900">{st.verifiedPercentage}%</strong></span>
                  <span>Active Partners: <strong className="text-gray-900">{st.activePartners} Enterprise Units</strong></span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600 mt-4">
            <span>Highest Volume State: <strong className="text-gray-900">Maharashtra (245,091)</strong></span>
            <span className="text-green-700 font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> 100% Aadhaar Verified
            </span>
          </div>
        </div>

        {/* Verification Queue Area */}
        <div className="bg-white border border-gray-200 shadow-xs rounded-3xl p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-600" /> Verification Batches
              </h3>
              <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
            </div>

            <div className="space-y-4">
              {verificationBatches.map((batch) => (
                <div key={batch.id} className="rounded-2xl p-4 border border-gray-200 bg-slate-50/60 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-0.5">{batch.title}</p>
                      <p className="text-xs text-gray-500">{batch.type}</p>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      batch.priority === 'High' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                      batch.priority === 'System' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                      'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {batch.priority}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-200/80">
                    <span className="text-xs text-gray-600 font-mono font-semibold">{batch.count} Records</span>
                    
                    <button
                      onClick={() => onApproveBatch(batch.id)}
                      className="rounded-xl px-3 py-1.5 text-xs font-bold bg-[#005E93] text-white hover:bg-[#004A75] transition-all flex items-center gap-1 shadow-xs"
                    >
                      Process Batch <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <span className="text-xs text-gray-500">Batch Audit Rate: <strong className="text-gray-900">12,000 docs/hr</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
