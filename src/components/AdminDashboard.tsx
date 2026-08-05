import React from 'react';
import { StateDistribution, VerificationBatch, PendingCompany } from '../types';
import {
  Users,
  Building2,
  Clock,
  Briefcase,
  TrendingUp
} from 'lucide-react';

interface AdminDashboardProps {
  stateDistributions: StateDistribution[];
  verificationBatches: VerificationBatch[];
  onApproveBatch: (batchId: string) => void;
  /** Companies awaiting admin approval */
  pendingCompanies: PendingCompany[];
  onApproveCompany: (companyId: string) => void;
  onRejectCompany: (companyId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stateDistributions,
  verificationBatches,
  onApproveBatch,
  pendingCompanies,
  onApproveCompany,
  onRejectCompany
}) => {
  // Only show companies still pending
  const pendingList = pendingCompanies.filter(c => c.status === 'Pending');

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-['Hanken_Grotesk',_sans-serif] pt-20 pb-16">
      <main className="max-w-[1280px] mx-auto px-4 md:px-8 space-y-8">

        {/* ── Page Header ──────────────────────────────── */}
        <header>
          <h2 className="text-[32px] font-semibold text-[#191c1e] mb-2 leading-[40px]">
            System Administrator Dashboard
          </h2>
          <p className="text-base text-[#43474f]">
            Overview and administration of the PM Internship Scheme.
          </p>
        </header>

        {/* ── High-level Analytics KPI Cards ────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Active Students */}
          <div className="bg-white border border-[#c3c6d1] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#43474f] font-['Public_Sans']">Total Active Students</h3>
              <Users className="w-6 h-6 text-[#fe9832]" />
            </div>
            <p className="text-[48px] font-bold text-[#191c1e] leading-[56px] tracking-[-0.02em]">120,500</p>
            <div className="mt-4 flex items-center text-sm text-[#012200]">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+4.2% from last month</span>
            </div>
          </div>

          {/* Total Registered Companies */}
          <div className="bg-white border border-[#c3c6d1] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#43474f] font-['Public_Sans']">Total Registered Companies</h3>
              <Building2 className="w-6 h-6 text-[#003366]" />
            </div>
            <p className="text-[48px] font-bold text-[#191c1e] leading-[56px] tracking-[-0.02em]">8,200</p>
            <div className="mt-4 flex items-center text-sm text-[#012200]">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+1.8% from last month</span>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-white border border-[#c3c6d1] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#43474f] font-['Public_Sans']">Pending Approvals</h3>
              <Clock className="w-6 h-6 text-[#8f4e00]" />
            </div>
            <p className="text-[48px] font-bold text-[#191c1e] leading-[56px] tracking-[-0.02em]">{pendingList.length}</p>
            <div className="mt-4 text-sm text-[#43474f]">
              Requires attention
            </div>
          </div>

          {/* Active Internships */}
          <div className="bg-white border border-[#c3c6d1] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#43474f] font-['Public_Sans']">Active Internships</h3>
              <Briefcase className="w-6 h-6 text-[#0055AA]" />
            </div>
            <p className="text-[48px] font-bold text-[#191c1e] leading-[56px] tracking-[-0.02em]">45,320</p>
            <div className="mt-4 text-sm text-[#43474f]">
              Across 12 sectors
            </div>
          </div>
        </div>

        {/* ── Bento Grid: Chart + Approvals Table ─────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Registration Trends (placeholder chart) ── */}
          <div className="lg:col-span-1 bg-white border border-[#c3c6d1] rounded-xl p-6 shadow-sm flex flex-col">
            <h3 className="text-2xl font-semibold mb-6 text-[#191c1e]">Registration Trends</h3>
            <div className="flex-1 relative min-h-[250px] bg-[#f2f4f6] rounded-lg overflow-hidden border border-[#c3c6d1]/50">
              {/* Visual bar chart placeholder matching Stitch design */}
              <div className="absolute inset-0 flex items-end p-4 space-x-2">
                <div className="w-1/6 bg-[#a7c8ff]/40 rounded-t" style={{ height: '25%' }} />
                <div className="w-1/6 bg-[#a7c8ff]/60 rounded-t" style={{ height: '50%' }} />
                <div className="w-1/6 bg-[#a7c8ff]/80 rounded-t" style={{ height: '75%' }} />
                <div className="w-1/6 bg-[#003366]/70 rounded-t" style={{ height: '66%' }} />
                <div className="w-1/6 bg-[#003366]/90 rounded-t" style={{ height: '100%' }} />
                <div className="w-1/6 bg-[#003366] rounded-t" style={{ height: '85%' }} />
              </div>
              <div className="absolute top-4 left-4 text-xs font-medium text-[#43474f] font-['Public_Sans']">
                Monthly Signups (YTD)
              </div>
            </div>
          </div>

          {/* ── Pending Company Approvals Table ────────── */}
          <div className="lg:col-span-2 bg-white border border-[#c3c6d1] rounded-xl shadow-sm overflow-hidden flex flex-col">
            {/* Table Header */}
            <div className="p-6 border-b border-[#c3c6d1] flex justify-between items-center">
              <h3 className="text-2xl font-semibold text-[#191c1e]">Pending Company Approvals</h3>
              <button className="text-[#001e40] text-sm font-semibold hover:underline font-['Public_Sans']">
                View All
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f2f4f6] text-[#43474f] border-b border-[#c3c6d1]">
                    <th className="p-4 text-sm font-semibold font-['Public_Sans']">Company Name</th>
                    <th className="p-4 text-sm font-semibold font-['Public_Sans']">Industry</th>
                    <th className="p-4 text-sm font-semibold font-['Public_Sans']">Date Applied</th>
                    <th className="p-4 text-sm font-semibold text-right font-['Public_Sans']">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-base">
                  {pendingList.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-[#43474f]">
                        No pending company approvals. All companies have been reviewed.
                      </td>
                    </tr>
                  )}
                  {pendingList.map(company => (
                    <tr
                      key={company.id}
                      className="border-b border-[#c3c6d1] hover:bg-[#f7f9fb]/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          {/* Company initial avatar */}
                          <div className="w-8 h-8 rounded bg-[#e6e8ea] flex items-center justify-center text-[#001e40] font-bold text-sm">
                            {company.name.charAt(0)}
                          </div>
                          <span className="font-medium text-[#191c1e]">{company.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-[#43474f]">{company.industry}</td>
                      <td className="p-4 text-[#43474f]">{company.dateApplied}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => onRejectCompany(company.id)}
                            className="px-3 py-1.5 bg-white border border-[#ba1a1a] text-[#ba1a1a] rounded hover:bg-[#ffdad6] transition-colors text-sm font-semibold font-['Public_Sans']"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => onApproveCompany(company.id)}
                            className="px-3 py-1.5 bg-[#003366] text-white rounded hover:opacity-90 transition-opacity text-sm font-semibold font-['Public_Sans']"
                          >
                            Approve
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────── */}
        <footer className="mt-8 border-t border-[#c3c6d1] bg-[#e0e3e5] rounded-xl flex flex-col md:flex-row justify-between items-center px-12 py-8 w-full">
          <div className="mb-4 md:mb-0">
            <span className="text-sm font-black font-['Public_Sans']">PM Internship Scheme</span>
            <p className="text-base text-[#43474f] mt-1">© 2024 PM Internship Scheme. Government of India.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-['Public_Sans']">
            {['Privacy Policy', 'Terms of Service', 'Accessibility', 'Contact Us'].map(link => (
              <a key={link} href="#" className="text-[#43474f] hover:text-[#001e40] transition-colors">{link}</a>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
};
