import React, { useState, useEffect } from 'react';
import { Check, X, RotateCcw, Play, Pause, ChevronRight } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import './ActivityComponents.css';

// ==================== ACTIVITY 1.1: Classification Table ====================
export function Activity_1_1({ language }) {
  const [answers, setAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const items = [
    {
      id: 1,
      situation: 'Moving a book placed on a table',
      situationTelugu: 'బల్ల మీద ఉన్న పుస్తకాన్ని కదపడం',
      actions: ['Pushing', 'Pulling', 'Lifting'],
      correctAnswers: { push: true, pull: true }
    },
    {
      id: 2,
      situation: 'Opening or shutting a door',
      situationTelugu: 'తలుపును తెరవడం లేదా మూయడం',
      actions: ['Pushing', 'Pulling'],
      correctAnswers: { push: true, pull: true }
    },
    {
      id: 3,
      situation: 'Drawing a bucket of water from a well',
      situationTelugu: 'బావి నుండి నీటి బకెట్ తీయడం',
      actions: ['Pulling', 'Lifting'],
      correctAnswers: { push: false, pull: true }
    },
    {
      id: 4,
      situation: 'A football player taking a penalty kick',
      situationTelugu: 'ఫుట్‌బాల్ ఆటగాడు పెనాల్టీ కిక్ తీసుకోవడం',
      actions: ['Kicking', 'Hitting'],
      correctAnswers: { push: true, pull: false }
    },
    {
      id: 5,
      situation: 'A cricket ball hit by a batsman',
      situationTelugu: 'బ్యాట్స్‌మన్ కొట్టిన క్రికెట్ బంతి',
      actions: ['Hitting', 'Pushing'],
      correctAnswers: { push: true, pull: false }
    },
    {
      id: 6,
      situation: 'Moving a loaded cart',
      situationTelugu: 'లోడ్ చేసిన బండిను కదపడం',
      actions: ['Pushing', 'Pulling'],
      correctAnswers: { push: true, pull: true }
    },
    {
      id: 7,
      situation: 'Opening a drawer',
      situationTelugu: 'డ్రాయర్ తెరవడం',
      actions: ['Pulling'],
      correctAnswers: { push: false, pull: true }
    }
  ];

  const handleCheckbox = (itemId, type) => {
    setAnswers({
      ...answers,
      [itemId]: {
        ...answers[itemId],
        [type]: !answers[itemId]?.[type]
      }
    });
  };

  const checkAnswers = () => {
    let correct = 0;
    items.forEach(item => {
      const userAnswer = answers[item.id] || {};
      // Convert undefined to false for comparison (unchecked = false)
      const userPush = userAnswer.push ?? false;
      const userPull = userAnswer.pull ?? false;
      
      if (
        userPush === item.correctAnswers.push &&
        userPull === item.correctAnswers.pull
      ) {
        correct++;
      }
    });
    setScore(correct);
    setShowFeedback(true);
  };

  const reset = () => {
    setAnswers({});
    setShowFeedback(false);
    setScore(0);
  };

  return (
    <div className="activity-container">
      <div className="activity-instructions">
        <h4>{language === 'en' ? 'Instructions' : 'సూచనలు'}:</h4>
        <p>
          {language === 'en' 
            ? 'For each situation, check whether it involves a Push, Pull, or both. Try to identify the action without looking at the answers first!'
            : 'ప్రతి పరిస్థితికి, అది పుష్, పుల్ లేదా రెండింటినీ కలిగి ఉందో తనిఖీ చేయండి. మొదట సమాధానాలను చూడకుండా చర్యను గుర్తించడానికి ప్రయత్నించండి!'}
        </p>
      </div>

      <div className="classification-table">
        <table>
          <thead>
            <tr>
              <th>{language === 'en' ? 'S.No' : 'క్ర.సం'}</th>
              <th>{language === 'en' ? 'Situation' : 'పరిస్థితి'}</th>
              <th>{language === 'en' ? 'Actions' : 'చర్యలు'}</th>
              <th>{language === 'en' ? 'Push' : 'నెట్టడం'}</th>
              <th>{language === 'en' ? 'Pull' : 'లాగడం'}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const userAnswer = answers[item.id] || {};
              // Convert undefined to false for comparison (unchecked = false)
              const userPush = userAnswer.push ?? false;
              const userPull = userAnswer.pull ?? false;
              const isCorrect = showFeedback && (
                userPush === item.correctAnswers.push &&
                userPull === item.correctAnswers.pull
              );
              
              return (
                <tr key={item.id} className={showFeedback ? (isCorrect ? 'correct-row' : 'incorrect-row') : ''}>
                  <td>{item.id}</td>
                  <td>
                    <div className="situation-cell">
                      <span className="situation-text">
                        {language === 'en' ? item.situation : item.situationTelugu}
                      </span>
                      {showFeedback && isCorrect && (
                        <Check size={16} className="check-icon" />
                      )}
                      {showFeedback && !isCorrect && (
                        <X size={16} className="x-icon" />
                      )}
                    </div>
                  </td>
                  <td className="actions-cell">{item.actions.join(', ')}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={userAnswer.push || false}
                      onChange={() => handleCheckbox(item.id, 'push')}
                      disabled={showFeedback}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={userAnswer.pull || false}
                      onChange={() => handleCheckbox(item.id, 'pull')}
                      disabled={showFeedback}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="activity-actions">
        {!showFeedback ? (
          <Button onClick={checkAnswers}>
            <Check size={18} />
            {language === 'en' ? 'Check Answers' : 'సమాధానాలను తనిఖీ చేయండి'}
          </Button>
        ) : (
          <>
            <div className="score-display">
              <Badge variant={score === items.length ? 'success' : 'warning'} size="lg">
                {language === 'en' ? 'Score' : 'స్కోరు'}: {score}/{items.length}
              </Badge>
              {score === items.length ? (
                <p className="perfect-score">
                  🎉 {language === 'en' ? 'Perfect! You understand push and pull forces!' : 'అద్భుతం! మీరు పుష్ మరియు పుల్ బలాలను అర్థం చేసుకున్నారు!'}
                </p>
              ) : (
                <p className="try-again">
                  {language === 'en' ? 'Review the incorrect answers and try again!' : 'తప్పు సమాధానాలను సమీక్షించి మళ్లీ ప్రయత్నించండి!'}
                </p>
              )}
            </div>
            <Button variant="secondary" onClick={reset}>
              <RotateCcw size={18} />
              {language === 'en' ? 'Try Again' : 'మళ్లీ ప్రయత్నించండి'}
            </Button>
          </>
        )}
      </div>

      <div className="key-learnings">
        <h4>{language === 'en' ? '🎯 Key Learning' : '🎯 ముఖ్య అభ్యాసం'}:</h4>
        <ul>
          <li>
            {language === 'en' 
              ? 'A force is essentially a PUSH or a PULL'
              : 'బలం తప్పనిసరిగా పుష్ లేదా పుల్'}
          </li>
          <li>
            {language === 'en'
              ? 'Some actions involve both pushing and pulling (like opening/closing a door)'
              : 'కొన్ని చర్యలు పుషింగ్ మరియు పుల్లింగ్ రెండింటినీ కలిగి ఉంటాయి (తలుపు తెరవడం/మూయడం వంటివి)'}
          </li>
          <li>
            {language === 'en'
              ? 'Forces can make objects move, stop, or change direction'
              : 'బలాలు వస్తువులను కదలించడం, ఆపడం లేదా దిశను మార్చడం చేయగలవు'}
          </li>
        </ul>
      </div>
    </div>
  );
}

// ==================== ACTIVITY 1.2: Force Vectors ====================
export function Activity_1_2({ language }) {
  const [selectedScenario, setSelectedScenario] = useState('same-direction');
  const [person1Force, setPerson1Force] = useState(50);
  const [person2Force, setPerson2Force] = useState(50);
  const [showResult, setShowResult] = useState(false);

  const scenarios = {
    'same-direction': {
      title: 'Both pushing in same direction',
      titleTelugu: 'ఇద్దరూ ఒకే దిశలో నెట్టడం',
      direction1: 'right',
      direction2: 'right'
    },
    'opposite-direction': {
      title: 'Pushing from opposite sides',
      titleTelugu: 'వ్యతిరేక వైపుల నుండి నెట్టడం',
      direction1: 'right',
      direction2: 'left'
    },
    'balanced': {
      title: 'Equal forces, opposite directions',
      titleTelugu: 'సమాన బలాలు, వ్యతిరేక దిశలు',
      direction1: 'right',
      direction2: 'left'
    }
  };

  const scenario = scenarios[selectedScenario];
  
  const calculateNetForce = () => {
    if (scenario.direction1 === scenario.direction2) {
      return person1Force + person2Force;
    } else {
      return Math.abs(person1Force - person2Force);
    }
  };

  const getMovementDirection = () => {
    if (scenario.direction1 === scenario.direction2) {
      return scenario.direction1;
    } else {
      if (person1Force > person2Force) return scenario.direction1;
      if (person2Force > person1Force) return scenario.direction2;
      return 'none';
    }
  };

  const netForce = calculateNetForce();
  const direction = getMovementDirection();

  return (
    <div className="activity-container">
      <div className="activity-instructions">
        <h4>{language === 'en' ? 'Instructions' : 'సూచనలు'}:</h4>
        <p>
          {language === 'en'
            ? 'Select a scenario and adjust the forces. Observe how forces combine in different directions!'
            : 'ఒక దృశ్యాన్ని ఎంచుకుని బలాలను సర్దుబాటు చేయండి. వివిధ దిశలలో బలాలు ఎలా కలుస్తాయో గమనించండి!'}
        </p>
      </div>

      <div className="scenario-selector">
        {Object.keys(scenarios).map(key => (
          <button
            key={key}
            className={`scenario-btn ${selectedScenario === key ? 'active' : ''}`}
            onClick={() => setSelectedScenario(key)}
          >
            {language === 'en' ? scenarios[key].title : scenarios[key].titleTelugu}
          </button>
        ))}
      </div>

      <div className="force-visualization">
        <div className="force-demo-area">
          {/* Person 1 */}
          <div className="person person-1">
            <div className="person-icon">👤</div>
            <div className={`force-arrow arrow-${scenario.direction1}`}>
              <span className="force-value">{person1Force}N</span>
              <div className="arrow-line" style={{ width: `${person1Force * 1.5}px` }}>
                →
              </div>
            </div>
          </div>

          {/* Object */}
          <div className={`object-box ${showResult && direction !== 'none' ? `moving-${direction}` : ''}`}>
            📦
            <div className="object-label">Box</div>
          </div>

          {/* Person 2 */}
          <div className="person person-2">
            <div className="person-icon">👤</div>
            <div className={`force-arrow arrow-${scenario.direction2}`}>
              <span className="force-value">{person2Force}N</span>
              <div className="arrow-line" style={{ width: `${person2Force * 1.5}px` }}>
                {scenario.direction2 === 'left' ? '←' : '→'}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="force-controls">
          <div className="control-group">
            <label>{language === 'en' ? 'Person 1 Force' : 'వ్యక్తి 1 బలం'}: {person1Force}N</label>
            <input
              type="range"
              min="0"
              max="100"
              value={person1Force}
              onChange={(e) => setPerson1Force(parseInt(e.target.value))}
              className="force-slider"
            />
          </div>

          <div className="control-group">
            <label>{language === 'en' ? 'Person 2 Force' : 'వ్యక్తి 2 బలం'}: {person2Force}N</label>
            <input
              type="range"
              min="0"
              max="100"
              value={person2Force}
              onChange={(e) => setPerson2Force(parseInt(e.target.value))}
              className="force-slider"
            />
          </div>
        </div>

        <Button onClick={() => setShowResult(!showResult)}>
          {showResult ? <Pause size={18} /> : <Play size={18} />}
          {language === 'en' ? 'Apply Forces' : 'బలాలను వర్తింపజేయండి'}
        </Button>
      </div>

      {showResult && (
        <div className="result-panel">
          <h4>{language === 'en' ? '📊 Result' : '📊 ఫలితం'}:</h4>
          <div className="result-values">
            <div className="result-item">
              <span className="result-label">{language === 'en' ? 'Net Force' : 'నికర బలం'}:</span>
              <Badge variant="primary" size="lg">{netForce}N</Badge>
            </div>
            <div className="result-item">
              <span className="result-label">{language === 'en' ? 'Direction' : 'దిశ'}:</span>
              <Badge variant={direction === 'none' ? 'secondary' : 'success'} size="lg">
                {direction === 'none' 
                  ? (language === 'en' ? 'No movement' : 'కదలిక లేదు')
                  : (direction === 'right' 
                      ? (language === 'en' ? 'Right →' : 'కుడి →')
                      : (language === 'en' ? '← Left' : '← ఎడమ')
                    )
                }
              </Badge>
            </div>
          </div>
          
          <div className="formula-explanation">
            <p>
              <strong>{language === 'en' ? 'Formula' : 'సూత్రం'}:</strong><br />
              {scenario.direction1 === scenario.direction2 ? (
                <>
                  {language === 'en' ? 'Same direction' : 'ఒకే దిశ'}: Net Force = F₁ + F₂ = {person1Force} + {person2Force} = {netForce}N
                </>
              ) : (
                <>
                  {language === 'en' ? 'Opposite directions' : 'వ్యతిరేక దిశలు'}: Net Force = |F₁ - F₂| = |{person1Force} - {person2Force}| = {netForce}N
                </>
              )}
            </p>
          </div>
        </div>
      )}

      <div className="key-learnings">
        <h4>{language === 'en' ? '🎯 Key Learning' : '🎯 ముఖ్య అభ్యాసం'}:</h4>
        <ul>
          <li>
            {language === 'en'
              ? 'Forces in the SAME direction ADD together'
              : 'ఒకే దిశలో బలాలు కలిపి జోడించబడతాయి'}
          </li>
          <li>
            {language === 'en'
              ? 'Forces in OPPOSITE directions SUBTRACT'
              : 'వ్యతిరేక దిశలలో బలాలు తీసివేయబడతాయి'}
          </li>
          <li>
            {language === 'en'
              ? 'Net force determines the motion of the object'
              : 'నికర బలం వస్తువు యొక్క చలనాన్ని నిర్ణయిస్తుంది'}
          </li>
          <li>
            {language === 'en'
              ? 'When net force is zero, object doesn\'t move (balanced forces)'
              : 'నికర బలం సున్నా అయినప్పుడు, వస్తువు కదలదు (సమతుల్య బలాలు)'}
          </li>
        </ul>
      </div>
    </div>
  );
}

// ==================== ACTIVITY 1.3: Ball Motion ====================
export function Activity_1_3({ language }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState([]);

  const steps = [
    {
      step: 1,
      action: 'Place ball at rest',
      actionTelugu: 'బంతిని విశ్రాంతిలో ఉంచండి',
      observation: 'Ball is stationary (speed = 0)',
      observationTelugu: 'బంతి నిశ్చలంగా ఉంది (వేగం = 0)',
      concept: 'State of rest - no force, no motion',
      conceptTelugu: 'విశ్రాంతి స్థితి - బలం లేదు, చలనం లేదు',
      icon: '🔵'
    },
    {
      step: 2,
      action: 'Push the ball gently',
      actionTelugu: 'బంతిని సున్నితంగా నెట్టండి',
      observation: 'Ball begins to move',
      observationTelugu: 'బంతి కదలడం ప్రారంభమవుతుంది',
      concept: 'Force can make object move from rest',
      conceptTelugu: 'బలం వస్తువును విశ్రాంతి నుండి కదలించగలదు',
      icon: '🔵→'
    },
    {
      step: 3,
      action: 'Push again while ball is moving',
      actionTelugu: 'బంతి కదులుతున్నప్పుడు మళ్లీ నెట్టండి',
      observation: 'Ball speeds up (velocity increases)',
      observationTelugu: 'బంతి వేగం పెరుగుతుంది',
      concept: 'Force in direction of motion increases speed',
      conceptTelugu: 'చలన దిశలో బలం వేగాన్ని పెంచుతుంది',
      icon: '🔵→→'
    },
    {
      step: 4,
      action: 'Place palm in front of moving ball',
      actionTelugu: 'కదులుతున్న బంతి ముందు అరచేతిని ఉంచండి',
      observation: 'Ball slows down or stops',
      observationTelugu: 'బంతి నెమ్మదించబడుతుంది లేదా ఆగుతుంది',
      concept: 'Force opposite to motion decreases speed',
      conceptTelugu: 'చలనానికి వ్యతిరేకంగా బలం వేగాన్ని తగ్గిస్తుంది',
      icon: '✋🔵'
    }
  ];

  const handleStepComplete = (stepIndex) => {
    if (!completed.includes(stepIndex)) {
      setCompleted([...completed, stepIndex]);
    }
    if (stepIndex < steps.length - 1) {
      setCurrentStep(stepIndex + 1);
    }
  };

  return (
    <div className="activity-container">
      <div className="activity-instructions">
        <h4>{language === 'en' ? 'Instructions' : 'సూచనలు'}:</h4>
        <p>
          {language === 'en'
            ? 'Follow each step to understand how forces affect a moving object. Click "Complete Step" after observing each action.'
            : 'చలిస్తున్న వస్తువుపై బలాలు ఎలా ప్రభావితం చేస్తాయో అర్థం చేసుకోవడానికి ప్రతి దశను అనుసరించండి. ప్రతి చర్యను గమనించిన తర్వాత "దశను పూర్తి చేయండి" క్లిక్ చేయండి.'}
        </p>
      </div>

      <div className="ball-motion-steps">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`step-card ${index === currentStep ? 'active' : ''} ${completed.includes(index) ? 'completed' : ''}`}
          >
            <div className="step-header">
              <div className="step-number">{step.step}</div>
              <div className="step-icon">{step.icon}</div>
              {completed.includes(index) && (
                <Check size={24} className="completed-check" />
              )}
            </div>

            <div className="step-content">
              <h4>{language === 'en' ? 'Action' : 'చర్య'}:</h4>
              <p className="action-text">
                {language === 'en' ? step.action : step.actionTelugu}
              </p>

              <h4>{language === 'en' ? 'Observation' : 'పరిశీలన'}:</h4>
              <p className="observation-text">
                {language === 'en' ? step.observation : step.observationTelugu}
              </p>

              <div className="concept-box">
                <strong>{language === 'en' ? '💡 Concept' : '💡 భావన'}:</strong>
                <p>{language === 'en' ? step.concept : step.conceptTelugu}</p>
              </div>

              {index === currentStep && !completed.includes(index) && (
                <Button 
                  onClick={() => handleStepComplete(index)}
                  size="sm"
                >
                  <Check size={16} />
                  {language === 'en' ? 'Complete Step' : 'దశను పూర్తి చేయండి'}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="progress-tracker">
        <p>
          {language === 'en' ? 'Progress' : 'పురోగతి'}: {completed.length}/{steps.length}
        </p>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${(completed.length / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {completed.length === steps.length && (
        <div className="completion-message">
          <h3>🎉 {language === 'en' ? 'Activity Complete!' : 'కార్యకలాపం పూర్తయింది!'}</h3>
          <p>
            {language === 'en'
              ? 'Great job! You now understand how forces affect the motion of objects.'
              : 'అద్భుతం! బలాలు వస్తువుల చలనాన్ని ఎలా ప్రభావితం చేస్తాయో ఇప్పుడు మీరు అర్థం చేసుకున్నారు.'}
          </p>
        </div>
      )}

      <div className="key-learnings">
        <h4>{language === 'en' ? '🎯 Key Learning' : '🎯 ముఖ్య అభ్యాసం'}:</h4>
        <ul>
          <li>
            {language === 'en'
              ? 'A force can change the STATE OF MOTION of an object'
              : 'బలం వస్తువు యొక్క చలన స్థితిని మార్చగలదు'}
          </li>
          <li>
            {language === 'en'
              ? 'Force can make stationary object move'
              : 'బలం నిశ్చల వస్తువును కదలించగలదు'}
          </li>
          <li>
            {language === 'en'
              ? 'Force in direction of motion → increases speed'
              : 'చలన దిశలో బలం → వేగం పెరుగుతుంది'}
          </li>
          <li>
            {language === 'en'
              ? 'Force opposite to motion → decreases speed'
              : 'చలనానికి వ్యతిరేక బలం → వేగం తగ్గుతుంది'}
          </li>
        </ul>
      </div>
    </div>
  );
}

// ==================== ACTIVITY 1.4: Direction Change ====================
export function Activity_1_4({ language }) {
  const [angle, setAngle] = useState(45);
  const [showPath, setShowPath] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate reflection angle based on ruler angle
  // Physics: angle of incidence = angle of reflection (relative to normal)
  // Expected behavior:
  //   0° = vertical wall → ball reflects straight back (180° or -180°)
  //   45° = tilted 45° → ball reflects downward at 45° (-45°)
  //   90° = horizontal → ball reflects straight up (90°)
  const calculateReflection = (rulerAngleDeg) => {
    // Ruler is rotated by -angle in SVG transform
    // Default ruler: vertical rectangle (height=200, width=20)
    // When angle=0: rotate(-0) = vertical (ball hits left side)
    // When angle=45: rotate(-45) = tilted 45° counter-clockwise
    // When angle=90: rotate(-90) = horizontal
    
    // The normal to the ruler surface (perpendicular, pointing toward ball)
    // For vertical ruler (0°): normal points left (180°)
    // For 45° ruler: normal points at 135° (45° from horizontal, pointing toward ball)
    // Normal angle = 180° - angle (in degrees)
    const normalAngleDeg = 180 - rulerAngleDeg;
    const normalAngleRad = normalAngleDeg * (Math.PI / 180);
    
    // Normal direction vector (pointing toward incoming ball)
    const normalDirX = Math.cos(normalAngleRad);
    const normalDirY = Math.sin(normalAngleRad);
    
    // Incident ray comes horizontally from left (direction: right, angle = 0°)
    const incidentDirX = 1;
    const incidentDirY = 0;
    
    // Calculate reflection: reflect incident direction across normal
    // Formula: R = I - 2(I·N)N where I is incident, N is normal
    const dotProduct = incidentDirX * normalDirX + incidentDirY * normalDirY;
    const reflectionDirX = incidentDirX - 2 * dotProduct * normalDirX;
    const reflectionDirY = incidentDirY - 2 * dotProduct * normalDirY;
    
    // Convert reflection direction to angle (in degrees)
    // atan2: 0° = right, 90° = up, -90° = down, 180°/-180° = left
    const reflectionAngleRad = Math.atan2(reflectionDirY, reflectionDirX);
    const reflectionAngleDeg = reflectionAngleRad * (180 / Math.PI);
    
    return reflectionAngleDeg;
  };

  const deflectionAngle = calculateReflection(angle);
  
  // Calculate ball position for animation
  const ballStartX = 50;
  const ballStartY = 200;
  const hitPointX = 300;
  const hitPointY = 200;
  
  // Calculate reflection endpoint
  const reflectionLength = 200;
  const reflectionRadians = (deflectionAngle * Math.PI) / 180;
  const reflectionEndX = hitPointX + Math.cos(reflectionRadians) * reflectionLength;
  const reflectionEndY = hitPointY + Math.sin(reflectionRadians) * reflectionLength;

  return (
    <div className="activity-container">
      <div className="activity-instructions">
        <h4>{language === 'en' ? 'Instructions' : 'సూచనలు'}:</h4>
        <p>
          {language === 'en'
            ? 'Adjust the ruler angle and observe how it changes the direction of the ball. Notice how the angle affects the deflection!'
            : 'రూలర్ కోణాన్ని సర్దుబాటు చేసి, అది బంతి దిశను ఎలా మారుస్తుందో గమనించండి. కోణం విక్షేపణను ఎలా ప్రభావితం చేస్తుందో గమనించండి!'}
        </p>
      </div>

      <div className="direction-change-demo">
        <div className="demo-area">
          <svg width="600" height="400" viewBox="0 0 600 400">
            {/* Ground */}
            <rect x="0" y="300" width="600" height="100" fill="#8B7355" />
            
            {/* Initial path (incident ray) */}
            <line 
              x1={ballStartX} 
              y1={ballStartY} 
              x2={hitPointX} 
              y2={hitPointY} 
              stroke="#4A90E2" 
              strokeWidth="3" 
              strokeDasharray="5,5"
            />
            
            {/* Ruler/Obstacle at hit point */}
            {/* Ruler angle: 0° = vertical (facing left), 90° = horizontal */}
            {/* Rotation: -angle means if angle=0, ruler is vertical; if angle=90, ruler is horizontal */}
            <g transform={`translate(${hitPointX}, ${hitPointY}) rotate(${-angle})`}>
              <rect 
                x="-10" 
                y="-100" 
                width="20" 
                height="200" 
                fill="#FFD700" 
                stroke="#FFA500" 
                strokeWidth="2"
                opacity="0.9"
              />
            </g>
            
            {/* Normal line (for reference) - perpendicular to ruler surface, pointing toward ball */}
            {showPath && (() => {
              const normalAngleDeg = 180 - angle;
              const normalAngleRad = normalAngleDeg * Math.PI / 180;
              return (
                <line
                  x1={hitPointX}
                  y1={hitPointY}
                  x2={hitPointX + Math.cos(normalAngleRad) * 80}
                  y2={hitPointY + Math.sin(normalAngleRad) * 80}
                  stroke="#999"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                  opacity="0.5"
                />
              );
            })()}
            
            {/* Reflected path (shown as dashed line) */}
            {showPath && (
              <line 
                x1={hitPointX} 
                y1={hitPointY} 
                x2={reflectionEndX}
                y2={reflectionEndY}
                stroke="#E74C3C" 
                strokeWidth="3" 
                strokeDasharray="5,5"
              />
            )}
            
            {/* Ball - animated when showPath is true */}
            {showPath && isAnimating ? (
              <circle r="15" fill="#FF6B6B">
                <animateMotion
                  dur="2s"
                  repeatCount="indefinite"
                  path={`M ${ballStartX},${ballStartY} L ${hitPointX},${hitPointY} L ${reflectionEndX},${reflectionEndY}`}
                />
              </circle>
            ) : (
              <circle 
                cx={showPath ? hitPointX : ballStartX} 
                cy={ballStartY} 
                r="15" 
                fill="#FF6B6B"
              />
            )}
            
            {/* Hit point indicator */}
            {showPath && (
              <circle 
                cx={hitPointX} 
                cy={hitPointY} 
                r="5" 
                fill="#FF0000"
                opacity="0.8"
              />
            )}
          </svg>
        </div>

        <div className="controls">
          <div className="control-group">
            <label>
              {language === 'en' ? 'Ruler Angle' : 'రూలర్ కోణం'}: {angle}°
            </label>
            <input
              type="range"
              min="0"
              max="90"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
              className="angle-slider"
            />
            <div className="angle-presets">
              {[0, 30, 45, 60, 90].map(preset => (
                <button
                  key={preset}
                  className="preset-btn"
                  onClick={() => setAngle(preset)}
                >
                  {preset}°
                </button>
              ))}
            </div>
          </div>

          <Button onClick={() => {
            setShowPath(!showPath);
            if (!showPath) {
              setIsAnimating(true);
            } else {
              setIsAnimating(false);
            }
          }}>
            {showPath ? <Pause size={18} /> : <Play size={18} />}
            {language === 'en' ? 'Show Path' : 'మార్గం చూపించు'}
          </Button>
        </div>

        {showPath && (
          <div className="result-panel">
            <h4>{language === 'en' ? '📊 Result' : '📊 ఫలితం'}:</h4>
            <div className="result-values">
              <div className="result-item">
                <span>{language === 'en' ? 'Incident Angle' : 'ఆపాత కోణం'}:</span>
                <Badge variant="primary">{angle}°</Badge>
              </div>
              <div className="result-item">
                <span>{language === 'en' ? 'Reflection Angle' : 'ప్రతిబింబ కోణం'}:</span>
                <Badge variant="success">{deflectionAngle.toFixed(1)}°</Badge>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
                {language === 'en' 
                  ? `The ball hits the ruler and reflects at ${deflectionAngle.toFixed(1)}° from horizontal`
                  : `బంతి రూలర్‌ను కొట్టి ${deflectionAngle.toFixed(1)}° కోణంలో ప్రతిబింబిస్తుంది`}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="key-learnings">
        <h4>{language === 'en' ? '🎯 Key Learning' : '🎯 ముఖ్య అభ్యాసం'}:</h4>
        <ul>
          <li>
            {language === 'en'
              ? 'Force can change the DIRECTION of a moving object'
              : 'బలం కదులుతున్న వస్తువు యొక్క దిశను మార్చగలదు'}
          </li>
          <li>
            {language === 'en'
              ? 'The angle of the obstacle affects the deflection angle'
              : 'అడ్డంకి యొక్క కోణం విక్షేపణ కోణాన్ని ప్రభావితం చేస్తుంది'}
          </li>
          <li>
            {language === 'en'
              ? 'Force doesn\'t have to stop motion - it can redirect it'
              : 'బలం చలనాన్ని ఆపవలసిన అవసరం లేదు - అది దానిని మళ్లించగలదు'}
          </li>
        </ul>
      </div>
    </div>
  );
}

// Activities are already exported individually above (export function)
