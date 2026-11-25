# 🌾 Subvention Agricole

**Application web de gestion et de suivi des demandes de subventions agricoles**, développée avec Laravel et Angular.

## 📌 Présentation du projet

Subvention Agricole est une application web qui vise à digitaliser et simplifier le processus de gestion des demandes de subventions agricoles.

Elle met en relation les agriculteurs et les agents administratifs à travers une plateforme centralisée permettant le dépôt des dossiers, la vérification des pièces justificatives, le suivi des demandes et la communication entre les utilisateurs.

## 🎯 Objectifs

- Dématérialiser les procédures de demande de subvention.
- Faciliter le dépôt et le suivi des dossiers agricoles.
- Améliorer le traitement et la vérification des demandes.
- Assurer une communication directe entre les agriculteurs et les agents.
- Garantir une meilleure traçabilité des opérations.

## ✨ Fonctionnalités principales

### 👨‍🌾 Espace Agriculteur

- Création de compte et authentification.
- Dépôt d'une demande de subvention.
- Ajout de pièces justificatives.
- Modification du dossier avant sa validation.
- Consultation de l'état d'avancement des demandes.
- Consultation et téléchargement des documents.
- Remplacement des fichiers refusés par de nouveaux documents.
- Réception de notifications.
- Chat avec les agents administratifs.

### 👨‍💼 Espace Agent

- Consultation des demandes de subvention.
- Vérification des dossiers et des pièces justificatives.
- Acceptation ou refus des documents.
- Demande de compléments d'information.
- Acceptation ou refus des demandes.
- Consultation de l'historique des traitements.
- Communication avec les agriculteurs via un système de chat.

### 🔐 Espace Administrateur

- Gestion des utilisateurs.
- Gestion des types de subventions.
- Gestion des paramètres de l'application.
- Consultation des statistiques.

## 🛠️ Technologies utilisées

| Partie | Technologies |
|---|---|
| Backend | Laravel, PHP |
| Frontend | Angular, TypeScript |
| Base de données | À préciser |
| Gestion de versions | Git, GitHub |

## 📂 Structure du projet

```text
Subvention-Agricole/
│
├── backend/          # Application Laravel
│
├── frontend/         # Application Angular
│
└── README.md
```

*Les noms des dossiers sont à adapter à l'organisation réelle du projet.*

## ⚙️ Installation et configuration

### 1. Cloner le repository

```bash
git clone https://github.com/USERNAME/subvention-agricole.git
cd subvention-agricole
```

### 2. Configuration du Backend (Laravel)

```bash
cd backend
composer install
```

Créer le fichier `.env` à partir de `.env.example` :

```bash
cp .env.example .env
```

Configurer les informations de connexion à la base de données dans `.env`, puis exécuter :

```bash
php artisan key:generate
php artisan migrate
php artisan serve
```

### 3. Configuration du Frontend (Angular)

Dans un autre terminal :

```bash
cd frontend
npm install
ng serve
```

L'application Angular sera accessible à l'adresse :

`http://localhost:4200`

Le backend Laravel sera accessible à l'adresse :

`http://127.0.0.1:8000`

## 🔒 Sécurité

Les fichiers de configuration contenant des informations sensibles, notamment `.env`, ne doivent pas être publiés sur GitHub.

## 👩‍💻 Auteur

Projet réalisé dans le cadre d'un stage.

**Technologies principales : Laravel & Angular**

