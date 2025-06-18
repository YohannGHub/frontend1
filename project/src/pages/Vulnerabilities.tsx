// src/pages/Vulnerabilities.tsx
import React, { useState, useEffect } from 'react';
import {
  Shield, Bug, Search, AlertTriangle, Play
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authFetch } from '../utils/authFetch';

const Vulnerabilities: React.FC = () => {
  const [selectedTarget, setSelectedTarget] = useState('');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [severityCounts, setSeverityCounts] = useState({
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  });
  const [vulnResults, setVulnResults] = useState<any[]>([]);

  const tools = [
    {
      id: 'vuln-analysis',
      name: 'Analyse Vulnérabilités',
      description: 'Scan des vulnérabilités système (Nmap script vuln)',
      icon: Shield,
      color: 'bg-red-500',
      category: 'Analyse système'
    },
    {
      id: 'zap',
      name: 'OWASP ZAP',
      description: 'Analyse des vulnérabilités web (ZAP)',
      icon: Bug,
      color: 'bg-blue-500',
      category: 'Analyse web'
    },
    {
      id: 'nikto',
      name: 'Nikto',
      description: 'Scanner de vulnérabilités web (Nikto)',
      icon: Search,
      color: 'bg-purple-500',
      category: 'Analyse web'
    }
  ];

  const handleScan = async (toolId: string, toolName: string) => {
    if (!selectedTarget.trim()) {
      toast.error('Veuillez entrer une cible');
      return;
    }

    setSelectedTool(toolId);
    setIsScanning(true);
    toast.loading(`Scan ${toolName} lancé...`);

    try {
      const endpoint = toolId === 'nikto'
        ? '/api/nikto/scan'
        : toolId === 'zap'
          ? '/api/zap/scan'
          : '/api/scans/execute';

      const body = toolId === 'nikto' || toolId === 'zap'
        ? JSON.stringify({ target: selectedTarget })
        : JSON.stringify({ target_ip: selectedTarget, scan_type: toolId });

      const response = await authFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });

      const data = await response.json();
      toast.dismiss();

      if (!response.ok) {
        toast.error(data.message || data.error || 'Erreur pendant le scan');
      } else {
        toast.success(`Scan ${toolName} terminé`);
        fetchSeverityCounts();

        const zapTransformed = (toolId === 'zap' && data.output)
          ? data.output.split('\n')
              .filter((line: string) => line.trim() !== '')
              .map((line: string) => ({
                port: 80,
                protocol: "http",
                script: "ZAP",
                output: line
              }))
          : [];

        const vulns = Array.isArray(data.vulnerabilities) ? data.vulnerabilities
                    : Array.isArray(data.findings) ? data.findings
                    : zapTransformed;

        const nouveauResultat = {
          ...data,
          vulnerabilities: vulns,
          total_vulns: vulns.length,
          scan_output: data.raw_output || null,
        };

        setVulnResults((prev) => [nouveauResultat, ...prev]);
      }
    } catch (err) {
      toast.dismiss();
      toast.error('Erreur de connexion au serveur');
    } finally {
      setIsScanning(false);
      setSelectedTool(null);
    }
  };

  const fetchSeverityCounts = async () => {
    try {
      const res = await authFetch('/api/vuln/summary');
      const data = await res.json();
      setSeverityCounts(data);
    } catch (err) {
      console.error("Erreur chargement statistiques", err);
    }
  };

  const fetchVulnResults = async () => {
    try {
      const res = await authFetch('/api/vuln/results');
      const data = await res.json();
      const sorted = data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const results = sorted.map((entry: any) => ({
        ...entry,
        vulnerabilities: entry.vulnerabilities || entry.findings || [],
        total_vulns: (entry.vulnerabilities || entry.findings || []).length
      }));
      setVulnResults(results);
    } catch (err) {
      console.error("Erreur chargement vulnérabilités", err);
    }
  };

  useEffect(() => {
    fetchSeverityCounts();
    fetchVulnResults();
  }, []);

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
        onClick={() => handleScan(tool.id, tool.name)}
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

  const Card = ({ title, count, color, Icon }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${color} mt-2`}>{count}</p>
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const renderVulns = (vulns: any[]) => (
    <table className="w-full text-sm text-left border mt-4">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="p-2 border">Port</th>
          <th className="p-2 border">Protocole</th>
          <th className="p-2 border">Script</th>
          <th className="p-2 border">Résultat</th>
        </tr>
      </thead>
      <tbody>
        {vulns.map((vuln, index) => (
          <tr key={index} className="border-t">
            <td className="p-2 border">{vuln.port}</td>
            <td className="p-2 border">{vuln.protocol}</td>
            <td className="p-2 border font-medium text-red-600">{vuln.script}</td>
            <td className="p-2 border whitespace-pre-wrap">{vuln.output}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vulnérabilités</h1>
          <p className="text-gray-600 mt-1">Analyse des vulnérabilités par outil</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Cible</h2>
        <input
          type="text"
          value={selectedTarget}
          onChange={(e) => setSelectedTarget(e.target.value)}
          placeholder="192.168.1.1"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isScanning}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Outils de Scan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Critique" count={severityCounts.critical} color="text-red-600" Icon={AlertTriangle} />
        <Card title="Élevé" count={severityCounts.high} color="text-orange-600" Icon={Bug} />
        <Card title="Moyen" count={severityCounts.medium} color="text-yellow-600" Icon={Shield} />
        <Card title="Faible" count={severityCounts.low} color="text-green-600" Icon={Shield} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Résultats des Scans</h2>
        {vulnResults.length === 0 ? (
          <p className="text-gray-500">Aucun rapport de vulnérabilité trouvé.</p>
        ) : (
          vulnResults.map((report, idx) => (
            <div key={idx} className="mb-8">
              <div className="mb-2">
                <h3 className="text-lg font-bold text-gray-800">
                  🎯 Cible : {report.target}
                </h3>
                <p className="text-sm text-gray-500">
                  📅 Date : {new Date(report.date || new Date()).toLocaleString()} • Vulnérabilités : {report.total_vulns}
                </p>
              </div>
              {report.vulnerabilities?.length > 0
                ? renderVulns(report.vulnerabilities)
                : (
                  report.scan_output
                    ? <pre className="bg-gray-100 text-sm p-4 rounded mt-2 whitespace-pre-wrap">{report.scan_output}</pre>
                    : <p className="text-gray-500 italic">Aucune vulnérabilité détectée.</p>
                )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Vulnerabilities;
