import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, ArrowRight, Zap, Layers, Activity } from 'lucide-react';
import type { SimulationMetrics, SimulationConfig } from '../types/kanban';

interface SprintEndModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: SimulationMetrics;
  config: SimulationConfig;
  onContinue: () => void;
}

export const SprintEndModal: React.FC<SprintEndModalProps> = ({
  isOpen,
  onClose,
  metrics,
  config,
  onContinue,
}) => {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 text-amber-400">
          <Trophy className="w-7 h-7" />
        </div>

        <h2 className="text-lg font-bold text-white mb-1">
          Fin du Sprint {metrics.currentSprint - 1} !
        </h2>
        <p className="text-xs text-zinc-400 mb-6">
          Bilan de l'itération ({config.sprintDurationDays} jours ouvrés écoulés)
        </p>

        {/* Sprint Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-left">
          <div className="bg-zinc-950/70 border border-zinc-800 p-3 rounded-xl">
            <span className="text-[10px] text-zinc-400 block mb-0.5 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Vélocité Totale
            </span>
            <div className="text-xl font-bold font-mono text-zinc-100">
              {metrics.completedPointsCount} <span className="text-xs font-normal text-zinc-500">SP</span>
            </div>
            <span className="text-[10px] text-zinc-500">Points Fibonacci livrés</span>
          </div>

          <div className="bg-zinc-950/70 border border-zinc-800 p-3 rounded-xl">
            <span className="text-[10px] text-zinc-400 block mb-0.5">Stories Finies</span>
            <div className="text-xl font-bold font-mono text-emerald-400">
              {metrics.completedTasksCount}
            </div>
            <span className="text-[10px] text-zinc-500">Tickets passés en Done</span>
          </div>

          <div className="bg-zinc-950/70 border border-zinc-800 p-3 rounded-xl">
            <span className="text-[10px] text-zinc-400 block mb-0.5 flex items-center gap-1">
              <Layers className="w-3 h-3 text-zinc-500" />
              WIP Restant
            </span>
            <div className="text-xl font-bold font-mono text-zinc-200">
              {metrics.wipCount}
            </div>
            <span className="text-[10px] text-zinc-500">En cours sur les colonnes</span>
          </div>

          <div className="bg-zinc-950/70 border border-zinc-800 p-3 rounded-xl">
            <span className="text-[10px] text-zinc-400 block mb-0.5 flex items-center gap-1">
              <Activity className="w-3 h-3 text-cyan-400" />
              Débit journalier
            </span>
            <div className="text-xl font-bold font-mono text-cyan-400">
              {metrics.throughputPerDay} <span className="text-xs font-normal text-zinc-500">t/j</span>
            </div>
            <span className="text-[10px] text-zinc-500">Throughput effectif</span>
          </div>
        </div>

        <button
          onClick={() => {
            onClose();
            onContinue();
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs shadow-md transition active:scale-95"
        >
          <span>Lancer le Sprint {metrics.currentSprint}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
