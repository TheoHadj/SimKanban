import type { ProjectTemplate, Column, TaskCategory, StoryPoints } from '../types/kanban';
import { DEFAULT_CONFIG, DEFAULT_CATEGORIES, DEFAULT_COLUMNS, DEFAULT_MEMBERS, DEFAULT_ROLES } from './presets';
import { DEV_TASKS_CATALOG } from './engine';

export const PIXELS_DRAGONS_COLUMNS: Column[] = [
  {
    id: 'backlog',
    name: 'Backlog (Filtre Muda)',
    type: 'queue',
    color: '#64748b',
    maxPeople: 0,
    maxWip: 999,
    defaultEffortHours: 0,
  },
  {
    id: 'analysis',
    name: 'Cadrage & Mesure',
    type: 'active',
    color: '#3b82f6',
    maxPeople: 2,
    maxWip: 4,
    defaultEffortHours: 6,
  },
  {
    id: 'dev_ready',
    name: 'Prêt pour Action',
    type: 'queue',
    color: '#06b6d4',
    maxPeople: 0,
    maxWip: 4,
    defaultEffortHours: 0,
  },
  {
    id: 'dev',
    name: 'Résolution & Optimisation',
    type: 'active',
    color: '#8b5cf6',
    maxPeople: 4,
    maxWip: 5,
    defaultEffortHours: 12,
  },
  {
    id: 'review',
    name: 'Validation & Audit RGPD',
    type: 'active',
    color: '#f59e0b',
    maxPeople: 2,
    maxWip: 3,
    defaultEffortHours: 8,
  },
  {
    id: 'done',
    name: 'Déployé & Mesuré (Done)',
    type: 'done',
    color: '#10b981',
    maxPeople: 0,
    maxWip: 999,
    defaultEffortHours: 0,
  },
];

export const PIXELS_DRAGONS_TASKS: { title: string; category: TaskCategory; points: StoryPoints; description?: string }[] = [
  // SEIRI & SEISO (Purge, Réduction du Muda de surstock & facture cloud)
  {
    title: 'Purge et archivage automatisé des 4.5 To/jour de télémétrie redondante (Seiri)',
    category: 'data',
    points: 8,
    description: 'Éliminer la duplication massive des logs bruts entre environnements de test et prod (-42% de coûts IaaS visés).',
  },
  {
    title: 'Filtrage à la source des métriques superflues du moteur de jeu (Muda de transport)',
    category: 'data',
    points: 5,
    description: 'Ne transmettre que les événements à valeur ajoutée (combats, loot, transactions) et stopper les floods de micro-déplacements.',
  },
  {
    title: 'Mise en place d\'une politique de rétention et purge RGPD des comptes inactifs',
    category: 'security',
    points: 5,
    description: 'Purger les données personnelles dormantes conformément aux exigences légales et à la note du RSSI.',
  },
  {
    title: 'Ségrégation stricte des bases : séparation SQL temps réel et lac NoSQL froid (Seiton)',
    category: 'data',
    points: 13,
    description: 'Éviter le mélange d\'accès lents et rapides qui provoque la surchauffe des pools de connexion.',
  },

  // MURA & MURI (Lissage charge, absorption du pic du vendredi 250k joueurs)
  {
    title: 'Autoscaling prédictif pour le pic du vendredi 20h-minuit (>250k joueurs)',
    category: 'devops',
    points: 8,
    description: 'Scaler l\'infrastructure 30 min avant le rush hebdomadaire pour éviter la saturation brutale des pipelines.',
  },
  {
    title: 'Découplage de la persistance d\'inventaire pour éliminer les rollbacks serveurs',
    category: 'game',
    points: 13,
    description: 'Remplacer l\'écriture synchrone bloquante par une file de messages asynchrones Kafka lors des crashs d\'instances.',
  },
  {
    title: 'Mise en place d\'un cache distribué Redis pour les transactions de monnaie virtuelle',
    category: 'game',
    points: 5,
    description: 'Soulager les instances de base de données principales lors des pics de commerce in-game.',
  },
  {
    title: 'Rate limiting des paquets réseau par client pour bloquer le flood et bots',
    category: 'security',
    points: 3,
    description: 'Limiter la surcharge du serveur de jeu générée par les scripts non officiels.',
  },

  // GREEN IT (Consommation énergétique nocturne)
  {
    title: 'Downsizing automatique des serveurs de jeu la nuit (Éco-responsabilité Green IT)',
    category: 'devops',
    points: 5,
    description: 'Éteindre automatiquement les instances de calcul sous-exploitées entre 02h00 et 07h00 du matin pour réduire l\'empreinte carbone.',
  },
  {
    title: 'Dashboard de mesure d\'empreinte carbone et kWh des clusters de jeu',
    category: 'devops',
    points: 3,
    description: 'Fournir à la direction et aux investisseurs un indicateur certifié d\'intensité énergétique des serveurs.',
  },

  // SÉCURITÉ & RSSI (Porosité bases de test & habilitations)
  {
    title: 'Cloisonnement et anonymisation des données de production vers les bases de test',
    category: 'security',
    points: 8,
    description: 'Appliquer un masque sur les données des 3.2M de comptes joueurs avant clonage en pré-production.',
  },
  {
    title: 'Révocation des accès admin partagés et mise en place d\'un Bastion SSH audité',
    category: 'security',
    points: 5,
    description: 'Répondre d\'urgence à l\'audit du RSSI sur la traçabilité des interventions des administrateurs.',
  },
  {
    title: 'Chiffrement mTLS des flux de télémétrie entre les serveurs parisiens et montréalais',
    category: 'security',
    points: 5,
    description: 'Sécuriser le transit inter-sites des données confidentielles du studio.',
  },

  // SEIKETSU & ORGANISATION (Décloisonnement des silos Data / Dev / Ops / Support)
  {
    title: 'Harmonisation des outils : tableau Kanban partagé Dev, Data, Ops et Support (Seiketsu)',
    category: 'support',
    points: 5,
    description: 'En finir avec les feuilles de calcul isolées et les outils de suivi hétérogènes par département.',
  },
  {
    title: 'Mise en place de la boucle de remontée directe Support -> SRE pour les bugs bloquants',
    category: 'support',
    points: 3,
    description: 'Éviter le sentiment d\'épuisement du support client face aux plaintes récurrentes des joueurs du vendredi.',
  },
  {
    title: 'Catégorisation et priorisation des tickets d\'incidents joueurs en 4 niveaux de sévérité',
    category: 'support',
    points: 2,
    description: 'Standardiser le traitement des réclamations liées aux rollbacks et pertes d\'items.',
  },

  // SHITSUKE & DETTE TECHNIQUE (Pérennisation & amélioration continue)
  {
    title: 'Mise en place d\'APM et alertes proactives pour anticiper les pannes avant les joueurs',
    category: 'devops',
    points: 8,
    description: 'Sortir du mode pompier subi par les développeurs en détectant les fuites mémoire en amont.',
  },
  {
    title: 'Refactorisation du code de synchronisation multi-joueurs de « Chroniques de l\'Ombre »',
    category: 'game',
    points: 13,
    description: 'Nettoyer la dette technique accumulée depuis la phase de startup en 2018.',
  },
  {
    title: 'Pipeline CI/CD unifié pour tester les patchs sans indisponibilité de serveur',
    category: 'game',
    points: 8,
    description: 'Permettre des mises à jour sans interrompre les sessions des 250k joueurs connectés.',
  },
  {
    title: 'Création d\'un simulateur de charge synthétique simulant 300 000 connexions',
    category: 'data',
    points: 8,
    description: 'Valider en continu la résilience du système avant chaque week-end.',
  },
  {
    title: 'Guide des standards de codage et revue de code transversale (Kaizen)',
    category: 'game',
    points: 3,
    description: 'Formaliser les bonnes pratiques Lean IT pour éviter la réintroduction de dette technique.',
  },
  {
    title: 'Mise en place de la réunion transverse hebdomadaire d\'alignement (Dev, Ops, Data, Support)',
    category: 'support',
    points: 2,
    description: 'Dépiler les irritants inter-départements et suivre les actions d\'amélioration continue.',
  },
];

export const PROJECT_PIXELS_DRAGONS: ProjectTemplate = {
  id: 'pixels-dragons',
  title: 'Pixels & Dragons — Chroniques de l\'Ombre',
  shortName: 'Pixels & Dragons',
  subtitle: 'Étude de cas Lean IT • MMORPG 3.2M joueurs',
  description: 'Décloisonnement des silos Data / Dev / Ops / Support, résorption du gaspillage de stockage (4.5 To/j), lissage du pic du vendredi soir (250k joueurs), et mise en conformité RGPD & Green IT.',
  badge: 'Cas d\'étude EPSI',
  icon: '🐉',
  accentColor: 'indigo',
  companyContext: {
    name: 'Pixels & Dragons (Studio de jeu indépendant, 145 salariés sur 3 sites)',
    metrics: [
      { label: 'Joueurs inscrits', value: '3,2 M', hint: 'Monde persistant actif' },
      { label: 'Télémétrie brute', value: '4,5 To / jour', hint: 'Stockée sans nettoyage' },
      { label: 'Hausse coûts cloud', value: '+42%', hint: '2e poste budgétaire' },
      { label: 'Pic vendredi soir', value: '> 250 000', hint: 'Joueurs simultanés (20h-00h)' },
      { label: 'Sites géographiques', value: '3 sites', hint: 'Lyon, Montréal, Paris' },
      { label: 'Effectif global', value: '145 pers.', hint: 'Silos par département' },
    ],
    problematiques: [
      'Cloisonnement et manque de communication transversale entre Data, Dev, Infra et Support client.',
      'Duplication massive de 4.5 To/j de données de télémétrie entre environnements test et prod sans politique de purge (+42% surcoût IaaS).',
      'Pics hebdomadaires le vendredi soir (250k joueurs) provoquant des rollbacks, des pertes de progression et un flood du support client.',
      'Dette technique accumulée depuis 2018 et épuisement moral des équipes de développement.',
      'Alertes répétées du RSSI sur la porosité des bases de test et la non-conformité RGPD des accès admin.',
      'Surconsommation électrique nocturne ternissant l\'image éco-responsable (Green IT) auprès des fonds d\'investissement.',
    ],
    objectifsLean: [
      'Réduire la facture d\'hébergement cloud d\'au moins 35% en éliminant les données dupliquées (Seiri / Seiso).',
      'Lisser l\'irrégularité (Mura) et la surcharge (Muri) du vendredi soir par l\'autoscaling et le découplage asynchrone.',
      'Décloisonner les équipes grâce à un flux Kanban transverse unifié et des rituels d\'amélioration continue (Kaizen).',
      'Garantir l\'auditabilité et l\'anonymisation RGPD des environnements hors production.',
      'Programmer l\'extinction dynamique des clusters nocturnes (Green IT).',
    ],
  },
  config: {
    sprintDurationDays: 10,
    hoursPerDay: 8,
    initialTaskCount: 22,
    peopleCount: 5,
    maxPeoplePerTask: 1,
    arrivalStrategy: 'continuous',
    taskSizing: 'variable',
  },
  columns: PIXELS_DRAGONS_COLUMNS,
  categories: [
    { id: 'data', name: 'Data & Télémétrie', color: '#3b82f6' },
    { id: 'devops', name: 'Cloud, Infra & SRE', color: '#06b6d4' },
    { id: 'game', name: 'Game Engine & Dette Tech', color: '#8b5cf6' },
    { id: 'security', name: 'Cybersécurité & RGPD', color: '#ef4444' },
    { id: 'support', name: 'Support & Rituels Lean', color: '#f59e0b' },
  ],
  roles: [
    { id: 'r-data', name: 'Data Engineer / Pipeline', categoryId: 'data' },
    { id: 'r-sre', name: 'Ingénieur Cloud & SRE', categoryId: 'devops' },
    { id: 'r-game', name: 'Tech Lead / Game Dev', categoryId: 'game' },
    { id: 'r-rssi', name: 'RSSI & Responsable RGPD', categoryId: 'security' },
    { id: 'r-support', name: 'Lead Support & Rituels Transverses', categoryId: 'support' },
  ],
  members: [
    { id: 'm-data', name: 'Maxime', role: 'Data Engineer / Pipeline', categoryId: 'data', avatarColor: '#3b82f6', initials: 'MX', efficiency: 1 },
    { id: 'm-sre', name: 'Karim', role: 'Ingénieur Cloud & SRE', categoryId: 'devops', avatarColor: '#06b6d4', initials: 'KA', efficiency: 1 },
    { id: 'm-game', name: 'Élodie', role: 'Tech Lead / Game Dev', categoryId: 'game', avatarColor: '#8b5cf6', initials: 'EL', efficiency: 1 },
    { id: 'm-rssi', name: 'Thomas', role: 'RSSI & Responsable RGPD', categoryId: 'security', avatarColor: '#ef4444', initials: 'TH', efficiency: 1 },
    { id: 'm-support', name: 'Sarah', role: 'Lead Support & Rituels Transverses', categoryId: 'support', avatarColor: '#f59e0b', initials: 'SA', efficiency: 1 },
  ],
  taskCatalog: PIXELS_DRAGONS_TASKS,
};

export const PROJECT_SAAS_STANDARD: ProjectTemplate = {
  id: 'saas-studio',
  title: 'SaaS Platform Studio',
  shortName: 'SaaS Studio',
  subtitle: 'Simulateur Kanban & Agile Universel',
  description: 'Application SaaS multi-tenant générique pour l\'expérimentation du flux tiré, des limites WIP et de la théorie des contraintes.',
  badge: 'Classique',
  icon: '💼',
  accentColor: 'indigo',
  companyContext: {
    name: 'CloudNova SaaS Technologies (50 collaborateurs)',
    metrics: [
      { label: 'Utilisateurs B2B', value: '45 000', hint: 'Comptes entreprises actifs' },
      { label: 'Microservices', value: '18 services', hint: 'Architecture distribuée' },
      { label: 'Fréquence déploiement', value: '1 / semaine', hint: 'Objectif CI/CD quotidien' },
      { label: 'Lead Time moyen', value: '14 jours', hint: 'De l\'idée à la production' },
    ],
    problematiques: [
      'Goulots d\'étranglement récurrents en phase de test et recette fonctionnelle.',
      'Multiplication des tâches commencées en parallèle générant du multitâche excessif.',
      'Difficulté à prévoir la date de livraison des fonctionnalités stratégiques.',
    ],
    objectifsLean: [
      'Réduire le Lead Time de 40% en instaurant des limites strictes de WIP.',
      'Équilibrer la charge de travail entre le développement backend et la QA.',
      'Atteindre une fluidité de flux avec un débit prédictible.',
    ],
  },
  config: DEFAULT_CONFIG,
  columns: DEFAULT_COLUMNS,
  categories: DEFAULT_CATEGORIES,
  roles: DEFAULT_ROLES,
  members: DEFAULT_MEMBERS,
  taskCatalog: DEV_TASKS_CATALOG,
};

export const AVAILABLE_PROJECTS: ProjectTemplate[] = [
  PROJECT_PIXELS_DRAGONS,
  PROJECT_SAAS_STANDARD,
];
