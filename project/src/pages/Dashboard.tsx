import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Target,
  Zap,
  Search,
  Bug,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../services/api';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalScans: 0,
    totalVulnerabilities: 0,
    totalExploits: 0,
    totalReports: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Charger les données réelles depuis le backend
        const [scansResponse, vulnsResponse, exploitsResponse, reportsResponse] = await Promise.all([
          ApiService.getScanResults(),
          ApiService.getVulnerabilities(),
          ApiService.getExploitResults(),
          ApiService.getReports()
        ]);

        // Mettre à jour les statistiques avec les données réelles
        setStats({
          totalScans: scansResponse.success ? scansResponse.data?.length || 0 : 0,
          totalVulnerabilities: vulnsResponse.success ? vulnsResponse.data?.length || 0 : 0,
          totalExploits: exploitsResponse.success ? exploitsResponse.data?.length || 0 : 0,
          totalReports: reportsResponse.success ? reportsResponse.data?.length || 0 : 0
        });

        // Créer l'activité récente à partir des données réelles
        const activities = [];
        
        // Ajouter les scans récents
        if (scansResponse.success && scansResponse.data) {
          scansResponse.data.slice(0, 3).forEach(scan => {
            activities.push({
              id: `scan-${scan.scan_id}`,
              type: 'scan',
              target: scan.target,
              status: scan.status,
              time: new Date(scan.created_at),
              tool: scan.tool
            });
          });
        }

        // Ajouter les vulnérabilités récentes
        if (vulnsResponse.success && vulnsResponse.data) {
          vulnsResponse.data.slice(0, 2).forEach(vuln => {
            activities.push({
              id: `vuln-${vuln.vuln_id}`,
              type: 'vulnerability',
              target: vuln.target,
              status: vuln.severity,
              time: new Date(vuln.discovered_at),
              title: vuln.title
            });
          });
        }

        // Ajouter les rapports récents
        if (reportsResponse.success && reportsResponse.data) {
          reportsResponse.data.slice(0, 2).forEach(report => {
            activities.push({
              id: `report-${report.report_id}`,
              type: 'report',
              target: report.title,
              status: report.status,
              time: new Date(report.created_at)
            });
          });
        }

        // Trier par date (plus récent en premier)
        activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        
        setRecentActivity(activities.slice(0, 5));

      } catch (error) {
        console.error('Erreur lors du chargement des données du dashboard:', error);
        // En cas d'erreur, utiliser des valeurs par défaut
        setStats({
          totalScans: 0,
          totalVulnerabilities: 0,
          totalExploits: 0,
          totalReports: 0
        });
        setRecentActivity([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleNewScan = () => {
    navigate('/scanning');
  };

  const handleAnalyzeVulnerabilities = () => {
    navigate('/vulnerabilities');
  };

  const handleGenerateReport = () => {
    navigate('/reports');
  };

  const StatCard = ({ title, value, icon: Icon, color, description }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {loading ? '...' : value}
          </p>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'scan':
        return <Search className="h-5 w-5" />;
      case 'vulnerability':
        return <AlertTriangle className="h-5 w-5" />;
      case 'report':
        return <FileText className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getActivityColor = (type: string, status?: string) => {
    switch (type) {
      case 'scan':
        return status === 'completed' ? 'bg-blue-100 text-blue-600' : 
               status === 'running' ? 'bg-yellow-100 text-yellow-600' : 
               'bg-gray-100 text-gray-600';
      case 'vulnerability':
        return status === 'critical' ? 'bg-red-100 text-red-600' :
               status === 'high' ? 'bg-orange-100 text-orange-600' :
               status === 'medium' ? 'bg-yellow-100 text-yellow-600' :
               'bg-green-100 text-green-600';
      case 'report':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (activity: any) => {
    switch (activity.type) {
      case 'scan':
        return activity.status === 'completed' ? 'Terminé' :
               activity.status === 'running' ? 'En cours' :
               activity.status === 'failed' ? 'Échoué' : activity.status;
      case 'vulnerability':
        return activity.status === 'critical' ? 'Critique' :
               activity.status === 'high' ? 'Élevé' :
               activity.status === 'medium' ? 'Moyen' :
               activity.status === 'low' ? 'Faible' : activity.status;
      case 'report':
        return activity.status === 'completed' ? 'Généré' :
               activity.status === 'generating' ? 'En cours' : activity.status;
      default:
        return activity.status;
    }
  };

  const getActivityDescription = (activity: any) => {
    switch (activity.type) {
      case 'scan':
        return `Scan ${activity.tool || 'réseau'} sur ${activity.target}`;
      case 'vulnerability':
        return activity.title || `Vulnérabilité trouvée sur ${activity.target}`;
      case 'report':
        return `Rapport généré: ${activity.target}`;
      default:
        return activity.target;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
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

      {/* Stats Grid */}
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

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h3>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Chargement...</span>
          </div>
        ) : recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((activity: any) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${getActivityColor(activity.type, activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {getActivityDescription(activity)}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {format(activity.time, 'PPp')}
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.type, activity.status)}`}>
                  {getStatusText(activity)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune activité récente</p>
            <p className="text-sm text-gray-400 mt-1">Commencez par lancer un scan pour voir l'activité ici</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={handleNewScan}
            className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 group"
          >
            <Target className="h-6 w-6 text-blue-600 mr-3 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium text-blue-900">Nouveau Scan</span>
          </button>
          <button 
            onClick={handleAnalyzeVulnerabilities}
            className="flex items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200 group"
          >
            <Bug className="h-6 w-6 text-orange-600 mr-3 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium text-orange-900">Analyser Vulnérabilités</span>
          </button>
          <button 
            onClick={handleGenerateReport}
            className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 group"
          >
            <FileText className="h-6 w-6 text-green-600 mr-3 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium text-green-900">Générer Rapport</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;