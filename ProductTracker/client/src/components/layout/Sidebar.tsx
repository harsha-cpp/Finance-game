import { Link, useLocation } from "wouter";
import { useGameContext } from "@/contexts/GameContext";

export default function Sidebar() {
  const [location] = useLocation();
  const { state } = useGameContext();
  
  const isActive = (path: string) => location === path;
  
  const navItems = [
    { path: "/", label: "Dashboard", icon: "fa-solid fa-gauge-high" },
    { path: "/business", label: "Your Business", icon: "fa-solid fa-building" },
    { path: "/finance", label: "Finances", icon: "fa-solid fa-chart-line" },
    { path: "/operations", label: "Operations", icon: "fa-solid fa-cogs" },
    { path: "/marketing", label: "Marketing", icon: "fa-solid fa-bullhorn" },
    { path: "/hr", label: "Human Resources", icon: "fa-solid fa-users" },
    { path: "/competition", label: "Competition", icon: "fa-solid fa-chess" }
  ];
  
  const supportItems = [
    { path: "/mentor", label: "AI Mentor", icon: "fa-solid fa-lightbulb" },
    { path: "/settings", label: "Settings", icon: "fa-solid fa-gear" }
  ];
  
  const avatarInitials = state.user?.displayName 
    ? state.user.displayName.split(' ').map(n => n[0]).join('').substring(0, 2)
    : 'US';
  
  return (
    <aside className="hidden md:block bg-white w-64 border-r border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <h1 className="font-heading font-bold text-xl text-gray-800">
          <i className="fa-solid fa-rocket text-primary-500 mr-2"></i>
          StartupSim
        </h1>
      </div>

      <nav className="mt-4 px-2">
        <div className="px-2 mb-2 text-xs text-gray-500 uppercase tracking-wider">
          Main
        </div>
        
        {navItems.map((item) => (
          <Link 
            key={item.path}
            href={item.path}
            className={`flex items-center px-3 py-2 rounded-md mb-1 ${
              isActive(item.path)
                ? "bg-primary-50 text-primary-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <i className={`${item.icon} w-5 h-5 mr-2`}></i>
            <span>{item.label}</span>
          </Link>
        ))}
        
        <div className="px-2 mt-6 mb-2 text-xs text-gray-500 uppercase tracking-wider">
          Support
        </div>
        
        {supportItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center px-3 py-2 rounded-md mb-1 ${
              isActive(item.path)
                ? "bg-primary-50 text-primary-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <i className={`${item.icon} w-5 h-5 mr-2`}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {state.user && (
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
              {avatarInitials}
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium text-gray-700">{state.user.displayName}</p>
              <p className="text-xs text-gray-500">{state.user.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
