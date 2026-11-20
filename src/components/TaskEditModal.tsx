import React, { useState, useEffect } from 'react';
import type { Task, Column, TeamMember, TaskPriority, TaskCategory, StoryPoints, CategoryDefinition } from '../types/kanban';
import { X, Trash2, Check, Sparkles } from 'lucide-react';

interface TaskEditModalProps {
  task: Partial<Task> | null;
  columns: Column[];
  members: TeamMember[];
  categories?: CategoryDefinition[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => void;
  onDelete?: (taskId: string) => void;
}

const FIBONACCI_POINTS: StoryPoints[] = [1, 2, 3, 5, 8, 13];

export const TaskEditModal: React.FC<TaskEditModalProps> = ({
  task,
  columns,
  members,
  categories,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('normal');
  const [category, setCategory] = useState<TaskCategory>('backend');
  const [storyPoints, setStoryPoints] = useState<StoryPoints>(5);
  const [assignedMemberIds, setAssignedMemberIds] = useState<string[]>([]);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setColumnId(task.columnId || columns[0]?.id || 'backlog');
      setPriority(task.priority || 'normal');
      setCategory(task.category || 'backend');
      setStoryPoints(task.storyPoints || 5);
      setAssignedMemberIds(task.assignedMemberIds ? [...task.assignedMemberIds] : []);
    }
  }, [task, columns]);

  if (!isOpen || !task) return null;

  const isEditing = !!task.id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      ...task,
      title: title.trim(),
      description: description.trim(),
      columnId,
      priority,
      category,
      storyPoints,
      totalEffortHours: storyPoints * 2,
      assignedMemberIds,
    });
    onClose();
  };

  const toggleMember = (memberId: string) => {
    setAssignedMemberIds(prev =>
      prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
            <span>{isEditing ? task.code : 'NOUVEAU TICKET'}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded text-zinc-500 hover:text-zinc-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
              Titre du ticket *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="ex: Implémentation du rate limiting Redis"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
              Détails techniques
            </label>
            <textarea
              rows={3}
              placeholder="Spécifications, contexte, critères d'acceptation..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 resize-none"
            />
          </div>

          {/* Row: Column, Category, Priority */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                Colonne
              </label>
              <select
                value={columnId}
                onChange={e => setColumnId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600"
              >
                {columns.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                Catégorie
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600"
              >
                {(categories && categories.length > 0
                  ? categories
                  : [
                      { id: 'backend', name: 'Backend' },
                      { id: 'frontend', name: 'Frontend' },
                      { id: 'database', name: 'Database' },
                      { id: 'devops', name: 'DevOps' },
                      { id: 'security', name: 'Sécurité' },
                      { id: 'qa', name: 'QA / Tests' },
                    ]
                ).map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                Priorité
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600"
              >
                <option value="low">Basse</option>
                <option value="normal">Normale</option>
                <option value="high">Haute</option>
                <option value="urgent">🔴 URGENTE</option>
              </select>
            </div>
          </div>

          {/* Planning Poker Fibonacci Story Points Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Planning Poker (Suite de Fibonacci) *</span>
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">Max 13 pts par tâche</span>
            </div>
            
            <div className="grid grid-cols-6 gap-2">
              {FIBONACCI_POINTS.map(points => {
                const isSelected = storyPoints === points;
                return (
                  <button
                    key={points}
                    type="button"
                    onClick={() => setStoryPoints(points)}
                    className={`py-2 rounded-lg font-mono font-bold text-xs border transition flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? 'bg-zinc-100 text-zinc-950 border-white shadow'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-sm">{points}</span>
                    <span className="text-[9px] font-normal uppercase opacity-75">pts</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assignees */}
          <div>
            <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
              Développeurs assignés
            </label>
            <div className="flex flex-wrap gap-1.5">
              {members.map(member => {
                const isSelected = assignedMemberIds.includes(member.id);
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => toggleMember(member.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition ${
                      isSelected
                        ? 'bg-zinc-800 border-zinc-600 text-white shadow-sm'
                        : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow"
                      style={{ backgroundColor: member.avatarColor }}
                    >
                      {member.initials}
                    </div>
                    <span>{member.name}</span>
                    {isSelected && <Check className="w-3 h-3 text-zinc-300 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
            {isEditing && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(task.id!);
                  onClose();
                }}
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition shadow"
              >
                {isEditing ? 'Enregistrer' : 'Créer le ticket'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
