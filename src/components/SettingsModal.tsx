import React, { useState } from 'react';
import type {
  Column,
  SimulationConfig,
  TeamMember,
  ColumnType,
  CategoryDefinition,
  RoleDefinition,
} from '../types/kanban';
import {
  X,
  Plus,
  Trash2,
  Users,
  Calendar,
  Layers,
  Save,
  Tag,
  Briefcase,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SimulationConfig;
  columns: Column[];
  members: TeamMember[];
  categories: CategoryDefinition[];
  roles: RoleDefinition[];
  onSave: (
    newConfig: SimulationConfig,
    newColumns: Column[],
    newMembers: TeamMember[],
    resetSimulation: boolean,
    newCategories: CategoryDefinition[],
    newRoles: RoleDefinition[]
  ) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  columns,
  members,
  categories,
  roles,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'sprint' | 'columns' | 'team' | 'roles_categories'>('team');

  // Local state copies
  const [localConfig, setLocalConfig] = useState<SimulationConfig>({ ...config });
  const [localColumns, setLocalColumns] = useState<Column[]>(columns.map(c => ({ ...c })));
  const [localMembers, setLocalMembers] = useState<TeamMember[]>(members.map(m => ({ ...m })));
  const [localCategories, setLocalCategories] = useState<CategoryDefinition[]>(categories.map(c => ({ ...c })));
  const [localRoles, setLocalRoles] = useState<RoleDefinition[]>(roles.map(r => ({ ...r })));
  const [resetOnSave, setResetOnSave] = useState(false);

  // New Category form state
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#6366f1');

  // New Role form state
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleCategoryId, setNewRoleCategoryId] = useState(categories[0]?.id || 'backend');

  if (!isOpen) return null;

  // 1. Handlers for Categories
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const catId = `cat-${Date.now()}`;
    const newCat: CategoryDefinition = {
      id: catId,
      name: newCatName.trim(),
      color: newCatColor,
    };
    setLocalCategories(prev => [...prev, newCat]);
    setNewCatName('');
  };

  const handleDeleteCategory = (catId: string) => {
    if (localCategories.length <= 1) {
      alert('Vous devez conserver au moins une catégorie.');
      return;
    }
    setLocalCategories(prev => prev.filter(c => c.id !== catId));
    // Re-assign orphaned roles to first available category
    const fallbackId = localCategories.find(c => c.id !== catId)?.id || 'backend';
    setLocalRoles(prev =>
      prev.map(r => (r.categoryId === catId ? { ...r, categoryId: fallbackId } : r))
    );
  };

  // 2. Handlers for Roles (tied to Categories)
  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    const roleId = `role-${Date.now()}`;
    const newRole: RoleDefinition = {
      id: roleId,
      name: newRoleName.trim(),
      categoryId: newRoleCategoryId,
    };
    setLocalRoles(prev => [...prev, newRole]);
    setNewRoleName('');
  };

  const handleDeleteRole = (roleId: string) => {
    if (localRoles.length <= 1) {
      alert('Vous devez conserver au moins un rôle de référence.');
      return;
    }
    setLocalRoles(prev => prev.filter(r => r.id !== roleId));
  };

  // 3. Handlers for Team Members
  const handleAddMember = () => {
    const id = `m-${Date.now()}`;
    const count = localMembers.length + 1;
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1'];
    const defaultRole = localRoles[0] || { name: 'Développeur Fullstack', categoryId: 'backend' };
    const newMember: TeamMember = {
      id,
      name: `Membre ${count}`,
      role: defaultRole.name,
      categoryId: defaultRole.categoryId,
      avatarColor: colors[count % colors.length],
      initials: `M${count}`,
      efficiency: 1.0,
      pointsDelivered: 0,
      tasksCompleted: 0,
    };
    setLocalMembers([...localMembers, newMember]);
    setLocalConfig({ ...localConfig, peopleCount: count });
  };

  const handleUpdateMember = (id: string, updates: Partial<TeamMember>) => {
    setLocalMembers(localMembers.map(m => (m.id === id ? { ...m, ...updates } : m)));
  };

  const handleDeleteMember = (id: string) => {
    if (localMembers.length <= 1) {
      alert("L'équipe doit comporter au moins 1 personne.");
      return;
    }
    const next = localMembers.filter(m => m.id !== id);
    setLocalMembers(next);
    setLocalConfig({ ...localConfig, peopleCount: next.length });
  };

  // 4. Handlers for Columns
  const handleAddColumn = () => {
    const id = `col-${Date.now()}`;
    const newCol: Column = {
      id,
      name: 'Nouvelle étape',
      type: 'active',
      color: '#71717a',
      maxPeople: 2,
      maxWip: 5,
      defaultEffortHours: 8,
    };
    const doneIndex = localColumns.findIndex(c => c.type === 'done');
    if (doneIndex !== -1) {
      const next = [...localColumns];
      next.splice(doneIndex, 0, newCol);
      setLocalColumns(next);
    } else {
      setLocalColumns([...localColumns, newCol]);
    }
  };

  const handleUpdateColumn = (id: string, updates: Partial<Column>) => {
    setLocalColumns(localColumns.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const handleDeleteColumn = (id: string) => {
    if (localColumns.length <= 2) {
      alert('Vous devez conserver au moins 2 colonnes.');
      return;
    }
    setLocalColumns(localColumns.filter(c => c.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localConfig, localColumns, localMembers, resetOnSave, localCategories, localRoles);
    onClose();
  };

  const getCategory = (catId?: string) => localCategories.find(c => c.id === catId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 px-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/40">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Configuration du Simulateur</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Paramétrez les critères agiles, l'équipe, les postes et leurs catégories associées
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/30 px-6 pt-2 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 ${
              activeTab === 'team'
                ? 'border-white text-white bg-zinc-900'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Équipe ({localMembers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('roles_categories')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 ${
              activeTab === 'roles_categories'
                ? 'border-white text-white bg-zinc-900'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>Postes & Catégories ({localRoles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('columns')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 ${
              activeTab === 'columns'
                ? 'border-white text-white bg-zinc-900'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Colonnes & WIP ({localColumns.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sprint')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 ${
              activeTab === 'sprint'
                ? 'border-white text-white bg-zinc-900'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Sprint & Cadence</span>
          </button>
        </div>

        {/* Tab Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: TEAM MEMBERS (ROLES ARE LINKED DROPDOWNS) */}
          {activeTab === 'team' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-zinc-200">
                    Collaborateurs de l'Équipe ({localMembers.length} développeurs)
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Chaque collaborateur occupe un poste obligatoirement rattaché à une catégorie technique
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter une personne</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {localMembers.map(member => {
                  const memberCat = getCategory(member.categoryId);
                  return (
                    <div
                      key={member.id}
                      className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3.5 flex items-start gap-3 hover:border-zinc-700 transition"
                    >
                      {/* Avatar preview & Color picker */}
                      <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-sm"
                          style={{ backgroundColor: member.avatarColor }}
                        >
                          {member.initials}
                        </div>
                        <input
                          type="color"
                          value={member.avatarColor}
                          onChange={e => handleUpdateMember(member.id, { avatarColor: e.target.value })}
                          className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                          title="Modifier la couleur du dev"
                        />
                      </div>

                      {/* Member Info & Role Dropdown */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={member.name}
                            onChange={e =>
                              handleUpdateMember(member.id, {
                                name: e.target.value,
                                initials: e.target.value.slice(0, 2).toUpperCase() || 'M',
                              })
                            }
                            className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs font-semibold text-zinc-100 flex-1 focus:outline-none focus:border-zinc-600"
                            placeholder="Nom du dev"
                          />
                        </div>

                        {/* Dropdown for Role (strictly linked to Category) */}
                        <div className="space-y-1">
                          <label className="text-[10px] text-zinc-500 font-mono flex items-center justify-between">
                            <span>Poste & Spécialité :</span>
                            {memberCat && (
                              <span
                                className="px-1.5 py-0.2 rounded text-[9px] font-bold border"
                                style={{
                                  backgroundColor: `${memberCat.color}20`,
                                  borderColor: `${memberCat.color}50`,
                                  color: memberCat.color,
                                }}
                              >
                                {memberCat.name}
                              </span>
                            )}
                          </label>
                          <select
                            value={member.role}
                            onChange={e => {
                              const selectedRoleTitle = e.target.value;
                              const matchingRole = localRoles.find(r => r.name === selectedRoleTitle);
                              handleUpdateMember(member.id, {
                                role: selectedRoleTitle,
                                categoryId: matchingRole?.categoryId,
                              });
                            }}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:border-zinc-600"
                          >
                            {localRoles.map(r => {
                              const cat = getCategory(r.categoryId);
                              return (
                                <option key={r.id} value={r.name}>
                                  {r.name} ({cat?.name || 'Général'})
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDeleteMember(member.id)}
                        disabled={localMembers.length <= 1}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 disabled:opacity-20 disabled:cursor-not-allowed transition"
                        title="Retirer ce collaborateur"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: ROLES & CATEGORIES MANAGEMENT */}
          {activeTab === 'roles_categories' && (
            <div className="space-y-6">
              {/* Section A: Categories List & Add */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      <span>Catégories de Tâches & Domaines ({localCategories.length})</span>
                    </h3>
                    <p className="text-[11px] text-zinc-500">
                      Chaque tâche technique et chaque poste sont classés dans l'une de ces catégories
                    </p>
                  </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {localCategories.map(cat => (
                    <div
                      key={cat.id}
                      className="bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-xs font-semibold text-zinc-200 truncate">{cat.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id)}
                        disabled={localCategories.length <= 1}
                        className="text-zinc-600 hover:text-rose-400 p-1 disabled:opacity-20 transition"
                        title="Supprimer la catégorie"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Category Form */}
                <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-2">
                  <input
                    type="text"
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    placeholder="Nouvelle catégorie (ex: Mobile, IA, Analytics...)"
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                  />
                  <input
                    type="color"
                    value={newCatColor}
                    onChange={e => setNewCatColor(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                    title="Couleur de la catégorie"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={!newCatName.trim()}
                    className="flex items-center gap-1 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-xs font-semibold text-zinc-200 rounded transition"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>

              {/* Section B: Roles List & Add (Tied to Categories) */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                      <span>Postes & Rôles des Développeurs ({localRoles.length})</span>
                    </h3>
                    <p className="text-[11px] text-zinc-500">
                      Chaque poste est obligatoirement rattaché à une catégorie technique de référence
                    </p>
                  </div>
                </div>

                {/* Roles Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {localRoles.map(role => {
                    const cat = getCategory(role.categoryId);
                    return (
                      <div
                        key={role.id}
                        className="bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-xs font-medium text-zinc-200 truncate">{role.name}</span>
                          {cat && (
                            <span
                              className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border flex-shrink-0"
                              style={{
                                backgroundColor: `${cat.color}15`,
                                borderColor: `${cat.color}40`,
                                color: cat.color,
                              }}
                            >
                              {cat.name}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteRole(role.id)}
                          disabled={localRoles.length <= 1}
                          className="text-zinc-600 hover:text-rose-400 p-1 disabled:opacity-20 transition"
                          title="Supprimer ce poste"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Add Role Form (tied to Category dropdown) */}
                <div className="pt-2 border-t border-zinc-800/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={newRoleName}
                    onChange={e => setNewRoleName(e.target.value)}
                    placeholder="Intitulé du poste (ex: Lead Dev Mobile, Développeur Rust...)"
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                  />
                  <div className="flex items-center gap-2">
                    <select
                      value={newRoleCategoryId}
                      onChange={e => setNewRoleCategoryId(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:border-zinc-600"
                    >
                      {localCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          Catégorie: {cat.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAddRole}
                      disabled={!newRoleName.trim()}
                      className="flex items-center gap-1 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-xs font-semibold text-zinc-200 rounded transition whitespace-nowrap"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Ajouter poste</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COLUMNS & WIP LIMITS */}
          {activeTab === 'columns' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-zinc-200">
                    Étapes du flux Kanban ({localColumns.length} colonnes)
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Définissez les états des tâches, les limites WIP de personnes et de cartes
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddColumn}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter une colonne</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {localColumns.map((col, index) => (
                  <div
                    key={col.id}
                    className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-[220px]">
                      <span className="font-mono text-zinc-600 text-xs w-4">{index + 1}.</span>
                      <input
                        type="color"
                        value={col.color}
                        onChange={e => handleUpdateColumn(col.id, { color: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={col.name}
                        onChange={e => handleUpdateColumn(col.id, { name: e.target.value })}
                        className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs font-semibold text-zinc-200 flex-1 focus:outline-none focus:border-zinc-600"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={col.type}
                        onChange={e => handleUpdateColumn(col.id, { type: e.target.value as ColumnType })}
                        className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-300"
                      >
                        <option value="queue">File d'attente</option>
                        <option value="active">Active (Travail)</option>
                        <option value="done">Terminée (Done)</option>
                      </select>

                      {col.type === 'active' && (
                        <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                          <span>Max devs:</span>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={col.maxPeople}
                            onChange={e =>
                              handleUpdateColumn(col.id, { maxPeople: Math.max(1, parseInt(e.target.value) || 1) })
                            }
                            className="w-12 bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-center text-zinc-200"
                          />
                        </div>
                      )}

                      {col.type !== 'done' && (
                        <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                          <span>WIP cartes:</span>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={col.maxWip && col.maxWip < 999 ? col.maxWip : ''}
                            placeholder="∞"
                            onChange={e =>
                              handleUpdateColumn(col.id, {
                                maxWip: e.target.value ? parseInt(e.target.value) : 999,
                              })
                            }
                            className="w-12 bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-center text-zinc-200 placeholder-zinc-600"
                          />
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteColumn(col.id)}
                        disabled={localColumns.length <= 2}
                        className="text-zinc-600 hover:text-rose-400 p-1.5 disabled:opacity-20 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SPRINT & CADENCE */}
          {activeTab === 'sprint' && (
            <div className="space-y-4">
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-200">Durée d'un sprint (en jours ouvrés)</span>
                  <span className="text-xs font-mono font-bold text-zinc-100 bg-zinc-800 px-2 py-0.5 rounded">
                    {localConfig.sprintDurationDays} jours ({localConfig.sprintDurationDays * (localConfig.hoursPerDay || 8)}h)
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="30"
                  step="1"
                  value={localConfig.sprintDurationDays}
                  onChange={e =>
                    setLocalConfig({ ...localConfig, sprintDurationDays: parseInt(e.target.value) || 10 })
                  }
                  className="w-full accent-zinc-100 cursor-pointer"
                />
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-200">Nombre de tâches initiales</span>
                  <span className="text-xs font-mono font-bold text-zinc-100 bg-zinc-800 px-2 py-0.5 rounded">
                    {localConfig.initialTaskCount} tickets
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={localConfig.initialTaskCount}
                  onChange={e =>
                    setLocalConfig({ ...localConfig, initialTaskCount: parseInt(e.target.value) || 45 })
                  }
                  className="w-full accent-zinc-100 cursor-pointer"
                />
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-200">Stratégie d'arrivée des tâches</span>
                  <span className="text-xs font-mono text-zinc-400">Flux Kanban</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setLocalConfig({ ...localConfig, arrivalStrategy: 'continuous' })}
                    className={`p-3 rounded-xl border text-left transition ${
                      localConfig.arrivalStrategy === 'continuous'
                        ? 'border-zinc-400 bg-zinc-800/80 text-white'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Alimentation Continue (Recommandé)</span>
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1">
                      Le backlog se réapprovisionne automatiquement au fil de l'eau
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLocalConfig({ ...localConfig, arrivalStrategy: 'batch' })}
                    className={`p-3 rounded-xl border text-left transition ${
                      localConfig.arrivalStrategy === 'batch'
                        ? 'border-zinc-400 bg-zinc-800/80 text-white'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="text-xs font-bold">Lot fixe (Sprint Batch)</div>
                    <div className="text-[11px] text-zinc-500 mt-1">
                      Les tâches sont engagées au démarrage, pas de nouvel arrivage auto
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reset simulation checkbox */}
          <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-2.5">
            <input
              type="checkbox"
              id="resetOnSave"
              checked={resetOnSave}
              onChange={e => setResetOnSave(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-700 text-zinc-100 cursor-pointer"
            />
            <label htmlFor="resetOnSave" className="text-xs text-zinc-300 cursor-pointer select-none">
              Réinitialiser la simulation à l'heure zéro avec cette nouvelle configuration
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold shadow-sm transition active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Enregistrer les paramètres</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
