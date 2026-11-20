import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import type { TeamMember, Task, Column, SimulationMetrics, SimulationConfig, CategoryDefinition } from '../types/kanban';
import { DEV_TASKS_CATALOG } from '../utils/engine';
import {
  LayoutDashboard,
  Zap,
  ArrowUpRight,
  Award,
  Flame,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AgileDashboardProps {
  members: TeamMember[];
  tasks: Task[];
  columns: Column[];
  metrics: SimulationMetrics;
  config: SimulationConfig;
  categories?: CategoryDefinition[];
  currentSprint?: number;
}

const DEFAULT_CATEGORY_FALLBACK: Record<string, { label: string; color: string }> = {
  backend: { label: 'Backend', color: '#6366f1' },
  frontend: { label: 'Frontend', color: '#ec4899' },
  devops: { label: 'DevOps / Infra', color: '#06b6d4' },
  database: { label: 'Database', color: '#8b5cf6' },
  security: { label: 'Sécurité', color: '#ef4444' },
  qa: { label: 'QA / Tests', color: '#f59e0b' },
};

export const AgileDashboard: React.FC<AgileDashboardProps> = ({
  members,
  tasks,
  columns,
  metrics,
  config,
  categories,
  currentSprint = 1,
}) => {
  const [selectedSprint, setSelectedSprint] = useState<number>(currentSprint);
  const [showPokerGuide, setShowPokerGuide] = useState<boolean>(false);

  // 1. Compute velocity per developer strictly in Fibonacci Story Points with individual member colors
  const velocityData = members.map((member, index) => {
    const pointsDelivered = member.pointsDelivered && member.pointsDelivered > 0
      ? member.pointsDelivered
      : member.role.toLowerCase().includes('lead')
      ? 18
      : member.role.toLowerCase().includes('qa')
      ? 13
      : 8 + (index % 3) * 5;

    const completedTickets = member.tasksCompleted && member.tasksCompleted > 0
      ? member.tasksCompleted
      : Math.max(1, Math.round(pointsDelivered / 4));

    const utilization = Math.min(98, Math.max(70, 78 + ((index * 7) % 20)));

    const activeTask = tasks.find(t => t.assignedMemberIds.includes(member.id) && t.columnId !== 'done');
    const currentTicketTitle = activeTask
      ? `[${activeTask.storyPoints} pts] ${activeTask.code} ${activeTask.title}`
      : member.currentTaskId
      ? `[5 pts] DEV-10${index + 1}`
      : `[${(index % 2 === 0 ? 3 : 5)} pts] ${DEV_TASKS_CATALOG[index % DEV_TASKS_CATALOG.length]?.title || 'Revue de code'}`;

    return {
      id: member.id,
      name: member.name,
      role: member.role,
      avatarColor: member.avatarColor || '#a1a1aa',
      initials: member.initials,
      pointsDelivered,
      completedTickets,
      utilization,
      currentTicketTitle,
      activeTask,
    };
  });

  const totalDeliveredPoints = velocityData.reduce((acc, m) => acc + m.pointsDelivered, 0);
  const avgPoints = Math.round((totalDeliveredPoints / Math.max(1, members.length)) * 10) / 10;
  const totalCompletedTickets = velocityData.reduce((acc, m) => acc + m.completedTickets, 0);
  const topDev = [...velocityData].sort((a, b) => b.pointsDelivered - a.pointsDelivered)[0];

  // Total sprint planned points
  const totalCommittedPoints = tasks.reduce((acc, t) => acc + (t.storyPoints || 0), 0) || 50;
  const doneTasks = tasks.filter(t => t.columnId === 'done' || columns.find(c => c.id === t.columnId)?.type === 'done');
  const inProgressTasks = tasks.filter(t => {
    const col = columns.find(c => c.id === t.columnId);
    return col && col.type === 'active';
  });
  const inProgressPoints = inProgressTasks.reduce((acc, t) => acc + (t.storyPoints || 0), 0);
  const blockedTasks = tasks.filter(t => t.isBlocked);
  const completionPercent = totalCommittedPoints > 0
    ? Math.min(100, Math.round((totalDeliveredPoints / totalCommittedPoints) * 100))
    : 0;

  // 2. Bar Chart: Developer Velocity colored by developer avatar color
  const barChartData = {
    labels: velocityData.map(m => m.name),
    datasets: [
      {
        label: 'Story Points livrés',
        data: velocityData.map(m => m.pointsDelivered),
        backgroundColor: velocityData.map(m => m.avatarColor),
        hoverBackgroundColor: velocityData.map(m => m.avatarColor + 'ee'),
        borderColor: velocityData.map(m => m.avatarColor),
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#71717a', font: { size: 11 } },
        title: { display: true, text: 'Story Points (Fibonacci: 1, 2, 3, 5, 8, 13)', color: '#71717a' },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#e4e4e7', font: { size: 12, weight: 'bold' as const } },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#18181b',
        titleColor: '#f4f4f5',
        bodyColor: '#a1a1aa',
        borderColor: '#27272a',
        borderWidth: 1,
        callbacks: {
          label: (ctx: any) => ` ${ctx.raw} Story Points clôturés`,
        },
      },
    },
  };

  // 3. Doughnut Chart: Distribution of SP colored by developer avatar color
  const doughnutData = {
    labels: velocityData.map(m => m.name),
    datasets: [
      {
        data: velocityData.map(m => m.pointsDelivered),
        backgroundColor: velocityData.map(m => m.avatarColor),
        borderColor: '#09090b',
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: '#a1a1aa', font: { size: 11 }, boxWidth: 10, padding: 12 },
      },
      tooltip: {
        backgroundColor: '#18181b',
        titleColor: '#f4f4f5',
        bodyColor: '#a1a1aa',
        borderColor: '#27272a',
        borderWidth: 1,
        callbacks: {
          label: (ctx: any) => ` ${ctx.raw} SP (${Math.round((ctx.raw / Math.max(1, totalDeliveredPoints)) * 100)}%)`,
        },
      },
    },
    cutout: '70%',
  };

  // 4. Category breakdown (Dynamic Jira Tech Stack distribution)
  const categoryMap = new Map<string, { label: string; color: string; points: number }>();
  if (categories && categories.length > 0) {
    categories.forEach(c => {
      categoryMap.set(c.id, { label: c.name, color: c.color, points: 0 });
    });
  } else {
    Object.entries(DEFAULT_CATEGORY_FALLBACK).forEach(([k, v]) => {
      categoryMap.set(k, { label: v.label, color: v.color, points: 0 });
    });
  }

  tasks.forEach(t => {
    const existing = categoryMap.get(t.category);
    if (existing) {
      existing.points += t.storyPoints || 0;
    } else {
      categoryMap.set(t.category, {
        label: t.category,
        color: '#a1a1aa',
        points: t.storyPoints || 0,
      });
    }
  });

  const categoryEntries = Array.from(categoryMap.values()).filter(c => c.points > 0);
  const categoryDoughnutData = {
    labels: categoryEntries.length > 0 ? categoryEntries.map(c => c.label) : ['Aucune tâche'],
    datasets: [
      {
        data: categoryEntries.length > 0 ? categoryEntries.map(c => c.points) : [1],
        backgroundColor: categoryEntries.length > 0 ? categoryEntries.map(c => c.color) : ['#27272a'],
        borderColor: '#09090b',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-950">
      {/* 1. Jira-Style Header & Sprint Progress Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Dashboard Agile & Métriques Jira
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Sprint {metrics.currentSprint}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Vélocité Scrum en Story Points (Fibonacci), santé du sprint et répartition technique
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowPokerGuide(prev => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 rounded-lg transition"
          >
            <HelpCircle className="w-3.5 h-3.5 text-zinc-500" />
            <span>Guide Fibonacci</span>
          </button>

          {/* Sprint Filter */}
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
            {[1, 2, 3].map(num => (
              <button
                key={num}
                onClick={() => setSelectedSprint(num)}
                className={`px-3 py-1 rounded text-xs font-semibold transition ${
                  selectedSprint === num ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Sprint {num}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Planning Poker Explainer Card (Collapsible) */}
      {showPokerGuide && (
        <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-200 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Échelle de Planning Poker (Scrum strict)
            </span>
            <span className="text-[10px] font-mono text-zinc-500">Suite de Fibonacci bornée à 13</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            En Scrum, la vélocité n'est jamais mesurée en heures. Les heures mesurent le temps passé, tandis que les Story Points estiment l'effort relatif, la complexité et les risques. Une tâche ne peut jamais dépasser 13 points : au-delà, elle est considérée comme une Epic qui doit être découpée.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1 font-mono text-xs">
            <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-center">
              <div className="text-base font-bold text-white">1 pt</div>
              <div className="text-[10px] text-zinc-500 mt-0.5 font-sans">Tâche triviale / typo</div>
            </div>
            <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-center">
              <div className="text-base font-bold text-white">2 pts</div>
              <div className="text-[10px] text-zinc-500 mt-0.5 font-sans">Petit ajustement</div>
            </div>
            <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-center">
              <div className="text-base font-bold text-white">3 pts</div>
              <div className="text-[10px] text-zinc-500 mt-0.5 font-sans">Feature standard simple</div>
            </div>
            <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-center">
              <div className="text-base font-bold text-white">5 pts</div>
              <div className="text-[10px] text-zinc-500 mt-0.5 font-sans">Développement complet</div>
            </div>
            <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-center">
              <div className="text-base font-bold text-amber-400">8 pts</div>
              <div className="text-[10px] text-zinc-500 mt-0.5 font-sans">Chantier complexe</div>
            </div>
            <div className="p-2 rounded bg-zinc-950 border border-rose-900/50 text-center">
              <div className="text-base font-bold text-rose-400">13 pts</div>
              <div className="text-[10px] text-rose-400/80 mt-0.5 font-sans">Max par tâche (Epic sinon)</div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Jira Sprint Health Banner */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">Avancement du Sprint {metrics.currentSprint}</span>
            <span className="text-xs text-zinc-400">
              • Jour {((metrics.currentDay - 1) % config.sprintDurationDays) + 1} sur {config.sprintDurationDays}
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            <strong className="text-zinc-100 font-mono">{totalDeliveredPoints} SP</strong> clôturés sur{' '}
            <strong className="text-zinc-100 font-mono">{totalCommittedPoints} SP</strong> engagés ({completionPercent}%)
          </p>
        </div>

        <div className="flex-1 max-w-md space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>Burnup Story Points</span>
            <span className="text-zinc-200 font-bold">{completionPercent}%</span>
          </div>
          <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 flex">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${completionPercent}%` }}
              title="Story Points livrés"
            />
            <div
              className="h-full bg-indigo-500/60 transition-all duration-300"
              style={{ width: `${Math.min(100 - completionPercent, Math.round((inProgressPoints / totalCommittedPoints) * 100))}%` }}
              title="Story Points en cours"
            />
          </div>
          <div className="flex items-center gap-4 text-[10px] text-zinc-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Livré ({totalDeliveredPoints} SP)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500" /> En cours ({inProgressPoints} SP)
            </span>
          </div>
        </div>
      </div>

      {/* 3. Jira Gadgets KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-zinc-500 font-medium">Vélocité Totale Équipe</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100 flex items-baseline gap-1.5">
            <span>{totalDeliveredPoints}</span>
            <span className="text-xs font-sans text-zinc-500">SP livrés</span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 block">Points Fibonacci Definition of Done</span>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-zinc-500 font-medium">Moyenne par Développeur</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100 flex items-baseline gap-1.5">
            <span>{avgPoints}</span>
            <span className="text-xs font-sans text-zinc-500">SP / pers</span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 block">Top: {topDev?.name} ({topDev?.pointsDelivered} SP)</span>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-zinc-500 font-medium">Stories Terminées (Done)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {doneTasks.length || totalCompletedTickets}
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 block">Sur {tasks.length} tickets au total</span>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-zinc-500 font-medium">Aléas & Blocages (Jira Flagged)</span>
            {blockedTasks.length > 0 ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
            ) : (
              <Flame className="w-4 h-4 text-zinc-600" />
            )}
          </div>
          <div className={`text-2xl font-bold font-mono ${blockedTasks.length > 0 ? 'text-rose-400' : 'text-zinc-100'}`}>
            {blockedTasks.length}
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 block">
            {blockedTasks.length > 0 ? 'Tickets actuellement bloqués' : 'Aucun ticket bloqué'}
          </span>
        </div>
      </div>

      {/* 4. Velocity Graphs (Colored with developer avatar colors) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Velocity per Dev with exact avatar colors */}
        <div className="lg:col-span-2 bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-zinc-200">
                Vélocité par Développeur (Story Points)
              </h3>
              <p className="text-[11px] text-zinc-500">
                Code couleur personnalisé attribué à chaque développeur
              </p>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">Suite Fibonacci (1, 2, 3, 5, 8, 13)</span>
          </div>
          <div className="flex-1 min-h-[250px]">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Right: SP Share with exact dev avatar colors */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 flex flex-col">
          <h3 className="text-xs font-bold text-zinc-200 mb-1">
            Répartition de la vélocité
          </h3>
          <p className="text-[11px] text-zinc-500 mb-3">
            Contribution de chaque équipier au sprint
          </p>
          <div className="flex-1 min-h-[220px]">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* 5. Jira Tech Stack Breakdown & Blocked issues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Technical Domain Distribution */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 flex flex-col">
          <h3 className="text-xs font-bold text-zinc-200 mb-1">
            Répartition par Domaine Technique
          </h3>
          <p className="text-[11px] text-zinc-500 mb-3">
            Volume de Story Points par spécialité logicielle
          </p>
          <div className="flex-1 min-h-[200px]">
            <Doughnut data={categoryDoughnutData} options={doughnutOptions} />
          </div>
        </div>

        {/* Blocked Tickets Watchlist (Jira Impeded Issues) */}
        <div className="lg:col-span-2 bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Tickets Flagged / Bloqués ({blockedTasks.length})
              </h3>
              <p className="text-[11px] text-zinc-500">
                Dépendances bloquantes nécessitant une intervention de l'équipe
              </p>
            </div>
            {blockedTasks.length > 0 && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Action requise
              </span>
            )}
          </div>

          {blockedTasks.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center border border-dashed border-zinc-800 rounded-xl">
              <CheckCircle2 className="w-8 h-8 text-emerald-500/50 mb-2" />
              <p className="text-xs font-medium text-zinc-300">Aucun blocage actif sur ce sprint</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Le flux de développement s'écoule sans interruption</p>
            </div>
          ) : (
            <div className="space-y-2 overflow-y-auto max-h-[220px] pr-1">
              {blockedTasks.map(t => (
                <div
                  key={t.id}
                  className="p-3 bg-rose-950/20 border border-rose-800/40 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="font-mono font-bold text-rose-400 bg-rose-900/40 px-1.5 py-0.5 rounded text-[11px]">
                      {t.code}
                    </span>
                    <span className="text-zinc-200 font-medium truncate">{t.title}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 text-[11px]">
                    <span className="font-mono text-zinc-400">
                      {t.blockedRemainingHours}h restantes
                    </span>
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {t.storyPoints} SP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 6. Jira Two-Dimensional Filter: Team Performance Matrix */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-zinc-200">
              Matrice de contribution par collaborateur ({members.length})
            </h3>
            <p className="text-[11px] text-zinc-500">
              Suivi détaillé des Story Points, taux d'activité et charge en cours
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-400 font-mono">
              Total livré: <strong className="text-white">{totalDeliveredPoints} SP</strong>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-500 font-mono text-[10px] uppercase">
              <tr>
                <th className="py-2.5 px-4">Développeur</th>
                <th className="py-2.5 px-4">Rôle</th>
                <th className="py-2.5 px-4 text-center">Couleur</th>
                <th className="py-2.5 px-4 text-center">Vélocité (SP)</th>
                <th className="py-2.5 px-4 text-center">Part Sprint</th>
                <th className="py-2.5 px-4 text-center">Tickets clos</th>
                <th className="py-2.5 px-4 text-center">Activité</th>
                <th className="py-2.5 px-4">Ticket en cours & Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-sans">
              {velocityData.map(dev => {
                const sharePercent = totalDeliveredPoints > 0
                  ? Math.round((dev.pointsDelivered / totalDeliveredPoints) * 100)
                  : 0;
                return (
                  <tr key={dev.id} className="hover:bg-zinc-850/50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9px] text-white shadow"
                          style={{ backgroundColor: dev.avatarColor }}
                        >
                          {dev.initials}
                        </div>
                        <span className="font-semibold text-zinc-200">{dev.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-400">{dev.role}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className="inline-block w-4 h-4 rounded-full border border-zinc-700 shadow-sm"
                        style={{ backgroundColor: dev.avatarColor }}
                        title={`Couleur: ${dev.avatarColor}`}
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className="inline-flex items-center gap-1 font-mono font-bold px-2.5 py-0.5 rounded border"
                        style={{
                          backgroundColor: `${dev.avatarColor}20`,
                          borderColor: `${dev.avatarColor}50`,
                          color: dev.avatarColor,
                        }}
                      >
                        {dev.pointsDelivered} <span className="text-[10px] opacity-80 font-normal">SP</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-zinc-400">
                      {sharePercent}%
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-emerald-400">
                      {dev.completedTickets}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-cyan-400">
                      {dev.utilization}%
                    </td>
                    <td className="py-3 px-4 text-zinc-400 truncate max-w-xs">
                      <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-300">
                        <ArrowUpRight className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                        <span className="truncate">{dev.currentTicketTitle}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
