import { useBusinessContext } from "@/contexts/BusinessContext";
import { useGameContext } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";

export default function PendingDecisions() {
  const { state, openDecisionModal } = useGameContext();
  const { getUrgencyLevelDisplay } = useBusinessContext();
  
  // Get pending (not completed) decisions
  const pendingDecisions = state.decisions.filter(d => !d.isCompleted);
  
  // Sort by urgency (urgent first)
  const sortedDecisions = [...pendingDecisions].sort((a, b) => {
    if (a.urgency === 'urgent' && b.urgency !== 'urgent') return -1;
    if (a.urgency !== 'urgent' && b.urgency === 'urgent') return 1;
    return 0;
  });
  
  // Count urgent decisions
  const urgentCount = pendingDecisions.filter(d => d.urgency === 'urgent').length;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-heading font-semibold text-lg text-gray-900">Pending Decisions</h2>
        {urgentCount > 0 && (
          <span className="px-2 py-1 text-xs font-medium text-warning-600 bg-warning-50 rounded-full">
            {urgentCount} Urgent
          </span>
        )}
      </div>
      
      {sortedDecisions.length > 0 ? (
        <>
          {sortedDecisions.slice(0, 4).map((decision) => {
            const urgencyDisplay = getUrgencyLevelDisplay(decision.urgency as any);
            const borderColor = decision.urgency === 'urgent' ? 'border-warning-500' : 'border-gray-400';
            
            return (
              <div 
                key={decision.id} 
                className={`border-l-4 ${borderColor} bg-gray-50 p-3 rounded-r-md mb-3`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900">{decision.title}</h3>
                  <span className={`text-xs ${urgencyDisplay.color} font-medium`}>
                    {urgencyDisplay.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{decision.description}</p>
                <div className="mt-2 flex justify-end">
                  <Button 
                    variant="link" 
                    className="text-sm text-primary-600 hover:text-primary-800 font-medium p-0"
                    onClick={() => openDecisionModal(decision)}
                  >
                    Review <i className="fa-solid fa-chevron-right ml-1 text-xs"></i>
                  </Button>
                </div>
              </div>
            );
          })}
          
          {sortedDecisions.length > 4 && (
            <Button 
              variant="link" 
              className="w-full mt-3 text-center text-sm text-primary-600 hover:text-primary-800 font-medium"
            >
              View All Decisions
            </Button>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <i className="fa-solid fa-check-circle text-2xl mb-2"></i>
          <p>No pending decisions right now</p>
          <p className="text-sm text-gray-400 mt-1">New decisions will appear as your business grows</p>
        </div>
      )}
    </div>
  );
}
