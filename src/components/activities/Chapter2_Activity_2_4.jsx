import React, { useState } from 'react';
import { Play, RotateCcw, ArrowRight } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import './Chapter2Activities.css';

// ==================================================
// ACTIVITY 2.4: Rolling Reduces Friction
// ==================================================
export function Activity_2_4({ language }) {
  const [mode, setMode] = useState('sliding'); // 'sliding' or 'rolling'
  const [isMoving, setIsMoving] = useState(false);
  const [bookPosition, setBookPosition] = useState(20);
  const [effortLevel, setEffortLevel] = useState(0);
  const [observations, setObservations] = useState([]);

  const modes = {
    sliding: {
      name: 'Sliding (No Pencils)',
      nameTelugu: 'జారడం (పెన్సిళ్లు లేవు)',
      friction: 0.6,
      effort: 'High',
      effortTelugu: 'ఎక్కువ',
      distance: 25,
      description: 'Book slides directly on table',
      descriptionTelugu: 'పుస్తకం నేరుగా టేబుల్‌పై జారుతుంది',
      icon: '📚',
      color: '#ff5722'
    },
    rolling: {
      name: 'Rolling (With Pencils)',
      nameTelugu: 'తిరగడం (పెన్సిళ్లతో)',
      friction: 0.2,
      effort: 'Low',
      effortTelugu: 'తక్కువ',
      distance: 70,
      description: 'Book rolls on pencils',
      descriptionTelugu: 'పుస్తకం పెన్సిళ్లపై తిరుగుతుంది',
      icon: '📖',
      color: '#4caf50'
    }
  };

  const currentMode = modes[mode];

  const pushBook = () => {
    setIsMoving(true);
    setEffortLevel(0);
    
    // Simulate effort building up
    let effort = 0;
    const effortInterval = setInterval(() => {
      effort += 5;
      setEffortLevel(effort);
      
      if (effort >= currentMode.friction * 100) {
        clearInterval(effortInterval);
        
        // Start moving the book
        let pos = bookPosition;
        const targetPos = bookPosition + currentMode.distance;
        
        const moveInterval = setInterval(() => {
          pos += 1;
          setBookPosition(pos);
          
          if (pos >= targetPos) {
            clearInterval(moveInterval);
            setIsMoving(false);
            setEffortLevel(0);
            recordObservation();
          }
        }, mode === 'rolling' ? 30 : 80); // Rolling is faster
      }
    }, 50);
  };

  const recordObservation = () => {
    const obs = {
      mode: language === 'en' ? currentMode.name : currentMode.nameTelugu,
      effort: language === 'en' ? currentMode.effort : currentMode.effortTelugu,
      distance: currentMode.distance,
      friction: currentMode.friction
    };
    setObservations([...observations, obs]);
  };

  const reset = () => {
    setBookPosition(20);
    setIsMoving(false);
    setEffortLevel(0);
  };

  const resetAll = () => {
    reset();
    setObservations([]);
    setMode('sliding');
  };

  return (
    <div className="activity-container">
      <div className="activity-instructions">
        <h4>{language === 'en' ? 'Instructions' : 'సూచనలు'}:</h4>
        <p>
          {language === 'en'
            ? 'Try pushing the book with and without pencils underneath. Feel the difference! Rolling friction is much less than sliding friction.'
            : 'పుస్తకాన్ని క్రింద పెన్సిళ్లతో మరియు లేకుండా నెట్టడానికి ప్రయత్నించండి. వ్యత్యాసాన్ని అనుభవించండి! రోలింగ్ ఘర్షణ స్లైడింగ్ ఘర్షణ కంటే చాలా తక్కువ.'}
        </p>
      </div>

      {/* Mode Selector */}
      <div className="mode-selector">
        <h4>{language === 'en' ? 'Select Mode:' : 'మోడ్‌ను ఎంచుకోండి:'}</h4>
        <div className="mode-buttons">
          <button
            className={`mode-btn ${mode === 'sliding' ? 'active' : ''}`}
            onClick={() => {
              setMode('sliding');
              reset();
            }}
            disabled={isMoving}
          >
            <span className="mode-icon">{modes.sliding.icon}</span>
            <div className="mode-info">
              <span className="mode-name">
                {language === 'en' ? modes.sliding.name : modes.sliding.nameTelugu}
              </span>
              <Badge variant="error" size="sm">
                {language === 'en' ? 'High Friction' : 'అధిక ఘర్షణ'}
              </Badge>
            </div>
          </button>

          <button
            className={`mode-btn ${mode === 'rolling' ? 'active' : ''}`}
            onClick={() => {
              setMode('rolling');
              reset();
            }}
            disabled={isMoving}
          >
            <span className="mode-icon">{modes.rolling.icon}</span>
            <div className="mode-info">
              <span className="mode-name">
                {language === 'en' ? modes.rolling.name : modes.rolling.nameTelugu}
              </span>
              <Badge variant="success" size="sm">
                {language === 'en' ? 'Low Friction' : 'తక్కువ ఘర్షణ'}
              </Badge>
            </div>
          </button>
        </div>
      </div>

      {/* Interactive Demonstration */}
      <div className="rolling-friction-demo">
        <div className="demo-scene">
          {/* Table surface */}
          <div className="table-top">
            <div className="table-texture" />
            
            {/* Pencils (only in rolling mode) */}
            {mode === 'rolling' && (
              <div className="pencils-row">
                {[1, 2, 3, 4, 5].map(i => (
                  <div 
                    key={i} 
                    className={`pencil ${isMoving ? 'rotating' : ''}`}
                    style={{ left: `${i * 15}%` }}
                  >
                    <div className="pencil-body">✏️</div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Book */}
            <div 
              className={`book-on-table ${mode}`}
              style={{ 
                left: `${bookPosition}%`,
                backgroundColor: currentMode.color
              }}
            >
              <div className="book-spine" />
              <div className="book-pages" />
              <span className="book-title">PHYSICS</span>
            </div>

            {/* Force arrow (when moving) */}
            {isMoving && (
              <div 
                className="push-arrow"
                style={{ left: `${bookPosition - 10}%` }}
              >
                <ArrowRight size={32} color={currentMode.color} />
              </div>
            )}

            {/* Distance marker */}
            {!isMoving && bookPosition > 25 && (
              <div className="distance-marker">
                <div className="marker-line" />
                <span className="distance-text">
                  {(bookPosition - 20).toFixed(0)}cm
                </span>
              </div>
            )}
          </div>

          {/* Effort meter */}
          <div className="effort-meter">
            <h5>{language === 'en' ? 'Effort Required' : 'అవసరమైన శ్రమ'}:</h5>
            <div className="meter-bar">
              <div 
                className="meter-fill"
                style={{ 
                  width: `${effortLevel}%`,
                  backgroundColor: currentMode.color
                }}
              />
            </div>
            <div className="meter-labels">
              <span>{language === 'en' ? 'Easy' : 'సులభం'}</span>
              <span>{language === 'en' ? 'Hard' : 'కష్టం'}</span>
            </div>
          </div>
        </div>

        {/* Current Stats */}
        <div className="stats-display">
          <div className="stat-card">
            <h5>{language === 'en' ? 'Mode' : 'మోడ్'}:</h5>
            <Badge variant={mode === 'sliding' ? 'error' : 'success'} size="lg">
              {language === 'en' ? currentMode.name : currentMode.nameTelugu}
            </Badge>
          </div>

          <div className="stat-card">
            <h5>{language === 'en' ? 'Friction' : 'ఘర్షణ'}:</h5>
            <Badge variant="info" size="lg">{currentMode.friction}</Badge>
          </div>

          <div className="stat-card">
            <h5>{language === 'en' ? 'Effort' : 'శ్రమ'}:</h5>
            <Badge variant={mode === 'sliding' ? 'error' : 'success'} size="lg">
              {language === 'en' ? currentMode.effort : currentMode.effortTelugu}
            </Badge>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls">
        <Button
          onClick={pushBook}
          disabled={isMoving}
        >
          <Play size={18} />
          {language === 'en' ? 'Push Book' : 'పుస్తకం నెట్టండి'}
        </Button>

        <Button onClick={reset} variant="secondary" disabled={isMoving}>
          <RotateCcw size={18} />
          {language === 'en' ? 'Reset' : 'రీసెట్'}
        </Button>
      </div>

      {/* Observations Table */}
      {observations.length > 0 && (
        <div className="observations-panel">
          <div className="panel-header">
            <h4>{language === 'en' ? '📊 Observations' : '📊 పరిశీలనలు'}:</h4>
            <Button size="sm" variant="ghost" onClick={resetAll}>
              {language === 'en' ? 'Clear All' : 'అన్నీ క్లియర్ చేయండి'}
            </Button>
          </div>
          
          <table className="observations-table">
            <thead>
              <tr>
                <th>#</th>
                <th>{language === 'en' ? 'Mode' : 'మోడ్'}</th>
                <th>{language === 'en' ? 'Friction' : 'ఘర్షణ'}</th>
                <th>{language === 'en' ? 'Effort' : 'శ్రమ'}</th>
                <th>{language === 'en' ? 'Distance' : 'దూరం'}</th>
              </tr>
            </thead>
            <tbody>
              {observations.map((obs, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{obs.mode}</td>
                  <td>
                    <Badge variant={obs.friction > 0.4 ? 'error' : 'success'}>
                      {obs.friction}
                    </Badge>
                  </td>
                  <td>
                    <Badge variant={obs.effort === 'High' || obs.effort === 'ఎక్కువ' ? 'error' : 'success'}>
                      {obs.effort}
                    </Badge>
                  </td>
                  <td>{obs.distance} cm</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Comparison */}
          {observations.length >= 2 && (
            <div className="comparison-box">
              <h5>📈 {language === 'en' ? 'Comparison' : 'పోలిక'}:</h5>
              <div className="comparison-grid">
                <div className="comparison-item">
                  <strong>{language === 'en' ? 'Sliding friction' : 'స్లైడింగ్ ఘర్షణ'}:</strong>
                  <span>{modes.sliding.friction} (High effort needed)</span>
                </div>
                <div className="comparison-item">
                  <strong>{language === 'en' ? 'Rolling friction' : 'రోలింగ్ ఘర్షణ'}:</strong>
                  <span>{modes.rolling.friction} (Low effort needed)</span>
                </div>
                <div className="comparison-conclusion">
                  <strong>✓ {language === 'en' ? 'Conclusion' : 'తీర్మానం'}:</strong>
                  <p>
                    {language === 'en'
                      ? 'Rolling friction is MUCH LESS than sliding friction! That\'s why wheels make movement easier.'
                      : 'రోలింగ్ ఘర్షణ స్లైడింగ్ ఘర్షణ కంటే చాలా తక్కువ! అందుకే చక్రాలు కదలికను సులభతరం చేస్తాయి.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Real-world Examples */}
      <div className="examples-box">
        <h4>🌍 {language === 'en' ? 'Real-World Examples' : 'నిజ-ప్రపంచ ఉదాహరణలు'}:</h4>
        <div className="examples-grid">
          <div className="example-card">
            <span className="example-icon">🧳</span>
            <p>
              {language === 'en'
                ? 'Suitcases with wheels are easier to pull'
                : 'చక్రాలతో సూట్‌కేసులు లాగడం సులభం'}
            </p>
          </div>
          <div className="example-card">
            <span className="example-icon">🚗</span>
            <p>
              {language === 'en'
                ? 'Cars use wheels to reduce friction'
                : 'ఘర్షణను తగ్గించడానికి కార్లు చక్రాలను ఉపయోగిస్తాయి'}
            </p>
          </div>
          <div className="example-card">
            <span className="example-icon">⚙️</span>
            <p>
              {language === 'en'
                ? 'Ball bearings in machines reduce friction'
                : 'యంత్రాలలో బాల్ బేరింగ్‌లు ఘర్షణను తగ్గిస్తాయి'}
            </p>
          </div>
          <div className="example-card">
            <span className="example-icon">🏗️</span>
            <p>
              {language === 'en'
                ? 'Heavy machinery moved using logs/rollers'
                : 'లాగ్స్/రోలర్లను ఉపయోగించి భారీ యంత్రాలను తరలించడం'}
            </p>
          </div>
        </div>
      </div>

      {/* Key Learnings */}
      <div className="key-learnings">
        <h4>{language === 'en' ? '🎯 Key Learning' : '🎯 ముఖ్య అభ్యాసం'}:</h4>
        <ul>
          <li>
            {language === 'en'
              ? 'Rolling friction is MUCH LESS than sliding friction'
              : 'రోలింగ్ ఘర్షణ స్లైడింగ్ ఘర్షణ కంటే చాలా తక్కువ'}
          </li>
          <li>
            {language === 'en'
              ? 'It is easier to ROLL than to SLIDE a body'
              : 'ఒక వస్తువును స్లైడ్ చేయడం కంటే రోల్ చేయడం సులభం'}
          </li>
          <li>
            {language === 'en'
              ? 'Wheels reduce friction and make movement easier'
              : 'చక్రాలు ఘర్షణను తగ్గిస్తాయి మరియు కదలికను సులభతరం చేస్తాయి'}
          </li>
          <li>
            {language === 'en'
              ? 'The wheel is one of mankind\'s greatest inventions!'
              : 'చక్రం మానవజాతి యొక్క గొప్ప ఆవిష్కరణలలో ఒకటి!'}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Activity_2_4;
