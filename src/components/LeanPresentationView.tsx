import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Sparkles, 
  Workflow, 
  ShieldAlert, 
  Leaf, 
  Users
} from 'lucide-react';

export const LeanPresentationView: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    // Slide 1: Introduction au Lean IT
    {
      id: 'intro',
      badge: 'Fondations théoriques',
      title: 'Qu\'est-ce que le Lean IT ?',
      subtitle: 'Maximiser la valeur ajoutée client en éliminant impitoyablement les gaspillages',
      content: (
        <div className="space-y-6">
          <p className="text-sm text-zinc-300 leading-relaxed">
            Le <strong className="text-indigo-400">Lean IT</strong> est l'application des principes du système de production Toyota (TPS) aux technologies de l'information et au développement logiciel. Contrairement aux approches traditionnelles axées sur le volume, le Lean IT cherche à optimiser le <em>flux de valeur</em> de bout en bout.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                01
              </div>
              <h4 className="font-semibold text-sm text-zinc-100">Valeur Client (Customer Value)</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tout ce pour quoi l'utilisateur final (ici les joueurs de <em>« Chroniques de l'Ombre »</em>) est réellement prêt à payer. Tout le reste est un gaspillage potentiel.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs">
                02
              </div>
              <h4 className="font-semibold text-sm text-zinc-100">Flux Tiré (Pull System)</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Ne produire que ce qui est demandé, au moment où c'est nécessaire. On limite strictement le travail en cours (WIP) pour fluidifier la traversée.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                03
              </div>
              <h4 className="font-semibold text-sm text-zinc-100">Amélioration Continue (Kaizen)</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Une quête perpétuelle de perfection par de petites améliorations itératives régulières portées par les équipes de terrain.
              </p>
            </div>
          </div>

          <div className="bg-indigo-950/20 border border-indigo-900/40 rounded-xl p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-300">
              <strong className="text-white">Formule maîtresse :</strong> <code className="bg-zinc-900 px-1.5 py-0.5 rounded text-indigo-300 font-mono">Lead Time = Work in Progress (WIP) / Débit (Throughput)</code> (Loi de Little). Pour livrer plus vite sans épuiser les équipes, il faut réduire les cartes en cours et éliminer les gaspillages.
            </div>
          </div>
        </div>
      ),
    },

    // Slide 2: La Triade des 3M sur Pixels & Dragons
    {
      id: '3m',
      badge: 'Diagnostic Pixels & Dragons',
      title: 'La Triade des 3M : Muda, Mura, Muri',
      subtitle: 'Les trois sources de dysfonctionnement identifiées dans « Chroniques de l\'Ombre »',
      content: (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Muda */}
            <div className="bg-zinc-900/90 border border-rose-900/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-xs">
                  MU
                </div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-100">Muda (Gaspillage)</h4>
                  <span className="text-[10px] text-zinc-400">Activités sans valeur ajoutée</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-zinc-300">
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80">
                  <strong className="text-rose-300 block mb-0.5">Surstock & Transport :</strong>
                  4,5 To/jour de télémétrie dupliquée sans tri ni nettoyage (+42% surcoût hébergement cloud).
                </div>
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80">
                  <strong className="text-rose-300 block mb-0.5">Défauts & Retravail :</strong>
                  Dette technique accumulée depuis 2018 provoquant des rollbacks de serveurs.
                </div>
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80">
                  <strong className="text-rose-300 block mb-0.5">Attente :</strong>
                  Latences en jeu qui conduisent à la perte et au départ de joueurs.
                </div>
              </div>
            </div>

            {/* Mura */}
            <div className="bg-zinc-900/90 border border-amber-900/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                  MR
                </div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-100">Mura (Irrégularité)</h4>
                  <span className="text-[10px] text-zinc-400">Variabilité et à-coups</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-zinc-300">
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80">
                  <strong className="text-amber-300 block mb-0.5">Pic du vendredi soir :</strong>
                  Afflux massif (&gt; 250k joueurs entre 20h et minuit) saturant les pipelines face à des nuits très calmes.
                </div>
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80">
                  <strong className="text-amber-300 block mb-0.5">Silos de travail :</strong>
                  Travail asynchrone désynchronisé entre Data, Dev, Infra et Support client.
                </div>
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80">
                  <strong className="text-amber-300 block mb-0.5">Sécurité réactive :</strong>
                  L'équipe sécurité intervient en pompier lors des alertes plutôt qu'en amont.
                </div>
              </div>
            </div>

            {/* Muri */}
            <div className="bg-zinc-900/90 border border-purple-900/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs">
                  MI
                </div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-100">Muri (Surcharge)</h4>
                  <span className="text-[10px] text-zinc-400">Sollicitations excessives</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-zinc-300">
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80">
                  <strong className="text-purple-300 block mb-0.5">Burnout des équipes :</strong>
                  Épuisement moral des développeurs face aux pannes répétées et au mode pompier.
                </div>
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80">
                  <strong className="text-purple-300 block mb-0.5">Surcharge Support client :</strong>
                  Explosion des tickets de réclamation le vendredi soir suite aux pertes de progression.
                </div>
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80">
                  <strong className="text-purple-300 block mb-0.5">Surcharge machines :</strong>
                  Surchauffe ponctuelle des instances de base de données.
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 3: La Démarche 5S dans le SI
    {
      id: '5s',
      badge: 'Méthodologie Opérationnelle',
      title: 'La Démarche 5S appliquée au Système d\'Information',
      subtitle: 'Structurer l\'environnement numérique et pérenniser l\'ordre',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 space-y-2">
              <div className="text-xs font-mono font-bold text-indigo-400">1. SEIRI</div>
              <div className="text-xs font-semibold text-white">Débarrasser / Trier</div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Purger les 4.5 To/j de télémétrie superflue. Supprimer les logs redondants clonés dans les environnements de test.
              </p>
            </div>

            <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 space-y-2">
              <div className="text-xs font-mono font-bold text-cyan-400">2. SEITON</div>
              <div className="text-xs font-semibold text-white">Ranger / Situer</div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Séparer distinctement les bases de données SQL temps réel (jeu) du lac NoSQL d'archives froides.
              </p>
            </div>

            <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 space-y-2">
              <div className="text-xs font-mono font-bold text-emerald-400">3. SEISO</div>
              <div className="text-xs font-semibold text-white">Nettoyer / Assainir</div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Résorber la dette technique dans le code réseau. Mettre en place des scripts automatisés de purge RGPD.
              </p>
            </div>

            <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 space-y-2">
              <div className="text-xs font-mono font-bold text-amber-400">4. SEIKETSU</div>
              <div className="text-xs font-semibold text-white">Standardiser</div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Un outil Kanban unique partagé (fin des fichiers Excel cloisonnés). Politiques d'habilitations strictes (Bastion).
              </p>
            </div>

            <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 space-y-2">
              <div className="text-xs font-mono font-bold text-rose-400">5. SHITSUKE</div>
              <div className="text-xs font-semibold text-white">Pérenniser (Rigueur)</div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Suivi systématique des KPIs en fin de sprint. Monitoring APM prédictif et rétrospectives Kaizen régulières.
              </p>
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <div className="text-xs text-zinc-300">
                <strong className="text-emerald-400">Bénéfice Green IT immédiat :</strong> En combinant Seiri (purge des données) et Seiton (extinction automatique nocturne des instances), le studio réduit son empreinte carbone de plus de 30%.
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 4: Amélioration Continue & PDCA (Kaizen)
    {
      id: 'pdca',
      badge: 'Cycle d\'Itération',
      title: 'L\'Amélioration Continue : La Boucle PDCA',
      subtitle: 'Comment rythmer l\'apprentissage et l\'élimination des gaspillages à chaque sprint',
      content: (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                P
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-zinc-100">Plan (Planifier)</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Cadrer les objectifs du sprint avec les données réelles : réduire le surcoût cloud, anticiper le pic du vendredi, isoler les bases de test (RGPD).
                </p>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                D
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-zinc-100">Do (Réaliser en flux tiré)</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Exécuter les tâches en respectant les limites de WIP. Les développeurs et ingénieurs ne prennent une tâche que si la capacité aval le permet.
                </p>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                C
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-zinc-100">Check (Vérifier & Interpréter)</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Analyser les KPIs de fin de sprint : Lead Time, Throughput journalier, efficacité du flux et volumes de données traités.
                </p>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm shrink-0">
                A
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-zinc-100">Act (Agir / Kaizen)</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Mener la rétrospective de sprint, identifier les nouveaux Mudas apparus, et acter des ajustements concrets (WIP, scripts, rituels).
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-300">
            <strong className="text-white block mb-1">Règle d'or du Kaizen :</strong>
            <em>« Mieux vaut une amélioration imparfaite mise en œuvre immédiatement qu'une solution idéale retardée indéfiniment. »</em>
          </div>
        </div>
      ),
    },

    // Slide 5: Préconisations Organisationnelles pour Pixels & Dragons
    {
      id: 'preconisations',
      badge: 'Recommandations Stratégiques',
      title: 'Préconisations Organisationnelles pour Pixels & Dragons',
      subtitle: 'Plan d\'action concret pour décloisonner les 145 collaborateurs et 3 sites',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400">
                <Users className="w-4 h-4" />
                <h4 className="font-semibold text-sm text-zinc-100">1. Décloisonner les Silos</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Remplacer le fonctionnement en départements étanches (Data vs Dev vs Ops vs Support) par des <strong>Feature Teams / Pods transverses</strong> regroupant l'ensemble des compétences nécessaires pour délivrer de la valeur.
              </p>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400">
                <Workflow className="w-4 h-4" />
                <h4 className="font-semibold text-sm text-zinc-100">2. Rituels Transverses Quotidiens</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Instaurer un <strong>Standup transverse de 10 min</strong> réunissant au moins un représentant Dev, Ops, Data et Support pour anticiper les points de blocage 48h avant le rush du vendredi.
              </p>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-rose-400">
                <ShieldAlert className="w-4 h-4" />
                <h4 className="font-semibold text-sm text-zinc-100">3. Sécurité & RGPD « Shift-Left »</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Intégrer le RSSI dès la colonne d'analyse et de validation : anonymisation automatisée des 3,2M comptes lors des tests, traçabilité stricte des droits administrateurs via un Bastion.
              </p>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <Leaf className="w-4 h-4" />
                <h4 className="font-semibold text-sm text-zinc-100">4. Éco-conception & Green IT</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Mettre en place des sondes de suivi kWh / CO2 et programmer le downsizing nocturne des instances. Répondre favorablement aux exigences des fonds d'investissement partenaires.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-950/40 via-zinc-900 to-indigo-950/40 border border-indigo-900/40 rounded-xl p-4 text-center">
            <span className="text-xs text-indigo-300 font-medium">
              🎯 Résultat attendu : -35% de coûts cloud • 0 incident critique le vendredi soir • Climat d'équipe serein et décloisonné.
            </span>
          </div>
        </div>
      ),
    },
  ];

  const current = slides[currentSlide];

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-zinc-950 text-zinc-100 flex flex-col justify-between">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* Top bar with slide indicators */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Guide & Présentation Lean IT</h2>
              <span className="text-[11px] text-zinc-400">Support de cours & soutenance EPSI M2</span>
            </div>
          </div>

          {/* Slide pills */}
          <div className="flex items-center gap-1.5">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? 'w-8 bg-indigo-500' : 'w-2 bg-zinc-800 hover:bg-zinc-700'
                }`}
                title={`Aller à la slide ${idx + 1}`}
              />
            ))}
            <span className="text-xs font-mono text-zinc-500 ml-2">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
        </div>

        {/* Slide Header */}
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 inline-block mb-2">
            {current.badge}
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            {current.title}
          </h1>
          <p className="text-xs text-zinc-400">
            {current.subtitle}
          </p>
        </div>

        {/* Slide Body */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 shadow-xl min-h-[380px]">
          {current.content}
        </div>

        {/* Slide Footer Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Précédent</span>
          </button>

          <div className="text-xs text-zinc-500">
            Navigation : Flèches ou pastilles du haut
          </div>

          <button
            onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium text-xs hover:bg-indigo-500 disabled:opacity-30 disabled:pointer-events-none transition"
          >
            <span>Suivant</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
