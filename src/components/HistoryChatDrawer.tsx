import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Landmark,
  Compass,
  Users,
  BookOpen,
  AlertCircle,
  ShieldAlert,
  AlertTriangle,
  Calendar,
  Radio,
  History,
  Globe,
  Coins,
  Shield,
  Mountain,
  Clock,
  Sparkles,
  Waves,
  Route
} from 'lucide-react';
import { MapRegion } from '../data/worldMapData';
import { ConflictZone } from '../data/conflictZones';
import {
  ArchaeologicalSite,
  generateArchaeologicalSiteYearDossier
} from '../data/archaeologicalSitesData';
import {
  SelectedPhysicalFeature,
  SelectedTradeFeature
} from '../data/mapLayersData';
import {
  generatePlaceYearDossier,
  generateConflictYearDossier
} from '../data/yearlyChronicleEngine';

interface HistoryChatDrawerProps {
  isOpen: boolean;
  onToggleOpen: (open: boolean) => void;
  selectedRegion: MapRegion | null;
  selectedConflict: ConflictZone | null;
  selectedArchSite?: ArchaeologicalSite | null;
  selectedPhysicalFeature?: SelectedPhysicalFeature | null;
  selectedTradeFeature?: SelectedTradeFeature | null;
  onClearSelection: () => void;
  year: number;
}

interface DeepDiveEnrichment {
  key: string;
  yearHeadline?: string;
  yearRuler?: string;
  yearCapital?: string;
  generalOverview?: string;
  yearDetailedNarrative?: string;
  yearMajorEvents?: string[];
  yearPoliticalAndDiplomaticState?: string;
  yearEconomicAndSocialDevelopments?: string;
}

export const HistoryChatDrawer: React.FC<HistoryChatDrawerProps> = ({
  isOpen,
  onToggleOpen,
  selectedRegion,
  selectedConflict,
  selectedArchSite,
  selectedPhysicalFeature,
  selectedTradeFeature,
  onClearSelection,
  year
}) => {
  const [enrichment, setEnrichment] = useState<DeepDiveEnrichment | null>(null);
  const [isEnriching, setIsEnriching] = useState<boolean>(false);

  const yearString = year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;

  // Compute deterministic, instant comprehensive dossier for any country, empire, conflict, or archaeological site in any year
  const placeDossier = useMemo(() => {
    if (!selectedRegion) return null;
    return generatePlaceYearDossier(selectedRegion, year);
  }, [selectedRegion, year]);

  const conflictDossier = useMemo(() => {
    if (!selectedConflict) return null;
    return generateConflictYearDossier(selectedConflict, year);
  }, [selectedConflict, year]);

  const archSiteDossier = useMemo(() => {
    if (!selectedArchSite) return null;
    return generateArchaeologicalSiteYearDossier(selectedArchSite, year);
  }, [selectedArchSite, year]);

  const activeKey = selectedArchSite
    ? `arch_${selectedArchSite.id}_${year}`
    : selectedConflict
    ? `conflict_${selectedConflict.id}_${year}`
    : selectedRegion
    ? `region_${selectedRegion.modernCountry || selectedRegion.name}_${year}`
    : '';

  // Fetch optional live year-specific archival enrichment when a country/conflict/site & year are selected
  useEffect(() => {
    if (!isOpen || (!selectedRegion && !selectedConflict && !selectedArchSite)) {
      return;
    }

    // Do not fetch synthetic year-specific AI enrichment for indigenous territories or Antarctica
    if (selectedRegion && placeDossier && placeDossier.isIndigenousOrAntarctica) {
      setIsEnriching(false);
      return;
    }

    let isCancelled = false;
    const targetName = selectedArchSite
      ? selectedArchSite.name
      : selectedConflict
      ? selectedConflict.name
      : selectedRegion?.name || '';
    const modernCountry = selectedArchSite
      ? selectedArchSite.modernCountry
      : selectedConflict
      ? selectedConflict.region
      : selectedRegion?.modernCountry || selectedRegion?.name || '';
    const entityType = selectedArchSite
      ? 'archaeological site and historical ruin'
      : selectedConflict
      ? 'conflict zone'
      : 'country or empire';

    const timer = setTimeout(async () => {
      setIsEnriching(true);
      try {
        const res = await fetch('/api/history/deepdive', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            countryName: targetName,
            modernCountry,
            entityType,
            year
          })
        });

        const contentType = res.headers.get('content-type') || '';
        if (!isCancelled && res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (
            data &&
            (data.yearDetailedNarrative ||
              (Array.isArray(data.yearMajorEvents) && data.yearMajorEvents.length > 0))
          ) {
            setEnrichment({
              key: activeKey,
              yearHeadline: data.yearHeadline,
              yearRuler: data.yearRuler,
              yearCapital: data.yearCapital,
              generalOverview: data.generalOverview,
              yearDetailedNarrative: data.yearDetailedNarrative,
              yearMajorEvents: data.yearMajorEvents,
              yearPoliticalAndDiplomaticState: data.yearPoliticalAndDiplomaticState,
              yearEconomicAndSocialDevelopments: data.yearEconomicAndSocialDevelopments
            });
          }
        }
      } catch {
        // Offline or static host: deterministic yearlyChronicleEngine dossier is already displayed
      } finally {
        if (!isCancelled) {
          setIsEnriching(false);
        }
      }
    }, 250);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [activeKey, isOpen]);

  // Format markdown bold (**text**) and paragraphs cleanly
  const renderFormattedText = (text: string) => {
    if (!text) return null;
    const paragraphs = text.split('\n\n');
    return paragraphs.map((para, pIdx) => {
      const lines = para.split('\n');
      return (
        <div key={pIdx} className={pIdx > 0 ? 'mt-2.5' : ''}>
          {lines.map((line, lIdx) => {
            const parts = line.split(/(\*\*.*?\*\*)/g);
            const formattedParts = parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={i} className="font-semibold text-amber-300">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return <span key={i}>{part}</span>;
            });

            return (
              <p key={lIdx} className={lIdx > 0 ? 'mt-1 leading-relaxed' : 'leading-relaxed'}>
                {formattedParts}
              </p>
            );
          })}
        </div>
      );
    });
  };

  // Do not show any floating chatbot button or drawer when closed or when nothing is selected
  if (
    !isOpen ||
    (!placeDossier &&
      !conflictDossier &&
      !archSiteDossier &&
      !selectedPhysicalFeature &&
      !selectedTradeFeature)
  ) {
    return null;
  }

  const activeEnrichment = enrichment?.key === activeKey ? enrichment : null;

  const headerTitle = selectedPhysicalFeature
    ? selectedPhysicalFeature.data.name
    : selectedTradeFeature
    ? selectedTradeFeature.data.name
    : archSiteDossier
    ? archSiteDossier.site.name
    : conflictDossier
    ? conflictDossier.name
    : placeDossier?.entityName;

  const headerSubtitle = selectedPhysicalFeature
    ? selectedPhysicalFeature.kind === 'mountain'
      ? 'Physical Geography · General Mountain Range & Orogenic Profile'
      : selectedPhysicalFeature.kind === 'river'
      ? 'Physical Geography · General River System & Hydrological Basin Profile'
      : selectedPhysicalFeature.kind === 'oceanic'
      ? selectedPhysicalFeature.data.type === 'trench'
        ? 'Physical Geography · General Deep Oceanic Trench & Bathymetric Profile'
        : 'Physical Geography · General Marine Coral Reef System Profile'
      : 'Physical Geography · General Desert, Plateau & Biome Profile'
    : selectedTradeFeature
    ? selectedTradeFeature.kind === 'route'
      ? `Historical Commercial Network · ${selectedTradeFeature.data.eraLabel}`
      : `Historical Merchant & Cultural Hub · ${selectedTradeFeature.data.culturalSphere}`
    : archSiteDossier
    ? `Archaeological Site & Historical Ruin Dossier · ${yearString}`
    : conflictDossier
    ? `Conflict Zone Intelligence & ${yearString} Chronicle`
    : `General Country/Empire Profile & ${yearString} Historical Chronicle`;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] md:w-[540px] lg:w-[580px] h-[100dvh] bg-slate-900/98 backdrop-blur-xl border-l border-slate-800 shadow-2xl flex flex-col text-slate-100 animate-in slide-in-from-right duration-200">
      {/* Top Dossier Header */}
      <div className="px-4 py-3.5 border-b border-slate-800 bg-slate-950/95 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`p-2 rounded-lg border shrink-0 ${
              selectedPhysicalFeature
                ? selectedPhysicalFeature.kind === 'river' ||
                  selectedPhysicalFeature.kind === 'oceanic'
                  ? 'bg-sky-500/20 border-sky-400/50 text-sky-300'
                  : 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                : selectedTradeFeature
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                : conflictDossier
                ? 'bg-red-500/15 border-red-500/40 text-red-400'
                : archSiteDossier
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                : 'bg-amber-500/15 border-amber-500/40 text-amber-400'
            }`}
          >
            {selectedPhysicalFeature ? (
              selectedPhysicalFeature.kind === 'river' ||
              selectedPhysicalFeature.kind === 'oceanic' ? (
                <Waves className="w-5 h-5" />
              ) : selectedPhysicalFeature.kind === 'mountain' ? (
                <Mountain className="w-5 h-5" />
              ) : (
                <Globe className="w-5 h-5" />
              )
            ) : selectedTradeFeature ? (
              <Route className="w-5 h-5" />
            ) : conflictDossier ? (
              <ShieldAlert className="w-5 h-5" />
            ) : archSiteDossier ? (
              <Compass className="w-5 h-5" />
            ) : (
              <Landmark className="w-5 h-5" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                {headerTitle}
              </h2>
              {selectedPhysicalFeature ? (
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/40 shrink-0 uppercase">
                  {selectedPhysicalFeature.kind === 'mountain'
                    ? 'Mountain Range'
                    : selectedPhysicalFeature.kind === 'river'
                    ? 'Major River'
                    : selectedPhysicalFeature.kind === 'oceanic'
                    ? selectedPhysicalFeature.data.type === 'trench'
                      ? 'Oceanic Trench'
                      : 'Coral Reef System'
                    : `${selectedPhysicalFeature.data.type} Biome`}
                </span>
              ) : selectedTradeFeature ? (
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 rounded border border-sky-500/40 shrink-0 uppercase">
                  {selectedTradeFeature.kind === 'route'
                    ? selectedTradeFeature.data.type === 'maritime'
                      ? 'Maritime Route'
                      : 'Overland Route'
                    : 'Merchant Hub'}
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 rounded border border-amber-500/40 shrink-0">
                  {yearString}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">{headerSubtitle}</p>
          </div>
        </div>

        <button
          onClick={() => {
            onClearSelection();
            onToggleOpen(false);
          }}
          title="Close Dossier"
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Comprehensive Dossier Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-xs sm:text-[13px]">
        {/* ===================================================================== */}
        {/* CASE A: COUNTRY / EMPIRE COMPREHENSIVE DOSSIER                        */}
        {/* ===================================================================== */}
        {placeDossier && (
          <>
            {/* Executive Identity Banner */}
            <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    <span>SOVEREIGN POLITY & TERRITORIAL DOSSIER · {placeDossier.yearDisplay}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                    {placeDossier.entityName}
                  </h3>
                  {placeDossier.modernCountry &&
                    placeDossier.modernCountry !== placeDossier.entityName && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        Modern Geographic Territory:{' '}
                        <span className="text-slate-200 font-medium">
                          {placeDossier.modernCountry}
                        </span>
                      </p>
                    )}
                  <p className="text-[11px] font-mono text-sky-400 mt-1">
                    Historical Epoch: {placeDossier.epochName}
                  </p>
                </div>
                <span
                  className="w-5 h-5 rounded-full border border-white/30 shrink-0 mt-1 shadow"
                  style={{ backgroundColor: placeDossier.color }}
                />
              </div>

              {/* Key Metadata Grid for the Selected Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3.5 pt-3.5 border-t border-slate-800/90">
                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                    <Landmark className="w-3 h-3 text-amber-400" />
                    Ruler / Leadership ({placeDossier.yearDisplay})
                  </span>
                  <span className="font-semibold text-slate-100 mt-1 block leading-snug">
                    {activeEnrichment?.yearRuler || placeDossier.rulerInYear}
                  </span>
                </div>

                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                    <Compass className="w-3 h-3 text-sky-400" />
                    Capital / Seat ({placeDossier.yearDisplay})
                  </span>
                  <span className="font-semibold text-slate-100 mt-1 block leading-snug">
                    {activeEnrichment?.yearCapital || placeDossier.capitalInYear}
                  </span>
                </div>

                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                    <Users className="w-3 h-3 text-emerald-400" />
                    Demographics ({placeDossier.yearDisplay})
                  </span>
                  <span className="font-semibold text-slate-100 mt-1 block leading-snug">
                    {placeDossier.populationInYear}
                  </span>
                </div>

                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                    <Shield className="w-3 h-3 text-purple-400" />
                    System of Governance
                  </span>
                  <span className="font-semibold text-slate-100 mt-1 block leading-snug">
                    {placeDossier.governmentTypeInYear}
                  </span>
                </div>
              </div>
            </div>

            {/* ================================================================= */}
            {/* PART 1: GENERAL INFORMATION ABOUT THIS COUNTRY / EMPIRE           */}
            {/* ================================================================= */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <BookOpen className="w-4 h-4 text-sky-400 shrink-0" />
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-sky-300 font-mono">
                  Part I · General Profile of {placeDossier.modernCountry} / {placeDossier.entityName}
                </h4>
              </div>

              {/* 1A. General Historical & Geopolitical Overview */}
              <div className="bg-slate-800/75 p-3.5 rounded-xl border border-slate-700/80 space-y-2">
                <div className="text-[11px] font-mono uppercase text-amber-300 font-semibold">
                  General Historical & Geopolitical Overview
                </div>
                <div className="text-slate-200 leading-relaxed">
                  {renderFormattedText(
                    activeEnrichment?.generalOverview || placeDossier.generalOverview
                  )}
                </div>
              </div>

              {/* 1B. Civilizational Continuity Across Eras */}
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/70 space-y-1.5">
                <div className="text-[11px] font-mono uppercase text-sky-300 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>Long-Term Historical Sovereignty Timeline</span>
                </div>
                <div className="text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed">
                  {placeDossier.civilizationalTimeline}
                </div>
              </div>

              {/* 1C. Geography, Economy & Defense Grid */}
              <div className="grid grid-cols-1 gap-2.5">
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/70">
                  <div className="text-[11px] font-mono uppercase text-emerald-300 font-semibold flex items-center gap-1.5 mb-1">
                    <Mountain className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Geography, Terrain & Strategic Location</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {placeDossier.geographyAndStrategicLocation}
                  </p>
                </div>

                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/70">
                  <div className="text-[11px] font-mono uppercase text-amber-300 font-semibold flex items-center gap-1.5 mb-1">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span>Economy, Trade Networks & Resources</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {placeDossier.economyTradeAndResources}
                  </p>
                </div>
              </div>

              {/* 1D. Disputed Territories & Border Friction (if present) */}
              {placeDossier.disputedTerritories.length > 0 && (
                <div className="bg-red-950/30 border border-red-900/50 p-3 rounded-xl">
                  <div className="text-[11px] font-mono uppercase text-red-400 font-semibold mb-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Disputed Territories & Strategic Fault Lines</span>
                  </div>
                  <ul className="space-y-1">
                    {placeDossier.disputedTerritories.map((d, idx) => (
                      <li key={idx} className="text-xs text-red-200 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* ================================================================= */}
            {/* PART 2: FULL DETAIL OF WHAT HAPPENED IN THIS SPECIFIC YEAR        */}
            {/* ================================================================= */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-400 font-mono">
                    Part II · What Happened in {placeDossier.yearDisplay}
                  </h4>
                </div>
                {isEnriching && placeDossier.hasCredibleYearRecord && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 animate-spin" />
                    <span>Loading deep {placeDossier.yearDisplay} archive...</span>
                  </span>
                )}
              </div>

              {!placeDossier.hasCredibleYearRecord ? (
                <div className="bg-slate-800/75 border border-slate-700/80 p-4 rounded-xl shadow-md space-y-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-300">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{placeDossier.yearHeadline}</span>
                  </div>
                  <div className="text-slate-200 leading-relaxed">
                    {renderFormattedText(placeDossier.yearDetailedNarrative)}
                  </div>
                </div>
              ) : (
                <>
                  {/* 2A. Year-Specific Headline & Full Narrative */}
                  <div className="bg-amber-950/25 border border-amber-500/40 p-4 rounded-xl shadow-md space-y-2.5">
                    <div className="text-xs sm:text-sm font-bold text-amber-300 leading-snug">
                      {activeEnrichment?.yearHeadline || placeDossier.yearHeadline}
                    </div>
                    <div className="text-slate-100 leading-relaxed">
                      {renderFormattedText(
                        activeEnrichment?.yearDetailedNarrative || placeDossier.yearDetailedNarrative
                      )}
                    </div>
                  </div>

                  {/* 2B. Major Chronological Events in That Specific Year */}
                  {(
                    (activeEnrichment?.yearMajorEvents &&
                      activeEnrichment.yearMajorEvents.length > 0) ||
                    placeDossier.yearMajorEvents.length > 0
                  ) && (
                    <div className="bg-slate-800/85 p-4 rounded-xl border border-slate-700/90 space-y-2.5">
                      <div className="text-[11px] font-mono uppercase text-amber-400 font-semibold flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5" />
                        <span>
                          Credible Historical Record in {placeDossier.entityName} (
                          {placeDossier.yearDisplay})
                        </span>
                      </div>
                      <ul className="space-y-2.5">
                        {(activeEnrichment?.yearMajorEvents &&
                        activeEnrichment.yearMajorEvents.length > 0
                          ? activeEnrichment.yearMajorEvents
                          : placeDossier.yearMajorEvents
                        ).map((ev, idx) => (
                          <li
                            key={idx}
                            className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-slate-200 flex items-start gap-2.5 leading-relaxed"
                          >
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold shrink-0 mt-0.5">
                              0{idx + 1}
                            </span>
                            <span>{ev}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 2C. Year-Specific Politics, Diplomacy, Economy & Society */}
                  {(activeEnrichment?.yearPoliticalAndDiplomaticState ||
                    placeDossier.yearPoliticalAndDiplomaticState ||
                    activeEnrichment?.yearEconomicAndSocialDevelopments ||
                    placeDossier.yearEconomicAndSocialDevelopments) && (
                    <div className="grid grid-cols-1 gap-2.5">
                      {(activeEnrichment?.yearPoliticalAndDiplomaticState ||
                        placeDossier.yearPoliticalAndDiplomaticState) && (
                        <div className="bg-slate-800/65 p-3.5 rounded-xl border border-slate-700/75">
                          <div className="text-[11px] font-mono uppercase text-sky-300 font-semibold mb-1">
                            Politics, Governance & Diplomacy in {placeDossier.yearDisplay}
                          </div>
                          <p className="text-slate-200 leading-relaxed">
                            {activeEnrichment?.yearPoliticalAndDiplomaticState ||
                              placeDossier.yearPoliticalAndDiplomaticState}
                          </p>
                        </div>
                      )}

                      {(activeEnrichment?.yearEconomicAndSocialDevelopments ||
                        placeDossier.yearEconomicAndSocialDevelopments) && (
                        <div className="bg-slate-800/65 p-3.5 rounded-xl border border-slate-700/75">
                          <div className="text-[11px] font-mono uppercase text-emerald-300 font-semibold mb-1">
                            Economy, Infrastructure & Society in {placeDossier.yearDisplay}
                          </div>
                          <p className="text-slate-200 leading-relaxed">
                            {activeEnrichment?.yearEconomicAndSocialDevelopments ||
                              placeDossier.yearEconomicAndSocialDevelopments}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {/* ===================================================================== */}
        {/* CASE B: CONFLICT ZONE / DISPUTED AREA COMPREHENSIVE DOSSIER           */}
        {/* ===================================================================== */}
        {conflictDossier && (
          <>
            {/* Conflict Status Header Card */}
            <div
              className={`p-4 rounded-xl border shadow-md ${
                conflictDossier.severity === 'critical'
                  ? 'bg-red-950/45 border-red-800/80'
                  : 'bg-amber-950/45 border-amber-800/80'
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-[10px] font-mono uppercase">
                <span
                  className={
                    conflictDossier.severity === 'critical'
                      ? 'text-red-400 font-bold'
                      : 'text-amber-400 font-bold'
                  }
                >
                  {conflictDossier.type === 'active_war'
                    ? 'ACTIVE WAR ZONE'
                    : conflictDossier.type === 'territorial_dispute'
                    ? 'TERRITORIAL DISPUTE'
                    : 'HISTORICAL / FROZEN FRONT'}
                </span>
                <span className="text-slate-300">{conflictDossier.region}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                {conflictDossier.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-200 mt-1.5">
                <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse shrink-0" />
                <span>{conflictDossier.status}</span>
              </div>

              <div className="grid grid-cols-1 gap-2 mt-3 pt-3 border-t border-slate-800/80">
                <div>
                  <span className="text-[10px] font-mono uppercase text-sky-300 block mb-1">
                    Combatants & Claimants
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {conflictDossier.combatantsOrClaimants.map((party, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[11px] rounded bg-slate-900/90 text-slate-100 border border-slate-700"
                      >
                        {party}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                  <span className="text-slate-300">
                    <strong className="text-slate-400">Inception:</strong>{' '}
                    {conflictDossier.startDate}
                  </span>
                  <span className="text-red-300">
                    <strong className="text-slate-400">Impact:</strong>{' '}
                    {conflictDossier.casualtiesOrImpact}
                  </span>
                </div>
              </div>
            </div>

            {/* PART 1: GENERAL INFORMATION ABOUT THE CONFLICT */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <BookOpen className="w-4 h-4 text-sky-400 shrink-0" />
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-sky-300 font-mono">
                  Part I · General Overview & Historical Root Causes
                </h4>
              </div>

              <div className="bg-slate-800/75 p-3.5 rounded-xl border border-slate-700/80 space-y-2">
                <div className="text-[11px] font-mono uppercase text-red-400 font-semibold">
                  General Conflict & Strategic Overview
                </div>
                <div className="text-slate-200 leading-relaxed">
                  {renderFormattedText(
                    activeEnrichment?.generalOverview || conflictDossier.generalOverview
                  )}
                </div>
              </div>

              <div className="bg-slate-800/65 p-3.5 rounded-xl border border-slate-700/75 space-y-2">
                <div className="text-[11px] font-mono uppercase text-amber-400 font-semibold flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  <span>Deep Historical Root Causes & Origins</span>
                </div>
                <p className="text-slate-200 leading-relaxed">
                  {conflictDossier.historicalRootCauses}
                </p>
              </div>
            </div>

            {/* PART 2: WHAT HAPPENED IN THIS CONFLICT ZONE IN THIS SPECIFIC YEAR */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-400 font-mono">
                    Part II · What Happened in {conflictDossier.yearDisplay}
                  </h4>
                </div>
                {isEnriching && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 animate-spin" />
                    <span>Loading {conflictDossier.yearDisplay} archive...</span>
                  </span>
                )}
              </div>

              <div className="bg-amber-950/25 border border-amber-500/40 p-4 rounded-xl shadow-md space-y-2.5">
                <div className="text-xs sm:text-sm font-bold text-amber-300 leading-snug">
                  {activeEnrichment?.yearHeadline || conflictDossier.yearHeadline}
                </div>
                <div className="text-slate-100 leading-relaxed">
                  {renderFormattedText(
                    activeEnrichment?.yearDetailedNarrative || conflictDossier.yearDetailedNarrative
                  )}
                </div>
              </div>

              <div className="bg-slate-800/85 p-4 rounded-xl border border-slate-700/90 space-y-2.5">
                <div className="text-[11px] font-mono uppercase text-amber-400 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>
                    Key Developments & Frontline Events in {conflictDossier.yearDisplay}
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {(activeEnrichment?.yearMajorEvents &&
                  activeEnrichment.yearMajorEvents.length > 0
                    ? activeEnrichment.yearMajorEvents
                    : conflictDossier.yearMajorEvents
                  ).map((ev, idx) => (
                    <li
                      key={idx}
                      className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-slate-200 flex items-start gap-2.5 leading-relaxed"
                    >
                      <span className="px-1.5 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-red-300 font-mono text-[10px] font-bold shrink-0 mt-0.5">
                        0{idx + 1}
                      </span>
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {/* ===================================================================== */}
        {/* CASE C: ARCHAEOLOGICAL SITE / HISTORICAL RUIN COMPREHENSIVE DOSSIER   */}
        {/* ===================================================================== */}
        {archSiteDossier && (
          <>
            {/* Executive Archaeological Site Header Card */}
            <div className="bg-slate-950/90 p-4 rounded-xl border border-amber-500/40 shadow-md">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>{archSiteDossier.site.siteType}</span>
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                    archSiteDossier.statusInYear === 'Active Era Monument'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : archSiteDossier.statusInYear === 'Ancient Historical Ruin'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  }`}
                >
                  {archSiteDossier.statusInYear} ({archSiteDossier.yearDisplay})
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white mt-1.5">
                {archSiteDossier.site.name}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {archSiteDossier.site.region} ·{' '}
                <span className="text-amber-300 font-semibold">
                  {archSiteDossier.site.modernCountry}
                </span>
              </p>
              <p className="text-[11px] font-mono text-sky-400 mt-1">
                {archSiteDossier.site.unescoStatus}
              </p>

              {/* Key Archaeological Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3.5 pt-3.5 border-t border-slate-800/90">
                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                    <Landmark className="w-3 h-3 text-amber-400" />
                    Builder Civilization
                  </span>
                  <span className="font-semibold text-slate-100 mt-1 block leading-snug">
                    {archSiteDossier.site.civilization}
                  </span>
                </div>

                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3 text-sky-400" />
                    Constructed / Founded
                  </span>
                  <span className="font-semibold text-slate-100 mt-1 block leading-snug">
                    {archSiteDossier.site.foundedDisplay}
                  </span>
                </div>

                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                    <Compass className="w-3 h-3 text-emerald-400" />
                    Modern Excavations
                  </span>
                  <span className="font-semibold text-slate-100 mt-1 block leading-snug">
                    Began {archSiteDossier.site.rediscoveryOrExcavationYear} CE
                  </span>
                </div>

                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                    <Globe className="w-3 h-3 text-purple-400" />
                    Geographic Coordinates
                  </span>
                  <span className="font-semibold text-slate-100 mt-1 block leading-snug font-mono text-xs">
                    {archSiteDossier.site.coordinates[1].toFixed(2)}°N,{' '}
                    {archSiteDossier.site.coordinates[0].toFixed(2)}°E
                  </span>
                </div>
              </div>
            </div>

            {/* PART 1: GENERAL ARCHAEOLOGICAL & ARCHITECTURAL PROFILE */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <BookOpen className="w-4 h-4 text-sky-400 shrink-0" />
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-sky-300 font-mono">
                  Part I · Archaeological Site & Historical Ruin Overview
                </h4>
              </div>

              {/* 1A. General Site Overview */}
              <div className="bg-slate-800/75 p-3.5 rounded-xl border border-slate-700/80 space-y-2">
                <div className="text-[11px] font-mono uppercase text-amber-300 font-semibold">
                  Monumental Significance & Civilizational Context
                </div>
                <div className="text-slate-200 leading-relaxed">
                  {renderFormattedText(
                    activeEnrichment?.generalOverview || archSiteDossier.site.generalOverview
                  )}
                </div>
              </div>

              {/* 1B. Architectural & Engineering Features */}
              <div className="bg-slate-800/65 p-3.5 rounded-xl border border-slate-700/75 space-y-2">
                <div className="text-[11px] font-mono uppercase text-emerald-300 font-semibold flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Monumental Architecture & Engineering Features</span>
                </div>
                <ul className="space-y-1.5">
                  {archSiteDossier.site.architecturalFeatures.map((feat, idx) => (
                    <li key={idx} className="text-slate-200 flex items-start gap-2 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 1C. Key Artifacts & Material Culture Discovered */}
              <div className="bg-slate-800/65 p-3.5 rounded-xl border border-slate-700/75 space-y-2">
                <div className="text-[11px] font-mono uppercase text-amber-300 font-semibold flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>Key Artifacts, Inscriptions & Treasures Unearthed</span>
                </div>
                <ul className="space-y-1.5">
                  {archSiteDossier.site.keyArtifacts.map((art, idx) => (
                    <li key={idx} className="text-slate-200 flex items-start gap-2 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                      <span>{art}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 1D. Rediscovery & Scientific Excavation History */}
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/70 space-y-1.5">
                <div className="text-[11px] font-mono uppercase text-sky-300 font-semibold flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-sky-400" />
                  <span>Rediscovery & Archaeological Excavation History</span>
                </div>
                <div className="text-slate-200 leading-relaxed">
                  {renderFormattedText(archSiteDossier.site.excavationAndDiscoveryHistory)}
                </div>
              </div>
            </div>

            {/* PART 2: SITE STATUS & CHRONICLE IN THE SELECTED YEAR */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-400 font-mono">
                    Part II · Site Status & Context in {archSiteDossier.yearDisplay}
                  </h4>
                </div>
                {isEnriching && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 animate-spin" />
                    <span>Loading {archSiteDossier.yearDisplay} archive...</span>
                  </span>
                )}
              </div>

              <div className="bg-amber-950/25 border border-amber-500/40 p-4 rounded-xl shadow-md space-y-2.5">
                <div className="text-xs sm:text-sm font-bold text-amber-300 leading-snug">
                  {activeEnrichment?.yearHeadline || archSiteDossier.yearHeadline}
                </div>
                <div className="text-slate-100 leading-relaxed">
                  {renderFormattedText(
                    activeEnrichment?.yearDetailedNarrative ||
                      archSiteDossier.yearDetailedNarrative
                  )}
                </div>
              </div>

              <div className="bg-slate-800/85 p-4 rounded-xl border border-slate-700/90 space-y-2.5">
                <div className="text-[11px] font-mono uppercase text-amber-400 font-semibold flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  <span>
                    Site Milestones & Context in {archSiteDossier.yearDisplay}
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {(activeEnrichment?.yearMajorEvents &&
                  activeEnrichment.yearMajorEvents.length > 0
                    ? activeEnrichment.yearMajorEvents
                    : archSiteDossier.yearMajorEvents
                  ).map((ev, idx) => (
                    <li
                      key={idx}
                      className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-slate-200 flex items-start gap-2.5 leading-relaxed"
                    >
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold shrink-0 mt-0.5">
                        0{idx + 1}
                      </span>
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {/* ===================================================================== */}
        {/* CASE D: GENERAL PHYSICAL GEOGRAPHY DOSSIER (NOT YEARLY)               */}
        {/* Mountain Ranges, Major River Systems & Deserts / Physiographic Biomes */}
        {/* ===================================================================== */}
        {selectedPhysicalFeature && (
          <>
            {/* D1. MOUNTAIN RANGE GENERAL DOSSIER */}
            {selectedPhysicalFeature.kind === 'mountain' && (
              <>
                <div className="bg-slate-950/90 p-4 rounded-xl border border-emerald-500/40 shadow-md">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Mountain className="w-3.5 h-3.5" />
                    <span>PHYSICAL GEOGRAPHY · CONTINENTAL MOUNTAIN CORDILLERA</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                    {selectedPhysicalFeature.data.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Geographic Region:{' '}
                    <span className="text-emerald-300 font-semibold">
                      {selectedPhysicalFeature.data.region}
                    </span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3.5 pt-3.5 border-t border-slate-800/90">
                    <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                        <Mountain className="w-3 h-3 text-amber-400" />
                        Highest Summit
                      </span>
                      <span className="font-semibold text-slate-100 mt-1 block leading-snug">
                        {selectedPhysicalFeature.data.highestPeak}
                      </span>
                    </div>

                    <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                        <Compass className="w-3 h-3 text-emerald-400" />
                        Cordillera Span & Elevation
                      </span>
                      <span className="font-semibold text-slate-100 mt-1 block leading-snug">
                        {selectedPhysicalFeature.data.lengthKm} · Peak{' '}
                        {selectedPhysicalFeature.data.elevation}
                      </span>
                    </div>
                  </div>
                </div>

                {/* General Geographic & Topographic Overview */}
                <div className="bg-slate-800/75 p-4 rounded-xl border border-slate-700/80 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-emerald-300 font-semibold flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>General Geographic & Topographic Overview</span>
                  </div>
                  <div className="text-slate-200 leading-relaxed">
                    {renderFormattedText(selectedPhysicalFeature.data.generalOverview)}
                  </div>
                </div>

                {/* Tectonic & Geological Origin */}
                <div className="bg-slate-800/65 p-4 rounded-xl border border-slate-700/75 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-amber-300 font-semibold flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tectonic Formation & Geological Origin</span>
                  </div>
                  <div className="text-slate-200 leading-relaxed">
                    {renderFormattedText(selectedPhysicalFeature.data.geologicalOrigin)}
                  </div>
                </div>

                {/* Climate, Glaciation & Alpine Ecology */}
                <div className="bg-slate-800/65 p-4 rounded-xl border border-slate-700/75 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-sky-300 font-semibold flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-sky-400" />
                    <span>Climate, Glaciation & Alpine Ecology</span>
                  </div>
                  <div className="text-slate-200 leading-relaxed">
                    {renderFormattedText(selectedPhysicalFeature.data.climateAndEcology)}
                  </div>
                </div>

                {/* Major Peaks & Mountain Passes */}
                <div className="bg-slate-800/65 p-4 rounded-xl border border-slate-700/75 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-emerald-300 font-semibold flex items-center gap-1.5">
                    <Mountain className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Notable Summits, Valleys & Strategic Mountain Passes</span>
                  </div>
                  <ul className="space-y-1.5">
                    {selectedPhysicalFeature.data.keyPeaksAndPasses.map((item, idx) => (
                      <li key={idx} className="text-slate-200 flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Enduring Role in Human Geography & Civilization */}
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/70 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-amber-300 font-semibold flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-amber-400" />
                    <span>Enduring Role in Human Geography & Civilization</span>
                  </div>
                  <div className="text-slate-200 leading-relaxed">
                    {renderFormattedText(selectedPhysicalFeature.data.historicalSignificance)}
                  </div>
                </div>
              </>
            )}

            {/* D2. MAJOR RIVER SYSTEM GENERAL DOSSIER */}
            {selectedPhysicalFeature.kind === 'river' && (
              <>
                <div className="bg-slate-950/90 p-4 rounded-xl border border-sky-500/40 shadow-md">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                    <Waves className="w-3.5 h-3.5" />
                    <span>PHYSICAL GEOGRAPHY · MAJOR CONTINENTAL RIVER BASIN</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                    {selectedPhysicalFeature.data.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Basin Region:{' '}
                    <span className="text-sky-300 font-semibold">
                      {selectedPhysicalFeature.data.region}
                    </span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3.5 pt-3.5 border-t border-slate-800/90">
                    <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                        <Waves className="w-3 h-3 text-sky-400" />
                        Total River Length
                      </span>
                      <span className="font-semibold text-slate-100 mt-1 block leading-snug">
                        {selectedPhysicalFeature.data.lengthKm}
                      </span>
                    </div>

                    <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                        <Globe className="w-3 h-3 text-emerald-400" />
                        Drainage Basin Area
                      </span>
                      <span className="font-semibold text-slate-100 mt-1 block leading-snug">
                        {selectedPhysicalFeature.data.drainageBasinArea}
                      </span>
                    </div>

                    <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                        <Mountain className="w-3 h-3 text-amber-400" />
                        Headwaters / Source
                      </span>
                      <span className="font-semibold text-slate-100 mt-1 block leading-snug">
                        {selectedPhysicalFeature.data.source}
                      </span>
                    </div>

                    <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                        <Compass className="w-3 h-3 text-purple-400" />
                        Mouth / Outflow
                      </span>
                      <span className="font-semibold text-slate-100 mt-1 block leading-snug">
                        {selectedPhysicalFeature.data.outflow}
                      </span>
                    </div>
                  </div>
                </div>

                {/* General Hydrological & Geographic Overview */}
                <div className="bg-slate-800/75 p-4 rounded-xl border border-slate-700/80 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-sky-300 font-semibold flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                    <span>General Course & Geographic Overview</span>
                  </div>
                  <div className="text-slate-200 leading-relaxed">
                    {renderFormattedText(selectedPhysicalFeature.data.generalOverview)}
                  </div>
                </div>

                {/* Hydrology, Flood Regime & Basin Ecology */}
                <div className="bg-slate-800/65 p-4 rounded-xl border border-slate-700/75 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-emerald-300 font-semibold flex items-center gap-1.5">
                    <Waves className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Hydrology, Flood Dynamics & Freshwater Ecology</span>
                  </div>
                  <div className="text-slate-200 leading-relaxed">
                    {renderFormattedText(selectedPhysicalFeature.data.hydrologyAndEcology)}
                  </div>
                </div>

                {/* Key Tributaries, Deltas & Riverine Cities */}
                <div className="bg-slate-800/65 p-4 rounded-xl border border-slate-700/75 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-amber-300 font-semibold flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5 text-amber-400" />
                    <span>Major Tributaries, Deltas & Historic Riverine Cities</span>
                  </div>
                  <ul className="space-y-1.5">
                    {selectedPhysicalFeature.data.keyTributariesAndCities.map((item, idx) => (
                      <li key={idx} className="text-slate-200 flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Enduring Civilizational & Economic Role */}
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/70 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-amber-300 font-semibold flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-amber-400" />
                    <span>Enduring Role in Human Civilization & Agriculture</span>
                  </div>
                  <div className="text-slate-200 leading-relaxed">
                    {renderFormattedText(selectedPhysicalFeature.data.civilizationRole)}
                  </div>
                </div>
              </>
            )}

            {/* D3. DESERT, PLATEAU, BASIN OR STEPPE GENERAL DOSSIER */}
            {selectedPhysicalFeature.kind === 'physiographic' && (
              <>
                <div className="bg-slate-950/90 p-4 rounded-xl border border-amber-500/40 shadow-md">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    <span>
                      PHYSICAL GEOGRAPHY ·{' '}
                      {selectedPhysicalFeature.data.type.toUpperCase()} & PHYSIOGRAPHIC BIOME
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                    {selectedPhysicalFeature.data.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Geographic Span:{' '}
                    <span className="text-amber-300 font-semibold">
                      {selectedPhysicalFeature.data.region}
                    </span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3.5 pt-3.5 border-t border-slate-800/90">
                    <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                        <Globe className="w-3 h-3 text-amber-400" />
                        Total Surface Area
                      </span>
                      <span className="font-semibold text-slate-100 mt-1 block leading-snug">
                        {selectedPhysicalFeature.data.areaSqKm}
                      </span>
                    </div>

                    <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                        <Compass className="w-3 h-3 text-sky-400" />
                        Climate & Classification
                      </span>
                      <span className="font-semibold text-slate-100 mt-1 block leading-snug">
                        {selectedPhysicalFeature.data.elevationOrClimate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* General Geographic Overview */}
                <div className="bg-slate-800/75 p-4 rounded-xl border border-slate-700/80 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-amber-300 font-semibold flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>General Geographic & Environmental Overview</span>
                  </div>
                  <div className="text-slate-200 leading-relaxed">
                    {renderFormattedText(selectedPhysicalFeature.data.generalOverview)}
                  </div>
                </div>

                {/* Geology, Landforms & Terrain */}
                <div className="bg-slate-800/65 p-4 rounded-xl border border-slate-700/75 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-emerald-300 font-semibold flex items-center gap-1.5">
                    <Mountain className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Geology, Landforms & Surface Terrain</span>
                  </div>
                  <div className="text-slate-200 leading-relaxed">
                    {renderFormattedText(selectedPhysicalFeature.data.geologyAndTerrain)}
                  </div>
                </div>

                {/* Ecology, Flora & Fauna */}
                <div className="bg-slate-800/65 p-4 rounded-xl border border-slate-700/75 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-sky-300 font-semibold flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-sky-400" />
                    <span>Climate, Aquifers, Flora & Fauna</span>
                  </div>
                  <div className="text-slate-200 leading-relaxed">
                    {renderFormattedText(selectedPhysicalFeature.data.ecologyAndFloraFauna)}
                  </div>
                </div>

                {/* Key Landmarks, Ergs & Oases */}
                <div className="bg-slate-800/65 p-4 rounded-xl border border-slate-700/75 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-amber-300 font-semibold flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5 text-amber-400" />
                    <span>Major Landmarks, Oases & Sub-Regions</span>
                  </div>
                  <ul className="space-y-1.5">
                    {selectedPhysicalFeature.data.keyLandmarksAndOases.map((item, idx) => (
                      <li key={idx} className="text-slate-200 flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Human Geography & Historical Significance */}
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/70 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-emerald-300 font-semibold flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Enduring Role in Human History & Trade</span>
                  </div>
                  <div className="text-slate-200 leading-relaxed">
                    {renderFormattedText(selectedPhysicalFeature.data.description)}
                  </div>
                </div>
              </>
            )}

            {/* D4. CORAL REEF SYSTEM OR DEEP OCEANIC TRENCH GENERAL DOSSIER */}
            {selectedPhysicalFeature.kind === 'oceanic' && (
              <>
                <div className="bg-slate-950/90 p-4 rounded-xl border border-teal-500/40 shadow-md">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                    <Waves className="w-3.5 h-3.5" />
                    <span>
                      PHYSICAL GEOGRAPHY ·{' '}
                      {selectedPhysicalFeature.data.type === 'trench'
                        ? 'DEEP OCEANIC TRENCH & SUBDUCTION ZONE'
                        : 'MARINE CORAL REEF SYSTEM'}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                    {selectedPhysicalFeature.data.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Oceanic Basin:{' '}
                    <span className="text-teal-300 font-semibold">
                      {selectedPhysicalFeature.data.oceanBasin}
                    </span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3.5 pt-3.5 border-t border-slate-800/90">
                    <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                        <Waves className="w-3 h-3 text-teal-400" />
                        {selectedPhysicalFeature.data.type === 'trench'
                          ? 'Maximum Depth'
                          : 'Reef Length & Extent'}
                      </span>
                      <span className="font-semibold text-slate-100 mt-1 block leading-snug">
                        {selectedPhysicalFeature.data.maxDepthOrLength}
                      </span>
                    </div>

                    <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                        <Compass className="w-3 h-3 text-sky-400" />
                        Area & Geographic Span
                      </span>
                      <span className="font-semibold text-slate-100 mt-1 block leading-snug">
                        {selectedPhysicalFeature.data.areaOrSpan}
                      </span>
                    </div>
                  </div>
                </div>

                {/* General Marine & Geographic Overview */}
                <div className="bg-slate-800/75 p-4 rounded-xl border border-slate-700/80 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-teal-300 font-semibold flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                    <span>General Oceanographic & Geographic Overview</span>
                  </div>
                  <div className="text-slate-200 leading-relaxed">
                    {renderFormattedText(selectedPhysicalFeature.data.generalOverview)}
                  </div>
                </div>

                {/* Bathymetry, Plate Tectonics & Marine Formation */}
                <div className="bg-slate-800/65 p-4 rounded-xl border border-slate-700/75 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-sky-300 font-semibold flex items-center gap-1.5">
                    <Mountain className="w-3.5 h-3.5 text-sky-400" />
                    <span>
                      {selectedPhysicalFeature.data.type === 'trench'
                        ? 'Bathymetry, Plate Subduction & Tectonic Mechanics'
                        : 'Geological Reef Formation, Atolls & Carbonate Platform'}
                    </span>
                  </div>
                  <div className="text-slate-200 leading-relaxed">
                    {renderFormattedText(selectedPhysicalFeature.data.geologyAndBathymetry)}
                  </div>
                </div>

                {/* Marine Ecology & Biodiversity */}
                <div className="bg-slate-800/65 p-4 rounded-xl border border-slate-700/75 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-emerald-300 font-semibold flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Marine Biodiversity, Ecosystems & Extreme Life</span>
                  </div>
                  <div className="text-slate-200 leading-relaxed">
                    {renderFormattedText(selectedPhysicalFeature.data.marineEcologyAndBiodiversity)}
                  </div>
                </div>

                {/* Key Sub-Features, Deeps, Atolls & Islands */}
                <div className="bg-slate-800/65 p-4 rounded-xl border border-slate-700/75 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-amber-300 font-semibold flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {selectedPhysicalFeature.data.type === 'trench'
                        ? 'Notable Hadal Deeps, Vents & Subduction Features'
                        : 'Major Reefs, Atolls, Lagoons & Islands'}
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {selectedPhysicalFeature.data.keyFeaturesAndLandmarks.map((item, idx) => (
                      <li key={idx} className="text-slate-200 flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exploration, Navigation & Scientific History */}
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/70 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-amber-300 font-semibold flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-amber-400" />
                    <span>Maritime History, Deep-Sea Exploration & Scientific Legacy</span>
                  </div>
                  <div className="text-slate-200 leading-relaxed">
                    {renderFormattedText(selectedPhysicalFeature.data.humanExplorationAndSignificance)}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ===================================================================== */}
        {/* CASE E: HISTORICAL TRADE ROUTE & COMMERCIAL HUB DOSSIER               */}
        {/* ===================================================================== */}
        {selectedTradeFeature && (
          <>
            {selectedTradeFeature.kind === 'route' && (
              <>
                <div className="bg-slate-950/90 p-4 rounded-xl border border-amber-500/45 shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <Route className="w-3.5 h-3.5" />
                        <span>
                          HISTORICAL TRADE NETWORK ·{' '}
                          {selectedTradeFeature.data.type === 'maritime'
                            ? 'OCEANIC & MONSOON SEA LANE'
                            : 'OVERLAND CARAVAN & HIGHWAY CORRIDOR'}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                        {selectedTradeFeature.data.name}
                      </h3>
                      <p className="text-xs text-sky-300 font-mono mt-1">
                        Historical Era Span: {selectedTradeFeature.data.eraLabel}
                      </p>
                    </div>
                    <span
                      className="w-5 h-5 rounded-full border border-white/30 shrink-0 mt-1 shadow"
                      style={{ backgroundColor: selectedTradeFeature.data.color }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3.5 pt-3.5 border-t border-slate-800/90">
                    <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                        <Compass className="w-3 h-3 text-amber-400" />
                        Network Length / Span
                      </span>
                      <span className="font-semibold text-slate-100 mt-1 block leading-snug">
                        {selectedTradeFeature.data.lengthOrSpan}
                      </span>
                    </div>

                    <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                        <Clock className="w-3 h-3 text-sky-400" />
                        Primary Active Period
                      </span>
                      <span className="font-semibold text-slate-100 mt-1 block leading-snug">
                        {selectedTradeFeature.data.eraLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* General Historical Overview */}
                <div className="bg-slate-800/75 p-4 rounded-xl border border-slate-700/80 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-amber-300 font-semibold flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>General Overview & Commercial History</span>
                  </div>
                  <div className="text-slate-200 leading-relaxed">
                    {renderFormattedText(selectedTradeFeature.data.generalOverview)}
                  </div>
                </div>

                {/* Key Commodities & Luxury Goods Traded */}
                <div className="bg-slate-800/65 p-4 rounded-xl border border-slate-700/75 space-y-2.5">
                  <div className="text-[11px] font-mono uppercase text-emerald-300 font-semibold flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Primary Commodities, Bullion & Goods Traded</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedTradeFeature.data.commodities.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900/85 px-3 py-2 rounded-lg border border-slate-800 text-slate-200 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span className="font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Major Entrepôts, Oases & Port Hubs */}
                <div className="bg-slate-800/65 p-4 rounded-xl border border-slate-700/75 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-sky-300 font-semibold flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5 text-sky-400" />
                    <span>Major Entrepôt Cities, Oases & Maritime Ports</span>
                  </div>
                  <ul className="space-y-1.5">
                    {selectedTradeFeature.data.keyHubsAndWaypoints.map((wp, idx) => (
                      <li key={idx} className="text-slate-200 flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-1.5" />
                        <span>{wp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Caravan Logistics & Maritime Navigation */}
                <div className="bg-slate-800/65 p-4 rounded-xl border border-slate-700/75 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-amber-300 font-semibold flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    <span>Caravan Logistics, Ships & Navigation Methods</span>
                  </div>
                  <div className="text-slate-200 leading-relaxed">
                    {renderFormattedText(selectedTradeFeature.data.transportAndNavigation)}
                  </div>
                </div>

                {/* Cultural, Religious & Scientific Exchange */}
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/70 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-emerald-300 font-semibold flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cultural, Religious & Technological Exchange</span>
                  </div>
                  <div className="text-slate-200 leading-relaxed">
                    {renderFormattedText(selectedTradeFeature.data.culturalExchange)}
                  </div>
                </div>
              </>
            )}

            {selectedTradeFeature.kind === 'hub' && (
              <>
                <div className="bg-slate-950/90 p-4 rounded-xl border border-amber-500/45 shadow-md">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    <span>COSMOPOLITAN MERCHANT ENTREPÔT & CULTURAL HUB</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                    {selectedTradeFeature.data.name}
                  </h3>
                  <p className="text-xs text-emerald-300 font-medium mt-1">
                    Civilizational Sphere: {selectedTradeFeature.data.culturalSphere}
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    Commercial Role: {selectedTradeFeature.data.role}
                  </p>
                </div>

                <div className="bg-slate-800/75 p-4 rounded-xl border border-slate-700/80 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-amber-300 font-semibold">
                    Historical & Commercial Overview
                  </div>
                  <div className="text-slate-200 leading-relaxed">
                    {renderFormattedText(selectedTradeFeature.data.description)}
                  </div>
                </div>

                <div className="bg-slate-800/65 p-4 rounded-xl border border-slate-700/75 space-y-2">
                  <div className="text-[11px] font-mono uppercase text-emerald-300 font-semibold">
                    Key Exports, Scholarship & Cultural Legacy
                  </div>
                  <div className="text-slate-200 leading-relaxed">
                    {renderFormattedText(selectedTradeFeature.data.traditionsAndExports)}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
