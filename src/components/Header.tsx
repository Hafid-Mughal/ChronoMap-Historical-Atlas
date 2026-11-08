import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Globe,
  Search,
  X,
  MapPin,
  Landmark,
  User,
  ShieldAlert,
  Sparkles,
  Calendar,
  ArrowRight,
  AlertCircle,
  Mail,
  GraduationCap,
  Copy,
  Check
} from 'lucide-react';
import {
  HistoricalSearchItem,
  HISTORICAL_SEARCH_INDEX,
  searchHistoricalAtlas,
  isFictionalOrNonHistoricalQuery
} from '../data/historicalSearchIndex';
import { projectCoordinates } from '../data/geoService';
import { resolveWikipediaDeepSearch } from '../data/localHistorianFallback';

interface HeaderProps {
  onSelectSearchResult: (item: HistoricalSearchItem) => void;
}

const FEATURED_SUGGESTIONS: string[] = [
  'fig_simo_hayha',
  'fig_alexander',
  'emp_wallachia',
  'fig_vlad_impaler',
  'city_constantinople',
  'fig_mansa_musa'
];

export const Header: React.FC<HeaderProps> = ({
  onSelectSearchResult
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(0);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [notFoundError, setNotFoundError] = useState<string | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isInstantNonRelevant = useMemo(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return false;
    return isFictionalOrNonHistoricalQuery(trimmed);
  }, [searchQuery]);

  const results = useMemo(() => {
    if (!searchQuery.trim()) {
      return HISTORICAL_SEARCH_INDEX.filter((item) =>
        FEATURED_SUGGESTIONS.includes(item.id)
      );
    }
    if (isInstantNonRelevant) {
      return [];
    }
    return searchHistoricalAtlas(searchQuery, 8);
  }, [searchQuery, isInstantNonRelevant]);

  // Reset highlighted index & clear previous deep-search error when query changes
  useEffect(() => {
    setHighlightedIdx(0);
    setNotFoundError(null);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectItem = (item: HistoricalSearchItem) => {
    setNotFoundError(null);
    setIsSearchOpen(false);
    setSearchQuery(item.title);
    onSelectSearchResult(item);
  };

  // Historical & Geographic Deep Search Resolver (rejects fictional characters/places & non-relevant queries)
  const handleAiDeepSearch = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || isAiSearching) return;

    if (isFictionalOrNonHistoricalQuery(trimmed)) {
      setIsSearchOpen(true);
      setNotFoundError(
        `We could not find "${trimmed}" anywhere. Please search for a real historical person, place, empire, or conflict.`
      );
      return;
    }

    // If fuzzy local index already has a top match, select it immediately
    const instantMatches = searchHistoricalAtlas(trimmed, 1);
    if (instantMatches.length > 0) {
      handleSelectItem(instantMatches[0]);
      return;
    }

    setIsAiSearching(true);
    setNotFoundError(null);
    try {
      const res = await fetch('/api/history/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed })
      });
      const contentType = res.headers.get('content-type') || '';
      const data =
        res.ok && contentType.includes('application/json')
          ? await res.json()
          : await resolveWikipediaDeepSearch(trimmed);

      if (data?.notFound) {
        setIsSearchOpen(true);
        setNotFoundError(
          data.message ||
            `We could not find "${trimmed}" anywhere. Please search for a real historical person, place, empire, or conflict.`
        );
        return;
      }

      const yearNum = typeof data.year === 'number' ? data.year : 2026;
      const yearDisp = yearNum < 0 ? `${Math.abs(yearNum)} BCE` : `${yearNum} CE`;
      const svgCoords = projectCoordinates(
        typeof data.longitude === 'number' ? data.longitude : 25.45,
        typeof data.latitude === 'number' ? data.latitude : 44.92
      );

      const resolvedItem: HistoricalSearchItem = {
        id: `ai_search_${Date.now()}`,
        title: data.title || trimmed,
        subtitle: data.subtitle || `Historical Reference (${yearDisp})`,
        category: data.category || 'figure',
        year: yearNum,
        yearDisplay: yearDisp,
        svgCoords,
        zoomScale: 2.6,
        modernCountry: data.modernCountry || trimmed,
        summary: data.summary || `Historical analysis and location for ${trimmed}.`,
        keywords: [trimmed.toLowerCase()]
      };

      handleSelectItem(resolvedItem);
    } catch {
      const data = await resolveWikipediaDeepSearch(trimmed);
      if (data?.notFound) {
        setIsSearchOpen(true);
        setNotFoundError(
          data.message ||
            `We could not find "${trimmed}" anywhere. Please search for a real historical person, place, empire, or conflict.`
        );
        return;
      }

      const yearNum = typeof data.year === 'number' ? data.year : 2026;
      const yearDisp = yearNum < 0 ? `${Math.abs(yearNum)} BCE` : `${yearNum} CE`;
      const svgCoords = projectCoordinates(data.longitude, data.latitude);

      handleSelectItem({
        id: `ai_search_${Date.now()}`,
        title: data.title,
        subtitle: data.subtitle,
        category: data.category,
        year: yearNum,
        yearDisplay: yearDisp,
        svgCoords,
        zoomScale: 2.6,
        modernCountry: data.modernCountry,
        summary: data.summary,
        keywords: [trimmed.toLowerCase()]
      });
    } finally {
      setIsAiSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsSearchOpen(true);
      setHighlightedIdx((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsSearchOpen(true);
      setHighlightedIdx((prev) =>
        results.length > 0 ? (prev - 1 + results.length) % results.length : 0
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0 && highlightedIdx < results.length) {
        handleSelectItem(results[highlightedIdx]);
      } else if (searchQuery.trim()) {
        handleAiDeepSearch(searchQuery);
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText('hafidmahmoodmughal@gmail.com');
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const renderCategoryBadge = (category: HistoricalSearchItem['category']) => {
    switch (category) {
      case 'figure':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-purple-950/80 text-purple-300 border border-purple-700/50">
            <User className="w-2.5 h-2.5" />
            <span>Figure</span>
          </span>
        );
      case 'city':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-sky-950/80 text-sky-300 border border-sky-700/50">
            <MapPin className="w-2.5 h-2.5" />
            <span>City</span>
          </span>
        );
      case 'empire':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-950/80 text-amber-300 border border-amber-700/50">
            <Landmark className="w-2.5 h-2.5" />
            <span>Empire</span>
          </span>
        );
      case 'conflict':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-red-950/80 text-red-300 border border-red-700/50">
            <ShieldAlert className="w-2.5 h-2.5" />
            <span>Conflict</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-700/50">
            <Globe className="w-2.5 h-2.5" />
            <span>Country</span>
          </span>
        );
    }
  };

  const showNotFoundBanner = Boolean(isInstantNonRelevant || notFoundError);

  return (
    <>
      <header className="flex items-center justify-between gap-2 sm:gap-4 px-2.5 sm:px-6 py-2 sm:py-3 bg-slate-900 border-b border-slate-800 text-slate-100 select-none shrink-0 z-40">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-sm sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-1.5 sm:gap-2">
            <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
            <span>ChronoMap</span>
          </div>
        </div>

        {/* Zone 2: Universal Search Bar (Countries, Cities, Empires & Historical Figures) */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-md mx-auto min-w-0">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-2.5 sm:left-3 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search country, figure, or title (e.g. White Death)..."
              className="w-full bg-slate-950/90 border border-slate-700/90 focus:border-amber-500 rounded-xl pl-8 sm:pl-9 pr-7 sm:pr-8 py-1.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setNotFoundError(null);
                  inputRef.current?.focus();
                }}
                className="absolute right-2 text-slate-400 hover:text-slate-200 p-0.5 rounded cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown (Fixed full-width on mobile, anchored popover on tablet/desktop) */}
          {isSearchOpen && (
            <div className="fixed sm:absolute left-2 right-2 sm:left-0 sm:right-0 top-12 sm:top-full mt-1 sm:mt-1.5 bg-slate-900/98 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="px-3 py-1.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                <span className="truncate">
                  {showNotFoundBanner
                    ? 'Person or Place Not Found'
                    : searchQuery.trim()
                    ? 'Matching Countries, Cities & Figures'
                    : 'Featured Historical Jumps'}
                </span>
                <span className="text-amber-400 shrink-0">
                  {showNotFoundBanner ? 'No Match' : 'Auto-Jump'}
                </span>
              </div>

              <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto divide-y divide-slate-800/70">
                {/* Message when user searches a fictional character/place or anything non-relevant */}
                {showNotFoundBanner && (
                  <div className="px-4 py-4 bg-red-950/25 border-b border-red-900/40 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-semibold text-red-200">
                        Could not find "{searchQuery.trim()}" anywhere
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-300 mt-1 leading-relaxed">
                        {notFoundError ||
                          `We could not find this person or place anywhere in our historical atlas. Fictional characters, fictional worlds, and non-historical topics cannot be located on the map.`}
                      </p>
                    </div>
                  </div>
                )}

                {results.map((item, idx) => {
                  const isHighlighted = idx === highlightedIdx;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      onMouseEnter={() => setHighlightedIdx(idx)}
                      className={`w-full text-left px-3 sm:px-3.5 py-2.5 flex items-start justify-between gap-2.5 transition-colors cursor-pointer ${
                        isHighlighted ? 'bg-slate-800/90' : 'hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          {renderCategoryBadge(item.category)}
                          <span className="text-xs sm:text-sm font-semibold text-white truncate">
                            {item.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>

                      <div className="flex flex-col items-end shrink-0 gap-1">
                        <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-semibold">
                          <Calendar className="w-2.5 h-2.5" />
                          <span>{item.yearDisplay}</span>
                        </span>
                        <span className="text-[10px] text-sky-400 flex items-center gap-0.5">
                          <span className="hidden xs:inline">Inspect</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </button>
                  );
                })}

                {/* Deep Search option for custom historical figures, battles, or ancient cities (hidden when already identified as not found) */}
                {searchQuery.trim().length > 1 && !showNotFoundBanner && (
                  <button
                    onClick={() => handleAiDeepSearch(searchQuery)}
                    disabled={isAiSearching}
                    className="w-full text-left px-3.5 py-2.5 bg-amber-950/30 hover:bg-amber-950/50 transition-colors flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Sparkles
                        className={`w-4 h-4 text-amber-400 shrink-0 ${
                          isAiSearching ? 'animate-spin' : ''
                        }`}
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-amber-300 truncate">
                          {isAiSearching
                            ? `Searching archives for "${searchQuery.trim()}"...`
                            : `Deep Locate "${searchQuery.trim()}"`}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          Verify historical person or place & locate on map
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Zone 3: About Me / Developer Profile Icon Button */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            onClick={() => setIsAboutOpen(true)}
            title="About the Developer"
            aria-label="About the Developer"
            className="p-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 rounded-lg transition-all cursor-pointer"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Formal About the Developer Modal */}
      {isAboutOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsAboutOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Accent Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-sky-500 to-emerald-500" />

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
                    Developer Profile
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    About the Developer
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setIsAboutOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Name & Origin Card */}
              <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      Name
                    </div>
                    <div className="text-base font-bold text-white mt-0.5">
                      Hafid Mahmood Mughal
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/70 border border-emerald-700/50 text-emerald-300 text-xs font-medium shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Pakistan</span>
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-300">
                  <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>BS Computer Science (BSCS) Student</span>
                </div>
              </div>

              {/* Formal Description Section */}
              <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  About
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  A BSCS student from Pakistan working and trying to improve his skills through
                  building interactive software applications and full-stack web projects.
                </p>
              </div>

              {/* Contact / Email Section */}
              <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Contact Information
                </div>
                <div className="flex items-center justify-between gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2">
                  <a
                    href="mailto:hafidmahmoodmughal@gmail.com"
                    className="flex items-center gap-2 text-xs sm:text-sm text-sky-400 hover:text-sky-300 font-mono truncate transition-colors"
                  >
                    <Mail className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className="truncate">hafidmahmoodmughal@gmail.com</span>
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors shrink-0 cursor-pointer"
                    title="Copy email address"
                  >
                    {emailCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>ChronoMap Historical Atlas</span>
              <button
                onClick={() => setIsAboutOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
