import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Column, ColumnType, SimulationConfig, SimulationMetrics, Task, TeamMember, MetricSnapshot, ScenarioPreset, StoryPoints, CategoryDefinition, RoleDefinition } from './types/kanban';
import { DEFAULT_COLUMNS, DEFAULT_CONFIG, DEFAULT_MEMBERS, DEFAULT_CATEGORIES, DEFAULT_ROLES } from './utils/presets';
import { generateInitialTasks, generateBatchTasks, simulateOneHour, createUrgentTask } from './utils/engine';
import { LinearHeader } from './components/LinearHeader';
import type { ActiveTab, AppMode } from './components/LinearHeader';
import { LinearKanbanBoard } from './components/LinearKanbanBoard';
import { SimulationDock } from './components/SimulationDock';
import { AgileDashboard } from './components/AgileDashboard';
import { LinearAnalytics } from './components/LinearAnalytics';
import { TaskEditModal } from './components/TaskEditModal';
import { SettingsModal } from './components/SettingsModal';
import { ScenariosModal } from './components/ScenariosModal';
import { SprintEndModal } from './components/SprintEndModal';

export const App: React.FC = () => {
  // Navigation & Mode
  const [activeTab, setActiveTab] = useState<ActiveTab>('board');
  const [appMode, setAppMode] = useState<AppMode>('simulator');

  // Core Kanban Configuration (The 7 Criteria)
  const [config, setConfig] = useState<SimulationConfig>(DEFAULT_CONFIG);
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS);
  const [members, setMembers] = useState<TeamMember[]>(DEFAULT_MEMBERS);
  const [categories, setCategories] = useState<CategoryDefinition[]>(DEFAULT_CATEGORIES);
  const [roles, setRoles] = useState<RoleDefinition[]>(DEFAULT_ROLES);

  // Simulation execution state
  const [tasks, setTasks] = useState<Task[]>(() =>
    generateInitialTasks(DEFAULT_CONFIG.initialTaskCount, DEFAULT_COLUMNS, DEFAULT_CONFIG.taskSizing)
  );
  const [currentHour, setCurrentHour] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [snapshots, setSnapshots] = useState<MetricSnapshot[]>([]);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isScenariosOpen, setIsScenariosOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Partial<Task> | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [isSprintEndOpen, setIsSprintEndOpen] = useState<boolean>(false);

  // Real-time Metrics
  const [metrics, setMetrics] = useState<SimulationMetrics>(() => {
    const initialPts = tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
    return {
      currentHour: 0,
      currentDay: 1,
      currentSprint: 1,
      sprintProgressPercent: 0,
      completedTasksCount: 0,
      completedPointsCount: 0,
      totalTasksCount: DEFAULT_CONFIG.initialTaskCount,
      totalPointsCount: initialPts,
      wipCount: 0,
      averageLeadTimeHours: 0,
      averageCycleTimeHours: 0,
      throughputPerDay: 0,
      teamUtilizationRate: 0,
      flowEfficiency: 100,
    };
  });

  const stateRef = useRef({
    currentHour,
    tasks,
    columns,
    members,
    config,
    isRunning,
  });

  useEffect(() => {
    stateRef.current = {
      currentHour,
      tasks,
      columns,
      members,
      config,
      isRunning,
    };
  }, [currentHour, tasks, columns, members, config, isRunning]);

  // Execute 1 hour step
  const executeStep = useCallback(() => {
    const {
      currentHour: cHour,
      tasks: cTasks,
      columns: cCols,
      members: cMems,
      config: cConf,
    } = stateRef.current;

    const result = simulateOneHour(cHour, cTasks, cCols, cMems, cConf);

    setCurrentHour(result.nextHour);
    setTasks(result.nextTasks);
    setMembers(result.nextMembers);
    setMetrics(result.nextMetrics);
    setSnapshots(prev => [...prev, result.snapshot]);

    if (result.sprintEnded) {
      setIsRunning(false);
      setIsSprintEndOpen(true);
    }
  }, []);

  // Timer loop for Play / Pause
  useEffect(() => {
    if (!isRunning || appMode !== 'simulator') return;

    const intervalMs = Math.max(30, Math.round(600 / speed));
    const timer = setInterval(() => {
      executeStep();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isRunning, speed, executeStep, appMode]);

  // Simulation Controls
  const handlePlay = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setCurrentHour(0);
    const newTasks = generateInitialTasks(config.initialTaskCount, columns, config.taskSizing);
    const totalPts = newTasks.reduce((s, t) => s + (t.storyPoints || 0), 0);
    setTasks(newTasks);
    setMembers(members.map(m => ({ ...m, currentTaskId: undefined, hoursContributed: 0, tasksCompleted: 0, pointsDelivered: 0 })));
    setSnapshots([]);
    setMetrics({
      currentHour: 0,
      currentDay: 1,
      currentSprint: 1,
      sprintProgressPercent: 0,
      completedTasksCount: 0,
      completedPointsCount: 0,
      totalTasksCount: newTasks.length,
      totalPointsCount: totalPts,
      wipCount: 0,
      averageLeadTimeHours: 0,
      averageCycleTimeHours: 0,
      throughputPerDay: 0,
      teamUtilizationRate: 0,
      flowEfficiency: 100,
    });
  };

  const handleStepHour = () => {
    if (!isRunning) executeStep();
  };

  const handleStepDay = () => {
    if (!isRunning) {
      for (let i = 0; i < (config.hoursPerDay || 8); i++) {
        executeStep();
      }
    }
  };

  // Live Aléas & Batch tasks
  const handleAddBatchTasks = useCallback(() => {
    const newTasks = generateBatchTasks(10, tasks.length, columns, currentHour);
    const addedPoints = newTasks.reduce((s, t) => s + (t.storyPoints || 0), 0);
    setTasks(prev => [...prev, ...newTasks]);
    setMetrics(prev => ({
      ...prev,
      totalTasksCount: prev.totalTasksCount + newTasks.length,
      totalPointsCount: (prev.totalPointsCount || 0) + addedPoints,
    }));
  }, [tasks.length, columns, currentHour]);

  const handleAddUrgentTask = () => {
    const urgent = createUrgentTask(currentHour, columns, tasks.length);
    setTasks(prev => [urgent, ...prev]);
    setMetrics(prev => ({ ...prev, totalTasksCount: prev.totalTasksCount + 1 }));
  };

  const handleBlockRandomTask = () => {
    const activeColIds = new Set(columns.filter(c => c.type === 'active').map(c => c.id));
    const eligibleTasks = tasks.filter(t => activeColIds.has(t.columnId) && !t.isBlocked);

    if (eligibleTasks.length === 0) return;

    const randomTask = eligibleTasks[Math.floor(Math.random() * eligibleTasks.length)];
    const blockDuration = Math.floor(Math.random() * 8) + 4;

    setTasks(prev =>
      prev.map(t =>
        t.id === randomTask.id
          ? {
              ...t,
              isBlocked: true,
              blockedRemainingHours: blockDuration,
              blockedReason: 'Dépendance bloquante en attente',
            }
          : t
      )
    );
  };

  const handleToggleBlockTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const nextBlocked = !t.isBlocked;
          return {
            ...t,
            isBlocked: nextBlocked,
            blockedRemainingHours: nextBlocked ? 6 : undefined,
          };
        }
        return t;
      })
    );
  };

  // Task Management (CRUD)
  const handleOpenCreateTask = (colId?: string) => {
    setSelectedTask({
      code: `DEV-${101 + tasks.length}`,
      title: '',
      description: '',
      columnId: colId || columns[0]?.id || 'backlog',
      priority: 'normal',
      category: 'backend',
      totalEffortHours: 8,
      assignedMemberIds: [],
    });
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (taskData.id) {
      // Edit existing
      setTasks(prev =>
        prev.map(t => (t.id === taskData.id ? ({ ...t, ...taskData } as Task) : t))
      );
    } else {
      // Create new
      const firstCol = columns[0];
      const sp = (taskData.storyPoints || 3) as StoryPoints;
      const hours = taskData.totalEffortHours || (sp * 3);
      const newTask: Task = {
        id: `task-${Date.now()}`,
        code: taskData.code || `DEV-${101 + tasks.length}`,
        title: taskData.title || 'Nouvelle tâche technique',
        description: taskData.description || '',
        columnId: taskData.columnId || firstCol.id,
        priority: taskData.priority || 'normal',
        category: taskData.category || 'backend',
        storyPoints: sp,
        totalEffortHours: hours,
        remainingEffortHours: hours,
        currentColumnEffortHours: hours,
        assignedMemberIds: taskData.assignedMemberIds || [],
        isBlocked: false,
        createdAtHour: currentHour,
        history: [{ columnId: taskData.columnId || firstCol.id, enteredAtHour: currentHour }],
      };
      setTasks(prev => [newTask, ...prev]);
      setMetrics(prev => ({
        ...prev,
        totalTasksCount: prev.totalTasksCount + 1,
        totalPointsCount: (prev.totalPointsCount || 0) + sp,
      }));
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setMetrics(prev => ({
      ...prev,
      totalTasksCount: Math.max(0, prev.totalTasksCount - 1),
      totalPointsCount: Math.max(0, (prev.totalPointsCount || 0) - (task?.storyPoints || 0)),
    }));
  };

  const handleMoveTaskManual = (taskId: string, direction: 'prev' | 'next') => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const colIndex = columns.findIndex(c => c.id === task.columnId);
    if (colIndex === -1) return;

    const nextIndex = direction === 'next' ? colIndex + 1 : colIndex - 1;
    if (nextIndex < 0 || nextIndex >= columns.length) return;

    const targetCol = columns[nextIndex];
    const isEnteringDone = targetCol.type === 'done' && task.columnId !== targetCol.id;

    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? {
              ...t,
              columnId: targetCol.id,
              completedAtHour: isEnteringDone ? currentHour : t.completedAtHour,
              remainingEffortHours: isEnteringDone ? 0 : t.remainingEffortHours,
              history: [...t.history, { columnId: targetCol.id, enteredAtHour: currentHour }],
            }
          : t
      )
    );

    if (isEnteringDone) {
      setMembers(prev =>
        prev.map(m =>
          task.assignedMemberIds.includes(m.id)
            ? {
                ...m,
                tasksCompleted: (m.tasksCompleted || 0) + 1,
                pointsDelivered: (m.pointsDelivered || 0) + task.storyPoints,
              }
            : m
        )
      );
      setMetrics(prev => ({
        ...prev,
        completedTasksCount: prev.completedTasksCount + 1,
        completedPointsCount: (prev.completedPointsCount || 0) + task.storyPoints,
      }));
    }
  };

  const handleDropTaskManual = (taskId: string, targetColId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.columnId === targetColId) return;

    const targetCol = columns.find(c => c.id === targetColId);
    if (!targetCol) return;

    const isEnteringDone = targetCol.type === 'done' && task.columnId !== targetCol.id;

    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? {
              ...t,
              columnId: targetCol.id,
              completedAtHour: isEnteringDone ? currentHour : t.completedAtHour,
              remainingEffortHours: isEnteringDone ? 0 : t.remainingEffortHours,
              history: [...t.history, { columnId: targetCol.id, enteredAtHour: currentHour }],
            }
          : t
      )
    );

    if (isEnteringDone) {
      setMembers(prev =>
        prev.map(m =>
          task.assignedMemberIds.includes(m.id)
            ? {
                ...m,
                tasksCompleted: (m.tasksCompleted || 0) + 1,
                pointsDelivered: (m.pointsDelivered || 0) + task.storyPoints,
              }
            : m
        )
      );
      setMetrics(prev => ({
        ...prev,
        completedTasksCount: prev.completedTasksCount + 1,
        completedPointsCount: (prev.completedPointsCount || 0) + task.storyPoints,
      }));
    }
  };

  // Column Management (CRUD directly on board)
  const handleRenameColumn = (columnId: string, newName: string) => {
    setColumns(prev => prev.map(c => (c.id === columnId ? { ...c, name: newName } : c)));
  };

  const handleAddColumn = (name: string, type: ColumnType, maxPeople: number, color: string) => {
    const newCol: Column = {
      id: `col-${Date.now()}`,
      name,
      type,
      color,
      maxPeople: type === 'active' ? maxPeople : 0,
      maxWip: 5,
      defaultEffortHours: 8,
    };
    setColumns(prev => {
      const doneIndex = prev.findIndex(c => c.type === 'done');
      if (doneIndex !== -1) {
        const next = [...prev];
        next.splice(doneIndex, 0, newCol);
        return next;
      }
      return [...prev, newCol];
    });
  };

  const handleDeleteColumn = (columnId: string) => {
    const fallbackColId = columns[0]?.id || 'backlog';
    setTasks(prev =>
      prev.map(t => (t.columnId === columnId ? { ...t, columnId: fallbackColId, remainingEffortHours: 0 } : t))
    );
    setColumns(prev => prev.filter(c => c.id !== columnId));
  };

  const handleUpdateColumnMaxPeople = (columnId: string, maxPeople: number) => {
    setColumns(prev => prev.map(c => (c.id === columnId ? { ...c, maxPeople } : c)));
  };

  // Scenarios Loading
  const handleLoadScenario = (preset: ScenarioPreset) => {
    setIsRunning(false);
    setConfig(preset.config);
    setColumns(preset.columns);
    setMembers(preset.members);
    setCurrentHour(0);
    const newTasks = generateInitialTasks(preset.config.initialTaskCount, preset.columns, preset.config.taskSizing);
    const totalPts = newTasks.reduce((s, t) => s + (t.storyPoints || 0), 0);
    setTasks(newTasks);
    setSnapshots([]);
    setMetrics({
      currentHour: 0,
      currentDay: 1,
      currentSprint: 1,
      sprintProgressPercent: 0,
      completedTasksCount: 0,
      completedPointsCount: 0,
      totalTasksCount: newTasks.length,
      totalPointsCount: totalPts,
      wipCount: 0,
      averageLeadTimeHours: 0,
      averageCycleTimeHours: 0,
      throughputPerDay: 0,
      teamUtilizationRate: 0,
      flowEfficiency: 100,
    });
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden font-sans selection:bg-zinc-800">
      {/* 1. Sleek Linear Top Header */}
      <LinearHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        appMode={appMode}
        onModeChange={setAppMode}
        metrics={metrics}
        config={config}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenScenarios={() => setIsScenariosOpen(true)}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {activeTab === 'board' && (
          <LinearKanbanBoard
            columns={columns}
            tasks={tasks}
            members={members}
            isManualMode={appMode === 'manual'}
            onSelectTask={handleOpenEditTask}
            onAddTask={handleOpenCreateTask}
            onRenameColumn={handleRenameColumn}
            onAddColumn={handleAddColumn}
            onDeleteColumn={handleDeleteColumn}
            onUpdateColumnMaxPeople={handleUpdateColumnMaxPeople}
            onMoveTask={handleMoveTaskManual}
            onDropTask={handleDropTaskManual}
            onToggleBlockTask={handleToggleBlockTask}
            onAddBatchTasks={handleAddBatchTasks}
          />
        )}

        {activeTab === 'dashboard' && (
          <AgileDashboard
            members={members}
            tasks={tasks}
            columns={columns}
            metrics={metrics}
            config={config}
            categories={categories}
            currentSprint={metrics.currentSprint}
          />
        )}

        {activeTab === 'analytics' && (
          <LinearAnalytics
            snapshots={snapshots}
            columns={columns}
            tasks={tasks}
            metrics={metrics}
            hoursPerDay={config.hoursPerDay || 8}
          />
        )}
      </main>

      {/* 3. Sleek Timeline Control Dock (Simulator Mode) */}
      {appMode === 'simulator' && (
        <SimulationDock
          isRunning={isRunning}
          speed={speed}
          metrics={metrics}
          config={config}
          onPlay={handlePlay}
          onPause={handlePause}
          onReset={handleReset}
          onStepHour={handleStepHour}
          onStepDay={handleStepDay}
          onSpeedChange={setSpeed}
          onAddUrgentTask={handleAddUrgentTask}
          onBlockRandomTask={handleBlockRandomTask}
          onAddBatchTasks={handleAddBatchTasks}
        />
      )}

      {/* Modals */}
      <TaskEditModal
        task={selectedTask}
        columns={columns}
        members={members}
        categories={categories}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        columns={columns}
        members={members}
        categories={categories}
        roles={roles}
        onSave={(c, cols, mems, reset, newCats, newRoles) => {
          setConfig(c);
          setColumns(cols);
          setMembers(mems);
          setCategories(newCats);
          setRoles(newRoles);
          if (reset) {
            handleReset();
          }
        }}
      />

      <ScenariosModal
        isOpen={isScenariosOpen}
        onClose={() => setIsScenariosOpen(false)}
        onLoadScenario={handleLoadScenario}
      />

      <SprintEndModal
        isOpen={isSprintEndOpen}
        onClose={() => setIsSprintEndOpen(false)}
        metrics={metrics}
        config={config}
        onContinue={() => {
          setIsSprintEndOpen(false);
          setIsRunning(true);
        }}
      />
    </div>
  );
};

export default App;
