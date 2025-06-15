import React, { useState, useEffect } from 'react';
import {
  Shield, Search, Zap, Key, Globe,
  Database, Network, Play, Settings, Info
} from 'lucide-react';
import toast from 'react-hot-toast';

const Tools: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [idsAlerts, setIdsAlerts] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [forensicResult, setForensicResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  const handleForensicAnalyze = async () => {
    if (!selectedFile) return toast.error("Aucun fichier sélectionné");

    const token = localStorage.getItem("auth_token");
    if (!token) return toast.error("Token manquant. Veuillez vous reconnecter.");

    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch(`http://localhost:5000/api/forensic/analyze?token=${token}`, {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    if (response.ok) {
      setForensicResult(data);
      toast.success("Analyse forensique terminée !");
    } else {
      toast.error(data.error || "Erreur serveur");
    }
  };

  const exportReport = async (format: string) => {
    if (!forensicResult) return toast.error("Aucun résultat à exporter");

    const token = localStorage.getItem("auth_token");
    const response = await fetch(`http://localhost:5000/api/forensic/export/${format}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: forensicResult.filename || "rapport_forensic",
        result: forensicResult,
      }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rapport_forensic.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      toast.error("Erreur lors de l'export");
    }
  };

  const fetchIdsAlerts = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const response = await fetch("http://localhost:5000/api/ids/alerts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setIdsAlerts(data.alerts);
        toast.success("Alertes IDS récupérées !");
      } else {
        toast.error("Erreur IDS : " + data.error);
      }
    } catch (error) {
      toast.error("Impossible de contacter l'IDS");
    }
  };

  useEffect(() => {
    fetchIdsAlerts();
    const interval = setInterval(fetchIdsAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const securityTools = [
    { id: 'vuln-analysis', name: 'Analyse Vulnérabilités', description: 'Scan simple des vulnérabilités', icon: Shield, color: 'bg-red-500', category: 'Vulnerability Assessment' },
    { id: 'metasploit', name: 'Metasploit', description: 'Exploitation de failles', icon: Zap, color: 'bg-purple-500', category: 'Exploitation' },
    { id: 'hydra', name: 'Hydra', description: 'Bruteforce login SSH', icon: Key, color: 'bg-orange-500', category: 'Brute Force' },
    { id: 'zap', name: 'ZAP', description: 'Analyse des vulnérabilités web', icon: Globe, color: 'bg-blue-500', category: 'Web Security' },
    { id: 'nmap', name: 'Nmap', description: 'Scan réseau avancé', icon: Search, color: 'bg-green-500', category: 'Network Scanning' },
    { id: 'sqlmap', name: 'SQLMap', description: 'Injection SQL automatisée', icon: Database, color: 'bg-yellow-500', category: 'Database Security' },
    { id: 'wireshark', name: 'Wireshark', description: 'Analyse de trafic réseau', icon: Network, color: 'bg-indigo-500', category: 'Network Analysis' }
  ];

  const handleToolLaunch = (toolId: string, toolName: string) => {
    setSelectedTool(toolId);
    setIsRunning(true);
    toast.success(`Lancement de ${toolName}...`);
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
        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{tool.category}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.name}</h3>
      <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleToolLaunch(tool.id, tool.name)}
          disabled={isRunning && selectedTool === tool.id}
          className={`flex items-center px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200 ${isRunning && selectedTool === tool.id ? 'bg-gray-400 cursor-not-allowed' : `${tool.color} hover:opacity-90`}`}
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

  return (
    <div className="p-6 space-y-6">
      {/* IDS Alertes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🛡 Alertes IDS (Suricata)</h3>
        <button onClick={fetchIdsAlerts} className="mb-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200">Afficher les alertes IDS</button>
        <ul className="space-y-2 text-sm font-mono text-gray-700 max-h-60 overflow-y-auto">
          {idsAlerts.map((alert, idx) => (
            <li key={idx} className={`p-2 rounded-lg ${
              alert.includes('[Priority: 1]') ? 'bg-red-100 text-red-800' :
              alert.includes('[Priority: 2]') ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>{alert}</li>
          ))}
        </ul>
      </div>

      {/* Forensic Module */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">🔍 Analyse Forensique</h3>
        <input type="file" onChange={handleFileChange} className="block text-sm" />
        <button onClick={handleForensicAnalyze} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Analyser</button>

        {forensicResult && (
          <div className="mt-4 text-sm font-mono text-gray-800">
            <p><strong>Nom :</strong> {forensicResult.filename}</p>
            <p><strong>Type :</strong> {forensicResult.type}</p>

            <div className="mt-2">
              <h4 className="font-semibold">🔐 Hashs :</h4>
              <ul className="list-disc ml-5">
                {Object.entries(forensicResult.hashes).map(([algo, val]) => (
                  <li key={algo}><strong>{algo}:</strong> {val}</li>
                ))}
              </ul>
            </div>

            <div className="mt-2">
              <h4 className="font-semibold">🧠 Résultats :</h4>
              <pre className="bg-gray-100 p-2 rounded max-h-80 overflow-auto">
                {JSON.stringify(forensicResult.analysis, null, 2)}
              </pre>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => {
                const blob = new Blob([JSON.stringify(forensicResult, null, 2)], { type: "text/plain;charset=utf-8" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = `${forensicResult.filename || "rapport"}_forensic.txt`;
                link.click();
              }} className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-900">📝 Exporter en TXT</button>

              <button onClick={() => exportReport("json")} className="bg-black text-white px-3 py-1 rounded hover:bg-gray-700">📄 Exporter JSON</button>
              <button onClick={() => exportReport("html")} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">🧾 Exporter HTML</button>
              <button onClick={() => exportReport("pdf")} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">🗎 Exporter PDF</button>
            </div>
          </div>
        )}
      </div>

      {/* Tools */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Outils Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {securityTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tools;
