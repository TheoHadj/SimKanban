import React from 'react';
import type { ScenarioPreset } from '../types/kanban';
import { PRESET_SCENARIOS } from '../utils/presets';
import { X, Sparkles, ArrowRight, Users, Calendar, Layers } from 'lucide-react';

interface ScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadScenario: (scenario: ScenarioPreset) => void;
}

export const ScenariosModal: React.FC<ScenariosModalProps> = ({
  isOpen,
  onClose,
  onLoadScenario,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 px-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/40">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Scénarios du Simulateur</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Configurations types pour observer les lois du flux, goulets et variabilités
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scenarios Grid */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {PRESET_SCENARIOS.map(scenario => {
            return (
              <div
                key={scenario.id}
                className="group relative bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-4 transition duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg">{scenario.emoji}</span>
                    <h3 className="font-bold text-xs text-white">{scenario.title}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-750">
                      {scenario.subtitle}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed pr-2">
                    {scenario.description}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-mono pt-1">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-zinc-600" />
                      {scenario.members.length} dev
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3 text-zinc-600" />
                      {scenario.config.initialTaskCount} tâches
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-600" />
                      Sprint {scenario.config.sprintDurationDays}j
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onLoadScenario(scenario);
                    onClose();
                  }}
                  className="flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold shadow transition active:scale-95 flex-shrink-0"
                >
                  <span>Charger</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
