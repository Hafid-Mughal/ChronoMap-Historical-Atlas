import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Search, Filter, Radio, ChevronRight, Globe, Calendar } from 'lucide-react';
import { CONFLICT_ZONES, ConflictZone } from '../data/conflictZones';

interface ConflictsListViewProps {
  onSelectConflict: (conflict: ConflictZone) => void;
  onLaunchWhatIf: (scenario: string) => void;
}

export const ConflictsListView: React.FC<ConflictsListViewProps> = ({
  onSelectConflict,
  onLaunchWhatIf
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredConflicts = CONFLICT_ZONES.filter((c) => {
    const matchesFilter = filterType === 'all' || c.type === filterType;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.combatantsOrClaimants.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full h-full overflow-y-auto p-6 bg-slate-950 text-slate-100 space-y-6 max-w-6xl mx-auto">
      {/* Title & Introduction */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
          <ShieldAlert className="w-4 h-4 text-red-500" />
          <span>GEOPOLITICAL HOT-SPOTS & ACTIVE DISPUTES</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Global Conflict Zones & Frontier Flashpoints
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Comprehensive intelligence dossier on active wars, contested borders, frozen ceasefire lines, and critical maritime corridors across modern and historical eras.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Zones ({CONFLICT_ZONES.length})
          </button>
          <button
            onClick={() => setFilterType('active_war')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              filterType === 'active_war'
                ? 'bg-red-500 text-white font-semibold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Active Wars
          </button>
          <button
            onClick={() => setFilterType('territorial_dispute')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              filterType === 'territorial_dispute'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Territorial Disputes
          </button>
          <button
            onClick={() => setFilterType('frozen_conflict')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              filterType === 'frozen_conflict'
                ? 'bg-sky-500 text-slate-950 font-semibold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Frozen Frontlines
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search country, zone, or party..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Conflict Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredConflicts.map((conflict) => {
          const isCritical = conflict.severity === 'critical';
          return (
            <div
              key={conflict.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all shadow-md flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
                    isCritical ? 'text-red-400' : 'text-amber-400'
                  }`}>
                    {conflict.type === 'active_war' ? 'ACTIVE WAR' : conflict.type === 'territorial_dispute' ? 'TERRITORIAL DISPUTE' : 'FROZEN FRONT'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {conflict.region}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  {conflict.name}
                </h3>

                <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {conflict.summary}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    <span>Inception: <strong className="text-slate-200">{conflict.startDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-red-300 text-[11px]">
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                    <span className="truncate">Toll: {conflict.casualtiesOrImpact}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectConflict(conflict)}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>Inspect Intelligence</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onLaunchWhatIf(`What if the ${conflict.name} had concluded with an early negotiated settlement?`)}
                  className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                >
                  What-If Simulation →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
