import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TimelineScrubber } from './components/TimelineScrubber';
import { WorldMap } from './components/WorldMap';
import { HistoryChatDrawer } from './components/HistoryChatDrawer';
import { YearSnapshotModal, YearSnapshotData } from './components/YearSnapshotModal';
import { GEOPOLITICAL_ERAS, GeopoliticalEra, getGeopoliticalEra } from './data/historicalErasGeo';
import { MapRegion } from './data/worldMapData';
import { ConflictZone, CONFLICT_ZONES } from './data/conflictZones';
import {
  ArchaeologicalSite,
  ARCHAEOLOGICAL_SITES
} from './data/archaeologicalSitesData';
import {
  SelectedPhysicalFeature,
  SelectedTradeFeature
} from './data/mapLayersData';
import { HistoricalSearchItem } from './data/historicalSearchIndex';
import { WORLD_COUNTRIES } from './data/geoService';
import { getCountryEraData } from './data/historicalAtlasEngine';
import { generateLocalYearSnapshot } from './data/localHistorianFallback';

export default function App() {
  const [isDark, setIsDark] = useState(true);

  // Modern day 2026 is default
  const modernEra =
    GEOPOLITICAL_ERAS.find((e) => e.year === 2026) ||
    GEOPOLITICAL_ERAS[GEOPOLITICAL_ERAS.length - 1];
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentEra, setCurrentEra] = useState<GeopoliticalEra>(modernEra);

  // Selected country/empire, conflict zone, archaeological site, physical geography feature, or trade route (shown in the Dossier Drawer)
  const [selectedRegion, setSelectedRegion] = useState<MapRegion | null>(null);
  const [selectedConflict, setSelectedConflict] = useState<ConflictZone | null>(null);
  const [selectedArchSite, setSelectedArchSite] = useState<ArchaeologicalSite | null>(null);
  const [selectedPhysicalFeature, setSelectedPhysicalFeature] =
    useState<SelectedPhysicalFeature | null>(null);
  const [selectedTradeFeature, setSelectedTradeFeature] =
    useState<SelectedTradeFeature | null>(null);

  // Active Search Target (for auto-panning & zooming WorldMap)
  const [focusedSearchTarget, setFocusedSearchTarget] = useState<HistoricalSearchItem | null>(
    null
  );

  // Historical Dossier Drawer state
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);

  // World Year Snapshot Modal state
  const [isYearSnapshotOpen, setIsYearSnapshotOpen] = useState(false);
  const [yearSnapshotData, setYearSnapshotData] = useState<YearSnapshotData | null>(null);
  const [isAiYearLoading, setIsAiYearLoading] = useState(false);

  // Sync dark class on document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Handle year scrubbing: clear any active search pin/highlight when the user changes the year
  const handleYearChange = (year: number) => {
    setCurrentYear(year);
    const closest = getGeopoliticalEra(year);
    if (closest.id !== currentEra.id) {
      setCurrentEra(closest);
    }
    setFocusedSearchTarget(null);
    setSelectedRegion(null);
    setSelectedConflict(null);
    setSelectedArchSite(null);
    setSelectedPhysicalFeature(null);
    setSelectedTradeFeature(null);
    setIsDossierOpen(false);
  };

  // Handle era selection: clear any active search pin/highlight when switching eras
  const handleSelectEra = (era: GeopoliticalEra) => {
    setCurrentEra(era);
    setCurrentYear(era.year);
    setFocusedSearchTarget(null);
    setSelectedRegion(null);
    setSelectedConflict(null);
    setSelectedArchSite(null);
    setSelectedPhysicalFeature(null);
    setSelectedTradeFeature(null);
    setIsDossierOpen(false);
  };

  // Selecting a country/empire on the map opens the Historical & Year-Specific Dossier Drawer
  const handleSelectRegion = (region: MapRegion) => {
    setFocusedSearchTarget(null);
    setSelectedConflict(null);
    setSelectedArchSite(null);
    setSelectedPhysicalFeature(null);
    setSelectedTradeFeature(null);
    setSelectedRegion({ ...region });
    setIsDossierOpen(true);
  };

  // Selecting a war zone / disputed area opens the Conflict Intelligence & Year-Specific Dossier Drawer
  const handleSelectConflict = (conflict: ConflictZone) => {
    setFocusedSearchTarget(null);
    setSelectedRegion(null);
    setSelectedArchSite(null);
    setSelectedPhysicalFeature(null);
    setSelectedTradeFeature(null);
    setSelectedConflict({ ...conflict });
    setIsDossierOpen(true);
  };

  // Selecting an archaeological site / historical ruin on the map opens the Archaeological Site Dossier Drawer
  const handleSelectArchSite = (site: ArchaeologicalSite) => {
    setFocusedSearchTarget(null);
    setSelectedRegion(null);
    setSelectedConflict(null);
    setSelectedPhysicalFeature(null);
    setSelectedTradeFeature(null);
    setSelectedArchSite({ ...site });
    setIsDossierOpen(true);
  };

  // Selecting a physical geography feature (mountain range, river, or desert/biome) opens the General Physical Geography Dossier
  const handleSelectPhysicalFeature = (feature: SelectedPhysicalFeature) => {
    setFocusedSearchTarget(null);
    setSelectedRegion(null);
    setSelectedConflict(null);
    setSelectedArchSite(null);
    setSelectedTradeFeature(null);
    setSelectedPhysicalFeature(feature);
    setIsDossierOpen(true);
  };

  // Selecting a trade route or commercial hub opens the Trade Route Dossier
  const handleSelectTradeFeature = (feature: SelectedTradeFeature) => {
    setFocusedSearchTarget(null);
    setSelectedRegion(null);
    setSelectedConflict(null);
    setSelectedArchSite(null);
    setSelectedPhysicalFeature(null);
    setSelectedTradeFeature(feature);
    setIsDossierOpen(true);
  };

  // Handle Universal Search Selection (Jumps TimelineScrubber to year & pans WorldMap to location)
  const handleSelectSearchResult = (item: HistoricalSearchItem) => {
    // 1. Jump TimelineScrubber and Era to the target year
    const targetYear = item.year;
    setCurrentYear(targetYear);
    const closestEra = getGeopoliticalEra(targetYear);
    setCurrentEra(closestEra);

    // 2. Trigger WorldMap pan & zoom to the target coordinates
    setFocusedSearchTarget({
      ...item,
      id: `${item.id}_${Date.now()}`
    });

    // 3. If the search item corresponds to an Archaeological Site, open its Archaeological Site Dossier
    const matchedArchSite = ARCHAEOLOGICAL_SITES.find(
      (s) =>
        `arch_search_${s.id}` === item.id ||
        s.name.toLowerCase() === item.title.toLowerCase() ||
        s.shortLabel.toLowerCase() === item.title.toLowerCase()
    );
    if (matchedArchSite) {
      setSelectedRegion(null);
      setSelectedConflict(null);
      setSelectedPhysicalFeature(null);
      setSelectedTradeFeature(null);
      setSelectedArchSite(matchedArchSite);
      setIsDossierOpen(true);
      return;
    }

    // 4. Highlight the corresponding Conflict Zone or Country/Empire Dossier
    if (item.category === 'conflict' && item.conflictId) {
      const matchedConflict = CONFLICT_ZONES.find((c) => c.id === item.conflictId);
      if (matchedConflict) {
        setSelectedRegion(null);
        setSelectedArchSite(null);
        setSelectedPhysicalFeature(null);
        setSelectedTradeFeature(null);
        setSelectedConflict(matchedConflict);
        setIsDossierOpen(true);
        return;
      }
    }

    const matchedGeoCountry = WORLD_COUNTRIES.find(
      (c) => c.name.toLowerCase() === item.modernCountry.toLowerCase()
    );
    const eraProfile = getCountryEraData(item.modernCountry, targetYear);

    const regionData: MapRegion = {
      id: eraProfile.entityId,
      name:
        item.category === 'figure' || item.category === 'city'
          ? `${item.title} — ${eraProfile.entityName}`
          : item.category === 'empire'
          ? item.title
          : eraProfile.entityName,
      modernCountry: matchedGeoCountry?.name || item.modernCountry,
      capital: item.category === 'city' ? item.title : eraProfile.capital,
      ruler: item.category === 'figure' ? item.title : eraProfile.ruler,
      populationEstimate: eraProfile.populationEstimate,
      color: eraProfile.color,
      path: matchedGeoCountry?.path || '',
      center: item.svgCoords,
      description:
        item.category === 'figure' || item.category === 'city' || item.category === 'empire'
          ? `${item.summary} (${eraProfile.description})`
          : eraProfile.description,
      keyEvents: eraProfile.keyEvents
    };

    setSelectedConflict(null);
    setSelectedArchSite(null);
    setSelectedPhysicalFeature(null);
    setSelectedTradeFeature(null);
    setSelectedRegion(regionData);
    setIsDossierOpen(true);
  };

  // Request World Historical Snapshot for continuous year
  const handleRequestAISnapshot = async (year: number) => {
    setIsAiYearLoading(true);
    try {
      const res = await fetch('/api/history/year-snapshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year })
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        setYearSnapshotData(data);
        setIsYearSnapshotOpen(true);
      } else {
        setYearSnapshotData(generateLocalYearSnapshot(year));
        setIsYearSnapshotOpen(true);
      }
    } catch {
      setYearSnapshotData(generateLocalYearSnapshot(year));
      setIsYearSnapshotOpen(true);
    } finally {
      setIsAiYearLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Top Navigation Bar with Universal Search & About Developer Button */}
      <Header
        onSelectSearchResult={handleSelectSearchResult}
      />

      {/* Main Viewport */}
      <div className="flex flex-col flex-1 min-h-0 relative overflow-hidden">
        {/* Timeline Scrubber Bar spanning 3000 BCE to 2026 CE */}
        <TimelineScrubber
          currentYear={currentYear}
          currentEra={currentEra}
          onYearChange={handleYearChange}
          onSelectEra={handleSelectEra}
          onRequestAISnapshot={handleRequestAISnapshot}
          isAiLoading={isAiYearLoading}
        />

        {/* Interactive World Map Area */}
        <div className="flex-1 min-h-0 relative p-1.5 sm:p-2.5 lg:p-3 bg-slate-950 overflow-hidden">
          <WorldMap
            currentEra={currentEra}
            currentYear={currentYear}
            onSelectRegion={handleSelectRegion}
            onSelectConflict={handleSelectConflict}
            onSelectArchSite={handleSelectArchSite}
            onSelectPhysicalFeature={handleSelectPhysicalFeature}
            onSelectTradeFeature={handleSelectTradeFeature}
            onClearRegionSelection={() => {
              if (selectedRegion) {
                setSelectedRegion(null);
                setIsDossierOpen(false);
              }
            }}
            selectedRegionId={selectedRegion?.id}
            selectedConflictId={selectedConflict?.id}
            selectedArchSiteId={selectedArchSite?.id}
            selectedPhysicalFeatureId={selectedPhysicalFeature?.data.id}
            selectedTradeFeatureId={selectedTradeFeature?.data.id}
            focusedSearchTarget={focusedSearchTarget}
            onClearSearchTarget={() => setFocusedSearchTarget(null)}
          />
        </div>
      </div>

      {/* Country, Empire, Conflict Zone, Archaeological Site, Physical Feature & Trade Route Dossier Drawer */}
      <HistoryChatDrawer
        isOpen={isDossierOpen}
        onToggleOpen={setIsDossierOpen}
        selectedRegion={selectedRegion}
        selectedConflict={selectedConflict}
        selectedArchSite={selectedArchSite}
        selectedPhysicalFeature={selectedPhysicalFeature}
        selectedTradeFeature={selectedTradeFeature}
        onClearSelection={() => {
          setSelectedRegion(null);
          setSelectedConflict(null);
          setSelectedArchSite(null);
          setSelectedPhysicalFeature(null);
          setSelectedTradeFeature(null);
        }}
        year={currentYear}
      />

      {/* World Year Snapshot Modal */}
      {isYearSnapshotOpen && (
        <YearSnapshotModal
          data={yearSnapshotData}
          onClose={() => setIsYearSnapshotOpen(false)}
        />
      )}
    </div>
  );
}

