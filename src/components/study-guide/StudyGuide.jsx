import React, { useState, useEffect } from 'react';
import { FileText, Clock, ChevronDown, Printer, Download, Share2, BookOpen } from 'lucide-react';
import Button from '../common/Button';
import './StudyGuide.css';

export default function StudyGuide({ grade, subject, chapterNumber, language = 'en' }) {
  const [studyData, setStudyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [progress, setProgress] = useState(0);

  // Load study guide data
  useEffect(() => {
    const loadStudyGuide = async () => {
      try {
        // Direct chapter number mapping for available study guides
        const chapterMap = {
          1: 'force_pressure',
          2: 'friction',
          3: 'coal_petroleum',
          4: 'synthetic_fibres',
          5: 'sound',
          6: 'metals_nonmetals'
        };
        
        const chapterName = chapterMap[chapterNumber];
        if (!chapterName) {
          console.warn(`Study guide not available for chapter ${chapterNumber}`);
          setLoading(false);
          return;
        }
        
        // Use import for JSON files - Vite will handle this correctly
        try {
          const dataModule = await import(`../../data/study-guides/chapter${chapterNumber}_${chapterName}.json`);
          const data = dataModule.default || dataModule;
          setStudyData(data);
          // Auto-expand first section
          setExpandedSections(new Set([1]));
        } catch (importError) {
          console.error('Error importing study guide:', importError);
          // Fallback to fetch if import fails
          const response = await fetch(`/src/data/study-guides/chapter${chapterNumber}_${chapterName}.json`);
          if (response.ok) {
            const data = await response.json();
            setStudyData(data);
            setExpandedSections(new Set([1]));
          } else {
            console.warn(`Study guide not found for chapter ${chapterNumber}`);
          }
        }
      } catch (error) {
        console.error('Error loading study guide:', error);
      } finally {
        setLoading(false);
      }
    };

    if (grade && subject && chapterNumber) {
      loadStudyGuide();
    }
  }, [grade, subject, chapterNumber]);

  // Update progress when sections expand
  useEffect(() => {
    if (studyData && studyData.sections) {
      const totalSections = studyData.sections.length;
      const progressPercent = (expandedSections.size / totalSections) * 100;
      setProgress(progressPercent);
    }
  }, [expandedSections, studyData]);

  const toggleSection = (sectionNum) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionNum)) {
      newExpanded.delete(sectionNum);
    } else {
      newExpanded.add(sectionNum);
    }
    setExpandedSections(newExpanded);
  };

  const expandAll = () => {
    if (studyData && studyData.sections) {
      const allSections = new Set(studyData.sections.map(s => s.sectionNumber));
      setExpandedSections(allSections);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert('📥 Downloading PDF...\n\nIn production, this would generate a PDF of the study guide.');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Raamu Study Guide - ${studyData?.chapterTitle || 'Chapter'}`,
          text: `Check out this 10-minute study guide for Grade ${grade} ${subject}!`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      alert(`🔗 Share this study guide:\n\n${window.location.href}`);
    }
  };

  const handleTakeQuiz = () => {
    alert('📝 Launching Quiz...\n\nYou would be redirected to the Quiz tab!');
  };

  if (loading) {
    return (
      <div className="study-guide-loading">
        <p>{language === 'en' ? 'Loading study guide...' : 'స్టడీ గైడ్ లోడ్ అవుతోంది...'}</p>
      </div>
    );
  }

  if (!studyData) {
    return (
      <div className="study-guide-error">
        <p>
          {language === 'en' 
            ? `Study guide not available for Chapter ${chapterNumber}` 
            : `అధ్యాయం ${chapterNumber}కి స్టడీ గైడ్ అందుబాటులో లేదు`}
        </p>
      </div>
    );
  }

  const highlightText = (text, highlights) => {
    if (!highlights || highlights.length === 0) return text;
    
    let highlightedText = text;
    highlights.forEach(highlight => {
      const regex = new RegExp(`(${highlight})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<span class="highlight">$1</span>');
    });
    
    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  return (
    <div className="study-guide-container">
      {/* Header */}
      <div className="study-guide-header">
        <div className="study-guide-header-content">
          <div className="study-guide-header-left">
            <h1>📚 {language === 'en' ? 'Study Guide' : 'స్టడీ గైడ్'}: {studyData.chapterTitle}</h1>
            <p className="study-guide-subtitle">
              Grade {studyData.grade} {studyData.subject} • {language === 'en' ? 'Chapter' : 'అధ్యాయం'} {studyData.chapterNumber}
            </p>
          </div>
          <div className="study-guide-header-right">
            <div className="study-guide-time-badge">
              <Clock size={18} />
              {studyData.totalTime} {language === 'en' ? 'Minutes' : 'నిమిషాలు'}
            </div>
            <div className="study-guide-grade-badge">
              Grade {studyData.grade}
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="study-guide-action-bar">
        <Button variant="primary" onClick={expandAll}>
          <BookOpen size={16} />
          {language === 'en' ? 'Expand All Sections' : 'అన్ని విభాగాలను విస్తరించండి'}
        </Button>
        <Button variant="ghost" onClick={handlePrint}>
          <Printer size={16} />
          {language === 'en' ? 'Print' : 'ప్రింట్'}
        </Button>
        <Button variant="ghost" onClick={handleDownloadPDF}>
          <Download size={16} />
          {language === 'en' ? 'Download PDF' : 'PDF డౌన్‌లోడ్'}
        </Button>
        <Button variant="ghost" onClick={handleShare}>
          <Share2 size={16} />
          {language === 'en' ? 'Share' : 'షేర్'}
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="study-guide-progress-bar">
        <div className="study-guide-progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      {/* Content */}
      <div className="study-guide-content">
        {/* Introduction */}
        <div className="study-guide-intro-section">
          <p>
            <strong>{language === 'en' ? 'Chapter Overview:' : 'అధ్యాయం అవలోకనం:'}</strong>{' '}
            {studyData.overview}
          </p>
        </div>

        {/* Sections */}
        {studyData.sections.map((section) => (
          <div 
            key={section.sectionNumber} 
            className={`study-guide-section ${expandedSections.has(section.sectionNumber) ? 'expanded' : ''}`}
          >
            <div 
              className="study-guide-section-header" 
              onClick={() => toggleSection(section.sectionNumber)}
            >
              <div className="study-guide-section-header-left">
                <div className="study-guide-section-number">{section.sectionNumber}</div>
                <div className="study-guide-section-title">{section.title}</div>
              </div>
              <div className="study-guide-section-time">
                <Clock size={14} />
                {section.timeMinutes} {language === 'en' ? 'Min' : 'నిమి'}
                <span className={`study-guide-toggle-icon ${expandedSections.has(section.sectionNumber) ? 'expanded' : ''}`}>
                  <ChevronDown size={20} />
                </span>
              </div>
            </div>
            <div className="study-guide-section-content">
              {section.content.introduction && (
                <div className="study-guide-subsection">
                  <p className="study-guide-subsection-content">
                    {highlightText(section.content.introduction, [])}
                  </p>
                </div>
              )}

              {section.content.keyPoints && (
                <div className="study-guide-key-points">
                  <ul>
                    {section.content.keyPoints.map((point, idx) => (
                      <li key={idx}>
                        <strong>{point.title}:</strong>{' '}
                        {highlightText(point.description, point.highlights)}
                        
                        {point.formula && (
                          <div className="study-guide-formula-box">
                            <strong>{language === 'en' ? 'Formula:' : 'సూత్రం:'}</strong>
                            <code>{point.formula.text}</code>
                          </div>
                        )}

                        {point.subPoints && Array.isArray(point.subPoints) && (
                          <ul className="study-guide-nested-list">
                            {point.subPoints.map((subPoint, subIdx) => {
                              if (typeof subPoint === 'string') {
                                return <li key={subIdx}>{highlightText(subPoint, point.highlights)}</li>;
                              } else if (subPoint.name && subPoint.definition) {
                                return (
                                  <li key={subIdx}>
                                    <strong>{subPoint.name}:</strong> {subPoint.definition}
                                  </li>
                                );
                              }
                              return null;
                            })}
                          </ul>
                        )}

                        {point.examples && point.examples.length > 0 && (
                          <div className="study-guide-example-box">
                            <strong>{language === 'en' ? 'Examples:' : 'ఉదాహరణలు:'}</strong>
                            <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                              {point.examples.map((example, exIdx) => (
                                <li key={exIdx}>{example}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {point.keyTakeaway && (
                          <div className="study-guide-key-takeaway" style={{ marginTop: '15px' }}>
                            <h3>{point.keyTakeaway.title}</h3>
                            <p>{point.keyTakeaway.content}</p>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {section.content.keyTakeaway && (
                <div className="study-guide-key-takeaway">
                  <h3>{section.content.keyTakeaway.title}</h3>
                  <p>{section.content.keyTakeaway.content}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Chapter Summary */}
        {studyData.chapterSummary && (
          <div className="study-guide-key-takeaway">
            <h3>{language === 'en' ? '🎓 Chapter Summary' : '🎓 అధ్యాయం సారాంశం'}</h3>
            <p>{studyData.chapterSummary}</p>
          </div>
        )}

        {/* Completion Badge */}
        {expandedSections.size === studyData.sections.length && (
          <div className="study-guide-completion-badge show">
            <h3>🎉 {language === 'en' ? 'Study Guide Complete!' : 'స్టడీ గైడ్ పూర్తయింది!'}</h3>
            <p>{language === 'en' ? "You've reviewed all sections. Ready to test your knowledge?" : 'మీరు అన్ని విభాగాలను సమీక్షించారు. మీ జ్ఞానాన్ని పరీక్షించడానికి సిద్ధంగా ఉన్నారా?'}</p>
            <Button variant="primary" onClick={handleTakeQuiz} style={{ marginTop: '15px' }}>
              📝 {language === 'en' ? 'Take Chapter Quiz' : 'అధ్యాయం క్విజ్ తీసుకోండి'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

