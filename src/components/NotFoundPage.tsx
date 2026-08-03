import React from 'react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { PortalRole } from '../types';

interface NotFoundPageProps {
  onNavigateHome: (role: PortalRole) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigateHome }) => {
  return (
    <>
      <style>{`
        @font-face {
          font-family: "Geist Mono:SemiBold";
          font-style: normal;
          font-weight: 600;
          font-display: swap;
          src: url("https://static.figma.com/font/GeistMono_wght__1") format("woff2");
        }

        .font-geist {
          font-family: "Geist Mono:SemiBold", monospace;
        }

        .text-gradient-404 {
          background: linear-gradient(
            247.3282658084845deg,
            rgb(255, 255, 255) 2.5334%,
            rgba(255, 255, 255, 0.4) 93.612%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>

      <main className="relative min-h-[100svh] w-full bg-black overflow-x-hidden">

        {/* Cinematic backdrop - consistent with the rest of the portal, in place
            of a hotlinked video asset that isn't guaranteed to stay reachable. */}
        <div className="cinematic-hero-bg" />
        <div className="ambient-glow" />

        {/* Header Brand (matches the main site navigation) */}
        <header
          className="absolute top-[32px] sm:top-[64px] left-1/2 -translate-x-1/2 z-10 flex items-center gap-3"
          aria-label="PM Internship Scheme"
        >
          <div className="w-10 h-10 rounded-xl glass-level-2 flex items-center justify-center border border-white/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-black tracking-tighter text-white flex items-center gap-1.5">
              Internships
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-neutral-300">
                PORTAL
              </span>
            </h2>
            <p className="text-[11px] text-neutral-400">PM Internship Scheme</p>
          </div>
        </header>

        {/* Centered Content Group */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center text-center w-[min(100%-40px,360px)] sm:w-[483px] gap-[28px] sm:gap-[44px]">

          <h1
            className="font-geist text-gradient-404 font-semibold text-[clamp(140px,52vw,200px)] sm:text-[295.751px] leading-[1.1] tracking-[-0.09em] sm:tracking-[-24.6459px] h-auto min-h-0 pb-[30px] -mb-[30px]"
          >
            404
          </h1>

          <div className="w-full sm:w-[425px] h-[1px] bg-white/40 shrink-0" />

          <p className="font-geist text-white font-semibold text-[clamp(16px,4.5vw,20px)] sm:text-[24px] leading-[1.1] tracking-[-1.3px] sm:tracking-[-2px]">
            The path may be broken, but the journey isn't. Let's get you back.
          </p>

          <button
            type="button"
            onClick={() => onNavigateHome('landing')}
            className="liquid-button rounded-full px-6 py-3 text-xs font-bold text-white flex items-center gap-2 mt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Portal Home
          </button>

        </div>
      </main>
    </>
  );
};
