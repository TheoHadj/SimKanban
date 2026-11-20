import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  FastForward,
  Flame,
  Ban,
  Activity,
  Layers,
  Zap,
  Timer,
  PlusCircle,
} from 'lucide-react';
import type { SimulationMetrics, SimulationConfig } from '../types/kanban';

interface SimulationDockProps {
  isRunning: boolean;
  speed: number;
  metrics: SimulationMetrics;
  config: SimulationConfig;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepHour: () => void;
  onStepDay: () => void;
  onSpeedChange: (speed: number) => void;
  onAddUrgentTask: () => void;
  onBlockRandomTask: () => void;
  onAddBatchTasks?: () => void;
}

export const SimulationDock: React.FC<SimulationDockProps> = ({
  isRunning,
  speed,
  metrics,
  config,
  onPlay,
  onPause,
  onReset,
  onStepHour,
  onStepDay,
  onSpeedChange,
  onAddUrgentTask,
  onBlockRandomTask,
  onAddBatchTasks,
}) => {
  const speeds = [1, 2, 5, 10];
  const hoursPerDay = config.hoursPerDay || 8;
  const currentHourOfDay = ((metrics.currentHour - 1) % hoursPerDay) + 1;
  const currentDayInSprint = ((metrics.currentDay - 1) % config.sprintDurationDays) + 1;
  const leadTimeDays = Math.round((metrics.averageLeadTimeHours / hoursPerDay) * 10) / 10;

  return (
    <footer className="h-16 bg-zinc-950/95 backdrop-blur border-t border-zinc-800/80 px-5 flex items-center justify-between gap-4 select-none z-20">
      {/* 1. Play / Pause / Reset & Step Controls */}
      <div className="flex items-center gap-2">
        {!isRunning ? (
          <button
            onClick={onPlay}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold shadow transition active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Démarrer</span>
          </button>
        ) : (
          <button
            onClick={onPause}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-450 text-zinc-950 text-xs font-bold shadow transition active:scale-95"
          >
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span>Pause</span>
          </button>
        )}

        <button
          onClick={onReset}
          className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-800 transition"
          title="Réinitialiser la simulation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Step by step */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 ml-1">
          <button
            onClick={onStepHour}
            disabled={isRunning}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Avancer d'une heure"
          >
            <StepForward className="w-3 h-3" />
            <span>+1h</span>
          </button>
          <button
            onClick={onStepDay}
            disabled={isRunning}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Avancer d'un jour entier"
          >
            <FastForward className="w-3 h-3" />
            <span>+1j</span>
          </button>
        </div>

        {/* Speed Pills */}
        <div className="hidden lg:flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 ml-1">
          {speeds.map(s => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2 py-1 rounded text-[11px] font-mono transition ${
                speed === s
                  ? 'bg-zinc-800 text-white font-bold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* 2. Center: Timeline Scrubber */}
      <div className="flex-1 max-w-md hidden md:flex flex-col gap-1">
        <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <span>Sprint {metrics.currentSprint} • J{currentDayInSprint}/{config.sprintDurationDays} ({currentHourOfDay}h/{hoursPerDay}h)</span>
          <span className="text-zinc-500">{metrics.sprintProgressPercent}%</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-zinc-300 transition-all duration-300"
            style={{ width: `${metrics.sprintProgressPercent}%` }}
          />
        </div>
      </div>

      {/* 3. Compact HUD Metrics & Aléas */}
      <div className="flex items-center gap-3">
        {/* HUD Stats */}
        <div className="hidden sm:flex items-center gap-3 text-xs pr-2 border-r border-zinc-800">
          <div className="flex items-center gap-1.5 text-zinc-300" title="Travail en cours">
            <Layers className="w-3.5 h-3.5 text-zinc-500" />
            <span className="font-mono font-semibold">{metrics.wipCount}</span>
            <span className="text-zinc-500 text-[10px]">WIP</span>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-300" title="Vélocité clôturée (Story Points)">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono font-semibold text-amber-300">{metrics.completedPointsCount || 0}</span>
            <span className="text-zinc-500 text-[10px]">SP</span>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-300" title="Débit journalier">
            <Activity className="w-3.5 h-3.5 text-zinc-500" />
            <span className="font-mono font-semibold">{metrics.throughputPerDay}</span>
            <span className="text-zinc-500 text-[10px]">t/j</span>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-300" title="Lead Time moyen">
            <Timer className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono font-semibold">{leadTimeDays}j</span>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-300" title="Taux d'activité des développeurs">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono font-semibold">{metrics.teamUtilizationRate}%</span>
          </div>
        </div>

        {/* Quick Aléas & Batch Actions */}
        <div className="flex items-center gap-1.5">
          {onAddBatchTasks && (
            <button
              onClick={onAddBatchTasks}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60 text-xs font-medium transition"
              title="Alimenter le backlog avec un lot de 10 tâches techniques"
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden xl:inline">+10 Tâches</span>
            </button>
          )}

          <button
            onClick={onAddUrgentTask}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/50 text-xs font-medium transition"
            title="Injecter une tâche d'urgence"
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden xl:inline">+ Incident</span>
          </button>

          <button
            onClick={onBlockRandomTask}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-800/50 text-xs font-medium transition"
            title="Simuler un aléa de blocage"
          >
            <Ban className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline">Bloquer</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
