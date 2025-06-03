import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface TrainingQABotProps {
  moduleId: string;
  moduleName: string;
  onClose: () => void;
}

const moduleKnowledge: Record<string, any> = {
  btss: {
    name: 'Business Technology Solutions & Services',
    keyTopics: [
      'API integration and management',
      'Legacy system modernization',
      'Cloud infrastructure',
      'Cybersecurity frameworks',
      'Digital transformation strategies',
      'System architecture design'
    ],
    commonQuestions: [
      'What is API integration?',
      'How do we modernize legacy systems?',
      'What are the security considerations?',
      'How does cloud infrastructure work?',
      'What is system architecture?'
    ],
    responses: {
      'api': 'APIs (Application Programming Interfaces) are like translators that help different computer systems talk to each other. Think of them as waiters in a restaurant - they take your order (request) to the kitchen (system) and bring back your food (response).',
      'legacy': 'Legacy systems are older computer systems that still work but may use outdated technology. Modernizing them is like renovating an old house - you keep the good foundation but update the plumbing, electrical, and design to meet today\'s needs.',
      'security': 'Security in BTSS involves multiple layers of protection: strong authentication (like having multiple locks on your door), encryption (scrambling data so only authorized people can read it), and monitoring (security cameras watching for unusual activity).',
      'cloud': 'Cloud infrastructure is like having a super-powered computer that you can access from anywhere. Instead of buying and maintaining your own servers, you rent computing power from specialized companies, making it more flexible and cost-effective.',
      'architecture': 'System architecture is the blueprint for how all the technology pieces fit together. Like an architect designing a building, we plan how data flows, where different components connect, and how everything works together efficiently.'
    }
  },
  communication: {
    name: 'Communication Standards',
    keyTopics: [
      'Professional email etiquette',
      'Cross-cultural communication',
      'Active listening techniques',
      'Presentation skills',
      'Conflict resolution',
      'Digital communication tools'
    ],
    commonQuestions: [
      'How do I write professional emails?',
      'What is active listening?',
      'How to communicate across cultures?',
      'Best practices for presentations?',
      'How to handle difficult conversations?'
    ],
    responses: {
      'email': 'Professional emails should be clear, concise, and respectful. Start with a clear subject line, use a professional greeting, get to the point quickly, and end with a clear call to action. Always proofread before sending.',
      'listening': 'Active listening means fully focusing on the speaker, asking clarifying questions, and reflecting back what you heard to ensure understanding. It\'s like being a detective - you\'re gathering all the clues to truly understand the message.',
      'culture': 'Cross-cultural communication requires awareness of different customs, communication styles, and time zones. Be patient, avoid idioms that might not translate well, and when in doubt, ask for clarification respectfully.',
      'presentation': 'Great presentations tell a story with a clear beginning, middle, and end. Know your audience, practice your delivery, use visuals to support your points, and always have a backup plan for technology issues.',
      'conflict': 'Handle difficult conversations by staying calm, focusing on facts rather than emotions, listening to understand rather than to argue, and looking for win-win solutions. Remember, the goal is resolution, not winning.'
    }
  },
  csis: {
    name: 'Cybersecurity & Information Systems',
    keyTopics: [
      'Password security',
      'Phishing prevention',
      'Data protection',
      'Network security',
      'Incident response',
      'Compliance requirements'
    ],
    commonQuestions: [
      'How to create strong passwords?',
      'What is phishing?',
      'How to protect sensitive data?',
      'What is two-factor authentication?',
      'How to report security incidents?'
    ],
    responses: {
      'password': 'Strong passwords are like strong locks - they should be long (12+ characters), unique for each account, and include a mix of letters, numbers, and symbols. Consider using a passphrase like "Coffee@Morning123!" instead of random characters.',
      'phishing': 'Phishing is like digital fishing - criminals cast fake emails or websites as bait to catch your personal information. Always verify the sender, check URLs carefully, and never give sensitive information through email or phone calls.',
      'data': 'Protecting sensitive data means treating it like valuable treasure - encrypt it (scramble it), limit access to only those who need it, backup regularly, and always follow the principle of least privilege.',
      'twofa': 'Two-factor authentication is like having two locks on your door. Even if someone steals your password (first key), they still need the second key (usually a code sent to your phone) to get in.',
      'incident': 'If you suspect a security incident, report it immediately to the IT security team. Don\'t try to fix it yourself - it\'s like calling the fire department when you see smoke, even if you\'re not sure there\'s a fire.'
    }
  },
  res: {
    name: 'Regulatory & Compliance',
    keyTopics: [
      'Know Your Customer (KYC)',
      'Anti-Money Laundering (AML)',
      'Documentation requirements',
      'Audit procedures',
      'Ethics and integrity',
      'Regulatory reporting'
    ],
    commonQuestions: [
      'What is KYC and why is it important?',
      'How does AML work?',
      'What documentation do I need?',
      'How to prepare for audits?',
      'What are ethics violations?'
    ],
    responses: {
      'kyc': 'KYC (Know Your Customer) is like getting to know a new neighbor - we need to verify who they are, what they do, and ensure they\'re trustworthy before doing business together. This helps prevent fraud and meets legal requirements.',
      'aml': 'AML (Anti-Money Laundering) helps ensure that money coming into the bank comes from legitimate sources. Think of it as checking that the ingredients in your food are fresh and safe before cooking.',
      'documentation': 'Proper documentation is like keeping a detailed diary of all business activities. It helps us track decisions, meet regulatory requirements, and provides evidence that we\'re following proper procedures.',
      'audit': 'Preparing for audits means keeping organized records, following established procedures, and being ready to explain your decisions. It\'s like keeping your house clean - easier to maintain than to fix later.',
      'ethics': 'Ethics violations involve actions that break our moral code or company policies, such as conflicts of interest, accepting inappropriate gifts, or misusing confidential information. When in doubt, ask your supervisor or ethics hotline.'
    }
  },
  risk: {
    name: 'Risk Management',
    keyTopics: [
      'Risk identification',
      'Risk assessment methodologies',
      'Mitigation strategies',
      'Portfolio diversification',
      'Stress testing',
      'Regulatory capital'
    ],
    commonQuestions: [
      'How do we identify risks?',
      'What is risk appetite?',
      'How does diversification work?',
      'What is stress testing?',
      'How to calculate risk exposure?'
    ],
    responses: {
      'identify': 'Risk identification is like being a weather forecaster - we look for signs that could indicate potential problems. We analyze market trends, review historical data, and assess various scenarios that could impact our business.',
      'appetite': 'Risk appetite is how much risk we\'re willing to take to achieve our goals, like deciding how fast to drive in different weather conditions. It varies based on market conditions, regulatory requirements, and business objectives.',
      'diversification': 'Diversification is like not putting all your eggs in one basket. By spreading investments across different areas, industries, and regions, we reduce the impact if one area performs poorly.',
      'stress': 'Stress testing is like testing a bridge with heavy trucks before opening it to traffic. We simulate extreme market conditions to see how our portfolios would perform and ensure we can handle worst-case scenarios.',
      'exposure': 'Risk exposure measures how much we could lose if specific risks materialize. It\'s like calculating how much damage a storm could cause to help us decide what insurance coverage we need.'
    }
  },
  ta: {
    name: 'Technology Architecture',
    keyTopics: [
      'Enterprise architecture principles',
      'System integration',
      'Scalability planning',
      'Performance optimization',
      'Technology roadmaps',
      'Innovation frameworks'
    ],
    commonQuestions: [
      'What is enterprise architecture?',
      'How do systems integrate?',
      'What is scalability?',
      'How to optimize performance?',
      'What are technology roadmaps?'
    ],
    responses: {
      'enterprise': 'Enterprise architecture is like city planning for technology. It defines how all systems, applications, and data work together efficiently. Just as a city needs roads, utilities, and zoning, technology needs structure and standards.',
      'integration': 'System integration connects different software applications so they can share data and work together. It\'s like building bridges between islands so people and goods can flow freely between them.',
      'scalability': 'Scalability means building systems that can grow without breaking. Like designing a restaurant that can handle both slow Tuesday nights and busy Friday evenings without changing the entire kitchen.',
      'performance': 'Performance optimization involves making systems run faster and more efficiently. It\'s like tuning a car engine - adjusting various components to get the best speed, fuel efficiency, and reliability.',
      'roadmap': 'Technology roadmaps are strategic plans showing how technology will evolve over time. Like a GPS route that shows not just your destination, but the best path and timing to get there.'
    }
  }
};

export default function TrainingQABot({ moduleId, moduleName, onClose }: TrainingQABotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const moduleData = moduleKnowledge[moduleId];

  useEffect(() => {
    // Initial welcome message
    const welcomeMessage: Message = {
      id: '1',
      type: 'bot',
      content: `Hello! I'm your ${moduleName} learning assistant. I'm here to help you understand complex concepts through simple explanations. Feel free to ask me anything about this module!`,
      timestamp: new Date(),
      suggestions: moduleData?.commonQuestions.slice(0, 3) || []
    };
    setMessages([welcomeMessage]);
  }, [moduleId, moduleName, moduleData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateResponse = (userQuestion: string): string => {
    const question = userQuestion.toLowerCase();
    
    // Check for greetings
    if (question.includes('hello') || question.includes('hi') || question.includes('hey')) {
      return "Hello! I'm excited to help you learn. What would you like to know about " + moduleName + "?";
    }
    
    // Check for thanks
    if (question.includes('thank') || question.includes('thanks')) {
      return "You're welcome! I'm here whenever you need help understanding any concepts. Keep up the great learning!";
    }

    // Find relevant response based on keywords
    for (const [key, response] of Object.entries(moduleData.responses)) {
      if (question.includes(key) || 
          question.includes(key.replace(/([A-Z])/g, ' $1').toLowerCase()) ||
          question.includes(key.substring(0, 3))) {
        return response;
      }
    }

    // Check for specific module-related keywords
    if (moduleId === 'btss') {
      if (question.includes('technology') || question.includes('system')) {
        return "Technology at Citi is like the nervous system of our global operations. We connect different parts of the organization so they can work together seamlessly, whether it's a customer in New York or Tokyo.";
      }
    } else if (moduleId === 'communication') {
      if (question.includes('talk') || question.includes('speak') || question.includes('communicate')) {
        return "Great communication is like being a skilled translator - not just between languages, but between different perspectives, departments, and cultures. The goal is always understanding and connection.";
      }
    } else if (moduleId === 'csis') {
      if (question.includes('secure') || question.includes('safe') || question.includes('protect')) {
        return "Security is like being a digital superhero - we protect not just data and systems, but the trust that millions of customers place in us every day. Every security measure is a shield protecting someone's financial future.";
      }
    }

    // Default helpful response
    return `That's a great question about ${moduleName}. While I might not have the specific answer you're looking for, I'd recommend checking the main training materials or asking your supervisor. Is there something more specific about ${moduleData.keyTopics[0]} or ${moduleData.keyTopics[1]} I can help explain?`;
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateResponse(content);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        suggestions: Math.random() > 0.7 ? moduleData.commonQuestions.slice(0, 2) : undefined
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={onClose} className="mb-4">
            ← Back to Training
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Q&A Assistant</h1>
          <p className="text-gray-600">Ask me anything about {moduleName}</p>
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              Learning Assistant
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              {moduleData.keyTopics.slice(0, 4).map((topic, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[400px] p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                      
                      {message.suggestions && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs font-medium">Suggested questions:</p>
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="block w-full text-left text-xs bg-white bg-opacity-20 hover:bg-opacity-30 rounded p-2 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about this module..."
                  className="flex-1"
                />
                <Button 
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Send
                </Button>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {moduleData.commonQuestions.slice(0, 3).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(question)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}