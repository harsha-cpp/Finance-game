import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { BusinessProvider } from "@/context/BusinessContext";

import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import BusinessSetup from "@/pages/BusinessSetup";
import Dashboard from "@/pages/Dashboard";
import Leaderboard from "@/pages/Leaderboard";

function Router() {
  // Initialize toast hook for global notifications
  const { toast } = useToast();

  // Handle errors from React Query and show toast notifications
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event: any) => {
      if (event.type === 'error' && event.query?.state.error) {
        const error = event.query.state.error as Error;
        toast({
          title: "Error",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });

    return () => unsubscribe();
  }, [toast]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/setup" component={BusinessSetup} />
      <Route path="/dashboard/:id" component={Dashboard} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BusinessProvider>
        <Router />
        <Toaster />
      </BusinessProvider>
    </QueryClientProvider>
  );
}

export default App;
