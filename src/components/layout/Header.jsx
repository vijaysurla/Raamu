import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, User, Globe } from 'lucide-react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import './Header.css';

export default function Header({ onMenuToggle, user, language, onLanguageToggle }) {
  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="menu-button"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>

        <Link to="/" className="logo">
          <div className="logo-icon">R</div>
          <span className="logo-text">Raamu</span>
        </Link>
      </div>

      <div className="header-right">
        <button 
          className="header-icon-button"
          onClick={onLanguageToggle}
          title={`Switch to ${language === 'en' ? 'Telugu' : 'English'}`}
        >
          <Globe size={20} />
          <span className="language-label">
            {language === 'en' ? 'EN' : 'తె'}
          </span>
        </button>

        <button className="header-icon-button" title="Notifications">
          <Bell size={20} />
          <Badge variant="error" className="notification-badge">3</Badge>
        </button>

        <div className="user-menu">
          <Avatar 
            src={user?.avatar}
            initials={user?.name?.charAt(0) || 'U'}
            size="sm"
          />
        </div>
      </div>
    </header>
  );
}
