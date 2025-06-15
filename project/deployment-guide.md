# Guide de Déploiement Frontend avec Backend Existant

## 📋 Prérequis

### 1. Préparation de la VM
```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Node.js et npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier les versions
node --version
npm --version

# Installer Git (si pas déjà installé)
sudo apt install git -y
```

### 2. Transférer le Projet Frontend
```bash
# Option 1: Créer le dossier et transférer les fichiers
mkdir pentest-toolbox-frontend
cd pentest-toolbox-frontend

# Option 2: Transférer via SCP depuis votre machine locale
scp -r ./frontend-project user@vm-ip:/home/user/pentest-toolbox-frontend/

# Option 3: Utiliser Git si configuré
git clone <votre-repo-url>
```

## 🔗 Configuration pour votre Backend Existant

### 1. Vérification de votre Backend
Assurez-vous que votre backend a les endpoints suivants :

```python
# Votre backend doit avoir ces routes
@app.route('/api/auth/login', methods=['POST'])
def login():
    # Votre logique de login existante
    # Doit accepter: {"username": "admin", "password": "admin"}
    # Doit retourner: {"token": "jwt-token", "user": {...}}
    pass

# Tous vos autres endpoints existants
@app.route('/api/plugins/<plugin_id>', methods=['POST'])
@app.route('/api/scans', methods=['GET', 'POST'])
@app.route('/api/vulns', methods=['GET', 'POST'])
# etc...
```

### 2. Configuration CORS pour le Frontend
Ajoutez CORS à votre backend existant :

```python
from flask_cors import CORS

# Dans votre app.py existant
CORS(app, origins=["http://localhost:3000", "http://votre-vm-ip:3000"])
```

### 3. Installation des Dépendances Frontend
```bash
cd pentest-toolbox-frontend
npm install
```

### 4. Configuration de l'Environnement
```bash
# Créer le fichier .env
nano .env
```

Contenu du fichier `.env`:
```env
# URL de votre backend existant
VITE_API_URL=http://localhost:5000

# Port du frontend
VITE_PORT=3000

# Mode de développement
NODE_ENV=development
```

## 🚀 Lancement des Services

### 1. Démarrer votre Backend Existant
```bash
# Dans le dossier de votre backend existant
cd /path/to/your/existing/backend
python app.py
# ou la commande que vous utilisez habituellement
```

### 2. Démarrer le Frontend
```bash
# Dans le dossier frontend
cd pentest-toolbox-frontend
npm run dev -- --host 0.0.0.0 --port 3000
```

## 🔐 Test de Connexion avec admin/admin

### 1. Accès à l'Interface
1. Ouvrez votre navigateur
2. Allez sur `http://votre-vm-ip:3000`
3. Vous verrez la page de login avec les identifiants pré-remplis
4. Cliquez sur "Se connecter" (admin/admin)

### 2. Vérification Backend
```bash
# Tester l'endpoint de login de votre backend
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin"}'

# Devrait retourner quelque chose comme:
# {"token": "eyJ...", "user": {"username": "admin", ...}}
```

## 🔧 Adaptation à votre Backend

### 1. Si votre endpoint de login est différent
Modifiez dans `src/utils/authFetch.ts`:

```javascript
// Si votre endpoint est /login au lieu de /api/auth/login
const response = await authFetch('/login', {
  method: 'POST',
  requireAuth: false,
  body: JSON.stringify(credentials),
});
```

### 2. Si votre format de réponse est différent
Modifiez la logique dans `useAuth()`:

```javascript
// Si votre backend retourne un format différent
if (response.ok) {
  const data = await response.json();
  // Adaptez selon votre format de réponse
  if (data.access_token) { // au lieu de data.token
    localStorage.setItem('auth_token', data.access_token);
    return { success: true, data };
  }
}
```

### 3. Si vous utilisez des sessions au lieu de JWT
Modifiez `authFetch.ts`:

```javascript
// Pour les sessions, pas besoin de token
if (requireAuth) {
  // Pas de token, les cookies de session sont automatiques
  // headers['Authorization'] = `Bearer ${token}`;
}
```

## 📁 Structure de Déploiement Recommandée

```
/home/user/
├── backend/                    # Votre backend existant
│   ├── app.py
│   ├── plugins/
│   └── ...
├── pentest-toolbox-frontend/   # Le nouveau frontend
│   ├── src/
│   ├── package.json
│   └── ...
└── scripts/
    ├── start-backend.sh
    ├── start-frontend.sh
    └── start-all.sh
```

## 🔄 Scripts de Démarrage

### Script pour démarrer le backend
Créez `scripts/start-backend.sh`:

```bash
#!/bin/bash
cd /home/user/backend
python app.py &
echo "Backend démarré sur le port 5000"
```

### Script pour démarrer le frontend
Créez `scripts/start-frontend.sh`:

```bash
#!/bin/bash
cd /home/user/pentest-toolbox-frontend
npm run dev -- --host 0.0.0.0 --port 3000 &
echo "Frontend démarré sur le port 3000"
```

### Script pour démarrer tout
Créez `scripts/start-all.sh`:

```bash
#!/bin/bash

echo "Démarrage du backend..."
cd /home/user/backend
python app.py &
BACKEND_PID=$!

echo "Attente du démarrage du backend..."
sleep 5

echo "Démarrage du frontend..."
cd /home/user/pentest-toolbox-frontend
npm run dev -- --host 0.0.0.0 --port 3000 &
FRONTEND_PID=$!

echo "Services démarrés:"
echo "Backend PID: $BACKEND_PID (port 5000)"
echo "Frontend PID: $FRONTEND_PID (port 3000)"
echo ""
echo "Accès: http://$(hostname -I | awk '{print $1}'):3000"
echo "Login: admin / admin"

# Attendre les processus
wait
```

Rendre les scripts exécutables:
```bash
chmod +x scripts/*.sh
```

## 🧪 Tests de Fonctionnement

### 1. Test Backend
```bash
# Vérifier que votre backend répond
curl http://localhost:5000/api/plugins
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin"}'
```

### 2. Test Frontend
1. Accédez à `http://votre-vm-ip:3000`
2. Connectez-vous avec admin/admin
3. Vérifiez que tous les menus fonctionnent
4. Testez l'exécution d'un plugin

### 3. Test de l'Intégration
1. Allez dans la section "Plugins"
2. Cliquez sur "Exécuter" pour un plugin
3. Vérifiez que les résultats s'affichent
4. Testez les autres sections (Scanning, Vulnerabilities, etc.)

## 🔧 Dépannage

### Problèmes Courants

1. **Frontend ne se connecte pas au backend**:
   ```bash
   # Vérifier que le backend écoute sur toutes les interfaces
   # Dans votre app.py, assurez-vous d'avoir:
   app.run(host='0.0.0.0', port=5000)
   ```

2. **Erreur CORS**:
   ```python
   # Ajouter CORS à votre backend
   from flask_cors import CORS
   CORS(app, origins=["http://localhost:3000"])
   ```

3. **Login ne fonctionne pas**:
   ```bash
   # Vérifier l'endpoint de login
   curl -v -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username": "admin", "password": "admin"}'
   ```

4. **Plugins ne s'exécutent pas**:
   ```bash
   # Vérifier les endpoints des plugins
   curl -X POST http://localhost:5000/api/plugins/hostname
   ```

## 📝 Commandes Utiles

```bash
# Voir les processus en cours
ps aux | grep -E "(node|python)"

# Voir les ports utilisés
netstat -tlnp | grep -E "(3000|5000)"

# Logs en temps réel
tail -f /var/log/syslog | grep -E "(node|python)"

# Arrêter tous les services
pkill -f "node.*vite"
pkill -f "python.*app.py"
```

## 🌐 Accès depuis l'Extérieur

Si vous voulez accéder depuis l'extérieur de la VM:

```bash
# Ouvrir les ports dans le firewall
sudo ufw allow 3000
sudo ufw allow 5000

# Vérifier l'IP de la VM
ip addr show

# Accès depuis l'extérieur
# http://ip-de-la-vm:3000
```

Maintenant votre frontend est connecté à votre backend existant avec le login admin/admin ! 🚀