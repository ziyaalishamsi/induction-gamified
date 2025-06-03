import React, { useState, useEffect } from 'react';

const citiGamesData = {
  btss: {
    trivia: [
      { question: "What does BTSS stand for?", options: ["Business Technology Solutions & Services", "Banking Technology Support Systems", "Business Tech Safety Standards", "Bank Tech Service Solutions"], correct: 0, points: 20 },
      { question: "Which technology platform does Citi primarily use for core banking?", options: ["Oracle", "SAP", "Microsoft", "Proprietary Systems"], correct: 3, points: 15 },
      { question: "What is Citi's main focus in digital transformation?", options: ["Cost Reduction", "Customer Experience", "Both A and B", "None"], correct: 2, points: 25 }
    ],
    memoryGame: [
      { term: "API", definition: "Application Programming Interface" },
      { term: "Cloud Computing", definition: "On-demand delivery of IT services" },
      { term: "Microservices", definition: "Architectural approach with small services" },
      { term: "DevOps", definition: "Development and Operations integration" }
    ],
    catchTheEgg: {
      correctItems: ["Secure Coding", "API Gateway", "Cloud Native", "Agile Development"],
      wrongItems: ["Unsecured Data", "Legacy Systems", "Waterfall Only", "Manual Processes"]
    }
  },
  communication: {
    trivia: [
      { question: "What is Citi's preferred communication channel for urgent matters?", options: ["Email", "Slack", "Phone", "Teams"], correct: 2, points: 20 },
      { question: "How should you address senior management in emails?", options: ["Hey", "Hi", "Dear", "Hello"], correct: 2, points: 15 },
      { question: "What is the maximum response time for client emails?", options: ["1 hour", "4 hours", "24 hours", "48 hours"], correct: 2, points: 25 }
    ],
    memoryGame: [
      { term: "Professional Communication", definition: "Clear, respectful workplace interaction" },
      { term: "Email Etiquette", definition: "Proper format and tone in emails" },
      { term: "Active Listening", definition: "Fully engaging in conversations" },
      { term: "Meeting Protocol", definition: "Standard procedures for meetings" }
    ],
    hierarchyGame: [
      { level: 1, title: "CEO", name: "Jane Fraser" },
      { level: 2, title: "President", name: "Mark Mason" },
      { level: 3, title: "Managing Director", name: "Regional Head" },
      { level: 4, title: "Director", name: "Department Head" },
      { level: 5, title: "Vice President", name: "Team Lead" },
      { level: 6, title: "Associate", name: "You" }
    ],
    catchTheEgg: {
      correctItems: ["Professional Tone", "Clear Subject Lines", "Proper Grammar", "Timely Response"],
      wrongItems: ["Informal Language", "Vague Subjects", "Typos", "Late Replies"]
    }
  },
  csis: {
    trivia: [
      { question: "What is the first line of defense in cybersecurity?", options: ["Firewall", "Employee Training", "Antivirus", "Encryption"], correct: 1, points: 25 },
      { question: "How often should passwords be changed?", options: ["Monthly", "Quarterly", "Bi-annually", "Annually"], correct: 1, points: 20 },
      { question: "What is two-factor authentication?", options: ["Two passwords", "Password + biometric", "Two security questions", "Password + token/SMS"], correct: 3, points: 30 }
    ],
    memoryGame: [
      { term: "Phishing", definition: "Fraudulent emails to steal information" },
      { term: "Malware", definition: "Malicious software" },
      { term: "VPN", definition: "Virtual Private Network" },
      { term: "SSL", definition: "Secure Sockets Layer" }
    ],
    catchTheEgg: {
      correctItems: ["Strong Passwords", "Secure Networks", "Updated Software", "Data Encryption"],
      wrongItems: ["Weak Passwords", "Public WiFi", "Outdated Systems", "Unencrypted Data"]
    }
  },
  res: {
    trivia: [
      { question: "What does SOX compliance refer to?", options: ["Sarbanes-Oxley Act", "Security Operations", "Standard Operating Procedures", "Software Operations"], correct: 0, points: 25 },
      { question: "How often are compliance audits conducted?", options: ["Monthly", "Quarterly", "Annually", "Bi-annually"], correct: 2, points: 20 },
      { question: "Who is responsible for regulatory compliance?", options: ["Only Compliance Team", "Management Only", "Everyone", "External Auditors"], correct: 2, points: 30 }
    ],
    memoryGame: [
      { term: "KYC", definition: "Know Your Customer" },
      { term: "AML", definition: "Anti-Money Laundering" },
      { term: "GDPR", definition: "General Data Protection Regulation" },
      { term: "Basel III", definition: "International banking regulations" }
    ],
    catchTheEgg: {
      correctItems: ["Regulatory Reports", "Compliance Training", "Risk Assessment", "Documentation"],
      wrongItems: ["Ignored Regulations", "Missing Reports", "Untrained Staff", "Poor Documentation"]
    }
  },
  risk: {
    trivia: [
      { question: "What are the three lines of defense in risk management?", options: ["Prevention, Detection, Response", "Business, Risk, Audit", "Identify, Assess, Mitigate", "Plan, Do, Check"], correct: 1, points: 30 },
      { question: "What is operational risk?", options: ["Market fluctuations", "Credit defaults", "Process failures", "Regulatory changes"], correct: 2, points: 25 },
      { question: "How often should risk assessments be updated?", options: ["Daily", "Weekly", "Monthly", "Regularly based on changes"], correct: 3, points: 20 }
    ],
    memoryGame: [
      { term: "VaR", definition: "Value at Risk" },
      { term: "Stress Testing", definition: "Extreme scenario analysis" },
      { term: "Risk Appetite", definition: "Level of risk willingness" },
      { term: "Control Framework", definition: "Risk management structure" }
    ],
    catchTheEgg: {
      correctItems: ["Risk Monitoring", "Control Testing", "Issue Escalation", "Mitigation Plans"],
      wrongItems: ["Ignored Risks", "Weak Controls", "Delayed Reporting", "No Mitigation"]
    }
  },
  ta: {
    trivia: [
      { question: "What is the primary goal of technology architecture?", options: ["Cost Reduction", "System Integration", "Business Alignment", "All of the above"], correct: 3, points: 25 },
      { question: "What is enterprise architecture?", options: ["Building design", "System blueprint", "Network topology", "Database structure"], correct: 1, points: 20 },
      { question: "Which principle guides Citi's technology architecture?", options: ["Cost-first", "Security-first", "Speed-first", "Feature-first"], correct: 1, points: 30 }
    ],
    memoryGame: [
      { term: "Microservices", definition: "Small, independent services" },
      { term: "API First", definition: "Design APIs before implementation" },
      { term: "Event Driven", definition: "Architecture based on events" },
      { term: "Cloud Native", definition: "Built for cloud environments" }
    ],
    catchTheEgg: {
      correctItems: ["Scalable Design", "Secure Architecture", "Performance Optimization", "Integration Standards"],
      wrongItems: ["Monolithic Systems", "Security Gaps", "Poor Performance", "Isolated Systems"]
    }
  }
};

const citiValues = [
  { value: "Leadership", description: "We lead with integrity and excellence" },
  { value: "Responsibility", description: "We take ownership of our actions" },
  { value: "Innovation", description: "We embrace change and innovation" },
  { value: "Excellence", description: "We strive for excellence in everything" }
];

const citiHistory = [
  { year: "1812", event: "Founded as City Bank of New York" },
  { year: "1976", event: "Became Citicorp" },
  { year: "1998", event: "Merged with Travelers to form Citigroup" },
  { year: "2021", event: "Jane Fraser became first female CEO" }
];

interface CitiKnowledgeGamesProps {
  moduleId: string;
  onGameComplete: (score: number, gameType: string) => void;
}

export default function CitiKnowledgeGames({ moduleId, onGameComplete }: CitiKnowledgeGamesProps) {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [gameScore, setGameScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [memoryCards, setMemoryCards] = useState<any[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [catchItems, setCatchItems] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [gameTimer, setGameTimer] = useState(30);
  const [gameActive, setGameActive] = useState(false);

  const moduleGames = citiGamesData[moduleId as keyof typeof citiGamesData];

  // Add safety check for module games
  if (!moduleGames) {
    return (
      <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Games Not Available</h2>
        <p className="text-gray-700 mb-4">Knowledge games for module "{moduleId}" are not yet configured.</p>
        <p className="text-sm text-gray-600">Please contact your administrator to add games for this module.</p>
      </div>
    );
  }

  const startTrivia = () => {
    if (!moduleGames?.trivia || moduleGames.trivia.length === 0) {
      alert('Trivia questions not available for this module');
      return;
    }
    setActiveGame('trivia');
    setCurrentQuestion(0);
    setGameScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  const startMemoryGame = () => {
    if (!moduleGames?.memoryGame || moduleGames.memoryGame.length === 0) {
      alert('Memory game cards not available for this module');
      return;
    }
    setActiveGame('memory');
    setGameScore(0);
    setFlippedCards([]);
    setMatchedCards([]);
    
    const cards = [...moduleGames.memoryGame, ...moduleGames.memoryGame]
      .map((item, index) => ({ ...item, id: index, type: index < moduleGames.memoryGame.length ? 'term' : 'definition' }))
      .sort(() => Math.random() - 0.5);
    setMemoryCards(cards);
  };

  const startCatchGame = () => {
    if (!moduleGames?.catchTheEgg || !moduleGames.catchTheEgg.correctItems || !moduleGames.catchTheEgg.wrongItems) {
      alert('Catch game items not available for this module');
      return;
    }
    setActiveGame('catch');
    setScore(0);
    setGameTimer(30);
    setGameActive(true);
    generateCatchItems();

    const timer = setInterval(() => {
      setGameTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameActive(false);
          onGameComplete(score, 'catch');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const generateCatchItems = () => {
    const allItems = [...moduleGames.catchTheEgg.correctItems, ...moduleGames.catchTheEgg.wrongItems];
    const items = allItems.map((item, index) => ({
      id: index,
      text: item,
      isCorrect: moduleGames.catchTheEgg.correctItems.includes(item),
      x: Math.random() * 600,
      y: -50,
      speed: Math.random() * 2 + 1
    }));
    setCatchItems(items);
  };

  const handleTriviaAnswer = (answerIndex: number) => {
    if (!moduleGames?.trivia || !moduleGames.trivia[currentQuestion]) {
      console.error('Trivia data not available');
      return;
    }
    
    setSelectedAnswer(answerIndex);
    const question = moduleGames.trivia[currentQuestion];
    let newScore = gameScore;
    
    if (answerIndex === question.correct) {
      newScore = gameScore + question.points;
      setGameScore(newScore);
    }
    
    setTimeout(() => {
      if (currentQuestion < moduleGames.trivia.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
        onGameComplete(newScore, 'trivia');
      }
    }, 1500);
  };

  const handleMemoryCardClick = (cardIndex: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardIndex) || matchedCards.includes(cardIndex)) {
      return;
    }

    const newFlipped = [...flippedCards, cardIndex];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const firstCard = memoryCards[first];
      const secondCard = memoryCards[second];

      if ((firstCard.type === 'term' && secondCard.type === 'definition' && firstCard.term === secondCard.term) ||
          (firstCard.type === 'definition' && secondCard.type === 'term' && firstCard.term === secondCard.term)) {
        setMatchedCards(prev => [...prev, first, second]);
        setGameScore(prev => prev + 50);
      }

      setTimeout(() => setFlippedCards([]), 1000);
    }
  };

  const handleCatchItem = (itemId: number, isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 10);
    } else {
      setScore(prev => Math.max(0, prev - 5));
    }
    setCatchItems(prev => prev.filter(item => item.id !== itemId));
  };

  if (!activeGame) {
    return (
      <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          🎮 Citi Knowledge Games & Challenges
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div 
            onClick={startTrivia}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            <div className="text-4xl mb-4 text-center">🧠</div>
            <h3 className="text-xl font-bold mb-2">Knowledge Quiz</h3>
            <p className="text-blue-100 text-sm">Test your understanding with module-specific questions</p>
            <div className="mt-4 bg-blue-400 rounded px-3 py-1 text-sm">
              Up to 75 points
            </div>
          </div>

          <div 
            onClick={startMemoryGame}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            <div className="text-4xl mb-4 text-center">🧩</div>
            <h3 className="text-xl font-bold mb-2">Memory Match</h3>
            <p className="text-green-100 text-sm">Match terms with their definitions</p>
            <div className="mt-4 bg-green-400 rounded px-3 py-1 text-sm">
              Up to 200 points
            </div>
          </div>

          <div 
            onClick={startCatchGame}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            <div className="text-4xl mb-4 text-center">🥚</div>
            <h3 className="text-xl font-bold mb-2">Catch the Knowledge</h3>
            <p className="text-orange-100 text-sm">Catch correct concepts, avoid wrong ones</p>
            <div className="mt-4 bg-orange-400 rounded px-3 py-1 text-sm">
              Time Challenge
            </div>
          </div>
        </div>

        {/* Citi Values Section */}
        <div className="bg-white rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">💎</span>
            Citi Core Values
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {citiValues.map((value, index) => (
              <div key={index} className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-bold text-blue-900">{value.value}</h4>
                <p className="text-blue-700 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Citi History Section */}
        <div className="bg-white rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">📚</span>
            Citi Historical Milestones
          </h3>
          <div className="space-y-4">
            {citiHistory.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="bg-blue-500 text-white rounded-full w-16 h-8 flex items-center justify-center text-sm font-bold">
                  {item.year}
                </div>
                <div className="flex-1 text-gray-700">{item.event}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Trivia Game Render
  if (activeGame === 'trivia') {
    if (showResult) {
      return (
        <div className="bg-white rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">🎉 Quiz Complete!</h2>
          <div className="text-6xl mb-4">🏆</div>
          <p className="text-xl mb-4">Final Score: {gameScore} points</p>
          <button 
            onClick={() => setActiveGame(null)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Play Another Game
          </button>
        </div>
      );
    }

    const question = moduleGames.trivia[currentQuestion];
    
    return (
      <div className="bg-white rounded-xl p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Knowledge Quiz</h2>
            <div className="flex items-center space-x-4">
              <div className="text-lg font-semibold">Score: {gameScore}</div>
              <button
                onClick={() => setActiveGame(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / moduleGames.trivia.length) * 100}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Question {currentQuestion + 1} of {moduleGames.trivia.length}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl mb-6">{question.question}</h3>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleTriviaAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 ${
                  selectedAnswer === null
                    ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    : selectedAnswer === index
                    ? index === question.correct
                      ? 'border-green-500 bg-green-100'
                      : 'border-red-500 bg-red-100'
                    : index === question.correct
                    ? 'border-green-500 bg-green-100'
                    : 'border-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Memory Game Render
  if (activeGame === 'memory') {
    return (
      <div className="bg-white rounded-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Memory Match Game</h2>
          <div className="flex items-center space-x-4">
            <div className="text-lg font-semibold">Score: {gameScore}</div>
            <button
              onClick={() => setActiveGame(null)}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {memoryCards.map((card, index) => (
            <div
              key={index}
              onClick={() => handleMemoryCardClick(index)}
              className={`aspect-square p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                flippedCards.includes(index) || matchedCards.includes(index)
                  ? 'bg-blue-100 border-blue-500'
                  : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
              }`}
            >
              <div className="h-full flex items-center justify-center text-center">
                {flippedCards.includes(index) || matchedCards.includes(index) ? (
                  <div className="text-sm">
                    <div className="font-bold">{card.type === 'term' ? card.term : 'Definition'}</div>
                    {card.type === 'definition' && <div className="text-xs mt-1">{card.definition}</div>}
                  </div>
                ) : (
                  <div className="text-2xl">🎴</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {matchedCards.length === memoryCards.length && (
          <div className="mt-8 text-center">
            <h3 className="text-2xl font-bold mb-4">🎉 Congratulations!</h3>
            <p className="text-lg mb-4">You matched all pairs! Score: {gameScore}</p>
            <button 
              onClick={() => setActiveGame(null)}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
            >
              Play Another Game
            </button>
          </div>
        )}
      </div>
    );
  }

  // Catch Game Render
  if (activeGame === 'catch') {
    return (
      <div className="bg-white rounded-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Catch the Knowledge</h2>
          <div className="flex items-center space-x-4">
            <div className="text-lg font-semibold">Score: {score}</div>
            <div className="text-lg font-semibold">Time: {gameTimer}s</div>
            <button
              onClick={() => setActiveGame(null)}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="relative bg-blue-50 rounded-lg h-96 overflow-hidden">
          {catchItems.map(item => (
            <div
              key={item.id}
              onClick={() => handleCatchItem(item.id, item.isCorrect)}
              className={`absolute cursor-pointer p-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                item.isCorrect
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
                transform: `translateY(${item.y + (30 - gameTimer) * item.speed * 10}px)`
              }}
            >
              {item.text}
            </div>
          ))}
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-600">
            <div className="text-center">
              <div className="text-sm">Catch the correct concepts!</div>
              <div className="text-xs">Green = Good, Red = Bad</div>
            </div>
          </div>
        </div>

        {!gameActive && (
          <div className="mt-6 text-center">
            <h3 className="text-2xl font-bold mb-4">🎮 Game Over!</h3>
            <p className="text-lg mb-4">Final Score: {score} points</p>
            <button 
              onClick={() => setActiveGame(null)}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
            >
              Play Another Game
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
}