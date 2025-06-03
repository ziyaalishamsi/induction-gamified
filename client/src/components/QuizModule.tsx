import { useState } from "react";
import { useGameState } from "@/contexts/GameStateContext";
import { Button } from "@/components/ui/button";

interface QuizModuleProps {
  quizId: string;
  onClose?: () => void;
  onComplete?: (score: number, passed: boolean) => void;
}

export default function QuizModule({ quizId, onClose, onComplete }: QuizModuleProps) {
  const { quizzes, completeQuiz, userProgress } = useGameState();
  
  const quiz = quizzes.find(q => q.id === quizId) || quizzes[0];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<(number | null)[]>(
    Array(quiz.questions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  
  const handleOptionSelect = (optionIndex: number) => {
    if (submitted) return;
    
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = optionIndex;
    setSelectedOptions(newSelectedOptions);
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate score and complete quiz
      const correctAnswers = selectedOptions.reduce((count: number, selected, index) => {
        if (selected === quiz.questions[index].correctOption) {
          return (count || 0) + 1;
        }
        return count || 0;
      }, 0);
      
      const finalScore = Math.round(((correctAnswers || 0) / quiz.questions.length) * 100);
      setScore(finalScore);
      completeQuiz(quiz.id, finalScore);
      setSubmitted(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const isQuizCompleted = userProgress.completedQuizzes.includes(quiz.id);
  const isOptionSelected = selectedOptions[currentQuestionIndex] !== null;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[hsl(213,56%,24%)]">Knowledge Check</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
            aria-label="Close quiz"
          >
            ✕
          </button>
        )}
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        {isQuizCompleted && !submitted ? (
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Quiz Already Completed</h3>
            <p className="text-gray-600 mb-4">You've already completed this quiz. Great job!</p>
          </div>
        ) : submitted ? (
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-[hsl(207,90%,35%)] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Quiz Completed!</h3>
            <p className="text-gray-600 mb-4">You scored {score}% on this quiz.</p>
            <p className="text-gray-600 mb-4">You earned {Math.floor((score / 100) * quiz.xpReward)} XP!</p>
            <Button 
              className="bg-[hsl(207,90%,35%)] hover:bg-blue-700"
              onClick={() => setSubmitted(false)}
            >
              Review Quiz
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">{quiz.title}</h3>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">
                  Progress: {currentQuestionIndex + 1}/{quiz.questions.length}
                </span>
                <div className="w-24 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-[hsl(207,90%,35%)] rounded-full progress-bar" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium mb-3">{currentQuestion.question}</h4>
              
              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedOptions[currentQuestionIndex] === index;
                  const isCorrect = submitted && index === currentQuestion.correctOption;
                  const isIncorrect = submitted && isSelected && !isCorrect;
                  
                  let optionClass = "quiz-option p-3 border border-gray-300 rounded-lg hover:border-[hsl(207,90%,35%)] cursor-pointer";
                  
                  if (isSelected) optionClass = "quiz-option selected p-3 border border-[hsl(207,90%,35%)] rounded-lg cursor-pointer";
                  if (isCorrect && submitted) optionClass = "quiz-option correct p-3 border border-green-500 rounded-lg cursor-pointer";
                  if (isIncorrect && submitted) optionClass = "quiz-option incorrect p-3 border border-[hsl(359,84%,53%)] rounded-lg cursor-pointer";
                  
                  return (
                    <div 
                      key={index}
                      className={optionClass}
                      onClick={() => handleOptionSelect(index)}
                    >
                      <span>{option}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              
              <Button
                className="bg-[hsl(207,90%,35%)] hover:bg-blue-700"
                onClick={handleNext}
                disabled={!isOptionSelected}
              >
                {currentQuestionIndex < quiz.questions.length - 1 ? "Next Question" : "Finish Quiz"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
