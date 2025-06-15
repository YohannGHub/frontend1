import React, { useState, useEffect } from 'react';
import {
  Server, User, HardDrive, Clock, Network, Monitor,
  Users, Activity, Play, Download, RefreshCw,
  CheckCircle, AlertCircle, Loader
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authFetch } from '../utils/authFetch';

const Plugins: React.FC = () => {
  const [pluginResults, setPluginResults] = useState<{[key: string]: any}>({});
  const [runningPlugins, setRunningPlugins] = useState<Set<string>>(new Set());
  const [lastRun, setLastRun] = useState<{[key: string]: Date}>({});
  const [plugins, setPlugins] = useState<string[]>([]);

  useEffect(() => {
    const loadPlugins = async () => {
      try {
        const res = await authFetch('/api/plugins/list');
        const data = await res.json();
        if (Array.isArray(data)) {
          setPlugins(data);
        } else {
          toast.error("Erreur lors du chargement des plugins");
        }
      } catch (err) {
        console.error(err);
        toast.error("Erreur réseau");
      }
    };

    loadPlugins();
  }, []);

  const iconMap: Record<string, JSX.Element> = {
    hostname: <Server className="h-6 w-6 text-white" />,
    network: <Network className="h-6 w-6 text-white" />,
    osinfo: <Monitor className="h-6 w-6 text-white" />,
    processes: <Activity className="h-6 w-6 text-white" />,
    uptime: <Clock className="h-6 w-6 text-white" />,
    users: <Users className="h-6 w-6 text-white" />,
    whoami: <User className="h-6 w-6 text-white" />,
    diskspace: <HardDrive className="h-6 w-6 text-white" />,
  };

  const runPlugin = async (pluginId: string) => {
    setRunningPlugins(prev => new Set(prev).add(pluginId));
    toast.loading(`Exécution de ${pluginId}...`, { id: pluginId });

    try {
      const res = await authFetch(`/api/plugins/run/${pluginId}`);
      const data = await res.json();
      if (data.output) {
        setPluginResults(prev => ({ ...prev, [pluginId]: data.output }));
        setLastRun(prev => ({ ...prev, [pluginId]: new Date() }));
        toast.success(`${pluginId} terminé`, { id: pluginId });
      } else {
        toast.error(data.error || 'Erreur', { id: pluginId });
      }
    } catch (err) {
      toast.error('Erreur réseau', { id: pluginId });
    } finally {
      setRunningPlugins(prev => {
        const next = new Set(prev);
        next.delete(pluginId);
        return next;
      });
    }
  };

  const runAllPlugins = async () => {
    toast.loading("Exécution de tous les plugins...", { id: 'all-plugins' });
    try {
      await Promise.all(plugins.map(plugin => runPlugin(plugin)));
      toast.success("Tous les plugins exécutés", { id: 'all-plugins' });
    } catch {
      toast.error("Erreur globale", { id: 'all-plugins' });
    }
  };

  const downloadResults = (pluginId: string) => {
    const result = pluginResults[pluginId];
    if (!result) return toast.error("Aucun résultat");

    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pluginId}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (pluginId: string) => {
    if (runningPlugins.has(pluginId)) return <Loader className="h-4 w-4 animate-spin text-blue-500" />;
    if (pluginResults[pluginId]) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertCircle className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plugins Système</h1>
          <p className="text-gray-600">Outils d'analyse système distants</p>
        </div>
        <button
          onClick={runAllPlugins}
          disabled={runningPlugins.size > 0}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 mr-2 ${runningPlugins.size > 0 ? 'animate-spin' : ''}`} />
          Exécuter Tous
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {plugins.map(pluginId => (
          <div key={pluginId} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <div className="p-3 rounded-full bg-gray-800">
                {iconMap[pluginId] || <Server className="h-6 w-6 text-white" />}
              </div>
              {getStatusIcon(pluginId)}
            </div>
            <h3 className="text-lg font-bold text-gray-900 capitalize">{pluginId}</h3>

            {lastRun[pluginId] && (
              <p className="text-xs text-gray-500">Dernière exécution : {lastRun[pluginId].toLocaleString()}</p>
            )}

            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => runPlugin(pluginId)}
                disabled={runningPlugins.has(pluginId)}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm"
              >
                <Play className="h-4 w-4 mr-1" />
                {runningPlugins.has(pluginId) ? 'En cours...' : 'Exécuter'}
              </button>

              {pluginResults[pluginId] && (
                <button
                  onClick={() => downloadResults(pluginId)}
                  className="p-2 text-gray-600 hover:text-black"
                >
                  <Download className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Résultats */}
      {Object.keys(pluginResults).length > 0 && (
        <div className="bg-white border mt-8 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Résultats</h2>
          {Object.entries(pluginResults).map(([id, result]) => (
            <div key={id} className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 capitalize mb-2">{id}</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
                {typeof result === 'object' ? JSON.stringify(result, null, 2) : result}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Plugins;
