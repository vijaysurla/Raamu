import React, { useState } from 'react';
import { Play, RotateCcw, Check } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import './Chapter2Activities.css';

// ==================================================
// ACTIVITY 2.3: Inclined Plane - Surface Friction
// ==================================================
export function Activity_2_3({ language }) {
  const [currentSurface, setCurrentSurface] = useState('smooth');
  const [isRolling, setIsRolling] = useState(false);
  const [cellPosition, setCellPosition] = useState({ x: 20, y: 30 }); // % from top-left
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [trials, setTrials] = useState([]);

  const surfaces = {
    smooth: {
      name: 'Smooth Table',
      nameTelugu: 'మృదువైన టేబుల్',
      friction: 0.1,
      distance: 85, // percentage of table length
      description: 'Low friction - travels far',
      descriptionTelugu: 'తక్కువ ఘర్షణ - దూరం ప్రయాణిస్తుంది',
      color: '#b39ddb',
      icon: '📋'
    },
    cloth: {
      name: 'Cloth Surface',
      nameTelugu: 'వస్త్ర ఉపరితలం',
      friction: 0.3,
      distance: 50,
      description: 'Medium friction',
      descriptionTelugu: 'మధ్యస్థ ఘర్షణ',
      color: '#90caf9',
      icon: '🧺'
    },
    sand: {
      name: 'Sand Surface',
      nameTelugu: 'ఇసుక ఉపరితలం',
      friction: 0.8,
      distance: 20,
      description: 'High friction - stops quickly',
      descriptionTelugu: 'అధిక ఘర్షణ - త్వరగా ఆగుతుంది',
      color: '#ffb74d',
      icon: '🏖️'
    }
  };

  const currentConfig = surfaces[currentSurface];

  const releaseCell = () => {
    setIsRolling(true);
    
    // Animate cell rolling down incline
    let progress = 0;
    const rollInterval = setInterval(() => {
      progress += 2;
      
      // Move down the incline
      if (progress <= 50) {
        setCellPosition({
          x: 20 + progress * 0.6,
          y: 30 + progress * 0.8
        });
      } else {
        // Move on flat surface
        const flatProgress = progress - 50;
        const maxDistance = currentConfig.distance;
        const actualDistance = Math.min(flatProgress, maxDistance);
        
        setCellPosition({
          x: 50 + actualDistance * 0.5,
          y: 70
        });
        
        setDistanceTraveled(actualDistance);
        
        // Stop when reached max distance
        if (flatProgress >= maxDistance) {
          clearInterval(rollInterval);
          setIsRolling(false);
        }
      }
    }, 30);
  };

  const recordTrial = () => {
    const trial = {
      surface: language === 'en' ? currentConfig.name : currentConfig.nameTelugu,
      distance: distanceTraveled.toFixed(0),
      friction: currentConfig.friction,
      timestamp: new Date().toLocaleTimeString()
    };
    setTrials([...trials, trial]);
  };

  const reset = () => {
    setCellPosition({ x: 20, y: 30 });
    setDistanceTraveled(0);
    setIsRolling(false);
  };

  const resetAll = () => {
    reset();
    setTrials([]);
    setCurrentSurface('smooth');
  };

  return (
    <div className="activity-container">
      <div className="activity-instructions">
        <h4>{language === 'en' ? 'Instructions' : 'సూచనలు'}:</h4>
        <p>
          {language === 'en'
            ? 'Release the pencil cell from point A on the inclined plane. Observe how far it travels on different surfaces. The distance tells us about friction!'
            : 'వంపు తలంపై A బిందువు నుండి పెన్సిల్ సెల్‌ను విడుదల చేయండి. వివిధ ఉపరితలాలపై అది ఎంత దూరం ప్రయాణిస్తుందో గమనించండి. దూరం మనకు ఘర్షణ గురించి చెబుతుంది!'}
        </p>
      </div>

      {/* Surface Selector */}
      <div className="surface-selector">
        <h4>{language === 'en' ? 'Select Surface:' : 'ఉపరితలాన్ని ఎంచుకోండి:'}</h4>
        <div className="surface-buttons">
          {Object.keys(surfaces).map((key) => (
            <button
              key={key}
              className={`surface-btn ${currentSurface === key ? 'active' : ''}`}
              onClick={() => {
                setCurrentSurface(key);
                reset();
              }}
              disabled={isRolling}
            >
              <span className="surface-icon">{surfaces[key].icon}</span>
              <div className="surface-info">
                <span className="surface-name">
                  {language === 'en' ? surfaces[key].name : surfaces[key].nameTelugu}
                </span>
                <span className="surface-friction">
                  {language === 'en' ? 'Friction' : 'ఘర్షణ'}: {surfaces[key].friction}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Experiment */}
      <div className="incline-plane-demo">
        <svg width="100%" height="400" viewBox="0 0 600 400" className="demo-svg">
          {/* Ground */}
          <rect x="0" y="350" width="600" height="50" fill="#8d6e63" />
          
          {/* Surface on table - changes based on selection */}
          <rect 
            x="250" 
            y="280" 
            width="350" 
            height="70" 
            fill={currentConfig.color}
            opacity="0.7"
          />
          
          {/* Inclined plane */}
          <polygon
            points="50,280 250,280 250,150"
            fill="#d7ccc8"
            stroke="#5d4037"
            strokeWidth="3"
          />
          
          {/* Support bricks */}
          <g>
            <rect x="180" y="280" width="40" height="70" fill="#bf360c" stroke="#5d4037" strokeWidth="2" />
            <rect x="230" y="280" width="40" height="70" fill="#bf360c" stroke="#5d4037" strokeWidth="2" />
          </g>
          
          {/* Point A marker */}
          <circle cx="60" cy="270" r="5" fill="#f44336" />
          <text x="40" y="265" fill="#f44336" fontSize="16" fontWeight="bold">A</text>
          
          {/* Pencil cell */}
          <g transform={`translate(${cellPosition.x * 6}, ${cellPosition.y * 4})`}>
            <ellipse 
              cx="0" 
              cy="0" 
              rx="25" 
              ry="10" 
              fill="#fdd835"
              stroke="#f57f17"
              strokeWidth="2"
              className={isRolling ? 'rotating' : ''}
            />
            <text x="-15" y="5" fontSize="12" fill="#000">CELL</text>
          </g>
          
          {/* Distance markers */}
          {!isRolling && distanceTraveled > 0 && (
            <>
              <line 
                x1="250" 
                y1="320" 
                x2={250 + (distanceTraveled * 3)} 
                y2="320" 
                stroke="#4caf50" 
                strokeWidth="3"
                markerEnd="url(#arrowhead)"
              />
              <text 
                x={250 + (distanceTraveled * 1.5)} 
                y="310" 
                fill="#4caf50" 
                fontSize="14" 
                fontWeight="bold"
              >
                {distanceTraveled.toFixed(0)} cm
              </text>
            </>
          )}
          
          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#4caf50" />
            </marker>
          </defs>
          
          {/* Surface label */}
          <text x="400" y="330" fontSize="18" fontWeight="bold" fill={currentConfig.color}>
            {currentConfig.icon} {language === 'en' ? currentConfig.name : currentConfig.nameTelugu}
          </text>
        </svg>
      </div>

      {/* Current Reading */}
      {distanceTraveled > 0 && !isRolling && (
        <div className="result-display">
          <div className="result-card">
            <h5>{language === 'en' ? 'Distance Traveled' : 'ప్రయాణించిన దూరం'}:</h5>
            <Badge variant="success" size="lg">{distanceTraveled.toFixed(0)} cm</Badge>
          </div>
          <div className="result-card">
            <h5>{language === 'en' ? 'Surface Type' : 'ఉపరితల రకం'}:</h5>
            <Badge variant="info" size="lg">
              {language === 'en' ? currentConfig.name : currentConfig.nameTelugu}
            </Badge>
            <p className="surface-desc">{language === 'en' ? currentConfig.description : currentConfig.descriptionTelugu}</p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="controls">
        <Button
          onClick={releaseCell}
          disabled={isRolling}
        >
          <Play size={18} />
          {language === 'en' ? 'Release Cell' : 'సెల్ విడుదల చేయండి'}
        </Button>

        <Button
          onClick={recordTrial}
          disabled={isRolling || distanceTraveled === 0}
          variant="success"
        >
          <Check size={18} />
          {language === 'en' ? 'Record Trial' : 'ప్రయత్నం రికార్డ్ చేయండి'}
        </Button>

        <Button onClick={reset} variant="secondary" disabled={isRolling}>
          <RotateCcw size={18} />
          {language === 'en' ? 'Reset' : 'రీసెట్'}
        </Button>
      </div>

      {/* Trials Table */}
      {trials.length > 0 && (
        <div className="trials-panel">
          <div className="panel-header">
            <h4>{language === 'en' ? '📊 Trial Results' : '📊 ప్రయత్న ఫలితాలు'}:</h4>
            <Button size="sm" variant="ghost" onClick={resetAll}>
              {language === 'en' ? 'Clear All' : 'అన్నీ క్లియర్ చేయండి'}
            </Button>
          </div>
          
          <table className="trials-table">
            <thead>
              <tr>
                <th>#</th>
                <th>{language === 'en' ? 'Surface' : 'ఉపరితలం'}</th>
                <th>{language === 'en' ? 'Distance (cm)' : 'దూరం (సెం.మీ)'}</th>
                <th>{language === 'en' ? 'Friction' : 'ఘర్షణ'}</th>
              </tr>
            </thead>
            <tbody>
              {trials.map((trial, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{trial.surface}</td>
                  <td>
                    <Badge variant="success">{trial.distance} cm</Badge>
                  </td>
                  <td>
                    <Badge 
                      variant={trial.friction < 0.3 ? 'info' : trial.friction < 0.6 ? 'warning' : 'error'}
                    >
                      {trial.friction}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Analysis */}
          {trials.length >= 2 && (
            <div className="analysis-box">
              <h5>📈 {language === 'en' ? 'Analysis' : 'విశ్లేషణ'}:</h5>
              <div className="analysis-content">
                <div className="analysis-item">
                  <span className="label">{language === 'en' ? 'Longest distance:' : 'అత్యధిక దూరం:'}</span>
                  <span className="value">
                    {language === 'en' ? 'Smooth table' : 'మృదువైన టేబుల్'} ({surfaces.smooth.distance} cm)
                  </span>
                </div>
                <div className="analysis-item">
                  <span className="label">{language === 'en' ? 'Shortest distance:' : 'అతి తక్కువ దూరం:'}</span>
                  <span className="value">
                    {language === 'en' ? 'Sand' : 'ఇసుక'} ({surfaces.sand.distance} cm)
                  </span>
                </div>
                <div className="conclusion">
                  <strong>✓ {language === 'en' ? 'Conclusion' : 'తీర్మానం'}:</strong>
                  <p>
                    {language === 'en'
                      ? 'Higher friction → Shorter distance. Lower friction → Longer distance!'
                      : 'అధిక ఘర్షణ → తక్కువ దూరం. తక్కువ ఘర్షణ → ఎక్కువ దూరం!'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Key Learnings */}
      <div className="key-learnings">
        <h4>{language === 'en' ? '🎯 Key Learning' : '🎯 ముఖ్య అభ్యాసం'}:</h4>
        <ul>
          <li>
            {language === 'en'
              ? 'The distance covered depends on the nature of the surface'
              : 'కప్పబడిన దూరం ఉపరితలం యొక్క స్వభావంపై ఆధారపడి ఉంటుంది'}
          </li>
          <li>
            {language === 'en'
              ? 'Smooth surface (table) → LOW friction → travels FAR'
              : 'మృదువైన ఉపరితలం (టేబుల్) → తక్కువ ఘర్షణ → దూరం ప్రయాణిస్తుంది'}
          </li>
          <li>
            {language === 'en'
              ? 'Rough surface (sand) → HIGH friction → stops QUICKLY'
              : 'కఠినమైన ఉపరితలం (ఇసుక) → అధిక ఘర్షణ → త్వరగా ఆగుతుంది'}
          </li>
          <li>
            {language === 'en'
              ? 'Friction opposes motion and converts kinetic energy to heat'
              : 'ఘర్షణ చలనాన్ని వ్యతిరేకిస్తుంది మరియు గతి శక్తిని వేడిగా మారుస్తుంది'}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Activity_2_3;
