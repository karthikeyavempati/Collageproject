import React, { useState } from 'react';
import { InternshipRole, PortalRole } from '../types';
import { 
  ShieldCheck, 
  ArrowRight, 
  Globe, 
  Users, 
  Rocket, 
  Sparkles, 
  Search, 
  Building2, 
  MapPin, 
  CheckCircle,
  ChevronDown
} from 'lucide-react';

interface LandingPageProps {
  internships: InternshipRole[];
  onApply: (role: InternshipRole) => void;
  onNavigateToPortal: (role: PortalRole) => void;
}

/* ─── Tricolor accent bar reused in multiple places ─── */
const TricolorBar = ({ className = '' }: { className?: string }) => (
  <div className={`flex w-full ${className}`}>
    <div className="flex-1 bg-[#FF9933]" />
    <div className="flex-1 bg-white border-y border-gray-100" />
    <div className="flex-1 bg-[#138808]" />
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({
  internships,
  onApply,
  onNavigateToPortal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');

  const sectors = ['All', 'Technology & Business', 'Enterprise Tech', 'Business Strategy', 'Digital Infrastructure', 'Artificial Intelligence'];

  const filteredInternships = internships.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSector = selectedSector === 'All' || item.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="relative min-h-screen text-gray-900 selection:bg-orange-100 selection:text-orange-900 pt-20 sm:pt-24 pb-24 md:pb-16 overflow-x-hidden"
      style={{ background: 'linear-gradient(160deg, #fff7ed 0%, #f9fafb 40%, #f0fdf4 100%)' }}>

      {/* ── Tricolor top stripe ─────────────────────────────── */}
      <TricolorBar className="h-1.5 fixed top-1 left-0 right-0 z-[55]" />

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative flex flex-col justify-center px-4 sm:px-6 md:px-16 py-8 sm:py-12 md:py-16 max-w-7xl mx-auto">
        {/* Subtle tricolor radial blobs in background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #FF9933 0%, transparent 70%)' }} />
          <div className="absolute -top-10 right-0 w-72 h-72 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #138808 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-1/2 w-96 h-40 rounded-full opacity-10"
            style={{ background: 'radial-gradient(ellipse, #003580 0%, transparent 70%)' }} />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* ── Left: Text content ── */}
          <div className="mt-6">
            {/* Tricolor badge */}
            <div className="inline-flex items-center gap-0 mb-6 rounded-full overflow-hidden border border-gray-200 shadow-sm">
              <span className="px-3 py-1.5 bg-[#FF9933] text-white text-[10px] font-extrabold tracking-widest uppercase">PM</span>
              <span className="px-3 py-1.5 bg-white text-gray-800 text-[10px] font-extrabold tracking-widest uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#003580]" /> Internship Scheme
              </span>
              <span className="px-3 py-1.5 bg-[#138808] text-white text-[10px] font-extrabold tracking-widest uppercase">GOI</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6"
              style={{ color: '#003580' }}>
              Empowering Youth<br />
              <span style={{ color: '#FF9933' }}>for a Better India.</span>
            </h1>

            <p className="text-base md:text-lg text-gray-700 max-w-xl mb-10 leading-relaxed font-normal">
              An initiative launched by the Government of India, designed to provide valuable internship opportunities for the youth with India's top 500 companies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={() => onNavigateToPortal('student')}
                className="rounded-md px-8 py-4 text-sm font-bold text-white flex items-center justify-center gap-2 group cursor-pointer shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(90deg, #003580, #005E93)' }}
              >
                Register / Login as Candidate
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateToPortal('employer')}
                className="rounded-md px-8 py-4 text-sm font-semibold bg-white border flex items-center justify-center gap-2 hover:bg-orange-50 transition-colors cursor-pointer shadow-sm"
                style={{ borderColor: '#FF9933', color: '#B36200' }}
              >
                <Building2 className="w-4 h-4" style={{ color: '#FF9933' }} />
                Partner Company Portal
              </button>
            </div>

            {/* Scroll Indicator */}
            <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-widest opacity-80">
              <span>Explore Scheme Impact</span>
              <ChevronDown className="w-4 h-4 animate-bounce" style={{ color: '#FF9933' }} />
            </div>
          </div>

          {/* ── Right: PM Portrait + Flag ── */}
          <div className="flex flex-col items-center gap-6">
            {/* PM Portrait Card with tricolor top bar */}
            <div className="w-full max-w-sm relative">
              <TricolorBar className="h-2 rounded-t-2xl absolute -top-2 left-0 right-0" />
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden pt-2">
                <img
                  src="/assets/pm_portrait.png"
                  alt="Hon. Prime Minister of India – PM Internship Scheme Initiator"
                  className="w-full h-72 object-cover object-top"
                />
                <div className="relative px-4 py-3 text-center overflow-hidden"
                  style={{ background: 'linear-gradient(90deg, #003580, #001F5B)' }}>
                  {/* Subtle saffron left border */}
                  <div className="absolute left-0 top-0 h-full w-1 bg-[#FF9933]" />
                  <p className="text-sm font-bold text-white">Shri Narendra Modi</p>
                  <p className="text-[11px] mt-0.5" style={{ color: '#FF9933' }}>Hon. Prime Minister of India</p>
                </div>
              </div>
            </div>

            {/* Indian Flag */}
            <div className="w-full max-w-sm rounded-xl overflow-hidden border border-gray-200 shadow-md">
              <img
                src="/assets/india_flag.png"
                alt="Tiranga – National Flag of India"
                className="w-full h-32 object-cover"
              />
              <div className="bg-white px-4 py-2 text-center border-t border-gray-100 flex items-center justify-center gap-3">
                <span className="text-lg">🇮🇳</span>
                <span className="text-xs font-bold" style={{ color: '#138808' }}>Jai Hind</span>
                <span className="text-gray-300">|</span>
                <span className="text-xs font-bold" style={{ color: '#FF9933' }}>Bharat Mata Ki Jai</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ STATISTICS ROW ═══════════════ */}
      <section className="relative z-10 shadow-sm">
        {/* Tricolor top border */}
        <TricolorBar className="h-1" />
        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {/* Stat 1 – Saffron accent */}
            <div className="flex flex-col items-center md:items-start px-6 border-l-4 border-[#FF9933] py-2">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1" style={{ color: '#FF9933' }}>12,500+</span>
              <span className="text-xs uppercase tracking-widest font-bold text-gray-500">Verified Placements</span>
            </div>
            {/* Stat 2 – Blue accent */}
            <div className="flex flex-col items-center md:items-start px-6 border-l-4 border-[#003580] py-2">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1" style={{ color: '#003580' }}>500+</span>
              <span className="text-xs uppercase tracking-widest font-bold text-gray-500">Top Indian Companies</span>
            </div>
            {/* Stat 3 – Green accent */}
            <div className="flex flex-col items-center md:items-start px-6 border-l-4 border-[#138808] py-2">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1" style={{ color: '#138808' }}>100%</span>
              <span className="text-xs uppercase tracking-widest font-bold text-gray-500">Transparent Merit Matching</span>
            </div>
          </div>
        </div>
        <TricolorBar className="h-1" />
      </section>

      {/* ═══════════════ PATRIOTIC FLAG BANNER ═══════════════ */}
      <section className="relative z-10 overflow-hidden">
        <img
          src="/assets/india_flag.png"
          alt="Indian National Flag"
          className="w-full h-44 md:h-60 object-cover"
          style={{ objectPosition: 'center 40%' }}
        />
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(0,53,128,0.70) 0%, rgba(19,136,8,0.50) 100%)' }}>
          <div className="text-center px-4">
            <p className="text-white text-2xl md:text-4xl font-extrabold tracking-wide drop-shadow-lg">
              🇮🇳 &nbsp; जय हिन्द &nbsp;—&nbsp; Jai Hind
            </p>
            <p className="text-blue-100 text-sm mt-2 font-medium">
              "A developed India by 2047 — Viksit Bharat — is our shared vision."
            </p>
            <p className="text-xs mt-1 font-bold" style={{ color: '#FF9933' }}>
              — Prime Minister's Office, Government of India
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════ SCHEME HIGHLIGHTS ═══════════════ */}
      <section className="py-20 md:py-28 px-4 md:px-16 max-w-7xl mx-auto relative z-10">
        {/* Section heading with saffron underline */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-2" style={{ color: '#003580' }}>Scheme Highlights</h2>
          <div className="h-1 w-16 rounded-full mb-3" style={{ background: '#FF9933' }} />
          <p className="text-gray-600 text-base max-w-xl">
            Designed for high impact, enterprise visibility, and rapid professional acceleration across state and global sectors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6">
          {/* Feature 1 – Blue theme (India Navy) */}
          <div className="col-span-1 sm:col-span-8 bg-white border-t-4 border-[#003580] shadow-md rounded-2xl p-6 sm:p-8 relative overflow-hidden group min-h-[240px] sm:min-h-[300px] flex flex-col justify-end"
            style={{ borderColor: '#003580' }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-5"
              style={{ background: '#003580' }} />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6 border-2"
                style={{ background: '#EEF4FF', borderColor: '#003580' }}>
                <Globe className="w-6 h-6" style={{ color: '#003580' }} />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#003580' }}>Direct Enterprise Integration</h3>
              <p className="text-gray-600 text-sm max-w-lg leading-relaxed">
                Bypass conventional multi-tiered applications. Direct placement into global-level initiatives, enterprise projects, and leading companies in India.
              </p>
            </div>
          </div>

          {/* Feature 2 – Saffron theme */}
          <div className="col-span-1 sm:col-span-4 border-t-4 rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[240px] sm:min-h-[300px]"
            style={{ background: 'linear-gradient(160deg, #FFF3E0, #FFECD2)', borderColor: '#FF9933' }}>
            <div>
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-6 border-2 shadow-sm"
                style={{ borderColor: '#FF9933' }}>
                <Users className="w-6 h-6" style={{ color: '#FF9933' }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#B36200' }}>Elite Mentorship</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Structured alignment with senior enterprise leaders and industry experts. Direct knowledge transfer for strategic leadership.
              </p>
            </div>
            <div className="mt-6 pt-4" style={{ borderTop: '1px solid #FF993340' }}>
              <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5"
                style={{ color: '#B36200' }}>
                Verified Curriculum <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Feature 3 – Green theme (full width) */}
          <div className="col-span-1 sm:col-span-12 bg-white border-t-4 shadow-md rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8"
            style={{ borderColor: '#138808' }}>
            <div className="max-w-xl">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6 border-2"
                style={{ background: '#F0FFF0', borderColor: '#138808' }}>
                <Rocket className="w-6 h-6" style={{ color: '#138808' }} />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#138808' }}>Financial Assistance & Career Catalyst</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Receive accredited experience, monthly stipends directly via DBT, and fast-track consideration for future roles.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-md border text-xs font-semibold"
                  style={{ background: '#F0FFF0', borderColor: '#138808', color: '#138808' }}>
                  Monthly Stipend ₹5,000 via DBT
                </span>
                <span className="px-3 py-1 rounded-md border text-xs font-semibold"
                  style={{ background: '#FFF7ED', borderColor: '#FF9933', color: '#B36200' }}>
                  One-time Grant ₹6,000
                </span>
              </div>
            </div>

            <div className="w-full md:w-80 h-40 rounded-xl p-4 flex flex-col justify-center items-center text-center border-2 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #EEF4FF, #F0FFF0)', borderColor: '#003580' }}>
              {/* Tricolor inner accent */}
              <TricolorBar className="h-1 absolute top-0 left-0 right-0" />
              <Sparkles className="w-8 h-8 mb-2 animate-pulse" style={{ color: '#FF9933' }} />
              <div className="text-base font-bold" style={{ color: '#003580' }}>Merit-Based Match</div>
              <div className="text-xs mt-1" style={{ color: '#138808' }}>Automated scoring & district preference matching</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ INTERNSHIP OPENINGS ═══════════════ */}
      <section id="internships" className="py-16 px-4 md:px-16 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#003580' }}>Featured Internship Openings</h2>
            <div className="h-1 w-12 rounded-full mb-2" style={{ background: '#138808' }} />
            <p className="text-gray-600 text-sm">Explore verified opportunities across partner companies.</p>
          </div>

          <button 
            onClick={() => onNavigateToPortal('student')}
            className="text-xs font-bold uppercase tracking-widest flex items-center gap-1 self-start md:self-auto hover:underline"
            style={{ color: '#003580' }}
          >
            Go to Student Portal <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between"
          style={{ borderTop: '3px solid #FF9933' }}>
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search roles, skills, companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md pl-9 pr-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all"
              style={{ borderColor: undefined }}
              onFocus={e => e.target.style.borderColor = '#FF9933'}
              onBlur={e => e.target.style.borderColor = ''}
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {sectors.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all border"
                style={selectedSector === sec
                  ? { background: '#003580', color: '#fff', borderColor: '#003580' }
                  : { background: '#f9fafb', color: '#374151', borderColor: '#e5e7eb' }}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInternships.map((role, idx) => {
            // Rotate tricolor accent per card
            const accentColors = ['#FF9933', '#003580', '#138808'];
            const accent = accentColors[idx % 3];
            return (
              <div
                key={role.id}
                className="bg-white shadow-sm rounded-xl p-6 flex flex-col justify-between hover:shadow-md transition-all group border border-gray-200"
                style={{ borderTop: `3px solid ${accent}` }}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold border"
                      style={{ background: '#F0FFF0', borderColor: '#138808', color: '#138808' }}>
                      {role.stipend}
                    </span>
                    {role.matchScore && (
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold border flex items-center gap-1"
                        style={{ background: '#EEF4FF', borderColor: '#003580', color: '#003580' }}>
                        <Sparkles className="w-3 h-3" style={{ color: '#FF9933' }} />
                        {role.matchScore}% Match
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#003580] transition-colors mb-1">
                    {role.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3 flex items-center gap-1.5 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-gray-400" /> {role.company}
                  </p>

                  <p className="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                    {role.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {role.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded text-[10px] text-gray-600 bg-gray-50 border border-gray-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between" style={{ borderTop: `1px solid ${accent}30` }}>
                  <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" /> {role.location}
                  </span>

                  <button
                    onClick={() => onApply(role)}
                    className="rounded-md px-4 py-1.5 text-xs font-bold text-white flex items-center gap-1 transition-colors shadow-sm hover:opacity-90"
                    style={{ background: accent }}
                  >
                    Apply Now <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════ PM MESSAGE + CTA ═══════════════ */}
      <section className="py-16 px-4 md:px-16 max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

          {/* PM Quote Card – Navy Blue + tricolor top */}
          <div className="rounded-2xl p-8 shadow-xl text-white relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #003580, #001A4F)' }}>
            <TricolorBar className="h-1.5 absolute top-0 left-0 right-0" />
            <div className="flex items-start gap-4 mt-2">
              <img
                src="/assets/pm_portrait.png"
                alt="PM of India"
                className="w-20 h-20 rounded-full object-cover object-top shadow-md flex-shrink-0"
                style={{ border: '3px solid #FF9933' }}
              />
              <div>
                <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-2">
                  Message from the Prime Minister
                </p>
                <blockquote className="text-white text-sm leading-relaxed italic">
                  "This scheme aims to equip one crore youth with real-world skills and experience at India's top companies, bridging the gap between education and industry."
                </blockquote>
                <p className="mt-3 text-xs font-bold" style={{ color: '#FF9933' }}>
                  — Shri Narendra Modi, Prime Minister of India
                </p>
              </div>
            </div>
          </div>

          {/* CTA Card – Green top bar */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg relative overflow-hidden">
            <TricolorBar className="h-1.5 absolute top-0 left-0 right-0" />
            <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4" style={{ color: '#003580' }}>
              Ready to Begin Your Journey?
            </h2>
            <p className="text-gray-600 text-sm mb-8">
              Join thousands of youth transforming their careers through practical experience and mentorship at India's top companies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onNavigateToPortal('student')}
                className="rounded-md px-8 py-4 text-sm font-bold text-white flex items-center justify-center gap-2 shadow-md transition-all hover:-translate-y-0.5"
                style={{ background: '#FF9933' }}
              >
                Register Now <CheckCircle className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => onNavigateToPortal('login')}
                className="rounded-md px-8 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors border hover:opacity-80"
                style={{ background: '#F0FFF0', borderColor: '#138808', color: '#138808' }}
              >
                Already Registered? Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="bg-white relative z-10">
        <TricolorBar className="h-1" />
        <div className="py-8 px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-2xl">🇮🇳</span>
            <p className="text-sm font-bold" style={{ color: '#003580' }}>
              Ministry of Corporate Affairs, Government of India
            </p>
          </div>
          <p className="text-xs text-gray-500">
            © 2026 PM Internship Scheme. All rights reserved. Designed and developed for the Prime Minister's Internship Scheme.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <span className="text-[11px] font-semibold" style={{ color: '#FF9933' }}>Jai Hind</span>
            <span className="text-[11px] font-semibold text-gray-400">|</span>
            <span className="text-[11px] font-semibold" style={{ color: '#003580' }}>Vande Mataram</span>
            <span className="text-[11px] font-semibold text-gray-400">|</span>
            <span className="text-[11px] font-semibold" style={{ color: '#138808' }}>Bharat Mata Ki Jai</span>
          </div>
        </div>
        <TricolorBar className="h-1" />
      </footer>
    </div>
  );
};
