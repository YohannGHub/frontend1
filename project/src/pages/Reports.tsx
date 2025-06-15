import React, { useState, useEffect } from 'react';
import {
  FileText, Download, Eye, Search, Trash2, ChevronDown
} from 'lucide-react';
import { format } from 'date-fns';
import { authFetch } from '../utils/authFetch';

interface ReportItem {
  filename: string;
  created_at: string;
  target: string;
  type: string;
  status: string;
}

const Reports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadOpenIndex, setDownloadOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        const res = await authFetch('/api/reports/list');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setReports(json.data);
        } else {
          setReports([]);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des rapports :', err);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  const filteredReports = reports.filter((r) =>
    r.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = async (filename: string, format: string) => {
    try {
      const scanType = filename.startsWith("nmap") ? "nmap"
        : filename.startsWith("zap") ? "zap"
        : filename.startsWith("hydra") ? "hydra"
        : "nmap";

      let url = '';
      let fileExt = format;

      if (format === 'json') {
        url = `/uploads/scans/${filename}`;
        const response = await fetch(url);
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        url = `/api/report/download/${format}/${scanType}/${filename}`;
        const response = await authFetch(url);
        if (!response.ok) throw new Error('Téléchargement échoué');

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename.replace('.json', `.${fileExt}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err) {
      alert('Téléchargement échoué');
      console.error(err);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!window.confirm(`Supprimer le rapport ${filename} ?`)) return;
    try {
      const res = await authFetch(`/api/reports/delete/${filename}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        setReports(reports.filter(r => r.filename !== filename));
      } else {
        alert("Erreur : " + json.error);
      }
    } catch (err) {
      console.error("Erreur suppression :", err);
      alert("Erreur de suppression");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports de Sécurité</h1>
          <p className="text-gray-600 mt-1">Accédez aux rapports archivés (.html, .pdf, .txt, .json)</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un rapport..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Rapports ({loading ? '...' : filteredReports.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Chargement des rapports...</span>
          </div>
        ) : filteredReports.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredReports.map((report, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{report.filename}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {report.created_at
                        ? format(new Date(report.created_at), 'PPPpp')
                        : 'Date inconnue'}
                    </p>
                    <p className="text-sm text-gray-500">Cible : {report.target}</p>
                    <p className="text-sm text-gray-500 capitalize">Statut : {report.status}</p>
                  </div>

                  <div className="flex items-center space-x-2 ml-6 relative">
                    <button
                      onClick={() => setDownloadOpenIndex(downloadOpenIndex === index ? null : index)}
                      className="flex items-center px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition duration-200 text-sm font-medium"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Télécharger
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>

                    {downloadOpenIndex === index && (
                      <div className="absolute top-10 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        {['pdf', 'html', 'txt', 'json'].map(format => (
                          <button
                            key={format}
                            onClick={() => {
                              setDownloadOpenIndex(null);
                              handleDownload(report.filename, format);
                            }}
                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                          >
                            {format.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => handleDelete(report.filename)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun rapport trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
