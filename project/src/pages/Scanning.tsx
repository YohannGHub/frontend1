import React, { useState } from 'react';
import {
  Play, Target, Search, Network
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authFetch } from '../utils/authFetch';

const Scanning: React.FC = () => {
  const [scanTarget, setScanTarget] = useState('');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanOutput, setScanOutput] = useState(''); // <- 🆕 Nouveau state

  const scanningTools = [
    {
      id: 'nmap',
      name: 'Nmap',
      description: 'Scan réseau avancé et découverte de ports',
      icon: Search,
      color: 'bg-green-500',
      category: 'Network Scanning'
    },
    {
      id: 'masscan',
      name: 'Masscan',
      description: 'Scanner de ports ultra-rapide',
      icon: Target,
      color: 'bg-blue-500',
      category: 'Port Scanning'
    },
    {
      id: 'zmap',
      name: 'ZMap',
      description: 'Scanner Internet à grande échelle',
      icon: Network,
      color: 'bg-purple-500',
      category: 'Internet Scanning'
    }
  ];

  const handleStartScan = async (toolId: string, toolName: string) => {
    if (!scanTarget.trim()) {
      toast.error('Veuillez entrer une cible à scanner');
      return;
    }

    setSelectedTool(toolId);
    setIsScanning(true);
    setScanOutput('');
    toast.loading(`Scan ${toolName} lancé...`);

    try {
      const response = await authFetch('/api/scans/execute', {
        method: 'POST',
        body: JSON.stringify({
          target_ip: scanTarget,
          scan_type: toolId
        }),
      });

      const data = await response.json();
      toast.dismiss();

      if (!response.ok) {
        toast.error(data.message || 'Erreur pendant le scan');
      } else {
        toast.success(`Scan ${toolName} terminé`);
        setScanOutput(data.scan_output); // <- 🆕 Affichage du résultat
      }
    } catch (err) {
      toast.dismiss();
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsScanning(false);
      setSelectedTool(null);
    }
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

      <button
        onClick={() => handleStartScan(tool.id, tool.name)}
        disabled={isScanning && selectedTool === tool.id}
        className={`flex items-center px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200 ${
          isScanning && selectedTool === tool.id
            ? 'bg-gray-400 cursor-not-allowed'
            : `${tool.color} hover:opacity-90`
        }`}
      >
        <Play className="h-4 w-4 mr-2" />
        {isScanning && selectedTool === tool.id ? 'En cours...' : 'Scanner'}
      </button>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Scan Réseau</h1>
          <p className="text-gray-600 mt-1">Découvrez et analysez les cibles réseau</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuration du Scan</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cible (IP/Domaine)</label>
            <input
              type="text"
              value={scanTarget}
              onChange={(e) => setScanTarget(e.target.value)}
              placeholder="192.168.1.1 ou example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isScanning}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Outils de Scan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {scanningTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>

      {scanOutput && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 whitespace-pre-wrap">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Résultat du scan</h2>
          <pre className="bg-gray-100 p-4 rounded-md text-sm text-gray-800 overflow-x-auto max-h-[400px]">
            {scanOutput}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Scanning;
