import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, Download, FileText, Shield, Cloud, Users, 
  Phone, Calendar, Monitor, Headphones, AlertTriangle, 
  DollarSign, Building, Target, Coffee, Heart, User,
  Laptop, Settings, Award, MapPin
} from "lucide-react";

interface OnboardingResource {
  id: string;
  category: 'policy' | 'contact' | 'software' | 'template' | 'guideline';
  title: string;
  description: string;
  content: string;
  downloadUrl?: string;
  contactEmail?: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

interface DeviceRequest {
  id: string;
  requestType: 'chair' | 'monitor' | 'keyboard' | 'headphone' | 'laptop' | 'other';
  description: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'delivered' | 'rejected';
  requestedAt: Date;
}

interface RampupMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  completed: boolean;
  managerFeedback?: string;
}

export default function OnboardingDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [onboardingResources, setOnboardingResources] = useState<OnboardingResource[]>([]);
  const [deviceRequests, setDeviceRequests] = useState<DeviceRequest[]>([]);
  const [rampupPlan, setRampupPlan] = useState<RampupMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeviceRequest, setShowDeviceRequest] = useState(false);
  const [showIncidentReport, setShowIncidentReport] = useState(false);

  useEffect(() => {
    loadOnboardingData();
  }, [user]);

  const loadOnboardingData = async () => {
    try {
      const [resourcesRes, requestsRes, rampupRes] = await Promise.all([
        fetch('/api/onboarding/resources', { credentials: 'include' }),
        fetch('/api/onboarding/device-requests', { credentials: 'include' }),
        fetch('/api/onboarding/rampup-plan', { credentials: 'include' })
      ]);

      if (resourcesRes.ok) {
        const resources = await resourcesRes.json();
        setOnboardingResources(resources);
      }
      
      if (requestsRes.ok) {
        const requests = await requestsRes.json();
        setDeviceRequests(requests);
      }

      if (rampupRes.ok) {
        const plan = await rampupRes.json();
        setRampupPlan(plan.milestones || []);
      }
    } catch (error) {
      console.error('Error loading onboarding data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Essential onboarding resources with all 22 features
  const essentialResources = [
    {
      id: '1',
      category: 'contact' as const,
      title: 'Important Email Contacts',
      description: 'Key email addresses for various departments and services',
      content: 'IT Support: it-support@citi.com\nHR Team: hr-team@citi.com\nSecurity: security@citi.com\nFacilities: facilities@citi.com',
      contactEmail: 'hr-team@citi.com',
      priority: 'high' as const,
      icon: '📧'
    },
    {
      id: '2',
      category: 'software' as const,
      title: 'Software Downloads',
      description: 'Essential software and applications for new joiners',
      content: 'Microsoft Office Suite, VPN Client, Citi Banking Applications, Security Tools',
      downloadUrl: 'https://citi-internal.com/software-portal',
      priority: 'high' as const,
      icon: '💻'
    },
    {
      id: '3',
      category: 'policy' as const,
      title: 'Leave Policy',
      description: 'Comprehensive leave policy including vacation, sick, and personal time',
      content: 'Annual Leave: 25 days\nSick Leave: 10 days\nPersonal Days: 5 days\nMaternity/Paternity: 12 weeks',
      priority: 'high' as const,
      icon: '🏖️'
    },
    {
      id: '4',
      category: 'policy' as const,
      title: 'ESPP Policy',
      description: 'Employee Stock Purchase Plan details and enrollment',
      content: 'Enroll in ESPP to purchase Citi shares at discounted rates. Contact benefits@citi.com for enrollment.',
      contactEmail: 'benefits@citi.com',
      priority: 'medium' as const,
      icon: '💰'
    },
    {
      id: '5',
      category: 'contact' as const,
      title: 'Your HR Contact',
      description: 'Direct HR representative for your department',
      content: 'Your assigned HR representative will contact you within 24 hours.',
      contactEmail: 'hr-assignment@citi.com',
      priority: 'high' as const,
      icon: '👥'
    },
    {
      id: '6',
      category: 'contact' as const,
      title: 'IT Support & Laptop Issues',
      description: 'Technical support for hardware and software issues',
      content: 'Phone: +1-800-CITI-IT\nEmail: it-helpdesk@citi.com\nPortal: https://citi-servicedesk.com',
      contactEmail: 'it-helpdesk@citi.com',
      priority: 'high' as const,
      icon: '🔧'
    },
    {
      id: '7',
      category: 'guideline' as const,
      title: 'HR Ticket System',
      description: 'How to raise HR tickets for various requests',
      content: 'Use ServiceNow portal at https://citi-hr.service-now.com or email hr-tickets@citi.com',
      priority: 'medium' as const,
      icon: '🎫'
    },
    {
      id: '8',
      category: 'contact' as const,
      title: 'Security & Incident Reporting',
      description: 'Report security incidents, exploitation, or safety concerns',
      content: 'Emergency: Call Security at ext. 911\nNon-emergency: security-incidents@citi.com\nAnonymous: Use EthicsLine portal',
      contactEmail: 'security-incidents@citi.com',
      priority: 'high' as const,
      icon: '🛡️'
    },
    {
      id: '9',
      category: 'guideline' as const,
      title: 'Cloud Deployment Requirements',
      description: 'Guidelines for cloud infrastructure and deployment configurations',
      content: 'All deployments must follow Citi Cloud Standards. Contact cloud-team@citi.com for approvals.',
      contactEmail: 'cloud-team@citi.com',
      priority: 'medium' as const,
      icon: '☁️'
    },
    {
      id: '10',
      category: 'contact' as const,
      title: 'Find Your Buddy',
      description: 'Buddy assignment program for new joiners',
      content: 'Your manager will assign a buddy within 48 hours. For immediate assignment, email buddy-program@citi.com',
      contactEmail: 'buddy-program@citi.com',
      priority: 'high' as const,
      icon: '🤝'
    },
    {
      id: '11',
      category: 'policy' as const,
      title: 'Insurance Coverage',
      description: 'Health, dental, vision, and life insurance details',
      content: 'Comprehensive coverage available. Contact benefits-team@citi.com for enrollment and claims.',
      contactEmail: 'benefits-team@citi.com',
      priority: 'high' as const,
      icon: '🏥'
    },
    {
      id: '12',
      category: 'contact' as const,
      title: 'Mental Health & Stress Support',
      description: '24/7 mental health and stress management resources',
      content: 'Employee Assistance Program: 1-800-CITI-EAP\nConfidential counseling and stress management support',
      priority: 'high' as const,
      icon: '💚'
    },
    {
      id: '13',
      category: 'guideline' as const,
      title: 'Holiday Calendar',
      description: 'Company holidays and important dates for current year',
      content: 'Download current year holiday calendar and important company events schedule.',
      downloadUrl: '/api/onboarding/holiday-calendar',
      priority: 'medium' as const,
      icon: '📅'
    },
    {
      id: '14',
      category: 'template' as const,
      title: 'Resource Center',
      description: 'Approved templates, PPT formats, and icon library',
      content: 'Access brand-compliant templates and presentation formats.',
      downloadUrl: '/api/onboarding/templates',
      priority: 'medium' as const,
      icon: '📊'
    },
    {
      id: '15',
      category: 'policy' as const,
      title: 'Reimbursement Policy',
      description: 'Expense reimbursement guidelines and application process',
      content: 'Submit expenses via Concur system. Max limits: Travel $200/day, Meals $75/day',
      downloadUrl: '/api/onboarding/expense-policy',
      priority: 'medium' as const,
      icon: '💳'
    }
  ];

  const handleDeviceRequest = async (data: any) => {
    try {
      const response = await fetch('/api/onboarding/device-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (response.ok) {
        toast({ title: "Device request submitted successfully!" });
        setShowDeviceRequest(false);
        loadOnboardingData();
      }
    } catch (error) {
      toast({ title: "Failed to submit device request", variant: "destructive" });
    }
  };

  const handleIncidentReport = async (data: any) => {
    try {
      const response = await fetch('/api/onboarding/incident-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (response.ok) {
        toast({ title: "Incident report submitted successfully!" });
        setShowIncidentReport(false);
      }
    } catch (error) {
      toast({ title: "Failed to submit incident report", variant: "destructive" });
    }
  };

  const calculateProgress = () => {
    const totalMilestones = rampupPlan.length;
    const completedMilestones = rampupPlan.filter(m => m.completed).length;
    return totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your onboarding dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to Citi, {user?.name}!
          </h1>
          <p className="text-xl text-gray-600">
            Your comprehensive onboarding journey starts here
          </p>
          <div className="mt-4 flex items-center space-x-4">
            <Badge variant="outline" className="text-lg px-3 py-1">
              {user?.persona === 'manager' ? '👨‍💼 Manager' : 
               user?.persona === 'director' ? '👔 Director' : '👨‍💻 Employee'}
            </Badge>
            <Badge variant="outline" className="text-lg px-3 py-1">
              📅 Day {Math.ceil((Date.now() - new Date(user?.hireDate || Date.now()).getTime()) / (1000 * 60 * 60 * 24))}
            </Badge>
          </div>
        </div>

        {/* Progress Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Your Onboarding Progress</CardTitle>
            <CardDescription className="text-blue-100">
              Complete your ramp-up milestones to become fully productive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Progress value={calculateProgress()} className="flex-1 h-3" />
              <span className="text-xl font-bold">{Math.round(calculateProgress())}%</span>
            </div>
            <p className="mt-2 text-blue-100">
              {rampupPlan.filter(m => m.completed).length} of {rampupPlan.length} milestones completed
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="essentials" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="essentials">Essentials</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="rampup">Ramp-up</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>

          {/* Essential Resources Tab */}
          <TabsContent value="essentials">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {essentialResources.filter(r => r.priority === 'high').map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{resource.icon}</span>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                    </div>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{resource.content}</p>
                    <div className="flex space-x-2">
                      {resource.downloadUrl && (
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                      {resource.contactEmail && (
                        <Button size="sm" variant="outline">
                          <Mail className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Device Requests Tab */}
          <TabsContent value="requests">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Device & Equipment Requests</h2>
                <Dialog open={showDeviceRequest} onOpenChange={setShowDeviceRequest}>
                  <DialogTrigger asChild>
                    <Button>
                      <Monitor className="w-4 h-4 mr-2" />
                      New Request
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Request Equipment</DialogTitle>
                      <DialogDescription>
                        Request ergonomic equipment or hardware for your workspace
                      </DialogDescription>
                    </DialogHeader>
                    <DeviceRequestForm onSubmit={handleDeviceRequest} />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { type: 'chair', icon: '🪑', title: 'Ergonomic Chair' },
                  { type: 'monitor', icon: '🖥️', title: 'External Monitor' },
                  { type: 'keyboard', icon: '⌨️', title: 'Ergonomic Keyboard' },
                  { type: 'headphone', icon: '🎧', title: 'Noise-Canceling Headphones' }
                ].map((item) => (
                  <Card key={item.type} className="text-center cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setShowDeviceRequest(true)}>
                    <CardContent className="pt-6">
                      <div className="text-4xl mb-2">{item.icon}</div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-2">Click to request</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Current Requests */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Your Current Requests</h3>
                {deviceRequests.length > 0 ? (
                  deviceRequests.map((request) => (
                    <Card key={request.id}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold capitalize">{request.requestType}</h4>
                            <p className="text-sm text-gray-600">{request.description}</p>
                            <p className="text-xs text-gray-500">
                              Requested: {new Date(request.requestedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={request.status === 'approved' ? 'default' : 'secondary'}>
                            {request.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-600">No active requests</p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Ramp-up Plan Tab */}
          <TabsContent value="rampup">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Your 90-Day Ramp-up Plan</h2>
              
              <div className="grid gap-4">
                {rampupPlan.map((milestone, index) => (
                  <Card key={milestone.id} className={milestone.completed ? 'bg-green-50 border-green-200' : ''}>
                    <CardContent className="pt-4">
                      <div className="flex items-start space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold
                          ${milestone.completed ? 'bg-green-500' : 'bg-gray-400'}`}>
                          {milestone.completed ? '✓' : index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{milestone.title}</h3>
                          <p className="text-gray-600 mb-2">{milestone.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Target: {new Date(milestone.targetDate).toLocaleDateString()}</span>
                            {milestone.completed && milestone.completedAt && (
                              <span>Completed: {new Date(milestone.completedAt).toLocaleDateString()}</span>
                            )}
                          </div>
                          {milestone.managerFeedback && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-800">
                                <strong>Manager Feedback:</strong> {milestone.managerFeedback}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Quick Actions */}
          <div className="fixed bottom-6 right-6 space-y-2">
            <Dialog open={showIncidentReport} onOpenChange={setShowIncidentReport}>
              <DialogTrigger asChild>
                <Button size="lg" variant="destructive" className="shadow-lg">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Report Incident
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Report Security Incident</DialogTitle>
                  <DialogDescription>
                    Report security concerns, exploitation, or safety issues
                  </DialogDescription>
                </DialogHeader>
                <IncidentReportForm onSubmit={handleIncidentReport} />
              </DialogContent>
            </Dialog>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

// Device Request Form Component
function DeviceRequestForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    requestType: '',
    description: '',
    urgency: 'medium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="requestType">Equipment Type</Label>
        <Select value={formData.requestType} onValueChange={(value) => setFormData({...formData, requestType: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select equipment type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chair">Ergonomic Chair</SelectItem>
            <SelectItem value="monitor">External Monitor</SelectItem>
            <SelectItem value="keyboard">Ergonomic Keyboard</SelectItem>
            <SelectItem value="headphone">Noise-Canceling Headphones</SelectItem>
            <SelectItem value="laptop">Laptop Upgrade</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Describe your equipment need..."
          required
        />
      </div>
      
      <div>
        <Label htmlFor="urgency">Urgency</Label>
        <Select value={formData.urgency} onValueChange={(value) => setFormData({...formData, urgency: value})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit" className="w-full">Submit Request</Button>
    </form>
  );
}

// Incident Report Form Component
function IncidentReportForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    severity: 'medium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="type">Incident Type</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select incident type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="security">Security Breach</SelectItem>
            <SelectItem value="exploitation">Exploitation</SelectItem>
            <SelectItem value="harassment">Harassment</SelectItem>
            <SelectItem value="safety">Safety Concern</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Brief incident title"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Detailed incident description..."
          required
        />
      </div>
      
      <div>
        <Label htmlFor="severity">Severity</Label>
        <Select value={formData.severity} onValueChange={(value) => setFormData({...formData, severity: value})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit" variant="destructive" className="w-full">Submit Report</Button>
    </form>
  );
}