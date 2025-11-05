import React, { useState } from 'react';
import { Check, RefreshCw, TrendingUp } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import './Chapter2Activities.css';

// ==================================================
// ACTIVITY 2.2: Factors Affecting Friction - Spring Balance
// ==================================================
export function Activity_2_2({ language }) {
  const [currentSurface, setCurrentSurface] = useState('bare');
  const [isPulling, setIsPulling] = useState(false);
  const [pullingForce, setPullingForce] = useState(0);
  const [recordings, setRecordings] = useState([]);

  const surfaces = {
    bare: {
      name: 'Bare Brick',
      nameTelugu: 'బేర్ ఇటుక',
      friction: 8.5, // Newtons
      description: 'Rough brick surface',
      descriptionTelugu: 'కఠినమైన ఇటుక ఉపరితలం',
      icon: '🧱',
      color: '#d84315'
    },
    jute: {
      name: 'Brick + Jute Bag',
      nameTelugu: 'ఇటుక + జనపనార సంచి',
      friction: 6.2,
      description: 'Wrapped in jute',
      descriptionTelugu: 'జనపనారలో చుట్టబడింది',
      icon: '🎒',
      color: '#795548'
    },
    polythene: {
      name: 'Brick + Polythene',
      nameTelugu: 'ఇటుక + పాలిథీన్',
      friction: 3.8,
      description: 'Smooth polythene wrap',
      descriptionTelugu: 'మృదువైన పాలిథీన్ చుట్టడం',
      icon: '📦',
      color: '#2196f3'
    }
  };

  const currentConfig = surfaces[currentSurface];

  const pullBrick = () => {
    setIsPulling(true);
    let force = 0;
    
    // Gradually increase force until it reaches friction threshold
    const interval = setInterval(() => {
      force += 0.2;
      setPullingForce(force);
      
      // When force equals friction, brick starts moving
      if (force >= currentConfig.friction) {
        clearInterval(interval);
        setTimeout(() => {
          setIsPulling(false);
        }, 1000);
      }
    }, 50);
  };

  const recordReading = () => {
    if (pullingForce >= currentConfig.friction - 0.5) {
      const reading = {
        surface: language === 'en' ? currentConfig.name : currentConfig.nameTelugu,
        force: currentConfig.friction.toFixed(1),
        timestamp: new Date().toLocaleTimeString()
      };
      setRecordings([...recordings, reading]);
    }
  };

  const reset = () => {
    setPullingForce(0);
    setIsPulling(false);
  };

  const resetAll = () => {
    reset();
    setRecordings([]);
    setCurrentSurface('bare');
  };

  return (
    <div className="activity-container">
      <div className="activity-instructions">
        <h4>{language === 'en' ? 'Instructions' : 'సూచనలు'}:</h4>
        <p>
          {language === 'en'
            ? 'Pull the brick with different surface coverings and measure the force needed to start moving it. Notice how friction changes with surface type!'
            : 'వివిధ ఉపరితల కవరింగ్‌లతో ఇటుకను లాగండి మరియు దానిని కదలించడానికి అవసరమైన బలాన్ని కొలవండి. ఉపరితల రకంతో ఘర్షణ ఎలా మారుతుందో గమనించండి!'}
        </p>
      </div>

      {/* Surface Selector */}
      <div className="surface-selector">
        <h4>{language === 'en' ? 'Select Surface Type:' : 'ఉపరితల రకాన్ని ఎంచుకోండి:'}</h4>
        <div className="surface-buttons">
          {Object.keys(surfaces).map((key) => (
            <button
              key={key}
              className={`surface-btn ${currentSurface === key ? 'active' : ''}`}
              onClick={() => {
                setCurrentSurface(key);
                reset();
              }}
              disabled={isPulling}
            >
              <span className="surface-icon">{surfaces[key].icon}</span>
              <span className="surface-name">
                {language === 'en' ? surfaces[key].name : surfaces[key].nameTelugu}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Experiment */}
      <div className="spring-balance-demo">
        <div className="demo-scene">
          {/* Floor */}
          <div className="floor-surface">
            <div className="floor-texture" />
          </div>

          {/* Brick with current surface */}
          <div className={`brick-object ${isPulling && pullingForce >= currentConfig.friction ? 'moving' : ''}`}>
            <div 
              className="brick-surface" 
              style={{ backgroundColor: currentConfig.color }}
            >
              <span className="brick-icon">{currentConfig.icon}</span>
              <span className="brick-label">
                {language === 'en' ? currentConfig.name : currentConfig.nameTelugu}
              </span>
            </div>
          </div>

          {/* String */}
          <div className="string-line" />

          {/* Spring Balance */}
          <div className="spring-balance">
            <div className="balance-body">
              <div className="balance-scale">
                <div className="scale-markers">
                  {[0, 2, 4, 6, 8, 10].map(mark => (
                    <div key={mark} className="scale-mark">
                      <span>{mark}</span>
                    </div>
                  ))}
                </div>
                <div 
                  className="scale-pointer"
                  style={{ 
                    transform: `translateY(${pullingForce * 10}px)`,
                    backgroundColor: pullingForce >= currentConfig.friction ? '#4caf50' : '#ff9800'
                  }}
                >
                  <span className="pointer-value">{pullingForce.toFixed(1)} N</span>
                </div>
              </div>
              <div className="balance-hook">🪝</div>
            </div>
          </div>

          {/* Hand pulling */}
          {isPulling && (
            <div className="pulling-hand">
              <span className="hand-emoji">✊</span>
            </div>
          )}
        </div>

        {/* Current Reading Display */}
        <div className="reading-display">
          <div className="reading-card">
            <h5>{language === 'en' ? 'Current Force' : 'ప్రస్తుత బలం'}:</h5>
            <div className="reading-value">
              <Badge variant={pullingForce >= currentConfig.friction ? 'success' : 'warning'} size="lg">
                {pullingForce.toFixed(1)} N
              </Badge>
            </div>
            {pullingForce >= currentConfig.friction && (
              <p className="status-message">
                ✓ {language === 'en' ? 'Brick is moving!' : 'ఇటుక కదులుతోంది!'}
              </p>
            )}
          </div>

          <div className="reading-card">
            <h5>{language === 'en' ? 'Friction Force' : 'ఘర్షణ బలం'}:</h5>
            <div className="reading-value">
              <Badge variant="primary" size="lg">
                {currentConfig.friction.toFixed(1)} N
              </Badge>
            </div>
            <p className="friction-desc">
              {language === 'en' ? currentConfig.description : currentConfig.descriptionTelugu}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls">
        <Button
          onClick={pullBrick}
          disabled={isPulling}
        >
          {isPulling ? (
            <>
              <TrendingUp size={18} className="spinning" />
              {language === 'en' ? 'Pulling...' : 'లాగుతోంది...'}
            </>
          ) : (
            <>
              <TrendingUp size={18} />
              {language === 'en' ? 'Pull Brick' : 'ఇటుక లాగండి'}
            </>
          )}
        </Button>

        <Button
          onClick={recordReading}
          disabled={isPulling || pullingForce < currentConfig.friction - 0.5}
          variant="success"
        >
          <Check size={18} />
          {language === 'en' ? 'Record Reading' : 'రీడింగ్ రికార్డ్ చేయండి'}
        </Button>

        <Button onClick={reset} variant="secondary" disabled={isPulling}>
          <RefreshCw size={18} />
          {language === 'en' ? 'Reset' : 'రీసెట్'}
        </Button>
      </div>

      {/* Recordings Table */}
      {recordings.length > 0 && (
        <div className="recordings-panel">
          <div className="panel-header">
            <h4>{language === 'en' ? '📊 Recorded Measurements' : '📊 రికార్డ్ చేసిన కొలతలు'}:</h4>
            <Button size="sm" variant="ghost" onClick={resetAll}>
              {language === 'en' ? 'Clear All' : 'అన్నీ క్లియర్ చేయండి'}
            </Button>
          </div>
          
          <table className="recordings-table">
            <thead>
              <tr>
                <th>#</th>
                <th>{language === 'en' ? 'Surface Type' : 'ఉపరితల రకం'}</th>
                <th>{language === 'en' ? 'Friction Force (N)' : 'ఘర్షణ బలం (N)'}</th>
                <th>{language === 'en' ? 'Time' : 'సమయం'}</th>
              </tr>
            </thead>
            <tbody>
              {recordings.map((record, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{record.surface}</td>
                  <td>
                    <Badge variant="info">{record.force} N</Badge>
                  </td>
                  <td>{record.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Comparison */}
          {recordings.length >= 2 && (
            <div className="comparison-box">
              <h5>📈 {language === 'en' ? 'Comparison' : 'పోలిక'}:</h5>
              <p>
                {language === 'en' ? (
                  <>
                    <strong>Highest friction:</strong> Bare brick ({surfaces.bare.friction} N)<br />
                    <strong>Lowest friction:</strong> Polythene ({surfaces.polythene.friction} N)<br />
                    <strong>Conclusion:</strong> Smoother surfaces have LESS friction!
                  </>
                ) : (
                  <>
                    <strong>అత్యధిక ఘర్షణ:</strong> బేర్ ఇటుక ({surfaces.bare.friction} N)<br />
                    <strong>అతి తక్కువ ఘర్షణ:</strong> పాలిథీన్ ({surfaces.polythene.friction} N)<br />
                    <strong>తీర్మానం:</strong> మృదువైన ఉపరితలాలు తక్కువ ఘర్షణను కలిగి ఉంటాయి!
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Spring Balance Info Box */}
      <div className="info-box">
        <h4>📏 {language === 'en' ? 'Spring Balance' : 'స్ప్రింగ్ బ్యాలెన్స్'}:</h4>
        <p>
          {language === 'en'
            ? 'A spring balance measures force. When you pull, the spring stretches and shows the force on a scale. The reading when the object JUST starts moving gives the friction force.'
            : 'స్ప్రింగ్ బ్యాలెన్స్ బలాన్ని కొలుస్తుంది. మీరు లాగినప్పుడు, స్ప్రింగ్ సాగుతుంది మరియు స్కేల్‌పై బలాన్ని చూపుతుంది. వస్తువు కదలడం ప్రారంభించినప్పుడు రీడింగ్ ఘర్షణ బలాన్ని ఇస్తుంది.'}
        </p>
      </div>

      {/* Key Learnings */}
      <div className="key-learnings">
        <h4>{language === 'en' ? '🎯 Key Learning' : '🎯 ముఖ్య అభ్యాసం'}:</h4>
        <ul>
          <li>
            {language === 'en'
              ? 'Friction depends on the NATURE of surfaces in contact'
              : 'ఘర్షణ సంపర్కంలో ఉన్న ఉపరితలాల స్వభావంపై ఆధారపడి ఉంటుంది'}
          </li>
          <li>
            {language === 'en'
              ? 'Rough surfaces (bare brick) have MORE friction'
              : 'కఠినమైన ఉపరితలాలు (బేర్ ఇటుక) ఎక్కువ ఘర్షణను కలిగి ఉంటాయి'}
          </li>
          <li>
            {language === 'en'
              ? 'Smooth surfaces (polythene) have LESS friction'
              : 'మృదువైన ఉపరితలాలు (పాలిథీన్) తక్కువ ఘర్షణను కలిగి ఉంటాయి'}
          </li>
          <li>
            {language === 'en'
              ? 'More force is needed to overcome higher friction'
              : 'ఎక్కువ ఘర్షణను అధిగమించడానికి ఎక్కువ బలం అవసరం'}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Activity_2_2;
