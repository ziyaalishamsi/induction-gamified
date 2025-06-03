import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGameState } from "@/contexts/GameStateContext";

interface PuzzlePiece {
  id: number;
  position: { x: number; y: number };
  correctPosition: { x: number; y: number };
  isPlaced: boolean;
  content: string;
  color: string;
}

const puzzleData = {
  title: "Citi's Global Network",
  pieces: [
    { content: "Americas", color: "bg-blue-500", correctPos: { x: 0, y: 0 } },
    { content: "Europe", color: "bg-green-500", correctPos: { x: 1, y: 0 } },
    { content: "Asia Pacific", color: "bg-purple-500", correctPos: { x: 2, y: 0 } },
    { content: "Technology", color: "bg-orange-500", correctPos: { x: 0, y: 1 } },
    { content: "Innovation", color: "bg-red-500", correctPos: { x: 1, y: 1 } },
    { content: "Excellence", color: "bg-indigo-500", correctPos: { x: 2, y: 1 } },
    { content: "Diversity", color: "bg-pink-500", correctPos: { x: 0, y: 2 } },
    { content: "Integrity", color: "bg-teal-500", correctPos: { x: 1, y: 2 } },
    { content: "Leadership", color: "bg-yellow-500", correctPos: { x: 2, y: 2 } }
  ]
};

export default function CitiPuzzleGame() {
  const { completeQuiz } = useGameState();
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [draggedPiece, setDraggedPiece] = useState<PuzzlePiece | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const initializeGame = () => {
    const shuffledPieces = puzzleData.pieces.map((piece, index) => ({
      id: index,
      position: { x: Math.floor(Math.random() * 3), y: Math.floor(Math.random() * 3) },
      correctPosition: piece.correctPos,
      isPlaced: false,
      content: piece.content,
      color: piece.color
    }));

    // Ensure no pieces start in correct positions
    shuffledPieces.forEach(piece => {
      while (piece.position.x === piece.correctPosition.x && piece.position.y === piece.correctPosition.y) {
        piece.position = { x: Math.floor(Math.random() * 3), y: Math.floor(Math.random() * 3) };
      }
    });

    setPieces(shuffledPieces);
    setGameComplete(false);
    setMoves(0);
    setStartTime(new Date());
    setGameStarted(true);
  };

  const checkCompletion = (updatedPieces: PuzzlePiece[]) => {
    const allCorrect = updatedPieces.every(piece => 
      piece.position.x === piece.correctPosition.x && 
      piece.position.y === piece.correctPosition.y
    );

    if (allCorrect) {
      setGameComplete(true);
      const timeBonus = Math.max(0, 300 - Math.floor((Date.now() - startTime!.getTime()) / 1000));
      const moveBonus = Math.max(0, 50 - moves);
      const totalScore = 100 + timeBonus + moveBonus;
      completeQuiz("puzzle-game", Math.min(totalScore, 200));
    }
  };

  const handleDragStart = (piece: PuzzlePiece) => {
    setDraggedPiece(piece);
  };

  const handleDrop = (targetX: number, targetY: number) => {
    if (!draggedPiece) return;

    const updatedPieces = pieces.map(piece => {
      if (piece.id === draggedPiece.id) {
        return { ...piece, position: { x: targetX, y: targetY } };
      }
      // Handle piece swapping if target position is occupied
      if (piece.position.x === targetX && piece.position.y === targetY) {
        return { ...piece, position: draggedPiece.position };
      }
      return piece;
    });

    setPieces(updatedPieces);
    setMoves(prev => prev + 1);
    setDraggedPiece(null);
    checkCompletion(updatedPieces);
  };

  const getPieceAtPosition = (x: number, y: number) => {
    return pieces.find(piece => piece.position.x === x && piece.position.y === y);
  };

  const formatTime = () => {
    if (!startTime) return "0:00";
    const seconds = Math.floor((Date.now() - startTime.getTime()) / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!gameStarted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-[hsl(213,56%,24%)]">
            Citi Network Puzzle
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-6">
            <i className="fas fa-puzzle-piece text-4xl text-[hsl(207,90%,35%)] mb-4"></i>
            <p className="text-lg mb-4">Arrange the pieces to complete Citi's global picture!</p>
            <p className="text-sm text-gray-600 mb-6">
              Drag and drop pieces to their correct positions. Complete faster with fewer moves for bonus points!
            </p>
          </div>
          <Button onClick={initializeGame} className="bg-[hsl(207,90%,35%)] hover:bg-blue-700">
            Start Puzzle
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameComplete) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-[hsl(213,56%,24%)]">Puzzle Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="w-20 h-20 bg-[hsl(207,90%,35%)] rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-trophy text-white text-3xl"></i>
          </div>
          <h3 className="text-2xl font-semibold mb-2">Excellent Work!</h3>
          <p className="text-gray-600 mb-4">
            You completed the puzzle in {moves} moves and {formatTime()}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            You've learned about Citi's global reach and core values!
          </p>
          <Button onClick={initializeGame} className="bg-[hsl(207,90%,35%)] hover:bg-blue-700">
            Play Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-[hsl(213,56%,24%)]">{puzzleData.title}</CardTitle>
          <div className="flex gap-4 text-sm">
            <Badge variant="outline">Moves: {moves}</Badge>
            <Badge variant="outline">Time: {formatTime()}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 mb-6 bg-gray-100 p-4 rounded-lg">
          {Array.from({ length: 9 }, (_, index) => {
            const x = index % 3;
            const y = Math.floor(index / 3);
            const piece = getPieceAtPosition(x, y);
            
            return (
              <div
                key={`${x}-${y}`}
                className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative cursor-pointer hover:border-[hsl(207,90%,35%)] transition-colors"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(x, y);
                }}
              >
                {piece && (
                  <div
                    className={`w-full h-full ${piece.color} rounded-lg flex items-center justify-center text-white font-semibold text-sm cursor-move shadow-lg hover:shadow-xl transition-shadow`}
                    draggable
                    onDragStart={() => handleDragStart(piece)}
                  >
                    {piece.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Drag pieces to arrange them correctly. The puzzle represents Citi's global presence and values.
          </p>
          <div className="grid grid-cols-3 gap-1 text-xs text-gray-500 max-w-md mx-auto">
            <div>Global Regions</div>
            <div>→</div>
            <div>Innovation Focus</div>
            <div>Core Values</div>
            <div>→</div>
            <div>Leadership</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}