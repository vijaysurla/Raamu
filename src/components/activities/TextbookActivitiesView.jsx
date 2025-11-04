import React, { useState, useMemo } from 'react';
import { Book, Beaker, MessageSquare } from 'lucide-react';
import { Card } from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { useLanguage } from '../../context/LanguageContext';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Import all activity components
import { 
  Activity_1_1, 
  Activity_1_2, 
  Activity_1_3, 
  Activity_1_4 
} from './ActivityComponents_Part1';

import { 
  Activity_1_5, 
  Activity_1_6, 
  Activity_1_7 
} from './ActivityComponents_Part2';

import { 
  Activity_1_8, 
  Activity_1_9, 
  Activity_1_10, 
  Activity_1_11 
} from './ActivityComponents_Part3';

// Import styles
import './TextbookActivitiesView.css';
import './ActivityComponents.css';

// Textbook activities data
const textbookActivities = [
  {
    id: 'activity-1.1',
    number: '1.1',
    title: 'Identifying Actions as Push or Pull',
    titleTelugu: 'చర్యలను నెట్టడం లేదా లాగడం గా వర్గీకరించడం',
    page: 3,
    pdfPages: [3, 4],
    component: Activity_1_1,
    type: 'force',
    difficulty: 'easy'
  },
  {
    id: 'activity-1.2',
    number: '1.2',
    title: 'Forces in Same and Opposite Directions',
    titleTelugu: 'ఒకే మరియు వ్యతిరేక దిశలలో బలాలు',
    page: 7,
    pdfPages: [7, 8],
    component: Activity_1_2,
    type: 'force',
    difficulty: 'medium'
  },
  {
    id: 'activity-1.3',
    number: '1.3',
    title: 'Force Effects on Motion',
    titleTelugu: 'చలనంపై బలం ప్రభావాలు',
    page: 9,
    pdfPages: [9, 10],
    component: Activity_1_3,
    type: 'force',
    difficulty: 'medium'
  },
  {
    id: 'activity-1.4',
    number: '1.4',
    title: 'Changing Direction with Force',
    titleTelugu: 'బలంతో దిశ మార్చడం',
    page: 11,
    pdfPages: [11, 12],
    component: Activity_1_4,
    type: 'force',
    difficulty: 'medium'
  },
  {
    id: 'activity-1.5',
    number: '1.5',
    title: 'Force Can Change Shape',
    titleTelugu: 'బలం ఆకారాన్ని మార్చగలదు',
    page: 13,
    pdfPages: [13, 14],
    component: Activity_1_5,
    type: 'force',
    difficulty: 'easy'
  },
  {
    id: 'activity-1.6',
    number: '1.6',
    title: 'Magnetic Force',
    titleTelugu: 'అయస్కాంత బలం',
    page: 17,
    pdfPages: [17, 18],
    component: Activity_1_6,
    type: 'non-contact',
    difficulty: 'medium'
  },
  {
    id: 'activity-1.7',
    number: '1.7',
    title: 'Electrostatic Force',
    titleTelugu: 'స్థిర విద్యుత్ బలం',
    page: 19,
    pdfPages: [19, 20],
    component: Activity_1_7,
    type: 'non-contact',
    difficulty: 'medium'
  },
  {
    id: 'activity-1.8',
    number: '1.8',
    title: 'Liquid Pressure vs Height',
    titleTelugu: 'ద్రవ పీడనం vs ఎత్తు',
    page: 23,
    pdfPages: [23, 24],
    component: Activity_1_8,
    type: 'pressure',
    difficulty: 'medium'
  },
  {
    id: 'activity-1.9',
    number: '1.9',
    title: 'Liquid Pressure on Walls',
    titleTelugu: 'గోడలపై ద్రవ పీడనం',
    page: 24,
    pdfPages: [24, 25],
    component: Activity_1_9,
    type: 'pressure',
    difficulty: 'medium'
  },
  {
    id: 'activity-1.10',
    number: '1.10',
    title: 'Equal Pressure at Same Depth',
    titleTelugu: 'ఒకే లోతులో సమాన పీడనం',
    page: 25,
    pdfPages: [25, 26],
    component: Activity_1_10,
    type: 'pressure',
    difficulty: 'medium'
  },
  {
    id: 'activity-1.11',
    number: '1.11',
    title: 'Atmospheric Pressure',
    titleTelugu: 'వాతావరణ పీడనం',
    page: 27,
    pdfPages: [27, 28],
    component: Activity_1_11,
    type: 'pressure',
    difficulty: 'hard'
  }
];

export default function TextbookActivitiesView({ pdfFile, currentPdfPage, zoom, onActivityPageChange }) {
  const { language } = useLanguage();
  
  // State management
  const [activeActivity, setActiveActivity] = useState(textbookActivities[0]);
  const [completedActivities, setCompletedActivities] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  // Memoize Document options to prevent Transport destroyed errors
  const documentOptions = useMemo(() => ({
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296/standard_fonts/',
    verbosity: 0,
    useSystemFonts: false,
    disableAutoFetch: false,
    disableStream: false,
  }), []);

  // Get activity component
  const ActivityComponent = activeActivity.component;

  // Progress calculation
  const progress = {
    completed: completedActivities.length,
    total: textbookActivities.length,
    percentage: Math.round((completedActivities.length / textbookActivities.length) * 100)
  };

  // Filter activities by type
  const forceActivities = textbookActivities.filter(a => a.type === 'force');
  const nonContactActivities = textbookActivities.filter(a => a.type === 'non-contact');
  const pressureActivities = textbookActivities.filter(a => a.type === 'pressure');

  // Handle activity selection
  const handleActivitySelect = (activity) => {
    setActiveActivity(activity);
    // Update PDF page to show activity page
    if (onActivityPageChange) {
      // Convert logical page to physical PDF page based on language
      // Activity page numbers are logical pages (1, 2, 3...)
      // Convert to physical PDF pages (1,3,5... for EN, 2,4,6... for TE)
      const physicalPage = language === 'en' 
        ? (activity.page * 2 - 1)  // English: odd pages (1→1, 2→3, 3→5)
        : (activity.page * 2);      // Telugu: even pages (1→2, 2→4, 3→6)
      onActivityPageChange(physicalPage);
    }
    setShowSidebar(false);
  };

  // Mark activity as complete
  const markComplete = (activityId) => {
    if (!completedActivities.includes(activityId)) {
      setCompletedActivities([...completedActivities, activityId]);
    }
  };

  // Calculate PDF page for current activity
  const getActivityPdfPage = () => {
    const logicalPage = activeActivity.page;
    return language === 'en' 
      ? (logicalPage * 2 - 1)  // English: odd pages
      : (logicalPage * 2);      // Telugu: even pages
  };

  return (
    <div className="textbook-activities-view">
      {/* Header */}
      <div className="chapter-header">
        <div className="chapter-info">
          <Badge variant="primary">Class 8 Physics</Badge>
          <h1>
            {language === 'en' 
              ? 'Chapter 1: Force and Pressure'
              : 'అధ్యాయం 1: బలం మరియు పీడనం'}
          </h1>
          
          <div className="progress-indicator">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <span className="progress-text">
              {progress.completed}/{progress.total} {language === 'en' ? 'Activities Completed' : 'కార్యకలాపాలు పూర్తయ్యాయి'}
            </span>
          </div>
        </div>

        <div className="header-actions">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <Beaker size={20} />
            {language === 'en' ? 'All Activities' : 'అన్ని కార్యకలాపాలు'} ({textbookActivities.length})
          </Button>
        </div>
      </div>

      {/* Three-Pane Layout */}
      <div className="three-pane-layout">
        {/* LEFT PANE: PDF Viewer */}
        <div className="pane pdf-pane">
          <Card className="pane-card">
            <div className="pane-header">
              <h2>
                <Book size={20} />
                {language === 'en' ? 'Textbook' : 'పాఠ్యపుస్తకం'}
              </h2>
              <Badge variant="secondary">
                {language === 'en' ? 'Page' : 'పేజీ'} {activeActivity.page}
              </Badge>
            </div>
            <div className="pdf-viewer">
              {pdfFile && (
                <Document
                  file={pdfFile}
                  options={documentOptions}
                  loading={
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                      <p>{language === 'en' ? 'Loading PDF...' : 'PDF లోడ్ అవుతోంది...'}</p>
                    </div>
                  }
                  error={
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                      <p>{language === 'en' ? 'Failed to load PDF' : 'PDF లోడ్ చేయడంలో విఫలమైంది'}</p>
                    </div>
                  }
                >
                  {getActivityPdfPage() > 0 && (
                    <Page
                      pageNumber={getActivityPdfPage()}
                      scale={zoom / 100}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      width={400}
                      className="pdf-page"
                    />
                  )}
                </Document>
              )}
            </div>
          </Card>
        </div>

        {/* CENTER PANE: Interactive Activity */}
        <div className="pane activity-pane">
          <Card className="pane-card">
            <div className="pane-header">
              <div>
                <h2>
                  <Beaker size={20} />
                  {language === 'en' ? `Activity ${activeActivity.number}` : `కార్యకలాపం ${activeActivity.number}`}
                </h2>
                <p className="activity-subtitle">
                  {language === 'en' ? activeActivity.title : activeActivity.titleTelugu}
                </p>
              </div>
              {!completedActivities.includes(activeActivity.id) && (
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => markComplete(activeActivity.id)}
                >
                  ✓ {language === 'en' ? 'Mark Complete' : 'పూర్తయ్యిందిగా గుర్తించండి'}
                </Button>
              )}
              {completedActivities.includes(activeActivity.id) && (
                <Badge variant="success" size="lg">
                  ✓ {language === 'en' ? 'Completed' : 'పూర్తయింది'}
                </Badge>
              )}
            </div>

            <div className="activity-content">
              {/* Render the actual activity component */}
              <ActivityComponent language={language} />
            </div>
          </Card>
        </div>

        {/* RIGHT PANE: AI Tutor */}
        <div className="pane chat-pane">
          <Card className="pane-card">
            <div className="pane-header">
              <h2>
                <span>🤖</span>
                {language === 'en' ? 'Ask Raamu' : 'రాముని అడగండి'}
              </h2>
            </div>
            <div className="chat-content">
              <div className="context-info">
                <p>
                  💡 {language === 'en' 
                    ? `Help with Activity ${activeActivity.number}: ${activeActivity.title}` 
                    : `కార్యకలాపం ${activeActivity.number}కి సహాయం: ${activeActivity.titleTelugu}`}
                </p>
              </div>

              <div className="suggested-questions">
                <h5>{language === 'en' ? 'Quick Questions:' : 'త్వరిత ప్రశ్నలు:'}</h5>
                <button className="question-chip">
                  {language === 'en' ? 'Explain this activity' : 'ఈ కార్యకలాపాన్ని వివరించండి'}
                </button>
                <button className="question-chip">
                  {language === 'en' ? 'What should I observe?' : 'నేను ఏమి గమనించాలి?'}
                </button>
                <button className="question-chip">
                  {language === 'en' ? 'Why does this happen?' : 'ఇది ఎందుకు జరుగుతుంది?'}
                </button>
                <button className="question-chip">
                  {language === 'en' ? 'Give real-life examples' : 'నిజ జీవిత ఉదాహరణలు ఇవ్వండి'}
                </button>
              </div>

              <div className="chat-messages">
                <div className="message bot-message">
                  <div className="message-avatar">R</div>
                  <div className="message-content">
                    <p>
                      {language === 'en'
                        ? `I can help you understand Activity ${activeActivity.number}. What would you like to know?`
                        : `కార్యకలాపం ${activeActivity.number}ని అర్థం చేసుకోవడంలో నేను మీకు సహాయం చేయగలను. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="chat-input-area">
                <input 
                  type="text" 
                  placeholder={language === 'en' ? 'Ask about this activity...' : 'ఈ కార్యకలాపం గురించి అడగండి...'}
                  className="input"
                />
                <Button size="sm">
                  {language === 'en' ? 'Send' : 'పంపు'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Activities Sidebar */}
      {showSidebar && (
        <div className="activities-sidebar">
          <div className="sidebar-header">
            <h3>
              {language === 'en' ? 'All Activities' : 'అన్ని కార్యకలాపాలు'}
            </h3>
            <button onClick={() => setShowSidebar(false)}>×</button>
          </div>

          <div className="activities-list">
            {/* Force Activities */}
            <div className="activity-category">
              <h4 className="category-title">
                💪 {language === 'en' ? 'Force Activities (1.1 - 1.5)' : 'బల కార్యకలాపాలు (1.1 - 1.5)'}
              </h4>
              {forceActivities.map((activity) => (
                <button
                  key={activity.id}
                  className={`activity-item ${activeActivity.id === activity.id ? 'active' : ''} ${completedActivities.includes(activity.id) ? 'completed' : ''}`}
                  onClick={() => handleActivitySelect(activity)}
                >
                  <div className="activity-number">
                    {completedActivities.includes(activity.id) ? '✓' : activity.number}
                  </div>
                  <div className="activity-details">
                    <div className="activity-title">
                      {language === 'en' ? activity.title : activity.titleTelugu}
                    </div>
                    <div className="activity-meta">
                      📖 {language === 'en' ? 'Page' : 'పేజీ'} {activity.page}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Non-Contact Force Activities */}
            <div className="activity-category">
              <h4 className="category-title">
                🧲 {language === 'en' ? 'Non-Contact Forces (1.6 - 1.7)' : 'సంపర్క రహిత బలాలు (1.6 - 1.7)'}
              </h4>
              {nonContactActivities.map((activity) => (
                <button
                  key={activity.id}
                  className={`activity-item ${activeActivity.id === activity.id ? 'active' : ''} ${completedActivities.includes(activity.id) ? 'completed' : ''}`}
                  onClick={() => handleActivitySelect(activity)}
                >
                  <div className="activity-number">
                    {completedActivities.includes(activity.id) ? '✓' : activity.number}
                  </div>
                  <div className="activity-details">
                    <div className="activity-title">
                      {language === 'en' ? activity.title : activity.titleTelugu}
                    </div>
                    <div className="activity-meta">
                      📖 {language === 'en' ? 'Page' : 'పేజీ'} {activity.page}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Pressure Activities */}
            <div className="activity-category">
              <h4 className="category-title">
                💧 {language === 'en' ? 'Pressure Activities (1.8 - 1.11)' : 'పీడన కార్యకలాపాలు (1.8 - 1.11)'}
              </h4>
              {pressureActivities.map((activity) => (
                <button
                  key={activity.id}
                  className={`activity-item ${activeActivity.id === activity.id ? 'active' : ''} ${completedActivities.includes(activity.id) ? 'completed' : ''}`}
                  onClick={() => handleActivitySelect(activity)}
                >
                  <div className="activity-number">
                    {completedActivities.includes(activity.id) ? '✓' : activity.number}
                  </div>
                  <div className="activity-details">
                    <div className="activity-title">
                      {language === 'en' ? activity.title : activity.titleTelugu}
                    </div>
                    <div className="activity-meta">
                      📖 {language === 'en' ? 'Page' : 'పేజీ'} {activity.page}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

