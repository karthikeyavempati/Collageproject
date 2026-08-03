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
  Activity
} from 'lucide-react';

interface AdminDashboardProps {
  stateDistributions: StateDistribution[];
  verificationBatches: VerificationBatch[];
  onApproveBatch: (batchId: string) => void;
}

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
    <div className="relative min-h-screen bg-black text-white pt-24 pb-24 md:pb-16 px-4 md:px-8 md:ml-64 max-w-7xl">
      <div className="cinematic-header-bg" />
      {/* Top Banner */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest font-bold text-neutral-400 mb-1 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-400" /> Portal System Command Center
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            System Overview
          </h2>
          <p className="text-xs md:text-sm text-neutral-400 mt-1">
            Real-time verification metrics and platform-wide applicant distribution for the PM Internship Scheme.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-emerald-500/30 self-start md:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-emerald-300">System Status: 99.9% Operational</span>
        </div>
      </div>

      {/* KPI Grid (Bento style) */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* KPI 1 */}
        <div className="liquid-glass rounded-3xl p-6 flex flex-col justify-between h-48 relative overflow-hidden border border-white/10">
          <div className="flex justify-between items-start z-10">
            <span className="text-xs uppercase tracking-wider font-bold text-neutral-400">Total Applications</span>
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="z-10">
            <div className="text-5xl font-black text-white tracking-tight">1.2M</div>
            <div className="text-xs text-emerald-400 font-bold mt-1.5 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> +12% growth from previous month
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="liquid-glass rounded-3xl p-6 flex flex-col justify-between h-48 relative overflow-hidden border border-white/10">
          <div className="flex justify-between items-start z-10">
            <span className="text-xs uppercase tracking-wider font-bold text-neutral-400">Pending Verification</span>
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          </div>
          <div className="z-10">
            <div className="text-5xl font-black text-white tracking-tight">45K</div>
            <div className="text-xs text-rose-300 font-bold mt-1.5">Zone C Document Verification Queue</div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="liquid-glass rounded-3xl p-6 flex flex-col justify-between h-48 relative overflow-hidden border border-white/10">
          <div className="flex justify-between items-start z-10">
            <span className="text-xs uppercase tracking-wider font-bold text-neutral-400">Approval Rate</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="z-10">
            <div className="text-5xl font-black text-white tracking-tight">78%</div>
            <div className="text-xs text-neutral-400 mt-1.5">Rolling 30-day verified average</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Regional Analytics & Verification Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* State-wise Distribution Area */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-400" /> State-wise Application Volume
            </h3>

            <div className="flex gap-1.5">
              {['All', 'North', 'South', 'West'].map(region => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    selectedRegion === region
                      ? 'bg-white text-black font-bold'
                      : 'bg-white/5 text-neutral-400 hover:bg-white/10'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 my-2">
            {filteredStates.map((st) => (
              <div key={st.state} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">{st.state}</span>
                  <span className="text-xs font-mono font-bold text-sky-300">
                    {st.applications.toLocaleString()} Applications
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-sky-400 rounded-full"
                    style={{ width: `${(st.applications / 250000) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span>Verified: {st.verifiedPercentage}%</span>
                  <span>Active Partners: {st.activePartners} Enterprise Units</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
            <span>Highest Volume Region: <strong className="text-white">Maharashtra (245,091)</strong></span>
            <span className="text-emerald-400 font-bold">100% Aadhaar Verified</span>
          </div>
        </div>

        {/* Verification Queue Area */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between border border-white/10">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-400" /> Verification Queue
              </h3>
              <MoreHorizontal className="w-5 h-5 text-neutral-400 cursor-pointer" />
            </div>

            <div className="space-y-4">
              {verificationBatches.map((batch) => (
                <div key={batch.id} className="liquid-glass rounded-2xl p-4 border border-white/10 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-white mb-0.5">{batch.title}</p>
                      <p className="text-xs text-neutral-400">{batch.type}</p>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      batch.priority === 'High' ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30' :
                      batch.priority === 'System' ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30' :
                      'bg-white/10 text-neutral-300 border border-white/20'
                    }`}>
                      {batch.priority}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-xs text-neutral-300 font-mono">{batch.count} Records</span>
                    
                    <button
                      onClick={() => onApproveBatch(batch.id)}
                      className="liquid-button rounded-xl px-3 py-1 text-xs font-bold text-white flex items-center gap-1"
                    >
                      Process Batch <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <span className="text-xs text-neutral-400">Batch Processing Speed: <strong className="text-white">12,000 docs/hr</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
