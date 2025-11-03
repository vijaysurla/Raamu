import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './TopBar.css';

export default function TopBar({ breadcrumbs, onSearch, searchValue, onMenuToggle }) {
  const { language, toggleLanguage } = useLanguage();

  const handleBreadcrumbClick = (e, path) => {
    e.preventDefault();
    if (path) {
      window.location.href = path;
    }
  };

  return (
    <div className="top-bar">
      {onMenuToggle && (
        <button className="menu-toggle-btn" onClick={onMenuToggle}>
          ☰
        </button>
      )}
      <div className="breadcrumbs" id="breadcrumbs">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className="breadcrumb-separator">›</span>}
            {crumb.path ? (
              <a 
                href={crumb.path} 
                className={`breadcrumb-item ${crumb.active ? 'active' : ''}`}
                onClick={(e) => handleBreadcrumbClick(e, crumb.path)}
              >
                {crumb.label}
              </a>
            ) : (
              <span className={`breadcrumb-item ${crumb.active ? 'active' : ''}`}>
                {crumb.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="top-bar-actions">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search chapters, topics, concepts..."
            value={searchValue || ''}
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>
        <div className="language-toggle">
          <button 
            className={`lang-option ${language === 'en' ? 'active' : ''}`}
            onClick={() => language !== 'en' && toggleLanguage()}
          >
            EN
          </button>
          <button 
            className={`lang-option ${language === 'te' ? 'active' : ''}`}
            onClick={() => language !== 'te' && toggleLanguage()}
          >
            TE
          </button>
        </div>
        <button className="icon-btn" title="Notifications">
          🔔
        </button>
      </div>
    </div>
  );
}

