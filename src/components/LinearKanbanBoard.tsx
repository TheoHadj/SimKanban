import React, { useState } from 'react';
import type { Column, ColumnType, Task, TeamMember, TaskPriority, TaskCategory } from '../types/kanban';
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  Search,
  ArrowLeft,
  ArrowRight,
  Users,
  X,
  Lock,
  Ban,
  Layers,
  GripVertical,
} from 'lucide-react';

interface LinearKanbanBoardProps {
  columns: Column[];
  tasks: Task[];
  members: TeamMember[];
  categories?: import('../types/kanban').CategoryDefinition[];
  isManualMode: boolean;
  onSelectTask: (task: Task) => void;
  onAddTask: (colId?: string) => void;
  onRenameColumn: (columnId: string, newName: string) => void;
  onAddColumn: (name: string, type: ColumnType, maxPeople: number, color: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onUpdateColumnMaxPeople: (columnId: string, maxPeople: number) => void;
  onMoveTask?: (taskId: string, direction: 'prev' | 'next') => void;
  onDropTask?: (taskId: string, targetColId: string) => void;
  onToggleBlockTask?: (taskId: string) => void;
  onAddBatchTasks?: () => void;
}

export const LinearKanbanBoard: React.FC<LinearKanbanBoardProps> = ({
  columns,
  tasks,
  members,
  categories = [],
  isManualMode,
  onSelectTask,
  onAddTask,
  onRenameColumn,
  onAddColumn,
  onDeleteColumn,
  onUpdateColumnMaxPeople,
  onMoveTask,
  onDropTask,
  onToggleBlockTask,
  onAddBatchTasks,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [memberFilter, setMemberFilter] = useState<string>('all');

  // Drag and Drop state (Manual mode)
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragOverColId, setDragOverColId] = useState<string | null>(null);

  // Inline column rename
  const [editingColId, setEditingColId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  // Quick add column
  const [isAddingCol, setIsAddingCol] = useState<boolean>(false);
  const [newColName, setNewColName] = useState<string>('');
  const [newColType, setNewColType] = useState<ColumnType>('active');
  const [newColMaxPeople, setNewColMaxPeople] = useState<number>(2);

  const memberMap = new Map<string, TeamMember>(members.map(m => [m.id, m]));
  const categoryMap = new Map<string, { name: string; color: string }>(
    categories.map(c => [c.id, { name: c.name, color: c.color }])
  );

  const saveRename = (colId: string) => {
    if (editingName.trim()) {
      onRenameColumn(colId, editingName.trim());
    }
    setEditingColId(null);
  };

  const handleCreateColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    onAddColumn(newColName.trim(), newColType, newColMaxPeople, '#71717a');
    setNewColName('');
    setIsAddingCol(false);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || t.category === categoryFilter;
    const matchesMember = memberFilter === 'all' || t.assignedMemberIds.includes(memberFilter);
    return matchesSearch && matchesCat && matchesMember;
  });

  const getPriorityDot = (p: TaskPriority) => {
    switch (p) {
      case 'urgent':
        return <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Priorité : Urgente" />;
      case 'high':
        return <span className="w-2 h-2 rounded-full bg-amber-500" title="Priorité : Haute" />;
      case 'normal':
        return <span className="w-2 h-2 rounded-full bg-blue-500" title="Priorité : Normale" />;
      case 'low':
        return <span className="w-2 h-2 rounded-full bg-zinc-600" title="Priorité : Basse" />;
    }
  };

  const getCategoryBadge = (cat?: TaskCategory) => {
    if (!cat) return null;
    const catDef = categoryMap.get(cat);
    if (catDef) {
      return (
        <span
          className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border uppercase tracking-wider"
          style={{
            backgroundColor: `${catDef.color}15`,
            borderColor: `${catDef.color}40`,
            color: catDef.color,
          }}
        >
          {catDef.name.length > 15 ? catDef.name.substring(0, 15) + '…' : catDef.name}
        </span>
      );
    }
    const styles: Record<string, string> = {
      backend: 'bg-indigo-950/60 text-indigo-300 border-indigo-800/50',
      frontend: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/50',
      database: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50',
      devops: 'bg-orange-950/60 text-orange-300 border-orange-800/50',
      security: 'bg-rose-950/60 text-rose-300 border-rose-800/50',
      qa: 'bg-purple-950/60 text-purple-300 border-purple-800/50',
      data: 'bg-blue-950/60 text-blue-300 border-blue-800/50',
      game: 'bg-purple-950/60 text-purple-300 border-purple-800/50',
      support: 'bg-amber-950/60 text-amber-300 border-amber-800/50',
    };
    return (
      <span className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border uppercase tracking-wider ${styles[cat] || 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>
        {cat}
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-zinc-950">
      {/* 1. Sub-Header: Search & Quick Filters Bar */}
      <div className="px-5 py-2.5 border-b border-zinc-800/60 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search Input */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrer tickets (DEV-101, PIX-101...)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-8 pr-2.5 py-1 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-md px-2.5 py-1 text-xs text-zinc-300 focus:outline-none focus:border-zinc-600"
          >
            <option value="all">Toutes catégories</option>
            {categories.length > 0 ? (
              categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))
            ) : (
              <>
                <option value="backend">Backend</option>
                <option value="frontend">Frontend</option>
                <option value="database">Database</option>
                <option value="devops">DevOps</option>
                <option value="security">Sécurité</option>
                <option value="qa">QA / Tests</option>
              </>
            )}
          </select>

          {/* Member Filter */}
          <select
            value={memberFilter}
            onChange={e => setMemberFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-md px-2.5 py-1 text-xs text-zinc-300 focus:outline-none focus:border-zinc-600"
          >
            <option value="all">Tous collaborateurs</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons: Add Batch & Create Ticket */}
        <div className="flex items-center gap-2">
          {onAddBatchTasks && (
            <button
              onClick={onAddBatchTasks}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60 text-xs font-semibold shadow-sm transition active:scale-95"
              title="Ajouter un lot de 10 tâches techniques réalistes au Backlog"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>+10 Tâches Backlog</span>
            </button>
          )}

          <button
            onClick={() => onAddTask()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold shadow-sm transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouveau ticket</span>
          </button>
        </div>
      </div>

      {/* 2. Horizontal Scrollable Kanban Columns Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-5">
        <div className="flex gap-3.5 h-full min-w-max items-start">
          {columns.map((column, colIdx) => {
            const colTasks = filteredTasks.filter(t => t.columnId === column.id);
            const peopleWorkingInCol = colTasks.reduce(
              (acc, t) => acc + t.assignedMemberIds.length,
              0
            );

            const hasWipLimit = typeof column.maxWip === 'number' && column.maxWip > 0 && column.maxWip < 999;
            const maxWipVal = column.maxWip ?? 0;
            const isWipSaturated = hasWipLimit && colTasks.length >= maxWipVal;
            const isWipNearLimit = hasWipLimit && !isWipSaturated && colTasks.length === maxWipVal - 1 && colTasks.length > 0;
            const isPeopleSaturated = column.maxPeople > 0 && peopleWorkingInCol >= column.maxPeople;
            const isEditing = editingColId === column.id;
            const isDragOverThisCol = dragOverColId === column.id;

            return (
              <div
                key={column.id}
                onDragOver={e => {
                  if (!isManualMode) return;
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                }}
                onDragEnter={e => {
                  if (!isManualMode) return;
                  e.preventDefault();
                  setDragOverColId(column.id);
                }}
                onDragLeave={e => {
                  if (!isManualMode) return;
                  if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                  setDragOverColId(null);
                }}
                onDrop={e => {
                  if (!isManualMode) return;
                  e.preventDefault();
                  const taskId = e.dataTransfer.getData('text/plain') || draggingTaskId;
                  if (taskId && onDropTask) {
                    onDropTask(taskId, column.id);
                  }
                  setDraggingTaskId(null);
                  setDragOverColId(null);
                }}
                className={`w-72 flex-shrink-0 flex flex-col max-h-full rounded-xl transition-all duration-150 shadow-sm ${
                  isDragOverThisCol
                    ? 'bg-zinc-850 border-2 border-indigo-500/80 ring-2 ring-indigo-500/20 shadow-lg'
                    : 'bg-zinc-900/60 border border-zinc-800/80'
                }`}
              >
                {/* Column Header */}
                <div className="p-3 border-b border-zinc-800/70 flex items-center justify-between gap-1.5 select-none">
                  {/* Left: Indicator, Title & WIP Counter */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: column.color || '#71717a' }}
                    />

                    {isEditing ? (
                      <div className="flex items-center gap-1 flex-1">
                        <input
                          type="text"
                          autoFocus
                          value={editingName}
                          onChange={e => setEditingName(e.target.value)}
                          onBlur={() => saveRename(column.id)}
                          onKeyDown={e => e.key === 'Enter' && saveRename(column.id)}
                          className="w-full bg-zinc-950 border border-zinc-700 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none"
                        />
                        <button onClick={() => saveRename(column.id)} className="p-0.5 text-zinc-300">
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="group/title flex items-center gap-1 flex-1 min-w-0">
                        <h2
                          onClick={() => {
                            setEditingColId(column.id);
                            setEditingName(column.name);
                          }}
                          className="font-semibold text-xs text-zinc-200 truncate cursor-pointer hover:text-white transition"
                          title="Cliquer pour renommer"
                        >
                          {column.name}
                        </h2>
                        <button
                          onClick={() => {
                            setEditingColId(column.id);
                            setEditingName(column.name);
                          }}
                          className="opacity-0 group-hover/title:opacity-100 p-0.5 text-zinc-500 hover:text-zinc-300"
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )}

                    {/* Clean Task Counter / Explicit WIP alert */}
                    {isWipSaturated ? (
                      <span
                        className="text-[10px] font-mono font-bold text-rose-300 bg-rose-500/20 border border-rose-500/40 px-1.5 py-0.5 rounded flex items-center gap-1 animate-pulse"
                        title={`Limite WIP atteinte : ${colTasks.length}/${column.maxWip} tickets`}
                      >
                        <span>{colTasks.length}/{column.maxWip}</span>
                        <span className="text-[9px] uppercase tracking-wider font-sans font-bold">WIP</span>
                      </span>
                    ) : isWipNearLimit ? (
                      <span
                        className="text-[10px] font-mono font-semibold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded"
                        title={`Proche de la limite WIP : ${colTasks.length}/${column.maxWip} tickets`}
                      >
                        {colTasks.length}/{column.maxWip}
                      </span>
                    ) : (
                      <span
                        className="text-[11px] font-mono font-medium text-zinc-400 bg-zinc-800/60 px-1.5 py-0.5 rounded min-w-[20px] text-center"
                        title={`${colTasks.length} ticket${colTasks.length > 1 ? 's' : ''}${hasWipLimit ? ` (limite WIP: ${column.maxWip})` : ''}`}
                      >
                        {colTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Right: Max People & Delete */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {column.type === 'active' && (
                      <div
                        className={`flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded border transition ${
                          isPeopleSaturated
                            ? 'text-amber-300 bg-amber-500/20 border-amber-500/40 font-bold'
                            : 'text-zinc-500 bg-zinc-950/60 border-zinc-800'
                        }`}
                        title={`Développeurs au travail : ${peopleWorkingInCol}/${column.maxPeople} max autorisés`}
                      >
                        <Users className="w-3 h-3 text-zinc-400" />
                        <span>{peopleWorkingInCol}/</span>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={column.maxPeople}
                          onChange={e =>
                            onUpdateColumnMaxPeople(
                              column.id,
                              Math.max(1, parseInt(e.target.value) || 1)
                            )
                          }
                          className="w-4 bg-transparent text-center text-zinc-300 focus:outline-none focus:bg-zinc-800 rounded cursor-pointer"
                          title="Modifier le nombre max de développeurs pour cette colonne"
                        />
                        <span className="text-[9px] text-zinc-600">dev</span>
                      </div>
                    )}

                    <button
                      onClick={() => onAddTask(column.id)}
                      className="p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition"
                      title="Ajouter un ticket dans cette colonne"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>

                    {columns.length > 2 && column.id !== 'backlog' && column.type !== 'done' && (
                      <button
                        onClick={() => onDeleteColumn(column.id)}
                        className="p-1 rounded text-zinc-600 hover:text-rose-400 hover:bg-zinc-800 transition"
                        title="Supprimer la colonne"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Column Cards Scroll Container */}
                <div className="p-2 flex-1 overflow-y-auto space-y-2">
                  {colTasks.length === 0 ? (
                    <div className="h-28 flex items-center justify-center text-zinc-600 text-[11px] italic border border-dashed border-zinc-800/80 rounded-lg">
                      Vide
                    </div>
                  ) : (
                    colTasks.map(task => {
                      const isUrgent = task.priority === 'urgent';
                      const progress =
                        task.currentColumnEffortHours > 0
                          ? Math.round(
                              ((task.currentColumnEffortHours - task.remainingEffortHours) /
                                task.currentColumnEffortHours) *
                                100
                            )
                          : 0;

                      const isDraggingThis = draggingTaskId === task.id;

                      return (
                        <div
                          key={task.id}
                          onClick={() => onSelectTask(task)}
                          draggable={isManualMode}
                          onDragStart={e => {
                            if (!isManualMode) return;
                            setDraggingTaskId(task.id);
                            e.dataTransfer.setData('text/plain', task.id);
                            e.dataTransfer.effectAllowed = 'move';
                          }}
                          onDragEnd={() => {
                            setDraggingTaskId(null);
                            setDragOverColId(null);
                          }}
                          className={`group/card p-3 rounded-lg border transition-all duration-150 relative bg-zinc-900 hover:bg-zinc-850 select-none ${
                            isManualMode ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                          } ${
                            isDraggingThis
                              ? 'opacity-30 scale-95 border-dashed border-zinc-500'
                              : isUrgent
                              ? 'border-rose-500/40 shadow-sm'
                              : task.isBlocked
                              ? 'border-amber-500/40'
                              : 'border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          {/* Card Top: Code, Category, Priority Dot & Manual Arrows */}
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <div className="flex items-center gap-1.5">
                              {isManualMode && (
                                <GripVertical className="w-3 h-3 text-zinc-600 group-hover/card:text-zinc-400 flex-shrink-0" />
                              )}
                              {getPriorityDot(task.priority)}
                              <span className="font-mono text-[11px] text-zinc-400 font-semibold">
                                {task.code}
                              </span>
                              {getCategoryBadge(task.category)}
                            </div>

                            {/* Manual Mode Navigation Arrows */}
                            {isManualMode && onMoveTask && (
                              <div className="flex items-center gap-0.5 opacity-0 group-hover/card:opacity-100 transition">
                                {colIdx > 0 && (
                                  <button
                                    onClick={e => {
                                      e.stopPropagation();
                                      onMoveTask(task.id, 'prev');
                                    }}
                                    className="p-0.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                                    title="Colonne précédente"
                                  >
                                    <ArrowLeft className="w-3 h-3" />
                                  </button>
                                )}
                                {colIdx < columns.length - 1 && (
                                  <button
                                    onClick={e => {
                                      e.stopPropagation();
                                      onMoveTask(task.id, 'next');
                                    }}
                                    className="p-0.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                                    title="Colonne suivante"
                                  >
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            )}

                            {/* Block Toggle icon if in simulator */}
                            {!isManualMode && onToggleBlockTask && column.type === 'active' && (
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  onToggleBlockTask(task.id);
                                }}
                                className="opacity-0 group-hover/card:opacity-100 p-0.5 text-zinc-500 hover:text-amber-400 transition"
                                title={task.isBlocked ? 'Débloquer' : 'Bloquer la tâche'}
                              >
                                {task.isBlocked ? <Lock className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                              </button>
                            )}
                          </div>

                          {/* Card Title */}
                          <p className="text-xs font-medium text-zinc-200 line-clamp-2 leading-relaxed mb-2.5">
                            {task.title}
                          </p>

                          {/* Blocked Alert Banner */}
                          {task.isBlocked && (
                            <div className="mb-2 py-0.5 px-2 rounded bg-amber-950/40 border border-amber-800/40 text-amber-300 text-[10px] flex items-center gap-1">
                              <Ban className="w-2.5 h-2.5 text-amber-400" />
                              <span>Bloqué ({task.blockedRemainingHours}h)</span>
                            </div>
                          )}

                          {/* Active Effort Progress Bar */}
                          {column.type === 'active' && (
                            <div className="mb-2.5">
                              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-zinc-400 transition-all duration-300"
                                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Card Footer: Assignees & Planning Poker Story Points */}
                          <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-500">
                            <span
                              className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700/60"
                              title="Estimation Planning Poker (Fibonacci)"
                            >
                              {task.storyPoints} pts
                            </span>

                            {/* Assigned Avatars */}
                            <div className="flex items-center -space-x-1">
                              {task.assignedMemberIds.length > 0 ? (
                                task.assignedMemberIds.map(memId => {
                                  const m = memberMap.get(memId);
                                  if (!m) return null;
                                  return (
                                    <div
                                      key={m.id}
                                      className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow ring-1 ring-zinc-950"
                                      style={{ backgroundColor: m.avatarColor }}
                                      title={m.name}
                                    >
                                      {m.initials}
                                    </div>
                                  );
                                })
                              ) : (
                                <span className="text-[10px] text-zinc-600">libre</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Drop zone placeholder when dragging over column */}
                  {isDragOverThisCol && isManualMode && (
                    <div className="h-14 rounded-lg border-2 border-dashed border-indigo-400/60 bg-indigo-500/10 flex items-center justify-center text-indigo-300 text-xs font-mono select-none animate-pulse">
                      Déposer ici (vers {column.name})
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Quick Add Column Button at the right */}
          <div className="w-64 flex-shrink-0">
            {!isAddingCol ? (
              <button
                onClick={() => setIsAddingCol(true)}
                className="w-full py-3 px-4 rounded-xl border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950 hover:bg-zinc-900/60 text-zinc-500 hover:text-zinc-300 text-xs font-medium flex items-center justify-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter une colonne</span>
              </button>
            ) : (
              <form
                onSubmit={handleCreateColumn}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 space-y-2.5 shadow-lg"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-200">
                  <span>Nouvelle colonne</span>
                  <button type="button" onClick={() => setIsAddingCol(false)}>
                    <X className="w-3.5 h-3.5 text-zinc-500" />
                  </button>
                </div>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="Nom de l'état..."
                  value={newColName}
                  onChange={e => setNewColName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-zinc-600"
                />
                <div className="flex gap-2">
                  <select
                    value={newColType}
                    onChange={e => setNewColType(e.target.value as ColumnType)}
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-1.5 py-1 text-xs text-zinc-300"
                  >
                    <option value="active">Active</option>
                    <option value="queue">Attente</option>
                  </select>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newColMaxPeople}
                    onChange={e => setNewColMaxPeople(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 bg-zinc-950 border border-zinc-800 rounded px-1 py-1 text-xs text-center text-white"
                    title="Max personnes"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-1 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold rounded transition"
                >
                  Ajouter
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
