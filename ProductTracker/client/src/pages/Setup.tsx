import { useEffect } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Setup() {
  const { state, openBusinessSetup } = useGameContext();
  const [location, navigate] = useLocation();
  
  useEffect(() => {
    // If already has a business, redirect to dashboard
    if (state.business) {
      navigate("/");
    }
    
    // Show setup modal automatically
    if (!state.showBusinessSetup) {
      openBusinessSetup();
    }
  }, [state.business, state.showBusinessSetup, navigate, openBusinessSetup]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <i className="fa-solid fa-rocket text-primary-500 text-5xl mb-4"></i>
          <h1 className="text-3xl font-bold font-heading text-gray-900 mb-2">StartupSim</h1>
          <p className="text-gray-600">
            Simulate the journey of building a successful startup from scratch
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold mb-4">Get Started</h2>
          <p className="text-gray-600 mb-6">
            Create your virtual startup and make strategic decisions to grow your business.
            Manage finances, develop products, hire talent, and compete in a simulated market.
          </p>
          
          <Button 
            onClick={openBusinessSetup} 
            className="w-full"
            size="lg"
          >
            Create Your Startup
          </Button>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>Already have an account? <Link href="/login" className="text-primary-600 hover:underline">Log in</Link></p>
        </div>
      </div>
    </div>
  );
}
