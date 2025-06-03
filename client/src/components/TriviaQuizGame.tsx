import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useGameState } from "@/contexts/GameStateContext";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  explanation: string;
}

const citiQuestions: Question[] = [
  {
    id: 1,
    question: "What year was Citibank founded?",
    options: ["1812", "1897", "1901", "1920"],
    correctAnswer: 0,
    category: "History",
    difficulty: "Medium",
    explanation: "Citibank was founded in 1812 as the City Bank of New York."
  },
  {
    id: 2,
    question: "Which of these is a core Citi value?",
    options: ["Speed", "Innovation", "Profit", "Growth"],
    correctAnswer: 1,
    category: "Values",
    difficulty: "Easy",
    explanation: "Innovation is one of Citi's core values, driving our commitment to finding new solutions."
  },
  {
    id: 3,
    question: "Citi operates in approximately how many countries?",
    options: ["50", "80", "100", "160"],
    correctAnswer: 3,
    category: "Global Reach",
    difficulty: "Hard",
    explanation: "Citi has operations in approximately 160 countries and jurisdictions worldwide."
  },
  {
    id: 4,
    question: "What does 'ESG' stand for in Citi's sustainability efforts?",
    options: ["Economic Security Goals", "Environmental, Social, and Governance", "Employee Safety Guidelines", "Executive Strategy Group"],
    correctAnswer: 1,
    category: "Sustainability",
    difficulty: "Medium",
    explanation: "ESG stands for Environmental, Social, and Governance - key pillars of sustainable business practices."
  },
  {
    id: 5,
    question: "Which technology initiative helps Citi serve customers better?",
    options: ["Digital Banking", "Artificial Intelligence", "Cloud Computing", "All of the above"],
    correctAnswer: 3,
    category: "Technology",
    difficulty: "Easy",
    explanation: "Citi leverages digital banking, AI, cloud computing, and many other technologies to enhance customer experience."
  }
];

export default function TriviaQuizGame() {
  const { completeQuiz } = useGameState();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const startGame = () => {
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setGameComplete(false);
    setShowExplanation(false);
    setTimeLeft(30);
    setAnswers([]);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0 && !showExplanation && !gameComplete) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, timeLeft, showExplanation, gameComplete]);

  const handleTimeUp = () => {
    setAnswers(prev => [...prev, false]);
    setShowExplanation(true);
    setTimeout(() => {
      nextQuestion();
    }, 3000);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || showExplanation) return;
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === citiQuestions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      const points = citiQuestions[currentQuestion].difficulty === "Easy" ? 10 : 
                    citiQuestions[currentQuestion].difficulty === "Medium" ? 15 : 20;
      setScore(prev => prev + points + Math.max(0, timeLeft - 10));
    }
    
    setAnswers(prev => [...prev, isCorrect]);
    setShowExplanation(true);
    
    setTimeout(() => {
      nextQuestion();
    }, 3000);
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 >= citiQuestions.length) {
      setGameComplete(true);
      const finalScore = Math.round((score / (citiQuestions.length * 25)) * 100);
      completeQuiz("trivia-quiz", finalScore);
      return;
    }
    
    setCurrentQuestion(prev => prev + 1);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setTimeLeft(30);
  };

  const progress = ((currentQuestion + 1) / citiQuestions.length) * 100;
  const question = citiQuestions[currentQuestion];

  if (!gameStarted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-[hsl(213,56%,24%)]">
            Citi Knowledge Trivia
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-6">
            <i className="fas fa-brain text-4xl text-[hsl(207,90%,35%)] mb-4"></i>
            <p className="text-lg mb-4">Test your knowledge about Citi!</p>
            <p className="text-sm text-gray-600 mb-6">
              Answer {citiQuestions.length} questions about Citi's history, values, and operations.
              You have 30 seconds per question.
            </p>
          </div>
          <Button onClick={startGame} className="bg-[hsl(207,90%,35%)] hover:bg-blue-700">
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameComplete) {
    const correctAnswers = answers.filter(Boolean).length;
    const percentage = Math.round((correctAnswers / citiQuestions.length) * 100);
    
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-[hsl(213,56%,24%)]">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="w-20 h-20 bg-[hsl(207,90%,35%)] rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-graduation-cap text-white text-3xl"></i>
          </div>
          <h3 className="text-2xl font-semibold mb-2">Well Done!</h3>
          <p className="text-lg mb-4">
            Score: {score} points ({percentage}%)
          </p>
          <p className="text-gray-600 mb-6">
            You answered {correctAnswers} out of {citiQuestions.length} questions correctly!
          </p>
          <Button onClick={startGame} className="bg-[hsl(207,90%,35%)] hover:bg-blue-700">
            Retake Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-[hsl(213,56%,24%)]">Question {currentQuestion + 1}</CardTitle>
          <div className="flex gap-2">
            <Badge className="bg-[hsl(207,90%,35%)]">{question.category}</Badge>
            <Badge variant="outline">{question.difficulty}</Badge>
          </div>
        </div>
        <Progress value={progress} className="mb-4" />
        <div className="flex justify-between text-sm text-gray-600">
          <span>Score: {score}</span>
          <span className={timeLeft <= 10 ? "text-red-600 font-semibold" : ""}>
            Time: {timeLeft}s
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">{question.question}</h3>
          
          <div className="space-y-3">
            {question.options.map((option, index) => {
              let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all ";
              
              if (showExplanation) {
                if (index === question.correctAnswer) {
                  buttonClass += "border-green-500 bg-green-50 text-green-800";
                } else if (index === selectedAnswer && index !== question.correctAnswer) {
                  buttonClass += "border-red-500 bg-red-50 text-red-800";
                } else {
                  buttonClass += "border-gray-200 text-gray-500";
                }
              } else {
                buttonClass += selectedAnswer === index 
                  ? "border-[hsl(207,90%,35%)] bg-[hsl(207,90%,35%)]/10" 
                  : "border-gray-200 hover:border-[hsl(207,90%,35%)]";
              }
              
              return (
                <button
                  key={index}
                  className={buttonClass}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null || showExplanation}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {showExplanation && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
            <p className="text-blue-700">{question.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}