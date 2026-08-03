import React, { useState } from 'react';
import { PortalRole } from '../types';
import { 
  ShieldCheck, 
  User, 
  Building2, 
  Search, 
  Menu, 
  X, 
  Home, 
  Briefcase, 
  Users, 
  BarChart3, 
  Settings, 
  HelpCircle,
  PlusCircle,
  ChevronRight,
  Bot,
  Lock,
  LogIn
} from 'lucide-react';

interface NavigationProps {
  activeRole: PortalRole;
  setActiveRole: (role: PortalRole) => void;
  onOpenNewPosting?: () => void;
  onOpenAICoach?: () => void;
  unreadNotifications?: number;
  userName?: string;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeRole,
  setActiveRole,
  onOpenNewPosting,
  onOpenAICoach,
  unreadNotifications = 3,
  userName,
  isAuthenticated = false,
  onLogout
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const roles: { id: PortalRole; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'landing', label: 'Enterprise Portal', icon: <ShieldCheck className="w-4 h-4 text-blue-700" />, desc: 'Enterprise Scheme Landing' },
    { id: 'login', label: 'Sign In / Auth', icon: <Lock className="w-4 h-4 text-blue-700" />, desc: 'Dedicated Login & Security Gateway' },
    { id: 'student', label: 'Student Candidate', icon: <User className="w-4 h-4 text-orange-600" />, desc: 'Student Internship Hub' },
    { id: 'employer', label: 'Employer Account', icon: <Building2 className="w-4 h-4 text-green-700" />, desc: 'Tech Mahindra Recruitment' },
    { id: 'admin', label: 'System Admin', icon: <BarChart3 className="w-4 h-4 text-gray-700" />, desc: 'Portal System Command' }
  ];

  return (
    <>
      {/* Top Decorative Strip */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[60] flex">
        <div className="w-1/3 h-full bg-[#FF9933]"></div>
        <div className="w-1/3 h-full bg-white"></div>
        <div className="w-1/3 h-full bg-[#138808]"></div>
      </div>

      {/* Top Navbar for Mobile & Desktop */}
      <header className="fixed top-1 left-0 right-0 z-50 h-20 bg-white border-b border-gray-200 shadow-sm px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          {/* Logo & Scheme Brand */}
          <div 
            onClick={() => setActiveRole('landing')}
            className="cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform overflow-hidden">
              <img
                src="/assets/india_flag.png"
                alt="Indian flag"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-blue-900 flex items-center gap-1.5">
                PM Internship Scheme
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block font-medium">Ministry of Corporate Affairs</p>
            </div>
          </div>

          {/* Role Display Pill */}
          <div className="relative">
            <div
              className="rounded-full px-3.5 py-1.5 flex items-center gap-2 text-xs font-semibold text-gray-700 border border-gray-200 bg-gray-50"
            >
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span className="hidden sm:inline text-gray-500">View:</span>
              <span className="font-bold text-gray-900">{roles.find(r => r.id === activeRole)?.label}</span>
            </div>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-4">
          {isAuthenticated ? (
            <button
              onClick={onLogout}
              className="rounded-md px-4 py-2 flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-red-600 transition-all shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span className="max-w-[7rem] truncate">{userName || 'Signed In'}</span>
              <LogIn className="w-4 h-4 rotate-180 text-gray-400" />
            </button>
          ) : (
            <button
              onClick={() => setActiveRole('login')}
              className={`rounded-md px-5 py-2 flex items-center gap-2 text-sm font-semibold transition-all shadow-sm ${
                activeRole === 'login'
                  ? 'bg-blue-800 text-white hover:bg-blue-900 border border-transparent'
                  : 'bg-white text-blue-800 border border-blue-200 hover:bg-blue-50'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Login / Register</span>
            </button>
          )}

          {activeRole === 'student' && isAuthenticated && onOpenAICoach && (
            <button
              onClick={onOpenAICoach}
              className="rounded-md px-4 py-2 flex items-center gap-2 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors shadow-sm"
            >
              <Bot className="w-4 h-4 text-blue-600" />
              <span className="hidden md:inline">AI Assistant</span>
            </button>
          )}

          {activeRole === 'employer' && isAuthenticated && onOpenNewPosting && (
            <button
              onClick={onOpenNewPosting}
              className="rounded-md px-4 py-2 flex items-center gap-2 text-sm font-semibold text-white bg-[#005E93] hover:bg-[#004A75] border border-transparent transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">New Posting</span>
            </button>
          )}

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 pb-24 md:hidden flex flex-col justify-between overflow-y-auto animate-in fade-in slide-in-from-right duration-200">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xs uppercase font-bold text-gray-500 mb-3 tracking-wider">Quick Navigation</h3>
              <a onClick={() => setIsMobileMenuOpen(false)} href="#overview" className="flex items-center gap-3 p-3 rounded-md text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200 text-sm font-medium">
                <Home className="w-5 h-5 text-gray-400" /> Home Overview
              </a>
              <a onClick={() => setIsMobileMenuOpen(false)} href="#internships" className="flex items-center gap-3 p-3 rounded-md text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200 text-sm font-medium">
                <Briefcase className="w-5 h-5 text-gray-400" /> Openings & Roles
              </a>
              <a onClick={() => setIsMobileMenuOpen(false)} href="#candidates" className="flex items-center gap-3 p-3 rounded-md text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200 text-sm font-medium">
                <Users className="w-5 h-5 text-gray-400" /> Verified Candidates
              </a>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 flex items-center justify-between text-xs text-gray-500">
            <span>© 2026 Government Portal</span>
            <span className="text-green-600 font-medium">System Status: Active</span>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (for Employer & Admin portals) */}
      {(activeRole === 'employer' || activeRole === 'admin') && isAuthenticated && (
        <aside className="fixed left-0 top-[5.25rem] h-[calc(100vh-5.25rem)] w-64 z-30 hidden md:flex flex-col py-6 px-4 bg-white border-r border-gray-200 shadow-sm animate-in fade-in slide-in-from-left-2 duration-300">
          <div className="mb-6 px-4">
            <div className="text-xs font-bold text-gray-500 tracking-wider">
              {activeRole === 'employer' ? `${userName || 'Partner'} Employer` : 'Portal System Admin'}
            </div>
            <div className="text-sm font-bold text-gray-900 mt-1">
              {activeRole === 'employer' ? 'Employer Hub' : 'System Operations'}
            </div>
          </div>

          <nav className="flex-1 space-y-1.5">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-md bg-blue-50 text-blue-800 font-medium text-sm transition-all shadow-sm border border-blue-100 border-l-4 border-l-blue-600">
              <Home className="w-5 h-5 text-blue-600" /> Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium text-sm transition-all border border-transparent hover:border-gray-200">
              <Briefcase className="w-5 h-5 text-gray-400" /> {activeRole === 'employer' ? 'Active Postings' : 'Scheme Applications'}
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium text-sm transition-all border border-transparent hover:border-gray-200">
              <Users className="w-5 h-5 text-gray-400" /> {activeRole === 'employer' ? 'Candidates & Matches' : 'State Verification'}
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium text-sm transition-all border border-transparent hover:border-gray-200">
              <BarChart3 className="w-5 h-5 text-gray-400" /> Analytics & Reports
            </button>
          </nav>

          <div className="pt-4 border-t border-gray-200 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-50 font-medium text-xs transition-all">
              <Settings className="w-4 h-4" /> Portal Settings
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-50 font-medium text-xs transition-all">
              <HelpCircle className="w-4 h-4" /> Scheme Support
            </button>
          </div>
        </aside>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 flex items-center justify-around px-2">
        <button
          onClick={() => setActiveRole('landing')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-md transition-all ${
            activeRole === 'landing' ? 'text-blue-700 font-bold' : 'text-gray-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        <button
          onClick={() => setActiveRole('student')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-md transition-all ${
            activeRole === 'student' ? 'text-blue-700 font-bold' : 'text-gray-500'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Student</span>
        </button>

        <button
          onClick={() => setActiveRole('employer')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-md transition-all ${
            activeRole === 'employer' ? 'text-blue-700 font-bold' : 'text-gray-500'
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Employer</span>
        </button>

        <button
          onClick={() => setActiveRole('admin')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-md transition-all ${
            activeRole === 'admin' ? 'text-blue-700 font-bold' : 'text-gray-500'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Admin</span>
        </button>
      </nav>
    </>
  );
};
