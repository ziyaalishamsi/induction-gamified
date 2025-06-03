import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CareerPath {
  id: string;
  title: string;
  description: string;
  skills: string[];
  nextSteps: string[];
  timeframe: string;
  difficulty: 'Entry' | 'Mid' | 'Senior' | 'Executive';
}

const careerPaths: CareerPath[] = [
  {
    id: 'analyst',
    title: 'Financial Analyst',
    description: 'Analyze financial data and market trends to support business decisions',
    skills: ['Excel', 'Financial Modeling', 'Data Analysis', 'Risk Assessment'],
    nextSteps: ['Senior Analyst', 'Associate Director', 'Vice President'],
    timeframe: '2-4 years',
    difficulty: 'Entry'
  },
  {
    id: 'tech',
    title: 'Technology Specialist',
    description: 'Develop and maintain banking technology systems and applications',
    skills: ['Programming', 'System Design', 'Cybersecurity', 'Cloud Computing'],
    nextSteps: ['Senior Developer', 'Tech Lead', 'Engineering Manager'],
    timeframe: '3-5 years',
    difficulty: 'Mid'
  },
  {
    id: 'relationship',
    title: 'Relationship Manager',
    description: 'Build and maintain client relationships for institutional banking',
    skills: ['Client Management', 'Sales', 'Financial Products', 'Communication'],
    nextSteps: ['Senior RM', 'Director', 'Managing Director'],
    timeframe: '4-6 years',
    difficulty: 'Mid'
  },
  {
    id: 'risk',
    title: 'Risk Manager',
    description: 'Identify, assess and mitigate various types of financial risks',
    skills: ['Risk Modeling', 'Regulatory Knowledge', 'Analytics', 'Compliance'],
    nextSteps: ['Senior Risk Manager', 'Risk Director', 'Chief Risk Officer'],
    timeframe: '5-8 years',
    difficulty: 'Senior'
  },
  {
    id: 'operations',
    title: 'Operations Manager',
    description: 'Oversee daily banking operations and process improvements',
    skills: ['Process Management', 'Team Leadership', 'Quality Control', 'Automation'],
    nextSteps: ['Senior Operations Manager', 'VP Operations', 'COO'],
    timeframe: '4-7 years',
    difficulty: 'Senior'
  },
  {
    id: 'investment',
    title: 'Investment Banker',
    description: 'Structure and execute complex financial transactions',
    skills: ['Financial Modeling', 'M&A', 'Capital Markets', 'Client Presentation'],
    nextSteps: ['VP Investment Banking', 'Director', 'Managing Director'],
    timeframe: '6-10 years',
    difficulty: 'Executive'
  }
];

interface Question {
  id: number;
  question: string;
  options: { value: string; paths: string[] }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "What type of work environment do you prefer?",
    options: [
      { value: "Data-driven analysis and research", paths: ['analyst', 'risk'] },
      { value: "Building technology solutions", paths: ['tech'] },
      { value: "Working directly with clients", paths: ['relationship', 'investment'] },
      { value: "Managing teams and processes", paths: ['operations'] }
    ]
  },
  {
    id: 2,
    question: "Which skills are you most interested in developing?",
    options: [
      { value: "Advanced financial modeling and analytics", paths: ['analyst', 'investment', 'risk'] },
      { value: "Programming and system architecture", paths: ['tech'] },
      { value: "Sales and relationship building", paths: ['relationship'] },
      { value: "Leadership and operational excellence", paths: ['operations'] }
    ]
  },
  {
    id: 3,
    question: "What's your preferred career timeline?",
    options: [
      { value: "Fast-track advancement (2-4 years)", paths: ['analyst', 'tech'] },
      { value: "Steady progression (4-6 years)", paths: ['relationship', 'operations'] },
      { value: "Long-term expertise building (6+ years)", paths: ['risk', 'investment'] }
    ]
  }
];

interface CareerPathwayNavigatorProps {
  onComplete: (score: number) => void;
  onClose: () => void;
}

export default function CareerPathwayNavigator({ onComplete, onClose }: CareerPathwayNavigatorProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<CareerPath[]>([]);
  const [gameComplete, setGameComplete] = useState(false);

  const handleAnswer = (selectedOption: { value: string; paths: string[] }) => {
    const newAnswers = [...answers, selectedOption.value];
    setAnswers(newAnswers);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate recommendations
      const pathScores: { [key: string]: number } = {};
      
      questions.forEach((q, qIndex) => {
        const answer = questions[qIndex].options.find(opt => opt.value === newAnswers[qIndex]);
        if (answer) {
          answer.paths.forEach(path => {
            pathScores[path] = (pathScores[path] || 0) + 1;
          });
        }
      });

      // Get top 3 recommendations
      const sortedPaths = Object.entries(pathScores)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([pathId]) => careerPaths.find(p => p.id === pathId)!)
        .filter(Boolean);

      setRecommendations(sortedPaths);
      setGameComplete(true);
    }
  };

  const handleComplete = () => {
    const score = recommendations.length > 0 ? 100 : 50;
    onComplete(score);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4 h-[80vh] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Career Pathway Navigator</CardTitle>
            <Button variant="secondary" onClick={onClose}>Close</Button>
          </div>
          <p className="text-indigo-100">Discover your ideal career path at Citi</p>
          <div className="text-lg font-semibold">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto">
          {gameComplete ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-3xl font-bold text-indigo-600 mb-2">Your Career Recommendations</h3>
                <p className="text-lg text-gray-600 mb-6">Based on your preferences, here are the best career paths for you at Citi:</p>
              </div>

              <div className="grid gap-6">
                {recommendations.map((path, index) => (
                  <Card key={path.id} className="border-2 border-indigo-200">
                    <CardHeader className={`bg-gradient-to-r ${
                      index === 0 ? 'from-gold-400 to-gold-500' : 
                      index === 1 ? 'from-gray-300 to-gray-400' : 
                      'from-amber-500 to-amber-600'
                    } text-white`}>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl">
                          #{index + 1} {path.title}
                        </CardTitle>
                        <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {path.difficulty} Level
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-gray-700 mb-4">{path.description}</p>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2">Key Skills:</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {path.skills.map(skill => (
                              <li key={skill}>• {skill}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2">Career Progression:</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {path.nextSteps.map(step => (
                              <li key={step}>• {step}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2">Timeline:</h5>
                          <p className="text-sm text-gray-600">{path.timeframe}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button onClick={handleComplete} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3">
                  Complete Assessment
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {questions[currentQuestion].question}
                </h3>
              </div>

              <div className="grid gap-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="w-full p-4 text-left h-auto bg-gray-100 hover:bg-indigo-100 text-gray-800 border border-gray-300 hover:border-indigo-300"
                  >
                    <div className="font-medium">{option.value}</div>
                  </Button>
                ))}
              </div>

              {answers.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Your Previous Answers:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {answers.map((answer, index) => (
                      <li key={index}>Q{index + 1}: {answer}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}