import { Character, Mission, Quiz, Badge, LeaderboardEntry, MissionLocation } from "@/types";

// Initial character data - this will be dynamically populated with user data
export const getInitialCharacter = (user: any): Character => {
  if (!user) {
    return {
      name: "New Employee",
      initials: "NE",
      department: "General",
      role: "Employee",
      experience: "New Hire",
      avatar: null
    };
  }
  
  const initials = user.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'NE';
  
  return {
    name: user.name || "New Employee",
    initials,
    department: user.department || "General",
    role: user.role || "Employee", 
    experience: user.experience || "New Hire",
    avatar: null
  };
};

// Mission locations on the city map
export const initialLocations: MissionLocation[] = [
  {
    id: "headquarters",
    name: "Headquarters",
    icon: "building",
    missionId: "headquarters-tour",
    xpReward: 50,
    position: { x: 0, y: 8 }
  },
  {
    id: "history-culture",
    name: "History & Culture",
    icon: "landmark",
    missionId: "company-history",
    xpReward: 25,
    position: { x: 0, y: 0 }
  },
  {
    id: "technology-hub",
    name: "Technology Hub",
    icon: "laptop-code",
    missionId: "technology-overview",
    xpReward: 35,
    position: { x: 0, y: 0 }
  },
  {
    id: "financial-center",
    name: "Financial Center",
    icon: "chart-line",
    missionId: "financial-basics",
    xpReward: 40,
    position: { x: 0, y: 0 }
  },
  {
    id: "human-resources",
    name: "Human Resources",
    icon: "users",
    missionId: "meet-your-team",
    xpReward: 30,
    position: { x: 0, y: 0 }
  },
  {
    id: "client-services",
    name: "Client Services",
    icon: "handshake",
    missionId: "client-interaction",
    xpReward: 35,
    position: { x: 0, y: 0 }
  }
];

// Mission data
export const initialMissions: Mission[] = [
  {
    id: "character-creation",
    name: "Character Creation",
    description: "Set up your Citi persona and choose your department and role.",
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=750&h=400",
    locationId: "",
    duration: "5 minutes",
    xpReward: 25,
    isPrimary: true,
    requiredMissions: [],
    unlocksLocations: ["headquarters"],
    day: 1,
    category: "people",
    objectives: [
      "Customize your Citi avatar",
      "Select your department and role",
      "Choose your experience level"
    ]
  },
  {
    id: "headquarters-tour",
    name: "Headquarters Tour",
    description: "Begin your journey at Citi HQ and learn about our global presence.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=750&h=400",
    locationId: "headquarters",
    duration: "15 minutes",
    xpReward: 50,
    isPrimary: true,
    requiredMissions: ["character-creation"],
    unlocksLocations: ["technology-hub", "history-culture"],
    day: 1,
    category: "building",
    objectives: [
      "Tour the main headquarters building",
      "Meet with the orientation guide",
      "Complete the headquarters quiz challenge"
    ]
  },
  {
    id: "company-history",
    name: "Company History",
    description: "Discover Citi's rich heritage and evolution over the years.",
    image: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?ixlib=rb-4.0.3&auto=format&fit=crop&w=750&h=400",
    locationId: "history-culture",
    duration: "10 minutes",
    xpReward: 25,
    isPrimary: false,
    requiredMissions: ["character-creation"],
    unlocksLocations: [],
    day: 1,
    category: "knowledge",
    objectives: [
      "Learn about Citi's founding and early years",
      "Discover key milestones in Citi's history",
      "Understand Citi's global expansion"
    ]
  },
  {
    id: "meet-your-team",
    name: "Meet Your Team",
    description: "Connect with your department colleagues and team members.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=750&h=400",
    locationId: "human-resources",
    duration: "20 minutes",
    xpReward: 40,
    isPrimary: false,
    requiredMissions: ["headquarters-tour"],
    unlocksLocations: ["client-services"],
    day: 1,
    category: "people",
    objectives: [
      "Introduce yourself to your team",
      "Learn about team structure and roles",
      "Schedule 1:1 meetings with key team members"
    ]
  },
  {
    id: "technology-overview",
    name: "Technology Overview",
    description: "Explore Citi's technology infrastructure and digital initiatives.",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=750&h=400",
    locationId: "technology-hub",
    duration: "15 minutes",
    xpReward: 35,
    isPrimary: false,
    requiredMissions: ["headquarters-tour"],
    unlocksLocations: ["financial-center"],
    day: 1,
    category: "building",
    objectives: [
      "Overview of Citi's tech stack",
      "Learn about digital transformation initiatives",
      "Understand technology security protocols"
    ]
  },
  {
    id: "financial-basics",
    name: "Financial Basics",
    description: "Learn the fundamentals of Citi's financial products and services.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=750&h=400",
    locationId: "financial-center",
    duration: "25 minutes",
    xpReward: 40,
    isPrimary: false,
    requiredMissions: ["technology-overview"],
    unlocksLocations: [],
    day: 1,
    category: "knowledge",
    objectives: [
      "Overview of Citi's financial products",
      "Understand basic banking concepts",
      "Learn about global markets and investments"
    ]
  },
  {
    id: "client-interaction",
    name: "Client Interaction",
    description: "Master the art of client service and relationship management.",
    image: "https://images.unsplash.com/photo-1556745753-b2904692b3cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=750&h=400",
    locationId: "client-services",
    duration: "20 minutes",
    xpReward: 35,
    isPrimary: false,
    requiredMissions: ["meet-your-team"],
    unlocksLocations: [],
    day: 1,
    category: "people",
    objectives: [
      "Learn client service best practices",
      "Practice client communication scenarios",
      "Understand relationship management principles"
    ]
  }
];

// Quiz data
export const initialQuizzes: Quiz[] = [
  {
    id: "citi-history-quiz",
    title: "Citi History Fundamentals",
    description: "Test your knowledge of Citi's rich heritage and history",
    xpReward: 25,
    questions: [
      {
        question: "When was Citibank founded?",
        options: [
          "1790",
          "1812",
          "1812 - City Bank of New York",
          "1955"
        ],
        correctOption: 2
      },
      {
        question: "What was Citi's original name?",
        options: [
          "First Bank of the United States",
          "City Bank of New York",
          "National City Bank",
          "Citicorp"
        ],
        correctOption: 1
      },
      {
        question: "Which of these historical figures was associated with Citi?",
        options: [
          "Thomas Jefferson",
          "Moses Taylor",
          "J.P. Morgan",
          "Andrew Carnegie"
        ],
        correctOption: 1
      },
      {
        question: "When did Citibank introduce the first ATM?",
        options: [
          "1960",
          "1970",
          "1977",
          "1981"
        ],
        correctOption: 2
      },
      {
        question: "When did Citicorp and Travelers Group merge to form Citigroup?",
        options: [
          "1988",
          "1998",
          "2001",
          "2008"
        ],
        correctOption: 1
      }
    ]
  },
  {
    id: "citi-values-quiz",
    title: "Citi Values & Culture",
    description: "Test your understanding of Citi's core values and culture",
    xpReward: 20,
    questions: [
      {
        question: "Which of these is one of Citi's core leadership principles?",
        options: [
          "Maximize shareholder value above all else",
          "Take ownership and deliver with pride",
          "Compete aggressively in all markets",
          "Maintain exclusive business relationships"
        ],
        correctOption: 1
      },
      {
        question: "What does Citi's mission statement focus on?",
        options: [
          "Financial inclusion and economic progress",
          "Maximizing quarterly profits",
          "Being the largest bank in every market",
          "Providing the most innovative products"
        ],
        correctOption: 0
      },
      {
        question: "Which of these reflects Citi's approach to diversity and inclusion?",
        options: [
          "Meeting minimum regulatory requirements",
          "Focusing exclusively on gender diversity",
          "Valuing different perspectives as a business advantage",
          "Implementing diversity initiatives only in certain regions"
        ],
        correctOption: 2
      }
    ]
  }
];

// Badge data
export const initialBadges: Badge[] = [
  {
    id: "welcome-badge",
    name: "Welcome Badge",
    description: "Awarded for completing your first day of orientation",
    icon: "star",
    iconColor: "citi-gold",
    borderColor: "citi-gold",
    unlocked: true,
    progress: 100
  },
  {
    id: "history-expert",
    name: "History Expert",
    description: "Awarded for mastering Citi's history quiz",
    icon: "book",
    iconColor: "citi-blue",
    borderColor: "citi-blue",
    unlocked: true,
    progress: 100
  },
  {
    id: "hq-explorer",
    name: "HQ Explorer",
    description: "Complete the Headquarters Tour mission",
    icon: "medal",
    iconColor: "citi-gold",
    borderColor: "citi-gold",
    unlocked: false,
    progress: 10
  },
  {
    id: "team-player",
    name: "Team Player",
    description: "Meet with your department team members",
    icon: "users",
    iconColor: "green-500",
    borderColor: "green-500",
    unlocked: false,
    progress: 0
  },
  {
    id: "tech-savvy",
    name: "Tech Savvy",
    description: "Complete the Technology Overview mission",
    icon: "laptop-code",
    iconColor: "purple-500",
    borderColor: "purple-500",
    unlocked: false,
    progress: 0
  }
];

// Leaderboard data
export const initialLeaderboard: LeaderboardEntry[] = [
  {
    id: "user1",
    name: "Michael K.",
    initials: "MK",
    department: "Finance",
    xp: 210,
    isCurrentUser: false
  },
  {
    id: "user2",
    name: "Jane P.",
    initials: "JP",
    department: "Technology",
    xp: 120,
    isCurrentUser: true
  },
  {
    id: "user3",
    name: "Sarah L.",
    initials: "SL",
    department: "Human Resources",
    xp: 115,
    isCurrentUser: false
  }
];
