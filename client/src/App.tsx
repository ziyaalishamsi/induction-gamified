import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";

import Missions from "@/pages/Missions";
import Rewards from "@/pages/Rewards";
import Games from "@/pages/Games";
import AdminDashboard from "@/pages/AdminDashboard";
import HRDashboard from "@/pages/HRDashboard";
import { GameStateProvider } from "./contexts/GameStateContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import TrainingModule from "./pages/TrainingModule";
import OnboardingDashboard from "./pages/OnboardingDashboard";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-4 h-4 bg-white rounded-full animate-ping"></div>
          </div>
          <p>Loading your quest...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Login />;
  }
  
  return <Component />;
}

function RedirectComponent({ to }: { to: string }) {
  const [, navigate] = useLocation();
  
  React.useEffect(() => {
    navigate(to);
  }, [navigate, to]);
  
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/cityofciti/login" component={Login} />
      <Route path="/cityofciti/register" component={Register} />
      <Route path="/cityofciti/admin" component={() => <ProtectedRoute component={AdminDashboard} />} />
      <Route path="/cityofciti/hr" component={() => <ProtectedRoute component={HRDashboard} />} />
      <Route path="/cityofciti/onboarding" component={() => <ProtectedRoute component={OnboardingDashboard} />} />
      <Route path="/cityofciti/training/:moduleId" component={() => <ProtectedRoute component={TrainingModule} />} />
      <Route path="/cityofciti/" component={() => <ProtectedRoute component={Home} />} />

      <Route path="/cityofciti/missions" component={() => <ProtectedRoute component={Missions} />} />
      <Route path="/cityofciti/games" component={() => <ProtectedRoute component={Games} />} />
      <Route path="/cityofciti/rewards" component={() => <ProtectedRoute component={Rewards} />} />
      <Route path="/login" component={() => <RedirectComponent to="/cityofciti/login" />} />
      <Route path="/register" component={() => <RedirectComponent to="/cityofciti/register" />} />
      <Route path="/" component={() => <ProtectedRoute component={Home} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <GameStateProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Layout>
              <Router />
            </Layout>
          </TooltipProvider>
        </QueryClientProvider>
      </GameStateProvider>
    </AuthProvider>
  );
}

export default App;
