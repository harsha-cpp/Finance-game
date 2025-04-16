import { useState } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Header() {
  const { state, advanceTime, setTimeControls } = useGameContext();
  const isMobile = useIsMobile();
  
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  
  const handlePlay = () => {
    setTimeControls({
      ...state.timeControls,
      isPaused: !state.timeControls.isPaused
    });
  };
  
  const handleFastForward = () => {
    setTimeControls({
      isPaused: false,
      speed: state.timeControls.speed === 'normal' ? 'fast' : 'normal'
    });
  };
  
  const handleAdvanceTime = () => {
    advanceTime();
  };
  
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-500 focus:outline-none"
          onClick={toggleSidebar}
        >
          <i className="fa-solid fa-bars text-lg"></i>
        </button>

        {/* Page Title (Mobile Only) */}
        <h1 className="md:hidden font-heading font-bold text-xl text-gray-800">
          <i className="fa-solid fa-rocket text-primary-500 mr-2"></i>
          StartupSim
        </h1>

        {/* Right Side Navigation Items */}
        <div className="flex items-center space-x-4">
          {/* Time Controls */}
          {state.business && (
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-md">
              <span className="text-sm font-medium text-gray-700">
                Q{state.business.currentQuarter} Year {state.business.currentYear}
              </span>
              <button 
                className={`text-gray-600 hover:text-primary-500 focus:outline-none ${state.timeControls.isPaused ? '' : 'text-primary-500'}`}
                onClick={handlePlay}
              >
                <i className={`fa-solid ${state.timeControls.isPaused ? 'fa-play' : 'fa-pause'}`}></i>
              </button>
              <button 
                className={`text-gray-600 hover:text-primary-500 focus:outline-none ${state.timeControls.speed === 'fast' ? 'text-primary-500' : ''}`}
                onClick={handleFastForward}
              >
                <i className="fa-solid fa-forward"></i>
              </button>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2 text-xs"
                onClick={handleAdvanceTime}
              >
                Advance
              </Button>
            </div>
          )}

          {/* Notifications */}
          <button className="relative text-gray-500 hover:text-primary-500 focus:outline-none">
            <i className="fa-solid fa-bell text-lg"></i>
            {state.decisions.filter(d => d.urgency === 'urgent' && !d.isCompleted).length > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-danger-500 rounded-full text-xs text-white flex items-center justify-center">
                {state.decisions.filter(d => d.urgency === 'urgent' && !d.isCompleted).length}
              </span>
            )}
          </button>

          {/* Help */}
          <button className="text-gray-500 hover:text-primary-500 focus:outline-none">
            <i className="fa-solid fa-question-circle text-lg"></i>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar (hidden by default) */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-gray-600 bg-opacity-75" onClick={toggleSidebar}>
          <div className="fixed inset-y-0 left-0 w-64 bg-white" onClick={(e) => e.stopPropagation()}>
            {/* Mobile sidebar content - simplified version of the desktop sidebar */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h1 className="font-heading font-bold text-xl text-gray-800">
                <i className="fa-solid fa-rocket text-primary-500 mr-2"></i>
                StartupSim
              </h1>
              <button className="text-gray-500" onClick={toggleSidebar}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <nav className="mt-4 px-4">
              <a href="#dashboard" className="flex items-center py-2 text-gray-700">
                <i className="fa-solid fa-gauge-high w-5 h-5 mr-2"></i>
                <span>Dashboard</span>
              </a>
              <a href="#business" className="flex items-center py-2 text-gray-700">
                <i className="fa-solid fa-building w-5 h-5 mr-2"></i>
                <span>Your Business</span>
              </a>
              <a href="#finance" className="flex items-center py-2 text-gray-700">
                <i className="fa-solid fa-chart-line w-5 h-5 mr-2"></i>
                <span>Finances</span>
              </a>
              <a href="#operations" className="flex items-center py-2 text-gray-700">
                <i className="fa-solid fa-cogs w-5 h-5 mr-2"></i>
                <span>Operations</span>
              </a>
              <a href="#marketing" className="flex items-center py-2 text-gray-700">
                <i className="fa-solid fa-bullhorn w-5 h-5 mr-2"></i>
                <span>Marketing</span>
              </a>
              <a href="#hr" className="flex items-center py-2 text-gray-700">
                <i className="fa-solid fa-users w-5 h-5 mr-2"></i>
                <span>Human Resources</span>
              </a>
              <a href="#competition" className="flex items-center py-2 text-gray-700">
                <i className="fa-solid fa-chess w-5 h-5 mr-2"></i>
                <span>Competition</span>
              </a>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <a href="#mentor" className="flex items-center py-2 text-gray-700">
                  <i className="fa-solid fa-lightbulb w-5 h-5 mr-2"></i>
                  <span>AI Mentor</span>
                </a>
                <a href="#settings" className="flex items-center py-2 text-gray-700">
                  <i className="fa-solid fa-gear w-5 h-5 mr-2"></i>
                  <span>Settings</span>
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
