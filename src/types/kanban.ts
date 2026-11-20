export type ColumnType = 'queue' | 'active' | 'done';

export interface Column {
  id: string;
  name: string;
  type: ColumnType;
  color: string;
  maxPeople: number;
  maxWip?: number;
  defaultEffortHours: number;
}

export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';
export type TaskCategory = 'backend' | 'frontend' | 'devops' | 'database' | 'security' | 'qa' | string;
export type StoryPoints = 1 | 2 | 3 | 5 | 8 | 13;

export interface CategoryDefinition {
  id: string;
  name: string;
  color: string;
}

export interface RoleDefinition {
  id: string;
  name: string;
  categoryId: string;
}

export interface TaskHistoryEntry {
  columnId: string;
  enteredAtHour: number;
  exitedAtHour?: number;
}

export interface Task {
  id: string;
  code: string; // e.g. DEV-104
  title: string;
  description?: string;
  category: TaskCategory;
  columnId: string;
  priority: TaskPriority;
  storyPoints: StoryPoints; // Fibonacci: 1, 2, 3, 5, 8, 13
  totalEffortHours: number; // calculated from story points (e.g. 1 SP = 2h, 2 SP = 4h...)
  remainingEffortHours: number;
  currentColumnEffortHours: number;
  assignedMemberIds: string[];
  contributions?: Record<string, number>; // memberId -> hours worked on task
  isBlocked: boolean;
  blockedRemainingHours?: number;
  blockedReason?: string;
  createdAtHour: number;
  completedAtHour?: number;
  history: TaskHistoryEntry[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  categoryId?: string;
  avatarColor: string;
  initials: string;
  currentTaskId?: string;
  efficiency: number;
  pointsDelivered?: number; // Story points delivered this sprint
  hoursContributed?: number;
  tasksCompleted?: number;
}

export interface SimulationConfig {
  sprintDurationDays: number;
  hoursPerDay: number;
  initialTaskCount: number;
  peopleCount: number;
  maxPeoplePerTask: number;
  taskSizing: 'constant' | 'variable';
  arrivalStrategy?: 'batch' | 'continuous' | 'manual';
}

export interface SimulationMetrics {
  currentHour: number;
  currentDay: number;
  currentSprint: number;
  sprintProgressPercent: number;
  completedTasksCount: number;
  completedPointsCount: number; // Velocity in Story Points
  totalTasksCount: number;
  totalPointsCount: number;
  wipCount: number;
  averageLeadTimeHours: number;
  averageCycleTimeHours: number;
  throughputPerDay: number;
  teamUtilizationRate: number;
  flowEfficiency: number;
}

export interface MetricSnapshot {
  hour: number;
  day: number;
  sprint: number;
  columnTaskCounts: Record<string, number>;
  completedCount: number;
  completedPoints: number;
  wipCount: number;
  utilizationRate: number;
}

export interface ScenarioPreset {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  tagColor: 'emerald' | 'amber' | 'rose' | 'indigo' | 'sky';
  description: string;
  config: SimulationConfig;
  columns: Column[];
  members: TeamMember[];
}
