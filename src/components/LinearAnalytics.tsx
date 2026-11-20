import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Scatter } from 'react-chartjs-2';
import type { MetricSnapshot, Column, Task, SimulationMetrics } from '../types/kanban';
import { Info } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LinearAnalyticsProps {
  snapshots: MetricSnapshot[];
  columns: Column[];
  tasks: Task[];
  metrics: SimulationMetrics;
  hoursPerDay: number;
}

export const LinearAnalytics: React.FC<LinearAnalyticsProps> = ({
  snapshots,
  columns,
  tasks,
  metrics,
  hoursPerDay,
}) => {
  const [subTab, setSubTab] = useState<'cfd' | 'scatter' | 'little'>('cfd');

  // Sample snapshots for performance
  const sampled = snapshots.length > 80
    ? snapshots.filter((_, idx) => idx % Math.ceil(snapshots.length / 80) === 0 || idx === snapshots.length - 1)
    : snapshots;

  const labels = sampled.map(s => `H${s.hour} (J${s.day})`);

  // CFD Datasets (Stacked area)
  const cfdDatasets = columns.map(col => ({
    label: col.name,
    data: sampled.map(s => s.columnTaskCounts[col.id] || 0),
    backgroundColor: col.color + '44',
    borderColor: col.color,
    borderWidth: 1.5,
    fill: true,
    tension: 0.15,
    pointRadius: 0,
  }));

  const cfdOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#71717a', font: { size: 10 } },
      },
      y: {
        stacked: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#71717a', font: { size: 10 } },
        title: { display: true, text: 'Tickets cumulés', color: '#71717a' },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: '#a1a1aa', font: { size: 11 }, boxWidth: 10 },
      },
      tooltip: {
        backgroundColor: '#18181b',
        titleColor: '#fafafa',
        bodyColor: '#a1a1aa',
        borderColor: '#27272a',
        borderWidth: 1,
      },
    },
  };

  // Scatterplot Data
  const completed = tasks.filter(t => t.completedAtHour !== undefined);
  const scatterPoints = completed.map(t => ({
    x: Math.round(((t.completedAtHour || 0) / hoursPerDay) * 10) / 10,
    y: Math.round(((t.completedAtHour! - t.createdAtHour) / hoursPerDay) * 10) / 10,
    code: t.code,
    title: t.title,
  }));

  const leadTimes = completed
    .map(t => (t.completedAtHour! - t.createdAtHour) / hoursPerDay)
    .sort((a, b) => a - b);

  const p50 = leadTimes.length > 0 ? leadTimes[Math.floor(leadTimes.length * 0.5)] : 0;
  const p85 = leadTimes.length > 0 ? leadTimes[Math.floor(leadTimes.length * 0.85)] : 0;
  const p95 = leadTimes.length > 0 ? leadTimes[Math.floor(leadTimes.length * 0.95)] : 0;

  const scatterData = {
    datasets: [
      {
        label: 'Tickets livrés',
        data: scatterPoints,
        backgroundColor: '#38bdf8',
        borderColor: '#0284c7',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#71717a', font: { size: 10 } },
        title: { display: true, text: 'Jour de livraison', color: '#71717a' },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#71717a', font: { size: 10 } },
        title: { display: true, text: 'Lead Time (jours)', color: '#71717a' },
        min: 0,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const raw = context.raw as { x: number; y: number; code: string; title: string };
            return `${raw.code} : ${raw.title} (Lead Time: ${raw.y}j)`;
          },
        },
      },
    },
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-zinc-950">
      {/* Sub Header Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('cfd')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              subTab === 'cfd' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Diagramme de flux cumulé (CFD)
          </button>
          <button
            onClick={() => setSubTab('scatter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              subTab === 'scatter' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Distribution du Lead Time (Scatterplot)
          </button>
          <button
            onClick={() => setSubTab('little')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              subTab === 'little' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Loi de Little
          </button>
        </div>

        <span className="text-xs font-mono text-zinc-500">
          {snapshots.length} heures enregistrées
        </span>
      </div>

      {/* CFD View */}
      {subTab === 'cfd' && (
        <div className="space-y-3">
          <div className="h-[420px] bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
            {snapshots.length > 1 ? (
              <Line data={{ labels, datasets: cfdDatasets }} options={cfdOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-600 text-xs italic">
                Démarrez le simulateur pour tracer les courbes de flux cumulé dans le temps...
              </div>
            )}
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" />
            <p>
              <strong className="text-zinc-200">Interprétation :</strong> L'écart vertical entre les lignes représente le WIP (travail en cours). L'écart horizontal représente le temps de cycle (Lead Time). Si une bande s'élargit, vous observez un goulot d'étranglement qui ralentit le débit global.
            </p>
          </div>
        </div>
      )}

      {/* Scatterplot View */}
      {subTab === 'scatter' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-xl text-center">
              <span className="text-[10px] text-zinc-500 block mb-0.5">Percentile 50% (Médiane)</span>
              <span className="text-base font-bold text-zinc-100 font-mono">{Math.round(p50 * 10) / 10}j</span>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-xl text-center">
              <span className="text-[10px] text-zinc-500 block mb-0.5">Percentile 85% (SLA standard)</span>
              <span className="text-base font-bold text-emerald-400 font-mono">{Math.round(p85 * 10) / 10}j</span>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-xl text-center">
              <span className="text-[10px] text-zinc-500 block mb-0.5">Percentile 95% (Prévisibilité haute)</span>
              <span className="text-base font-bold text-cyan-400 font-mono">{Math.round(p95 * 10) / 10}j</span>
            </div>
          </div>

          <div className="h-[380px] bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
            {completed.length > 0 ? (
              <Scatter data={scatterData} options={scatterOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-600 text-xs italic">
                Aucun ticket complété pour le moment.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Little's Law View */}
      {subTab === 'little' && (
        <div className="max-w-2xl mx-auto space-y-4 pt-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center space-y-2">
            <h3 className="text-sm font-bold text-white font-mono">
              WIP = Débit (Throughput) × Temps de traversée (Lead Time)
            </h3>
            <p className="text-xs text-zinc-400 max-w-lg mx-auto">
              Si vous augmentez le nombre de tâches en cours sans augmenter le débit de l'équipe, le temps de livraison augmente proportionnellement.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-center">
              <span className="text-xs text-zinc-500 block mb-1">WIP Actuel</span>
              <span className="text-2xl font-bold font-mono text-zinc-100">{metrics.wipCount}</span>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-center">
              <span className="text-xs text-zinc-500 block mb-1">Débit (tâches/j)</span>
              <span className="text-2xl font-bold font-mono text-amber-400">{metrics.throughputPerDay}</span>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-center">
              <span className="text-xs text-zinc-500 block mb-1">Lead Time Moyen</span>
              <span className="text-2xl font-bold font-mono text-cyan-400">
                {Math.round((metrics.averageLeadTimeHours / hoursPerDay) * 10) / 10}j
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
