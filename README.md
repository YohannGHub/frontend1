# 🛡️ Toolbox Pentest - Frontend

## 🎯 Présentation

Ce dépôt correspond à l'interface frontend de la Toolbox Pentest, une plateforme d’audit de sécurité offensive conçue pour automatiser les tests d'intrusion, l’analyse de vulnérabilités et l’exploitation.  
Elle s’inscrit dans le cadre du **projet fil rouge de Mastère Cybersécurité**, visant à créer une solution modulaire, professionnelle et opérationnelle.

Le frontend est développé en **React + TypeScript** avec une interface responsive et moderne basée sur **Tailwind CSS**. Il communique avec une API Flask sécurisée via des jetons JWT et permet d’interagir avec divers outils (Nmap, Metasploit, Hydra, ZAP...).

---

## 🖼️ Aperçu des fonctionnalités

- 🔐 Authentification sécurisée (JWT)
- 📊 Tableau de bord avec activité récente et statistiques
- 📡 Lancement de modules d’analyse : Nmap, OpenVAS, Hydra, etc.
- 📁 Upload et analyse forensique de fichiers (ClamAV, strings, readelf…)
- ⚔️ Déclenchement d’exploits Metasploit ou Hydra
- 📑 Génération et téléchargement de rapports (PDF, HTML, TXT et JSON)
- 🔌 Système de plugins dynamiques via interface
- 🎨 UI réactive et esthétique (style dashboard cybersécurité)

---

## ⚙️ Dépendances nécessaires

Voici les logiciels à avoir **sur Kali Linux** avant de lancer ce frontend :

### 🛠️ Prérequis système

- Node.js ≥ 18  
- npm ≥ 9  
- Un terminal avec `bash`, `git`, et `curl`
- Serveur backend opérationnel : [Toolbox Backend (Flask)]((https://github.com/Selsabil92/ToolBoxBackend.git))

### 🧱 Installation des dépendances

```bash
# 1. Installation des paquets Node.js
sudo apt update
sudo apt install -y nodejs npm

# 2. (Optionnel) Mise à jour des versions via n
sudo npm install -g n
sudo n latest

# 3. Vérification des versions
node -v
npm -v
```

---

## 🚀 Installation et Lancement

```bash
# 1. Cloner le dépôt
git clone https://github.com/YohannGHub/Frontend1.git
cd Frontend

# 2. Installer les dépendances
npm install

# 3. Créer un fichier .env pour configurer l'URL de l'API (exemple)
touch .env
echo "REACT_APP_API_URL=http://localhost:5000" >> .env

# 4. Lancer l'application
npm run dev
```

Par défaut, le frontend tourne sur :  
👉 http://localhost:5173

---

## 🖌️ Structure du projet

```
frontend/
├── public/              # Fichiers statiques
├── src/
│   ├── assets/          # Images, icônes, SVG
│   ├── components/      # Composants réutilisables (cards, forms…)
│   ├── pages/           # Pages principales (Login, Toolbox, Exploits…)
│   ├── utils/           # Fonctions utilitaires (authFetch, formateurs…)
│   ├── App.tsx          # Composant racine
│   └── main.tsx         # Point d’entrée
├── tailwind.config.js   # Configuration Tailwind CSS
├── App.css              # Thème global (dashboard violet)
└── vite.config.ts       # Configuration Vite (serveur dev)
```

---

## 🔒 Sécurité

- Le frontend interagit uniquement avec des routes sécurisées via **token JWT**.
- Les tokens sont stockés dans `localStorage` avec gestion automatique des erreurs et expirations.
- Le frontend vérifie à chaque requête la présence du token (`authFetch.ts`).

---

## 📦 Modules implémentés (côté frontend)

| Module        | Page associée         | Description                                               |
|---------------|-----------------------|-----------------------------------------------------------|
| Nmap          | Enumeration.tsx       | Scan réseau + services avec timer et affichage stylisé    |
| Nmap NSE      | Vulnerabilities.tsx   | Analyse vulnérabilités avec scoring                       |
| Metasploit    | Exploits.tsx          | Exploits CVE automatiques via backend                     |
| Hydra         | Exploits.tsx          | Bruteforce SSH/FTP avec sélection de ports/services       |
| ClamAV        | Forensic.tsx          | Scan de fichiers uploadés contre malwares connus          |
| Plugins       | Plugins.tsx           | Lancement de scripts SSH personnalisés depuis l’interface |
| Reporting     | Reports.tsx           | Accès aux rapports enregistrés + export multi-format      |

---

## 📄 Scripts importants

- `authFetch.ts` : gestion centralisée des appels API avec authentification
- `Exploits.tsx` : déclenchement réel de modules Metasploit/Hydra avec résultats dynamiques
- `Dashboard.tsx` : page de lancement des modules avec compteur animé
- `Reports.tsx` : rendu de rapport HTML/TXT/PDF + bouton d’export

---

## 🎨 Design UI/UX

- Design inspiré des **dashboards cybersécurité** :
  - Couleurs dominantes : rouge / blanc
  - Grilles adaptatives
  - Cartes interactives (hover, clic)
  - Animation de progression sur les scans
  - Boutons d’actions stylisés
- Technologies :
  - `react-icons`, `lucide-react` pour les icônes
  - `react-toastify` pour les notifications
  - `Tailwind CSS` pour la rapidité de développement

---

## 🧪 Tests

Les tests frontend sont manuels (MVP) et reposent sur :

- 📱 Vérification de l’affichage dynamique (toasts, timers, rendu conditionnel)
- 🔐 Test de sécurité : non accès aux modules si token manquant
- 🔄 Test de robustesse : frontend gère les erreurs 500/422 du backend avec messages clairs

---

## 💡 Bonnes pratiques

- Chaque appel API est centralisé et sécurisé
- Le code est typé via TypeScript
- Composants découpés et réutilisables
- Architecture modulaire compatible avec ajout de nouveaux outils

---

## 🧬 Auteur

Projet réalisé dans le cadre du **Mastère Cybersécurité ESI SUP DE VINCI - 2024/2025**  
🔗 [GitHub Backend](https://github.com/Selsabil92/ToolBoxBackend.git)  
🔗 [GitHub Frontend](https://github.com/YohannGHub/Frontend1.git)

Développé par un élève passionné de cybersécurité offensive, avec une attention particulière portée à l’automatisation, à l’ergonomie et à la sécurité.

---

## 🛠️ Prochaine évolution

- Ajout d’une **console interactive dans la Toolbox** pour taper des commandes
- Support multi-rôles (admin / analyste)
- Intégration d’alertes IDS/Suricata
- Visualisation graphique en temps réel (charts)

---
