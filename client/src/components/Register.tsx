import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

const departments = [
  "Technology",
  "Finance",
  "Client Services", 
  "Human Resources",
  "Operations"
];

const roles = [
  "Specialist",
  "Analyst",
  "Manager", 
  "Director"
];

const experiences = [
  "New Graduate",
  "1-3 Years",
  "4-7 Years",
  "8+ Years"
];

export default function Register() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    department: "",
    role: "",
    experience: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!Object.values(formData).every(field => field)) {
      toast({
        title: "Registration Failed",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/cityofciti/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast({
        title: "Welcome to the Team!",
        description: "Account created successfully. Let's begin your Citi adventure!"
      });

      navigate("/cityofciti/login");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Citi.svg/1280px-Citi.svg.png" 
              alt="Citi Logo" 
              className="h-12"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-900">
            Join Citi Quest
          </CardTitle>
          <CardDescription>
            Create your account and customize your onboarding journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  placeholder="Choose username"
                  required
                />
              </div>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Create password"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Department</Label>
                <Select value={formData.department} onValueChange={(value) => handleChange("department", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Role</Label>
                <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Experience Level</Label>
              <Select value={formData.experience} onValueChange={(value) => handleChange("experience", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  {experiences.map(exp => (
                    <SelectItem key={exp} value={exp}>{exp}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Begin Adventure"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?
              <Button 
                variant="link" 
                className="text-blue-600 pl-1"
                onClick={() => navigate("/cityofciti/login")}
              >
                Login
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}