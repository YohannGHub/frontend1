import React, { useState } from 'react';
import { Shield, User, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../utils/authFetch';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(credentials);

      if (result.success) {
        toast.success('Connexion réussie');
        window.location.href = '/';
      } else {
        toast.error(result.error || 'Identifiants incorrects');
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo et Titre */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-red-600 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">PenTest Toolbox</h1>
          <p className="text-gray-300">Plateforme de Tests de Pénétration</p>
        </div>

        {/* Formulaire de Connexion */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Connexion</h2>
            <p className="text-gray-600 text-center mt-2">Accédez à votre environnement sécurisé</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom d'utilisateur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Nom d'utilisateur"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Mot de passe"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Avertissement de sécurité */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Accès Sécurisé</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Cette plateforme est réservée aux professionnels autorisés. 
                  Toutes les activités sont surveillées et enregistrées.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            © 2024 PenTest Toolbox. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
