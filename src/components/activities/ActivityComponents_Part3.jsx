import React, { useState, useEffect } from 'react';
import { Check, Droplets, Play, Pause, RefreshCw, TrendingUp } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import './ActivityComponents.css';

// ==================== ACTIVITY 1.8: Liquid Pressure vs Height ====================
export function Activity_1_8({ language }) {
  const [waterHeight, setWaterHeight] = useState(50);
  const [isPouring, setIsPouring] = useState(false);
  const [observations, setObservations] = useState([]);

  // Calculate bulge based on water height (pressure = ρgh)
  const calculateBulge = (height) => {
    // Bulge is proportional to pressure
    return (height / 100) * 50; // Max 50px bulge
  };

  const bulge = calculateBulge(waterHeight);

  const recordObservation = () => {
    const newObs = {
      height: waterHeight,
      bulge: bulge.toFixed(1),
      pressure: (waterHeight * 0.098).toFixed(2) // Simplified: P = ρgh (using g≈10 m/s²)
    };
    setObservations([...observations, newObs]);
  };

  return (
    <div className="activity-container">
      <div className="activity-instructions">
        <h4>{language === 'en' ? 'Instructions' : 'సూచనలు'}:</h4>
        <p>
          {language === 'en'
            ? 'Adjust the water height and observe how the rubber sheet at the bottom bulges. Higher water level = greater pressure at bottom!'
            : 'నీటి ఎత్తును సర్దుబాటు చేసి, దిగువన ఉన్న రబ్బరు షీట్ ఎలా ఉబ్బుతుందో గమనించండి. ఎక్కువ నీటి స్థాయి = దిగువన ఎక్కువ పీడనం!'}
        </p>
      </div>

      <div className="pressure-demo">
        <div className="demo-area">
          {/* Water Tube Setup */}
          <div className="tube-container">
            {/* Tube */}
            <div className="glass-tube vertical">
              <div className="tube-walls">
                {/* Water level */}
                <div 
                  className="water-level"
                  style={{ height: `${waterHeight}%` }}
                >
                  {isPouring && (
                    <div className="water-animation">
                      💧
                    </div>
                  )}
                  <span className="height-label">
                    {waterHeight}cm
                  </span>
                </div>
                
                {/* Measurement marks */}
                <div className="measurement-marks">
                  {[0, 25, 50, 75, 100].map(mark => (
                    <div key={mark} className="mark" style={{ bottom: `${mark}%` }}>
                      <span className="mark-label">{mark}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rubber sheet at bottom */}
              <div className="rubber-sheet bottom">
                <div 
                  className="bulge"
                  style={{ 
                    height: `${bulge}px`,
                    width: `${bulge * 1.5}px`
                  }}
                >
                  <span className="bulge-label">
                    {bulge.toFixed(1)}mm
                  </span>
                </div>
              </div>
            </div>

            {/* Pressure indicator */}
            <div className="pressure-indicator">
              <TrendingUp size={20} />
              <div className="pressure-bar">
                <div 
                  className="pressure-fill"
                  style={{ height: `${waterHeight}%` }}
                />
              </div>
              <span className="pressure-label">
                {language === 'en' ? 'Pressure' : 'పీడనం'}
              </span>
            </div>
          </div>

          {/* Information Panel */}
          <div className="info-panel">
            <h4>{language === 'en' ? '📊 Current Readings' : '📊 ప్రస్తుత రీడింగులు'}:</h4>
            <div className="reading-item">
              <span className="reading-label">{language === 'en' ? 'Water Height (h)' : 'నీటి ఎత్తు (h)'}:</span>
              <Badge variant="primary" size="lg">{waterHeight} cm</Badge>
            </div>
            <div className="reading-item">
              <span className="reading-label">{language === 'en' ? 'Bulge' : 'ఉబ్బరం'}:</span>
              <Badge variant="warning" size="lg">{bulge.toFixed(1)} mm</Badge>
            </div>
            <div className="reading-item">
              <span className="reading-label">{language === 'en' ? 'Pressure (P)' : 'పీడనం (P)'}:</span>
              <Badge variant="success" size="lg">{(waterHeight * 0.098).toFixed(2)} kPa</Badge>
            </div>
            
            <div className="formula-box">
              <strong>{language === 'en' ? 'Formula' : 'సూత్రం'}:</strong>
              <p className="formula">P = ρgh</p>
              <p className="formula-explanation">
                {language === 'en' ? (
                  <>ρ = density, g = gravity, h = height</>
                ) : (
                  <>ρ = సాంద్రత, g = గురుత్వాకర్షణ, h = ఎత్తు</>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls">
          <div className="control-group">
            <label>
              {language === 'en' ? 'Water Height' : 'నీటి ఎత్తు'}: {waterHeight}cm
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={waterHeight}
              onChange={(e) => setWaterHeight(parseInt(e.target.value))}
              className="height-slider"
            />
            <div className="preset-heights">
              {[25, 50, 75, 100].map(h => (
                <button
                  key={h}
                  className="preset-btn"
                  onClick={() => setWaterHeight(h)}
                >
                  {h}cm
                </button>
              ))}
            </div>
          </div>

          <div className="action-buttons">
            <Button 
              onClick={() => setIsPouring(!isPouring)}
              variant="secondary"
            >
              <Droplets size={18} />
              {isPouring ? (language === 'en' ? 'Stop Pouring' : 'పోయడం ఆపండి') : (language === 'en' ? 'Pour Water' : 'నీరు పోయండి')}
            </Button>
            
            <Button onClick={recordObservation}>
              <Check size={18} />
              {language === 'en' ? 'Record Reading' : 'రీడింగ్ రికార్డ్ చేయండి'}
            </Button>
          </div>
        </div>

        {/* Observations Table */}
        {observations.length > 0 && (
          <div className="observations-table">
            <h4>{language === 'en' ? '📝 Recorded Observations' : '📝 రికార్డ్ చేసిన పరిశీలనలు'}:</h4>
            <table>
              <thead>
                <tr>
                  <th>{language === 'en' ? 'Trial' : 'ప్రయత్నం'}</th>
                  <th>{language === 'en' ? 'Height (cm)' : 'ఎత్తు (సెం.మీ)'}</th>
                  <th>{language === 'en' ? 'Bulge (mm)' : 'ఉబ్బరం (మిమీ)'}</th>
                  <th>{language === 'en' ? 'Pressure (kPa)' : 'పీడనం (kPa)'}</th>
                </tr>
              </thead>
              <tbody>
                {observations.map((obs, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{obs.height}</td>
                    <td>{obs.bulge}</td>
                    <td>{obs.pressure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="key-learnings">
        <h4>{language === 'en' ? '🎯 Key Learning' : '🎯 ముఖ్య అభ్యాసం'}:</h4>
        <ul>
          <li>
            {language === 'en'
              ? 'Liquid pressure INCREASES with DEPTH (height of liquid above)'
              : 'ద్రవ పీడనం లోతుతో (పైన ఉన్న ద్రవం ఎత్తు) పెరుగుతుంది'}
          </li>
          <li>
            {language === 'en'
              ? 'Pressure = ρgh (density × gravity × height)'
              : 'పీడనం = ρgh (సాంద్రత × గురుత్వాకర్షణ × ఎత్తు)'}
          </li>
          <li>
            {language === 'en'
              ? 'Greater bulge = Greater pressure'
              : 'ఎక్కువ ఉబ్బరం = ఎక్కువ పీడనం'}
          </li>
        </ul>
      </div>
    </div>
  );
}

// ==================== ACTIVITY 1.9: Liquid Pressure on Container Walls ====================
export function Activity_1_9({ language }) {
  const [waterLevel, setWaterLevel] = useState(50);
  const [showPressure, setShowPressure] = useState(false);

  // Pressure on side wall at different depths
  const getPressureAtDepth = (depth) => {
    return (depth / 100) * 40; // Simplified calculation
  };

  return (
    <div className="activity-container">
      <div className="activity-instructions">
        <h4>{language === 'en' ? 'Instructions' : 'సూచనలు'}:</h4>
        <p>
          {language === 'en'
            ? 'Observe how the rubber sheet on the SIDE of the bottle bulges. Liquids exert pressure on ALL sides, not just downward!'
            : 'సీసా వైపున ఉన్న రబ్బరు షీట్ ఎలా ఉబ్బుతుందో గమనించండి. ద్రవాలు అన్ని వైపులా పీడనాన్ని ప్రయోగిస్తాయి, కేవలం క్రిందికి మాత్రమే కాదు!'}
        </p>
      </div>

      <div className="wall-pressure-demo">
        <div className="demo-area">
          {/* Bottle with side tube */}
          <div className="bottle-setup">
            <div className="plastic-bottle">
              {/* Water in bottle */}
              <div 
                className="water-in-bottle"
                style={{ height: `${waterLevel}%` }}
              >
                <span className="level-indicator">{waterLevel}%</span>
              </div>

              {/* Side tube attachment */}
              <div className="side-tube" style={{ bottom: '30%' }}>
                <div className="glass-tube horizontal">
                  <div className="tube-water" style={{ width: showPressure ? '80%' : '0%' }} />
                  
                  {/* Rubber sheet on the end */}
                  <div className="rubber-sheet side">
                    {showPressure && (
                      <div 
                        className="bulge-side"
                        style={{ 
                          width: `${getPressureAtDepth(waterLevel * 0.7)}px`
                        }}
                      >
                        <span className="bulge-amount">
                          {getPressureAtDepth(waterLevel * 0.7).toFixed(1)}mm
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Pressure arrows */}
            {showPressure && (
              <div className="pressure-arrows">
                <div className="arrow left">←</div>
                <div className="arrow right">→</div>
                <div className="arrow down">↓</div>
                <div className="arrow-label">
                  {language === 'en' ? 'Pressure in all directions' : 'అన్ని దిశలలో పీడనం'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="controls">
          <div className="control-group">
            <label>
              {language === 'en' ? 'Water Level' : 'నీటి స్థాయి'}: {waterLevel}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={waterLevel}
              onChange={(e) => setWaterLevel(parseInt(e.target.value))}
              className="level-slider"
            />
          </div>

          <Button onClick={() => setShowPressure(!showPressure)}>
            {showPressure ? <Pause size={18} /> : <Play size={18} />}
            {language === 'en' ? 'Show Pressure' : 'పీడనం చూపించు'}
          </Button>
        </div>

        {showPressure && (
          <div className="result-panel">
            <h4>{language === 'en' ? '📊 Observation' : '📊 పరిశీలన'}:</h4>
            <Badge variant="info" size="lg">
              {language === 'en' 
                ? 'Rubber sheet bulges outward - liquids exert pressure on container walls!'
                : 'రబ్బరు షీట్ బయటికి ఉబ్బుతుంది - ద్రవాలు కంటైనర్ గోడలపై పీడనం ప్రయోగిస్తాయి!'}
            </Badge>
          </div>
        )}
      </div>

      <div className="key-learnings">
        <h4>{language === 'en' ? '🎯 Key Learning' : '🎯 ముఖ్య అభ్యాసం'}:</h4>
        <ul>
          <li>
            {language === 'en'
              ? 'Liquids exert pressure on the WALLS of the container'
              : 'ద్రవాలు కంటైనర్ గోడలపై పీడనం ప్రయోగిస్తాయి'}
          </li>
          <li>
            {language === 'en'
              ? 'Pressure acts in ALL directions, not just downward'
              : 'పీడనం అన్ని దిశలలో పనిచేస్తుంది, కేవలం క్రిందికి మాత్రమే కాదు'}
          </li>
          <li>
            {language === 'en'
              ? 'This is why dams are thicker at the bottom - more pressure there!'
              : 'ఈ కారణంగా ఆనకట్టలు దిగువన మందంగా ఉంటాయి - అక్కడ ఎక్కువ పీడనం!'}
          </li>
        </ul>
      </div>
    </div>
  );
}

// ==================== ACTIVITY 1.10: Equal Pressure at Same Depth ====================
export function Activity_1_10({ language }) {
  const [waterHeight, setWaterHeight] = useState(70);
  const [showStreams, setShowStreams] = useState(false);

  // All holes at same height should have equal stream distance
  const streamDistance = (waterHeight / 100) * 150; // in pixels

  const holes = [
    { id: 1, angle: -30, label: 'A' },
    { id: 2, angle: 0, label: 'B' },
    { id: 3, angle: 30, label: 'C' }
  ];

  return (
    <div className="activity-container">
      <div className="activity-instructions">
        <h4>{language === 'en' ? 'Instructions' : 'సూచనలు'}:</h4>
        <p>
          {language === 'en'
            ? 'Make holes at the SAME HEIGHT in the bottle and observe. All water streams fall at the same distance - proving equal pressure at same depth!'
            : 'సీసాలో ఒకే ఎత్తులో రంధ్రాలు చేసి గమనించండి. అన్ని నీటి ప్రవాహాలు ఒకే దూరంలో పడతాయి - ఒకే లోతులో సమాన పీడనం ఉన్నట్లు రుజువు చేస్తుంది!'}
        </p>
      </div>

      <div className="equal-pressure-demo">
        <div className="demo-area">
          <div className="bottle-with-holes">
            {/* Bottle */}
            <div className="bottle">
              <div 
                className="water"
                style={{ height: `${waterHeight}%` }}
              />

              {/* Holes at same height */}
              <div className="holes-row" style={{ bottom: '30%' }}>
                {holes.map(hole => (
                  <div 
                    key={hole.id}
                    className="hole"
                    style={{ 
                      left: `${50 + hole.angle}%`,
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <span className="hole-label">{hole.label}</span>
                    
                    {showStreams && waterHeight > 30 && (
                      <div 
                        className="water-stream"
                        style={{
                          width: `${streamDistance}px`,
                          transform: `rotate(${hole.angle}deg)`
                        }}
                      >
                        <div className="stream-animation">💧💧💧</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Height indicator */}
              <div className="height-line" style={{ bottom: '30%' }}>
                <span className="line-label">
                  {language === 'en' ? 'Same Height' : 'ఒకే ఎత్తు'}
                </span>
              </div>
            </div>

            {/* Ground/collection area */}
            <div className="ground">
              {showStreams && waterHeight > 30 && (
                <>
                  {holes.map(hole => (
                    <div 
                      key={hole.id}
                      className="landing-point"
                      style={{ 
                        left: `${50 + hole.angle + (streamDistance / 10)}%`
                      }}
                    >
                      <div className="splash">💦</div>
                      <span className="distance-label">
                        {streamDistance.toFixed(0)}px
                      </span>
                    </div>
                  ))}
                  
                  <div className="equal-distance-indicator">
                    <Check size={20} className="check-icon" />
                    {language === 'en' ? 'All Equal!' : 'అన్నీ సమానం!'}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls">
          <div className="control-group">
            <label>
              {language === 'en' ? 'Water Level' : 'నీటి స్థాయి'}: {waterHeight}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={waterHeight}
              onChange={(e) => setWaterHeight(parseInt(e.target.value))}
              className="level-slider"
            />
          </div>

          <Button onClick={() => setShowStreams(!showStreams)}>
            {showStreams ? <Pause size={18} /> : <Play size={18} />}
            {language === 'en' ? 'Release Water' : 'నీరు విడుదల చేయండి'}
          </Button>
        </div>

        {showStreams && waterHeight > 30 && (
          <div className="result-panel">
            <h4>{language === 'en' ? '📊 Result' : '📊 ఫలితం'}:</h4>
            <Badge variant="success" size="lg">
              {language === 'en' 
                ? '✓ All streams reach the same distance!'
                : '✓ అన్ని ప్రవాహాలు ఒకే దూరానికి చేరుకుంటాయి!'}
            </Badge>
            <p className="result-explanation">
              {language === 'en' ? (
                <>
                  Since all holes are at the <strong>same depth</strong>, they experience 
                  the <strong>same pressure</strong>, resulting in equal stream distances.
                </>
              ) : (
                <>
                  అన్ని రంధ్రాలు <strong>ఒకే లోతులో</strong> ఉన్నందున, అవి 
                  <strong>ఒకే పీడనాన్ని</strong> అనుభవిస్తాయి, ఫలితంగా సమాన ప్రవాహ దూరాలు ఉంటాయి.
                </>
              )}
            </p>
          </div>
        )}
      </div>

      <div className="key-learnings">
        <h4>{language === 'en' ? '🎯 Key Learning' : '🎯 ముఖ్య అభ్యాసం'}:</h4>
        <ul>
          <li>
            {language === 'en'
              ? 'At the SAME DEPTH, pressure is EQUAL in all directions'
              : 'ఒకే లోతులో, పీడనం అన్ని దిశలలో సమానంగా ఉంటుంది'}
          </li>
          <li>
            {language === 'en'
              ? 'Pressure depends only on depth, not on direction'
              : 'పీడనం కేవలం లోతుపై ఆధారపడి ఉంటుంది, దిశపై కాదు'}
          </li>
          <li>
            {language === 'en'
              ? 'This is why water towers provide equal pressure to all houses at same height'
              : 'ఈ కారణంగా నీటి టవర్లు ఒకే ఎత్తులో ఉన్న అన్ని ఇళ్లకు సమాన పీడనాన్ని అందిస్తాయి'}
          </li>
        </ul>
      </div>
    </div>
  );
}

// ==================== ACTIVITY 1.11: Atmospheric Pressure ====================
export function Activity_1_11({ language }) {
  const [suckerAttached, setSuckerAttached] = useState(false);
  const [pullingForce, setPullingForce] = useState(0);
  const [showPressure, setShowPressure] = useState(false);

  const atmosphericPressure = 101.3; // kPa
  const suckerArea = 25; // cm²
  const forceRequired = (atmosphericPressure * suckerArea / 10).toFixed(1); // Simplified

  return (
    <div className="activity-container">
      <div className="activity-instructions">
        <h4>{language === 'en' ? 'Instructions' : 'సూచనలు'}:</h4>
        <p>
          {language === 'en'
            ? 'Press the rubber sucker on a smooth surface and try to pull it off. Feel how hard it is! This is atmospheric pressure at work.'
            : 'మృదువైన ఉపరితలంపై రబ్బరు సక్కర్‌ను నొక్కి దానిను తీయడానికి ప్రయత్నించండి. ఇది ఎంత కష్టమో అనుభవించండి! ఇది పనిచేస్తున్న వాతావరణ పీడనం.'}
        </p>
      </div>

      <div className="atmospheric-demo">
        <div className="demo-area">
          {/* Smooth surface (wall/table) */}
          <div className="smooth-surface">
            <div className="surface-label">
              {language === 'en' ? 'Smooth Surface' : 'మృదువైన ఉపరితలం'}
            </div>

            {/* Sucker */}
            <div className={`rubber-sucker ${suckerAttached ? 'attached' : ''}`}>
              <div className="sucker-body">
                {!suckerAttached ? (
                  <div className="sucker-content">
                    <div className="air-inside">🌫️</div>
                    <span className="status">{language === 'en' ? 'With air' : 'గాలితో'}</span>
                  </div>
                ) : (
                  <div className="sucker-content vacuum">
                    <span className="status">{language === 'en' ? 'Vacuum!' : 'వాక్యూమ్!'}</span>
                  </div>
                )}
              </div>

              {/* Handle */}
              <div className="sucker-handle">
                {suckerAttached && pullingForce > 0 && (
                  <div className="pulling-hand" style={{ transform: `translateX(${pullingForce * 2}px)` }}>
                    ✊
                  </div>
                )}
              </div>
            </div>

            {/* Pressure visualization */}
            {showPressure && suckerAttached && (
              <div className="pressure-visualization">
                <div className="pressure-arrows-atm">
                  <div className="arrow-atm top">↓</div>
                  <div className="arrow-atm bottom">↑</div>
                  <div className="arrow-atm left">→</div>
                  <div className="arrow-atm right">←</div>
                </div>
                <div className="pressure-label-atm">
                  {language === 'en' ? 'Atmospheric Pressure' : 'వాతావరణ పీడనం'}<br />
                  {atmosphericPressure} kPa
                </div>
              </div>
            )}
          </div>

          {/* Information panel */}
          <div className="info-panel-atm">
            <h4>{language === 'en' ? 'How it works' : 'ఇది ఎలా పనిచేస్తుంది'}:</h4>
            
            <div className="step-by-step">
              <div className="step">
                <div className="step-num">1</div>
                <p>
                  {language === 'en'
                    ? 'Press sucker → Air inside pushed out'
                    : 'సక్కర్‌ను నొక్కండి → లోపల గాలి బయటకు నెట్టబడుతుంది'}
                </p>
              </div>
              <div className="step">
                <div className="step-num">2</div>
                <p>
                  {language === 'en'
                    ? 'Vacuum (no air) created inside'
                    : 'లోపల వాక్యూమ్ (గాలి లేదు) సృష్టించబడుతుంది'}
                </p>
              </div>
              <div className="step">
                <div className="step-num">3</div>
                <p>
                  {language === 'en'
                    ? 'Atmospheric pressure from outside pushes sucker down'
                    : 'బయటి వాతావరణ పీడనం సక్కర్‌ను క్రిందికి నెట్టుతుంది'}
                </p>
              </div>
              <div className="step">
                <div className="step-num">4</div>
                <p>
                  {language === 'en'
                    ? 'Hard to pull off - fighting atmospheric pressure!'
                    : 'తీయడం కష్టం - వాతావరణ పీడనంతో పోరాడుతున్నారు!'}
                </p>
              </div>
            </div>

            {suckerAttached && (
              <div className="force-calculation">
                <h5>{language === 'en' ? '🔬 Calculation' : '🔬 గణన'}:</h5>
                <div className="calc-row">
                  <span>{language === 'en' ? 'Sucker Area' : 'సక్కర్ ప్రాంతం'}:</span>
                  <Badge variant="info">{suckerArea} cm²</Badge>
                </div>
                <div className="calc-row">
                  <span>{language === 'en' ? 'Atmospheric Pressure' : 'వాతావరణ పీడనం'}:</span>
                  <Badge variant="info">{atmosphericPressure} kPa</Badge>
                </div>
                <div className="calc-row formula-result">
                  <span>{language === 'en' ? 'Force = P × A' : 'బలం = P × A'}:</span>
                  <Badge variant="success" size="lg">{forceRequired} N</Badge>
                </div>
                <p className="calc-note">
                  {language === 'en' 
                    ? `That's like lifting a ${(forceRequired / 10).toFixed(1)} kg weight!`
                    : `అది ${(forceRequired / 10).toFixed(1)} కేజీ బరువును ఎత్తడం లాంటిది!`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="controls">
          {!suckerAttached ? (
            <Button onClick={() => setSuckerAttached(true)}>
              {language === 'en' ? '👇 Press Sucker on Surface' : '👇 సక్కర్‌ను ఉపరితలంపై నొక్కండి'}
            </Button>
          ) : (
            <>
              <div className="control-group">
                <label>
                  {language === 'en' ? 'Pulling Force' : 'లాగే బలం'}: {pullingForce} N
                </label>
                <input
                  type="range"
                  min="0"
                  max={forceRequired}
                  value={pullingForce}
                  onChange={(e) => setPullingForce(parseInt(e.target.value))}
                  className="force-slider"
                />
                <p className="slider-hint">
                  {pullingForce < forceRequired * 0.9 
                    ? (language === 'en' ? '💪 Pull harder!' : '💪 మరింత బలంగా లాగండి!')
                    : (language === 'en' ? '🎉 Almost there!' : '🎉 దాదాపు వచ్చేశారు!')}
                </p>
              </div>

              <div className="action-buttons">
                <Button onClick={() => setShowPressure(!showPressure)} variant="secondary">
                  {language === 'en' ? 'Show Pressure' : 'పీడనం చూపించు'}
                </Button>

                <Button 
                  onClick={() => {
                    setSuckerAttached(false);
                    setPullingForce(0);
                  }}
                >
                  <RefreshCw size={18} />
                  {language === 'en' ? 'Reset' : 'రీసెట్'}
                </Button>
              </div>
            </>
          )}
        </div>

        {suckerAttached && pullingForce >= forceRequired * 0.9 && (
          <div className="success-message">
            <h3>🎉 {language === 'en' ? 'Sucker pulled off!' : 'సక్కర్ తీసేశారు!'}</h3>
            <p>
              {language === 'en'
                ? `You overcame ${forceRequired} N of atmospheric force!`
                : `మీరు ${forceRequired} N వాతావరణ బలాన్ని అధిగమించారు!`}
            </p>
          </div>
        )}
      </div>

      <div className="key-learnings">
        <h4>{language === 'en' ? '🎯 Key Learning' : '🎯 ముఖ్య అభ్యాసం'}:</h4>
        <ul>
          <li>
            {language === 'en'
              ? 'Atmospheric pressure is HUGE - about 101 kPa at sea level'
              : 'వాతావరణ పీడనం చాలా పెద్దది - సముద్ర మట్టం వద్ద దాదాపు 101 kPa'}
          </li>
          <li>
            {language === 'en'
              ? 'We don\'t feel it because pressure inside our body balances it'
              : 'మన శరీరం లోపల పీడనం దానిని సమతుల్యం చేస్తుంది కాబట్టి మనకు అనిపించదు'}
          </li>
          <li>
            {language === 'en'
              ? 'Sucker works by creating vacuum - no air inside means unbalanced pressure'
              : 'సక్కర్ వాక్యూమ్ సృష్టించడం ద్వారా పనిచేస్తుంది - లోపల గాలి లేకపోవడం అంటే అసమతుల్య పీడనం'}
          </li>
          <li>
            {language === 'en'
              ? 'Force = Pressure × Area (F = P × A)'
              : 'బలం = పీడనం × ప్రాంతం (F = P × A)'}
          </li>
        </ul>
      </div>
    </div>
  );
}

// Activities are already exported individually above (export function)
