import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/contexts/GameContext";
import { useBusinessContext } from "@/contexts/BusinessContext";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function DecisionModal() {
  const { state, closeDecisionModal, makeDecision } = useGameContext();
  const { formatCurrency } = useBusinessContext();
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  
  const handleSubmit = async () => {
    if (state.selectedDecision && selectedOption !== null) {
      await makeDecision(state.selectedDecision.id, selectedOption);
    }
  };
  
  if (!state.selectedDecision) return null;
  
  const decision = state.selectedDecision;
  const options = decision.options as any[];
  const consequences = decision.consequences as any[];
  
  return (
    <Dialog open={state.showDecisionModal} onOpenChange={closeDecisionModal}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{decision.title}</DialogTitle>
        </DialogHeader>
        
        {/* Decision Content */}
        <div>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
            <div className="flex">
              {decision.type === "marketing" && <i className="fa-solid fa-bullhorn text-amber-600 mt-0.5 mr-2"></i>}
              {decision.type === "operations" && <i className="fa-solid fa-cogs text-amber-600 mt-0.5 mr-2"></i>}
              {decision.type === "hr" && <i className="fa-solid fa-users text-amber-600 mt-0.5 mr-2"></i>}
              {decision.type === "product" && <i className="fa-solid fa-code text-amber-600 mt-0.5 mr-2"></i>}
              {decision.type === "finance" && <i className="fa-solid fa-chart-line text-amber-600 mt-0.5 mr-2"></i>}
              <div>
                <h3 className="text-sm font-medium text-amber-800">{decision.type.charAt(0).toUpperCase() + decision.type.slice(1)} Department Update</h3>
                <div className="mt-1 text-sm text-amber-700">
                  <p>{decision.description}</p>
                </div>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-3">Choose an option:</h3>
          
          <RadioGroup value={selectedOption?.toString() || ""} onValueChange={(value) => setSelectedOption(parseInt(value))}>
            <div className="space-y-4">
              {options.map((option, index) => (
                <Card 
                  key={index} 
                  className={`p-4 ${selectedOption === index ? 'border-2 border-primary-500 bg-primary-50' : 'border border-gray-200 hover:border-primary-300 hover:bg-gray-50'}`}
                >
                  <div className="flex items-start">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-1" />
                    <div className="ml-3">
                      <Label htmlFor={`option-${index}`} className="text-base font-medium text-gray-900">{option.label}</Label>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center">
                          <i className="fa-solid fa-coins text-warning-500 mr-1"></i>
                          <span className="text-gray-600">Cost: <span className="font-medium">{formatCurrency(option.metrics.cost)}</span></span>
                        </div>
                        <div className="flex items-center">
                          <i className="fa-solid fa-chart-line text-success-500 mr-1"></i>
                          <span className="text-gray-600">Est. ROI: <span className="font-medium">{option.metrics.roi}</span></span>
                        </div>
                        <div className="flex items-center">
                          <i className="fa-solid fa-clock text-primary-500 mr-1"></i>
                          <span className="text-gray-600">Timeframe: <span className="font-medium">{option.metrics.timeframe}</span></span>
                        </div>
                        {option.metrics.cac && (
                          <div className="flex items-center">
                            <i className="fa-solid fa-user-plus text-danger-500 mr-1"></i>
                            <span className="text-gray-600">Est. CAC: <span className="font-medium">{formatCurrency(option.metrics.cac)}</span></span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </RadioGroup>
          
          <div className="mt-6">
            <Label htmlFor="decision-notes" className="block text-sm font-medium text-gray-700">Additional Notes</Label>
            <Textarea 
              id="decision-notes" 
              rows={3} 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1" 
              placeholder="Add any notes about your decision..."
            />
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md mt-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <i className="fa-solid fa-robot text-primary-600 text-xl"></i>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">AI Mentor Suggestion</h3>
                <p className="text-xs text-gray-600 mt-1">
                  {options.length > 2 && "Based on your current business stage and financial situation, option 3 could offer the best balance of cost efficiency and sustainable growth."}
                  {options.length <= 2 && "Based on your current business stage and financial situation, the first option appears to align better with your current trajectory and resources."}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="space-x-3">
          <Button 
            variant="outline" 
            onClick={closeDecisionModal}
          >
            Postpone Decision
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={selectedOption === null}
          >
            Confirm Decision
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
