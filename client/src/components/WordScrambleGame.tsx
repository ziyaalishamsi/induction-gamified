import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGameState } from "@/contexts/GameStateContext";

interface WordPuzzle {
  word: string;
  hint: string;
  category: string;
  scrambled: string;
}

const citiTerms: WordPuzzle[] = [
  { word: "INNOVATION", hint: "Creating new solutions and ideas", category: "Values", scrambled: "" },
  { word: "EXCELLENCE", hint: "The highest standard of performance", category: "Values", scrambled: "" },
  { word: "INTEGRITY", hint: "Being honest and having strong moral principles", category: "Values", scrambled: "" },
  { word: "DIVERSITY", hint: "Variety and inclusion of different perspectives", category: "Culture", scrambled: "" },
  { word: "BANKING", hint: "Core business of financial services", category: "Business", scrambled: "" },
  { word: "TECHNOLOGY", hint: "Digital tools and systems we use", category: "Business", scrambled: "" },
  { word: "CUSTOMER", hint: "The people we serve", category: "Focus", scrambled: "" },
  { word: "GLOBAL", hint: "Worldwide presence and reach", category: "Scope", scrambled: "" }
];

export default function WordScrambleGame() {
  const { completeQuiz } = useGameState();
  const [currentPuzzle, setCurrentPuzzle] = useState<WordPuzzle | null>(null);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [feedback, setFeedback] = useState("");

  const scrambleWord = (word: string): string => {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join('');
  };

  const initializeGame = () => {
    const puzzlesWithScrambled = citiTerms.map(puzzle => ({
      ...puzzle,
      scrambled: scrambleWord(puzzle.word)
    }));
    
    setCurrentPuzzle(puzzlesWithScrambled[0]);
    setCurrentRound(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setGameComplete(false);
    setGameStarted(false);
    setUserInput("");
    setFeedback("");
  };

  const startGame = () => {
    setGameStarted(true);
    initializeGame();
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0 && !gameComplete) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameComplete(true);
            completeQuiz("word-scramble", score);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, timeLeft, gameComplete, score, completeQuiz]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPuzzle || !userInput.trim()) return;

    const isCorrect = userInput.toUpperCase() === currentPuzzle.word;
    
    if (isCorrect) {
      const points = 10 + (streak * 2);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setFeedback(`Correct! +${points} points`);
      
      setTimeout(() => {
        nextRound();
      }, 1500);
    } else {
      setStreak(0);
      setFeedback(`Try again! The word was: ${currentPuzzle.word}`);
      
      setTimeout(() => {
        nextRound();
      }, 2000);
    }
    
    setUserInput("");
  };

  const nextRound = () => {
    const nextRoundIndex = currentRound + 1;
    
    if (nextRoundIndex >= citiTerms.length) {
      setGameComplete(true);
      completeQuiz("word-scramble", score);
      return;
    }

    const nextPuzzle = {
      ...citiTerms[nextRoundIndex],
      scrambled: scrambleWord(citiTerms[nextRoundIndex].word)
    };
    
    setCurrentPuzzle(nextPuzzle);
    setCurrentRound(nextRoundIndex);
    setFeedback("");
  };

  const skipWord = () => {
    setStreak(0);
    setFeedback(`Skipped: ${currentPuzzle?.word}`);
    setTimeout(() => {
      nextRound();
    }, 1500);
  };

  if (!gameStarted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-[hsl(213,56%,24%)]">
            Citi Word Scramble Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-6">
            <i className="fas fa-random text-4xl text-[hsl(207,90%,35%)] mb-4"></i>
            <p className="text-lg mb-4">Unscramble Citi-related words and terms!</p>
            <p className="text-sm text-gray-600 mb-6">
              You have 60 seconds to solve as many words as possible. 
              Build streaks for bonus points!
            </p>
          </div>
          <Button onClick={startGame} className="bg-[hsl(207,90%,35%)] hover:bg-blue-700">
            Start Challenge
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-[hsl(213,56%,24%)]">Word Scramble</CardTitle>
          <div className="flex gap-4 text-sm">
            <Badge variant="outline">Score: {score}</Badge>
            <Badge variant="outline">Streak: {streak}</Badge>
            <Badge variant={timeLeft <= 10 ? "destructive" : "outline"}>
              Time: {timeLeft}s
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {gameComplete ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[hsl(207,90%,35%)] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-award text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Time's Up!</h3>
            <p className="text-gray-600 mb-4">
              Final Score: {score} points
            </p>
            <p className="text-sm text-gray-500 mb-6">
              You completed {currentRound} out of {citiTerms.length} words
            </p>
            <Button onClick={initializeGame} className="bg-[hsl(207,90%,35%)] hover:bg-blue-700">
              Play Again
            </Button>
          </div>
        ) : currentPuzzle ? (
          <div className="space-y-6">
            <div className="text-center">
              <Badge className="mb-4 bg-[hsl(207,90%,35%)]">{currentPuzzle.category}</Badge>
              <div className="text-3xl font-bold text-[hsl(213,56%,24%)] mb-2 tracking-widest">
                {currentPuzzle.scrambled}
              </div>
              <p className="text-gray-600 text-sm">
                Hint: {currentPuzzle.hint}
              </p>
            </div>

            {feedback && (
              <div className={`text-center p-3 rounded ${
                feedback.includes('Correct') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {feedback}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value.toUpperCase())}
                placeholder="Enter your answer..."
                className="text-center text-lg"
                disabled={!!feedback}
              />
              <div className="flex gap-3 justify-center">
                <Button 
                  type="submit" 
                  className="bg-[hsl(207,90%,35%)] hover:bg-blue-700"
                  disabled={!userInput.trim() || !!feedback}
                >
                  Submit
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={skipWord}
                  disabled={!!feedback}
                >
                  Skip
                </Button>
              </div>
            </form>

            <div className="text-center text-sm text-gray-500">
              Round {currentRound + 1} of {citiTerms.length}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}