import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Shield, 
  Bug, 
  Search,
  Filter,
  Eye,
  Download,
  ExternalLink,
  Play,
  Settings,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';

const Vulnerabilities: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTarget, setSelectedTarget] = useState('');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const vulnerabilityTools = [
    {
      id: 'vuln-analysis',
      name: 'Analyse Vulnérabilités',
      description: 'Scan simple des vulnérabilités système',
      icon: Shield,
      color: 'bg-red-500',
      category: 'Vulnerability Assessment'
    },
    {
      id: 'zap',
      name: 'OWASP ZAP',
      description: 'Analyse des vulnérabilités web',
      icon: Bug,
      color: 'bg-blue-500',
      category: 'Web Security'
    },
    {
      id: 'nikto',
      name: 'Nikto',
      description: 'Scanner de vulnérabilités web avancé',
      icon: Search,
      color: 'bg-purple-500',
      category: 'Web Scanning'
    },
    {
      id: 'openvas',
      name: 'OpenVAS',
      description: 'Scanner de vulnérabilités complet',
      icon: AlertTriangle,
      color: 'bg-orange-500',
      category: 'Network Security'
    }
  ];

  const vulnerabilities = [
    {
      id: 'CVE-2023-1234',
      title: 'Remote Code Execution in Apache HTTP Server',
      severity: 'critical',
      cvss: 9.8,
      target: '192.168.1.1',
      port: 80,
      status: 'open',
      description: 'A critical vulnerability that allows remote code execution through malformed HTTP requests.',
      solution: 'Update Apache HTTP Server to version 2.4.52 or later',
      discovered: new Date(Date.now() - 3600000)
    },
    {
      id: 'CVE-2023-5678',
      title: 'SQL Injection in Web Application',
      severity: 'high',
      cvss: 8.1,
      target: '192.168.1.5',
      port: 443,
      status: 'open',
      description: 'SQL injection vulnerability in login form allows unauthorized database access.',
      solution: 'Implement proper input validation and parameterized queries',
      discovered: new Date(Date.now() - 7200000)
    },
    {
      id: 'CVE-2023-9012',
      title: 'Cross-Site Scripting (XSS)',
      severity: 'medium',
      cvss: 6.1,
      target: '192.168.1.10',
      port: 80,
      status: 'mitigated',
      description: 'Reflected XSS vulnerability in search functionality.',
      solution: 'Implement proper output encoding and Content Security Policy',
      discovered: new Date(Date.now() - 14400000)
    },
    {
      id: 'CVE-2023-3456',
      title: 'Information Disclosure',
      severity: 'low',
      cvss: 3.7,
      target: '192.168.1.15',
      port: 22,
      status: 'open',
      description: 'SSH banner reveals detailed version information.',
      solution: 'Configure SSH to hide version information in banner',
      discovered: new Date(Date.now() - 21600000)
    }
  ];

  const handleStartScan = (toolId: string, toolName: string) => {
    if (!selectedTarget.trim()) {
      toast.error('Veuillez entrer une cible à scanner');
      return;
    }

    setSelectedTool(toolId);
    setIsScanning(true);
    toast.success(`Scan ${toolName} démarré`);

    // Simulate scan process
    setTimeout(() => {
      setIsScanning(false);
      setSelectedTool(null);
      toast.success(`Scan ${toolName} terminé`);
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
        
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <Settings className="h-4 w-4" />
        </button>
        
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <Info className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'mitigated':
        return 'bg-green-100 text-green-800';
      case 'investigating':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCVSSColor = (score: number) => {
    if (score >= 9.0) return 'text-red-600';
    if (score >= 7.0) return 'text-orange-600';
    if (score >= 4.0) return 'text-yellow-600';
    return 'text-green-600';
  };

  const filteredVulnerabilities = vulnerabilities.filter(vuln => {
    const matchesSearch = vuln.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vuln.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vuln.target.includes(searchTerm);
    const matchesSeverity = severityFilter === 'all' || vuln.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || vuln.status === statusFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const severityCounts = {
    critical: vulnerabilities.filter(v => v.severity === 'critical').length,
    high: vulnerabilities.filter(v => v.severity === 'high').length,
    medium: vulnerabilities.filter(v => v.severity === 'medium').length,
    low: vulnerabilities.filter(v => v.severity === 'low').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Vulnérabilités</h1>
          <p className="text-gray-600 mt-1">Découvrez et gérez les vulnérabilités de sécurité</p>
        </div>
      </div>

      {/* Target Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuration de la Cible</h2>
        
        <div className="space-y-6">
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
              disabled={isScanning}
            />
          </div>
        </div>
      </div>

      {/* Vulnerability Scanning Tools */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Outils de Scan de Vulnérabilités</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vulnerabilityTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critique</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{severityCounts.critical}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Élevé</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{severityCounts.high}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Bug className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Moyen</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{severityCounts.medium}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Shield className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Faible</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{severityCounts.low}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des vulnérabilités..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Toutes Sévérités</option>
                <option value="critical">Critique</option>
                <option value="high">Élevé</option>
                <option value="medium">Moyen</option>
                <option value="low">Faible</option>
              </select>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous Statuts</option>
              <option value="open">Ouvert</option>
              <option value="mitigated">Corrigé</option>
              <option value="investigating">En Investigation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vulnerabilities List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Vulnérabilités ({filteredVulnerabilities.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredVulnerabilities.map((vuln) => (
            <div key={vuln.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{vuln.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(vuln.severity)}`}>
                      {vuln.severity.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(vuln.status)}`}>
                      {vuln.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                    <span className="flex items-center">
                      <strong>CVE:</strong> <span className="ml-1">{vuln.id}</span>
                    </span>
                    <span className="flex items-center">
                      <strong>CVSS:</strong> 
                      <span className={`ml-1 font-semibold ${getCVSSColor(vuln.cvss)}`}>
                        {vuln.cvss}
                      </span>
                    </span>
                    <span><strong>Cible:</strong> {vuln.target}:{vuln.port}</span>
                    <span><strong>Découvert:</strong> {vuln.discovered.toLocaleString()}</span>
                  </div>

                  <p className="text-gray-700 mb-3">{vuln.description}</p>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Solution Recommandée:</strong> {vuln.solution}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-6">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                    <Eye className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <Download className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <ExternalLink className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Vulnerabilities;