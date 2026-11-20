import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  ArrowRight, 
  Zap, 
  Layers, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import type { SimulationMetrics, SimulationConfig } from '../types/kanban';

interface SprintEndModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: SimulationMetrics;
  config: SimulationConfig;
  onContinue: () => void;
  onOpenRetro?: () => void;
  currentProjectId?: string;
}

export const SprintEndModal: React.FC<SprintEndModalProps> = ({
  isOpen,
  onClose,
  metrics,
  config,
  onContinue,
  onOpenRetro,
  currentProjectId = 'pixels-dragons',
}) => {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isPixels = currentProjectId === 'pixels-dragons';

  const isWipHigh = metrics.wipCount > 6;
  const isVelocityGood = metrics.completedPointsCount >= 20;

  // Pixels & Dragons specific impact estimation
  const cloudSavingsEuro = metrics.completedTasksCount * 1450;
  const telemetryPurgedTb = (metrics.completedTasksCount * 0.42).toFixed(1);
  const rollbackRiskReduction = Math.min(90, metrics.completedTasksCount * 6);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-xl w-full shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400 shadow-inner">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Bilan du Sprint {metrics.currentSprint - 1} terminé !
            </h2>
            <p className="text-xs text-zinc-400">
              {config.sprintDurationDays} jours ouvrés écoulés ({config.sprintDurationDays * (config.hoursPerDay || 8)}h de simulation)
            </p>
          </div>
        </div>

        {/* 1. Sprint Raw Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-2xl text-left">
            <span className="text-[10px] text-zinc-400 block mb-0.5 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Vélocité
            </span>
            <div className="text-lg font-bold font-mono text-zinc-100">
              {metrics.completedPointsCount} <span className="text-xs font-normal text-zinc-500">SP</span>
            </div>
            <span className="text-[9px] text-zinc-500">Points livrés</span>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-2xl text-left">
            <span className="text-[10px] text-zinc-400 block mb-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Livrables
            </span>
            <div className="text-lg font-bold font-mono text-emerald-400">
              {metrics.completedTasksCount}
            </div>
            <span className="text-[9px] text-zinc-500">Stories en Done</span>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-2xl text-left">
            <span className="text-[10px] text-zinc-400 block mb-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              Lead Time
            </span>
            <div className="text-lg font-bold font-mono text-cyan-400">
              {metrics.averageLeadTimeHours}h
            </div>
            <span className="text-[9px] text-zinc-500">Temps de traversée</span>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-2xl text-left">
            <span className="text-[10px] text-zinc-400 block mb-0.5 flex items-center gap-1">
              <Layers className="w-3 h-3 text-purple-400" />
              WIP Restant
            </span>
            <div className="text-lg font-bold font-mono text-purple-400">
              {metrics.wipCount}
            </div>
            <span className="text-[9px] text-zinc-500">Tickets en cours</span>
          </div>
        </div>

        {/* 2. Lean IT Interpretation Section */}
        <div className="bg-zinc-950/60 border border-indigo-950/50 rounded-2xl p-4 space-y-3 text-left">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Interprétation Lean IT & Analyse du Flux</span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Flow & Waiting Muda Interpretation */}
            <div className="bg-zinc-900/80 border border-zinc-800/80 p-2.5 rounded-xl flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1 shrink-0" />
              <div>
                <strong className="text-zinc-200">Fluidité vs Attente (Muda) : </strong>
                <span className="text-zinc-400">
                  {metrics.averageLeadTimeHours > 0
                    ? `Le Lead Time moyen est de ${metrics.averageLeadTimeHours}h avec une efficacité de flux estimée à ${metrics.flowEfficiency}%. Le rapport attente/travail est stable.`
                    : 'Les premières tâches sont en cours de calibrage sur la chaîne de valeur.'}
                </span>
              </div>
            </div>

            {/* WIP & Surcharge Muri Interpretation */}
            <div className="bg-zinc-900/80 border border-zinc-800/80 p-2.5 rounded-xl flex items-start gap-2.5">
              <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${isWipHigh ? 'bg-rose-400' : 'bg-emerald-400'}`} />
              <div>
                <strong className="text-zinc-200">Charge & Multitâche (Muri) : </strong>
                <span className="text-zinc-400">
                  {isWipHigh
                    ? `WIP résiduel de ${metrics.wipCount} tickets. Attention : saturation détectée, risque de goulot d'étranglement sur les colonnes amont.`
                    : `WIP résiduel maîtrisé (${metrics.wipCount} tickets). Le respect des limites WIP a évité la surcharge cognitive des collaborateurs.`}
                </span>
              </div>
            </div>

            {/* Velocity & Regularity Mura */}
            <div className="bg-zinc-900/80 border border-zinc-800/80 p-2.5 rounded-xl flex items-start gap-2.5">
              <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${isVelocityGood ? 'bg-amber-400' : 'bg-blue-400'}`} />
              <div>
                <strong className="text-zinc-200">Cadence & Régularité (Mura) : </strong>
                <span className="text-zinc-400">
                  Débit journalier de <strong>{metrics.throughputPerDay} tickets/jour</strong>. Rythme soutenable et lissé sur l'ensemble de l'itération.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Pixels & Dragons specific business impact */}
        {isPixels && (
          <div className="bg-gradient-to-r from-emerald-950/20 via-zinc-950 to-indigo-950/20 border border-emerald-900/30 rounded-2xl p-4 text-left space-y-2">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block font-mono">
              Impact Concret sur « Chroniques de l'Ombre » :
            </span>
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-zinc-900/80 border border-zinc-800 p-2 rounded-xl">
                <span className="text-[9px] text-zinc-500 block">Économies Cloud</span>
                <span className="text-xs font-bold text-emerald-400">~{cloudSavingsEuro.toLocaleString()} € / mois</span>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800 p-2 rounded-xl">
                <span className="text-[9px] text-zinc-500 block">Télémétrie Purgée</span>
                <span className="text-xs font-bold text-cyan-400">{telemetryPurgedTb} To</span>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800 p-2 rounded-xl">
                <span className="text-[9px] text-zinc-500 block">Risque Rollback</span>
                <span className="text-xs font-bold text-indigo-400">-{rollbackRiskReduction}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {onOpenRetro && (
            <button
              onClick={() => {
                onClose();
                onOpenRetro();
              }}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-xs border border-zinc-700 transition active:scale-95 shadow"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Lancer la Rétrospective (Kaizen)</span>
            </button>
          )}

          <button
            onClick={() => {
              onClose();
              onContinue();
            }}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition active:scale-95"
          >
            <span>Démarrer le Sprint {metrics.currentSprint}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
