import React, { useState, useRef, useEffect } from 'react';
import { 
  Kanban, 
  LayoutDashboard, 
  BarChart2, 
  Settings, 
  Sparkles, 
  Play, 
  Hand, 
  RotateCcw, 
  BookOpen, 
  ChevronDown, 
  Check, 
  Home
} from 'lucide-react';
import type { SimulationMetrics, SimulationConfig, ProjectTemplate } from '../types/kanban';
import { AVAILABLE_PROJECTS } from '../utils/projects';

export type ActiveTab = 'board' | 'dashboard' | 'analytics' | 'retro' | 'presentation' | 'home';
export type AppMode = 'simulator' | 'manual';

interface LinearHeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  appMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  metrics: SimulationMetrics;
  config: SimulationConfig;
  currentProject: ProjectTemplate;
  onSelectProject: (projectId: string) => void;
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
  currentProject,
  onSelectProject,
  onOpenSettings,
  onOpenScenarios,
}) => {
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentDayInSprint = ((metrics.currentDay - 1) % config.sprintDurationDays) + 1;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProjectDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-14 bg-zinc-950 border-b border-zinc-800/80 px-4 flex items-center justify-between select-none">
      {/* Left: App Branding & Project Selector & Views Navigation */}
      <div className="flex items-center gap-3 lg:gap-5">
        {/* Brand & Project Switcher Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProjectDropdownOpen(prev => !prev)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-semibold text-zinc-100 transition shadow-sm"
            title="Changer d'espace projet"
          >
            <span className="text-base">{currentProject.icon}</span>
            <span className="font-bold tracking-tight text-white hidden sm:inline max-w-[150px] truncate">
              {currentProject.shortName}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {isProjectDropdownOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-72 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1.5 text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                Espaces de travail
              </div>

              <div className="space-y-1">
                {AVAILABLE_PROJECTS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectProject(p.id);
                      setIsProjectDropdownOpen(false);
                    }}
                    className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition ${
                      p.id === currentProject.id
                        ? 'bg-zinc-800/90 text-white'
                        : 'hover:bg-zinc-800/50 text-zinc-300'
                    }`}
                  >
                    <span className="text-xl mt-0.5">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-zinc-100 flex items-center justify-between">
                        <span className="truncate">{p.shortName}</span>
                        {p.id === currentProject.id && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-zinc-400 line-clamp-1">{p.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-2 mt-1 border-t border-zinc-800/80">
                <button
                  onClick={() => {
                    onTabChange('home');
                    setIsProjectDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Vue d'ensemble des projets</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 overflow-x-auto">
          <button
            onClick={() => onTabChange('board')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition shrink-0 ${
              activeTab === 'board'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Tableau</span>
            <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">({metrics.totalTasksCount})</span>
          </button>

          <button
            onClick={() => onTabChange('dashboard')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition shrink-0 ${
              activeTab === 'dashboard'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <button
            onClick={() => onTabChange('analytics')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition shrink-0 ${
              activeTab === 'analytics'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Flux & CFD</span>
          </button>

          <button
            onClick={() => onTabChange('retro')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition shrink-0 ${
              activeTab === 'retro'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Rétro Kaizen</span>
          </button>

          <button
            onClick={() => onTabChange('presentation')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition shrink-0 ${
              activeTab === 'presentation'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">Guide Lean IT</span>
            <span className="lg:hidden">Lean</span>
          </button>
        </div>
      </div>

      {/* Center: Mode Switcher (Simulator vs Manual) */}
      <div className="hidden xl:flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
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
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sprint Pill */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs">
          <span className="font-semibold text-zinc-200">Sprint {metrics.currentSprint}</span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="text-zinc-400 hidden sm:inline">J{currentDayInSprint}/{config.sprintDurationDays}</span>
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
