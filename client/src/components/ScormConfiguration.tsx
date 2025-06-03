import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Upload, ExternalLink, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ScormPackage {
  id: string;
  name: string;
  version: string;
  url: string;
  manifestUrl: string;
  launchUrl: string;
  description: string;
  duration: string;
  completionThreshold: number;
  masteryScore: number;
  trackingEnabled: boolean;
}

interface ScormConfigurationProps {
  moduleId: string;
  currentConfig?: ScormPackage;
  onSave: (config: ScormPackage) => void;
  onClose: () => void;
}

export default function ScormConfiguration({
  moduleId,
  currentConfig,
  onSave,
  onClose
}: ScormConfigurationProps) {
  const { user } = useAuth();
  const [config, setConfig] = useState<ScormPackage>({
    id: moduleId,
    name: '',
    version: '2004',
    url: '',
    manifestUrl: '',
    launchUrl: '',
    description: '',
    duration: '60',
    completionThreshold: 80,
    masteryScore: 80,
    trackingEnabled: true,
    ...currentConfig
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (currentConfig) {
      setConfig(currentConfig);
    }
  }, [currentConfig]);

  const handleInputChange = (field: keyof ScormPackage, value: string | number | boolean) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setValidationErrors([]);
  };

  const validateConfiguration = (): boolean => {
    const errors: string[] = [];

    if (!config.name.trim()) {
      errors.push('Package name is required');
    }

    if (!config.url.trim()) {
      errors.push('Package URL is required');
    }

    if (!config.launchUrl.trim()) {
      errors.push('Launch URL is required');
    }

    if (config.completionThreshold < 0 || config.completionThreshold > 100) {
      errors.push('Completion threshold must be between 0 and 100');
    }

    if (config.masteryScore < 0 || config.masteryScore > 100) {
      errors.push('Mastery score must be between 0 and 100');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      setValidationErrors(['Please upload a valid SCORM package (.zip file)']);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('scormPackage', file);
      formData.append('moduleId', moduleId);

      const response = await fetch('/api/scorm/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const uploadResult = await response.json();
        
        // Update configuration with uploaded package info
        setConfig(prev => ({
          ...prev,
          url: uploadResult.packageUrl,
          manifestUrl: uploadResult.manifestUrl,
          launchUrl: uploadResult.launchUrl,
          name: uploadResult.title || prev.name,
          description: uploadResult.description || prev.description
        }));

        setUploadProgress(100);
      } else {
        const error = await response.text();
        setValidationErrors([`Upload failed: ${error}`]);
      }
    } catch (error) {
      setValidationErrors([`Upload error: ${error}`]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    if (validateConfiguration()) {
      onSave(config);
    }
  };

  const handleTestLaunch = () => {
    if (config.launchUrl) {
      window.open(config.launchUrl, '_blank', 'width=800,height=600');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">SCORM Configuration</h2>
                <p className="text-gray-600">Configure SCORM package for module: {moduleId}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="packageName">Package Name</Label>
                  <Input
                    id="packageName"
                    value={config.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter SCORM package name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="version">SCORM Version</Label>
                  <Select value={config.version} onValueChange={(value) => handleInputChange('version', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.2">SCORM 1.2</SelectItem>
                      <SelectItem value="2004">SCORM 2004</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={config.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter package description"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={config.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="60"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Package URLs */}
            <Card>
              <CardHeader>
                <CardTitle>Package URLs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="packageUrl">Package URL</Label>
                  <Input
                    id="packageUrl"
                    value={config.url}
                    onChange={(e) => handleInputChange('url', e.target.value)}
                    placeholder="https://your-lms.com/scorm/package.zip"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manifestUrl">Manifest URL (imsmanifest.xml)</Label>
                  <Input
                    id="manifestUrl"
                    value={config.manifestUrl}
                    onChange={(e) => handleInputChange('manifestUrl', e.target.value)}
                    placeholder="https://your-lms.com/scorm/imsmanifest.xml"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="launchUrl">Launch URL</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="launchUrl"
                      value={config.launchUrl}
                      onChange={(e) => handleInputChange('launchUrl', e.target.value)}
                      placeholder="https://your-lms.com/scorm/index.html"
                    />
                    {config.launchUrl && (
                      <Button variant="outline" size="icon" onClick={handleTestLaunch}>
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="scormUpload">Upload SCORM Package</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      id="scormUpload"
                      accept=".zip"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="scormUpload"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Click to upload SCORM package (.zip)
                      </span>
                    </label>
                    
                    {isUploading && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Uploading... {uploadProgress}%</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Tracking & Scoring</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="trackingEnabled">Enable LMS Tracking</Label>
                  <Switch
                    id="trackingEnabled"
                    checked={config.trackingEnabled}
                    onCheckedChange={(checked) => handleInputChange('trackingEnabled', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="completionThreshold">Completion Threshold (%)</Label>
                  <Input
                    id="completionThreshold"
                    type="number"
                    min="0"
                    max="100"
                    value={config.completionThreshold}
                    onChange={(e) => handleInputChange('completionThreshold', parseInt(e.target.value))}
                  />
                  <p className="text-sm text-gray-500">
                    Minimum progress percentage to mark as completed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="masteryScore">Mastery Score (%)</Label>
                  <Input
                    id="masteryScore"
                    type="number"
                    min="0"
                    max="100"
                    value={config.masteryScore}
                    onChange={(e) => handleInputChange('masteryScore', parseInt(e.target.value))}
                  />
                  <p className="text-sm text-gray-500">
                    Minimum score percentage to mark as passed
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Status & Validation */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Configuration Status:</span>
                  <Badge variant={validationErrors.length === 0 ? "default" : "destructive"}>
                    {validationErrors.length === 0 ? "Valid" : "Invalid"}
                  </Badge>
                </div>

                {validationErrors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-red-800">Validation Errors:</h4>
                        <ul className="text-sm text-red-700 mt-1 list-disc list-inside">
                          {validationErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Module ID:</strong> {moduleId}
                  </div>
                  <div className="text-sm">
                    <strong>SCORM Version:</strong> {config.version}
                  </div>
                  <div className="text-sm">
                    <strong>Tracking:</strong> {config.trackingEnabled ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Configure SCORM package settings for LMS integration
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={validationErrors.length > 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}