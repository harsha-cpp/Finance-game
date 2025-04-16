import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, ChevronLeft, Sparkles, Coins, Briefcase, Flag, Shield, Award } from "lucide-react";

interface TimelineEvent {
  id: number;
  quarter: number;
  year: number;
  title: string;
  icon: JSX.Element;
  completed: boolean;
}

export default function BusinessTimeline({
  metrics,
  isLoading
}: {
  metrics: any[];
  isLoading: boolean;
}) {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [currentQuarter, setCurrentQuarter] = useState<number>(1);
  const [currentYear, setCurrentYear] = useState<number>(1);
  
  // Generate timeline events based on metrics data
  useEffect(() => {
    if (metrics && metrics.length > 0) {
      // Find the most recent metrics to set current quarter and year
      const lastMetric = metrics[metrics.length - 1];
      setCurrentQuarter(lastMetric.quarter);
      setCurrentYear(lastMetric.year);
      
      // Create timeline events (first 3 quarters plus projections)
      const events: TimelineEvent[] = [
        {
          id: 1,
          quarter: 1,
          year: 1,
          title: "Company Founded",
          icon: <Sparkles className="h-5 w-5 text-white" />,
          completed: true
        },
        {
          id: 2,
          quarter: 1,
          year: 1,
          title: "Seed Funding",
          icon: <Coins className="h-5 w-5 text-white" />,
          completed: true
        },
        {
          id: 3,
          quarter: 2,
          year: 1,
          title: "Product Launch",
          icon: <Briefcase className="h-5 w-5 text-white" />,
          completed: metrics.some(m => m.quarter >= 2 || m.year > 1)
        },
        {
          id: 4,
          quarter: 3,
          year: 1,
          title: "Market Expansion",
          icon: <Flag className="h-5 w-5 text-white" />,
          completed: metrics.some(m => m.quarter >= 3 || m.year > 1)
        },
        {
          id: 5,
          quarter: 4,
          year: 1,
          title: "Series A",
          icon: <Shield className="h-5 w-5 text-white" />,
          completed: metrics.some(m => m.quarter >= 4 || m.year > 1)
        }
      ];
      
      setTimelineEvents(events);
    }
  }, [metrics]);

  return (
    <div className="border-t border-neutral-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-neutral-800">Business Timeline</h2>
          <div className="flex space-x-2">
            <button className="text-neutral-400 hover:text-neutral-700 disabled:opacity-30"
                    disabled={!timelineEvents.length}>
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button className="text-primary hover:text-blue-700 disabled:opacity-30"
                    disabled={!timelineEvents.length}>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute top-5 inset-x-0 h-0.5 bg-neutral-200"></div>
          <div className="relative flex justify-between">
            {isLoading ? (
              Array(5).fill(0).map((_, index) => (
                <div key={index} className="relative">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="mt-3">
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              ))
            ) : timelineEvents.length > 0 ? (
              timelineEvents.map((event) => (
                <div key={event.id} className="relative">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    event.completed ? 'bg-primary' : 'bg-neutral-300'
                  }`}>
                    {event.icon}
                  </div>
                  <div className="mt-3">
                    <span className="text-xs font-medium text-neutral-500">
                      Q{event.quarter} {event.year}
                    </span>
                    <p className={`text-sm font-medium ${
                      event.completed ? 'text-neutral-800' : 'text-neutral-400'
                    }`}>
                      {event.title}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center py-6 text-neutral-500">
                No timeline data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
