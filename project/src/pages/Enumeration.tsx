import React, { useState } from 'react';
import { 
  Search, 
  Server, 
  Users, 
  Folder, 
  Globe,
  Database,
  Play,
  Download,
  Eye,
  Network,
  Settings,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';

const Enumeration: React.FC = () => {
  const [selectedTarget, setSelectedTarget] = useState('');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isEnumerating, setIsEnumerating] = useState(false);

  const enumerationTools = [
    {
      id: 'nmap',
      name: 'Nmap',
      description: 'Scan réseau avancé et découverte de services',
      icon: Search,
      color: 'bg-green-500',
      category: 'Network Discovery'
    },
    {
      id: 'wireshark',
      name: 'Wireshark',
      description: 'Analyse de trafic réseau et capture de paquets',
      icon: Network,
      color: 'bg-indigo-500',
      category: 'Network Analysis'
    },
    {
      id: 'dirb',
      name: 'DirBuster',
      description: 'Découverte de répertoires et fichiers cachés',
      icon: Folder,
      color: 'bg-purple-500',
      category: 'Directory Enumeration'
    },
    {
      id: 'enum4linux',
      name: 'Enum4Linux',
      description: 'Énumération des systèmes Linux/Unix',
      icon: Users,
      color: 'bg-orange-500',
      category: 'System Enumeration'
    },
    {
      id: 'nikto',
      name: 'Nikto',
      description: 'Scanner de vulnérabilités web',
      icon: Globe,
      color: 'bg-blue-500',
      category: 'Web Enumeration'
    },
    {
      id: 'gobuster',
      name: 'Gobuster',
      description: 'Brute force de répertoires et sous-domaines',
      icon: Search,
      color: 'bg-red-500',
      category: 'Brute Force Discovery'
    }
  ];

  const enumerationResults = [
    {
      id: 1,
      target: '192.168.1.1',
      tool: 'Nmap',
      timestamp: new Date(Date.now() - 1800000),
      findings: 12,
      status: 'completed'
    },
    {
      id: 2,
      target: '10.0.0.5',
      tool: 'Enum4Linux',
      timestamp: new Date(Date.now() - 3600000),
      findings: 8,
      status: 'completed'
    },
    {
      id: 3,
      target: '172.16.0.10',
      tool: 'Gobuster',
      timestamp: new Date(Date.now() - 7200000),
      findings: 25,
      status: 'completed'
    }
  ];

  const serviceFindings = [
    { service: 'SSH', port: 22, version: 'OpenSSH 8.2', status: 'Open' },
    { service: 'HTTP', port: 80, version: 'Apache 2.4.41', status: 'Open' },
    { service: 'HTTPS', port: 443, version: 'Apache 2.4.41', status: 'Open' },
    { service: 'FTP', port: 21, version: 'vsftpd 3.0.3', status: 'Open' },
    { service: 'MySQL', port: 3306, version: '8.0.25', status: 'Filtered' },
  ];

  const handleStartEnumeration = (toolId: string, toolName: string) => {
    if (!selectedTarget.trim()) {
      toast.error('Veuillez entrer une cible à énumérer');
      return;
    }

    setSelectedTool(toolId);
    setIsEnumerating(true);
    toast.success(`Énumération ${toolName} démarrée`);

    // Simulate enumeration process
    setTimeout(() => {
      setIsEnumerating(false);
      setSelectedTool(null);
      toast.success(`Énumération ${toolName} terminée`);
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
          onClick={() => handleStartEnumeration(tool.id, tool.name)}
          disabled={isEnumerating && selectedTool === tool.id}
          className={`flex items-center px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200 ${
            isEnumerating && selectedTool === tool.id
              ? 'bg-gray-400 cursor-not-allowed'
              : `${tool.color} hover:opacity-90`
          }`}
        >
          <Play className="h-4 w-4 mr-2" />
          {isEnumerating && selectedTool === tool.id ? 'En cours...' : 'Lancer'}
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Énumération de Cibles</h1>
          <p className="text-gray-600 mt-1">Collectez des informations détaillées sur vos cibles</p>
        </div>
      </div>

      {/* Target Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuration de la Cible</h2>
        
        <div className="space-y-6">
          {/* Target Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hôte Cible
            </label>
            <input
              type="text"
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              placeholder="192.168.1.1 ou example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              disabled={isEnumerating}
            />
          </div>
        </div>
      </div>

      {/* Enumeration Tools */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Outils d'Énumération</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enumerationTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enumeration Results */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Résultats Récents</h2>
          
          <div className="space-y-4">
            {enumerationResults.map((result) => (
              <div key={result.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{result.target}</div>
                    <div className="text-sm text-gray-500">
                      {result.tool} • {result.findings} découvertes • {result.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Détails des Services</h2>
          
          <div className="space-y-3">
            {serviceFindings.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="font-medium text-gray-900">{service.service}</div>
                  <div className="text-sm text-gray-500">Port {service.port}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-600">{service.version}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    service.status === 'Open' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enumeration;