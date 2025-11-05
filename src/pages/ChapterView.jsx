import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Book, Beaker, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ArrowLeft, MessageSquare, X, FlaskConical, FileText } from 'lucide-react';
import { Card } from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { useSupplementalMaterials } from '../hooks/useSupplementalMaterials';
import TextbookActivitiesView from '../components/activities/TextbookActivitiesView';
import StudyGuide from '../components/study-guide/StudyGuide';
import './ChapterView.css';

// Configure PDF.js worker - MUST be done once at module load time
// Use local worker file served from public folder - most reliable approach
// This avoids CDN issues and ensures the worker is always available
if (typeof window !== 'undefined') {
  // Use absolute path to worker in public folder
  // Vite serves files from public/ with correct MIME types
  const workerUrl = `${window.location.origin}/pdf.worker.min.js`;
  
  // Only set if not already set to prevent re-initialization issues
  if (!pdfjs.GlobalWorkerOptions.workerSrc || 
      pdfjs.GlobalWorkerOptions.workerSrc !== workerUrl) {
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
    console.log('PDF.js worker configured (local file):', pdfjs.GlobalWorkerOptions.workerSrc);
  }
  
  console.log('PDF.js version:', pdfjs.version);
}

// Chapter metadata - maps chapter IDs to PDF files
const chapterMetadata = {
  8: {
    Physics: {
      1: {
  title: 'Force and Pressure',
        titleTelugu: 'బలం – ఒత్తిడి',
        pdfFile: '/assets/textbooks/class8_physics_ch1.pdf',
        totalPages: 38, // Physical pages in PDF
        logicalPages: 19 // Logical pages (EN/TE pairs)
      },
      2: {
        title: 'Friction',
        titleTelugu: 'ఘర్షణ',
        pdfFile: '/assets/textbooks/class8_physics_ch2.pdf',
        totalPages: 30, // Placeholder - update when you know actual page count
        logicalPages: 15 // Placeholder - update when you know actual page count
      },
      3: {
        title: 'Coal and Petroleum',
        titleTelugu: 'బొగ్గు – పెట్రోలియం',
        pdfFile: '/assets/textbooks/class8_physics_ch3.pdf',
        totalPages: 30, // Placeholder - update when you know actual page count
        logicalPages: 15 // Placeholder - update when you know actual page count
      },
      4: {
        title: 'Synthetic Fibres and Plastics',
        titleTelugu: 'కృత్రిమ దారాలు – ప్లాస్టిక్లు',
        pdfFile: '/assets/textbooks/class8_physics_ch4.pdf',
        totalPages: 30, // Placeholder - update when you know actual page count
        logicalPages: 15 // Placeholder - update when you know actual page count
      },
      5: {
        title: 'Sound',
        titleTelugu: 'ధ్వని',
        pdfFile: '/assets/textbooks/class8_physics_ch5.pdf',
        totalPages: 30, // Placeholder - update when you know actual page count
        logicalPages: 15 // Placeholder - update when you know actual page count
      },
      6: {
        title: 'Materials: Metals and Non-Metals',
        titleTelugu: 'పదార్థాలు : లోహాలు – అలోహాలు',
        pdfFile: '/assets/textbooks/class8_physics_ch6.pdf',
        totalPages: 30, // Placeholder - update when you know actual page count
        logicalPages: 15 // Placeholder - update when you know actual page count
      },
      // Semester 2 chapters
      7: {
        title: 'Light',
        titleTelugu: 'కాంతి',
        pdfFile: '/assets/textbooks/class8_physics_ch7.pdf',
        totalPages: 30, // Placeholder - update when you know actual page count
        logicalPages: 15 // Placeholder - update when you know actual page count
      },
      8: {
        title: 'Chemical Effects of Electric Current',
        titleTelugu: 'విద్యుత్ ప్రభావం – రసాయన ఫలితం',
        pdfFile: '/assets/textbooks/class8_physics_ch8.pdf',
        totalPages: 30, // Placeholder - update when you know actual page count
        logicalPages: 15 // Placeholder - update when you know actual page count
      },
      9: {
        title: 'Some Natural Phenomena',
        titleTelugu: 'కొన్ని సహజ దృగ్విషయాలు',
        pdfFile: '/assets/textbooks/class8_physics_ch9.pdf',
        totalPages: 30, // Placeholder - update when you know actual page count
        logicalPages: 15 // Placeholder - update when you know actual page count
      },
      10: {
        title: 'Combustion and Flame',
        titleTelugu: 'దహనము – జ్వాల',
        pdfFile: '/assets/textbooks/class8_physics_ch10.pdf',
        totalPages: 30, // Placeholder - update when you know actual page count
        logicalPages: 15 // Placeholder - update when you know actual page count
      },
      11: {
        title: 'Stars and the Solar System',
        titleTelugu: 'నక్షత్రాలు – సౌరమండలం',
        pdfFile: '/assets/textbooks/class8_physics_ch11.pdf',
        totalPages: 30, // Placeholder - update when you know actual page count
        logicalPages: 15 // Placeholder - update when you know actual page count
      }
    }
  }
};

export default function ChapterView() {
  const { id, grade: gradeParam, subject: subjectParam } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { language } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [showSupplemental, setShowSupplemental] = useState(false);
  const [controlValues, setControlValues] = useState({});
  const [activeTab, setActiveTab] = useState('textbook'); // 'textbook' | 'activities' | 'study-guide' | 'qa' | 'quiz'
  const [pdfError, setPdfError] = useState(null);
  const [workerReady, setWorkerReady] = useState(false);

  // Get chapter data from URL params or fallback to defaults
  const chapterNumber = parseInt(id) || 1;
  const grade = gradeParam ? parseInt(gradeParam) : (user?.grade || 8);
  const subject = subjectParam || 'Physics';
  
  const chapterData = chapterMetadata[grade]?.[subject]?.[chapterNumber];
  // Ensure PDF path is absolute and correct for Vite
  // Fallback to chapter 1 if chapter not found
  const pdfFile = chapterData?.pdfFile || `/assets/textbooks/class8_physics_ch${chapterNumber || 1}.pdf`;
  const totalLogicalPages = chapterData?.logicalPages || 19;

  // Debug logging
  useEffect(() => {
    console.log('ChapterView Debug:', {
      chapterId: id,
      chapterNumber,
      grade,
      subject,
      chapterData,
      pdfFile,
      userGrade: user?.grade
    });
  }, [id, chapterNumber, grade, subject, chapterData, pdfFile, user?.grade]);

  // Initialize worker ONCE on mount - don't re-initialize on PDF file changes
  // The worker should persist across page navigations within the same PDF
  useEffect(() => {
    setPdfError(null);
    
    // Ensure worker is properly configured - but only set it once
    // Re-setting the worker can cause connection issues
    if (typeof window !== 'undefined') {
      const absoluteWorkerUrl = `${window.location.origin}/pdf.worker.min.js`;
      
      // Only set worker if it's not already set or is different
      if (!pdfjs.GlobalWorkerOptions.workerSrc || 
          pdfjs.GlobalWorkerOptions.workerSrc !== absoluteWorkerUrl) {
        pdfjs.GlobalWorkerOptions.workerSrc = absoluteWorkerUrl;
        console.log('Worker configured in useEffect:', pdfjs.GlobalWorkerOptions.workerSrc);
      }
      
      // Verify it's absolute
      if (pdfjs.GlobalWorkerOptions.workerSrc && 
          !pdfjs.GlobalWorkerOptions.workerSrc.startsWith('http://') && 
          !pdfjs.GlobalWorkerOptions.workerSrc.startsWith('https://')) {
        console.error('Worker URL is not absolute! Fixing...');
        pdfjs.GlobalWorkerOptions.workerSrc = absoluteWorkerUrl;
      }
      
      // Worker should be ready
      setWorkerReady(true);
    } else {
      setWorkerReady(true);
    }
    
  }, []); // Empty dependency array - only run once on mount to initialize worker
  
  // Separate effect for PDF file validation (doesn't affect worker)
  useEffect(() => {
    // Test if PDF URL is accessible
    if (pdfFile) {
      fetch(pdfFile, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            console.log('PDF file is accessible at:', pdfFile);
          } else {
            console.warn('PDF file not accessible:', pdfFile, 'Status:', response.status);
          }
        })
        .catch(error => {
          console.error('Error checking PDF accessibility:', error);
        });
    }
  }, [pdfFile]); // Only check when PDF file changes

  // Load supplemental materials
  const { materials, loading: materialsLoading } = useSupplementalMaterials(chapterNumber, grade, subject);
  
  // Set default experiment
  const [activeExperiment, setActiveExperiment] = useState(null);
  
  // Memoize Document options to prevent unnecessary reloads
  // This is critical - recreating options on every render causes "Transport destroyed" errors
  const documentOptions = useMemo(() => ({
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296/standard_fonts/',
    verbosity: 0,
    useSystemFonts: false,
    disableAutoFetch: false,
    disableStream: false,
  }), []); // Empty deps - options never change

  useEffect(() => {
    if (materials?.experiments?.length > 0 && !activeExperiment) {
      setActiveExperiment(materials.experiments[0]);
      // Initialize control values
      const initialValues = {};
      materials.experiments[0].controls?.forEach(control => {
        initialValues[control.id] = control.default !== undefined ? control.default : (control.type === 'select' ? control.options[0] : control.min || 0);
      });
      setControlValues(initialValues);
    }
  }, [materials, activeExperiment]);

  // Calculate which PDF page to show based on language
  // English on odd pages (1, 3, 5...), Telugu on even pages (2, 4, 6...)
  const getPdfPage = (logicalPage) => {
    return language === 'en' ? (logicalPage * 2 - 1) : (logicalPage * 2);
  };

  const currentPdfPage = getPdfPage(currentPage);

  const nextPage = () => {
    if (currentPage < totalLogicalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalLogicalPages) {
      setCurrentPage(pageNum);
    }
  };

  const zoomIn = () => {
    if (zoom < 200) setZoom(zoom + 25);
  };

  const zoomOut = () => {
    if (zoom > 50) setZoom(zoom - 25);
  };

  const handleControlChange = (controlId, value) => {
    setControlValues(prev => ({
      ...prev,
      [controlId]: value
    }));
  };

  // Calculate measurements based on control values (placeholder calculations)
  const calculateMeasurements = () => {
    if (!activeExperiment) return {};
    
    const measurements = {};
    
    if (activeExperiment.id === 'exp-2') {
      // Pressure calculations
      const force = controlValues.force || 50;
      const area = controlValues.area || 10;
      const pressure = force / area;
      measurements.pressure = pressure.toFixed(2);
    }
    
    return measurements;
  };

  const measurements = calculateMeasurements();

  // Handle activity page change (for Activities view)
  const handleActivityPageChange = (physicalPage) => {
    // Calculate logical page from physical page
    const logicalPage = language === 'en' 
      ? Math.ceil(physicalPage / 2)  // English: odd pages (1,3,5...) → logical (1,2,3...)
      : Math.ceil(physicalPage / 2); // Telugu: even pages (2,4,6...) → logical (1,2,3...)
    setCurrentPage(logicalPage);
  };

  if (!chapterData) {
    return (
      <div className="chapter-view">
        <div className="chapter-header">
          <h1>Chapter Not Found</h1>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  // For chapter 1, show activities in middle pane instead of separate view
  // Remove the separate activities view mode

  return (
    <div className="chapter-view">
      {/* Chapter Header */}
      <div className="chapter-header">
        <div className="chapter-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={20} />
            </Button>
            <Badge variant="primary">Class {grade} Physics</Badge>
            <h1>
              Chapter {chapterNumber}: {language === 'en' ? chapterData.title : chapterData.titleTelugu}
          </h1>
          </div>
        </div>
        <div className="chapter-controls">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowSupplemental(!showSupplemental)}
          >
            <Beaker size={20} />
            {language === 'en' ? 'Supplemental Materials' : 'అనుబంధ పదార్థాలు'} 
            {materials?.experiments?.length > 0 && ` (${materials.experiments.length})`}
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'textbook' ? 'active' : ''}`}
          onClick={() => setActiveTab('textbook')}
        >
          <Book size={18} />
          {language === 'en' ? 'Textbook & Copilot' : 'పాఠ్యపుస్తకం & కోపైలట్'}
        </button>
        <button 
          className={`tab-button ${activeTab === 'activities' ? 'active' : ''}`}
          onClick={() => setActiveTab('activities')}
        >
          <FlaskConical size={18} />
          {language === 'en' ? 'Activities' : 'కార్యకలాపాలు'}
        </button>
        <button 
          className={`tab-button ${activeTab === 'study-guide' ? 'active' : ''}`}
          onClick={() => setActiveTab('study-guide')}
        >
          <FileText size={18} />
          {language === 'en' ? '10-min Study Guide' : '10-నిమి స్టడీ గైడ్'}
        </button>
        <button 
          className={`tab-button ${activeTab === 'qa' ? 'active' : ''}`}
          onClick={() => setActiveTab('qa')}
        >
          {language === 'en' ? 'Q&A' : 'ప్రశ్నలు & జవాబులు'}
        </button>
        <button 
          className={`tab-button ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          {language === 'en' ? 'Quiz' : 'క్విజ్'}
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Tab 1: Textbook + Copilot (Two-Panel Layout) */}
        {activeTab === 'textbook' && (
          <div className="two-panel-layout">
            {/* Left Panel: Textbook */}
            <div className="pane pdf-pane">
          <Card className="pane-card">
            <div className="pane-header">
              <h2>
                <Book size={20} />
                {language === 'en' ? 'Textbook' : 'పాఠ్యపుస్తకం'}
              </h2>
              <div className="pdf-controls">
                <Button variant="ghost" size="sm" onClick={zoomOut} disabled={zoom <= 50}>
                  <ZoomOut size={16} />
                </Button>
                <span className="zoom-level">{zoom}%</span>
                <Button variant="ghost" size="sm" onClick={zoomIn} disabled={zoom >= 200}>
                  <ZoomIn size={16} />
                </Button>
              </div>
            </div>

            <div className="pdf-viewer">
              {pdfError ? (
                <div className="pdf-error">
                  <p style={{ color: 'var(--error-500)', fontWeight: 'bold', marginBottom: '1rem' }}>
                    {language === 'en' ? 'Error loading PDF' : 'PDF లోడ్ చేయడంలో లోపం'}
                  </p>
                  <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    {pdfError.message || 'PDF file not found'}
                  </p>
                  <p style={{ color: 'var(--gray-500)', fontSize: '0.75rem' }}>
                    {language === 'en' ? 'Expected path:' : 'అపేక్షిత మార్గం:'} {pdfFile}
                  </p>
                  <Button 
                    size="sm" 
                    onClick={() => {
                      setPdfError(null);
                      window.location.reload();
                    }}
                    style={{ marginTop: '1rem' }}
                  >
                    {language === 'en' ? 'Retry' : 'మళ్లీ ప్రయత్నించండి'}
                  </Button>
                </div>
              ) : !workerReady ? (
                <div className="pdf-loading">
                  <p>{language === 'en' ? 'Initializing PDF viewer...' : 'PDF వీక్షకాన్ని ప్రారంభిస్తోంది...'}</p>
                </div>
              ) : (
                <Document
                  file={pdfFile}
                  onLoadSuccess={({ numPages }) => {
                    console.log('PDF loaded successfully:', pdfFile, 'Total pages:', numPages);
                    setPdfError(null);
                  }}
                  onLoadError={(error) => {
                    console.error('PDF Document load error:', error);
                    console.error('PDF path attempted:', pdfFile);
                    console.error('Worker source at error time:', pdfjs.GlobalWorkerOptions.workerSrc);
                    console.error('Error details:', {
                      name: error?.name,
                      message: error?.message,
                      stack: error?.stack
                    });
                    // Re-verify worker is still absolute
                    if (pdfjs.GlobalWorkerOptions.workerSrc && 
                        !pdfjs.GlobalWorkerOptions.workerSrc.startsWith('http://') && 
                        !pdfjs.GlobalWorkerOptions.workerSrc.startsWith('https://')) {
                      console.error('Worker became relative! Re-setting...');
                      pdfjs.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.js`;
                    }
                    setPdfError(error);
                  }}
                  loading={
                    <div className="pdf-loading">
                      <p>{language === 'en' ? 'Loading PDF...' : 'PDF లోడ్ అవుతోంది...'}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.5rem' }}>
                        {pdfFile}
                      </p>
                  </div>
                  }
                  error={
                    <div className="pdf-error">
                      <p>{language === 'en' ? 'Failed to load PDF' : 'PDF లోడ్ చేయడంలో విఫలమైంది'}</p>
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setPdfError(null);
                          window.location.reload();
                        }}
                        style={{ marginTop: '1rem' }}
                      >
                        {language === 'en' ? 'Retry' : 'మళ్లీ ప్రయత్నించండి'}
                      </Button>
                    </div>
                  }
                  options={documentOptions}
                >
                  {currentPdfPage && currentPdfPage > 0 && (
                    <Page
                      pageNumber={currentPdfPage}
                      scale={zoom / 100}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      className="pdf-page"
                      loading={
                        <div className="pdf-loading">
                          <p style={{ fontSize: '0.875rem' }}>
                            {language === 'en' ? 'Loading page...' : 'పేజీ లోడ్ అవుతోంది...'}
                          </p>
                  </div>
                      }
                      onLoadError={(error) => {
                        console.error('Page load error:', error, 'Page:', currentPdfPage);
                        console.error('Worker source:', pdfjs.GlobalWorkerOptions.workerSrc);
                        console.error('Error message:', error?.message);
                        setPdfError(error);
                      }}
                      onRenderSuccess={() => {
                        console.log('Page rendered successfully:', currentPdfPage);
                        // Clear any previous errors on successful render
                        setPdfError(null);
                      }}
                      onRenderError={(error) => {
                        console.error('Page render error:', error, 'Page:', currentPdfPage);
                        console.error('Worker source:', pdfjs.GlobalWorkerOptions.workerSrc);
                        // The sendWithPromise error indicates worker connection lost
                        // This usually means the Document needs to be remounted
                        if (error?.message?.includes('sendWithPromise') || 
                            error?.message?.includes('Cannot read properties of null')) {
                          console.error('Worker connection lost - Document needs to reload');
                          // Force Document to remount by clearing and resetting
                          setPdfError(null);
                          setWorkerReady(false);
                          setTimeout(() => {
                            setWorkerReady(true);
                          }, 300);
                        } else {
                          setPdfError(error);
                        }
                      }}
                    />
                  )}
                </Document>
              )}
            </div>
            
              {/* Page Navigation */}
            <div className="pdf-navigation">
                <Button 
                  variant="ghost" 
                  size="sm" 
                onClick={prevPage}
                disabled={currentPage === 1}
                >
                  <ChevronLeft size={20} />
                </Button>
              
              <div className="page-info">
                <input
                  type="number"
                  min="1"
                  max={totalLogicalPages}
                  value={currentPage}
                  onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                  className="page-input"
                />
                <span className="page-separator">/</span>
                <span className="total-pages">{totalLogicalPages}</span>
              </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                onClick={nextPage}
                disabled={currentPage === totalLogicalPages}
                >
                  <ChevronRight size={20} />
                </Button>
            </div>
          </Card>
        </div>

          {/* Raamu Copilot Panel - Below Textbook */}
          <div className="pane chat-pane copilot-pane">
            <Card className="pane-card">
              <div className="pane-header">
                <h2>
                  <MessageSquare size={20} />
                  {language === 'en' ? 'Ask Raamu' : 'రాముని అడగండి'}
                </h2>
              </div>
              
              <div className="chat-content">
                <div className="context-info">
                  <p>
                    💡 {language === 'en' 
                      ? `Currently on page ${currentPage}${activeExperiment ? ` - ${activeExperiment.title}` : ''}` 
                      : `ప్రస్తుతం పేజీ ${currentPage}లో${activeExperiment ? ` - ${activeExperiment.titleTelugu}` : ''}`}
                  </p>
                </div>

                <div className="suggested-questions">
                  <h5>{language === 'en' ? 'Quick Questions:' : 'త్వరిత ప్రశ్నలు:'}</h5>
                  <button className="question-chip">
                    {language === 'en' ? 'What is force?' : 'బలం అంటే ఏమిటి?'}
                  </button>
                  <button className="question-chip">
                    {language === 'en' ? 'Explain this experiment' : 'ఈ ప్రయోగాన్ని వివరించండి'}
                  </button>
                  <button className="question-chip">
                    {language === 'en' ? 'Give me an example' : 'నాకు ఉదాహరణ ఇవ్వండి'}
                  </button>
                  <button className="question-chip">
                    {language === 'en' ? 'What is the formula?' : 'సూత్రం ఏమిటి?'}
                  </button>
                </div>

                <div className="chat-messages">
                  <div className="message bot-message">
                    <div className="message-avatar">R</div>
                    <div className="message-content">
                      <p>
                        {language === 'en'
                          ? `I'm here to help you understand ${chapterData.title}! I can see you're on page ${currentPage}. What would you like to know?`
                          : `${chapterData.titleTelugu}ని అర్థం చేసుకోవడంలో మీకు సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను! మీరు పేజీ ${currentPage}లో ఉన్నారని నేను చూస్తున్నాను. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="chat-input-area">
                  <input 
                    type="text" 
                    placeholder={language === 'en' ? 'Ask a question...' : 'ప్రశ్న అడగండి...'}
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
        )}

        {/* Tab 2: Activities (Full Width) */}
        {activeTab === 'activities' && (
          <div className="pane activities-pane">
          <Card className="pane-card">
            {chapterNumber === 1 || chapterNumber === 2 ? (
              // For Chapter 1, show textbook activities
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="pane-header">
              <h2>
                    <FlaskConical size={20} />
                    {language === 'en' ? 'Interactive Activities' : 'ఇంటరాక్టివ్ కార్యకలాపాలు'}
              </h2>
            </div>
                <div style={{ flex: 1, overflow: 'auto' }}>
                  <TextbookActivitiesView 
                    pdfFile={pdfFile}
                    currentPdfPage={currentPdfPage}
                    zoom={zoom}
                    onActivityPageChange={handleActivityPageChange}
                    showEmbeddedPDF={false}
                    showAIChat={false}
                    chapterNumber={chapterNumber}
                  />
                </div>
              </div>
            ) : (
              // For other chapters, show experiments as before
              <>
                <div className="pane-header">
                  <h2>
                    <Beaker size={20} />
                    {activeExperiment 
                      ? (language === 'en' ? activeExperiment.title : activeExperiment.titleTelugu)
                      : (language === 'en' ? 'Interactive Lab' : 'ఇంటరాక్టివ్ ప్రయోగశాల')
                    }
                  </h2>
                  {activeExperiment && (
                    <Badge variant="info">{activeExperiment.difficulty}</Badge>
                  )}
                </div>
                
                {materialsLoading ? (
                  <div className="loading-state">
                    <p>{language === 'en' ? 'Loading experiments...' : 'ప్రయోగాలు లోడ్ అవుతోంది...'}</p>
                  </div>
                ) : activeExperiment ? (
              <div className="experiment-content">
                <div className="experiment-info">
                  <p className="description">
                    {language === 'en' ? activeExperiment.description : activeExperiment.descriptionTelugu}
                  </p>
                  <div className="metadata">
                    <span>⏱️ {activeExperiment.estimatedTime}</span>
                    {activeExperiment.relatedPages && (
                      <span>📖 {language === 'en' ? 'Pages' : 'పేజీలు'}: {activeExperiment.relatedPages.join(', ')}</span>
                    )}
                  </div>
                </div>
                
                {/* Simulation Area */}
                <div className="simulation-area">
                  <div className="simulation-placeholder">
                    <h3>{language === 'en' ? activeExperiment.title : activeExperiment.titleTelugu}</h3>
                    <p>3D Interactive Simulation</p>
                    <div className="simulation-preview">
                      {activeExperiment.id === 'exp-2' && (
                        <div className="pressure-demo">
                    <div className="pressure-objects">
                      <div className="pressure-item">
                              <div className="object">📌</div>
                        <div className="pressure-bar high"></div>
                              <span>{language === 'en' ? 'High Pressure' : 'అధిక ఒత్తిడి'}</span>
                      </div>
                      <div className="pressure-item">
                              <div className="object">📚</div>
                        <div className="pressure-bar low"></div>
                              <span>{language === 'en' ? 'Low Pressure' : 'తక్కువ ఒత్తిడి'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
                  </div>
              </div>

                {/* Controls */}
                {activeExperiment.controls && activeExperiment.controls.length > 0 && (
                  <div className="experiment-controls">
                    <h4>{language === 'en' ? 'Controls' : 'నియంత్రణలు'}</h4>
                    {activeExperiment.controls.map((control) => (
                      <div key={control.id} className="control-group">
                        <label>{language === 'en' ? control.label : control.labelTelugu}</label>
                        {control.type === 'slider' && (
                          <>
                            <input 
                              type="range" 
                              min={control.min} 
                              max={control.max} 
                              value={controlValues[control.id] || control.default || control.min}
                              onChange={(e) => handleControlChange(control.id, parseInt(e.target.value))}
                            />
                            <span className="control-value">
                              {controlValues[control.id] || control.default || control.min} {control.unit}
                            </span>
                          </>
                        )}
                        {control.type === 'select' && (
                          <select
                            value={controlValues[control.id] || control.default || control.options[0]}
                            onChange={(e) => handleControlChange(control.id, e.target.value)}
                          >
                            {control.options.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                      </select>
                        )}
                    </div>
                    ))}
                    <div className="control-actions">
                      <Button size="sm">▶ {language === 'en' ? 'Play' : 'ప్లే'}</Button>
                      <Button variant="secondary" size="sm" onClick={() => {
                        const defaults = {};
                        activeExperiment.controls.forEach(c => {
                          defaults[c.id] = c.default !== undefined ? c.default : (c.type === 'select' ? c.options[0] : c.min || 0);
                        });
                        setControlValues(defaults);
                      }}>
                        ⟲ {language === 'en' ? 'Reset' : 'రీసెట్'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Measurements */}
                {activeExperiment.measurements && activeExperiment.measurements.length > 0 && (
                  <div className="measurements">
                    <h5>{language === 'en' ? 'Measurements' : 'కొలతలు'}</h5>
                    {activeExperiment.measurements.map((m) => (
                      <div key={m.id} className="measurement-item">
                        <span className="label">{language === 'en' ? m.label : m.labelTelugu}:</span>
                        <span className="value">
                          {measurements[m.id] !== undefined ? measurements[m.id] : '--'} {m.unit}
                        </span>
                    </div>
                    ))}
                    </div>
                )}
                    </div>
                ) : (
                  <div className="empty-experiment">
                    <div className="empty-icon">🧪</div>
                    <p>{language === 'en' ? 'No experiments available. Click "Supplemental Materials" to view available labs.' : 'ప్రయోగాలు అందుబాటులో లేవు. అందుబాటులో ఉన్న ప్రయోగశాలలను వీక్షించడానికి "అనుబంధ పదార్థాలు" క్లిక్ చేయండి.'}</p>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
        )}

        {/* Tab 3: 10-min Study Guide (Full Width) */}
        {activeTab === 'study-guide' && (
          <div className="pane study-guide-pane">
            <Card className="pane-card">
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflow: 'auto' }}>
                  <StudyGuide 
                    grade={grade}
                    subject={subject}
                    chapterNumber={chapterNumber}
                    language={language}
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 4: Q&A (Full Width) */}
        {activeTab === 'qa' && (
              <div className="pane qa-pane">
                <Card className="pane-card">
                  <div className="pane-header">
                    <h2>{language === 'en' ? 'Common Questions & Answers' : 'సాధారణ ప్రశ్నలు & జవాబులు'}</h2>
                  </div>
                  <div className="qa-content">
                    <p style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--gray-600)' }}>
                      {language === 'en' ? 'Q&A content coming soon...' : 'ప్రశ్నలు & జవాబులు కంటెంట్ త్వరలో వస్తుంది...'}
                    </p>
                  </div>
                </Card>
              </div>
            )}

        {/* Tab 5: Quiz (Full Width) */}
        {activeTab === 'quiz' && (
              <div className="pane quiz-pane">
                <Card className="pane-card">
                  <div className="pane-header">
                    <h2>{language === 'en' ? 'Quiz' : 'క్విజ్'}</h2>
                  </div>
                  <div className="quiz-content">
                    <p style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--gray-600)' }}>
                      {language === 'en' ? 'Quiz content coming soon...' : 'క్విజ్ కంటెంట్ త్వరలో వస్తుంది...'}
                    </p>
                  </div>
                </Card>
              </div>
            )}
      </div>

      {/* Supplemental Materials Sidebar */}
      {showSupplemental && materials && (
        <div className="supplemental-sidebar">
          <div className="supplemental-header">
            <h3>{language === 'en' ? 'Supplemental Materials' : 'అనుబంధ పదార్థాలు'}</h3>
            <button onClick={() => setShowSupplemental(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="supplemental-content">
            {/* Experiments */}
            {materials.experiments && materials.experiments.length > 0 && (
              <div className="material-section">
                <h4>
                  <Beaker size={18} />
                  {language === 'en' ? 'Interactive Experiments' : 'ఇంటరాక్టివ్ ప్రయోగాలు'}
                </h4>
                {materials.experiments.map((exp) => (
              <button
                    key={exp.id}
                    className={`material-item ${activeExperiment?.id === exp.id ? 'active' : ''}`}
                onClick={() => {
                      setActiveExperiment(exp);
                      setShowSupplemental(false);
                      // Initialize control values
                      const initialValues = {};
                      exp.controls?.forEach(control => {
                        initialValues[control.id] = control.default !== undefined 
                          ? control.default 
                          : (control.type === 'select' ? control.options[0] : control.min || 0);
                      });
                      setControlValues(initialValues);
                      // Navigate to related page if available
                      if (exp.relatedPages && exp.relatedPages.length > 0) {
                        goToPage(exp.relatedPages[0]);
                      }
                    }}
                  >
                    <div className="item-title">
                      {language === 'en' ? exp.title : exp.titleTelugu}
                    </div>
                    <div className="item-meta">
                      <Badge variant="success" size="sm">{exp.difficulty}</Badge>
                      <span>{exp.estimatedTime}</span>
                    </div>
                    {exp.relatedPages && (
                      <div className="item-pages">
                        📖 {language === 'en' ? 'Pages' : 'పేజీలు'}: {exp.relatedPages.join(', ')}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Videos */}
            {materials.videos && materials.videos.length > 0 && (
              <div className="material-section">
                <h4>
                  🎥 {language === 'en' ? 'Videos' : 'వీడియోలు'}
                </h4>
                {materials.videos.map((video) => (
                  <button
                    key={video.id}
                    className="material-item"
                    onClick={() => video.relatedPages && video.relatedPages.length > 0 && goToPage(video.relatedPages[0])}
                  >
                    <div className="item-title">
                      {language === 'en' ? video.title : video.titleTelugu}
                    </div>
                    <div className="item-meta">
                      <span>⏱️ {video.duration}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Activities */}
            {materials.activities && materials.activities.length > 0 && (
              <div className="material-section">
                <h4>
                  📝 {language === 'en' ? 'Activities' : 'కార్యకలాపాలు'}
                </h4>
                {materials.activities.map((activity) => (
                  <button
                    key={activity.id}
                    className="material-item"
                    onClick={() => activity.relatedPages && activity.relatedPages.length > 0 && goToPage(activity.relatedPages[0])}
                  >
                    <div className="item-title">
                      {language === 'en' ? activity.title : activity.titleTelugu}
                    </div>
              </button>
            ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
