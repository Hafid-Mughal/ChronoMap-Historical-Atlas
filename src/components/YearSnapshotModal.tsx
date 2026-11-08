import React from 'react';
import { X, Sparkles, Landmark, AlertTriangle, ShieldCheck, BookOpen, Compass } from 'lucide-react';

export interface YearSnapshotData {
  year: number;
  yearDisplay: string;
  eraName: string;
  summary: string;
  dominantEmpires: Array<{
    name: string;
    region?: string;
    ruler?: string;
    capital?: string;
    description: string;
  }>;
  activeConflicts: Array<{
    name: string;
    region?: string;
    severity?: string;
    isDisputed?: boolean;
    description: string;
  }>;
  keyDevelopments: string[];
}

interface YearSnapshotModalProps {
  data: YearSnapshotData | null;
  onClose: () => void;
  onSelectEmpire?: (empireName: string) => void;
}

export const YearSnapshotModal: React.FC<YearSnapshotModalProps> = ({
  data,
  onClose
}) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>WORLD CHRONOLOGICAL DOSSIER · {data.yearDisplay}</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
              {data.eraName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-200">
          {/* Executive Era Summary */}
          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Global Geopolitical State:
            </span>
            <p className="text-slate-200 leading-relaxed text-xs sm:text-sm">
              {data.summary}
            </p>
          </div>

          {/* Dominant Empires & Kingdoms */}
          {data.dominantEmpires && data.dominantEmpires.length > 0 && (
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5" />
                Dominant Empires & Sovereign Realms in {data.yearDisplay}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.dominantEmpires.map((emp, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-white text-xs">{emp.name}</span>
                        {emp.region && (
                          <span className="text-[10px] text-slate-400 font-mono">{emp.region}</span>
                        )}
                      </div>
                      {emp.ruler && (
                        <p className="text-[11px] text-amber-300">
                          Ruler: {emp.ruler}
                        </p>
                      )}
                      {emp.capital && (
                        <p className="text-[11px] text-slate-400">
                          Seat: {emp.capital}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                        {emp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Conflicts & Disputed Frontiers */}
          {data.activeConflicts && data.activeConflicts.length > 0 && (
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-red-400 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                Wars, Frontlines & Territorial Disputes in {data.yearDisplay}
              </h3>
              <div className="space-y-2">
                {data.activeConflicts.map((c, idx) => (
                  <div
                    key={idx}
                    className="bg-red-950/20 p-3 rounded-lg border border-red-900/40 text-xs"
                  >
                    <div className="flex items-center justify-between gap-1 font-semibold text-red-300 mb-0.5">
                      <span>{c.name}</span>
                      {c.region && <span className="text-[10px] text-slate-400">{c.region}</span>}
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {c.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Global Developments */}
          {data.keyDevelopments && data.keyDevelopments.length > 0 && (
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <span className="text-xs font-mono uppercase tracking-wider text-sky-400 mb-2 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                Key Developments & Inventions of this Epoch:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {data.keyDevelopments.map((dev, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-sky-400 text-[10px] mt-0.5 font-mono">0{idx + 1}.</span>
                    <span>{dev}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex justify-end items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
