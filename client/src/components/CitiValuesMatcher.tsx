import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ValuePair {
  id: number;
  value: string;
  scenario: string;
}

const citiValues: ValuePair[] = [
  {
    id: 1,
    value: "Responsibility",
    scenario: "Taking ownership of mistakes and working to make things right"
  },
  {
    id: 2,
    value: "Ingenuity",
    scenario: "Finding creative solutions to complex financial challenges"
  },
  {
    id: 3,
    value: "Simplicity",
    scenario: "Making banking processes easy and transparent for clients"
  },
  {
    id: 4,
    value: "Leadership",
    scenario: "Guiding teams through difficult market conditions"
  },
  {
    id: 5,
    value: "Excellence",
    scenario: "Delivering the highest quality of service in every interaction"
  }
];

interface CitiValuesMatcherProps {
  onComplete: (score: number) => void;
  onClose: () => void;
}

export default function CitiValuesMatcher({ onComplete, onClose }: CitiValuesMatcherProps) {
  const [shuffledValues, setShuffledValues] = useState<string[]>([]);
  const [shuffledScenarios, setShuffledScenarios] = useState<string[]>([]);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [matches, setMatches] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    const values = citiValues.map(v => v.value);
    const scenarios = citiValues.map(v => v.scenario);
    
    setShuffledValues(shuffleArray([...values]));
    setShuffledScenarios(shuffleArray([...scenarios]));
  }, []);

  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleValueClick = (value: string) => {
    if (matches.includes(value)) return;
    setSelectedValue(value);
    checkMatch(value, selectedScenario);
  };

  const handleScenarioClick = (scenario: string) => {
    if (matches.some(v => citiValues.find(cv => cv.value === v)?.scenario === scenario)) return;
    setSelectedScenario(scenario);
    checkMatch(selectedValue, scenario);
  };

  const checkMatch = (value: string | null, scenario: string | null) => {
    if (!value || !scenario) return;

    const valuePair = citiValues.find(cv => cv.value === value);
    if (valuePair && valuePair.scenario === scenario) {
      setMatches([...matches, value]);
      setScore(score + 30);
      setSelectedValue(null);
      setSelectedScenario(null);
      
      if (matches.length + 1 === citiValues.length) {
        setGameComplete(true);
      }
    } else {
      // Wrong match - reset selections
      setTimeout(() => {
        setSelectedValue(null);
        setSelectedScenario(null);
      }, 1000);
    }
  };

  const handleComplete = () => {
    const finalScore = Math.round((matches.length / citiValues.length) * 100);
    onComplete(finalScore);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4 h-[80vh] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Citi Values Memory Match</CardTitle>
            <Button variant="secondary" onClick={onClose}>Close</Button>
          </div>
          <p className="text-red-100">Match Citi's core values with their corresponding scenarios</p>
          <div className="text-lg font-semibold">Score: {score} | Matches: {matches.length}/{citiValues.length}</div>
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto">
          {gameComplete ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold text-green-600 mb-2">Congratulations!</h3>
              <p className="text-xl mb-4">You've successfully matched all Citi values!</p>
              <div className="text-2xl font-bold text-blue-600 mb-6">Final Score: {Math.round((matches.length / citiValues.length) * 100)}%</div>
              <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                Complete Game
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Values Column */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-center">Citi Values</h3>
                <div className="space-y-3">
                  {shuffledValues.map((value, index) => (
                    <Button
                      key={index}
                      onClick={() => handleValueClick(value)}
                      disabled={matches.includes(value)}
                      className={`w-full p-4 text-left h-auto ${
                        matches.includes(value) 
                          ? 'bg-green-500 text-white' 
                          : selectedValue === value 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                    >
                      <div className="font-semibold">{value}</div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Scenarios Column */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-center">Scenarios</h3>
                <div className="space-y-3">
                  {shuffledScenarios.map((scenario, index) => {
                    const isMatched = matches.some(v => citiValues.find(cv => cv.value === v)?.scenario === scenario);
                    return (
                      <Button
                        key={index}
                        onClick={() => handleScenarioClick(scenario)}
                        disabled={isMatched}
                        className={`w-full p-4 text-left h-auto ${
                          isMatched 
                            ? 'bg-green-500 text-white' 
                            : selectedScenario === scenario 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                      >
                        <div className="text-sm">{scenario}</div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}