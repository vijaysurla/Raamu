import React, { useState } from 'react';
import { Play, RotateCcw, Wind, Droplets } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import './Chapter2Activities.css';

// ==================================================
// FLUID FRICTION & AERODYNAMICS (Section 2.6)
// ==================================================
export function FluidFrictionDemo({ language }) {
  const [fluidType, setFluidType] = useState('air');
  const [shapeType, setShapeType] = useState('streamlined');
  const [isMoving, setIsMoving] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [dragForce, setDragForce] = useState(0);

  const fluids = {
    air: {
      name: 'Air',
      nameTelugu: 'గాలి',
      density: 1.2,
      icon: '💨',
      color: '#e3f2fd'
    },
    water: {
      name: 'Water',
      nameTelugu: 'నీరు',
      density: 1000,
      icon: '💧',
      color: '#b3e5fc'
    }
  };

  const shapes = {
    streamlined: {
      name: 'Streamlined (Aeroplane/Fish)',
      nameTelugu: 'సుగమ ఆకారం (విమానం/చేప)',
      dragCoefficient: 0.2,
      icon: '✈️',
      description: 'Low drag - moves easily',
      descriptionTelugu: 'తక్కువ డ్రాగ్ - సులభంగా కదులుతుంది',
      examples: ['Aeroplane', 'Fish', 'Boat', 'Bullet train']
    },
    box: {
      name: 'Box Shape (Cube)',
      nameTelugu: 'పెట్టె ఆకారం (క్యూబ్)',
      dragCoefficient: 1.05,
      icon: '📦',
      description: 'High drag - hard to move',
      descriptionTelugu: 'అధిక డ్రాగ్ - కదలడం కష్టం',
      examples: ['Box', 'Building', 'Flat surface']
    },
    sphere: {
      name: 'Sphere (Ball)',
      nameTelugu: 'గోళం (బంతి)',
      dragCoefficient: 0.47,
      icon: '⚽',
      description: 'Medium drag',
      descriptionTelugu: 'మధ్యస్థ డ్రాగ్',
      examples: ['Ball', 'Sphere', 'Balloon']
    }
  };

  const currentFluid = fluids[fluidType];
  const currentShape = shapes[shapeType];

  const moveObject = () => {
    setIsMoving(true);
    let currentSpeed = 0;
    
    const moveInterval = setInterval(() => {
      currentSpeed += 2;
      setSpeed(currentSpeed);
      
      // Calculate drag: F_drag = 0.5 * density * velocity² * drag_coefficient
      const drag = 0.5 * currentFluid.density * Math.pow(currentSpeed/10, 2) * currentShape.dragCoefficient;
      setDragForce(drag);
      
      if (currentSpeed >= 100) {
        clearInterval(moveInterval);
        setTimeout(() => {
          setIsMoving(false);
          setSpeed(0);
          setDragForce(0);
        }, 2000);
      }
    }, 50);
  };

  const reset = () => {
    setSpeed(0);
    setDragForce(0);
    setIsMoving(false);
  };

  return (
    <div className="activity-container">
      <div className="activity-instructions">
        <h4>{language === 'en' ? 'Fluid Friction & Aerodynamics' : 'ద్రవ ఘర్షణ & ఏరోడైనమిక్స్'}:</h4>
        <p>
          {language === 'en'
            ? 'Objects moving through fluids (air, water) experience drag force. Shape matters! Streamlined shapes reduce drag and move more easily.'
            : 'ద్రవాల (గాలి, నీరు) గుండా కదులుతున్న వస్తువులు డ్రాగ్ బలాన్ని అనుభవిస్తాయి. ఆకారం ముఖ్యం! సుగమ ఆకారాలు డ్రాగ్‌ను తగ్గిస్తాయి మరియు మరింత సులభంగా కదులుతాయి.'}
        </p>
      </div>

      {/* Fluid Type Selector */}
      <div className="selector-panel">
        <h4>{language === 'en' ? 'Select Fluid:' : 'ద్రవాన్ని ఎంచుకోండి:'}</h4>
        <div className="selector-buttons">
          {Object.keys(fluids).map((key) => (
            <button
              key={key}
              className={`selector-btn ${fluidType === key ? 'active' : ''}`}
              onClick={() => {
                setFluidType(key);
                reset();
              }}
              disabled={isMoving}
            >
              <span className="selector-icon">{fluids[key].icon}</span>
              <span>{language === 'en' ? fluids[key].name : fluids[key].nameTelugu}</span>
              <Badge size="sm" variant="info">
                ρ = {fluids[key].density}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Shape Type Selector */}
      <div className="selector-panel">
        <h4>{language === 'en' ? 'Select Shape:' : 'ఆకారాన్ని ఎంచుకోండి:'}</h4>
        <div className="selector-buttons">
          {Object.keys(shapes).map((key) => (
            <button
              key={key}
              className={`selector-btn ${shapeType === key ? 'active' : ''}`}
              onClick={() => {
                setShapeType(key);
                reset();
              }}
              disabled={isMoving}
            >
              <span className="selector-icon">{shapes[key].icon}</span>
              <div className="selector-info">
                <span className="selector-name">
                  {language === 'en' ? shapes[key].name : shapes[key].nameTelugu}
                </span>
                <span className="selector-detail">
                  Cd = {shapes[key].dragCoefficient}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Fluid Tunnel Simulation */}
      <div className="fluid-tunnel">
        <div 
          className="fluid-flow"
          style={{ backgroundColor: currentFluid.color }}
        >
          {/* Fluid particles */}
          {isMoving && (
            <>
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="fluid-particle"
                  style={{
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: `${2 - speed/100}s`
                  }}
                >
                  {currentFluid.icon}
                </div>
              ))}
            </>
          )}

          {/* Moving Object */}
          <div className="moving-object">
            <div 
              className={`object-shape ${shapeType} ${isMoving ? 'moving' : ''}`}
              style={{
                transform: `translateX(${speed}px) ${shapeType === 'streamlined' ? 'rotate(-5deg)' : ''}`
              }}
            >
              <span className="object-icon">{currentShape.icon}</span>
            </div>
            
            {/* Drag force arrows */}
            {isMoving && dragForce > 0 && (
              <div className="drag-arrows">
                {[...Array(Math.ceil(dragForce / 10))].map((_, i) => (
                  <div key={i} className="drag-arrow" style={{ left: `${20 + i * 15}px` }}>
                    ←
                  </div>
                ))}
                <span className="drag-label">
                  {language === 'en' ? 'Drag Force' : 'డ్రాగ్ బలం'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Streamlines visualization */}
        {isMoving && (
          <div className="streamlines">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`streamline ${shapeType}`}
                style={{ top: `${20 + i * 15}%` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Real-time Metrics */}
      <div className="metrics-panel">
        <div className="metric-card">
          <h5>{language === 'en' ? 'Speed' : 'వేగం'}:</h5>
          <Badge variant="info" size="lg">{speed.toFixed(0)} km/h</Badge>
        </div>
        <div className="metric-card">
          <h5>{language === 'en' ? 'Drag Force' : 'డ్రాగ్ బలం'}:</h5>
          <Badge 
            variant={dragForce > 50 ? 'error' : dragForce > 20 ? 'warning' : 'success'} 
            size="lg"
          >
            {dragForce.toFixed(1)} N
          </Badge>
        </div>
        <div className="metric-card">
          <h5>{language === 'en' ? 'Efficiency' : 'సామర్థ్యం'}:</h5>
          <Badge 
            variant={currentShape.dragCoefficient < 0.5 ? 'success' : 'warning'} 
            size="lg"
          >
            {currentShape.dragCoefficient < 0.5 ? 'High' : 'Low'}
          </Badge>
        </div>
      </div>

      {/* Controls */}
      <div className="controls">
        <Button onClick={moveObject} disabled={isMoving}>
          <Play size={18} />
          {language === 'en' ? 'Start Motion' : 'కదలిక ప్రారంభించండి'}
        </Button>
        <Button onClick={reset} variant="secondary" disabled={isMoving}>
          <RotateCcw size={18} />
          {language === 'en' ? 'Reset' : 'రీసెట్'}
        </Button>
      </div>

      {/* Shape Comparison */}
      <div className="comparison-panel">
        <h4>{language === 'en' ? '📊 Shape Comparison' : '📊 ఆకార పోలిక'}:</h4>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>{language === 'en' ? 'Shape' : 'ఆకారం'}</th>
              <th>{language === 'en' ? 'Drag Coefficient' : 'డ్రాగ్ గుణకం'}</th>
              <th>{language === 'en' ? 'Examples' : 'ఉదాహరణలు'}</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(shapes).map(([key, shape]) => (
              <tr key={key} className={shapeType === key ? 'highlight' : ''}>
                <td>
                  <span className="table-icon">{shape.icon}</span>
                  {language === 'en' ? shape.name : shape.nameTelugu}
                </td>
                <td>
                  <Badge 
                    variant={shape.dragCoefficient < 0.5 ? 'success' : shape.dragCoefficient < 0.8 ? 'warning' : 'error'}
                  >
                    {shape.dragCoefficient}
                  </Badge>
                </td>
                <td className="examples-cell">
                  {shape.examples.join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Real-world Examples */}
      <div className="examples-showcase">
        <h4>{language === 'en' ? '🌍 Real-World Applications' : '🌍 నిజ-ప్రపంచ అనువర్తనాలు'}:</h4>
        <div className="showcase-grid">
          <div className="showcase-card">
            <span className="showcase-icon">✈️</span>
            <h5>{language === 'en' ? 'Aeroplanes' : 'విమానాలు'}</h5>
            <p>
              {language === 'en'
                ? 'Streamlined shape reduces air drag, saves fuel'
                : 'సుగమ ఆకారం గాలి డ్రాగ్‌ను తగ్గిస్తుంది, ఇంధనం ఆదా చేస్తుంది'}
            </p>
          </div>
          <div className="showcase-card">
            <span className="showcase-icon">🐟</span>
            <h5>{language === 'en' ? 'Fish & Birds' : 'చేపలు & పక్షులు'}</h5>
            <p>
              {language === 'en'
                ? 'Nature evolved streamlined bodies to reduce drag'
                : 'ప్రకృతి డ్రాగ్‌ను తగ్గించడానికి సుగమ శరీరాలను అభివృద్ధి చేసింది'}
            </p>
          </div>
          <div className="showcase-card">
            <span className="showcase-icon">🚗</span>
            <h5>{language === 'en' ? 'Cars' : 'కార్లు'}</h5>
            <p>
              {language === 'en'
                ? 'Modern cars have aerodynamic designs for efficiency'
                : 'ఆధునిక కార్లు సామర్థ్యం కోసం ఏరోడైనమిక్ డిజైన్‌లను కలిగి ఉంటాయి'}
            </p>
          </div>
          <div className="showcase-card">
            <span className="showcase-icon">🏊</span>
            <h5>{language === 'en' ? 'Swimmers' : 'ఈతగాళ్లు'}</h5>
            <p>
              {language === 'en'
                ? 'Streamlined body position reduces water resistance'
                : 'సుగమ శరీర స్థానం నీటి నిరోధాన్ని తగ్గిస్తుంది'}
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
              ? 'Fluids (air, water) exert friction called DRAG on moving objects'
              : 'ద్రవాలు (గాలి, నీరు) కదులుతున్న వస్తువులపై డ్రాగ్ అని పిలువబడే ఘర్షణను ప్రయోగిస్తాయి'}
          </li>
          <li>
            {language === 'en'
              ? 'Drag depends on: (1) Fluid density, (2) Object speed, (3) Object shape'
              : 'డ్రాగ్ ఆధారపడింది: (1) ద్రవ సాంద్రత, (2) వస్తువు వేగం, (3) వస్తువు ఆకారం'}
          </li>
          <li>
            {language === 'en'
              ? 'STREAMLINED shapes minimize drag and move easily through fluids'
              : 'సుగమ ఆకారాలు డ్రాగ్‌ను తగ్గిస్తాయి మరియు ద్రవాల గుండా సులభంగా కదులుతాయి'}
          </li>
          <li>
            {language === 'en'
              ? 'Nature and engineering use streamlined designs to reduce energy loss'
              : 'శక్తి నష్టాన్ని తగ్గించడానికి ప్రకృతి మరియు ఇంజనీరింగ్ సుగమ డిజైన్‌లను ఉపయోగిస్తాయి'}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default FluidFrictionDemo;
