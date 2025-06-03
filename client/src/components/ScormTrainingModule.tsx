import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, BookOpen, Clock, User, Award } from 'lucide-react';
import scormManager from '@/lib/scorm';
import { useAuth } from '@/contexts/AuthContext';

interface ScormTrainingModuleProps {
  moduleId: string;
  moduleName: string;
  scormPackageUrl?: string;
  onComplete: (score: number, passed: boolean) => void;
  onClose: () => void;
}

export default function ScormTrainingModule({
  moduleId,
  moduleName,
  scormPackageUrl,
  onComplete,
  onClose
}: ScormTrainingModuleProps) {
  const { user } = useAuth();
  const [isScormAvailable, setIsScormAvailable] = useState(false);
  const [learnerInfo, setLearnerInfo] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [sessionStartTime] = useState(new Date());
  const [currentLocation, setCurrentLocation] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Initialize SCORM when component mounts
    const initializeScorm = async () => {
      const initialized = scormManager.initialize();
      setIsScormAvailable(initialized);

      if (initialized) {
        // Get learner information from LMS
        const info = scormManager.getLearnerInfo();
        setLearnerInfo(info);

        // Restore previous location if available
        if (info.location) {
          setCurrentLocation(info.location);
        }

        // Check if already completed
        if (info.completionStatus === 'completed') {
          setIsCompleted(true);
          setScore(info.scoreRaw || 0);
          setProgress(100);
        }

        console.log('SCORM initialized for module:', moduleName);
        console.log('Learner info:', info);
      }
    };

    initializeScorm();

    // Cleanup on unmount
    return () => {
      if (isScormAvailable) {
        scormManager.setSessionTime(sessionStartTime);
        scormManager.commit();
      }
    };
  }, [moduleName, isScormAvailable, sessionStartTime]);

  // Handle progress updates from SCORM content
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      const { type, data } = event.data;

      switch (type) {
        case 'scorm_progress':
          updateProgress(data.progress);
          break;
        case 'scorm_score':
          updateScore(data.score);
          break;
        case 'scorm_location':
          updateLocation(data.location);
          break;
        case 'scorm_complete':
          handleCompletion(data.score, data.passed);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const updateProgress = (progressValue: number) => {
    setProgress(progressValue);
    
    if (isScormAvailable) {
      // Update completion status based on progress
      if (progressValue >= 100) {
        scormManager.setCompletionStatus('completed');
      } else {
        scormManager.setCompletionStatus('incomplete');
      }
      scormManager.commit();
    }
  };

  const updateScore = (scoreValue: number) => {
    setScore(scoreValue);
    
    if (isScormAvailable) {
      scormManager.setScore(scoreValue);
      scormManager.commit();
    }
  };

  const updateLocation = (location: string) => {
    setCurrentLocation(location);
    
    if (isScormAvailable) {
      scormManager.setLocation(location);
      scormManager.commit();
    }
  };

  const handleCompletion = (finalScore: number, passed: boolean) => {
    setScore(finalScore);
    setIsCompleted(true);
    setProgress(100);

    if (isScormAvailable) {
      scormManager.setScore(finalScore);
      scormManager.setCompletionStatus('completed');
      scormManager.setSuccessStatus(passed ? 'passed' : 'failed');
      scormManager.setSessionTime(sessionStartTime);
      scormManager.commit();
    }

    onComplete(finalScore, passed);
  };

  const handleExit = () => {
    if (isScormAvailable) {
      scormManager.setSessionTime(sessionStartTime);
      scormManager.commit();
      scormManager.terminate();
    }
    onClose();
  };

  const handleSuspendData = (data: any) => {
    if (isScormAvailable) {
      scormManager.setSuspendData(JSON.stringify(data));
      scormManager.commit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{moduleName}</h2>
              <p className="text-gray-600">SCORM Training Module</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* SCORM Status Indicator */}
            <Badge variant={isScormAvailable ? "default" : "secondary"}>
              {isScormAvailable ? "LMS Connected" : "Standalone Mode"}
            </Badge>
            
            {/* Progress */}
            {progress > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Progress:</span>
                <div className="w-24">
                  <Progress value={progress} className="h-2" />
                </div>
                <span className="text-sm font-medium">{Math.round(progress)}%</span>
              </div>
            )}
            
            <Button variant="outline" onClick={handleExit}>
              Exit Training
            </Button>
          </div>
        </div>

        {/* Learner Info Panel */}
        {isScormAvailable && learnerInfo && (
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Learner:</span>
                <span>{learnerInfo.learnerName || user?.name || 'Unknown'}</span>
              </div>
              
              {learnerInfo.completionStatus && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Status:</span>
                  <Badge variant={learnerInfo.completionStatus === 'completed' ? 'default' : 'secondary'}>
                    {learnerInfo.completionStatus}
                  </Badge>
                </div>
              )}
              
              {score > 0 && (
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Score:</span>
                  <span>{score}%</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Training Content */}
        <div className="flex-1 p-6">
          {scormPackageUrl ? (
            // SCORM Package Content
            <iframe
              ref={iframeRef}
              src={scormPackageUrl}
              className="w-full h-full border rounded-lg"
              title={`SCORM Training: ${moduleName}`}
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          ) : (
            // Fallback: Default Training Content
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  <span>SCORM Package Not Available</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  This training module is configured for SCORM delivery but no package URL was provided.
                </p>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-800 mb-2">SCORM Integration Status:</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• LMS API: {isScormAvailable ? 'Connected' : 'Not Available'}</li>
                    <li>• Module ID: {moduleId}</li>
                    <li>• Content Package: {scormPackageUrl ? 'Configured' : 'Missing'}</li>
                  </ul>
                </div>

                {isScormAvailable && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">LMS Information:</h4>
                    <pre className="text-xs text-blue-700 bg-blue-100 p-2 rounded overflow-auto">
                      {JSON.stringify(learnerInfo, null, 2)}
                    </pre>
                  </div>
                )}

                <div className="flex space-x-4">
                  <Button 
                    onClick={() => handleCompletion(85, true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Mark as Completed (85%)
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => updateProgress(50)}
                  >
                    Set 50% Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>Module: {moduleId}</span>
              {currentLocation && <span>Location: {currentLocation}</span>}
            </div>
            <div className="flex items-center space-x-4">
              <span>Session Started: {sessionStartTime.toLocaleTimeString()}</span>
              {isScormAvailable && (
                <span className="text-green-600 font-medium">LMS Tracking Active</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}