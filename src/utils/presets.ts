import type { Column, ScenarioPreset, TeamMember, SimulationConfig, CategoryDefinition, RoleDefinition } from '../types/kanban';

export const DEFAULT_CATEGORIES: CategoryDefinition[] = [
  { id: 'backend', name: 'Backend', color: '#6366f1' },
  { id: 'frontend', name: 'Frontend', color: '#ec4899' },
  { id: 'devops', name: 'DevOps & Infra', color: '#06b6d4' },
  { id: 'database', name: 'Database & Data', color: '#8b5cf6' },
  { id: 'security', name: 'Cybersécurité', color: '#ef4444' },
  { id: 'qa', name: 'QA & Tests', color: '#f59e0b' },
];

export const DEFAULT_ROLES: RoleDefinition[] = [
  { id: 'r-lead', name: 'Tech Lead / Fullstack', categoryId: 'backend' },
  { id: 'r-backend', name: 'Développeur Backend', categoryId: 'backend' },
  { id: 'r-frontend', name: 'Développeuse Frontend', categoryId: 'frontend' },
  { id: 'r-devops', name: 'Ingénieur DevOps / SRE', categoryId: 'devops' },
  { id: 'r-db', name: 'DBA / Data Engineer', categoryId: 'database' },
  { id: 'r-sec', name: 'Analyste Cybersécurité', categoryId: 'security' },
  { id: 'r-qa', name: 'Ingénieure QA & Recette', categoryId: 'qa' },
  { id: 'r-po', name: 'Product Owner / Cadrage', categoryId: 'backend' },
];

export const DEFAULT_COLUMNS: Column[] = [
  {
    id: 'backlog',
    name: 'Backlog',
    type: 'queue',
    color: '#64748b', // slate
    maxPeople: 0,
    maxWip: 999,
    defaultEffortHours: 0,
  },
  {
    id: 'analysis',
    name: 'Cadrage / Analyse',
    type: 'active',
    color: '#3b82f6', // blue
    maxPeople: 2,
    maxWip: 4,
    defaultEffortHours: 6,
  },
  {
    id: 'dev_ready',
    name: 'Prêt pour Dev',
    type: 'queue',
    color: '#06b6d4', // cyan
    maxPeople: 0,
    maxWip: 4,
    defaultEffortHours: 0,
  },
  {
    id: 'dev',
    name: 'Développement',
    type: 'active',
    color: '#8b5cf6', // purple
    maxPeople: 4,
    maxWip: 5,
    defaultEffortHours: 12,
  },
  {
    id: 'test',
    name: 'Test & Recette',
    type: 'active',
    color: '#f59e0b', // amber
    maxPeople: 2,
    maxWip: 3,
    defaultEffortHours: 8,
  },
  {
    id: 'done',
    name: 'Terminé (Done)',
    type: 'done',
    color: '#10b981', // emerald
    maxPeople: 0,
    maxWip: 999,
    defaultEffortHours: 0,
  },
];

export const DEFAULT_MEMBERS: TeamMember[] = [
  { id: 'm1', name: 'Alice', role: 'Product Owner / Cadrage', categoryId: 'backend', avatarColor: '#3b82f6', initials: 'AL', efficiency: 1 },
  { id: 'm2', name: 'Bob', role: 'Tech Lead / Fullstack', categoryId: 'backend', avatarColor: '#8b5cf6', initials: 'BO', efficiency: 1 },
  { id: 'm3', name: 'Chloé', role: 'Développeuse Frontend', categoryId: 'frontend', avatarColor: '#ec4899', initials: 'CH', efficiency: 1 },
  { id: 'm4', name: 'David', role: 'Développeur Backend', categoryId: 'backend', avatarColor: '#6366f1', initials: 'DA', efficiency: 1 },
  { id: 'm5', name: 'Emma', role: 'Ingénieure QA & Recette', categoryId: 'qa', avatarColor: '#f59e0b', initials: 'EM', efficiency: 1 },
];

export const DEFAULT_CONFIG: SimulationConfig = {
  sprintDurationDays: 10,
  hoursPerDay: 8,
  initialTaskCount: 45,
  peopleCount: 5,
  maxPeoplePerTask: 1,
  arrivalStrategy: 'continuous',
  taskSizing: 'variable',
};

export const PRESET_SCENARIOS: ScenarioPreset[] = [
  {
    id: 'healthy-flow',
    title: '🟢 Flux sain (Équilibré)',
    subtitle: 'WIP calibré, lissage parfait',
    emoji: '🟢',
    tagColor: 'emerald',
    description: 'Capacités équilibrées entre colonnes, limites WIP adaptées. Le cas de référence pour observer un flux tiré régulier et un Lead Time maîtrisé.',
    config: {
      sprintDurationDays: 10,
      hoursPerDay: 8,
      initialTaskCount: 18,
      peopleCount: 5,
      maxPeoplePerTask: 1,
      arrivalStrategy: 'continuous',
      taskSizing: 'variable',
    },
    columns: DEFAULT_COLUMNS,
    members: DEFAULT_MEMBERS,
  },
  {
    id: 'qa-bottleneck',
    title: '🟡 Goulot en Test / Recette',
    subtitle: 'Théorie des contraintes',
    emoji: '🟡',
    tagColor: 'amber',
    description: 'Une seule personne en test face à 4 personnes en analyse et dev. Observez l\'accumulation exponentielle des cartes avant la phase de test.',
    config: {
      sprintDurationDays: 10,
      hoursPerDay: 8,
      initialTaskCount: 22,
      peopleCount: 5,
      maxPeoplePerTask: 1,
      arrivalStrategy: 'batch',
      taskSizing: 'variable',
    },
    columns: [
      { ...DEFAULT_COLUMNS[0] },
      { ...DEFAULT_COLUMNS[1], maxPeople: 2, maxWip: 5 },
      { ...DEFAULT_COLUMNS[2], maxWip: 8 },
      { ...DEFAULT_COLUMNS[3], maxPeople: 4, maxWip: 6 },
      { ...DEFAULT_COLUMNS[4], maxPeople: 1, maxWip: 2, defaultEffortHours: 14 }, // Bottle-neck here!
      { ...DEFAULT_COLUMNS[5] },
    ],
    members: [
      { id: 'm1', name: 'Alice', role: 'Analyste', avatarColor: '#3b82f6', initials: 'AL', efficiency: 1 },
      { id: 'm2', name: 'Bob', role: 'Dev 1', avatarColor: '#8b5cf6', initials: 'BO', efficiency: 1 },
      { id: 'm3', name: 'Chloé', role: 'Dev 2', avatarColor: '#ec4899', initials: 'CH', efficiency: 1 },
      { id: 'm4', name: 'David', role: 'Dev 3', avatarColor: '#6366f1', initials: 'DA', efficiency: 1 },
      { id: 'm5', name: 'Emma', role: 'QA Solo (Goulot)', avatarColor: '#f59e0b', initials: 'EM', efficiency: 0.9 },
    ],
  },
  {
    id: 'no-wip-limits',
    title: '🔴 WIP Illimité & Surcharge',
    subtitle: 'Anti-pattern classique',
    emoji: '🔴',
    tagColor: 'rose',
    description: 'Aucune limite sur les colonnes. Tout le monde démarre des tâches en parallèle sans les terminer. Explosion du Lead Time garanti !',
    config: {
      sprintDurationDays: 10,
      hoursPerDay: 8,
      initialTaskCount: 30,
      peopleCount: 5,
      maxPeoplePerTask: 1,
      arrivalStrategy: 'batch',
      taskSizing: 'variable',
    },
    columns: DEFAULT_COLUMNS.map(c => ({ ...c, maxPeople: 10, maxWip: 999 })),
    members: DEFAULT_MEMBERS,
  },
  {
    id: 'hero-dev',
    title: '🦸 Développeur Héros',
    subtitle: 'Point unique de défaillance (SPOF)',
    emoji: '🦸',
    tagColor: 'indigo',
    description: 'Un seul expert central surqualifié mais sursollicité au milieu d\'une équipe restreinte. Si le héros bloque, tout le système s\'arrête.',
    config: {
      sprintDurationDays: 10,
      hoursPerDay: 8,
      initialTaskCount: 16,
      peopleCount: 3,
      maxPeoplePerTask: 1,
      arrivalStrategy: 'batch',
      taskSizing: 'variable',
    },
    columns: DEFAULT_COLUMNS.map(c => ({ ...c, maxPeople: 2 })),
    members: [
      { id: 'm1', name: 'Victor (L\'Expert)', role: 'Architecte Héros', avatarColor: '#6366f1', initials: 'VI', efficiency: 1.5 },
      { id: 'm2', name: 'Thomas', role: 'Junior 1', avatarColor: '#10b981', initials: 'TH', efficiency: 0.7 },
      { id: 'm3', name: 'Sarah', role: 'Junior 2', avatarColor: '#f43f5e', initials: 'SA', efficiency: 0.7 },
    ],
  },
];
