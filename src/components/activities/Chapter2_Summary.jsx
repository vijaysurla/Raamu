import React, { useState } from 'react';
import { Check, X, Award, RefreshCw, Star } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import './Chapter2Activities.css';

// ==================================================
// CHAPTER 2 SUMMARY & ASSESSMENT
// ==================================================
export function Chapter2Summary({ language }) {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState([]);

  const keyTerms = [
    {
      term: 'Friction',
      termTelugu: 'ఘర్షణ',
      definition: 'Force that opposes relative motion between two surfaces in contact',
      definitionTelugu: 'సంపర్కంలో ఉన్న రెండు ఉపరితలాల మధ్య సాపేక్ష చలనాన్ని వ్యతిరేకించే బలం'
    },
    {
      term: 'Static Friction',
      termTelugu: 'స్థిర ఘర్షణ',
      definition: 'Friction when object is at rest, just about to move',
      definitionTelugu: 'వస్తువు విశ్రాంతిలో ఉన్నప్పుడు, కదలడానికి సిద్ధంగా ఉన్నప్పుడు ఘర్షణ'
    },
    {
      term: 'Sliding Friction',
      termTelugu: 'జారే ఘర్షణ',
      definition: 'Friction when object slides over another surface',
      definitionTelugu: 'వస్తువు మరొక ఉపరితలంపై జారినప్పుడు ఘర్షణ'
    },
    {
      term: 'Rolling Friction',
      termTelugu: 'తిరగడం ఘర్షణ',
      definition: 'Friction when object rolls - LESS than sliding friction',
      definitionTelugu: 'వస్తువు తిరిగినప్పుడు ఘర్షణ - జారే ఘర్షణ కంటే తక్కువ'
    },
    {
      term: 'Lubricants',
      termTelugu: 'స్నేహకాలు',
      definition: 'Substances (oil, grease) that reduce friction between surfaces',
      definitionTelugu: 'ఉపరితలాల మధ్య ఘర్షణను తగ్గించే పదార్థాలు (నూనె, గ్రీజు)'
    },
    {
      term: 'Drag',
      termTelugu: 'డ్రాగ్',
      definition: 'Frictional force exerted by fluids (air, water) on moving objects',
      definitionTelugu: 'కదులుతున్న వస్తువులపై ద్రవాలు (గాలి, నీరు) వ్యాయామించే ఘర్షణ బలం'
    },
    {
      term: 'Streamlined',
      termTelugu: 'సుగమ ఆకారం',
      definition: 'Special shape that reduces fluid friction/drag',
      definitionTelugu: 'ద్రవ ఘర్షణ/డ్రాగ్‌ను తగ్గించే ప్రత్యేక ఆకారం'
    }
  ];

  const questions = [
    {
      question: 'What force opposes motion between two surfaces in contact?',
      questionTelugu: 'సంపర్కంలో ఉన్న రెండు ఉపరితలాల మధ్య చలనాన్ని ఏ బలం వ్యతిరేకిస్తుంది?',
      options: ['Gravity', 'Friction', 'Magnetism', 'Thrust'],
      optionsTelugu: ['గురుత్వాకర్షణ', 'ఘర్షణ', 'అయస్కాంతత్వం', 'థ్రస్ట్'],
      correct: 1,
      explanation: 'Friction is the force that opposes relative motion between surfaces.',
      explanationTelugu: 'ఘర్షణ అనేది ఉపరితలాల మధ్య సాపేక్ష చలనాన్ని వ్యతిరేకించే బలం.'
    },
    {
      question: 'Which friction is the LARGEST?',
      questionTelugu: 'ఏ ఘర్షణ అత్యధికం?',
      options: ['Rolling friction', 'Sliding friction', 'Static friction', 'All are equal'],
      optionsTelugu: ['తిరగడం ఘర్షణ', 'జారే ఘర్షణ', 'స్థిర ఘర్షణ', 'అన్నీ సమానం'],
      correct: 2,
      explanation: 'Static friction > Sliding friction > Rolling friction',
      explanationTelugu: 'స్థిర ఘర్షణ > జారే ఘర్షణ > తిరగడం ఘర్షణ'
    },
    {
      question: 'Which surface has MORE friction?',
      questionTelugu: 'ఏ ఉపరితలం ఎక్కువ ఘర్షణను కలిగి ఉంటుంది?',
      options: ['Smooth polished floor', 'Rough sandpaper', 'Oiled surface', 'Glass surface'],
      optionsTelugu: ['మృదువైన పాలిష్ అంతస్తు', 'కఠినమైన ఇసుక కాగితం', 'నూనె వేసిన ఉపరితలం', 'గాజు ఉపరితలం'],
      correct: 1,
      explanation: 'Rough surfaces have MORE friction than smooth surfaces.',
      explanationTelugu: 'కఠినమైన ఉపరితలాలు మృదువైన ఉపరితలాల కంటే ఎక్కువ ఘర్షణను కలిగి ఉంటాయి.'
    },
    {
      question: 'What do we use to REDUCE friction?',
      questionTelugu: 'ఘర్షణను తగ్గించడానికి మనం ఏమి ఉపయోగిస్తాము?',
      options: ['Rough surface', 'Lubricants like oil', 'Heavy weight', 'Grooved tyres'],
      optionsTelugu: ['కఠినమైన ఉపరితలం', 'నూనె వంటి స్నేహకాలు', 'అధిక బరువు', 'గాడులు ఉన్న టైర్లు'],
      correct: 1,
      explanation: 'Lubricants (oil, grease) create a thin layer and reduce friction.',
      explanationTelugu: 'స్నేహకాలు (నూనె, గ్రీజు) సన్నని పొరను సృష్టిస్తాయి మరియు ఘర్షణను తగ్గిస్తాయి.'
    },
    {
      question: 'Why do sportsmen use shoes with spikes?',
      questionTelugu: 'క్రీడాకారులు స్పైక్‌లతో షూలను ఎందుకు ఉపయోగిస్తారు?',
      options: ['To look good', 'To reduce friction', 'To increase friction/grip', 'To run faster'],
      optionsTelugu: ['బాగా కనిపించడానికి', 'ఘర్షణను తగ్గించడానికి', 'ఘర్షణ/పట్టును పెంచడానికి', 'వేగంగా పరుగెత్తడానికి'],
      correct: 2,
      explanation: 'Spikes increase friction with ground, providing better grip.',
      explanationTelugu: 'స్పైక్‌లు నేలతో ఘర్షణను పెంచుతాయి, మెరుగైన పట్టును అందిస్తాయి.'
    },
    {
      question: 'Which has a streamlined shape to reduce drag?',
      questionTelugu: 'డ్రాగ్‌ను తగ్గించడానికి ఏది సుగమ ఆకారాన్ని కలిగి ఉంటుంది?',
      options: ['Box', 'Cube', 'Aeroplane', 'Brick'],
      optionsTelugu: ['పెట్టె', 'క్యూబ్', 'విమానం', 'ఇటుక'],
      correct: 2,
      explanation: 'Aeroplanes have streamlined shapes to reduce air drag.',
      explanationTelugu: 'విమానాలు గాలి డ్రాగ్‌ను తగ్గించడానికి సుగమ ఆకారాలను కలిగి ఉంటాయి.'
    },
    {
      question: 'What does friction produce in machines?',
      questionTelugu: 'యంత్రాలలో ఘర్షణ ఏమి ఉత్పత్తి చేస్తుంది?',
      options: ['Light', 'Heat', 'Sound', 'Magnetism'],
      optionsTelugu: ['కాంతి', 'వేడి', 'ధ్వని', 'అయస్కాంతత్వం'],
      correct: 1,
      explanation: 'Friction produces heat, which is often wasteful in machines.',
      explanationTelugu: 'ఘర్షణ వేడిని ఉత్పత్తి చేస్తుంది, ఇది యంత్రాలలో తరచుగా వృధా అవుతుంది.'
    },
    {
      question: 'Ball bearings are used to:',
      questionTelugu: 'బాల్ బేరింగ్‌లు ఉపయోగించబడతాయి:',
      options: ['Increase friction', 'Convert sliding to rolling friction', 'Make things heavy', 'Paint machines'],
      optionsTelugu: ['ఘర్షణను పెంచడానికి', 'జారే ఘర్షణను తిరగడం ఘర్షణగా మార్చడానికి', 'వస్తువులను భారంగా చేయడానికి', 'యంత్రాలకు రంగు వేయడానికి'],
      correct: 1,
      explanation: 'Ball bearings replace sliding friction with smaller rolling friction.',
      explanationTelugu: 'బాల్ బేరింగ్‌లు జారే ఘర్షణను చిన్న తిరగడం ఘర్షణతో భర్తీ చేస్తాయి.'
    },
    {
      question: 'Why is it difficult to walk on a wet marble floor?',
      questionTelugu: 'తడి పాలరాయి అంతస్తుపై నడవడం ఎందుకు కష్టం?',
      options: ['Too much friction', 'Very less friction', 'No gravity', 'Too heavy'],
      optionsTelugu: ['చాలా ఎక్కువ ఘర్షణ', 'చాలా తక్కువ ఘర్షణ', 'గురుత్వాకర్షణ లేదు', 'చాలా భారం'],
      correct: 1,
      explanation: 'Water reduces friction, making the floor slippery.',
      explanationTelugu: 'నీరు ఘర్షణను తగ్గిస్తుంది, అంతస్తును జారేలా చేస్తుంది.'
    },
    {
      question: 'The wheel is useful because:',
      questionTelugu: 'చక్రం ఉపయోగకరం ఎందుకంటే:',
      options: ['It is round', 'Rolling friction < Sliding friction', 'It is heavy', 'It looks nice'],
      optionsTelugu: ['ఇది గుండ్రంగా ఉంటుంది', 'తిరగడం ఘర్షణ < జారే ఘర్షణ', 'ఇది భారంగా ఉంటుంది', 'ఇది చక్కగా కనిపిస్తుంది'],
      correct: 1,
      explanation: 'Wheels convert sliding to rolling, greatly reducing friction.',
      explanationTelugu: 'చక్రాలు జారడాన్ని తిరగడంగా మారుస్తాయి, ఘర్షణను చాలా తగ్గిస్తాయి.'
    }
  ];

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
  };

  const submitAnswer = () => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setAnswers([...answers, {
      question: currentQuestion,
      selected: selectedAnswer,
      correct: questions[currentQuestion].correct,
      isCorrect
    }]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
    setAnswers([]);
  };

  const getGrade = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return { grade: 'A+', message: 'Outstanding!', messageTelugu: 'అద్భుతం!', color: 'success' };
    if (percentage >= 75) return { grade: 'A', message: 'Excellent!', messageTelugu: 'అద్భుతమైనది!', color: 'success' };
    if (percentage >= 60) return { grade: 'B', message: 'Good!', messageTelugu: 'మంచిది!', color: 'info' };
    if (percentage >= 50) return { grade: 'C', message: 'Fair', messageTelugu: 'సరైనది', color: 'warning' };
    return { grade: 'D', message: 'Need Practice', messageTelugu: 'అభ్యాసం అవసరం', color: 'error' };
  };

  return (
    <div className="activity-container">
      {/* Chapter Summary */}
      <div className="chapter-summary-section">
        <h2>{language === 'en' ? '📚 Chapter 2 Summary: Friction' : '📚 అధ్యాయం 2 సారాంశం: ఘర్షణ'}</h2>
        
        {/* Key Concepts */}
        <div className="summary-grid">
          <div className="summary-card">
            <h4>🔑 {language === 'en' ? 'What is Friction?' : 'ఘర్షణ అంటే ఏమిటి?'}</h4>
            <p>
              {language === 'en'
                ? 'Friction is the force that opposes motion between two surfaces in contact. It is caused by irregularities on surfaces that interlock.'
                : 'ఘర్షణ అనేది సంపర్కంలో ఉన్న రెండు ఉపరితలాల మధ్య చలనాన్ని వ్యతిరేకించే బలం. ఇది ఇంటర్‌లాక్ అయ్యే ఉపరితలాలపై అసమానతల వల్ల కలుగుతుంది.'}
            </p>
          </div>

          <div className="summary-card">
            <h4>📊 {language === 'en' ? 'Types of Friction' : 'ఘర్షణ రకాలు'}</h4>
            <ul>
              <li><strong>{language === 'en' ? 'Static' : 'స్థిర'}:</strong> {language === 'en' ? 'Object at rest' : 'విశ్రాంతిలో ఉన్న వస్తువు'} (Largest)</li>
              <li><strong>{language === 'en' ? 'Sliding' : 'జారడం'}:</strong> {language === 'en' ? 'Object sliding' : 'జారుతున్న వస్తువు'} (Medium)</li>
              <li><strong>{language === 'en' ? 'Rolling' : 'తిరగడం'}:</strong> {language === 'en' ? 'Object rolling' : 'తిరుగుతున్న వస్తువు'} (Smallest)</li>
              <li><strong>{language === 'en' ? 'Fluid' : 'ద్రవం'}:</strong> {language === 'en' ? 'Drag in fluids' : 'ద్రవాలలో డ్రాగ్'}</li>
            </ul>
          </div>

          <div className="summary-card">
            <h4>✅ {language === 'en' ? 'Friction is Helpful' : 'ఘర్షణ ఉపయోగకరం'}</h4>
            <ul>
              <li>Walking possible</li>
              <li>Brakes work</li>
              <li>Writing possible</li>
              <li>Nails stay fixed</li>
            </ul>
          </div>

          <div className="summary-card">
            <h4>❌ {language === 'en' ? 'Friction is Harmful' : 'ఘర్షణ హానికరం'}</h4>
            <ul>
              <li>Wear and tear</li>
              <li>Heat generation</li>
              <li>Energy loss</li>
              <li>Reduces efficiency</li>
            </ul>
          </div>

          <div className="summary-card">
            <h4>⬆️ {language === 'en' ? 'Increase Friction' : 'ఘర్షణను పెంచండి'}</h4>
            <ul>
              <li>Treaded tyres</li>
              <li>Grooved soles</li>
              <li>Rough surfaces</li>
              <li>Coarse powder</li>
            </ul>
          </div>

          <div className="summary-card">
            <h4>⬇️ {language === 'en' ? 'Reduce Friction' : 'ఘర్షణను తగ్గించండి'}</h4>
            <ul>
              <li>Lubricants (oil/grease)</li>
              <li>Ball bearings</li>
              <li>Wheels/rollers</li>
              <li>Polishing</li>
              <li>Streamlining</li>
            </ul>
          </div>
        </div>

        {/* Key Terms */}
        <div className="key-terms-section">
          <h3>{language === 'en' ? '📖 Key Terms' : '📖 ముఖ్య పదాలు'}</h3>
          <div className="terms-grid">
            {keyTerms.map((term, index) => (
              <div key={index} className="term-card">
                <h5>{language === 'en' ? term.term : term.termTelugu}</h5>
                <p>{language === 'en' ? term.definition : term.definitionTelugu}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assessment Quiz */}
      <div className="assessment-section">
        <h2>{language === 'en' ? '🎯 Chapter Assessment Quiz' : '🎯 అధ్యాయం అంచనా క్విజ్'}</h2>
        
        {!quizStarted && !showResults && (
          <div className="quiz-intro">
            <div className="quiz-info-card">
              <Award size={48} color="var(--primary-600)" />
              <h3>{language === 'en' ? 'Test Your Knowledge!' : 'మీ జ్ఞానాన్ని పరీక్షించండి!'}</h3>
              <p>
                {language === 'en'
                  ? `Answer ${questions.length} questions about friction. Let's see how much you learned!`
                  : `ఘర్షణ గురించి ${questions.length} ప్రశ్నలకు సమాధానం ఇవ్వండి. మీరు ఎంత నేర్చుకున్నారో చూద్దాం!`}
              </p>
              <Button onClick={() => setQuizStarted(true)} size="lg">
                <Star size={18} />
                {language === 'en' ? 'Start Quiz' : 'క్విజ్ ప్రారంభించండి'}
              </Button>
            </div>
          </div>
        )}

        {quizStarted && !showResults && (
          <div className="quiz-active">
            {/* Progress */}
            <div className="quiz-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
              <span className="progress-text">
                {language === 'en' ? 'Question' : 'ప్రశ్న'} {currentQuestion + 1} / {questions.length}
              </span>
            </div>

            {/* Question */}
            <div className="question-card">
              <h4 className="question-text">
                {language === 'en' 
                  ? questions[currentQuestion].question
                  : questions[currentQuestion].questionTelugu}
              </h4>

              <div className="options-list">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-btn ${selectedAnswer === index ? 'selected' : ''}`}
                    onClick={() => handleAnswer(index)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <span className="option-text">
                      {language === 'en' ? option : questions[currentQuestion].optionsTelugu[index]}
                    </span>
                  </button>
                ))}
              </div>

              <div className="quiz-controls">
                <Button
                  onClick={submitAnswer}
                  disabled={selectedAnswer === null}
                  size="lg"
                >
                  {currentQuestion === questions.length - 1
                    ? (language === 'en' ? 'Finish' : 'ముగించు')
                    : (language === 'en' ? 'Next' : 'తదుపరి')}
                </Button>
              </div>
            </div>
          </div>
        )}

        {showResults && (
          <div className="quiz-results">
            <div className="results-card">
              <Award size={64} color={`var(--${getGrade().color}-600)`} />
              <h3>{language === 'en' ? 'Quiz Complete!' : 'క్విజ్ పూర్తయింది!'}</h3>
              
              <div className="score-display">
                <div className="score-circle">
                  <span className="score-number">{score}</span>
                  <span className="score-total">/ {questions.length}</span>
                </div>
                <Badge variant={getGrade().color} size="lg">
                  {language === 'en' ? 'Grade' : 'గ్రేడ్'}: {getGrade().grade}
                </Badge>
                <p className="score-message">
                  {language === 'en' ? getGrade().message : getGrade().messageTelugu}
                </p>
              </div>

              {/* Answer Review */}
              <div className="answers-review">
                <h4>{language === 'en' ? 'Review Answers' : 'సమాధానాలను సమీక్షించండి'}:</h4>
                {answers.map((answer, index) => (
                  <div key={index} className={`review-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="review-header">
                      {answer.isCorrect ? <Check size={20} /> : <X size={20} />}
                      <span className="review-question">
                        {language === 'en' ? 'Question' : 'ప్రశ్న'} {index + 1}
                      </span>
                    </div>
                    <p className="review-explanation">
                      {language === 'en'
                        ? questions[answer.question].explanation
                        : questions[answer.question].explanationTelugu}
                    </p>
                  </div>
                ))}
              </div>

              <Button onClick={restartQuiz} size="lg">
                <RefreshCw size={18} />
                {language === 'en' ? 'Retry Quiz' : 'క్విజ్‌ని మళ్లీ ప్రయత్నించండి'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chapter2Summary;
