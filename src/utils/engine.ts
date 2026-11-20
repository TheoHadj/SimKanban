import type { Column, SimulationConfig, Task, TeamMember, SimulationMetrics, MetricSnapshot, TaskCategory, StoryPoints } from '../types/kanban';

export const DEV_TASKS_CATALOG: { title: string; category: TaskCategory; points: StoryPoints }[] = [
  // 1-10
  { title: 'Implémentation de l\'authentification OAuth2 & JWT', category: 'security', points: 5 },
  { title: 'Optimisation des index SQL et partitionnement Postgres', category: 'database', points: 8 },
  { title: 'Refactoring du service de paiement en architecture hexagonale', category: 'backend', points: 13 },
  { title: 'Mise en place des tests d\'intégration CI/CD avec Vitest', category: 'qa', points: 3 },
  { title: 'Création du pipeline de déploiement GitHub Actions', category: 'devops', points: 3 },
  { title: 'Gestion du cache applicatif distribué avec Redis', category: 'database', points: 5 },
  { title: 'Intégration du composant DataGrid virtuel avec React', category: 'frontend', points: 5 },
  { title: 'Correction de la fuite mémoire dans le pool de connexions Node.js', category: 'backend', points: 8 },
  { title: 'Mise en place de Prometheus et dashboards Grafana', category: 'devops', points: 5 },
  { title: 'Chiffrement AES-256 des données sensibles en base', category: 'security', points: 8 },

  // 11-20
  { title: 'Notifications push temps réel via WebSockets', category: 'backend', points: 5 },
  { title: 'Migration du schéma de données vers Postgres 16', category: 'database', points: 8 },
  { title: 'Optimisation des Core Web Vitals (LCP, CLS) et code splitting', category: 'frontend', points: 3 },
  { title: 'Sécurisation stricte des en-têtes HTTP (CSP, HSTS, CORS)', category: 'security', points: 2 },
  { title: 'Développement de l\'API REST v2 avec validation Zod', category: 'backend', points: 8 },
  { title: 'Upload sécurisé sur S3 avec signatures presigned URL', category: 'devops', points: 3 },
  { title: 'Dockerisation multi-stage build et manifests Kubernetes', category: 'devops', points: 5 },
  { title: 'Génération automatique de la documentation Swagger/OpenAPI', category: 'backend', points: 2 },
  { title: 'Support du mode hors-ligne avec Service Worker (PWA)', category: 'frontend', points: 8 },
  { title: 'Système d\'autorisations fines basé sur les rôles (RBAC)', category: 'security', points: 5 },

  // 21-30
  { title: 'Rate limiting par IP et prévention DDoS avec Redis', category: 'security', points: 3 },
  { title: 'Audit d\'accessibilité numérique WCAG 2.1 niveau AA', category: 'frontend', points: 3 },
  { title: 'Indexation et recherche plein texte avec ElasticSearch', category: 'database', points: 13 },
  { title: 'Tests de montée en charge et stress testing avec k6', category: 'qa', points: 5 },
  { title: 'Tests end-to-end automatisés des parcours d\'achat avec Playwright', category: 'qa', points: 8 },
  { title: 'Implémentation du protocole gRPC pour échanges inter-microservices', category: 'backend', points: 8 },
  { title: 'Intégration de l\'authentification biométrique WebAuthn / Passkeys', category: 'security', points: 5 },
  { title: 'Configuration du cluster Kafka et gestion des partitions d\'événements', category: 'devops', points: 13 },
  { title: 'Conception du Dark Mode adaptatif avec Tailwind CSS et CSS variables', category: 'frontend', points: 2 },
  { title: 'Monitoring applicatif et traçage distribué OpenTelemetry', category: 'devops', points: 8 },

  // 31-40
  { title: 'Refactoring des requêtes N+1 et batching avec DataLoader', category: 'database', points: 5 },
  { title: 'Gestion des webhooks entrants avec signature HMAC et retry', category: 'backend', points: 5 },
  { title: 'Mise en place de la suite de tests de non-régression visuelle', category: 'qa', points: 3 },
  { title: 'Automatisation des sauvegardes chiffrées sur AWS S3 Glacier', category: 'devops', points: 3 },
  { title: 'Fédération d\'identités SAML 2.0 et Single Sign-On (SSO)', category: 'security', points: 8 },
  { title: 'Développement du dashboard analytics temps réel avec Server-Sent Events', category: 'frontend', points: 5 },
  { title: 'Optimisation du rendu côté serveur (SSR) et streaming HTML', category: 'frontend', points: 8 },
  { title: 'Implémentation d\'un bus d\'événements avec RabbitMQ & Dead Letter Queue', category: 'backend', points: 8 },
  { title: 'Audit de sécurité des dépendances npm avec Snyk et Dependabot', category: 'security', points: 2 },
  { title: 'Partitionnement horizontal de la base de données (Database Sharding)', category: 'database', points: 13 },

  // 41-50
  { title: 'Tests de résilience et Chaos Engineering avec Chaos Mesh', category: 'qa', points: 5 },
  { title: 'Refonte du tunnel de commande avec gestion des brouillons hors-ligne', category: 'frontend', points: 5 },
  { title: 'Pipeline de transcodage asynchrone de vidéos en tâche de fond', category: 'backend', points: 8 },
  { title: 'Mise en place de Terraform pour l\'infrastructure-as-code (IaC)', category: 'devops', points: 8 },
  { title: 'Invalidation fine du cache CDN Cloudflare via API', category: 'devops', points: 3 },
  { title: 'Découpage du monolithe : extraction du microservice de facturation', category: 'backend', points: 13 },
  { title: 'Internationalisation (i18n) multi-devises et fuseaux horaires', category: 'frontend', points: 5 },
  { title: 'Filtrage des failles XSS et assainissement strict des entrées utilisateur', category: 'security', points: 3 },
  { title: 'Analyseur statique de code et règles SonarQube partagées', category: 'qa', points: 2 },
  { title: 'Intégration de Sentry avec alertes Slack et groupement d\'erreurs', category: 'devops', points: 2 },

  // 51-65
  { title: 'Système de feature flagging dynamique avec LaunchDarkly', category: 'backend', points: 3 },
  { title: 'Optimisation du bundle JavaScript et suppression du tree-shaking dead code', category: 'frontend', points: 3 },
  { title: 'Chiffrement de bout en bout des messages d\'assistance utilisateur', category: 'security', points: 8 },
  { title: 'Archivage automatisé des données froides et purge RGPD', category: 'database', points: 5 },
  { title: 'Tests de compatibilité multi-navigateurs (Safari, Firefox, Chromium)', category: 'qa', points: 3 },
  { title: 'Migration des endpoints REST vers une passerelle GraphQL fédérée', category: 'backend', points: 8 },
  { title: 'Interface de glisser-déposer accessible avec retour haptique', category: 'frontend', points: 5 },
  { title: 'Mise en place du protocole mTLS pour la communication inter-pods K8s', category: 'security', points: 5 },
  { title: 'Pipeline d\'agrégation d\'analytics avec ClickHouse', category: 'database', points: 13 },
  { title: 'Gestion fine des erreurs réseau et retry avec exponential backoff', category: 'frontend', points: 2 },
  { title: 'Couverture de tests unitaires à 90% sur le moteur de calcul', category: 'qa', points: 5 },
  { title: 'Déploiement Blue-Green sans coupure de service (Zero-Downtime)', category: 'devops', points: 5 },
  { title: 'Système d\'export CSV / PDF asynchrone haute performance', category: 'backend', points: 3 },
  { title: 'Audit de conformité RGPD et registre des traitements automatisé', category: 'security', points: 3 },
  { title: 'Refonte de la gestion des états globaux avec Zustand et TanStack Query', category: 'frontend', points: 5 },
];

export function generateInitialTasks(
  count: number,
  columns: Column[],
  sizing: 'constant' | 'variable' = 'variable'
): Task[] {
  const firstCol = columns[0];
  const activeCols = columns.filter(c => c.type === 'active');
  const tasks: Task[] = [];

  for (let i = 0; i < count; i++) {
    const item = DEV_TASKS_CATALOG[i % DEV_TASKS_CATALOG.length];
    const code = `DEV-${101 + i}`;
    const storyPoints = item.points;
    
    // Effort proportional to Fibonacci story points (e.g. 1 SP = 2h, 2 SP = 4h, 3 SP = 6h, 5 SP = 10h, 8 SP = 16h, 13 SP = 26h)
    const baseEffort = storyPoints * 2;
    let totalEffort = 0;
    activeCols.forEach(() => {
      const variance = sizing === 'variable' ? (0.85 + Math.random() * 0.3) : 1;
      totalEffort += Math.round((baseEffort / Math.max(1, activeCols.length)) * variance);
    });

    tasks.push({
      id: `task-${Date.now()}-${i + 1}`,
      code,
      title: item.title + (i >= DEV_TASKS_CATALOG.length ? ` (Lot ${Math.floor(i / DEV_TASKS_CATALOG.length) + 1})` : ''),
      category: item.category,
      columnId: firstCol.id,
      priority: i === 0 ? 'urgent' : i % 5 === 0 ? 'high' : 'normal',
      storyPoints,
      totalEffortHours: Math.max(2, totalEffort),
      remainingEffortHours: 0,
      currentColumnEffortHours: 0,
      assignedMemberIds: [],
      isBlocked: false,
      createdAtHour: 0,
      history: [{ columnId: firstCol.id, enteredAtHour: 0 }],
    });
  }

  return tasks;
}

export function generateBatchTasks(
  batchCount: number,
  existingCount: number,
  columns: Column[],
  currentHour: number = 0
): Task[] {
  const firstCol = columns[0];
  const activeCols = columns.filter(c => c.type === 'active');
  const newTasks: Task[] = [];

  for (let i = 0; i < batchCount; i++) {
    const taskIndex = existingCount + i;
    const item = DEV_TASKS_CATALOG[taskIndex % DEV_TASKS_CATALOG.length];
    const code = `DEV-${101 + taskIndex}`;
    const storyPoints = item.points;

    const baseEffort = storyPoints * 2;
    let totalEffort = 0;
    activeCols.forEach(() => {
      const variance = 0.85 + Math.random() * 0.3;
      totalEffort += Math.round((baseEffort / Math.max(1, activeCols.length)) * variance);
    });

    newTasks.push({
      id: `task-${Date.now()}-${taskIndex + 1}`,
      code,
      title: item.title + (taskIndex >= DEV_TASKS_CATALOG.length ? ` (Lot ${Math.floor(taskIndex / DEV_TASKS_CATALOG.length) + 1})` : ''),
      category: item.category,
      columnId: firstCol.id,
      priority: taskIndex % 6 === 0 ? 'high' : 'normal',
      storyPoints,
      totalEffortHours: Math.max(2, totalEffort),
      remainingEffortHours: 0,
      currentColumnEffortHours: 0,
      assignedMemberIds: [],
      isBlocked: false,
      createdAtHour: currentHour,
      history: [{ columnId: firstCol.id, enteredAtHour: currentHour }],
    });
  }

  return newTasks;
}

export function createUrgentTask(currentHour: number, columns: Column[], currentTaskCount: number): Task {
  const firstCol = columns[0];
  const activeCols = columns.filter(c => c.type === 'active');
  const totalEffort = activeCols.reduce((acc, c) => acc + Math.round(c.defaultEffortHours * 0.7), 0);

  const urgentTitles = [
    'INCIDENT PRODUCTION : Fuite mémoire critique sur le cluster Node.js',
    'FAILLE CVE : Vulnérabilité d\'injection SQL détectée dans l\'API',
    'CRASH SERVICE : Blocage des transactions de paiement en production',
    'PANNE RÉSILIENCE : Déconnexion intempestive du pool de connexions DB',
    'ALERTE SÉCURITÉ : Tentative d\'exfiltration de jetons d\'accès API',
    'RÉGRESSION MAJEURE : Timeout sur les requêtes de recherche ElasticSearch',
  ];

  return {
    id: `urgent-${Date.now()}`,
    code: `HOTFIX-${currentTaskCount + 1}`,
    title: urgentTitles[Math.floor(Math.random() * urgentTitles.length)],
    category: 'security',
    columnId: firstCol.id,
    priority: 'urgent',
    storyPoints: 8, // Urgent bug evaluated at 8 points Fibonacci
    totalEffortHours: Math.max(3, totalEffort),
    remainingEffortHours: 0,
    currentColumnEffortHours: 0,
    assignedMemberIds: [],
    isBlocked: false,
    createdAtHour: currentHour,
    history: [{ columnId: firstCol.id, enteredAtHour: currentHour }],
  };
}

export interface StepSimulationResult {
  nextHour: number;
  nextTasks: Task[];
  nextMembers: TeamMember[];
  nextMetrics: SimulationMetrics;
  snapshot: MetricSnapshot;
  sprintEnded: boolean;
}

export function getColumnEffortWeight(col: Column): number {
  if (col.type === 'queue' || col.type === 'done') return 0;
  const name = col.name.toLowerCase();
  if (name.includes('review') || name.includes('revue') || name.includes('pr')) return 0.15;
  if (name.includes('test') || name.includes('qa') || name.includes('recette') || name.includes('validation')) return 0.25;
  if (name.includes('cadrage') || name.includes('analyse') || name.includes('spec') || name.includes('conception')) return 0.15;
  if (name.includes('deploy') || name.includes('mise en prod') || name.includes('release')) return 0.10;
  // Core development / implementation column
  return 0.85;
}

export function simulateOneHour(
  currentHour: number,
  tasks: Task[],
  columns: Column[],
  members: TeamMember[],
  config: SimulationConfig
): StepSimulationResult {
  const nextHour = currentHour + 1;
  const hoursPerDay = config.hoursPerDay || 8;
  const sprintDurationDays = config.sprintDurationDays || 10;
  const sprintTotalHours = sprintDurationDays * hoursPerDay;

  const currentSprint = Math.floor(currentHour / sprintTotalHours) + 1;
  const nextSprint = Math.floor(nextHour / sprintTotalHours) + 1;
  const sprintEnded = nextSprint > currentSprint;

  const updatedTasks: Task[] = tasks.map(t => ({
    ...t,
    assignedMemberIds: [...t.assignedMemberIds],
    history: t.history.map(h => ({ ...h })),
  }));

  const updatedMembers: TeamMember[] = members.map(m => ({
    ...m,
    currentTaskId: undefined,
    hoursContributed: m.hoursContributed || 0,
    tasksCompleted: m.tasksCompleted || 0,
    pointsDelivered: m.pointsDelivered || 0,
  }));

  // 1. Advance blocked tasks
  updatedTasks.forEach(task => {
    if (task.isBlocked && task.blockedRemainingHours) {
      task.blockedRemainingHours -= 1;
      if (task.blockedRemainingHours <= 0) {
        task.isBlocked = false;
        task.blockedRemainingHours = undefined;
        task.blockedReason = undefined;
      }
    }
  });

  const columnMap = new Map<string, Column>(columns.map(c => [c.id, c]));
  const columnOrder = columns.map(c => c.id);

  const getNextColumn = (colId: string): Column | undefined => {
    const idx = columnOrder.indexOf(colId);
    return idx >= 0 && idx < columns.length - 1 ? columns[idx + 1] : undefined;
  };

  const getTasksInColumn = (colId: string) => updatedTasks.filter(t => t.columnId === colId);
  const getAvailableMembers = () => updatedMembers.filter(m => !m.currentTaskId);

  // 2. Work on active columns (Right to Left: Pull principle)
  const activeColIdsReversed = [...columns]
    .filter(c => c.type === 'active')
    .map(c => c.id)
    .reverse();

  for (const colId of activeColIdsReversed) {
    const col = columnMap.get(colId)!;
    const tasksInThisCol = getTasksInColumn(colId);

    // Urgent first, then FIFO
    tasksInThisCol.sort((a, b) => {
      if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
      if (b.priority === 'urgent' && a.priority !== 'urgent') return 1;
      const aEntry = a.history.find(h => h.columnId === colId)?.enteredAtHour || 0;
      const bEntry = b.history.find(h => h.columnId === colId)?.enteredAtHour || 0;
      return aEntry - bEntry;
    });

    for (const task of tasksInThisCol) {
      if (task.isBlocked) continue;

      // Assign members up to column maxPeople & config maxPeoplePerTask
      const maxPeopleOnTask = Math.min(config.maxPeoplePerTask || 1, col.maxPeople || 99);
      const currentlyAssigned = task.assignedMemberIds
        .map(id => updatedMembers.find(m => m.id === id))
        .filter(Boolean) as TeamMember[];

      const available = getAvailableMembers();
      while (currentlyAssigned.length < maxPeopleOnTask && available.length > 0) {
        const nextDev = available.shift()!;
        task.assignedMemberIds.push(nextDev.id);
        currentlyAssigned.push(nextDev);
      }

      if (currentlyAssigned.length === 0) continue;

      // Mark assigned members busy
      currentlyAssigned.forEach(m => {
        m.currentTaskId = task.id;
      });

      // Initialize column effort if entering for first time (weighted by column role)
      if (task.remainingEffortHours <= 0) {
        const weight = getColumnEffortWeight(col);
        const baseTaskHours = task.storyPoints * 2; // e.g. 13 SP -> 26h base dev effort
        const scaledHours = Math.max(1, Math.round(baseTaskHours * weight));
        const variance = config.taskSizing === 'variable' ? (0.85 + Math.random() * 0.3) : 1;
        task.remainingEffortHours = Math.max(1, Math.round(scaledHours * variance));
        task.currentColumnEffortHours = task.remainingEffortHours;
      }

      // Work done by developers this hour (with specialty matching bonus)
      const assignCount = currentlyAssigned.length;
      if (!task.contributions) task.contributions = {};
      for (const member of currentlyAssigned) {
        const isSpecialist = member.categoryId && member.categoryId === task.category;
        const efficiencyMult = isSpecialist ? 1.15 : 1.0;
        const workAmount = member.efficiency * efficiencyMult * (assignCount > 1 ? 0.9 : 1.0);
        task.remainingEffortHours -= workAmount;
        member.hoursContributed = (member.hoursContributed || 0) + 1;
        task.contributions[member.id] = (task.contributions[member.id] || 0) + 1;
      }

      // Check column completion
      if (task.remainingEffortHours <= 0) {
        const nextCol = getNextColumn(colId);
        if (nextCol) {
          const nextColTasks = getTasksInColumn(nextCol.id);
          const maxNextWip = nextCol.maxWip !== undefined ? nextCol.maxWip : 999;

          if (nextColTasks.length < maxNextWip) {
            const lastHist = task.history[task.history.length - 1];
            if (lastHist) lastHist.exitedAtHour = nextHour;

            const contributingMemberIds = [...task.assignedMemberIds];
            task.columnId = nextCol.id;
            task.assignedMemberIds = [];
            task.history.push({ columnId: nextCol.id, enteredAtHour: nextHour });

            if (nextCol.type === 'done') {
              task.completedAtHour = nextHour;
              task.remainingEffortHours = 0;

              // Fair proportional attribution of story points based on each member's contributed hours
              const contributions = task.contributions || {};
              const contributorIds = Object.keys(contributions);
              const totalHoursWorked = Object.values(contributions).reduce((sum, h) => sum + h, 0);

              if (contributorIds.length > 0 && totalHoursWorked > 0) {
                let remainingPoints: number = task.storyPoints;
                contributorIds.forEach((devId, idx) => {
                  const dev = updatedMembers.find(m => m.id === devId);
                  if (dev) {
                    dev.tasksCompleted = (dev.tasksCompleted || 0) + 1;
                    const hoursWorked = contributions[devId] || 0;
                    const share = idx === contributorIds.length - 1
                      ? remainingPoints
                      : Math.min(remainingPoints, Math.max(1, Math.round((hoursWorked / totalHoursWorked) * task.storyPoints)));
                    remainingPoints = Math.max(0, remainingPoints - share);
                    dev.pointsDelivered = (dev.pointsDelivered || 0) + share;
                  }
                });
              } else {
                updatedMembers.forEach(m => {
                  if (contributingMemberIds.includes(m.id)) {
                    m.tasksCompleted = (m.tasksCompleted || 0) + 1;
                    m.pointsDelivered = (m.pointsDelivered || 0) + task.storyPoints;
                  }
                });
              }
            } else {
              task.remainingEffortHours = 0;
            }
          }
        }
      }
    }
  }

  // 3. Pull tasks from Queue columns
  const allColumnsExceptLast = columns.slice(0, -1);
  for (const col of allColumnsExceptLast) {
    if (col.type === 'queue') {
      const nextCol = getNextColumn(col.id);
      if (!nextCol) continue;

      const nextColTasks = getTasksInColumn(nextCol.id);
      const maxWip = nextCol.maxWip !== undefined ? nextCol.maxWip : 999;
      let freeSlots = Math.max(0, maxWip - nextColTasks.length);

      const queueTasks = getTasksInColumn(col.id);
      queueTasks.sort((a, b) => {
        if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
        if (b.priority === 'urgent' && a.priority !== 'urgent') return 1;
        const aEntry = a.history.find(h => h.columnId === col.id)?.enteredAtHour || 0;
        const bEntry = b.history.find(h => h.columnId === col.id)?.enteredAtHour || 0;
        return aEntry - bEntry;
      });

      for (const t of queueTasks) {
        if (freeSlots <= 0) break;
        if (t.isBlocked) continue;

        const lastHist = t.history[t.history.length - 1];
        if (lastHist) lastHist.exitedAtHour = nextHour;

        t.columnId = nextCol.id;
        t.history.push({ columnId: nextCol.id, enteredAtHour: nextHour });
        t.remainingEffortHours = 0;
        freeSlots--;
      }
    }
  }

  // 3.5 Auto-replenish Backlog so simulation can progress indefinitely across sprints
  const backlogCol = columns[0];
  const backlogTasks = updatedTasks.filter(t => t.columnId === backlogCol.id);
  const shouldReplenish = config.arrivalStrategy === 'continuous' || backlogTasks.length < 5;
  if (shouldReplenish && (nextHour % (config.hoursPerDay || 8) === 0 || backlogTasks.length === 0)) {
    const nextIndex = updatedTasks.length;
    const catItem = DEV_TASKS_CATALOG[nextIndex % DEV_TASKS_CATALOG.length];
    const storyPoints = catItem.points;
    const baseEffort = storyPoints * 2;
    const activeCols = columns.filter(c => c.type === 'active');
    let totalEffort = 0;
    activeCols.forEach(() => {
      totalEffort += Math.round(baseEffort / Math.max(1, activeCols.length));
    });

    updatedTasks.push({
      id: `task-${Date.now()}-${nextIndex + 1}`,
      code: `DEV-${101 + nextIndex}`,
      title: catItem.title,
      category: catItem.category,
      columnId: backlogCol.id,
      priority: nextIndex % 5 === 0 ? 'high' : 'normal',
      storyPoints,
      totalEffortHours: Math.max(2, totalEffort),
      remainingEffortHours: 0,
      currentColumnEffortHours: 0,
      assignedMemberIds: [],
      isBlocked: false,
      createdAtHour: nextHour,
      history: [{ columnId: backlogCol.id, enteredAtHour: nextHour }],
    });
  }

  // 4. Metrics calculation
  const doneCol = columns.find(c => c.type === 'done');

  const completedTasks = updatedTasks.filter(t => t.columnId === doneCol?.id);
  const completedPointsCount = completedTasks.reduce((acc, t) => acc + (t.storyPoints || 0), 0);
  const totalPointsCount = updatedTasks.reduce((acc, t) => acc + (t.storyPoints || 0), 0);

  const activeWipTasks = updatedTasks.filter(
    t => t.columnId !== backlogCol.id && t.columnId !== doneCol?.id
  );

  let totalLeadTimeHours = 0;
  let totalCycleTimeHours = 0;

  completedTasks.forEach(t => {
    const leadTime = (t.completedAtHour || nextHour) - t.createdAtHour;
    totalLeadTimeHours += leadTime;

    const firstActiveEntry = t.history.find(h => {
      const c = columnMap.get(h.columnId);
      return c?.type === 'active';
    });
    const cycleTime = firstActiveEntry
      ? (t.completedAtHour || nextHour) - firstActiveEntry.enteredAtHour
      : leadTime;
    totalCycleTimeHours += cycleTime;
  });

  const avgLeadTime = completedTasks.length > 0 ? totalLeadTimeHours / completedTasks.length : 0;
  const avgCycleTime = completedTasks.length > 0 ? totalCycleTimeHours / completedTasks.length : 0;
  const currentDay = Math.floor(nextHour / hoursPerDay) + 1;
  const throughputPerDay = currentDay > 0 ? completedTasks.length / currentDay : 0;

  const busyMembersCount = updatedMembers.filter(m => !!m.currentTaskId).length;
  const teamUtilizationRate = updatedMembers.length > 0
    ? (busyMembersCount / updatedMembers.length) * 100
    : 0;

  const flowEfficiency = avgLeadTime > 0 ? Math.min(100, Math.round((avgCycleTime / avgLeadTime) * 100)) : 100;
  const currentHourInSprint = (nextHour - 1) % sprintTotalHours;
  const sprintProgressPercent = Math.min(100, Math.round((currentHourInSprint / sprintTotalHours) * 100));

  const nextMetrics: SimulationMetrics = {
    currentHour: nextHour,
    currentDay,
    currentSprint,
    sprintProgressPercent,
    completedTasksCount: completedTasks.length,
    completedPointsCount,
    totalTasksCount: updatedTasks.length,
    totalPointsCount,
    wipCount: activeWipTasks.length,
    averageLeadTimeHours: Math.round(avgLeadTime * 10) / 10,
    averageCycleTimeHours: Math.round(avgCycleTime * 10) / 10,
    throughputPerDay: Math.round(throughputPerDay * 10) / 10,
    teamUtilizationRate: Math.round(teamUtilizationRate),
    flowEfficiency,
  };

  // Snapshot for CFD
  const columnTaskCounts: Record<string, number> = {};
  columns.forEach(c => {
    columnTaskCounts[c.id] = updatedTasks.filter(t => t.columnId === c.id).length;
  });

  const snapshot: MetricSnapshot = {
    hour: nextHour,
    day: currentDay,
    sprint: currentSprint,
    columnTaskCounts,
    completedCount: completedTasks.length,
    completedPoints: completedPointsCount,
    wipCount: activeWipTasks.length,
    utilizationRate: Math.round(teamUtilizationRate),
  };

  return {
    nextHour,
    nextTasks: updatedTasks,
    nextMembers: updatedMembers,
    nextMetrics,
    snapshot,
    sprintEnded,
  };
}
