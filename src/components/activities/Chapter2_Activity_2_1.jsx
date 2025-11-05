import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, RotateCcw, Play, Pause } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import './Chapter2Activities.css';

// ==================================================
// CHAPTER 2: FRICTION - ALL ACTIVITIES
// ==================================================

export const chapter2Activities = [
  {
    id: 'activity-2.1',
    number: '2.1',
    title: 'Force of Friction - Book Push Demo',
    titleTelugu: 'ఘర్షణ బలం - పుస్తకం నెట్టడం ప్రదర్శన',
    page: 1,
    pdfPages: [1, 2],
    description: 'Push a book on a table and observe how it stops due to friction.',
    descriptionTelugu: 'బల్ల మీద పుస్తకాన్ని నెట్టి ఘర్షణ వల్ల ఎలా ఆగుతుందో గమనించండి.',
    objective: 'Understand that friction opposes motion',
    materials: 'Book, table',
    type: 'friction-basics'
  },
  {
    id: 'activity-2.2',
    number: '2.2',
    title: 'Factors Affecting Friction - Spring Balance',
    titleTelugu: 'ఘర్షణను ప్రభావితం చేసే కారకాలు - స్ప్రింగ్ బ్యాలెన్స్',
    page: 3,
    pdfPages: [3, 4],
    description: 'Measure friction on different surfaces using spring balance.',
    descriptionTelugu: 'స్ప్రింగ్ బ్యాలెన్స్ ఉపయోగించి వివిధ ఉపరితలాలపై ఘర్షణను కొలవండి.',
    objective: 'Learn how surface nature affects friction',
    materials: 'Brick, string, spring balance, jute bag, polythene',
    type: 'friction-measurement'
  },
  {
    id: 'activity-2.3',
    number: '2.3',
    title: 'Inclined Plane - Surface Friction',
    titleTelugu: 'వంపు తలం - ఉపరితల ఘర్షణ',
    page: 3,
    pdfPages: [3, 4, 5],
    description: 'Roll a pencil cell down an incline and observe distance on different surfaces.',
    descriptionTelugu: 'వంపుపై నుండి పెన్సిల్ సెల్ తిప్పి వివిధ ఉపరితలాలపై దూరాన్ని గమనించండి.',
    objective: 'Compare friction on smooth, cloth, and sand surfaces',
    materials: 'Wooden board, bricks, pencil cell, cloth, sand',
    type: 'friction-comparison'
  },
  {
    id: 'activity-2.4',
    number: '2.4',
    title: 'Rolling Reduces Friction - Pencil Rollers',
    titleTelugu: 'తిరగడం ఘర్షణను తగ్గిస్తుంది - పెన్సిల్ రోలర్లు',
    page: 13,
    pdfPages: [13, 14],
    description: 'Place pencils under a book and observe easier movement.',
    descriptionTelugu: 'పుస్తకం క్రింద పెన్సిళ్లను ఉంచి సులభమైన కదలికను గమనించండి.',
    objective: 'Demonstrate that rolling friction is less than sliding friction',
    materials: 'Cylindrical pencils, thick book',
    type: 'rolling-friction'
  }
];

// ==================================================
// ACTIVITY 2.1: Force of Friction - Book Push
// ==================================================
export function Activity_2_1({ language }) {
  const [pushDirection, setPushDirection] = useState('right'); // 'right' or 'left'
  const [isMoving, setIsMoving] = useState(false);
  const [bookPosition, setBookPosition] = useState(50); // percentage from left
  const [observations, setObservations] = useState([]);

  const pushBook = (direction) => {
    setPushDirection(direction);
    setIsMoving(true);
    
    // Animate book movement
    const startPos = bookPosition;
    const endPos = direction === 'right' ? Math.min(startPos + 20, 80) : Math.max(startPos - 20, 20);
    
    let currentPos = startPos;
    const step = (endPos - startPos) / 20;
    
    const interval = setInterval(() => {
      currentPos += step;
      setBookPosition(currentPos);
      
      if (Math.abs(currentPos - endPos) < Math.abs(step)) {
        clearInterval(interval);
        // Book stops due to friction
        setTimeout(() => {
          setIsMoving(false);
          addObservation(direction);
        }, 500);
      }
    }, 50);
  };

  const addObservation = (direction) => {
    const obs = {
      direction,
      result: language === 'en' 
        ? `Pushed ${direction}, friction acted ${direction === 'right' ? 'left' : 'right'}, book stopped`
        : `${direction === 'right' ? 'కుడికి' : 'ఎడమకు'} నెట్టారు, ఘర్షణ ${direction === 'right' ? 'ఎడమకు' : 'కుడికి'} పనిచేసింది, పుస్తకం ఆగింది`
    };
    setObservations([...observations, obs]);
  };

  const reset = () => {
    setBookPosition(50);
    setIsMoving(false);
    setObservations([]);
  };

  return (
    <div className="activity-container">
      <div className="activity-instructions">
        <h4>{language === 'en' ? 'Instructions' : 'సూచనలు'}:</h4>
        <p>
          {language === 'en'
            ? 'Push the book in different directions and observe how it stops. Notice that friction always opposes the direction of motion!'
            : 'పుస్తకాన్ని వివిధ దిశలలో నెట్టండి మరియు అది ఎలా ఆగుతుందో గమనించండి. ఘర్షణ ఎల్లప్పుడూ చలన దిశను వ్యతిరేకిస్తుందని గమనించండి!'}
        </p>
      </div>

      {/* Interactive Demo Area */}
      <div className="friction-demo-area">
        <div className="table-surface">
          <div className="surface-texture" />
          
          {/* Book */}
          <div 
            className={`book-object ${isMoving ? 'moving' : ''}`}
            style={{ left: `${bookPosition}%` }}
          >
            <div className="book-cover">📕</div>
            <span className="book-label">
              {language === 'en' ? 'BOOK' : 'పుస్తకం'}
            </span>
          </div>

          {/* Friction Force Arrow (when moving) */}
          {isMoving && (
            <div 
              className="friction-arrow"
              style={{ left: `${bookPosition}%` }}
            >
              <div className={`arrow ${pushDirection === 'right' ? 'arrow-left' : 'arrow-right'}`}>
                {pushDirection === 'right' ? '←' : '→'}
                <span className="force-label">
                  {language === 'en' ? 'Friction' : 'ఘర్షణ'}
                </span>
              </div>
            </div>
          )}

          {/* Applied Force Arrow (when moving) */}
          {isMoving && (
            <div 
              className="applied-arrow"
              style={{ left: `${bookPosition}%` }}
            >
              <div className={`arrow ${pushDirection === 'right' ? 'arrow-right' : 'arrow-left'}`}>
                {pushDirection === 'right' ? '→' : '←'}
                <span className="force-label">
                  {language === 'en' ? 'Applied' : 'వర్తింపబడింది'}
                </span>
              </div>
            </div>
          )}

          {/* Table legs */}
          <div className="table-legs">
            <div className="leg" />
            <div className="leg" />
          </div>
        </div>

        {/* Hand indicators */}
        <div className="hand-indicators">
          <div className="hand left-hand">
            <span className="hand-emoji">✋</span>
            <span className="hand-label">
              {language === 'en' ? 'Push Left' : 'ఎడమకు నెట్టండి'}
            </span>
          </div>
          <div className="hand right-hand">
            <span className="hand-emoji">✋</span>
            <span className="hand-label">
              {language === 'en' ? 'Push Right' : 'కుడికి నెట్టండి'}
            </span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="controls">
        <Button
          onClick={() => pushBook('left')}
          disabled={isMoving}
          variant="secondary"
        >
          <ArrowLeft size={18} />
          {language === 'en' ? 'Push Left' : 'ఎడమకు నెట్టండి'}
        </Button>

        <Button
          onClick={() => pushBook('right')}
          disabled={isMoving}
        >
          <ArrowRight size={18} />
          {language === 'en' ? 'Push Right' : 'కుడికి నెట్టండి'}
        </Button>

        <Button onClick={reset} variant="ghost">
          <RotateCcw size={18} />
          {language === 'en' ? 'Reset' : 'రీసెట్'}
        </Button>
      </div>

      {/* Observations Table */}
      {observations.length > 0 && (
        <div className="observations-panel">
          <h4>{language === 'en' ? '📝 Observations' : '📝 పరిశీలనలు'}:</h4>
          <table className="observations-table">
            <thead>
              <tr>
                <th>{language === 'en' ? 'Trial' : 'ప్రయత్నం'}</th>
                <th>{language === 'en' ? 'Observation' : 'పరిశీలన'}</th>
              </tr>
            </thead>
            <tbody>
              {observations.map((obs, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{obs.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Key Concept Box */}
      <div className="concept-highlight">
        <h4>💡 {language === 'en' ? 'Key Concept' : 'ముఖ్య భావన'}:</h4>
        <div className="concept-box">
          <p>
            <strong>
              {language === 'en'
                ? 'Friction ALWAYS opposes the applied force'
                : 'ఘర్షణ ఎల్లప్పుడూ వర్తింపబడిన బలాన్ని వ్యతిరేకిస్తుంది'}
            </strong>
          </p>
          <ul>
            <li>
              {language === 'en'
                ? 'Push right → Friction acts left'
                : 'కుడికి నెట్టండి → ఘర్షణ ఎడమకు పనిచేస్తుంది'}
            </li>
            <li>
              {language === 'en'
                ? 'Push left → Friction acts right'
                : 'ఎడమకు నెట్టండి → ఘర్షణ కుడికి పనిచేస్తుంది'}
            </li>
            <li>
              {language === 'en'
                ? 'Friction acts between the book surface and table surface'
                : 'పుస్తక ఉపరితలం మరియు టేబుల్ ఉపరితలం మధ్య ఘర్షణ పనిచేస్తుంది'}
            </li>
          </ul>
        </div>
      </div>

      {/* Key Learnings */}
      <div className="key-learnings">
        <h4>{language === 'en' ? '🎯 Key Learning' : '🎯 ముఖ్య అభ్యాసం'}:</h4>
        <ul>
          <li>
            {language === 'en'
              ? 'When you push a book on a table, it stops after moving some distance'
              : 'మీరు టేబుల్‌పై పుస్తకాన్ని నెట్టినప్పుడు, అది కొంత దూరం కదిలిన తర్వాత ఆగుతుంది'}
          </li>
          <li>
            {language === 'en'
              ? 'A force opposes the motion - this is called FRICTION'
              : 'ఒక బలం చలనాన్ని వ్యతిరేకిస్తుంది - దీనిని ఘర్షణ అంటారు'}
          </li>
          <li>
            {language === 'en'
              ? 'Friction always acts in the OPPOSITE direction to motion'
              : 'ఘర్షణ ఎల్లప్పుడూ చలనానికి వ్యతిరేక దిశలో పనిచేస్తుంది'}
          </li>
          <li>
            {language === 'en'
              ? 'Friction acts between the two surfaces in contact'
              : 'సంపర్కంలో ఉన్న రెండు ఉపరితలాల మధ్య ఘర్షణ పనిచేస్తుంది'}
          </li>
        </ul>
      </div>
    </div>
  );
}

// Export for integration
export default Activity_2_1;
