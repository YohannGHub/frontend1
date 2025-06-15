import React, { useState } from 'react';
import { 
  Shield, 
  Search, 
  Zap, 
  Key,
  Globe,
  Database,
  Network,
  Play,
  Settings,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';

const Tools: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const securityTools = [
    {
      id: 'vuln-analysis',
      name: 'Analyse Vulnérabilités',
      description: 'Scan simple des vulnérabilités',
      icon: Shield,
      color: 'bg-red-500',
      category: 'Vulnerability Assessment'
    },
    {
      id: 'metasploit',
      name: 'Metasploit',
      description: 'Exploitation de failles',
      icon: Zap,
      color: 'bg-purple-500',
      category: 'Exploitation'
    },
    {
      id: 'hydra',
      name: 'Hydra',
      description: 'Bruteforce login SSH',
      icon: Key,
      color: 'bg-orange-500',
      category: 'Brute Force'
    },
    {
      id: 'zap',
      name: 'ZAP',
      description: 'Analyse des vulnérabilités web',
      icon: Globe,
      color: 'bg-blue-500',
      category: 'Web Security'
    },
    {
      id: 'nmap',
      name: 'Nmap',
      description: 'Scan réseau avancé',
      icon: Search,
      color: 'bg-green-500',
      category: 'Network Scanning'
    },
    {
      id: 'sqlmap',
      name: 'SQLMap',
      description: 'Injection SQL automatisée',
      icon: Database,
      color: 'bg-yellow-500',
      category: 'Database Security'
    },
    {
      id: 'wireshark',
      name: 'Wireshark',
      description: 'Analyse de trafic réseau',
      icon: Network,
      color: 'bg-indigo-500',
      category: 'Network Analysis'
    }
  ];

  const handleToolLaunch = (toolId: string, toolName: string) => {
    setSelectedTool(toolId);
    setIsRunning(true);
    toast.success(`Lancement de ${toolName}...`);

    // Simulate tool execution
    setTimeout(() => {
      setIsRunning(false);
      toast.success(`${toolName} terminé avec succès`);
    }, 3000);
  };

  const ToolCard = ({ tool }: { tool: any }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${tool.color} group-hover:scale-110 transition-transform duration-200`}>
          <tool.icon className="h-6 w-6 text-white" />
        </div>
        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
          {tool.category}
        </span>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.name}</h3>
      <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleToolLaunch(tool.id, tool.name)}
          disabled={isRunning && selectedTool === tool.id}
          className={`flex items-center px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200 ${
            isRunning && selectedTool === tool.id
              ? 'bg-gray-400 cursor-not-allowed'
              : `${tool.color} hover:opacity-90`
          }`}
        >
          <Play className="h-4 w-4 mr-2" />
          {isRunning && selectedTool === tool.id ? 'En cours...' : 'Lancer'}
        </button>
        
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <Settings className="h-4 w-4" />
        </button>
        
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <Info className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const categories = [...new Set(securityTools.map(tool => tool.category))];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Outils de Sécurité</h1>
          <p className="text-gray-600 mt-1">Suite complète d'outils pour les tests de pénétration</p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-600">Tous les outils disponibles</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outils Disponibles</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{securityTools.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Catégories</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{categories.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Search className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outils Actifs</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{isRunning ? 1 : 0}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Zap className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dernière Utilisation</p>
              <p className="text-sm font-medium text-gray-900 mt-2">Il y a 2h</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Network className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid - Disposition horizontale */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Outils Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {securityTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 group">
            <Search className="h-6 w-6 text-blue-600 mr-3 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium text-blue-900">Scan Complet</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 group">
            <Shield className="h-6 w-6 text-red-600 mr-3 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium text-red-900">Test Vulnérabilités</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 group">
            <Zap className="h-6 w-6 text-green-600 mr-3 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium text-green-900">Exploitation</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tools;