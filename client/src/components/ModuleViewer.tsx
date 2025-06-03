import { useState, useEffect } from 'react';
import StoryBasedTraining from './StoryBasedTraining';
import AvatarTreasureHunt from './AvatarTreasureHunt';
import ScormTrainingModule from './ScormTrainingModule';
import ScormConfiguration from './ScormConfiguration';
import LMSIntegrationTab from './LMSIntegrationTab';
import { useAuth } from '@/contexts/AuthContext';

interface Slide {
  title: string;
  content: string;
}

interface ModuleContent {
  type: string;
  title: string;
  content: string;
  slides?: Slide[];
  summary?: string[];
  isUploaded?: boolean;
  fileUrl?: string;
  fileSize?: number;
  uploadedAt?: string;
}

interface ModuleViewerProps {
  moduleId: string;
  onClose: () => void;
  onComplete: () => void;
}

interface CharacterCustomization {
  skinTone: string;
  hairColor: string;
  eyeColor: string;
  hasGlasses: boolean;
  outfit: string;
}

interface CharacterData {
  id: string;
  name: string;
  description: string;
  avatar: string;
  personality: string;
  department: string;
  customization: CharacterCustomization;
}

export default function ModuleViewer({ moduleId, onClose, onComplete }: ModuleViewerProps) {
  const { user } = useAuth();
  const [content, setContent] = useState<ModuleContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showTrainingModes, setShowTrainingModes] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [userCoins, setUserCoins] = useState(0);
  const [activeTab, setActiveTab] = useState<'summary' | 'presentation' | 'adventure' | 'lms'>('summary');

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        // First try to fetch actual uploaded presentation from admin
        let uploadedPresentation = null;
        try {
          const response = await fetch(`/cityofciti/api/modules/${moduleId}/presentation`);
          if (response.ok) {
            const moduleData = await response.json();
            if (moduleData.isUploaded && moduleData.fileUrl) {
              uploadedPresentation = {
                fileUrl: moduleData.fileUrl,
                fileSize: 2048000,
                uploadedAt: moduleData.uploadedAt || new Date().toLocaleDateString(),
                uploadedBy: 'Admin'
              };
            }
          }
        } catch (error) {
          console.log('No uploaded presentation found for module:', moduleId);
        }

        const moduleContent = createDefaultContent(moduleId, uploadedPresentation);
        setContent(moduleContent);
      } catch (error) {
        console.error('Error loading module content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [moduleId]);

  const createDefaultContent = (moduleId: string, uploadedPresentation: any): ModuleContent => {

    const moduleData = {
      btss: {
        title: "Business Technology Shared Services",
        summary: [
          "Provide comprehensive technology services and support across Citi globally",
          "Deliver infrastructure, applications, and digital workplace solutions",
          "Enable business operations through reliable technology platforms",
          "Maintain service excellence with 24/7 support and monitoring",
          "Drive innovation through modern technology adoption and best practices"
        ],
        slides: [
          {
            title: "Technology Foundation",
            content: "BTSS provides the technology backbone that enables Citi's global operations, delivering reliable infrastructure and innovative solutions."
          },
          {
            title: "Service Portfolio",
            content: "• Infrastructure Management\n• Application Support\n• Digital Workplace Services\n• Cloud Solutions\n• Security Operations\n• Data Management"
          },
          {
            title: "Global Reach",
            content: "Supporting Citi's operations across multiple continents with localized expertise and standardized service delivery."
          },
          {
            title: "Innovation Focus",
            content: "Continuously modernizing technology stack, adopting cloud-first strategies, and implementing cutting-edge solutions."
          },
          {
            title: "Service Excellence",
            content: "Committed to delivering high-quality technology services with measurable business outcomes and customer satisfaction."
          }
        ]
      },
      communication: {
        title: "Communication Standards",
        summary: [
          "Establish clear and professional communication across all channels",
          "Use concise, respectful language appropriate for business context",
          "Follow proper email etiquette and meeting protocols",
          "Adapt communication style for different audiences and cultures",
          "Maintain confidentiality and comply with regulatory requirements"
        ],
        slides: [
          {
            title: "Professional Communication",
            content: "Effective communication is essential for success at Citi. Clear, professional, and respectful communication builds trust and drives results."
          },
          {
            title: "Email Best Practices",
            content: "• Use clear, descriptive subject lines\n• Keep messages concise and focused\n• Use proper salutations and closings\n• Reply promptly to business communications\n• Use appropriate tone and formatting"
          },
          {
            title: "Meeting Excellence",
            content: "Prepare agendas in advance, arrive on time, participate actively, and follow up on action items promptly."
          },
          {
            title: "Cross-Cultural Communication",
            content: "Respect cultural differences, use inclusive language, be mindful of time zones, and adapt communication styles as needed."
          }
        ]
      },
      csis: {
        title: "Citi Security & Information Systems",
        summary: [
          "CSIS protects Citi's information assets with highest cybersecurity standards",
          "Follow data classification, access controls, and encryption protocols",
          "Report suspicious activities and maintain strict confidentiality",
          "Participate in security training and incident response procedures",
          "Ensure compliance with industry standards and regulatory requirements"
        ],
        slides: [
          {
            title: "Security First",
            content: "CSIS ensures the protection of Citi's information assets and maintains the highest standards of cybersecurity across all operations."
          },
          {
            title: "Information Security",
            content: "• Data classification and handling\n• Access controls and authentication\n• Encryption standards\n• Incident response procedures\n• Security awareness training"
          },
          {
            title: "System Security",
            content: "Secure system design, regular security assessments, vulnerability management, and compliance with industry standards."
          },
          {
            title: "Your Responsibilities",
            content: "Follow security protocols, report suspicious activities, maintain confidentiality, and participate in security training programs."
          },
          {
            title: "Compliance",
            content: "Adhere to regulatory requirements, internal policies, and industry best practices to maintain Citi's security posture."
          }
        ]
      },
      res: {
        title: "Regulatory & Compliance Excellence",
        summary: [
          "Navigate complex financial regulations with compliance excellence",
          "Understand Basel III, Dodd-Frank, GDPR, AML, and KYC requirements",
          "Foster proactive compliance culture with transparent reporting",
          "Identify and mitigate regulatory risks through proper controls",
          "Stay informed, follow procedures, and report concerns promptly"
        ],
        slides: [
          {
            title: "Regulatory Framework",
            content: "Understanding the complex regulatory environment that governs financial services and Citi's commitment to compliance excellence."
          },
          {
            title: "Key Regulations",
            content: "• Basel III Banking Regulations\n• Dodd-Frank Act\n• GDPR and Data Privacy\n• Anti-Money Laundering (AML)\n• Know Your Customer (KYC)"
          },
          {
            title: "Compliance Culture",
            content: "Foster a culture of compliance, proactive risk identification, transparent reporting, and continuous improvement."
          },
          {
            title: "Risk Management",
            content: "Identify, assess, and mitigate regulatory risks through proper controls, monitoring, and reporting mechanisms."
          },
          {
            title: "Your Role",
            content: "Stay informed about regulations, follow established procedures, report concerns promptly, and participate in compliance training."
          }
        ]
      },
      risk: {
        title: "Risk Management & Internal Controls",
        summary: [
          "Implement comprehensive risk management and internal control frameworks",
          "Identify, assess, and monitor operational, credit, and market risks",
          "Establish strong governance with clear accountability structures",
          "Use data analytics and stress testing for risk assessment",
          "Maintain robust control environment with regular monitoring and reporting"
        ],
        slides: [
          {
            title: "Risk Management Framework",
            content: "Comprehensive approach to identifying, measuring, monitoring, and controlling risks across all business activities."
          },
          {
            title: "Risk Types",
            content: "• Credit Risk\n• Market Risk\n• Operational Risk\n• Liquidity Risk\n• Compliance Risk\n• Reputational Risk"
          },
          {
            title: "Internal Controls",
            content: "Robust control environment with clear policies, procedures, and monitoring mechanisms to ensure effective risk management."
          },
          {
            title: "Governance Structure",
            content: "Clear accountability, defined roles and responsibilities, and escalation procedures for effective risk oversight."
          },
          {
            title: "Your Responsibilities",
            content: "Understand risk appetite, follow control procedures, escalate issues promptly, and contribute to risk assessment activities."
          }
        ]
      },
      ta: {
        title: "Technology Architecture",
        summary: [
          "Define enterprise architecture blueprint for scalable technology infrastructure",
          "Follow modularity, cloud-first approach, and API-driven integration principles",
          "Implement modern technology stack with microservices and containers",
          "Maintain architectural standards and governance for consistency",
          "Drive digital transformation with AI/ML integration and legacy modernization"
        ],
        slides: [
          {
            title: "Enterprise Architecture",
            content: "Technology Architecture defines the blueprint for Citi's technology infrastructure, ensuring scalability, security, and efficiency."
          },
          {
            title: "Architecture Principles",
            content: "• Modularity and reusability\n• Cloud-first approach\n• API-driven integration\n• Security by design\n• Performance optimization\n• Scalability planning"
          },
          {
            title: "Technology Stack",
            content: "Modern technology stack including microservices, containers, cloud platforms, and emerging technologies like AI/ML."
          },
          {
            title: "Standards & Governance",
            content: "Architectural standards, design patterns, and governance processes to ensure consistency and quality across technology solutions."
          },
          {
            title: "Digital Transformation",
            content: "Leading digital transformation initiatives, modernizing legacy systems, and enabling innovation through technology."
          }
        ]
      }
    };

    return {
      type: "presentation",
      title: moduleData[moduleId as keyof typeof moduleData]?.title || "Training Module",
      content: "Interactive presentation content",
      slides: moduleData[moduleId as keyof typeof moduleData]?.slides || [],
      summary: moduleData[moduleId as keyof typeof moduleData]?.summary || [],
      isUploaded: uploadedPresentation?.fileUrl ? true : false,
      fileUrl: uploadedPresentation?.fileUrl || null,
      fileSize: uploadedPresentation?.fileSize || 0,
      uploadedAt: uploadedPresentation?.uploadedAt || null
    };
  };

  const nextSlide = () => {
    if (content && content.slides && currentSlide < content.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleComplete = async () => {
    try {
      const response = await fetch('/api/user-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moduleId: moduleId,
          type: 'module',
          score: 100
        })
      });

      if (response.ok) {
        onComplete();
      } else {
        console.error('Failed to update progress');
        onComplete();
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      onComplete();
    }
  };

  const handleCollectCoin = (coinValue: number) => {
    setUserCoins(prev => prev + coinValue);
  };

  const getStoredCharacter = (): CharacterData => {
    const stored = localStorage.getItem('userCharacter');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default character if none selected
    return {
      id: 'default',
      name: user?.name || 'Explorer',
      description: 'Professional team member',
      avatar: '👨‍💼',
      personality: 'Analytical and detail-oriented',
      department: user?.department || 'General',
      customization: {
        skinTone: 'medium',
        hairColor: 'brown',
        eyeColor: 'brown',
        hasGlasses: false,
        outfit: 'business'
      }
    };
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading module content...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 text-center max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Not Available</h3>
          <p className="text-gray-600 mb-6">This module content is currently being updated.</p>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Training Mode Selection Modal
  if (showTrainingModes && !selectedMode) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-2xl mx-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Choose Your Training Adventure</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              onClick={() => setSelectedMode('story')}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 cursor-pointer transition-colors"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Story Mode</h3>
                <p className="text-gray-600 text-sm">Learn through engaging stories and real-world scenarios</p>
              </div>
            </div>

            <div
              onClick={() => setSelectedMode('treasure')}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 cursor-pointer transition-colors"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🗺️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Treasure Hunt</h3>
                <p className="text-gray-600 text-sm">Navigate maps, collect rewards, and complete challenges</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowTrainingModes(false)}
              className="px-6 py-2 text-gray-600 hover:text-gray-800"
            >
              Back to Presentation
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Story Mode
  if (selectedMode === 'story') {
    return (
      <StoryBasedTraining 
        moduleId={moduleId}
        onComplete={() => {
          setSelectedMode(null);
          setShowTrainingModes(false);
          handleComplete();
        }}
        onClose={() => {
          setSelectedMode(null);
          setShowTrainingModes(false);
        }}
      />
    );
  }

  // Treasure Hunt Mode
  if (selectedMode === 'treasure') {
    return (
      <AvatarTreasureHunt
        avatar={getStoredCharacter()}
        moduleId={moduleId}
        moduleName={content.title}
        onCollectCoin={handleCollectCoin}
        onComplete={() => {
          setSelectedMode(null);
          setShowTrainingModes(false);
          handleComplete();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{content.title}</h1>
            <p className="text-blue-100 text-sm">Interactive Training Module</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('summary')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'summary'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📋 Key Points Summary
            </button>
            <button
              onClick={() => setActiveTab('presentation')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'presentation'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📄 Original Presentation
            </button>
            <button
              onClick={() => setActiveTab('adventure')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'adventure'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🎮 Training Adventures
            </button>
            <button
              onClick={() => setActiveTab('lms')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'lms'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 LMS Integration
            </button>
          </div>
        </div>

        <div className="bg-white rounded-b-xl shadow-lg overflow-hidden">
          {/* Tab Content */}
          {activeTab === 'summary' && (
            <div className="p-6">
              {/* Training Summary for Quick Retention */}
              {content.summary && content.summary.length > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-green-600 mr-2">📋</span>
                    Key Points Summary - Quick Retention Guide
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {content.summary.map((point, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleComplete}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Complete Training ✓
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'presentation' && (
            <div className="h-[80vh]">
              {content.isUploaded && content.fileUrl ? (
                <div className="h-full flex flex-col">
                  {/* Presentation Header */}
                  <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Original Training Document</h3>
                      <p className="text-sm text-gray-600">
                        Uploaded: {content.uploadedAt} • Size: {Math.round((content.fileSize || 0) / 1024)} KB
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <a
                        href={content.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm border border-blue-200"
                      >
                        Open in New Tab
                      </a>
                      <button
                        onClick={handleComplete}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                      >
                        Complete Training ✓
                      </button>
                    </div>
                  </div>
                  
                  {/* PDF/Presentation Viewer */}
                  <div className="flex-1 bg-gray-100">
                    <iframe
                      src={`${content.fileUrl}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
                      className="w-full h-full border-0"
                      title="Training Presentation"
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📄</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Presentation Available</h3>
                    <p className="text-gray-600">This module does not have an uploaded presentation.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'adventure' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  onClick={() => setSelectedMode('story')}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 cursor-pointer transition-colors"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📚</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Story Mode</h3>
                    <p className="text-gray-600 text-sm">Learn through engaging stories and real-world scenarios</p>
                  </div>
                </div>

                <div
                  onClick={() => setSelectedMode('treasure')}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 cursor-pointer transition-colors"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🗺️</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Treasure Hunt</h3>
                    <p className="text-gray-600 text-sm">Navigate maps, collect rewards, and complete challenges</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lms' && (
            <LMSIntegrationTab
              moduleId={moduleId}
              moduleName={content?.title || moduleId}
              onLaunchScorm={() => {
                // Handle SCORM launch
                console.log('Launching SCORM training for:', moduleId);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}