import React from 'react';
import { Kanban, LayoutDashboard, BarChart2, Settings, Sparkles, Play, Hand } from 'lucide-react';
import type { SimulationMetrics, SimulationConfig } from '../types/kanban';

export type ActiveTab = 'board' | 'dashboard' | 'analytics';
export type AppMode = 'simulator' | 'manual';

interface LinearHeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  appMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  metrics: SimulationMetrics;
  config: SimulationConfig;
  onOpenSettings: () => void;
  onOpenScenarios: () => void;
}

export const LinearHeader: React.FC<LinearHeaderProps> = ({
  activeTab,
  onTabChange,
  appMode,
  onModeChange,
  metrics,
  config,
  onOpenSettings,
  onOpenScenarios,
}) => {
  const currentDayInSprint = ((metrics.currentDay - 1) % config.sprintDurationDays) + 1;

  return (
    <header className="h-14 bg-zinc-950 border-b border-zinc-800/80 px-4 flex items-center justify-between select-none">
      {/* Left: App Branding & Views Navigation */}
      <div className="flex items-center gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-950 font-black text-sm">
            K
          </div>
          <span className="font-semibold text-sm tracking-tight text-zinc-100 hidden sm:inline">
            Kanban Studio
          </span>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
          <button
            onClick={() => onTabChange('board')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === 'board'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Tableau</span>
            <span className="text-[10px] text-zinc-500 font-mono">({metrics.totalTasksCount})</span>
          </button>

          <button
            onClick={() => onTabChange('dashboard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === 'dashboard'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => onTabChange('analytics')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === 'analytics'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Flux & CFD</span>
          </button>
        </div>
      </div>

      {/* Center: Mode Switcher (Simulator vs Manual) */}
      <div className="hidden md:flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
        <button
          onClick={() => onModeChange('simulator')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
            appMode === 'simulator'
              ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Play className="w-3 h-3 fill-current text-amber-400" />
          <span>Simulateur Auto</span>
        </button>

        <button
          onClick={() => onModeChange('manual')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
            appMode === 'manual'
              ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Hand className="w-3 h-3 text-emerald-400" />
          <span>Mode Manuel</span>
        </button>
      </div>

      {/* Right: Sprint Indicator & Settings */}
      <div className="flex items-center gap-3">
        {/* Sprint Pill */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs">
          <span className="font-semibold text-zinc-200">Sprint {metrics.currentSprint}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400">J{currentDayInSprint}/{config.sprintDurationDays}</span>
        </div>

        {/* Scenarios Button */}
        {appMode === 'simulator' && (
          <button
            onClick={onOpenScenarios}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-medium transition"
            title="Charger un scénario type"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden lg:inline">Scénarios</span>
          </button>
        )}

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-800 transition"
          title="Paramètres de l'équipe et du flux"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
