import React, { useState, useRef, useEffect } from 'react';
import { InternshipRole, Candidate } from '../types';
import {
  Search,
  MapPin,
  Calendar,
  Wallet,
  X,
  Send,
  Bot,
  ChevronUp,
  Compass,
  TrendingUp,
  Star,
  FileText
} from 'lucide-react';

interface StudentDashboardProps {
  internships: InternshipRole[];
  appliedRoleIds: string[];
  onApply: (role: InternshipRole) => void;
  onOpenAICoach: () => void;
  userName?: string;
  /** Candidates data used to compute shortlisted count */
  candidates?: Candidate[];
}

// ─── Floating Chat Widget ────────────────────────────────────────────────────
// A persistent bottom-right chat FAB that expands into a panel wired to
// the existing /api/ai-coach backend endpoint.
const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Hello! I\'m your PM Internship Scheme assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmed })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.reply || 'Sorry, I could not process that.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Network error. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Chat Panel */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300" style={{ maxHeight: '480px' }}>
          {/* Header */}
          <div className="bg-[#003366] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="text-sm font-bold">PM Internship Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1 transition-colors">
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: '240px', maxHeight: '340px' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-[#003366] text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-500 px-3 py-2 rounded-2xl rounded-bl-sm text-sm">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-[#003366] text-white rounded-xl hover:bg-[#002244] disabled:opacity-40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* FAB Button with hover tooltip */}
      <div className="group relative">
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 shadow-lg rounded-2xl rounded-br-none px-4 py-2 text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            How can I help you today?
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-[#003366] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#002244] transition-colors focus:ring-4 focus:ring-blue-200"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
        </button>
      </div>
    </div>
  );
};

// ─── Student Dashboard ───────────────────────────────────────────────────────

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  internships,
  appliedRoleIds,
  onApply,
  onOpenAICoach,
  userName = "Student",
  candidates = []
}) => {
  // Search & Filters
  const [search, setSearch] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [activeChips, setActiveChips] = useState<string[]>([]);

  // Dashboard metric computations
  const totalApplied = appliedRoleIds.length;
  const shortlistedCount = candidates.filter(c => c.status === 'Shortlisted').length;
  const awaitingInterviews = candidates.filter(c => c.status === 'Interviewed').length;

  // ── Filter logic ────────────────────────────────
  const locationOptions = ['Delhi NCR', 'Mumbai', 'Bangalore'];
  const durationOptions = ['1 - 3 Months', '3 - 6 Months', '6+ Months'];
  const skillOptions = ['Python', 'Data Analysis', 'Marketing', 'Finance'];

  const parseDurationMonths = (dur: string): number => {
    const match = dur.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const matchesDuration = (roleDuration: string, filter: string): boolean => {
    const months = parseDurationMonths(roleDuration);
    if (filter === '1 - 3 Months') return months >= 1 && months <= 3;
    if (filter === '3 - 6 Months') return months > 3 && months <= 6;
    if (filter === '6+ Months') return months > 6;
    return true;
  };

  const filteredInternships = internships.filter(role => {
    // Text search
    const matchesSearch = !search ||
      role.title.toLowerCase().includes(search.toLowerCase()) ||
      role.company.toLowerCase().includes(search.toLowerCase()) ||
      role.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));

    // Location filter
    const matchesLocation = selectedLocations.length === 0 ||
      selectedLocations.some(loc => role.location.toLowerCase().includes(loc.toLowerCase()));

    // Duration filter
    const matchesDur = !selectedDuration || matchesDuration(role.duration, selectedDuration);

    // Skills filter
    const matchesSkill = selectedSkills.length === 0 ||
      selectedSkills.some(skill => role.tags.some(t => t.toLowerCase().includes(skill.toLowerCase())));

    // Active chip filters
    const matchesChips = activeChips.length === 0 ||
      activeChips.some(chip =>
        role.sector.toLowerCase().includes(chip.toLowerCase()) ||
        role.tags.some(t => t.toLowerCase().includes(chip.toLowerCase()))
      );

    return matchesSearch && matchesLocation && matchesDur && matchesSkill && matchesChips;
  });

  const toggleLocation = (loc: string) => {
    setSelectedLocations(prev =>
      prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
    );
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const removeChip = (chip: string) => {
    setActiveChips(prev => prev.filter(c => c !== chip));
  };

  const clearAllFilters = () => {
    setSelectedLocations([]);
    setSelectedDuration(null);
    setSelectedSkills([]);
    setActiveChips([]);
    setSearch('');
  };

  const hasActiveFilters = selectedLocations.length > 0 || selectedDuration || selectedSkills.length > 0 || activeChips.length > 0;

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-['Hanken_Grotesk',_sans-serif] pt-20 pb-16">
      {/* ── Main Content Area ────────────────────────────── */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-12 w-full">

        {/* ── Welcome & Metric Bento Cards ────────────── */}
        <div className="mb-12">
          <h2 className="text-[32px] font-semibold text-[#001e40] mb-6 leading-[40px]">
            Welcome back, {userName}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metric: Total Jobs Applied */}
            <div className="bg-white border border-[#c3c6d1] rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#43474f] mb-1 font-['Public_Sans']">Total Jobs Applied</p>
                  <p className="text-[48px] font-bold text-[#003366] leading-[56px] tracking-[-0.02em]">{totalApplied}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#d5e3ff] flex items-center justify-center text-[#003366]">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[#012500] font-['Public_Sans']">
                <TrendingUp className="w-4 h-4" />
                <span>+{Math.max(1, Math.floor(totalApplied * 0.12))} this week</span>
              </div>
            </div>

            {/* Metric: Shortlisted Applications */}
            <div className="bg-white border border-[#c3c6d1] rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#43474f] mb-1 font-['Public_Sans']">Shortlisted Applications</p>
                  <p className="text-[48px] font-bold text-[#fe9832] leading-[56px] tracking-[-0.02em]">{shortlistedCount}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#ffdcc2] flex items-center justify-center text-[#683700]">
                  <Star className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 text-xs font-medium text-[#43474f] font-['Public_Sans']">
                Awaiting interviews for {awaitingInterviews}
              </div>
            </div>

            {/* CTA: Discover New Roles */}
            <div className="bg-[#003366] text-white rounded-xl p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-10">
                <Compass className="w-[120px] h-[120px]" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-semibold mb-2">Discover New Roles</h3>
                <p className="text-base opacity-90 mb-4">Over 500+ new internships added today.</p>
              </div>
              <button
                onClick={onOpenAICoach}
                className="bg-white text-[#003366] px-4 py-2 rounded-lg text-sm font-semibold w-fit hover:bg-[#f2f4f6] transition-colors relative z-10 font-['Public_Sans']"
              >
                Explore Now
              </button>
            </div>
          </div>
        </div>

        {/* ── Job Board: Filters + Listings ───────────── */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Sidebar Filters ──────────────────────── */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-white border border-[#c3c6d1] rounded-xl p-6 sticky top-24">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 border-b border-[#c3c6d1] pb-4">
                <h3 className="text-2xl font-semibold text-[#001e40]">Filters</h3>
                <button
                  onClick={clearAllFilters}
                  className={`text-xs font-medium text-[#001e40] hover:underline font-['Public_Sans'] ${!hasActiveFilters ? 'opacity-40 pointer-events-none' : ''}`}
                >
                  Clear All
                </button>
              </div>

              {/* Location Checkboxes */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#43474f] mb-3 uppercase tracking-wider font-['Public_Sans']">Location</h4>
                <div className="flex flex-col gap-2">
                  {locationOptions.map(loc => (
                    <label key={loc} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedLocations.includes(loc)}
                        onChange={() => toggleLocation(loc)}
                        className="rounded border-[#737780] text-[#003366] focus:ring-[#003366]"
                      />
                      <span className="text-base">{loc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration Radio Buttons */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#43474f] mb-3 uppercase tracking-wider font-['Public_Sans']">Duration</h4>
                <div className="flex flex-col gap-2">
                  {durationOptions.map(dur => (
                    <label key={dur} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="duration"
                        checked={selectedDuration === dur}
                        onChange={() => setSelectedDuration(selectedDuration === dur ? null : dur)}
                        className="border-[#737780] text-[#003366] focus:ring-[#003366]"
                      />
                      <span className="text-base">{dur}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Skills Chips */}
              <div>
                <h4 className="text-sm font-semibold text-[#43474f] mb-3 uppercase tracking-wider font-['Public_Sans']">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map(skill => (
                    <span
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border cursor-pointer transition-colors font-['Public_Sans'] ${
                        selectedSkills.includes(skill)
                          ? 'bg-[#003366] text-white border-[#003366]'
                          : 'bg-[#eceef0] text-[#191c1e] border-[#c3c6d1] hover:bg-[#e6e8ea]'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ── Job Listings ─────────────────────────── */}
          <div className="flex-1">
            {/* Search Bar & Active Chips */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative w-full sm:w-2/3 md:w-1/2">
                <Search className="w-5 h-5 text-[#737780] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by role, company, or keyword..."
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#c3c6d1] rounded-lg text-base focus:border-[#003366] focus:ring-1 focus:ring-[#003366] shadow-sm"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {activeChips.map(chip => (
                  <span key={chip} className="px-3 py-1.5 bg-[#ffdcc2] text-[#683700] rounded-lg text-xs font-bold flex items-center gap-1 font-['Public_Sans']">
                    {chip}
                    <button onClick={() => removeChip(chip)} className="hover:text-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Internship Cards */}
            <div className="flex flex-col gap-4">
              {filteredInternships.length === 0 && (
                <div className="bg-white border border-[#c3c6d1] rounded-xl p-12 text-center">
                  <Search className="w-12 h-12 text-[#c3c6d1] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#001e40] mb-1">No internships match your filters</h3>
                  <p className="text-sm text-[#43474f] mb-4">Try adjusting your search or clearing filters.</p>
                  <button onClick={clearAllFilters} className="text-sm font-semibold text-[#001e40] hover:underline">
                    Clear All Filters
                  </button>
                </div>
              )}

              {filteredInternships.map(role => {
                const isApplied = appliedRoleIds.includes(role.id);
                return (
                  <div
                    key={role.id}
                    className="bg-white border border-[#c3c6d1] rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      {/* Left: Role Info */}
                      <div className="flex gap-4">
                        {/* Company Icon Placeholder */}
                        <div className="w-16 h-16 rounded border border-[#c3c6d1] flex items-center justify-center bg-[#f7f9fb] p-2 shrink-0">
                          <span className="text-2xl font-bold text-[#003366]">
                            {role.company.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-semibold text-[#001e40]">{role.title}</h3>
                          <p className="text-base text-[#43474f]">{role.company}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-[#64748B] font-['Public_Sans']">
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {role.location}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {role.duration}</span>
                            <span className="flex items-center gap-1"><Wallet className="w-4 h-4" /> {role.stipend}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Status & Apply */}
                      <div className="flex flex-col items-start md:items-end justify-between border-t md:border-t-0 border-[#c3c6d1] pt-4 md:pt-0 mt-2 md:mt-0">
                        <span className="px-2 py-1 bg-[#f2f4f6] text-[#43474f] rounded text-xs font-medium mb-2 md:mb-0 font-['Public_Sans']">
                          {role.status === 'Open' ? 'Posted 2d ago' : role.status === 'Closing Soon' ? 'Closing soon' : 'Under review'}
                        </span>
                        <button
                          onClick={() => !isApplied && onApply(role)}
                          disabled={isApplied}
                          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors font-['Public_Sans'] ${
                            isApplied
                              ? 'bg-[#d5e3ff] text-[#003366] cursor-default'
                              : 'bg-[#003366] text-white hover:bg-[#002244] focus:ring-2 focus:ring-[#003366] focus:ring-offset-2'
                          }`}
                        >
                          {isApplied ? 'Applied ✓' : 'Apply'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="w-full mt-16 py-8 bg-[#e0e3e5] border-t border-[#c3c6d1] flex flex-col md:flex-row justify-between items-center px-12">
        <div className="text-sm font-black text-[#191c1e] mb-4 md:mb-0 font-['Public_Sans']">
          © 2024 PM Internship Scheme. Government of India.
        </div>
        <div className="flex flex-wrap gap-4 items-center justify-center">
          {['Privacy Policy', 'Terms of Service', 'Accessibility', 'Contact Us'].map(link => (
            <a key={link} href="#" className="text-xs text-[#43474f] hover:text-[#001e40] transition-colors font-['Public_Sans']">
              {link}
            </a>
          ))}
        </div>
      </footer>

      {/* ── Floating Chat Widget ────────────────────────── */}
      <ChatWidget />
    </div>
  );
};
