// Configuration de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Types pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ScanResponse {
  scan_id: string;
  status: 'running' | 'completed' | 'failed';
  target: string;
  tool: string;
  results?: any;
  created_at: string;
}

export interface VulnerabilityResponse {
  vuln_id: string;
  target: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  cve?: string;
  cvss?: number;
  solution?: string;
  status: 'open' | 'mitigated' | 'investigating';
  discovered_at: string;
}

export interface ExploitResponse {
  exploit_id: string;
  target: string;
  tool: string;
  status: 'running' | 'completed' | 'failed';
  results?: any;
  created_at: string;
}

export interface ReportResponse {
  report_id: string;
  title: string;
  type: string;
  target: string;
  status: 'generating' | 'completed' | 'failed';
  file_path?: string;
  created_at: string;
}

export interface PluginResponse {
  plugin_id: string;
  name: string;
  output: any;
  status: 'success' | 'error';
  execution_time: number;
  timestamp: string;
}

// Fonction utilitaire pour les requêtes API
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur API');
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

// Services API
export class ApiService {
  // === SCANNING ===
  static async startScan(params: {
    target: string;
    tool: 'nmap' | 'masscan' | 'zmap' | 'unicornscan';
    options?: any;
  }): Promise<ApiResponse<ScanResponse>> {
    return apiRequest<ScanResponse>('/api/scans', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  static async getScanResults(scanId?: string): Promise<ApiResponse<ScanResponse[]>> {
    const endpoint = scanId ? `/api/scans/${scanId}` : '/api/scans';
    return apiRequest<ScanResponse[]>(endpoint);
  }

  static async stopScan(scanId: string): Promise<ApiResponse> {
    return apiRequest(`/api/scans/${scanId}/stop`, {
      method: 'POST',
    });
  }

  // === ENUMERATION ===
  static async startEnumeration(params: {
    target: string;
    tool: 'nmap' | 'wireshark' | 'dirb' | 'enum4linux' | 'nikto' | 'gobuster';
    options?: any;
  }): Promise<ApiResponse<any>> {
    return apiRequest('/api/enum', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  static async getEnumerationResults(enumId?: string): Promise<ApiResponse<any[]>> {
    const endpoint = enumId ? `/api/enum/${enumId}` : '/api/enum';
    return apiRequest(endpoint);
  }

  // === VULNERABILITY SCANNING ===
  static async startVulnScan(params: {
    target: string;
    tool: 'vuln-analysis' | 'zap' | 'nikto' | 'openvas';
    options?: any;
  }): Promise<ApiResponse<VulnerabilityResponse>> {
    return apiRequest<VulnerabilityResponse>('/api/vulns', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  static async getVulnerabilities(vulnId?: string): Promise<ApiResponse<VulnerabilityResponse[]>> {
    const endpoint = vulnId ? `/api/vulns/${vulnId}` : '/api/vulns';
    return apiRequest<VulnerabilityResponse[]>(endpoint);
  }

  static async updateVulnerabilityStatus(
    vulnId: string,
    status: 'open' | 'mitigated' | 'investigating'
  ): Promise<ApiResponse> {
    return apiRequest(`/api/vulns/${vulnId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // === EXPLOITATION ===
  static async startExploit(params: {
    target: string;
    tool: 'metasploit' | 'hydra' | 'sqlmap' | 'beef';
    options?: any;
  }): Promise<ApiResponse<ExploitResponse>> {
    return apiRequest<ExploitResponse>('/api/exploits', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  static async getExploitResults(exploitId?: string): Promise<ApiResponse<ExploitResponse[]>> {
    const endpoint = exploitId ? `/api/exploits/${exploitId}` : '/api/exploits';
    return apiRequest<ExploitResponse[]>(endpoint);
  }

  static async stopExploit(exploitId: string): Promise<ApiResponse> {
    return apiRequest(`/api/exploits/${exploitId}/stop`, {
      method: 'POST',
    });
  }

  // === PLUGINS ===
  static async runPlugin(pluginId: string, params?: any): Promise<ApiResponse<PluginResponse>> {
    return apiRequest<PluginResponse>(`/api/plugins/${pluginId}`, {
      method: 'POST',
      body: JSON.stringify(params || {}),
    });
  }

  static async getPluginResults(pluginId?: string): Promise<ApiResponse<PluginResponse[]>> {
    const endpoint = pluginId ? `/api/plugins/${pluginId}/results` : '/api/plugins/results';
    return apiRequest<PluginResponse[]>(endpoint);
  }

  static async getAvailablePlugins(): Promise<ApiResponse<any[]>> {
    return apiRequest('/api/plugins');
  }

  // === REPORTS ===
  static async generateReport(params: {
    title: string;
    type: 'scan' | 'vulnerability' | 'exploit' | 'full';
    targets: string[];
    template?: string;
  }): Promise<ApiResponse<ReportResponse>> {
    return apiRequest<ReportResponse>('/api/reports', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  static async getReports(reportId?: string): Promise<ApiResponse<ReportResponse[]>> {
    const endpoint = reportId ? `/api/reports/${reportId}` : '/api/reports';
    return apiRequest<ReportResponse[]>(endpoint);
  }

  static async downloadReport(reportId: string): Promise<ApiResponse<Blob>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}/download`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement');
      }

      const blob = await response.blob();
      return {
        success: true,
        data: blob,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur de téléchargement',
      };
    }
  }

  static async deleteReport(reportId: string): Promise<ApiResponse> {
    return apiRequest(`/api/reports/${reportId}`, {
      method: 'DELETE',
    });
  }

  // === SYSTEM INFO ===
  static async getSystemInfo(): Promise<ApiResponse<any>> {
    return apiRequest('/api/system/info');
  }

  static async getSystemStatus(): Promise<ApiResponse<any>> {
    return apiRequest('/api/system/status');
  }

  // === NOTIFICATIONS ===
  static async getNotifications(): Promise<ApiResponse<any[]>> {
    return apiRequest('/api/notifications');
  }

  static async markNotificationRead(notificationId: string): Promise<ApiResponse> {
    return apiRequest(`/api/notifications/${notificationId}/read`, {
      method: 'POST',
    });
  }
}

// Hooks personnalisés pour React
export const useApi = () => {
  return {
    // Scanning
    startScan: ApiService.startScan,
    getScanResults: ApiService.getScanResults,
    stopScan: ApiService.stopScan,

    // Enumeration
    startEnumeration: ApiService.startEnumeration,
    getEnumerationResults: ApiService.getEnumerationResults,

    // Vulnerabilities
    startVulnScan: ApiService.startVulnScan,
    getVulnerabilities: ApiService.getVulnerabilities,
    updateVulnerabilityStatus: ApiService.updateVulnerabilityStatus,

    // Exploitation
    startExploit: ApiService.startExploit,
    getExploitResults: ApiService.getExploitResults,
    stopExploit: ApiService.stopExploit,

    // Plugins
    runPlugin: ApiService.runPlugin,
    getPluginResults: ApiService.getPluginResults,
    getAvailablePlugins: ApiService.getAvailablePlugins,

    // Reports
    generateReport: ApiService.generateReport,
    getReports: ApiService.getReports,
    downloadReport: ApiService.downloadReport,
    deleteReport: ApiService.deleteReport,

    // System
    getSystemInfo: ApiService.getSystemInfo,
    getSystemStatus: ApiService.getSystemStatus,

    // Notifications
    getNotifications: ApiService.getNotifications,
    markNotificationRead: ApiService.markNotificationRead,
  };
};

export default ApiService;