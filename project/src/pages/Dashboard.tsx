import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Target,
  Zap,
  Bug,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../utils/authFetch';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalScans: 0,
    totalVulnerabilities: 0,
    totalExploits: 0,
    totalReports: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await authFetch('/api/dashboard/summary');
        const json = await res.json();

        if (json.success && json.data) {
          setStats({
            totalScans: json.data.scans || 0,
            totalVulnerabilities: json.data.vulnerabilities || 0,
            totalExploits: json.data.exploits || 0,
            totalReports: json.data.reports || 0
          });
        }
      } catch (error) {
        console.error('Erreur chargement dashboard :', error);
        setStats({
          totalScans: 0,
          totalVulnerabilities: 0,
          totalExploits: 0,
          totalReports: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleNewScan = () => navigate('/scanning');
  const handleAnalyzeVulnerabilities = () => navigate('/vulnerabilities');
  const handleGenerateReport = () => navigate('/reports');

  const StatCard = ({ title, value, icon: Icon, color, description }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '...' : value}</p>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Sécurité</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de vos activités de test de pénétration</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Dernière mise à jour</p>
          <p className="text-sm font-medium text-gray-900">{format(new Date(), 'PPp')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total des Scans"
          value={stats.totalScans}
          icon={Activity}
          color="bg-blue-500"
          description="Scans effectués"
        />
        <StatCard
          title="Vulnérabilités Trouvées"
          value={stats.totalVulnerabilities}
          icon={AlertTriangle}
          color="bg-orange-500"
          description="Failles découvertes"
        />
        <StatCard
          title="Exploits Exécutés"
          value={stats.totalExploits}
          icon={Zap}
          color="bg-red-500"
          description="Tests d'exploitation"
        />
        <StatCard
          title="Rapports Générés"
          value={stats.totalReports}
          icon={CheckCircle}
          color="bg-green-500"
          description="Documents créés"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={handleNewScan} className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition">
            <Target className="h-6 w-6 text-blue-600 mr-3" />
            <span className="font-medium text-blue-900">Nouveau Scan</span>
          </button>
          <button onClick={handleAnalyzeVulnerabilities} className="flex items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition">
            <Bug className="h-6 w-6 text-orange-600 mr-3" />
            <span className="font-medium text-orange-900">Analyser Vulnérabilités</span>
          </button>
          <button onClick={handleGenerateReport} className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition">
            <FileText className="h-6 w-6 text-green-600 mr-3" />
            <span className="font-medium text-green-900">Générer Rapport</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
