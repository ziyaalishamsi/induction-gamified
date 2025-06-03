import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BingoItem {
  id: number;
  text: string;
  category: string;
}

const benefitsData: BingoItem[] = [
  { id: 1, text: "Health Insurance", category: "Health" },
  { id: 2, text: "Dental Coverage", category: "Health" },
  { id: 3, text: "Vision Insurance", category: "Health" },
  { id: 4, text: "401(k) Matching", category: "Retirement" },
  { id: 5, text: "Pension Plan", category: "Retirement" },
  { id: 6, text: "Paid Time Off", category: "Time Off" },
  { id: 7, text: "Sick Leave", category: "Time Off" },
  { id: 8, text: "Parental Leave", category: "Family" },
  { id: 9, text: "Adoption Assistance", category: "Family" },
  { id: 10, text: "Tuition Reimbursement", category: "Education" },
  { id: 11, text: "Professional Development", category: "Education" },
  { id: 12, text: "Employee Assistance Program", category: "Wellness" },
  { id: 13, text: "Fitness Center Access", category: "Wellness" },
  { id: 14, text: "Life Insurance", category: "Insurance" },
  { id: 15, text: "Disability Insurance", category: "Insurance" },
  { id: 16, text: "Employee Discounts", category: "Perks" },
  { id: 17, text: "Transportation Benefits", category: "Perks" },
  { id: 18, text: "Flexible Work Arrangements", category: "Work-Life" },
  { id: 19, text: "Mental Health Support", category: "Wellness" },
  { id: 20, text: "Financial Planning Services", category: "Financial" },
  { id: 21, text: "Stock Purchase Plan", category: "Financial" },
  { id: 22, text: "Volunteer Time Off", category: "Community" },
  { id: 23, text: "Charitable Giving Match", category: "Community" },
  { id: 24, text: "Career Coaching", category: "Development" },
  { id: 25, text: "Leadership Training", category: "Development" }
];

interface EmployeeBenefitsBingoProps {
  onComplete: (score: number) => void;
  onClose: () => void;
}

export default function EmployeeBenefitsBingo({ onComplete, onClose }: EmployeeBenefitsBingoProps) {
  const [bingoCard, setBingoCard] = useState<BingoItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<BingoItem | null>(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    // Create a 5x5 bingo card with random benefits
    const shuffled = [...benefitsData].sort(() => Math.random() - 0.5);
    setBingoCard(shuffled.slice(0, 25));
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const availableItems = bingoCard.filter(item => !selectedItems.includes(item.id));
    if (availableItems.length > 0) {
      const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
      setCurrentQuestion(randomItem);
    }
  };

  const handleItemClick = (item: BingoItem) => {
    if (selectedItems.includes(item.id)) return;

    if (currentQuestion && item.id === currentQuestion.id) {
      // Correct answer
      setSelectedItems([...selectedItems, item.id]);
      setScore(score + 20);
      setFeedback("Correct! Great job identifying this Citi benefit.");
      setQuestionsAnswered(questionsAnswered + 1);
      
      // Check for bingo
      const newSelected = [...selectedItems, item.id];
      if (checkForBingo(newSelected)) {
        setGameComplete(true);
        setFeedback("BINGO! You've completed a line and learned about Citi's amazing benefits!");
      } else if (questionsAnswered + 1 >= 15) {
        setGameComplete(true);
        setFeedback("Great job! You've learned about many of Citi's employee benefits.");
      } else {
        setTimeout(() => {
          generateQuestion();
          setFeedback("");
        }, 2000);
      }
    } else {
      // Wrong answer
      setFeedback("Not quite right. Try again!");
      setTimeout(() => setFeedback(""), 2000);
    }
  };

  const checkForBingo = (selected: number[]): boolean => {
    const cardSize = 5;
    
    // Check rows
    for (let row = 0; row < cardSize; row++) {
      let rowComplete = true;
      for (let col = 0; col < cardSize; col++) {
        const index = row * cardSize + col;
        if (!selected.includes(bingoCard[index]?.id)) {
          rowComplete = false;
          break;
        }
      }
      if (rowComplete) return true;
    }

    // Check columns
    for (let col = 0; col < cardSize; col++) {
      let colComplete = true;
      for (let row = 0; row < cardSize; row++) {
        const index = row * cardSize + col;
        if (!selected.includes(bingoCard[index]?.id)) {
          colComplete = false;
          break;
        }
      }
      if (colComplete) return true;
    }

    // Check diagonals
    let diag1Complete = true;
    let diag2Complete = true;
    for (let i = 0; i < cardSize; i++) {
      if (!selected.includes(bingoCard[i * cardSize + i]?.id)) {
        diag1Complete = false;
      }
      if (!selected.includes(bingoCard[i * cardSize + (cardSize - 1 - i)]?.id)) {
        diag2Complete = false;
      }
    }

    return diag1Complete || diag2Complete;
  };

  const handleComplete = () => {
    const finalScore = Math.round((selectedItems.length / 25) * 100);
    onComplete(finalScore);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl mx-4 h-[80vh] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Employee Benefits Bingo</CardTitle>
            <Button variant="secondary" onClick={onClose}>Close</Button>
          </div>
          <p className="text-green-100">Learn about Citi's comprehensive employee benefits package</p>
          <div className="text-lg font-semibold">Score: {score} | Items Found: {selectedItems.length}/25</div>
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto">
          {gameComplete ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold text-green-600 mb-2">Congratulations!</h3>
              <p className="text-xl mb-4">{feedback}</p>
              <div className="text-2xl font-bold text-blue-600 mb-6">Final Score: {Math.round((selectedItems.length / 25) * 100)}%</div>
              <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                Complete Game
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Current Question */}
              {currentQuestion && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">Find this benefit on your bingo card:</h3>
                  <p className="text-xl font-semibold text-blue-800">{currentQuestion.text}</p>
                  <p className="text-sm text-blue-600 mt-1">Category: {currentQuestion.category}</p>
                </div>
              )}

              {/* Feedback */}
              {feedback && (
                <div className={`text-center p-3 rounded-lg ${
                  feedback.includes("Correct") || feedback.includes("BINGO") 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {feedback}
                </div>
              )}

              {/* Bingo Card */}
              <div className="grid grid-cols-5 gap-2 max-w-2xl mx-auto">
                {bingoCard.map((item, index) => (
                  <Button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`h-20 text-xs p-2 ${
                      selectedItems.includes(item.id)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold">{item.text}</div>
                      <div className="text-xs opacity-70">{item.category}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}