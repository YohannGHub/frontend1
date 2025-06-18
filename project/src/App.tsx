import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Dashboard from './pages/Dashboard';
// import Scanning from './pages/Scanning'; ❌ supprimé
import Enumeration from './pages/Enumeration';
import Vulnerabilities from './pages/Vulnerabilities';
import Exploits from './pages/Exploits';
import Reports from './pages/Reports';
import Tools from './pages/Tools';
import Plugins from './pages/Plugins';
import Settings from './pages/Settings';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          {/* <Route path="scanning" element={<Scanning />} /> ❌ supprimé */}
          <Route path="enumeration" element={<Enumeration />} />
          <Route path="vulnerabilities" element={<Vulnerabilities />} />
          <Route path="exploits" element={<Exploits />} />
          <Route path="reports" element={<Reports />} />
          <Route path="tools" element={<Tools />} />
          <Route path="plugins" element={<Plugins />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#363636', color: '#fff' },
        }}
      />
    </Router>
  );
}

export default App;
