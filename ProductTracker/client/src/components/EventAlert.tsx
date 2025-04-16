import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface EventAlertProps {
  event: {
    id: number;
    name: string;
    description: string;
    impact: Record<string, number>;
  };
  onResolve: () => void;
}

export default function EventAlert({ event, onResolve }: EventAlertProps) {
  const { toast } = useToast();
  const [isResolving, setIsResolving] = useState(false);

  // Function to handle resolving the event
  const handleResolveEvent = async () => {
    if (!event) return;
    
    setIsResolving(true);
    try {
      await apiRequest("POST", `/api/events/${event.id}/resolve`, {});
      
      toast({
        title: "Event resolved",
        description: `You've addressed the "${event.name}" situation.`,
      });
      
      // Refresh parent component data
      onResolve();
    } catch (error) {
      toast({
        title: "Failed to resolve event",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsResolving(false);
    }
  };

  // Format impact description
  const formatImpact = () => {
    if (!event.impact) return "No significant impact.";
    
    const impacts = [];
    for (const [key, value] of Object.entries(event.impact)) {
      const percentage = (value * 100).toFixed(1);
      if (key === "marketShare") {
        impacts.push(`Market share ${value > 0 ? "+" : ""}${percentage}%`);
      } else if (key === "revenue") {
        impacts.push(`Revenue ${value > 0 ? "+" : ""}${percentage}%`);
      } else if (key === "expenses") {
        impacts.push(`Expenses ${value > 0 ? "+" : ""}${percentage}%`);
      } else if (key === "valuation") {
        impacts.push(`Valuation ${value > 0 ? "+" : ""}${percentage}%`);
      }
    }
    
    return impacts.join(", ");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border-l-4 border-amber-500 overflow-hidden mb-6">
      <div className="p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-amber-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-neutral-800">{event.name}</h3>
            <div className="mt-2 text-sm text-neutral-700">
              <p>{event.description}</p>
              <p className="mt-1 text-xs font-medium">
                Impact: {formatImpact()}
              </p>
            </div>
            <div className="mt-3">
              <Button
                onClick={handleResolveEvent}
                disabled={isResolving}
                className="inline-flex items-center px-2.5 py-1.5 border border-amber-500 text-xs font-medium rounded text-amber-700 bg-amber-50 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                {isResolving ? "Analyzing..." : "Analyze Impact"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
