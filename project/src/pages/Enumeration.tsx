import React, { useState } from 'react';
import {
  Search, Network, Users, Play
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authFetch } from '../utils/authFetch';

const Enumeration: React.FC = () => {
  const [target, setTarget] = useState('');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isEnumerating, setIsEnumerating] = useState(false);
  const [scanOutput, setScanOutput] = useState<any>(''); // ← accepte string ou objet

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
      id: 'enum4linux',
      name: 'Enum4Linux',
      description: 'Énumération des systèmes Linux/Unix',
      icon: Users,
      color: 'bg-orange-500',
      category: 'System Enumeration'
    }
  ];

  const handleStartEnumeration = async (toolId: string, toolName: string) => {
    if (!target.trim()) {
      toast.error('Veuillez entrer une cible à énumérer');
      return;
    }

    setSelectedTool(toolId);
    setIsEnumerating(true);
    setScanOutput('');
    toast.loading(`Énumération ${toolName} lancée...`);

    try {
      const response = await authFetch('/api/scans/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_ip: target,
          scan_type: toolId
        }),
      });

      const data = await response.json();
      toast.dismiss();

      if (!response.ok) {
        toast.error(data.message || 'Erreur pendant l\'énumération');
      } else {
        toast.success(`Énumération ${toolName} terminée`);
        setScanOutput(data.scan_output || 'Aucune sortie reçue');
      }
    } catch (err) {
      toast.dismiss();
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsEnumerating(false);
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
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Énumération de Cibles</h1>
          <p className="text-gray-600 mt-1">Collectez des informations détaillées sur vos cibles</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuration de la Cible</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cible (IP/Domaine)</label>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="192.168.1.1 ou example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isEnumerating}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Outils d'Énumération</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enumerationTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>

      {scanOutput && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 whitespace-pre-wrap">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Résultat de l'Énumération</h2>
          <pre className="bg-gray-100 p-4 rounded-md text-sm text-gray-800 overflow-x-auto max-h-[400px]">
            {typeof scanOutput === 'object'
              ? scanOutput.output || JSON.stringify(scanOutput, null, 2)
              : scanOutput}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Enumeration;
