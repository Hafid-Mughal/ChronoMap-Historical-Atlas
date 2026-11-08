import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { GeopoliticalEra, getGeopoliticalEra } from '../data/historicalErasGeo';

interface TimelineScrubberProps {
  currentYear: number;
  currentEra: GeopoliticalEra;
  onYearChange: (year: number) => void;
  onSelectEra: (era: GeopoliticalEra) => void;
  onRequestAISnapshot: (year: number) => void;
  isAiLoading: boolean;
}

// Historical turning-point bookmarks across all centuries (users can also pick ANY integer year -3000 to 2026)
const HISTORICAL_BOOKMARKS: { year: number; label: string; tag: string }[] = [
  { year: -3000, label: '3000 BCE', tag: 'Bronze Dawn' },
  { year: -2334, label: '2334 BCE', tag: 'Akkad & Old Kingdom' },
  { year: -1274, label: '1274 BCE', tag: 'Ramesses II & Hittites' },
  { year: -500, label: '500 BCE', tag: 'Achaemenid & Greece' },
  { year: -323, label: '323 BCE', tag: 'Alexander & Maurya' },
  { year: -221, label: '221 BCE', tag: 'Qin & Punic Wars' },
  { year: 1, label: '1 CE', tag: 'Pax Romana & Han' },
  { year: 117, label: '117 CE', tag: 'Roman Peak (Trajan)' },
  { year: 476, label: '476 CE', tag: 'Fall of West Rome' },
  { year: 750, label: '750 CE', tag: 'Caliphate & Tang' },
  { year: 800, label: '800 CE', tag: 'Charlemagne & Abbasids' },
  { year: 1066, label: '1066 CE', tag: 'High Middle Ages' },
  { year: 1206, label: '1206 CE', tag: 'Genghis Khan' },
  { year: 1279, label: '1279 CE', tag: 'Mongol Pax & Yuan' },
  { year: 1453, label: '1453 CE', tag: 'Fall of Constantinople' },
  { year: 1500, label: '1500 CE', tag: 'Age of Discovery' },
  { year: 1648, label: '1648 CE', tag: 'Peace of Westphalia' },
  { year: 1776, label: '1776 CE', tag: 'US Independence' },
  { year: 1812, label: '1812 CE', tag: 'Napoleonic Peak' },
  { year: 1871, label: '1871 CE', tag: 'German & Italian Unification' },
  { year: 1910, label: '1910 CE', tag: 'Imperial World' },
  { year: 1914, label: '1914 CE', tag: 'WWI Outbreak' },
  { year: 1922, label: '1922 CE', tag: 'USSR & Interwar' },
  { year: 1942, label: '1942 CE', tag: 'WWII Global Fronts' },
  { year: 1947, label: '1947 CE', tag: 'India Partition' },
  { year: 1960, label: '1960 CE', tag: 'Cold War & Decolonization' },
  { year: 1991, label: '1991 CE', tag: 'USSR Dissolution' },
  { year: 2026, label: '2026 CE', tag: 'Modern World' }
];

export const TimelineScrubber: React.FC<TimelineScrubberProps> = ({
  currentYear,
  currentEra,
  onYearChange,
  onSelectEra,
  onRequestAISnapshot,
  isAiLoading
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playStepYears, setPlayStepYears] = useState<number>(1);
  const [yearInputStr, setYearInputStr] = useState<string>(String(Math.abs(currentYear)));
  const [yearInputEra, setYearInputEra] = useState<'BCE' | 'CE'>(currentYear < 0 ? 'BCE' : 'CE');
  const [isMobileExpanded, setIsMobileExpanded] = useState<boolean>(false);

  // Keep input synced when currentYear changes externally
  useEffect(() => {
    setYearInputStr(String(Math.abs(currentYear)));
    setYearInputEra(currentYear < 0 ? 'BCE' : 'CE');
  }, [currentYear]);

  const applyYear = (rawTargetYear: number) => {
    let clamped = Math.max(-3000, Math.min(2026, Math.round(rawTargetYear)));
    if (clamped === 0) clamped = 1; // Historical convention: 1 BCE -> 1 CE
    onYearChange(clamped);
    onSelectEra(getGeopoliticalEra(clamped));
  };

  // Continuous year-by-year timelapse playback
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const nextYear = currentYear + playStepYears;
      if (nextYear > 2026) {
        setIsPlaying(false);
        applyYear(2026);
      } else {
        applyYear(nextYear === 0 ? 1 : nextYear);
      }
    }, 350);
    return () => clearInterval(interval);
  }, [isPlaying, playStepYears, currentYear]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    applyYear(val);
  };

  const handleDirectYearSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(yearInputStr.replace(/[^0-9]/g, ''), 10);
    if (isNaN(parsed)) return;
    const signedYear = yearInputEra === 'BCE' ? -Math.abs(parsed) : Math.abs(parsed);
    applyYear(signedYear);
  };

  const formattedYear =
    currentYear < 0 ? `${Math.abs(currentYear)} BCE` : `${currentYear} CE`;

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 px-2.5 sm:px-4 py-1.5 sm:py-2.5 text-slate-100 shadow-md shrink-0">
      {/* Top row: Exact Year Display, Precision Year Steppers, Direct Year Input & Era Summary */}
      <div className="flex flex-wrap xl:flex-nowrap items-center justify-between gap-1.5 sm:gap-2.5 mb-1.5 sm:mb-2">
        {/* Left: Active Year Badge, Stepper Controls & Direct Year Jump Input */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full xl:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-1.5">
            {/* Active Year Display */}
            <div className="flex items-center bg-slate-800/90 border border-amber-500/40 rounded-lg px-2 sm:px-3 py-0.5 sm:py-1 shadow-sm">
              <span className="hidden sm:inline text-[10px] uppercase tracking-widest text-slate-400 mr-2 font-mono">
                MAP YEAR
              </span>
              <span className="text-sm sm:text-lg font-bold font-mono tracking-tight text-amber-400 whitespace-nowrap">
                {formattedYear}
              </span>
            </div>

            {/* Fine-Grained Year Stepper Controls */}
            <div className="flex items-center gap-0.5 bg-slate-800/60 p-0.5 sm:p-1 rounded-lg border border-slate-700/70">
              <button
                onClick={() => applyYear(currentYear - 100)}
                title="Back 100 Years"
                className="hidden sm:inline-block px-1.5 py-1 text-[11px] font-mono text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer"
              >
                -100y
              </button>
              <button
                onClick={() => applyYear(currentYear - 10)}
                title="Back 10 Years (Decade)"
                className="px-1.5 py-1 text-[10px] sm:text-[11px] font-mono text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer"
              >
                -10y
              </button>
              <button
                onClick={() => applyYear(currentYear - 1)}
                title="Previous Year (-1 Year)"
                className="flex items-center px-1 sm:px-1.5 py-1 text-[10px] sm:text-[11px] font-mono text-amber-300 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>1y</span>
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                title={isPlaying ? 'Pause Year-by-Year Timelapse' : 'Play Continuous Year-by-Year Timelapse'}
                className={`px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium ${
                  isPlaying
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'bg-slate-700/80 text-slate-200 hover:text-white hover:bg-slate-700'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => applyYear(currentYear + 1)}
                title="Next Year (+1 Year)"
                className="flex items-center px-1 sm:px-1.5 py-1 text-[10px] sm:text-[11px] font-mono text-amber-300 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer"
              >
                <span>1y</span>
                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
              <button
                onClick={() => applyYear(currentYear + 10)}
                title="Forward 10 Years (Decade)"
                className="px-1.5 py-1 text-[10px] sm:text-[11px] font-mono text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer"
              >
                +10y
              </button>
              <button
                onClick={() => applyYear(currentYear + 100)}
                title="Forward 100 Years"
                className="hidden sm:inline-block px-1.5 py-1 text-[11px] font-mono text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer"
              >
                +100y
              </button>
            </div>
          </div>

          {/* Mobile right actions: Year Summary button + Expand/Collapse Bookmarks & Jump Input */}
          <div className="flex items-center gap-1 sm:hidden">
            <button
              onClick={() => onRequestAISnapshot(currentYear)}
              disabled={isAiLoading}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium bg-amber-600/90 hover:bg-amber-500 text-white rounded-lg shadow-sm disabled:opacity-50 cursor-pointer"
              title="View World Summary for this year"
            >
              <Sparkles className="w-3 h-3" />
              <span>Year Brief</span>
            </button>
            <button
              onClick={() => setIsMobileExpanded((prev) => !prev)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 cursor-pointer"
              title={isMobileExpanded ? 'Hide Year Jump & Bookmarks' : 'Show Year Jump & Bookmarks'}
            >
              {isMobileExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Timelapse Step Speed Selector */}
          {isPlaying && (
            <button
              onClick={() =>
                setPlayStepYears((s) => (s === 1 ? 5 : s === 5 ? 25 : 1))
              }
              className="text-[10px] sm:text-[11px] font-mono px-2 py-1 bg-amber-950/60 border border-amber-500/50 rounded text-amber-300 hover:bg-amber-900/50 cursor-pointer"
              title="Click to cycle timelapse step (+1 yr, +5 yrs, +25 yrs per tick)"
            >
              +{playStepYears} yr/tick
            </button>
          )}

          {/* Direct "Go to Any Year" Input Box (Always visible on sm+, toggleable on mobile) */}
          <form
            onSubmit={handleDirectYearSubmit}
            className={`${
              isMobileExpanded ? 'flex' : 'hidden sm:flex'
            } items-center gap-1 bg-slate-800/70 border border-slate-700 rounded-lg px-2 py-1`}
            title="Type any exact year between 3000 BCE and 2026 CE and press Go"
          >
            <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <input
              type="text"
              inputMode="numeric"
              value={yearInputStr}
              onChange={(e) => setYearInputStr(e.target.value)}
              placeholder="Year..."
              className="w-14 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-xs font-mono text-white focus:outline-none focus:border-amber-500 text-center"
              aria-label="Enter specific year"
            />
            <button
              type="button"
              onClick={() => {
                const nextEra = yearInputEra === 'CE' ? 'BCE' : 'CE';
                setYearInputEra(nextEra);
                const parsed = parseInt(yearInputStr.replace(/[^0-9]/g, ''), 10);
                if (!isNaN(parsed)) {
                  applyYear(nextEra === 'BCE' ? -Math.abs(parsed) : Math.abs(parsed));
                }
              }}
              className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-slate-700 hover:bg-slate-600 text-amber-300 rounded cursor-pointer"
              title="Toggle BCE / CE"
            >
              {yearInputEra}
            </button>
            <button
              type="submit"
              className="px-2 py-0.5 text-[10px] font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded transition-colors cursor-pointer"
            >
              Go
            </button>
          </form>
        </div>

        {/* Center: Dynamic Year Context Banner (Hidden on compact mobile unless expanded) */}
        <div className="hidden md:block text-center max-w-xl px-2 min-w-0">
          <div className="text-xs sm:text-sm font-semibold text-slate-100 flex items-center justify-center gap-2 flex-wrap">
            <span className="text-amber-300 truncate">{currentEra.epochName}</span>
            <span className="text-[11px] text-sky-400 font-mono">
              [{formattedYear}]
            </span>
          </div>
          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
            {currentEra.summary}
          </p>
        </div>

        {/* Right: World Snapshot on exact chosen year (sm and up) */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            onClick={() => onRequestAISnapshot(currentYear)}
            disabled={isAiLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-amber-600/90 hover:bg-amber-500 text-white rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            title="View global historical summary for this exact year"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAiLoading ? 'Loading...' : `World Brief: ${formattedYear}`}</span>
          </button>
        </div>
      </div>

      {/* Middle row: Continuous Year-by-Year Scrollbar (step=1, every single year from -3000 to 2026) */}
      <div className="relative w-full my-0.5 sm:my-1 px-0.5 sm:px-1">
        <div className="flex items-center gap-2">
          <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 shrink-0">3000 BCE</span>
          <input
            type="range"
            min={-3000}
            max={2026}
            step={1}
            value={currentYear}
            onChange={handleSliderChange}
            className="w-full h-3 sm:h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 touch-pan-y"
            aria-label="Continuous Historical Year Scrollbar (-3000 BCE to 2026 CE, 1-year resolution)"
          />
          <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 shrink-0">2026 CE</span>
        </div>

        {/* Scale Ticks along the continuous scrollbar (Hidden on narrow mobile to save vertical space) */}
        <div className="hidden md:flex justify-between text-[9px] text-slate-500 font-mono mt-1 px-12 select-none">
          <button onClick={() => applyYear(-2500)} className="hover:text-amber-400 cursor-pointer">2500 BCE</button>
          <button onClick={() => applyYear(-2000)} className="hover:text-amber-400 cursor-pointer">2000 BCE</button>
          <button onClick={() => applyYear(-1500)} className="hover:text-amber-400 cursor-pointer">1500 BCE</button>
          <button onClick={() => applyYear(-1000)} className="hover:text-amber-400 cursor-pointer">1000 BCE</button>
          <button onClick={() => applyYear(-500)} className="hover:text-amber-400 cursor-pointer">500 BCE</button>
          <button onClick={() => applyYear(1)} className="hover:text-amber-400 cursor-pointer">1 CE</button>
          <button onClick={() => applyYear(500)} className="hover:text-amber-400 cursor-pointer">500 CE</button>
          <button onClick={() => applyYear(1000)} className="hover:text-amber-400 cursor-pointer">1000 CE</button>
          <button onClick={() => applyYear(1500)} className="hover:text-amber-400 cursor-pointer">1500 CE</button>
          <button onClick={() => applyYear(1800)} className="hover:text-amber-400 cursor-pointer">1800 CE</button>
          <button onClick={() => applyYear(1914)} className="hover:text-amber-400 cursor-pointer">1914 CE</button>
          <button onClick={() => applyYear(1945)} className="hover:text-amber-400 cursor-pointer">1945 CE</button>
          <button onClick={() => applyYear(1991)} className="hover:text-amber-400 cursor-pointer">1991 CE</button>
        </div>
      </div>

      {/* Bottom row: Historical Turning-Point Bookmarks (Always visible on sm+, toggleable on mobile) */}
      <div
        className={`${
          isMobileExpanded ? 'flex' : 'hidden sm:flex'
        } items-center gap-1.5 overflow-x-auto pt-1.5 pb-0.5 scrollbar-none`}
      >
        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider whitespace-nowrap shrink-0 mr-1 flex items-center gap-1">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>Bookmarks:</span>
        </span>
        {HISTORICAL_BOOKMARKS.map((bm) => {
          const isExactMatch = currentYear === bm.year;
          return (
            <button
              key={bm.year}
              onClick={() => applyYear(bm.year)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                isExactMatch
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
              }`}
              title={`${bm.label}: ${bm.tag}`}
            >
              <span>{bm.label}</span>
              <span className={`ml-1 text-[9px] ${isExactMatch ? 'text-slate-900' : 'text-slate-400'}`}>
                · {bm.tag}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
