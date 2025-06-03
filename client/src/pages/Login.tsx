import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
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

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Welcome to Citi Quest!",
        description: "Successfully logged in. Let's start your onboarding journey!",
      });
      // Use auth context to manage session
      login(data.user, data.progress || {
        level: 1,
        xp: 0,
        completedMissions: [],
        completedQuizzes: [],
        unlockedLocations: ["headquarters"]
      });
      
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
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.username && formData.password) {
      loginMutation.mutate(formData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(207,90%,54%)] to-[hsl(213,56%,24%)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Citi.svg/1280px-Citi.svg.png" 
              alt="Citi Logo" 
              className="h-12"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-[hsl(213,56%,24%)]">
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
              className="w-full bg-[hsl(207,90%,35%)] hover:bg-blue-700"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Start Quest"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              New to Citi? 
              <Button 
                variant="link" 
                className="text-[hsl(207,90%,35%)] pl-1"
                onClick={() => navigate("/cityofciti/register")}
              >
                Create Account
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}