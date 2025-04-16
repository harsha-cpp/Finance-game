import { useGameContext } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export default function RecentEvents() {
  const { state } = useGameContext();
  
  // Get recent events, sorted by date
  const recentEvents = [...state.events]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);
  
  // Format relative time
  const getRelativeTime = (dateString: string): string => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  // Get icon style based on event type
  const getEventIcon = (event: any) => {
    if (event.icon) return event.icon;
    
    const icons: Record<string, string> = {
      market: "fa-solid fa-chart-line",
      internal: "fa-solid fa-building",
      competitor: "fa-solid fa-chess",
      crisis: "fa-solid fa-exclamation",
    };
    
    return icons[event.type] || "fa-solid fa-bell";
  };
  
  const getEventColor = (event: any) => {
    if (event.iconColor) return event.iconColor;
    
    const colors: Record<string, string> = {
      market: "bg-primary-500",
      internal: "bg-success-500",
      competitor: "bg-warning-500",
      crisis: "bg-danger-500",
    };
    
    return colors[event.type] || "bg-gray-500";
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <h2 className="font-heading font-semibold text-lg text-gray-900 mb-4">Recent Events</h2>
      
      {recentEvents.length > 0 ? (
        <div className="flow-root">
          <ul className="-mb-8">
            {recentEvents.map((event, index) => (
              <li key={event.id}>
                <div className="relative pb-8">
                  {index < recentEvents.length - 1 && (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full ${getEventColor(event)} flex items-center justify-center`}>
                        <i className={`${getEventIcon(event)} text-white`}></i>
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-900">{event.title}</p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        {getRelativeTime(event.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <i className="fa-solid fa-calendar text-2xl mb-2"></i>
          <p>No recent events</p>
          <p className="text-sm text-gray-400 mt-1">Events will appear as your business progresses</p>
        </div>
      )}
      
      {state.events.length > 4 && (
        <div className="mt-4 text-center">
          <Button 
            variant="link" 
            className="text-sm text-primary-600 hover:text-primary-800 font-medium"
          >
            View all activity
          </Button>
        </div>
      )}
    </div>
  );
}
