import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  Shield, Search, Bug, Zap, FileText, Settings, Menu, X, Activity, 
  Target, Wrench, Server, LogOut, User
} from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAuth } from '../utils/authFetch';
import toast from 'react-hot-toast';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { isConnected, lastMessage } = useWebSocket();
  const { logout } = useAuth();

  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'scan_completed':
          toast.success(`Scan terminé: ${lastMessage.data.target}`);
          break;
        case 'vulnerability_found':
          toast.error(`Vulnérabilité trouvée: ${lastMessage.data.title}`);
          break;
        case 'exploit_completed':
          toast.success(`Exploit terminé: ${lastMessage.data.target}`);
          break;
        case 'report_generated':
          toast.success(`Rapport généré: ${lastMessage.data.title}`);
          break;
        default:
          break;
      }
    }
  }, [lastMessage]);

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Activity },
    // { name: 'Scanning', href: '/scanning', icon: Search }, ❌ supprimé
    { name: 'Enumeration', href: '/enumeration', icon: Target },
    { name: 'Vulnerabilities', href: '/vulnerabilities', icon: Bug },
    { name: 'Exploits', href: '/exploits', icon: Zap },
    { name: 'Tools', href: '/tools', icon: Wrench },
    { name: 'Plugins', href: '/plugins', icon: Server },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 bg-gray-800">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-red-500" />
            <span className="text-xl font-bold text-white">PenTest Toolbox</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive 
                        ? 'bg-red-600 text-white shadow-lg' 
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-red-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">PenTester</p>
                  <p className="text-gray-400 text-xs">Security Expert</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                title="Se déconnecter"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span className="text-sm">Déconnexion</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-4">
          {children}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
