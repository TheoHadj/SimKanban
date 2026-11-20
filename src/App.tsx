import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Column, ColumnType, SimulationConfig, SimulationMetrics, Task, TeamMember, MetricSnapshot, ScenarioPreset, StoryPoints, CategoryDefinition, RoleDefinition } from './types/kanban';
import { PROJECT_PIXELS_DRAGONS, AVAILABLE_PROJECTS } from './utils/projects';
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
import { SprintRetrospectiveView } from './components/SprintRetrospectiveView';
import { LeanPresentationView } from './components/LeanPresentationView';
import { HomeProjectsView } from './components/HomeProjectsView';

export const App: React.FC = () => {
  // Active Project (default to Pixels & Dragons case study)
  const [currentProjectId, setCurrentProjectId] = useState<string>('pixels-dragons');
  const currentProject = AVAILABLE_PROJECTS.find(p => p.id === currentProjectId) || PROJECT_PIXELS_DRAGONS;

  // Navigation & Mode
  const [activeTab, setActiveTab] = useState<ActiveTab>('board');
  const [appMode, setAppMode] = useState<AppMode>('simulator');

  // Core Kanban Configuration (The 7 Criteria) initialized with Pixels & Dragons
  const [config, setConfig] = useState<SimulationConfig>(PROJECT_PIXELS_DRAGONS.config);
  const [columns, setColumns] = useState<Column[]>(PROJECT_PIXELS_DRAGONS.columns);
  const [members, setMembers] = useState<TeamMember[]>(PROJECT_PIXELS_DRAGONS.members);
  const [categories, setCategories] = useState<CategoryDefinition[]>(PROJECT_PIXELS_DRAGONS.categories);
  const [roles, setRoles] = useState<RoleDefinition[]>(PROJECT_PIXELS_DRAGONS.roles);

  // Simulation execution state
  const [tasks, setTasks] = useState<Task[]>(() =>
    generateInitialTasks(
      PROJECT_PIXELS_DRAGONS.config.initialTaskCount,
      PROJECT_PIXELS_DRAGONS.columns,
      PROJECT_PIXELS_DRAGONS.config.taskSizing,
      PROJECT_PIXELS_DRAGONS.taskCatalog,
      'PIX'
    )
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
      totalTasksCount: PROJECT_PIXELS_DRAGONS.config.initialTaskCount,
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

  const handleSelectProject = (projectId: string) => {
    const p = AVAILABLE_PROJECTS.find(proj => proj.id === projectId) || PROJECT_PIXELS_DRAGONS;
    setCurrentProjectId(p.id);
    setConfig(p.config);
    setColumns(p.columns);
    setMembers(p.members);
    setCategories(p.categories);
    setRoles(p.roles);

    setIsRunning(false);
    setCurrentHour(0);
    const codePrefix = p.id === 'pixels-dragons' ? 'PIX' : 'DEV';
    const newTasks = generateInitialTasks(
      p.config.initialTaskCount,
      p.columns,
      p.config.taskSizing,
      p.taskCatalog,
      codePrefix
    );
    const totalPts = newTasks.reduce((s, t) => s + (t.storyPoints || 0), 0);
    setTasks(newTasks);
    setMembers(p.members.map(m => ({ ...m, currentTaskId: undefined, hoursContributed: 0, tasksCompleted: 0, pointsDelivered: 0 })));
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
    setActiveTab('board');
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentHour(0);
    const codePrefix = currentProject.id === 'pixels-dragons' ? 'PIX' : 'DEV';
    const newTasks = generateInitialTasks(
      config.initialTaskCount,
      columns,
      config.taskSizing,
      currentProject.taskCatalog,
      codePrefix
    );
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
    const codePrefix = currentProject.id === 'pixels-dragons' ? 'PIX' : 'DEV';
    const newTasks = generateBatchTasks(
      10,
      tasks.length,
      columns,
      currentHour,
      currentProject.taskCatalog,
      codePrefix
    );
    const addedPoints = newTasks.reduce((s, t) => s + (t.storyPoints || 0), 0);
    setTasks(prev => [...prev, ...newTasks]);
    setMetrics(prev => ({
      ...prev,
      totalTasksCount: prev.totalTasksCount + newTasks.length,
      totalPointsCount: prev.totalPointsCount + addedPoints,
    }));
  }, [tasks.length, columns, currentHour, currentProject]);

  const handleAddKaizenTaskToBoard = (title: string, category: string, impact: string) => {
    const codePrefix = currentProject.id === 'pixels-dragons' ? 'PIX' : 'DEV';
    const firstCol = columns[0];
    const activeCols = columns.filter(c => c.type === 'active');
    const baseEffort = 3 * 2; // 3 Story points
    let totalEffort = 0;
    activeCols.forEach(() => {
      totalEffort += Math.round(baseEffort / Math.max(1, activeCols.length));
    });

    const newTask: Task = {
      id: `task-${Date.now()}`,
      code: `${codePrefix}-${100 + tasks.length + 1}`,
      title: `[Kaizen] ${title}`,
      description: `Action d'amélioration continue : ${impact}`,
      category: category || currentProject.categories[0]?.id || 'data',
      columnId: firstCol.id,
      priority: 'high',
      storyPoints: 3,
      totalEffortHours: Math.max(2, totalEffort),
      remainingEffortHours: 0,
      currentColumnEffortHours: 0,
      assignedMemberIds: [],
      isBlocked: false,
      createdAtHour: currentHour,
      history: [{ columnId: firstCol.id, enteredAtHour: currentHour }],
    };

    setTasks(prev => [newTask, ...prev]);
    setMetrics(prev => ({
      ...prev,
      totalTasksCount: prev.totalTasksCount + 1,
      totalPointsCount: prev.totalPointsCount + 3,
    }));
    setActiveTab('board');
  };

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
        currentProject={currentProject}
        onSelectProject={handleSelectProject}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenScenarios={() => setIsScenariosOpen(true)}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {activeTab === 'home' && (
          <HomeProjectsView
            currentProjectId={currentProjectId}
            onSelectProject={handleSelectProject}
            onOpenPresentation={() => setActiveTab('presentation')}
          />
        )}

        {activeTab === 'board' && (
          <LinearKanbanBoard
            columns={columns}
            tasks={tasks}
            members={members}
            categories={categories}
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

        {activeTab === 'retro' && (
          <SprintRetrospectiveView
            currentSprint={metrics.currentSprint}
            metrics={metrics}
            currentProject={currentProject}
            onAddKaizenTaskToBoard={handleAddKaizenTaskToBoard}
          />
        )}

        {activeTab === 'presentation' && (
          <LeanPresentationView />
        )}
      </main>

      {/* 3. Sleek Timeline Control Dock (Simulator Mode, visible on board, dashboard & analytics) */}
      {appMode === 'simulator' && (activeTab === 'board' || activeTab === 'dashboard' || activeTab === 'analytics') && (
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
        currentProjectId={currentProjectId}
        onOpenRetro={() => {
          setIsSprintEndOpen(false);
          setActiveTab('retro');
        }}
        onContinue={() => {
          setIsSprintEndOpen(false);
          setIsRunning(true);
        }}
      />
    </div>
  );
};

export default App;
