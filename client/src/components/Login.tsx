import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) return;

    setIsLoading(true);
    try {
      const response = await fetch("/cityofciti/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      login(data.user, data.progress);
      
      // Check for intended destination first
      const intendedDestination = localStorage.getItem("intendedDestination");
      if (intendedDestination) {
        localStorage.removeItem("intendedDestination");
        navigate(intendedDestination);
      } else {
        // Redirect based on user role
        if (data.user.role === 'Admin' || data.user.username === 'admin@citi.com') {
          navigate("/cityofciti/admin");
        } else if (data.user.role === 'HR Manager' || data.user.username === 'HR@citi.com') {
          navigate("/cityofciti/hr");
        } else {
          navigate("/cityofciti/");
        }
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const fillDemoCredentials = (username: string, password: string) => {
    setFormData({ username, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-900 flex items-center justify-center p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full">
        {/* Features Panel */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
            <h2 className="text-2xl font-bold mb-4">Transform Your Onboarding Experience</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">65%</span>
                </div>
                <span>Time Reduction in Training Completion</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">94%</span>
                </div>
                <span>Employee Engagement Score</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">$325K</span>
                </div>
                <span>Annual Cost Savings</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">87%</span>
                </div>
                <span>Training Completion Rate</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">23%</span>
                </div>
                <span>Employee Retention Improvement</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
            <h3 className="text-xl font-bold mb-3">Platform Features</h3>
            <ul className="space-y-2 text-sm">
              <li>• RPG-Style Gamified Learning Experience</li>
              <li>• Interactive City Map with Mission Zones</li>
              <li>• Real-time Analytics & Performance Tracking</li>
              <li>• AI-Powered Training Chatbot Assistant</li>
              <li>• Comprehensive HR Dashboard with ROI Analysis</li>
              <li>• Mobile-Responsive Adaptive Design</li>
              <li>• Leaderboards & Achievement System</li>
              <li>• Knowledge Retention Games & Quizzes</li>
            </ul>
          </div>
        </div>

        {/* Login Panel */}
        <Card className="w-full bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Citi.svg/1280px-Citi.svg.png" 
                alt="Citi Logo" 
                className="h-12"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-900">
              Welcome to Citi Quest
            </CardTitle>
            <CardDescription>
              Login to start your gamified onboarding adventure
            </CardDescription>
          </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || !formData.username || !formData.password}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                "Start Quest"
              )}
            </Button>
          </form>
          
          <div className="mt-6 space-y-4">
            <div className="text-center border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Demo Credentials</p>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials("user@citi.com", "Citi@123")}
                  className="bg-blue-50 hover:bg-blue-100 p-2 rounded border text-left transition-colors cursor-pointer"
                >
                  <strong>New Employee:</strong> user@citi.com / Citi@123
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials("admin@citi.com", "Admin@123")}
                  className="bg-green-50 hover:bg-green-100 p-2 rounded border text-left transition-colors cursor-pointer"
                >
                  <strong>System Admin:</strong> admin@citi.com / Admin@123
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials("HR@citi.com", "HRCiti@123")}
                  className="bg-purple-50 hover:bg-purple-100 p-2 rounded border text-left transition-colors cursor-pointer"
                >
                  <strong>HR Analytics:</strong> HR@citi.com / HRCiti@123
                </button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                New to Citi? 
                <Button 
                  variant="link" 
                  className="text-blue-600 pl-1"
                  onClick={() => navigate("/cityofciti/register")}
                >
                  Create Account
                </Button>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}