import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface StoryContent {
  id: string;
  title: string;
  story: string;
  keyPoints: string[];
  analogy: string;
  quiz: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  }[];
}

interface StoryBasedTrainingProps {
  moduleId: string;
  onComplete: () => void;
  onClose: () => void;
}

const storyContent: Record<string, StoryContent> = {
  btss: {
    id: 'btss',
    title: 'The Digital Kingdom Adventure',
    story: `
Once upon a time, in the magnificent Digital Kingdom of Citi, there lived a wise Technology Queen who needed to keep all the kingdom's treasures safe and accessible to millions of citizens worldwide.

The kingdom had many magical tools - some old and reliable like ancient scrolls (legacy systems), and some new and powerful like crystal balls that could see into the future (AI and machine learning).

The Technology Queen's challenge was to make sure that when a citizen in New York wanted to send gold coins to their family in Tokyo, the magic happened instantly and safely. She needed bridges between the old castles and new towers, translators who could speak to both ancient dragons and modern phoenixes.

This is where our brave BTSS knights come in! They are the bridge-builders, the translators, and the guardians who make sure that whether you're using a magic mirror (mobile app) or visiting a physical castle (branch), your experience is seamless and secure.

The BTSS knights have three main quests:
1. Build magical bridges (APIs and integrations)
2. Keep the treasure vaults secure (cybersecurity)
3. Make sure the magic works the same way everywhere (standardization)
    `,
    keyPoints: [
      'Technology infrastructure connects global operations',
      'Legacy systems integration with modern solutions',
      'Security and compliance in all digital interactions',
      'Standardized processes across all platforms',
      'Customer experience consistency worldwide'
    ],
    analogy: 'Think of BTSS like the nervous system in your body - it connects every part and makes sure messages travel quickly and accurately from your brain (headquarters) to your fingers (local branches) anywhere in the world.',
    quiz: [
      {
        question: 'What is the main role of BTSS in Citi?',
        options: [
          'Only building mobile apps',
          'Creating bridges between old and new technology systems',
          'Managing only the security systems',
          'Handling customer service calls'
        ],
        correct: 1,
        explanation: 'BTSS acts as the bridge-builder, connecting legacy systems with modern technology to ensure seamless operations across all Citi services.'
      }
    ]
  },
  communication: {
    id: 'communication',
    title: 'The Language of Success',
    story: `
In the great City of Citi, there once was a Communication Guild that discovered the secret to building trust and understanding among all citizens, no matter where they came from or what language they spoke.

The Guild learned that words were like magic spells - when used correctly, they could open doors, build friendships, and solve problems. But when used poorly, they could create confusion, hurt feelings, and even cause the kingdom's treasures to be lost!

The wise Communication Masters taught three golden rules:

First, "Speak as you would want to be spoken to" - Whether writing to the King (CEO) or chatting with a fellow knight (colleague), use the same respect and kindness you'd want to receive.

Second, "Clear words are like clean windows" - Don't make people guess what you mean. If you're explaining something to a 5-year-old, they should understand it perfectly.

Third, "Listen with your whole heart" - Sometimes the most important part of communication isn't what you say, but how well you listen to what others are telling you.

The Guild discovered that when everyone followed these rules, magical things happened: Problems got solved faster, customers felt happier, and the whole kingdom worked like a beautiful orchestra where every instrument played in harmony.
    `,
    keyPoints: [
      'Professional tone in all communications',
      'Clear and concise messaging',
      'Active listening and empathy',
      'Cultural sensitivity in global interactions',
      'Timely responses to all communications'
    ],
    analogy: 'Good communication is like being a good orchestra conductor - you need to make sure everyone plays their part at the right time, in the right way, so the whole performance sounds beautiful.',
    quiz: [
      {
        question: 'What is the most important aspect of professional communication?',
        options: [
          'Using big, impressive words',
          'Speaking as fast as possible',
          'Being clear, respectful, and timely',
          'Only communicating through email'
        ],
        correct: 2,
        explanation: 'Professional communication is about being clear, respectful, and timely to ensure your message is understood and builds positive relationships.'
      }
    ]
  },
  csis: {
    id: 'csis',
    title: 'The Digital Shield Warriors',
    story: `
Long ago, in the digital realm of Citi, there existed an elite group of warriors known as the Digital Shield Guardians. Their mission was to protect the kingdom's most precious treasures - the trust and information of millions of citizens.

These weren't ordinary warriors. They fought invisible enemies: sneaky password thieves, email tricksters, and digital pirates who tried to steal the kingdom's gold and secrets.

The Digital Shield Warriors had special powers:

🛡️ The Shield of Strong Passwords - They taught everyone to create passwords like "MyDog@te3Cookies!" instead of weak ones like "password123"

🔍 The Eyes of Email Wisdom - They could spot fake emails from a mile away, teaching citizens to never click suspicious links or give away their secret codes

🔐 The Lock of Two-Factor Magic - They added an extra magical lock that required two keys instead of one, making it nearly impossible for thieves to break in

🌐 The Cloak of Safe Browsing - They taught everyone to only visit trusted websites and never download mysterious potions (suspicious software)

The most amazing part? Every citizen became a Digital Shield Warrior too! Because when everyone knows how to protect themselves, the whole kingdom becomes stronger than any castle wall.
    `,
    keyPoints: [
      'Strong password creation and management',
      'Recognizing and avoiding phishing attempts',
      'Two-factor authentication importance',
      'Safe browsing practices',
      'Protecting sensitive information'
    ],
    analogy: 'Cybersecurity is like being a superhero protecting your house - you need multiple layers of protection: locks on doors (passwords), security cameras (monitoring), and friendly neighbors watching out for each other (team awareness).',
    quiz: [
      {
        question: 'What makes a password strong and secure?',
        options: [
          'Using your birthday or name',
          'Using "password123"',
          'Mixing letters, numbers, and symbols in a long phrase',
          'Using the same password everywhere'
        ],
        correct: 2,
        explanation: 'Strong passwords combine uppercase letters, lowercase letters, numbers, and symbols in a long, memorable phrase that\'s unique for each account.'
      }
    ]
  },
  res: {
    id: 'res',
    title: 'The Kingdom\'s Rule Keepers',
    story: `
In the prosperous Kingdom of Citi, there lived a group of wise Rule Keepers who made sure everyone played fairly and safely. They weren't mean or strict - they were like caring teachers who helped everyone understand the rules so the kingdom could thrive.

The Rule Keepers discovered that rules weren't just boring lists - they were like recipes for success! Just like a recipe for cookies tells you exactly how much flour and sugar to use, financial rules tell us exactly how to handle money safely.

The Rule Keepers had three magical books:

📚 The Book of "Know Your Neighbor" (KYC) - This taught everyone to really get to know their customers, just like you'd want to know who you're lending your bicycle to.

📚 The Book of "Clean Money Only" (AML) - This made sure all the gold coins in the kingdom came from honest work, not from pirates or thieves.

📚 The Book of "Tell the Truth Always" - This reminded everyone to be completely honest in all their dealings, because trust is the most valuable treasure in any kingdom.

When everyone followed these wise rules, amazing things happened: Customers felt safe, other kingdoms trusted them, and the whole kingdom became known as the most reliable place in all the lands to keep your treasures.

The best part? Every citizen learned that following rules wasn't about restriction - it was about freedom! When everyone plays by the same fair rules, everyone can succeed together.
    `,
    keyPoints: [
      'Know Your Customer (KYC) procedures',
      'Anti-Money Laundering (AML) compliance',
      'Accurate record keeping and reporting',
      'Ethics and integrity in all dealings',
      'Regulatory compliance across all jurisdictions'
    ],
    analogy: 'Regulatory compliance is like traffic rules - they might seem inconvenient, but they keep everyone safe and help millions of people move smoothly toward their destinations every day.',
    quiz: [
      {
        question: 'Why is "Know Your Customer" (KYC) important?',
        options: [
          'To make banking more complicated',
          'To ensure we understand our customers and prevent financial crimes',
          'To collect unnecessary paperwork',
          'To slow down banking processes'
        ],
        correct: 1,
        explanation: 'KYC helps us understand our customers, build trust, and prevent financial crimes by ensuring we know who we\'re doing business with and that their activities are legitimate.'
      }
    ]
  },
  risk: {
    id: 'risk',
    title: 'The Weather Watchers of Finance',
    story: `
In the great Financial Kingdom of Citi, there was a special group of wise Weather Watchers who could predict storms before they arrived. But these weren't ordinary weather storms - they were Financial Weather patterns that could affect the kingdom's prosperity.

The Weather Watchers had learned that just like real weather, financial conditions could change quickly. A sunny day (good market conditions) could turn into a thunderstorm (market volatility) without warning. Their job was to help the kingdom prepare for all kinds of weather.

The Weather Watchers used three magical tools:

🌡️ The Risk Thermometer - This measured how "hot" or risky different investments were. Just like you wouldn't wear a winter coat on a summer day, you wouldn't make the same investments in different market conditions.

☔ The Umbrella of Preparation - They always carried protective tools for rainy days. If one investment got wet (lost money), they had others that stayed dry (diversification).

🌪️ The Storm Warning System - They watched for danger signs and alerted everyone when big storms (major risks) were approaching, so the kingdom could take shelter or change course.

The most brilliant discovery was that risk wasn't something to be afraid of - it was something to understand and manage. Just like sailors who learn to read the wind and waves, the kingdom learned to navigate through any financial weather by being prepared, staying alert, and working together.

When everyone understood weather patterns, the kingdom didn't just survive storms - they learned to dance in the rain and sail confidently toward sunny horizons.
    `,
    keyPoints: [
      'Risk identification and assessment',
      'Risk mitigation strategies',
      'Portfolio diversification principles',
      'Stress testing and scenario planning',
      'Continuous monitoring and reporting'
    ],
    analogy: 'Risk management is like being a skilled ship captain - you study the weather, prepare for storms, have backup plans, and know that sometimes the best treasure is found by those brave enough to sail through challenging waters.',
    quiz: [
      {
        question: 'What is the best approach to managing financial risk?',
        options: [
          'Avoid all risks completely',
          'Take the biggest risks for biggest rewards',
          'Identify, assess, and manage risks systematically',
          'Ignore risks and hope for the best'
        ],
        correct: 2,
        explanation: 'The best approach is to systematically identify, assess, and manage risks using proven strategies like diversification, monitoring, and having contingency plans.'
      }
    ]
  },
  ta: {
    id: 'ta',
    title: 'The Master Architects of Tomorrow',
    story: `
Once upon a time, in the ever-evolving Digital Kingdom of Citi, there lived a group of Master Architects who had the most exciting job in the entire realm. While other builders worked with stone and wood, these architects built with ideas, dreams, and digital magic.

The Master Architects were like the city planners of a magnificent metropolis. They didn't just think about today - they dreamed about what the kingdom would need 10, 20, or even 50 years from now!

Their greatest project was building the "City of Tomorrow" - a digital infrastructure so smart and flexible that it could grow and change like a living organism. This wasn't just about computers and code; it was about creating a world where:

🏗️ The Foundation Builders designed systems so strong they could support millions of citizens across the globe

🌉 The Bridge Engineers connected different kingdoms (systems) so they could talk to each other in perfect harmony

🎨 The Experience Designers made sure that whether someone was 8 or 80, whether they lived in New York or Tokyo, using Citi's services felt like magic

🔮 The Future Seers planned for technologies that didn't even exist yet, building flexible frameworks that could adapt to whatever tomorrow might bring

The most amazing part of their story was the discovery that great architecture isn't just about building big and impressive structures - it's about creating spaces where people can thrive, grow, and achieve their dreams.

Every blueprint they drew, every decision they made, was guided by one simple question: "How can we make life better for the people who will use this?"

And so the kingdom grew not just bigger, but better - more connected, more secure, more wonderful with each passing day.
    `,
    keyPoints: [
      'Enterprise architecture principles',
      'Scalable and flexible system design',
      'Integration and interoperability',
      'Future-proofing technology investments',
      'User-centered design approach'
    ],
    analogy: 'Technology architecture is like designing a smart city - you need to plan the roads (data flow), utilities (infrastructure), and neighborhoods (systems) so that millions of people can live, work, and thrive together efficiently.',
    quiz: [
      {
        question: 'What is the main goal of technology architecture?',
        options: [
          'To use the most expensive technology available',
          'To create systems that only work for today\'s needs',
          'To design scalable, flexible systems that serve users effectively',
          'To make systems as complex as possible'
        ],
        correct: 2,
        explanation: 'Technology architecture focuses on creating scalable, flexible systems that serve users effectively both today and in the future, while being maintainable and cost-effective.'
      }
    ]
  }
};

export default function StoryBasedTraining({ moduleId, onComplete, onClose }: StoryBasedTrainingProps) {
  const [currentTab, setCurrentTab] = useState('story');
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  const content = storyContent[moduleId];

  useEffect(() => {
    // Simulate reading progress tracking
    const timer = setInterval(() => {
      if (currentTab === 'story') {
        setReadingProgress(prev => Math.min(prev + 2, 100));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTab]);

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  const submitQuiz = () => {
    setShowQuizResults(true);
  };

  const getQuizScore = () => {
    return content.quiz.reduce((score, question, index) => {
      return score + (quizAnswers[index] === question.correct ? 1 : 0);
    }, 0);
  };

  if (!content) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-gray-800">Story content not available</h2>
        <p className="text-gray-600">This module's story is still being crafted by our storytellers.</p>
        <Button onClick={onClose} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={onClose} className="mb-4">
            ← Back to Module
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{content.title}</h1>
          <p className="text-gray-600">Learning made simple through storytelling</p>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="story">📖 Story</TabsTrigger>
            <TabsTrigger value="summary">📝 Key Points</TabsTrigger>
            <TabsTrigger value="analogy">🧠 Simple Explanation</TabsTrigger>
            <TabsTrigger value="quiz">🎯 Understanding Check</TabsTrigger>
          </TabsList>

          <TabsContent value="story" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📚</span>
                  The Story Behind {content.title}
                </CardTitle>
                {readingProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Reading Progress</span>
                      <span>{readingProgress}%</span>
                    </div>
                    <Progress value={readingProgress} className="h-2" />
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none">
                  {content.story.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                        {paragraph.trim()}
                      </p>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  Key Points to Remember
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {content.keyPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <Badge className="bg-blue-600 text-white min-w-fit">
                        {index + 1}
                      </Badge>
                      <p className="text-gray-700">{point}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analogy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🧠</span>
                  Simple Explanation
                </CardTitle>
                <p className="text-gray-600">Understanding complex concepts through everyday examples</p>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-orange-200">
                  <h3 className="text-lg font-semibold text-orange-900 mb-3">Think of it this way:</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">{content.analogy}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Test Your Understanding
                </CardTitle>
                <p className="text-gray-600">Quick check to see how well you understood the story</p>
              </CardHeader>
              <CardContent>
                {!showQuizResults ? (
                  <div className="space-y-6">
                    {content.quiz.map((question, qIndex) => (
                      <div key={qIndex} className="space-y-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {qIndex + 1}. {question.question}
                        </h3>
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <button
                              key={oIndex}
                              onClick={() => handleQuizAnswer(qIndex, oIndex)}
                              className={`w-full p-3 text-left border rounded-lg transition-colors ${
                                quizAnswers[qIndex] === oIndex
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              <span className="font-medium mr-2">{String.fromCharCode(65 + oIndex)}.</span>
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      onClick={submitQuiz}
                      disabled={quizAnswers.length < content.quiz.length}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Check My Understanding
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl mb-4">
                        {getQuizScore() === content.quiz.length ? '🎉' : '📚'}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        You got {getQuizScore()} out of {content.quiz.length} correct!
                      </h3>
                      <p className="text-gray-600">
                        {getQuizScore() === content.quiz.length 
                          ? 'Excellent understanding! You\'re ready for the next adventure.'
                          : 'Good effort! Review the explanations below to strengthen your understanding.'
                        }
                      </p>
                    </div>

                    {content.quiz.map((question, qIndex) => (
                      <div key={qIndex} className="space-y-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {qIndex + 1}. {question.question}
                        </h3>
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <div
                              key={oIndex}
                              className={`p-3 border rounded-lg ${
                                oIndex === question.correct
                                  ? 'border-green-500 bg-green-50'
                                  : quizAnswers[qIndex] === oIndex && oIndex !== question.correct
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-300'
                              }`}
                            >
                              <span className="font-medium mr-2">{String.fromCharCode(65 + oIndex)}.</span>
                              {option}
                              {oIndex === question.correct && (
                                <span className="ml-2 text-green-600 font-medium">✓ Correct</span>
                              )}
                              {quizAnswers[qIndex] === oIndex && oIndex !== question.correct && (
                                <span className="ml-2 text-red-600 font-medium">✗ Your answer</span>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <h4 className="font-medium text-blue-900 mb-1">Explanation:</h4>
                          <p className="text-blue-800">{question.explanation}</p>
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      onClick={onComplete}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Continue to Main Training
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}