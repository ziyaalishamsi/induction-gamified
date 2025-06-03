import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameState } from "@/contexts/GameStateContext";

interface MemoryCard {
  id: number;
  value: string;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const citiValues = [
  { value: "Leadership", icon: "crown" },
  { value: "Innovation", icon: "lightbulb" },
  { value: "Excellence", icon: "star" },
  { value: "Integrity", icon: "shield-check" },
  { value: "Diversity", icon: "users" },
  { value: "Teamwork", icon: "handshake" }
];

export default function MemoryCardGame() {
  const { completeQuiz } = useGameState();
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameComplete) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameComplete]);

  const initializeGame = () => {
    const duplicatedValues = [...citiValues, ...citiValues];
    const shuffledCards = duplicatedValues
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({
        id: index,
        value: item.value,
        icon: item.icon,
        isFlipped: false,
        isMatched: false
      }));
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameComplete(false);
    setTimer(0);
    setGameStarted(false);
  };

  const handleCardClick = (cardId: number) => {
    if (!gameStarted) setGameStarted(true);
    
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardId)) return;
    if (cards[cardId].isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards[firstId];
      const secondCard = cards[secondId];

      if (firstCard.value === secondCard.value) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, isMatched: true } 
              : card
          ));
          setMatchedPairs(prev => prev + 1);
          setFlippedCards([]);
          
          // Check if game is complete
          if (matchedPairs + 1 === citiValues.length) {
            setGameComplete(true);
            const score = Math.max(100 - moves * 2 - Math.floor(timer / 10), 50);
            completeQuiz("memory-game", score);
          }
        }, 600);
      } else {
        // No match - flip cards back
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, isFlipped: false } 
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-[hsl(213,56%,24%)]">
          Citi Values Memory Challenge
        </CardTitle>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Moves: {moves}</span>
          <span>Time: {formatTime(timer)}</span>
          <span>Pairs: {matchedPairs}/{citiValues.length}</span>
        </div>
      </CardHeader>
      <CardContent>
        {gameComplete ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[hsl(207,90%,35%)] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-trophy text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Congratulations! 🎉</h3>
            <p className="text-gray-600 mb-4">
              You've mastered Citi's core values in {moves} moves and {formatTime(timer)}!
            </p>
            <Button onClick={initializeGame} className="bg-[hsl(207,90%,35%)] hover:bg-blue-700">
              Play Again
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`memory-card aspect-square bg-white border-2 rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-center ${
                    card.isFlipped || card.isMatched
                      ? 'border-[hsl(207,90%,35%)] bg-[hsl(207,90%,35%)]/10'
                      : 'border-gray-300 hover:border-[hsl(207,90%,35%)] hover:shadow-md'
                  } ${card.isMatched ? 'opacity-70' : ''}`}
                  onClick={() => handleCardClick(card.id)}
                >
                  {card.isFlipped || card.isMatched ? (
                    <div className="text-center">
                      <i className={`fas fa-${card.icon} text-2xl text-[hsl(207,90%,35%)] mb-2`}></i>
                      <p className="text-xs font-medium">{card.value}</p>
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-[hsl(207,90%,35%)] rounded flex items-center justify-center">
                      <i className="fas fa-question text-white"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Match the pairs to learn about Citi's core values. Click cards to flip them!
              </p>
              {!gameStarted && (
                <p className="text-xs text-gray-500">
                  Click any card to start the timer
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}