import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useGameContext } from "@/contexts/GameContext";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { state } = useGameContext();
  const isLoading = state.isLoading || !state.isInitialized;
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <i className="fa-solid fa-rocket text-primary-500 text-4xl animate-bounce mb-4"></i>
          <p className="text-gray-600">Loading your startup journey...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
