import React, { useState } from 'react';
import { Check, AlertCircle, Play, Pause } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import './ActivityComponents.css';

// ==================== ACTIVITY 1.5: Shape Change ====================
export function Activity_1_5({ language }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [observations, setObservations] = useState({});

  const items = [
    {
      id: 'dough',
      object: 'Lump of dough',
      objectTelugu: 'పిండి ముద్ద',
      action: 'Pressing down with hands',
      actionTelugu: 'చేతులతో క్రిందికి నొక్కడం',
      shapeChange: 'Flattens',
      shapeChangeTelugu: 'చదును అవుతుంది',
      motion: 'No',
      emoji: '🍞',
      hint: 'Apply downward force - shape changes but doesn\'t move'
    },
    {
      id: 'spring',
      object: 'Spring (bicycle seat)',
      objectTelugu: 'స్ప్రింగ్ (సైకిల్ సీటు)',
      action: 'Sitting on seat',
      actionTelugu: 'సీటుపై కూర్చోవడం',
      shapeChange: 'Compresses',
      shapeChangeTelugu: 'కుదించబడుతుంది',
      motion: 'No',
      emoji: '🚴',
      hint: 'Your weight compresses the spring'
    },
    {
      id: 'rubber-band',
      object: 'Rubber band',
      objectTelugu: 'రబ్బర్ బ్యాండ్',
      action: 'Pulling free end',
      actionTelugu: 'ఉచిత చివర లాగడం',
      shapeChange: 'Stretches',
      shapeChangeTelugu: 'సాగుతుంది',
      motion: 'No',
      emoji: '➰',
      hint: 'Pull force increases length'
    },
    {
      id: 'scale',
      object: 'Plastic/metal scale',
      objectTelugu: 'ప్లాస్టిక్/లోహ స్కేల్',
      action: 'Weight at center',
      actionTelugu: 'మధ్యలో బరువు',
      shapeChange: 'Bends',
      shapeChangeTelugu: 'వంగుతుంది',
      motion: 'No',
      emoji: '📏',
      hint: 'Downward force causes bending'
    }
  ];

  const handleObservation = (itemId, observed) => {
    setObservations({
      ...observations,
      [itemId]: observed
    });
  };

  const observedCount = Object.keys(observations).filter(key => observations[key]).length;

  return (
    <div className="activity-container">
      <div className="activity-instructions">
        <h4>{language === 'en' ? 'Instructions' : 'సూచనలు'}:</h4>
        <p>
          {language === 'en'
            ? 'Click on each item to learn about it. Try to perform these experiments at home or in class. Notice how force changes shape WITHOUT causing motion!'
            : 'ప్రతి అంశం గురించి తెలుసుకోవడానికి దానిపై క్లిక్ చేయండి. ఈ ప్రయోగాలను ఇంట్లో లేదా తరగతిలో చేయడానికి ప్రయత్నించండి. బలం చలనాన్ని కలిగించకుండా ఆకారాన్ని ఎలా మారుస్తుందో గమనించండి!'}
        </p>
      </div>

      <div className="shape-change-grid">
        {items.map((item) => (
          <div
            key={item.id}
            className={`shape-item-card ${selectedItem === item.id ? 'selected' : ''} ${observations[item.id] ? 'observed' : ''}`}
            onClick={() => setSelectedItem(item.id)}
          >
            <div className="item-emoji">{item.emoji}</div>
            <h4>{language === 'en' ? item.object : item.objectTelugu}</h4>
            
            {selectedItem === item.id && (
              <div className="item-details">
                <div className="detail-row">
                  <strong>{language === 'en' ? 'Action' : 'చర్య'}:</strong>
                  <p>{language === 'en' ? item.action : item.actionTelugu}</p>
                </div>
                <div className="detail-row">
                  <strong>{language === 'en' ? 'Shape Change' : 'ఆకార మార్పు'}:</strong>
                  <Badge variant="warning">{language === 'en' ? item.shapeChange : item.shapeChangeTelugu}</Badge>
                </div>
                <div className="detail-row">
                  <strong>{language === 'en' ? 'Motion?' : 'చలనం?'}:</strong>
                  <Badge variant="secondary">{item.motion}</Badge>
                </div>
                <div className="hint-box">
                  <AlertCircle size={16} />
                  <span>{item.hint}</span>
                </div>
                
                {!observations[item.id] && (
                  <Button 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleObservation(item.id, true);
                    }}
                  >
                    <Check size={16} />
                    {language === 'en' ? 'Mark as Observed' : 'గమనించినట్లు గుర్తించండి'}
                  </Button>
                )}
              </div>
            )}
            
            {observations[item.id] && (
              <div className="observed-badge">
                <Check size={16} /> {language === 'en' ? 'Observed' : 'గమనించారు'}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="observation-progress">
        <p>{language === 'en' ? 'Observations' : 'పరిశీలనలు'}: {observedCount}/{items.length}</p>
      </div>

      {observedCount === items.length && (
        <div className="completion-message">
          <h3>🎉 {language === 'en' ? 'All Observations Complete!' : 'అన్ని పరిశీలనలు పూర్తయ్యాయి!'}</h3>
        </div>
      )}

      <div className="key-learnings">
        <h4>{language === 'en' ? '🎯 Key Learning' : '🎯 ముఖ్య అభ్యాసం'}:</h4>
        <ul>
          <li>
            {language === 'en'
              ? 'Force can change the SHAPE of an object'
              : 'బలం వస్తువు యొక్క ఆకారాన్ని మార్చగలదు'}
          </li>
          <li>
            {language === 'en'
              ? 'Shape change does NOT always mean motion'
              : 'ఆకార మార్పు అంటే ఎల్లప్పుడూ చలనం కాదు'}
          </li>
          <li>
            {language === 'en'
              ? 'Objects like springs and rubber bands can return to original shape (elastic)'
              : 'స్ప్రింగ్‌లు మరియు రబ్బర్ బ్యాండ్‌ల వంటి వస్తువులు అసలు ఆకారానికి తిరిగి రాగలవు (స్థితిస్థాపకం)'}
          </li>
        </ul>
      </div>
    </div>
  );
}

// ==================== ACTIVITY 1.6: Magnetic Force ====================
export function Activity_1_6({ language }) {
  const [selectedPoles, setSelectedPoles] = useState({ magnet1: 'N', magnet2: 'S' });
  const [showForce, setShowForce] = useState(false);

  const scenarios = [
    {
      poles: { magnet1: 'N', magnet2: 'S' },
      result: 'Attracts (moves towards)',
      resultTelugu: 'ఆకర్షిస్తుంది (వైపుకు కదులుతుంది)',
      force: 'pull',
      color: 'success'
    },
    {
      poles: { magnet1: 'N', magnet2: 'N' },
      result: 'Repels (moves away)',
      resultTelugu: 'వికర్షిస్తుంది (దూరంగా కదులుతుంది)',
      force: 'push',
      color: 'error'
    },
    {
      poles: { magnet1: 'S', magnet2: 'S' },
      result: 'Repels (moves away)',
      resultTelugu: 'వికర్షిస్తుంది (దూరంగా కదులుతుంది)',
      force: 'push',
      color: 'error'
    },
    {
      poles: { magnet1: 'S', magnet2: 'N' },
      result: 'Attracts (moves towards)',
      resultTelugu: 'ఆకర్షిస్తుంది (వైపుకు కదులుతుంది)',
      force: 'pull',
      color: 'success'
    }
  ];

  const currentScenario = scenarios.find(
    s => s.poles.magnet1 === selectedPoles.magnet1 && s.poles.magnet2 === selectedPoles.magnet2
  );

  const isAttraction = currentScenario?.force === 'pull';

  return (
    <div className="activity-container">
      <div className="activity-instructions">
        <h4>{language === 'en' ? 'Instructions' : 'సూచనలు'}:</h4>
        <p>
          {language === 'en'
            ? 'Select the poles of two magnets and observe whether they attract or repel. Notice that magnets can exert force WITHOUT touching!'
            : 'రెండు అయస్కాంతాల ధ్రువాలను ఎంచుకుని అవి ఆకర్షిస్తాయా లేదా వికర్షిస్తాయా అని గమనించండి. అయస్కాంతాలు తాకకుండానే బలాన్ని ప్రయోగించగలవని గమనించండి!'}
        </p>
      </div>

      <div className="magnetic-demo">
        <div className="demo-area magnetic-horizontal">
          {/* Magnet 1 (on rollers) - left side */}
          <div className={`magnet magnet-1 ${showForce && isAttraction ? 'moving-right' : ''} ${showForce && !isAttraction ? 'moving-left' : ''}`}>
            <div className="magnet-body">
              <div className={`pole north ${selectedPoles.magnet1 === 'N' ? 'active-pole' : 'inactive-pole'}`}>
                N
              </div>
              <div className={`pole south ${selectedPoles.magnet1 === 'S' ? 'active-pole' : 'inactive-pole'}`}>
                S
              </div>
            </div>
            <div className="rollers">🔵🔵🔵</div>
          </div>

          {/* Force indicator - between magnets */}
          {showForce && (
            <div className="force-indicator">
              {isAttraction ? (
                <span className="attraction-arrows">← →</span>
              ) : (
                <span className="repulsion-arrows">→ ←</span>
              )}
            </div>
          )}

          {/* Magnet 2 (in hand) - right side */}
          <div className={`magnet magnet-2 ${showForce && isAttraction ? 'moving-left' : ''} ${showForce && !isAttraction ? 'moving-right' : ''}`}>
            <div className="hand-icon">✋</div>
            <div className="magnet-body">
              <div className={`pole north ${selectedPoles.magnet2 === 'N' ? 'active-pole' : 'inactive-pole'}`}>
                N
              </div>
              <div className={`pole south ${selectedPoles.magnet2 === 'S' ? 'active-pole' : 'inactive-pole'}`}>
                S
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="magnet-controls">
          <div className="control-group">
            <label>{language === 'en' ? 'Magnet 1 (on rollers) - facing pole' : 'అయస్కాంతం 1 (రోలర్లపై) - ఎదురుగా ఉన్న ధ్రువం'}:</label>
            <div className="pole-selector">
              <button
                className={`pole-btn north ${selectedPoles.magnet1 === 'N' ? 'selected' : ''}`}
                onClick={() => setSelectedPoles({ ...selectedPoles, magnet1: 'N' })}
              >
                N {language === 'en' ? '(North)' : '(ఉత్తరం)'}
              </button>
              <button
                className={`pole-btn south ${selectedPoles.magnet1 === 'S' ? 'selected' : ''}`}
                onClick={() => setSelectedPoles({ ...selectedPoles, magnet1: 'S' })}
              >
                S {language === 'en' ? '(South)' : '(దక్షిణం)'}
              </button>
            </div>
          </div>

          <div className="control-group">
            <label>{language === 'en' ? 'Magnet 2 (in hand) - facing pole' : 'అయస్కాంతం 2 (చేతిలో) - ఎదురుగా ఉన్న ధ్రువం'}:</label>
            <div className="pole-selector">
              <button
                className={`pole-btn north ${selectedPoles.magnet2 === 'N' ? 'selected' : ''}`}
                onClick={() => setSelectedPoles({ ...selectedPoles, magnet2: 'N' })}
              >
                N {language === 'en' ? '(North)' : '(ఉత్తరం)'}
              </button>
              <button
                className={`pole-btn south ${selectedPoles.magnet2 === 'S' ? 'selected' : ''}`}
                onClick={() => setSelectedPoles({ ...selectedPoles, magnet2: 'S' })}
              >
                S {language === 'en' ? '(South)' : '(దక్షిణం)'}
              </button>
            </div>
          </div>
        </div>

        <Button onClick={() => setShowForce(!showForce)}>
          {showForce ? <Pause size={18} /> : <Play size={18} />}
          {language === 'en' ? 'Observe Force' : 'బలాన్ని గమనించండి'}
        </Button>

        {showForce && currentScenario && (
          <div className="result-panel">
            <h4>{language === 'en' ? '📊 Result' : '📊 ఫలితం'}:</h4>
            <div className="result-content">
              <Badge variant={currentScenario.color} size="lg">
                {language === 'en' ? currentScenario.result : currentScenario.resultTelugu}
              </Badge>
              <p className="result-explanation">
                {currentScenario.force === 'pull' ? (
                  language === 'en' ? (
                    <>
                      <strong>Unlike poles attract</strong> - they exert a <em>pull</em> force on each other
                    </>
                  ) : (
                    <>
                      <strong>విభిన్న ధ్రువాలు ఆకర్షిస్తాయి</strong> - అవి ఒకదానిపై మరొకటి <em>లాగు</em> బలాన్ని ప్రయోగిస్తాయి
                    </>
                  )
                ) : (
                  language === 'en' ? (
                    <>
                      <strong>Like poles repel</strong> - they exert a <em>push</em> force on each other
                    </>
                  ) : (
                    <>
                      <strong>సమాన ధ్రువాలు వికర్షిస్తాయి</strong> - అవి ఒకదానిపై మరొకటి <em>నెట్టే</em> బలాన్ని ప్రయోగిస్తాయి
                    </>
                  )
                )}
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
              ? 'Magnetic force is a NON-CONTACT force'
              : 'అయస్కాంత బలం ఒక సంపర్క రహిత బలం'}
          </li>
          <li>
            {language === 'en'
              ? 'Unlike poles (N-S) ATTRACT each other'
              : 'విభిన్న ధ్రువాలు (N-S) ఒకదానికొకటి ఆకర్షిస్తాయి'}
          </li>
          <li>
            {language === 'en'
              ? 'Like poles (N-N or S-S) REPEL each other'
              : 'సమాన ధ్రువాలు (N-N లేదా S-S) ఒకదానికొకటి వికర్షిస్తాయి'}
          </li>
          <li>
            {language === 'en'
              ? 'Force can act through air (no physical contact needed)'
              : 'బలం గాలి ద్వారా పనిచేయగలదు (భౌతిక సంపర్కం అవసరం లేదు)'}
          </li>
        </ul>
      </div>
    </div>
  );
}

// ==================== ACTIVITY 1.7: Electrostatic Force ====================
export function Activity_1_7({ language }) {
  const [rubbed, setRubbed] = useState({ straw1: false, straw2: false });
  const [showForce, setShowForce] = useState(false);

  return (
    <div className="activity-container">
      <div className="activity-instructions">
        <h4>{language === 'en' ? 'Instructions' : 'సూచనలు'}:</h4>
        <p>
          {language === 'en'
            ? 'Click to "rub" each straw with paper. Then observe what happens when you bring them close. Electrostatic force is another non-contact force!'
            : 'ప్రతి స్ట్రాను కాగితంతో "రుద్దడానికి" క్లిక్ చేయండి. తర్వాత వాటిని దగ్గరగా తీసుకువచ్చినప్పుడు ఏమి జరుగుతుందో గమనించండి. స్థిర విద్యుత్ బలం మరొక సంపర్క రహిత బలం!'}
        </p>
      </div>

      <div className="electrostatic-demo">
        <div className="demo-area">
          {/* Suspended Straw */}
          <div className={`straw suspended ${rubbed.straw1 ? 'charged' : ''} ${showForce && rubbed.straw1 && rubbed.straw2 ? 'repelling' : ''}`}>
            <div className="thread">│</div>
            <div className="straw-body">
              {rubbed.straw1 && <span className="charge-indicator">⚡</span>}
              <span className="straw-label">{language === 'en' ? 'Straw 1' : 'స్ట్రా 1'}</span>
            </div>
            {!rubbed.straw1 && (
              <Button size="sm" onClick={() => setRubbed({ ...rubbed, straw1: true })}>
                {language === 'en' ? 'Rub with Paper' : 'కాగితంతో రుద్దండి'}
              </Button>
            )}
          </div>

          {/* Hand with Straw */}
          <div className="hand-with-straw">
            <div className="hand-icon">✋</div>
            <div className={`straw handheld ${rubbed.straw2 ? 'charged' : ''}`}>
              {rubbed.straw2 && <span className="charge-indicator">⚡</span>}
              <span className="straw-label">{language === 'en' ? 'Straw 2' : 'స్ట్రా 2'}</span>
            </div>
            {!rubbed.straw2 && (
              <Button size="sm" onClick={() => setRubbed({ ...rubbed, straw2: true })}>
                {language === 'en' ? 'Rub with Paper' : 'కాగితంతో రుద్దండి'}
              </Button>
            )}
          </div>
        </div>

        {rubbed.straw1 && rubbed.straw2 && (
          <Button onClick={() => setShowForce(!showForce)}>
            {showForce ? <Pause size={18} /> : <Play size={18} />}
            {language === 'en' ? 'Bring Close' : 'దగ్గరగా తీసుకురండి'}
          </Button>
        )}

        {showForce && rubbed.straw1 && rubbed.straw2 && (
          <div className="result-panel">
            <h4>{language === 'en' ? '📊 Observation' : '📊 పరిశీలన'}:</h4>
            <Badge variant="warning" size="lg">
              {language === 'en' ? 'The straws REPEL each other!' : 'స్ట్రాలు ఒకదానికొకటి వికర్షిస్తాయి!'}
            </Badge>
            <p className="result-explanation">
              {language === 'en' ? (
                <>
                  Both straws acquired <strong>similar charges</strong> when rubbed with paper.
                  Like charges repel - this is <strong>electrostatic force</strong>!
                </>
              ) : (
                <>
                  రెండు స్ట్రాలు కాగితంతో రుద్దినప్పుడు <strong>సమాన చార్జీలు</strong> పొందాయి.
                  సమాన చార్జీలు వికర్షిస్తాయి - ఇది <strong>స్థిర విద్యుత్ బలం</strong>!
                </>
              )}
            </p>
          </div>
        )}
      </div>

      <div className="additional-observations">
        <h4>{language === 'en' ? '🔬 Try This Too!' : '🔬 ఇది కూడా ప్రయత్నించండి!'}:</h4>
        <ul>
          <li>
            {language === 'en'
              ? 'Bring rubbed straw near small paper bits - they get attracted!'
              : 'రుద్దిన స్ట్రాను చిన్న కాగితం ముక్కల దగ్గరకు తీసుకురండి - అవి ఆకర్షితమవుతాయి!'}
          </li>
          <li>
            {language === 'en'
              ? 'Rub a balloon and stick it to wall - electrostatic force!'
              : 'బెలూన్‌ను రుద్ది గోడకు అతికించండి - స్థిర విద్యుత్ బలం!'}
          </li>
        </ul>
      </div>

      <div className="key-learnings">
        <h4>{language === 'en' ? '🎯 Key Learning' : '🎯 ముఖ్య అభ్యాసం'}:</h4>
        <ul>
          <li>
            {language === 'en'
              ? 'Electrostatic force is a NON-CONTACT force'
              : 'స్థిర విద్యుత్ బలం ఒక సంపర్క రహిత బలం'}
          </li>
          <li>
            {language === 'en'
              ? 'Rubbing creates electric charges on objects'
              : 'రుద్దడం వస్తువులపై విద్యుత్ చార్జీలను సృష్టిస్తుంది'}
          </li>
          <li>
            {language === 'en'
              ? 'Like charges REPEL, unlike charges ATTRACT'
              : 'సమాన చార్జీలు వికర్షిస్తాయి, విభిన్న చార్జీలు ఆకర్షిస్తాయి'}
          </li>
        </ul>
      </div>
    </div>
  );
}

// Activities are already exported individually above (export function)
