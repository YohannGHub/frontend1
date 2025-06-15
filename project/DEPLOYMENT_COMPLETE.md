# 🚀 Guide Complet de Déploiement Frontend + Backend

## 📋 Étape 1: Préparation de la VM

### Installation des prérequis
```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier les versions
node --version  # Doit être >= 18.x
npm --version   # Doit être >= 8.x

# Installer Git si nécessaire
sudo apt install git -y
```

## 📁 Étape 2: Transférer le Frontend

### Option A: Copie directe des fichiers
```bash
# Créer le dossier de destination
mkdir -p /home/user/pentest-toolbox-frontend
cd /home/user/pentest-toolbox-frontend

# Transférer tous les fichiers du projet frontend ici
# (package.json, src/, public/, etc.)
```

### Option B: Via SCP depuis votre machine locale
```bash
# Depuis votre machine locale
scp -r ./pentest-toolbox-frontend user@vm-ip:/home/user/
```

## 🔧 Étape 3: Configuration du Backend Existant

### Modification de votre app.py
Ajoutez ces lignes à votre backend existant :

```python
from flask_cors import CORS

# Après la création de votre app Flask
app = Flask(__name__)

# AJOUTER CETTE LIGNE pour permettre les requêtes du frontend
CORS(app, origins=["http://localhost:3000", "http://votre-vm-ip:3000"])

# Vos routes existantes...

# Assurez-vous que votre route de login existe et fonctionne
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    # Votre logique de vérification existante
    if username == 'admin' and password == 'admin':
        # Générer un token ou utiliser votre système existant
        token = "votre-token-jwt-ou-session"
        return jsonify({
            'token': token,
            'user': {'username': username}
        })
    else:
        return jsonify({'message': 'Identifiants incorrects'}), 401

# Assurez-vous que l'app écoute sur toutes les interfaces
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

### Installation de Flask-CORS si pas déjà fait
```bash
# Dans le dossier de votre backend
pip install flask-cors
```

## 🔧 Étape 4: Configuration du Frontend

### Installation des dépendances
```bash
cd /home/user/pentest-toolbox-frontend
npm install
```

### Création du fichier .env
```bash
# Créer le fichier de configuration
nano .env
```

Contenu du fichier `.env` :
```env
# URL de votre backend (ajustez l'IP si nécessaire)
VITE_API_URL=http://localhost:5000

# Port du frontend
VITE_PORT=3000

# Mode de développement
NODE_ENV=development
```

## 🚀 Étape 5: Démarrage des Services

### 1. Démarrer votre Backend
```bash
# Aller dans le dossier de votre backend existant
cd /path/to/your/backend

# Démarrer votre backend comme d'habitude
python app.py

# Le backend doit afficher quelque chose comme :
# * Running on all addresses (0.0.0.0)
# * Running on http://127.0.0.1:5000
# * Running on http://192.168.x.x:5000
```

### 2. Démarrer le Frontend (dans un nouveau terminal)
```bash
# Aller dans le dossier frontend
cd /home/user/pentest-toolbox-frontend

# Démarrer le frontend
npm run dev -- --host 0.0.0.0 --port 3000

# Le frontend doit afficher :
# Local:   http://localhost:3000/
# Network: http://192.168.x.x:3000/
```

## 🔐 Étape 6: Test de Connexion

### 1. Accès à l'interface
1. Ouvrez votre navigateur
2. Allez sur `http://votre-vm-ip:3000`
3. Vous devriez voir la page de login avec admin/admin pré-rempli
4. Cliquez sur "Se connecter"

### 2. Vérification manuelle du backend
```bash
# Tester l'endpoint de login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin"}'

# Devrait retourner quelque chose comme :
# {"token": "...", "user": {"username": "admin"}}
```

### 3. Test des plugins
```bash
# Tester un plugin (exemple avec hostname)
curl -X POST http://localhost:5000/api/plugins/hostname \
  -H "Content-Type: application/json"

# Devrait retourner les informations du hostname
```

## 🔧 Étape 7: Scripts de Démarrage Automatique

### Créer les scripts utiles
```bash
# Créer le dossier scripts
mkdir -p /home/user/scripts
cd /home/user/scripts
```

### Script start-backend.sh
```bash
nano start-backend.sh
```

Contenu :
```bash
#!/bin/bash
echo "Démarrage du backend PenTest Toolbox..."
cd /path/to/your/backend
python app.py &
BACKEND_PID=$!
echo "Backend démarré (PID: $BACKEND_PID) sur le port 5000"
echo $BACKEND_PID > /tmp/backend.pid
```

### Script start-frontend.sh
```bash
nano start-frontend.sh
```

Contenu :
```bash
#!/bin/bash
echo "Démarrage du frontend PenTest Toolbox..."
cd /home/user/pentest-toolbox-frontend
npm run dev -- --host 0.0.0.0 --port 3000 &
FRONTEND_PID=$!
echo "Frontend démarré (PID: $FRONTEND_PID) sur le port 3000"
echo $FRONTEND_PID > /tmp/frontend.pid
```

### Script start-all.sh
```bash
nano start-all.sh
```

Contenu :
```bash
#!/bin/bash

echo "🚀 Démarrage de PenTest Toolbox"
echo "================================"

# Démarrer le backend
echo "📡 Démarrage du backend..."
cd /path/to/your/backend
python app.py &
BACKEND_PID=$!
echo "✅ Backend démarré (PID: $BACKEND_PID)"

# Attendre que le backend soit prêt
echo "⏳ Attente du démarrage du backend..."
sleep 5

# Démarrer le frontend
echo "🌐 Démarrage du frontend..."
cd /home/user/pentest-toolbox-frontend
npm run dev -- --host 0.0.0.0 --port 3000 &
FRONTEND_PID=$!
echo "✅ Frontend démarré (PID: $FRONTEND_PID)"

# Afficher les informations
echo ""
echo "🎉 Services démarrés avec succès !"
echo "=================================="
echo "Backend:  http://$(hostname -I | awk '{print $1}'):5000"
echo "Frontend: http://$(hostname -I | awk '{print $1}'):3000"
echo ""
echo "🔐 Connexion:"
echo "   Utilisateur: admin"
echo "   Mot de passe: admin"
echo ""
echo "📝 PIDs sauvegardés dans /tmp/"
echo $BACKEND_PID > /tmp/backend.pid
echo $FRONTEND_PID > /tmp/frontend.pid

# Attendre les processus
wait
```

### Script stop-all.sh
```bash
nano stop-all.sh
```

Contenu :
```bash
#!/bin/bash

echo "🛑 Arrêt de PenTest Toolbox"
echo "============================"

# Arrêter le frontend
if [ -f /tmp/frontend.pid ]; then
    FRONTEND_PID=$(cat /tmp/frontend.pid)
    echo "🌐 Arrêt du frontend (PID: $FRONTEND_PID)..."
    kill $FRONTEND_PID 2>/dev/null
    rm /tmp/frontend.pid
fi

# Arrêter le backend
if [ -f /tmp/backend.pid ]; then
    BACKEND_PID=$(cat /tmp/backend.pid)
    echo "📡 Arrêt du backend (PID: $BACKEND_PID)..."
    kill $BACKEND_PID 2>/dev/null
    rm /tmp/backend.pid
fi

# Forcer l'arrêt si nécessaire
echo "🧹 Nettoyage des processus restants..."
pkill -f "node.*vite" 2>/dev/null
pkill -f "python.*app.py" 2>/dev/null

echo "✅ Tous les services ont été arrêtés"
```

### Rendre les scripts exécutables
```bash
chmod +x /home/user/scripts/*.sh
```

## 🔧 Étape 8: Dépannage

### Problèmes courants et solutions

#### 1. Frontend ne se connecte pas au backend
```bash
# Vérifier que le backend écoute sur toutes les interfaces
netstat -tlnp | grep 5000

# Doit afficher : 0.0.0.0:5000 (pas 127.0.0.1:5000)
```

**Solution** : Dans votre app.py, assurez-vous d'avoir :
```python
app.run(host='0.0.0.0', port=5000)
```

#### 2. Erreur CORS
**Symptôme** : Erreur dans la console du navigateur mentionnant CORS

**Solution** : Vérifiez que vous avez ajouté CORS à votre backend :
```python
from flask_cors import CORS
CORS(app, origins=["http://localhost:3000"])
```

#### 3. Login ne fonctionne pas
```bash
# Tester manuellement l'endpoint
curl -v -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin"}'
```

#### 4. Plugins ne s'exécutent pas
```bash
# Vérifier les endpoints des plugins
curl -X POST http://localhost:5000/api/plugins/hostname
curl -X GET http://localhost:5000/api/plugins
```

### Commandes de diagnostic
```bash
# Voir les processus en cours
ps aux | grep -E "(node|python)"

# Voir les ports utilisés
netstat -tlnp | grep -E "(3000|5000)"

# Voir les logs en temps réel
tail -f /var/log/syslog | grep -E "(node|python)"

# Tester la connectivité
curl http://localhost:5000/api/plugins
curl http://localhost:3000
```

## 🌐 Étape 9: Accès depuis l'Extérieur (Optionnel)

### Ouvrir les ports dans le firewall
```bash
# Autoriser les ports
sudo ufw allow 3000
sudo ufw allow 5000

# Vérifier le statut
sudo ufw status
```

### Trouver l'IP de la VM
```bash
# Afficher l'IP
ip addr show | grep inet

# Ou plus simple
hostname -I
```

### Accès depuis l'extérieur
- Frontend : `http://ip-de-la-vm:3000`
- Backend : `http://ip-de-la-vm:5000`

## ✅ Étape 10: Vérification Finale

### Checklist de vérification
- [ ] Backend démarre sans erreur sur le port 5000
- [ ] Frontend démarre sans erreur sur le port 3000
- [ ] Page de login accessible avec admin/admin pré-rempli
- [ ] Connexion réussie avec admin/admin
- [ ] Dashboard s'affiche après connexion
- [ ] Section Plugins accessible et fonctionnelle
- [ ] Au moins un plugin s'exécute correctement
- [ ] Autres sections (Scanning, Vulnerabilities, etc.) accessibles

### Test complet
1. **Démarrage** : `./scripts/start-all.sh`
2. **Accès** : `http://vm-ip:3000`
3. **Login** : admin/admin
4. **Test plugin** : Aller dans Plugins → Exécuter "Hostname"
5. **Navigation** : Tester toutes les sections du menu
6. **Arrêt** : `./scripts/stop-all.sh`

## 🎉 Félicitations !

Si tous les tests passent, votre PenTest Toolbox est maintenant opérationnel avec :
- ✅ Interface web moderne et responsive
- ✅ Authentification avec vos identifiants existants
- ✅ Intégration complète avec vos plugins backend
- ✅ Toutes les fonctionnalités de scanning, vulnérabilités, exploits, etc.

**Accès final** : `http://votre-vm-ip:3000` avec admin/admin