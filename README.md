# 🚀 Simulateur Kanban Pro & Plateforme Agile

Une plateforme complète et modulaire comprenant **deux simulateurs interactifs**, un **véritable tableau Kanban manuel** avec gestion CRUD complète, et un **tableau de bord de vélocité individuelle**.

---

## 🧭 Les 4 Vues Disponibles

La barre de navigation supérieure vous permet de basculer instantanément entre les 4 vues :

### 1. 🎯 Simulateur Standard (`/`) — *Conforme à la consigne*
Le simulateur officiel respectant scrupuleusement les 7 critères du cours :
* **Choix du nombre de personnes** (équipe modulable avec rôles et avatars)
* **Durée d'un sprint** (de 2 à 30 jours, horloge sprint/jour/heure, rétrospective confettis)
* **Choix du nombre de tâches** (backlog ajustable de 5 à 60 tâches)
* **Choix des états des tâches** (colonnes éditables : ajout, renommage direct, suppression)
* **Nombre maximum de personnes dans une colonne** (WIP limit & alertes de congestion)
* **Avancement temporel** (pas-à-pas +1h, +1j, vitesse de x0.5 à x10)
* **Boutons Play, Pause, Stop** (contrôles interactifs)
* **Graphiques Chart.js** : CFD (Diagramme de flux cumulé), Scatterplot Lead Time, Loi de Little.

---

### 2. 🚀 Simulateur Avancé (`/beta` ou `/newfeatures`) — *Laboratoire & Serious Game*
Un simulateur expert axé sur la qualité technique et l'ingénierie logicielle (sans prix) :
* **Boucles de rejet & Bugs en QA (Rework)** : 18% de probabilité qu'une tâche testée révèle un défaut et reparte en *Développement* avec un badge *"Bug retourné"*.
* **Binômage (Swarming / Pairing)** : Possibilité de faire travailler 2 personnes sur la même tâche pour accélérer le traitement (vitesse x1.8).
* **Indicateurs de qualité logicielle** : Suivi des régressions, taux de rejet et cadence de livraison.

---

### 3. 📋 Vrai Tableau Kanban Manuel (`/kanban`) — *CRUD Utilisateurs & Tâches*
Un véritable tableau Kanban de gestion opérationnelle (sans moteur temporel automatique) :
* **Gestion complète des utilisateurs (Users CRUD) :**
  * ➕ Ajouter des utilisateurs (Nom, rôle, couleur d'avatar personnalisée)
  * ✏️ Renommer les utilisateurs et modifier leurs rôles
  * 🗑️ Supprimer des utilisateurs (avec désassignation automatique de leurs tâches)
* **Gestion complète des tâches (Tasks CRUD) :**
  * ➕ Créer une tâche de dev (titre, description, colonne, priorité basse/normale/haute/urgente, assignations)
  * ✏️ Renommer et modifier n'importe quelle tâche en 1 clic
  * ➡️ Déplacer les tâches d'une colonne à l'autre via les flèches rapides `←` et `→`
  * 🗑️ Supprimer les tâches
* **Gestion des colonnes :**
  * ➕ Ajouter une colonne
  * ✏️ Renommer n'importe quelle colonne en 1 clic sur son titre
  * 🗑️ Supprimer des colonnes
* **Filtres et recherche :**
  * Recherche textuelle instantanée dans les titres et descriptions
  * Filtre par membre assigné
  * Filtre par niveau de priorité
* **Sauvegarde automatique (LocalStorage) :** Vos données restent enregistrées même après fermeture du navigateur.

---

### 4. ⚡ Dashboard de Vélocité Équipe (`/velocity`) — *Indicateurs par Développeur*
Un tableau de bord complet dédié à la vélocité et à la productivité individuelle :
* **KPI Globaux** : Vélocité totale de l'équipe (heures d'effort abattues), tickets finalisés, taux d'activité moyen et Top Performer du sprint.
* **Graphique comparatif (Chart.js Bar Chart)** : Comparaison horizontale des heures de dev livrées par chaque personne.
* **Répartition de l'effort (Chart.js Doughnut)** : Part contributive de chaque développeur dans l'effort global.
* **Fiches individuelles détaillées** : Jauge d'atteinte de vélocité, heures livrées, tickets clos, taux d'activité et tâche actuellement en cours.
* **Sélecteur de Sprint** : Comparaison entre Sprint 1, Sprint 2, Sprint 3.

---

## 🛠️ Démarrage

```bash
# Lancer le serveur de développement
npm run dev

# Compiler pour la production
npm run build
```

URL locale : **http://localhost:5173/**
