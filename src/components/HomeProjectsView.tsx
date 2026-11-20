import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, BookOpen } from 'lucide-react';
import { AVAILABLE_PROJECTS } from '../utils/projects';

interface HomeProjectsViewProps {
  currentProjectId: string;
  onSelectProject: (projectId: string) => void;
  onOpenPresentation: () => void;
}

export const HomeProjectsView: React.FC<HomeProjectsViewProps> = ({
  currentProjectId,
  onSelectProject,
  onOpenPresentation,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-zinc-950 text-zinc-100">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulateur Lean IT & Kanban Studio</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Sélectionnez votre Espace de Travail
          </h1>
          <p className="text-xs md:text-sm text-zinc-400">
            Choisissez un projet pour lancer le simulateur de flux tiré, observer les limites de WIP et expérimenter l'amélioration continue (Kaizen).
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {AVAILABLE_PROJECTS.map(project => {
            const isSelected = project.id === currentProjectId;

            return (
              <div
                key={project.id}
                className={`relative rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-b from-zinc-900 via-zinc-900 to-indigo-950/20 border-indigo-500/50 shadow-2xl ring-1 ring-indigo-500/30'
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80 shadow-lg'
                }`}
              >
                {/* Top Badge */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl p-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-inner">
                        {project.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white">{project.title}</h3>
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Actif
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-indigo-400 font-medium">{project.subtitle}</span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {project.badge}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Context Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    {project.companyContext.metrics.slice(0, 4).map((metric, idx) => (
                      <div key={idx} className="bg-zinc-950/70 border border-zinc-800/80 p-2.5 rounded-xl">
                        <span className="text-[10px] text-zinc-500 block truncate">{metric.label}</span>
                        <span className="text-sm font-bold font-mono text-zinc-200">{metric.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Lean Challenges / Problems summary */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block font-mono">
                      Défis & Objectifs Lean :
                    </span>
                    <div className="space-y-1.5">
                      {project.companyContext.objectifsLean.slice(0, 3).map((obj, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-zinc-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-6 pt-0 mt-4 flex items-center justify-between border-t border-zinc-800/60 pt-4 bg-zinc-950/30">
                  <div className="text-xs text-zinc-500">
                    <span className="font-mono text-zinc-400">{project.members.length}</span> membres • <span className="font-mono text-zinc-400">{project.columns.length}</span> colonnes
                  </div>

                  <button
                    onClick={() => onSelectProject(project.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 shadow-md ${
                      isSelected
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        : 'bg-zinc-100 hover:bg-white text-zinc-950'
                    }`}
                  >
                    <span>{isSelected ? 'Accéder au Kanban' : 'Choisir ce projet'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Presentation Banner */}
        <div className="bg-gradient-to-r from-zinc-900 via-indigo-950/40 to-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Besoin de présenter la démarche Lean IT ?</span>
            </h4>
            <p className="text-xs text-zinc-400 max-w-xl">
              Consultez le diaporama interactif sur les 3M (Muda, Mura, Muri), la méthode 5S, la boucle PDCA et les préconisations pour Pixels & Dragons.
            </p>
          </div>

          <button
            onClick={onOpenPresentation}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition flex items-center gap-2 shrink-0 border border-zinc-700"
          >
            <span>Ouvrir la présentation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
