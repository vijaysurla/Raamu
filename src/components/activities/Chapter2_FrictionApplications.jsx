import React, { useState } from 'react';
import { Check, X, Lightbulb, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import './Chapter2Activities.css';

// ==================================================
// FRICTION APPLICATIONS EXPLORER
// Sections 2.3 & 2.4: Necessary Evil + Increasing/Reducing
// ==================================================
export function FrictionApplications({ language }) {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const scenarios = {
    helpful: {
      title: 'Friction is Helpful (Necessary)',
      titleTelugu: 'ఘర్షణ ఉపయోగకరంగా ఉంటుంది (అవసరం)',
      icon: '✅',
      color: 'success',
      cases: [
        {
          id: 'walking',
          icon: '🚶',
          name: 'Walking',
          nameTelugu: 'నడవడం',
          description: 'Without friction, you would slip and cannot walk',
          descriptionTelugu: 'ఘర్షణ లేకుండా, మీరు జారిపోతారు మరియు నడవలేరు',
          whatIf: 'Imagine walking on ice - very difficult!',
          whatIfTelugu: 'మంచు మీద నడవడం ఊహించుకోండి - చాలా కష్టం!'
        },
        {
          id: 'brakes',
          icon: '🚗',
          name: 'Vehicle Brakes',
          nameTelugu: 'వాహన బ్రేక్స్',
          description: 'Friction between brake pads and wheels stops vehicles',
          descriptionTelugu: 'బ్రేక్ ప్యాడ్స్ మరియు చక్రాల మధ్య ఘర్షణ వాహనాలను ఆపుతుంది',
          whatIf: 'No friction = No brakes = Accidents!',
          whatIfTelugu: 'ఘర్షణ లేదు = బ్రేక్స్ లేవు = ప్రమాదాలు!'
        },
        {
          id: 'writing',
          icon: '✍️',
          name: 'Writing',
          nameTelugu: 'వ్రాయడం',
          description: 'Friction between pen/chalk and surface allows writing',
          descriptionTelugu: 'పెన్/సుద్ద మరియు ఉపరితలం మధ్య ఘర్షణ వ్రాయడానికి అనుమతిస్తుంది',
          whatIf: 'No friction = Pen would not write!',
          whatIfTelugu: 'ఘర్షణ లేదు = పెన్ వ్రాయదు!'
        },
        {
          id: 'nails',
          icon: '🔨',
          name: 'Nails & Screws',
          nameTelugu: 'మేకులు & స్క్రూలు',
          description: 'Friction holds nails and screws in place',
          descriptionTelugu: 'ఘర్షణ మేకులు మరియు స్క్రూలను స్థానంలో ఉంచుతుంది',
          whatIf: 'No friction = Nothing would stay fixed!',
          whatIfTelugu: 'ఘర్షణ లేదు = ఏమీ స్థిరంగా ఉండదు!'
        },
        {
          id: 'matchstick',
          icon: '🔥',
          name: 'Lighting Matchsticks',
          nameTelugu: 'అగ్గిపుల్లలు వెలిగించడం',
          description: 'Friction produces heat to light matchsticks',
          descriptionTelugu: 'అగ్గిపుల్లలను వెలిగించడానికి ఘర్షణ వేడిని ఉత్పత్తి చేస్తుంది',
          whatIf: 'Friction creates fire!',
          whatIfTelugu: 'ఘర్షణ నిప్పును సృష్టిస్తుంది!'
        },
        {
          id: 'knot',
          icon: '🪢',
          name: 'Tying Knots',
          nameTelugu: 'ముడులు కట్టడం',
          description: 'Friction between rope fibers holds knots',
          descriptionTelugu: 'త్రాడు ఫైబర్‌ల మధ్య ఘర్షణ ముడులను పట్టుకుంటుంది',
          whatIf: 'No friction = Knots would untie!',
          whatIfTelugu: 'ఘర్షణ లేదు = ముడులు విప్పుతాయి!'
        }
      ]
    },
    harmful: {
      title: 'Friction is Harmful (Evil)',
      titleTelugu: 'ఘర్షణ హానికరం (చెడ్డది)',
      icon: '❌',
      color: 'error',
      cases: [
        {
          id: 'wear',
          icon: '👟',
          name: 'Wear and Tear',
          nameTelugu: 'అరుగుదల',
          description: 'Friction wears out shoe soles, machine parts',
          descriptionTelugu: 'ఘర్షణ షూ సోల్స్, యంత్ర భాగాలను అరుగుతుంది',
          problem: 'Things get damaged and need replacement',
          problemTelugu: 'వస్తువులు దెబ్బతింటాయి మరియు మార్పు అవసరం'
        },
        {
          id: 'heat',
          icon: '🔥',
          name: 'Heat Generation',
          nameTelugu: 'వేడి ఉత్పత్తి',
          description: 'Friction produces unwanted heat in machines',
          descriptionTelugu: 'యంత్రాలలో ఘర్షణ అవాంఛిత వేడిని ఉత్పత్తి చేస్తుంది',
          problem: 'Energy is wasted as heat',
          problemTelugu: 'శక్తి వేడిగా వృధా అవుతుంది'
        },
        {
          id: 'efficiency',
          icon: '⚡',
          name: 'Reduced Efficiency',
          nameTelugu: 'తగ్గిన సామర్థ్యం',
          description: 'Friction reduces efficiency of machines',
          descriptionTelugu: 'ఘర్షణ యంత్రాల సామర్థ్యాన్ని తగ్గిస్తుంది',
          problem: 'More fuel/energy needed',
          problemTelugu: 'ఎక్కువ ఇంధనం/శక్తి అవసరం'
        },
        {
          id: 'movement',
          icon: '📦',
          name: 'Difficult Movement',
          nameTelugu: 'కష్టమైన కదలిక',
          description: 'High friction makes pushing/pulling difficult',
          descriptionTelugu: 'అధిక ఘర్షణ నెట్టడం/లాగడం కష్టతరం చేస్తుంది',
          problem: 'More effort required',
          problemTelugu: 'ఎక్కువ శ్రమ అవసరం'
        }
      ]
    }
  };

  const applications = {
    increase: {
      title: 'Methods to INCREASE Friction',
      titleTelugu: 'ఘర్షణను పెంచే పద్ధతులు',
      icon: '⬆️',
      color: 'info',
      methods: [
        {
          id: 'treads',
          icon: '🚗',
          name: 'Treaded Tyres',
          nameTelugu: 'గాడులు ఉన్న టైర్లు',
          description: 'Grooves on tyres increase grip with road',
          descriptionTelugu: 'టైర్లపై గాడులు రోడ్డుతో పట్టును పెంచుతాయి',
          where: 'Cars, trucks, bicycles, bulldozers',
          whereTelugu: 'కార్లు, ట్రక్కులు, సైకిళ్లు, బుల్డోజర్లు'
        },
        {
          id: 'grooves',
          icon: '👟',
          name: 'Grooved Soles',
          nameTelugu: 'గాడులు ఉన్న అరికాళ్లు',
          description: 'Pattern on shoe soles prevents slipping',
          descriptionTelugu: 'షూ సోల్స్‌పై నమూనా జారిపోవడాన్ని నిరోధిస్తుంది',
          where: 'Sports shoes, hiking boots',
          whereTelugu: 'క్రీడా షూలు, హైకింగ్ బూట్లు'
        },
        {
          id: 'powder',
          icon: '🏐',
          name: 'Coarse Powder',
          nameTelugu: 'కఠినమైన పొడి',
          description: 'Gymnasts use powder on hands for better grip',
          descriptionTelugu: 'జిమ్నాస్ట్‌లు మెరుగైన పట్టు కోసం చేతులపై పొడిని ఉపయోగిస్తారు',
          where: 'Gymnastics, weightlifting, rock climbing',
          whereTelugu: 'జిమ్నాస్టిక్స్, వెయిట్‌లిఫ్టింగ్, రాక్ క్లైంబింగ్'
        },
        {
          id: 'roughen',
          icon: '⚾',
          name: 'Roughen Surface',
          nameTelugu: 'ఉపరితలాన్ని కఠినం చేయడం',
          description: 'Making surface rough increases friction',
          descriptionTelugu: 'ఉపరితలాన్ని కఠినం చేయడం ఘర్షణను పెంచుతుంది',
          where: 'Roads, footpaths, floors',
          whereTelugu: 'రోడ్లు, ఫుట్‌పాత్‌లు, అంతస్తులు'
        }
      ]
    },
    reduce: {
      title: 'Methods to REDUCE Friction',
      titleTelugu: 'ఘర్షణను తగ్గించే పద్ధతులు',
      icon: '⬇️',
      color: 'warning',
      methods: [
        {
          id: 'lubricants',
          icon: '🛢️',
          name: 'Lubricants (Oil/Grease)',
          nameTelugu: 'స్నేహకాలు (నూనె/గ్రీజు)',
          description: 'Oil creates thin layer between surfaces',
          descriptionTelugu: 'నూనె ఉపరితలాల మధ్య సన్నని పొరను సృష్టిస్తుంది',
          where: 'Machines, door hinges, bicycle chains',
          whereTelugu: 'యంత్రాలు, తలుపు కీళ్లు, సైకిల్ చైన్లు'
        },
        {
          id: 'bearings',
          icon: '⚙️',
          name: 'Ball Bearings',
          nameTelugu: 'బాల్ బేరింగ్‌లు',
          description: 'Replace sliding friction with rolling friction',
          descriptionTelugu: 'స్లైడింగ్ ఘర్షణను రోలింగ్ ఘర్షణతో భర్తీ చేస్తుంది',
          where: 'Ceiling fans, bicycles, motors',
          whereTelugu: 'సీలింగ్ ఫ్యాన్లు, సైకిళ్లు, మోటార్లు'
        },
        {
          id: 'wheels',
          icon: '🛞',
          name: 'Wheels/Rollers',
          nameTelugu: 'చక్రాలు/రోలర్లు',
          description: 'Rolling friction is much less than sliding',
          descriptionTelugu: 'రోలింగ్ ఘర్షణ స్లైడింగ్ కంటే చాలా తక్కువ',
          where: 'Suitcases, carts, vehicles',
          whereTelugu: 'సూట్‌కేసులు, బండ్లు, వాహనాలు'
        },
        {
          id: 'polish',
          icon: '✨',
          name: 'Polishing/Smoothing',
          nameTelugu: 'పాలిష్ చేయడం/మృదువుగా చేయడం',
          description: 'Smooth surfaces have less friction',
          descriptionTelugu: 'మృదువైన ఉపరితలాలు తక్కువ ఘర్షణను కలిగి ఉంటాయి',
          where: 'Slides, machinery surfaces',
          whereTelugu: 'జారుడు పట్టీలు, యంత్ర ఉపరితలాలు'
        },
        {
          id: 'streamline',
          icon: '✈️',
          name: 'Streamlining',
          nameTelugu: 'సుగమ ఆకారం',
          description: 'Special shapes reduce fluid friction',
          descriptionTelugu: 'ప్రత్యేక ఆకారాలు ద్రవ ఘర్షణను తగ్గిస్తాయి',
          where: 'Aeroplanes, cars, boats, submarines',
          whereTelugu: 'విమానాలు, కార్లు, పడవలు, జలాంతర్గాములు'
        },
        {
          id: 'air',
          icon: '💨',
          name: 'Air Cushion',
          nameTelugu: 'గాలి కుషన్',
          description: 'Air layer between surfaces reduces friction',
          descriptionTelugu: 'ఉపరితలాల మధ్య గాలి పొర ఘర్షణను తగ్గిస్తుంది',
          where: 'Hovercrafts, some machines',
          whereTelugu: 'హోవర్‌క్రాఫ్ట్‌లు, కొన్ని యంత్రాలు'
        }
      ]
    }
  };

  return (
    <div className="activity-container">
      <div className="activity-instructions">
        <h4>
          {language === 'en' 
            ? '🎭 Friction: A Necessary Evil' 
            : '🎭 ఘర్షణ: అవసరమైన చెడు'}
        </h4>
        <p>
          {language === 'en'
            ? 'Friction can be both helpful and harmful! Explore different scenarios and learn when we need to increase or reduce friction.'
            : 'ఘర్షణ ఉపయోగకరంగా మరియు హానికరంగా ఉంటుంది! వివిధ సందర్భాలను అన్వేషించండి మరియు ఘర్షణను ఎప్పుడు పెంచాలి లేదా తగ్గించాలో తెలుసుకోండి.'}
        </p>
      </div>

      {/* Scenarios Explorer */}
      <div className="scenarios-section">
        <h3>{language === 'en' ? 'Friction: Helpful or Harmful?' : 'ఘర్షణ: ఉపయోగకరమా లేదా హానికరమా?'}</h3>
        
        <div className="scenarios-grid">
          {Object.entries(scenarios).map(([key, scenario]) => (
            <div key={key} className="scenario-panel">
              <div className={`scenario-header ${scenario.color}`}>
                <span className="scenario-icon-large">{scenario.icon}</span>
                <h4>{language === 'en' ? scenario.title : scenario.titleTelugu}</h4>
              </div>
              
              <div className="scenario-cases">
                {scenario.cases.map((item) => (
                  <button
                    key={item.id}
                    className={`scenario-card ${selectedScenario?.id === item.id ? 'active' : ''}`}
                    onClick={() => setSelectedScenario(item)}
                  >
                    <span className="card-icon">{item.icon}</span>
                    <div className="card-content">
                      <h5>{language === 'en' ? item.name : item.nameTelugu}</h5>
                      <p className="card-description">
                        {language === 'en' ? item.description : item.descriptionTelugu}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Scenario Details */}
        {selectedScenario && (
          <div className="detail-panel">
            <div className="detail-header">
              <span className="detail-icon">{selectedScenario.icon}</span>
              <h4>{language === 'en' ? selectedScenario.name : selectedScenario.nameTelugu}</h4>
            </div>
            <div className="detail-content">
              <div className="detail-item">
                <strong>{language === 'en' ? 'Description:' : 'వివరణ:'}</strong>
                <p>{language === 'en' ? selectedScenario.description : selectedScenario.descriptionTelugu}</p>
              </div>
              {selectedScenario.whatIf && (
                <div className="detail-item highlight">
                  <Lightbulb size={18} />
                  <strong>{language === 'en' ? 'What if no friction?' : 'ఘర్షణ లేకపోతే?'}</strong>
                  <p>{language === 'en' ? selectedScenario.whatIf : selectedScenario.whatIfTelugu}</p>
                </div>
              )}
              {selectedScenario.problem && (
                <div className="detail-item warning">
                  <AlertTriangle size={18} />
                  <strong>{language === 'en' ? 'Problem:' : 'సమస్య:'}</strong>
                  <p>{language === 'en' ? selectedScenario.problem : selectedScenario.problemTelugu}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Applications Explorer */}
      <div className="applications-section">
        <h3>{language === 'en' ? 'Controlling Friction' : 'ఘర్షణను నియంత్రించడం'}</h3>
        
        <div className="applications-grid">
          {Object.entries(applications).map(([key, app]) => (
            <div key={key} className="application-panel">
              <div className={`application-header ${app.color}`}>
                <span className="app-icon-large">{app.icon}</span>
                <h4>{language === 'en' ? app.title : app.titleTelugu}</h4>
              </div>
              
              <div className="application-methods">
                {app.methods.map((method) => (
                  <button
                    key={method.id}
                    className={`method-card ${selectedApplication?.id === method.id ? 'active' : ''}`}
                    onClick={() => setSelectedApplication(method)}
                  >
                    <span className="method-icon">{method.icon}</span>
                    <div className="method-content">
                      <h5>{language === 'en' ? method.name : method.nameTelugu}</h5>
                      <p className="method-description">
                        {language === 'en' ? method.description : method.descriptionTelugu}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Application Details */}
        {selectedApplication && (
          <div className="detail-panel">
            <div className="detail-header">
              <span className="detail-icon">{selectedApplication.icon}</span>
              <h4>{language === 'en' ? selectedApplication.name : selectedApplication.nameTelugu}</h4>
            </div>
            <div className="detail-content">
              <div className="detail-item">
                <strong>{language === 'en' ? 'How it works:' : 'ఇది ఎలా పనిచేస్తుంది:'}</strong>
                <p>{language === 'en' ? selectedApplication.description : selectedApplication.descriptionTelugu}</p>
              </div>
              <div className="detail-item">
                <strong>{language === 'en' ? 'Used in:' : 'ఉపయోగించబడుతుంది:'}</strong>
                <p>{language === 'en' ? selectedApplication.where : selectedApplication.whereTelugu}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Key Learnings */}
      <div className="key-learnings">
        <h4>{language === 'en' ? '🎯 Key Learning' : '🎯 ముఖ్య అభ్యాసం'}:</h4>
        <ul>
          <li>
            {language === 'en'
              ? 'Friction can be both HELPFUL (walking, brakes) and HARMFUL (wear, heat loss)'
              : 'ఘర్షణ ఉపయోగకరంగా (నడవడం, బ్రేక్స్) మరియు హానికరంగా (అరుగుదల, వేడి నష్టం) ఉంటుంది'}
          </li>
          <li>
            {language === 'en'
              ? 'INCREASE friction: Use treaded tyres, grooved soles, rough surfaces, powder'
              : 'ఘర్షణను పెంచండి: గాడులు ఉన్న టైర్లు, గాడులు ఉన్న అరికాళ్లు, కఠినమైన ఉపరితలాలు, పొడి ఉపయోగించండి'}
          </li>
          <li>
            {language === 'en'
              ? 'REDUCE friction: Use lubricants, ball bearings, wheels, polishing, streamlining'
              : 'ఘర్షణను తగ్గించండి: స్నేహకాలు, బాల్ బేరింగ్‌లు, చక్రాలు, పాలిష్ చేయడం, సుగమీకరణ ఉపయోగించండి'}
          </li>
          <li>
            {language === 'en'
              ? 'We control friction based on our needs - increase when helpful, reduce when harmful'
              : 'మన అవసరాల ఆధారంగా ఘర్షణను నియంత్రిస్తాము - ఉపయోగకరంగా ఉన్నప్పుడు పెంచండి, హానికరంగా ఉన్నప్పుడు తగ్గించండి'}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default FrictionApplications;
