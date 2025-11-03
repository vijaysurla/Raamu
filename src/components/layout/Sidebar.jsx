import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './Sidebar.css';

export default function Sidebar({ currentView = 'dashboard', isOpen, onClose }) {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleNavClick = (view) => {
    if (view === 'dashboard') {
      navigate('/dashboard');
    } else if (view === 'grades') {
      navigate('/dashboard?view=grades');
    } else if (view.startsWith('grade-')) {
      const grade = view.replace('grade-', '');
      navigate(`/dashboard?view=subjects&grade=${grade}`);
    }
    if (onClose) onClose();
  };

  return (
    <>
      {isOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <Link to="/dashboard" className="logo">
          <div className="logo-icon">🎓</div>
          <span className="logo-text">Raamu</span>
        </Link>
      </div>

      <div className="user-profile">
        <div className="user-avatar">
          {user?.name?.charAt(0) || 'P'}
        </div>
        <div className="user-info">
          <h3>{user?.name || 'Priya Sharma'}</h3>
          <p>{user?.grade ? `Grade ${user.grade} - ${user.stream || 'MPC'} Stream` : 'Grade 10 - MPC Stream'}</p>
        </div>
      </div>

      <nav className="nav-menu">
        <div className="nav-section">
          <div 
            className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            <span className="nav-icon">🏠</span>
            <span>Dashboard</span>
          </div>
          <div 
            className={`nav-item ${currentView === 'grades' ? 'active' : ''}`}
            onClick={() => handleNavClick('grades')}
          >
            <span className="nav-icon">📚</span>
            <span>My Learning</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">🎯</span>
            <span>Progress</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">🔬</span>
            <span>Digital Twins</span>
            <span className="nav-badge">12</span>
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Quick Access</div>
          <div 
            className={`nav-item ${currentView === 'grade-8' ? 'active' : ''}`}
            onClick={() => handleNavClick('grade-8')}
          >
            <span className="nav-icon">8️⃣</span>
            <span>Grade 8</span>
          </div>
          <div 
            className={`nav-item ${currentView === 'grade-9' ? 'active' : ''}`}
            onClick={() => handleNavClick('grade-9')}
          >
            <span className="nav-icon">9️⃣</span>
            <span>Grade 9</span>
          </div>
          <div 
            className={`nav-item ${currentView === 'grade-10' ? 'active' : ''}`}
            onClick={() => handleNavClick('grade-10')}
          >
            <span className="nav-icon">🔟</span>
            <span>Grade 10</span>
          </div>
          <div 
            className={`nav-item ${currentView === 'grade-11' ? 'active' : ''}`}
            onClick={() => handleNavClick('grade-11')}
          >
            <span className="nav-icon">1️⃣1️⃣</span>
            <span>Grade 11</span>
          </div>
          <div 
            className={`nav-item ${currentView === 'grade-12' ? 'active' : ''}`}
            onClick={() => handleNavClick('grade-12')}
          >
            <span className="nav-icon">1️⃣2️⃣</span>
            <span>Grade 12</span>
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Account</div>
          <Link to="/settings" className="nav-item">
            <span className="nav-icon">⚙️</span>
            <span>Settings</span>
          </Link>
          <Link to="/chat" className="nav-item">
            <span className="nav-icon">💬</span>
            <span>AI Chat History</span>
          </Link>
          <div className="nav-item">
            <span className="nav-icon">❓</span>
            <span>Help & Support</span>
          </div>
        </div>
      </nav>
    </aside>
    </>
  );
}
