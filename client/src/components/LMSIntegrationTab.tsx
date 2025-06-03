import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Monitor, 
  Database, 
  User, 
  Clock, 
  Award, 
  BookOpen, 
  CheckCircle, 
  XCircle,
  Play,
  Settings,
  BarChart3,
  Users,
  Calendar,
  Download
} from 'lucide-react';
import scormManager from '@/lib/scorm';
import { useAuth } from '@/contexts/AuthContext';

interface LMSIntegrationTabProps {
  moduleId: string;
  moduleName: string;
  onLaunchScorm: () => void;
}

interface LMSData {
  isConnected: boolean;
  lmsName: string;
  version: string;
  learnerInfo: {
    id: string;
    name: string;
    email: string;
    department: string;
    enrollmentDate: string;
  };
  courseInfo: {
    id: string;
    title: string;
    version: string;
    duration: string;
    attempts: number;
    maxAttempts: number;
  };
  progress: {
    completionStatus: string;
    successStatus: string;
    scoreRaw: number;
    scoreMin: number;
    scoreMax: number;
    location: string;
    timeSpent: string;
    lastAccessed: string;
  };
  reporting: {
    totalLearners: number;
    completedLearners: number;
    averageScore: number;
    averageTime: string;
    passRate: number;
  };
}

export default function LMSIntegrationTab({ moduleId, moduleName, onLaunchScorm }: LMSIntegrationTabProps) {
  const { user } = useAuth();
  const [lmsData, setLmsData] = useState<LMSData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate LMS data fetching
    const fetchLMSData = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if SCORM API is available
      const isConnected = scormManager.isAvailable();
      
      // Mock LMS data based on module and user
      const mockData: LMSData = {
        isConnected,
        lmsName: 'Citi Learning Management System',
        version: 'SCORM 2004 4th Edition',
        learnerInfo: {
          id: user?.id || 'USER001',
          name: user?.name || 'John Doe',
          email: user?.username || 'john.doe@citi.com',
          department: user?.department || 'Corporate Banking',
          enrollmentDate: '2024-01-15'
        },
        courseInfo: {
          id: moduleId.toUpperCase(),
          title: moduleName,
          version: '1.2',
          duration: '45-60 minutes',
          attempts: Math.floor(Math.random() * 3) + 1,
          maxAttempts: 3
        },
        progress: {
          completionStatus: Math.random() > 0.5 ? 'completed' : 'incomplete',
          successStatus: Math.random() > 0.3 ? 'passed' : 'unknown',
          scoreRaw: Math.floor(Math.random() * 40) + 60, // 60-100%
          scoreMin: 0,
          scoreMax: 100,
          location: `slide_${Math.floor(Math.random() * 20) + 1}`,
          timeSpent: `${Math.floor(Math.random() * 45) + 15} minutes`,
          lastAccessed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        reporting: {
          totalLearners: 1247,
          completedLearners: 982,
          averageScore: 87.3,
          averageTime: '52 minutes',
          passRate: 94.2
        }
      };
      
      setLmsData(mockData);
      setIsLoading(false);
    };

    fetchLMSData();
  }, [moduleId, moduleName, user]);

  const handleLaunchTraining = () => {
    onLaunchScorm();
  };

  const handleExportReport = () => {
    // Simulate report export
    const reportData = {
      module: moduleName,
      learner: lmsData?.learnerInfo.name,
      completionDate: new Date().toISOString(),
      score: lmsData?.progress.scoreRaw,
      timeSpent: lmsData?.progress.timeSpent
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${moduleId}_training_report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-600">Connecting to LMS...</p>
        </div>
      </div>
    );
  }

  if (!lmsData) {
    return (
      <div className="text-center p-8">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">LMS Connection Failed</h3>
        <p className="text-gray-600">Unable to connect to the Learning Management System</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* LMS Status Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{lmsData.lmsName}</h2>
              <p className="text-blue-700">{lmsData.version}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant={lmsData.isConnected ? "default" : "secondary"}>
              {lmsData.isConnected ? "Connected" : "Offline Mode"}
            </Badge>
            <Button onClick={handleLaunchTraining} className="bg-blue-600 hover:bg-blue-700">
              <Play className="w-4 h-4 mr-2" />
              Launch Training
            </Button>
          </div>
        </div>
      </div>

      {/* LMS Integration Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="reporting">Reporting</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Learner Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Learner Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{lmsData.learnerInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Employee ID:</span>
                  <span className="font-medium">{lmsData.learnerInfo.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Department:</span>
                  <span className="font-medium">{lmsData.learnerInfo.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Enrolled:</span>
                  <span className="font-medium">{new Date(lmsData.learnerInfo.enrollmentDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Course Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Course Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Course ID:</span>
                  <span className="font-medium">{lmsData.courseInfo.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Version:</span>
                  <span className="font-medium">{lmsData.courseInfo.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{lmsData.courseInfo.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Attempts:</span>
                  <span className="font-medium">{lmsData.courseInfo.attempts}/{lmsData.courseInfo.maxAttempts}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Status */}
          <Card>
            <CardHeader>
              <CardTitle>Training Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{lmsData.progress.scoreRaw}%</div>
                  <div className="text-sm text-gray-600">Current Score</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{lmsData.progress.timeSpent}</div>
                  <div className="text-sm text-gray-600">Time Spent</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Badge variant={lmsData.progress.completionStatus === 'completed' ? "default" : "secondary"}>
                    {lmsData.progress.completionStatus}
                  </Badge>
                  <div className="text-sm text-gray-600 mt-2">Completion</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Badge variant={lmsData.progress.successStatus === 'passed' ? "default" : "secondary"}>
                    {lmsData.progress.successStatus}
                  </Badge>
                  <div className="text-sm text-gray-600 mt-2">Result</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Learning Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Score Progress</span>
                  <span className="text-sm text-gray-600">{lmsData.progress.scoreRaw}% / {lmsData.progress.scoreMax}%</span>
                </div>
                <Progress value={lmsData.progress.scoreRaw} className="h-3" />
              </div>

              {/* Completion Timeline */}
              <div className="space-y-4">
                <h4 className="font-medium">Completion Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div className="flex-1">
                      <div className="font-medium">Training Started</div>
                      <div className="text-sm text-gray-600">{new Date(lmsData.learnerInfo.enrollmentDate).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div className="flex-1">
                      <div className="font-medium">Last Accessed</div>
                      <div className="text-sm text-gray-600">{new Date(lmsData.progress.lastAccessed).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full ${lmsData.progress.completionStatus === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className="flex-1">
                      <div className="font-medium">Training Completed</div>
                      <div className="text-sm text-gray-600">
                        {lmsData.progress.completionStatus === 'completed' ? 'Completed' : 'In Progress'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bookmark Location */}
              <div>
                <h4 className="font-medium mb-2">Current Location</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-900">Bookmarked at: {lmsData.progress.location}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reporting Tab */}
        <TabsContent value="reporting" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Individual Report */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Individual Report</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Time Spent:</span>
                    <span className="font-medium">{lmsData.progress.timeSpent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Best Score:</span>
                    <span className="font-medium">{lmsData.progress.scoreRaw}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Attempts Used:</span>
                    <span className="font-medium">{lmsData.courseInfo.attempts}/{lmsData.courseInfo.maxAttempts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant={lmsData.progress.successStatus === 'passed' ? "default" : "secondary"}>
                      {lmsData.progress.successStatus}
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" onClick={handleExportReport} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </CardContent>
            </Card>

            {/* Aggregate Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Course Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Learners:</span>
                    <span className="font-medium">{lmsData.reporting.totalLearners}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-medium">{lmsData.reporting.completedLearners}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Score:</span>
                    <span className="font-medium">{lmsData.reporting.averageScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pass Rate:</span>
                    <span className="font-medium">{lmsData.reporting.passRate}%</span>
                  </div>
                </div>
                
                {/* Completion Rate Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Completion Rate</span>
                    <span className="text-sm">{Math.round((lmsData.reporting.completedLearners / lmsData.reporting.totalLearners) * 100)}%</span>
                  </div>
                  <Progress value={(lmsData.reporting.completedLearners / lmsData.reporting.totalLearners) * 100} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>SCORM Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">SCORM Package Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Package ID:</span>
                      <span className="font-mono">{moduleId}_v{lmsData.courseInfo.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SCORM Version:</span>
                      <span>2004 4th Edition</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Manifest:</span>
                      <span className="text-blue-600">imsmanifest.xml</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Launch File:</span>
                      <span className="text-blue-600">index.html</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Tracking Settings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Completion Tracking:</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Score Tracking:</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Tracking:</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Suspend Data:</span>
                      <Badge variant="default">Supported</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">API Communication Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${lmsData.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm">LMS API Connection: {lmsData.isConnected ? 'Active' : 'Inactive'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm">Data Synchronization: Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm">Progress Tracking: Operational</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}