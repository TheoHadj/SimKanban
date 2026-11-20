import React, { useState } from 'react';
import { Sparkles, Plus, CheckCircle2, ArrowRight, Lightbulb, AlertTriangle, HeartHandshake, Zap, Target } from 'lucide-react';
import type { KaizenAction, KaizenCategory, SimulationMetrics, ProjectTemplate } from '../types/kanban';

interface RetrospectiveMuda {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

interface SprintRetrospectiveViewProps {
  currentSprint: number;
  metrics: SimulationMetrics;
  currentProject: ProjectTemplate;
  onAddKaizenTaskToBoard: (title: string, category: string, impact: string) => void;
}

export const SprintRetrospectiveView: React.FC<SprintRetrospectiveViewProps> = ({
  currentSprint,
  metrics,
  currentProject,
  onAddKaizenTaskToBoard,
}) => {
  // Pre-filled retrospective cards based on Lean principles and sprint state
  const isPixelsDragons = currentProject.id === 'pixels-dragons';

  const defaultWentWell = isPixelsDragons
    ? [
        'Début de synchronisation transverse entre Data et Ops sur le flux télémétrique.',
        'Prise de conscience générale sur le surcoût des 4.5 To/jour de données brutes.',
        'Maintien d\'une bonne vélocité avec ' + metrics.completedPointsCount + ' Story Points livrés.',
      ]
    : [
        'Bonne dynamique d\'équipe sur la réalisation des tâches prioritaires.',
        metrics.completedPointsCount + ' Story Points livrés avec régularité.',
        'Limites WIP respectées sur la plupart des colonnes actives.',
      ];

  const defaultMudas: RetrospectiveMuda[] = isPixelsDragons
    ? [
        {
          type: 'Muda de Surstock & Transport',
          description: '4.5 To de données journalières continuent de saturer les pipelines et les bases de test sans nettoyage.',
          severity: 'high',
        },
        {
          type: 'Mura d\'Irrégularité',
          description: 'Le pic de 250k joueurs du vendredi soir génère encore un afflux de tickets réclamations au support.',
          severity: 'high',
        },
        {
          type: 'Muri de Surcharge',
          description: 'L\'équipe de développement subit des interruptions d\'urgence fréquentes pour patcher les rollbacks.',
          severity: 'medium',
        },
      ]
    : [
        {
          type: 'Muda d\'Attente',
          description: 'Les tickets passent du temps en attente dans les colonnes tampons avant prise en charge.',
          severity: 'medium',
        },
        {
          type: 'Muri de Multitâche',
          description: 'Certains collaborateurs travaillent sur plusieurs tickets en parallèle, diluant le focus.',
          severity: 'low',
        },
      ];

  const initialActions: KaizenAction[] = isPixelsDragons
    ? [
        {
          id: 'k-1',
          sprint: currentSprint,
          title: 'Automatiser le script de purge quotidienne des logs bruts > 7 jours',
          category: 'muda',
          impact: 'Économie immédiate de 15% sur la facture cloud IaaS',
          status: 'in_progress',
          owner: 'Maxime (Data)',
        },
        {
          id: 'k-2',
          sprint: currentSprint,
          title: 'Programmer l\'autoscaling prédictif 1h avant le rush du vendredi 20h',
          category: 'tech',
          impact: 'Absorption de la charge et division par 3 des rollbacks',
          status: 'todo',
          owner: 'Karim (Cloud SRE)',
        },
        {
          id: 'k-3',
          sprint: currentSprint,
          title: 'Daily Standup transverse de 10 min (Dev + Data + Ops + Support)',
          category: 'team',
          impact: 'Décloisonnement des silos et détection précoce des blocages',
          status: 'in_progress',
          owner: 'Sarah (Support)',
        },
      ]
    : [
        {
          id: 'k-s1',
          sprint: currentSprint,
          title: 'Abaisser la limite WIP de la colonne Recette de 4 à 3',
          category: 'process',
          impact: 'Réduction de 25% du temps d\'attente avant déploiement',
          status: 'todo',
          owner: 'Équipe',
        },
        {
          id: 'k-s2',
          sprint: currentSprint,
          title: 'Mettre en place du pair programming sur les tâches complexes > 8 SP',
          category: 'team',
          impact: 'Amélioration de la qualité et transmission de connaissances',
          status: 'in_progress',
          owner: 'Tech Lead',
        },
      ];

  const [wentWellList, setWentWellList] = useState<string[]>(defaultWentWell);
  const [mudasList, setMudaList] = useState<RetrospectiveMuda[]>(defaultMudas);
  const [actionsList, setActionsList] = useState<KaizenAction[]>(initialActions);

  // New action input state
  const [newActionTitle, setNewActionTitle] = useState('');
  const [newActionImpact, setNewActionImpact] = useState('');
  const [newActionCategory, setNewActionCategory] = useState<KaizenCategory>('process');
  const [newActionOwner, setNewActionOwner] = useState('');

  // New positive item
  const [newPositive, setNewPositive] = useState('');
  // New muda item
  const [newMudaType, setNewMudaType] = useState('');
  const [newMudaDesc, setNewMudaDesc] = useState('');

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionTitle.trim()) return;
    const action: KaizenAction = {
      id: `k-${Date.now()}`,
      sprint: currentSprint,
      title: newActionTitle.trim(),
      impact: newActionImpact.trim() || 'Amélioration continue du flux',
      category: newActionCategory,
      status: 'todo',
      owner: newActionOwner.trim() || 'Équipe',
    };
    setActionsList(prev => [action, ...prev]);
    setNewActionTitle('');
    setNewActionImpact('');
    setNewActionOwner('');
  };

  const handleAddPositive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPositive.trim()) return;
    setWentWellList(prev => [...prev, newPositive.trim()]);
    setNewPositive('');
  };

  const handleAddMuda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMudaDesc.trim()) return;
    setMudaList(prev => [
      ...prev,
      {
        type: newMudaType.trim() || 'Muda identifié',
        description: newMudaDesc.trim(),
        severity: 'medium',
      },
    ]);
    setNewMudaType('');
    setNewMudaDesc('');
  };

  const toggleActionStatus = (id: string) => {
    setActionsList(prev =>
      prev.map(a =>
        a.id === id
          ? {
              ...a,
              status: a.status === 'done' ? 'todo' : a.status === 'todo' ? 'in_progress' : 'done',
            }
          : a
      )
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-zinc-950 text-zinc-100">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-zinc-900 via-indigo-950/40 to-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Amélioration Continue (Kaizen)
              </span>
              <span className="text-xs text-zinc-500">•</span>
              <span className="text-xs font-mono text-zinc-400">Sprint {currentSprint}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Rétrospective de l'Itération</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Analyse systématique des gaspillages (Muda, Mura, Muri) et plan d'action d'amélioration continue pour l'équipe {currentProject.shortName}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl px-4 py-2.5 text-right">
              <div className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider">Vélocité Sprint</div>
              <div className="text-lg font-bold font-mono text-amber-400">
                {metrics.completedPointsCount} <span className="text-xs font-normal text-zinc-500">SP</span>
              </div>
            </div>
            <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl px-4 py-2.5 text-right">
              <div className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider">Lead Time Moyen</div>
              <div className="text-lg font-bold font-mono text-cyan-400">
                {metrics.averageLeadTimeHours}h
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars of Retrospective: Good, Mudas, Kaizen Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pillar 1: Ce qui a bien marché */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">Ce qui a bien marché</h3>
                  <span className="text-[10px] text-zinc-500">Pratiques à conserver (Keep)</span>
                </div>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                {wentWellList.length}
              </span>
            </div>

            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[320px] pr-1">
              {wentWellList.map((item, idx) => (
                <div key={idx} className="bg-zinc-950/70 border border-emerald-900/20 rounded-xl p-3 text-xs text-zinc-300 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddPositive} className="mt-4 pt-3 border-t border-zinc-800/80 flex gap-2">
              <input
                type="text"
                placeholder="Ajouter une réussite..."
                value={newPositive}
                onChange={e => setNewPositive(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Pillar 2: Gaspillages & Freins identifiés (Muda, Mura, Muri) */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">Gaspillages observés</h3>
                  <span className="text-[10px] text-zinc-500">Muda, Mura, Muri à éliminer</span>
                </div>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800/60">
                {mudasList.length}
              </span>
            </div>

            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[320px] pr-1">
              {mudasList.map((muda, idx) => (
                <div key={idx} className="bg-zinc-950/70 border border-rose-900/20 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-rose-300 text-[11px]">{muda.type}</span>
                    <span className={`text-[9px] uppercase font-mono px-1.5 py-0.2 rounded border ${
                      muda.severity === 'high' ? 'bg-rose-950 text-rose-400 border-rose-800' : 'bg-amber-950 text-amber-400 border-amber-800'
                    }`}>
                      {muda.severity}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">{muda.description}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddMuda} className="mt-4 pt-3 border-t border-zinc-800/80 space-y-2">
              <input
                type="text"
                placeholder="Type (ex: Muda d'attente, Mura de pic...)"
                value={newMudaType}
                onChange={e => setNewMudaType(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Description du point de friction..."
                  value={newMudaDesc}
                  onChange={e => setNewMudaDesc(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Pillar 3: Plan d'Actions Kaizen */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">Actions Kaizen</h3>
                  <span className="text-[10px] text-zinc-500">Plan d'action sprint suivant</span>
                </div>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                {actionsList.length}
              </span>
            </div>

            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[320px] pr-1">
              {actionsList.map(action => (
                <div key={action.id} className="bg-zinc-950/70 border border-zinc-800 rounded-xl p-3 text-xs space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <button
                        onClick={() => toggleActionStatus(action.id)}
                        className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center transition ${
                          action.status === 'done'
                            ? 'bg-emerald-500 border-emerald-400 text-black'
                            : action.status === 'in_progress'
                            ? 'border-amber-400 bg-amber-500/20'
                            : 'border-zinc-600'
                        }`}
                      >
                        {action.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {action.status === 'in_progress' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                      </button>
                      <div>
                        <div className={`font-medium ${action.status === 'done' ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                          {action.title}
                        </div>
                        <div className="text-[10px] text-cyan-400/90 mt-0.5 flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5" />
                          <span>{action.impact}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60 text-[10px] text-zinc-400">
                    <span>Resp: <strong className="text-zinc-300 font-normal">{action.owner}</strong></span>
                    <button
                      onClick={() => onAddKaizenTaskToBoard(action.title, action.category, action.impact)}
                      className="inline-flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 font-medium transition"
                      title="Convertir en ticket dans le Kanban"
                    >
                      <span>Créer ticket Kanban</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddAction} className="mt-4 pt-3 border-t border-zinc-800/80 space-y-2">
              <input
                type="text"
                placeholder="Intitulé de l'action Kaizen..."
                value={newActionTitle}
                onChange={e => setNewActionTitle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Impact (ex: -15% cloud)..."
                  value={newActionImpact}
                  onChange={e => setNewActionImpact(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
                />
                <select
                  value={newActionCategory}
                  onChange={e => setNewActionCategory(e.target.value as KaizenCategory)}
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
                >
                  <option value="muda">Muda (Gaspillage)</option>
                  <option value="process">Processus</option>
                  <option value="tech">Technique</option>
                  <option value="team">Équipe</option>
                </select>
                <input
                  type="text"
                  placeholder="Responsable..."
                  value={newActionOwner}
                  onChange={e => setNewActionOwner(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
                />
              </div>
              <button
                type="submit"
                className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter l'action au plan Kaizen</span>
              </button>
            </form>
          </div>
        </div>

        {/* Lean IT Summary Box */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
          <Lightbulb className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-xs text-zinc-400 leading-relaxed">
            <strong className="text-zinc-200 font-medium">Principe Lean IT :</strong> Une rétrospective n'est pas un simple débriefing, c'est l'étape <em>"Act"</em> du cycle <strong>PDCA (Plan-Do-Check-Act)</strong>. Chaque gaspillage identifié doit déboucher sur une action concrète testée dès le sprint suivant avec un responsable désigné.
          </p>
        </div>
      </div>
    </div>
  );
};
