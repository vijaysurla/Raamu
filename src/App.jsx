import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import ChapterView from './pages/ChapterView';
import ExperimentAdmin from './pages/ExperimentAdmin';
import { LanguageProvider } from './context/LanguageContext';
import { UserProvider } from './context/UserContext';
import { ProgressProvider } from './context/ProgressContext';
import './styles/globals.css';

function AppLayout() {
  return (
    <div className="app-container">
      <Routes>
        {/* Landing page without header/sidebar */}
        <Route path="/" element={<Landing />} />

        {/* Dashboard with its own layout */}
        <Route path="/dashboard/*" element={<Dashboard />} />

        {/* Other app pages */}
        <Route path="/chat" element={<Chat />} />
        {/* Support both old and new URL structures for backward compatibility */}
        <Route path="/grade/:grade/:subject/chapters/:id" element={<ChapterView />} />
        <Route path="/chapters/:id" element={<ChapterView />} />
        <Route path="/admin/experiments" element={<ExperimentAdmin />} />
        <Route path="/progress" element={<div style={{ padding: '2rem' }}>Progress Page - Coming Soon</div>} />
        <Route path="/achievements" element={<div style={{ padding: '2rem' }}>Achievements Page - Coming Soon</div>} />
        <Route path="/profile" element={<div style={{ padding: '2rem' }}>Profile Page - Coming Soon</div>} />
        <Route path="/settings" element={<div style={{ padding: '2rem' }}>Settings Page - Coming Soon</div>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <LanguageProvider>
        <UserProvider>
          <ProgressProvider>
            <AppLayout />
          </ProgressProvider>
        </UserProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
