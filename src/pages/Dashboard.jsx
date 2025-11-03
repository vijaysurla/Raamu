import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import TopBar from '../components/layout/TopBar';
import Sidebar from '../components/layout/Sidebar';
import './Dashboard.css';

// Mock data
const subjects = {
  8: [
    { name: 'Physics', icon: '⚡', chapters: 11, completed: 2, gradient: 'physics' }, // 6 chapters in Semester 1 + 5 chapters in Semester 2
    { name: 'Chemistry', icon: '🧪', chapters: 14, completed: 6, gradient: 'chemistry' },
    { name: 'Biology', icon: '🧬', chapters: 12, completed: 10, gradient: 'biology' },
    { name: 'Mathematics', icon: '📐', chapters: 16, completed: 8, gradient: 'maths' }
  ],
  9: [
    { name: 'Physics', icon: '⚡', chapters: 16, completed: 5, gradient: 'physics' },
    { name: 'Chemistry', icon: '🧪', chapters: 15, completed: 4, gradient: 'chemistry' },
    { name: 'Biology', icon: '🧬', chapters: 14, completed: 6, gradient: 'biology' },
    { name: 'Mathematics', icon: '📐', chapters: 18, completed: 7, gradient: 'maths' }
  ],
  10: [
    { name: 'Physics', icon: '⚡', chapters: 18, completed: 3, gradient: 'physics' },
    { name: 'Chemistry', icon: '🧪', chapters: 16, completed: 2, gradient: 'chemistry' },
    { name: 'Biology', icon: '🧬', chapters: 15, completed: 5, gradient: 'biology' },
    { name: 'Mathematics', icon: '📐', chapters: 20, completed: 4, gradient: 'maths' }
  ]
};

// Chapters organized by grade and subject
const chapters = {
  8: {
    'Physics': [
      { 
        number: 1, 
        semester: 1,
        title: 'Force and Pressure', 
        titleTe: 'బలం – ఒత్తిడి',
        activities: 15, 
        time: '45 min', 
        progress: 100, 
        status: 'completed' 
      },
      { 
        number: 2, 
        semester: 1,
        title: 'Friction', 
        titleTe: 'ఘర్షణ',
        activities: 12, 
        time: '40 min', 
        progress: 65, 
        status: 'in-progress' 
      },
      { 
        number: 3, 
        semester: 1,
        title: 'Coal and Petroleum', 
        titleTe: 'బొగ్గు – పెట్రోలియం',
        activities: 10, 
        time: '35 min', 
        progress: 0, 
        status: 'not-started' 
      },
      { 
        number: 4, 
        semester: 1,
        title: 'Synthetic Fibres and Plastics', 
        titleTe: 'కృత్రిమ దారాలు – ప్లాస్టిక్లు',
        activities: 14, 
        time: '50 min', 
        progress: 0, 
        status: 'not-started' 
      },
      { 
        number: 5, 
        semester: 1,
        title: 'Sound', 
        titleTe: 'ధ్వని',
        activities: 10, 
        time: '35 min', 
        progress: 0, 
        status: 'not-started' 
      },
      { 
        number: 6, 
        semester: 1,
        title: 'Materials: Metals and Non-Metals', 
        titleTe: 'పదార్థాలు : లోహాలు – అలోహాలు',
        activities: 12, 
        time: '42 min', 
        progress: 0, 
        status: 'not-started' 
      },
      // Semester 2 chapters
      { 
        number: 7, 
        semester: 2,
        title: 'Light', 
        titleTe: 'కాంతి',
        activities: 16, 
        time: '55 min', 
        progress: 0, 
        status: 'not-started' 
      },
      { 
        number: 8, 
        semester: 2,
        title: 'Chemical Effects of Electric Current', 
        titleTe: 'విద్యుత్ ప్రభావం – రసాయన ఫలితం',
        activities: 14, 
        time: '50 min', 
        progress: 0, 
        status: 'not-started' 
      },
      { 
        number: 9, 
        semester: 2,
        title: 'Some Natural Phenomena', 
        titleTe: 'కొన్ని సహజ దృగ్విషయాలు',
        activities: 11, 
        time: '38 min', 
        progress: 0, 
        status: 'not-started' 
      },
      { 
        number: 10, 
        semester: 2,
        title: 'Combustion and Flame', 
        titleTe: 'దహనము – జ్వాల',
        activities: 10, 
        time: '40 min', 
        progress: 0, 
        status: 'not-started' 
      },
      { 
        number: 11, 
        semester: 2,
        title: 'Stars and the Solar System', 
        titleTe: 'నక్షత్రాలు – సౌరమండలం',
        activities: 13, 
        time: '48 min', 
        progress: 0, 
        status: 'not-started' 
      },
    ],
  },
  // Keep other subjects as fallback
  'Physics': [
    { number: 1, title: 'Force', activities: 15, time: '45 min', progress: 100, status: 'completed' },
    { number: 2, title: 'Friction', activities: 12, time: '40 min', progress: 65, status: 'in-progress' },
  ],
  'Chemistry': [
    { number: 1, title: 'Synthetic Fibres and Plastics', activities: 8, time: '30 min', progress: 100, status: 'completed' },
    { number: 2, title: 'Metals and Non-Metals', activities: 12, time: '45 min', progress: 45, status: 'in-progress' },
    { number: 3, title: 'Coal and Petroleum', activities: 9, time: '35 min', progress: 0, status: 'not-started' },
    { number: 4, title: 'Combustion and Flame', activities: 10, time: '40 min', progress: 0, status: 'not-started' },
  ],
  'Biology': [
    { number: 1, title: 'Crop Production and Management', activities: 10, time: '40 min', progress: 100, status: 'completed' },
    { number: 2, title: 'Microorganisms', activities: 11, time: '42 min', progress: 100, status: 'completed' },
    { number: 3, title: 'Cell - Structure and Functions', activities: 13, time: '48 min', progress: 80, status: 'in-progress' },
    { number: 4, title: 'Reproduction in Animals', activities: 12, time: '45 min', progress: 0, status: 'not-started' },
  ],
  'Mathematics': [
    { number: 1, title: 'Rational Numbers', activities: 20, time: '60 min', progress: 100, status: 'completed' },
    { number: 2, title: 'Linear Equations in One Variable', activities: 18, time: '55 min', progress: 70, status: 'in-progress' },
    { number: 3, title: 'Understanding Quadrilaterals', activities: 15, time: '50 min', progress: 0, status: 'not-started' },
    { number: 4, title: 'Practical Geometry', activities: 16, time: '52 min', progress: 0, status: 'not-started' },
  ]
};

export default function Dashboard() {
  const { user } = useUser();
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentGrade, setCurrentGrade] = useState(null);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1200);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1200) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const view = searchParams.get('view');
    const grade = searchParams.get('grade');
    
    if (view === 'grades') {
      setCurrentView('grades');
    } else if (view === 'subjects' && grade) {
      setCurrentView('subjects');
      setCurrentGrade(parseInt(grade));
    } else if (view === 'chapters' && grade && searchParams.get('subject')) {
      setCurrentView('chapters');
      setCurrentGrade(parseInt(grade));
      setCurrentSubject(searchParams.get('subject'));
    } else {
      setCurrentView('dashboard');
    }
  }, [searchParams]);

  const showGradeSubjects = (grade) => {
    navigate(`/dashboard?view=subjects&grade=${grade}`);
  };

  const showChapters = (subject, grade) => {
    navigate(`/dashboard?view=chapters&grade=${grade}&subject=${subject}`);
  };

  const updateBreadcrumbs = () => {
    if (currentView === 'dashboard') {
      return [{ label: 'Home', active: true }];
    } else if (currentView === 'grades') {
      return [
        { label: 'Home', path: '/dashboard' },
        { label: 'My Learning', active: true }
      ];
    } else if (currentView === 'subjects') {
      return [
        { label: 'Home', path: '/dashboard' },
        { label: 'My Learning', path: '/dashboard?view=grades' },
        { label: `Grade ${currentGrade}`, active: true }
      ];
    } else if (currentView === 'chapters') {
      return [
        { label: 'Home', path: '/dashboard' },
        { label: 'My Learning', path: '/dashboard?view=grades' },
        { label: `Grade ${currentGrade}`, path: `/dashboard?view=subjects&grade=${currentGrade}` },
        { label: currentSubject, active: true }
      ];
    }
    return [{ label: 'Dashboard', active: true }];
  };

  const goBack = () => {
    if (currentView === 'chapters') {
      navigate(`/dashboard?view=subjects&grade=${currentGrade}`);
    } else if (currentView === 'subjects') {
      navigate('/dashboard?view=grades');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="app">
      <Sidebar 
        currentView={currentView} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="main-content">
        <TopBar 
          breadcrumbs={updateBreadcrumbs()} 
          searchValue={searchValue}
          onSearch={setSearchValue}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="content-area">
          {/* Dashboard View */}
          {currentView === 'dashboard' && (
            <div id="dashboard" className="view active">
              <div className="welcome-banner">
                <div className="welcome-text">
                  <h1>Welcome back, {user?.name || 'Priya'}! 👋</h1>
                  <p>Ready to continue your learning journey?</p>
                </div>
                <div className="welcome-illustration">📚</div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon" style={{background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))', color: 'white'}}>
                    📖
                  </div>
                  <div className="stat-value">24</div>
                  <div className="stat-label">Chapters Completed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{background: 'linear-gradient(135deg, var(--secondary-500), var(--info-500))', color: 'white'}}>
                    🔬
                  </div>
                  <div className="stat-value">18</div>
                  <div className="stat-label">Digital Twins Used</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{background: 'linear-gradient(135deg, var(--warning-500), var(--error-500))', color: 'white'}}>
                    ✅
                  </div>
                  <div className="stat-value">32</div>
                  <div className="stat-label">Tests Completed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{background: 'linear-gradient(135deg, var(--success-500), var(--secondary-500))', color: 'white'}}>
                    ⏱️
                  </div>
                  <div className="stat-value">48h</div>
                  <div className="stat-label">Time Spent Learning</div>
                </div>
              </div>

              <div className="section-header">
                <h2 className="section-title">Continue Learning</h2>
                <a href="#" className="view-all-link" onClick={(e) => { e.preventDefault(); navigate('/dashboard?view=grades'); }}>
                  View All →
                </a>
              </div>

              <div className="subjects-grid">
                {subjects[8].map((subject, idx) => {
                  const progress = Math.round((subject.completed / subject.chapters) * 100);
                  return (
                    <div key={idx} className="subject-card" onClick={() => showChapters(subject.name, 8)}>
                      <div className={`subject-header ${subject.gradient}`}>{subject.icon}</div>
                      <div className="subject-body">
                        <h3 className="subject-title">{subject.name}</h3>
                        <p className="subject-meta">Grade 8 • {subject.chapters} Chapters</p>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{width: `${progress}%`}}></div>
                        </div>
                        <div className="subject-stats">
                          <div className="subject-stat">
                            <div className="subject-stat-value">{subject.completed}</div>
                            <div className="subject-stat-label">Completed</div>
                          </div>
                          <div className="subject-stat">
                            <div className="subject-stat-value">{subject.chapters - subject.completed}</div>
                            <div className="subject-stat-label">Remaining</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Grade Selection View */}
          {currentView === 'grades' && (
            <div id="grades" className="view active">
              <div className="section-header">
                <h2 className="section-title">Select Your Grade</h2>
              </div>

              <div className="grade-grid">
                {[8, 9, 10, 11, 12].map((grade) => {
                  const progress = grade <= 10 ? [65, 42, 28, 0, 0][grade - 8] : 0;
                  return (
                    <div key={grade} className="grade-card" onClick={() => showGradeSubjects(grade)}>
                      <div className="grade-icon">{['8️⃣', '9️⃣', '🔟', '1️⃣1️⃣', '1️⃣2️⃣'][grade - 8]}</div>
                      <div className="grade-number">{grade}</div>
                      <div className="grade-label">Grade {['Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'][grade - 8]}</div>
                      <div className="grade-progress">{progress}% Complete</div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: `${progress}%`}}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Subjects View */}
          {currentView === 'subjects' && currentGrade && (
            <div id="subjects" className="view active">
              <div className="section-header">
                <h2 className="section-title">Grade {currentGrade} - Subjects</h2>
                <button className="btn btn-secondary" onClick={goBack}>← Back to Grades</button>
              </div>

              <div className="subjects-grid">
                {(subjects[currentGrade] || []).map((subject, idx) => {
                  const progress = Math.round((subject.completed / subject.chapters) * 100);
                  return (
                    <div key={idx} className="subject-card" onClick={() => showChapters(subject.name, currentGrade)}>
                      <div className={`subject-header ${subject.gradient}`}>{subject.icon}</div>
                      <div className="subject-body">
                        <h3 className="subject-title">{subject.name}</h3>
                        <p className="subject-meta">Grade {currentGrade} • {subject.chapters} Chapters</p>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{width: `${progress}%`}}></div>
                        </div>
                        <div className="subject-stats">
                          <div className="subject-stat">
                            <div className="subject-stat-value">{subject.completed}</div>
                            <div className="subject-stat-label">Completed</div>
                          </div>
                          <div className="subject-stat">
                            <div className="subject-stat-value">{subject.chapters - subject.completed}</div>
                            <div className="subject-stat-label">Remaining</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Chapters View */}
          {currentView === 'chapters' && currentSubject && (
            <div id="chapters" className="view active">
              <div className="section-header">
                <h2 className="section-title">{currentSubject} - Chapters</h2>
                <button className="btn btn-secondary" onClick={goBack}>← Back</button>
              </div>

              <div className="chapter-list">
                {(() => {
                  // Get chapters based on grade and subject
                  let chapterList = [];
                  if (currentGrade && chapters[currentGrade] && chapters[currentGrade][currentSubject]) {
                    chapterList = chapters[currentGrade][currentSubject];
                  } else if (chapters[currentSubject]) {
                    chapterList = chapters[currentSubject];
                  }
                  
                  // Group by semester if available
                  const bySemester = chapterList.some(ch => ch.semester);
                  const semesterGroups = bySemester 
                    ? chapterList.reduce((acc, ch) => {
                        const sem = ch.semester || 1;
                        if (!acc[sem]) acc[sem] = [];
                        acc[sem].push(ch);
                        return acc;
                      }, {})
                    : { 1: chapterList };
                  
                  return Object.entries(semesterGroups).map(([semester, semChapters]) => (
                    <div key={semester}>
                      {bySemester && (
                        <h3 className="semester-title" style={{marginTop: semester > 1 ? '2rem' : '0', marginBottom: '1rem', color: 'var(--gray-700)', fontSize: '1.125rem', fontWeight: 600}}>
                          Semester {semester}
                        </h3>
                      )}
                      {semChapters.map((chapter, idx) => {
                        const progressDeg = (chapter.progress / 100) * 360;
                        const title = language === 'te' && chapter.titleTe ? chapter.titleTe : chapter.title;
                        return (
                          <div key={idx} className="chapter-item" onClick={() => navigate(`/grade/${currentGrade}/${currentSubject}/chapters/${chapter.number}`)}>
                            <div className="chapter-number">{chapter.number}</div>
                            <div className="chapter-content">
                              <div className="chapter-title">{title}</div>
                              <div className="chapter-meta">
                                <div className="chapter-meta-item">
                                  <span>🔬</span>
                                  <span>{chapter.activities} Activities</span>
                                </div>
                                <div className="chapter-meta-item">
                                  <span>⏱️</span>
                                  <span>{chapter.time}</span>
                                </div>
                              </div>
                            </div>
                            <div className="chapter-progress-info">
                              <span className={`chapter-status ${chapter.status}`}>
                                {chapter.status === 'completed' ? '✓ Completed' : 
                                 chapter.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                              </span>
                              <div className="circular-progress" style={{background: `conic-gradient(var(--primary-600) ${progressDeg}deg, var(--gray-200) 0deg)`}}>
                                <span style={{position: 'relative', zIndex: 1}}>{chapter.progress}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
