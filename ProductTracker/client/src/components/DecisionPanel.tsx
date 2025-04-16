import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { marketingOptions, hiringOptions, productOptions, fundingOptions, getAIRecommendation } from "@shared/schema";
import { MarketingIcon, HiringIcon, ProductIcon, FundingIcon } from "./DecisionIcons";

export default function DecisionPanel({ 
  company, 
  onDecisionsSubmit, 
  isLoading 
} : { 
  company: any; 
  onDecisionsSubmit: () => void; 
  isLoading: boolean;
}) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  
  // Initialize state for decisions
  const [decisions, setDecisions] = useState({
    marketing: "content",     // Default to content marketing
    hiring: "sales",          // Default to sales team
    product: "performance",   // Default to performance improvements
    funding: "bootstrap",     // Default to bootstrapping
  });

  // Get AI recommendations (would normally be from backend)
  const recommendations = {
    marketing: "paid",        // Recommendation for marketing
    hiring: "engineers",      // Recommendation for hiring
    product: "mobile",        // Recommendation for product
    funding: "series_a",      // Recommendation for funding
  };

  // Function to handle decision changes
  const handleDecisionChange = (category: string, value: string) => {
    setDecisions(prev => ({
      ...prev,
      [category]: value
    }));
  };

  // Function to submit quarterly decisions
  const submitDecisions = async () => {
    if (!company || isLoading) return;
    
    setSubmitting(true);
    try {
      // Format decisions for API
      const decisionPayload = Object.entries(decisions).map(([type, decision]) => ({
        type,
        decision,
      }));
      
      // Send decisions to API
      await apiRequest("POST", `/api/companies/${company.id}/decisions`, {
        decisions: decisionPayload
      });
      
      toast({
        title: "Decisions submitted",
        description: "Your quarterly decisions have been processed",
      });
      
      // Refresh company data
      onDecisionsSubmit();
    } catch (error) {
      toast({
        title: "Error submitting decisions",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Function to reset decisions to defaults
  const resetDecisions = () => {
    setDecisions({
      marketing: "content",
      hiring: "sales",
      product: "performance",
      funding: "bootstrap",
    });
    
    toast({
      title: "Decisions reset",
      description: "Your decisions have been reset to defaults",
    });
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
        <h2 className="text-lg font-medium text-neutral-800">Strategic Decisions</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Make key decisions to grow your business this quarter
        </p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Marketing Strategy Decision */}
          <div className="border border-neutral-200 rounded-lg p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-neutral-800">Marketing Strategy</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  Choose how to allocate your marketing budget
                </p>
              </div>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-primary">
                <MarketingIcon className="h-5 w-5" />
              </span>
            </div>
            
            {isLoading ? (
              <div className="mt-5 space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-5 w-48" />
                  </div>
                ))}
              </div>
            ) : (
              <RadioGroup
                value={decisions.marketing}
                onValueChange={(value) => handleDecisionChange("marketing", value)}
                className="mt-5 space-y-3"
              >
                {marketingOptions.map(option => (
                  <div key={option.id} className="flex items-center">
                    <RadioGroupItem
                      id={`marketing-${option.id}`}
                      value={option.id}
                      className="h-4 w-4 text-primary focus:ring-primary"
                    />
                    <Label
                      htmlFor={`marketing-${option.id}`}
                      className="ml-2 text-sm text-neutral-700"
                    >
                      {option.name} (${(option.cost / 1000).toFixed(0)}k)
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            
            <div className="mt-4 text-xs text-neutral-500">
              <p>
                Current strategy:{" "}
                {isLoading ? (
                  <Skeleton className="inline-block h-3 w-24" />
                ) : (
                  <span className="font-medium">
                    {marketingOptions.find(o => o.id === decisions.marketing)?.name}
                  </span>
                )}
              </p>
              <p className="mt-1">
                AI Recommendation:{" "}
                {isLoading ? (
                  <Skeleton className="inline-block h-3 w-36" />
                ) : (
                  <span className="font-medium text-secondary">
                    {marketingOptions.find(o => o.id === recommendations.marketing)?.name}
                  </span>
                )}{" "}
                to increase market visibility
              </p>
            </div>
          </div>

          {/* Hiring Decision */}
          <div className="border border-neutral-200 rounded-lg p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-neutral-800">Hiring Plans</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  Expand your team for growth
                </p>
              </div>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-primary">
                <HiringIcon className="h-5 w-5" />
              </span>
            </div>
            
            {isLoading ? (
              <div className="mt-5 space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-5 w-48" />
                  </div>
                ))}
              </div>
            ) : (
              <RadioGroup
                value={decisions.hiring}
                onValueChange={(value) => handleDecisionChange("hiring", value)}
                className="mt-5 space-y-3"
              >
                {hiringOptions.map(option => (
                  <div key={option.id} className="flex items-center">
                    <RadioGroupItem
                      id={`hiring-${option.id}`}
                      value={option.id}
                      className="h-4 w-4 text-primary focus:ring-primary"
                    />
                    <Label
                      htmlFor={`hiring-${option.id}`}
                      className="ml-2 text-sm text-neutral-700"
                    >
                      {option.name} 
                      {option.roles > 0 && (
                        <span> ({option.roles} roles, ${(option.cost / 1000).toFixed(0)}k/yr)</span>
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            
            <div className="mt-4 text-xs text-neutral-500">
              <p>
                Current plan:{" "}
                {isLoading ? (
                  <Skeleton className="inline-block h-3 w-24" />
                ) : (
                  <span className="font-medium">
                    {hiringOptions.find(o => o.id === decisions.hiring)?.name}
                  </span>
                )}
              </p>
              <p className="mt-1">
                AI Recommendation:{" "}
                {isLoading ? (
                  <Skeleton className="inline-block h-3 w-36" />
                ) : (
                  <span className="font-medium text-secondary">
                    {hiringOptions.find(o => o.id === recommendations.hiring)?.name}
                  </span>
                )}{" "}
                to accelerate product development
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Development Decision */}
          <div className="border border-neutral-200 rounded-lg p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-neutral-800">Product Development</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  Choose your development focus
                </p>
              </div>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-primary">
                <ProductIcon className="h-5 w-5" />
              </span>
            </div>
            
            {isLoading ? (
              <div className="mt-5 space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-5 w-48" />
                  </div>
                ))}
              </div>
            ) : (
              <RadioGroup
                value={decisions.product}
                onValueChange={(value) => handleDecisionChange("product", value)}
                className="mt-5 space-y-3"
              >
                {productOptions.map(option => (
                  <div key={option.id} className="flex items-center">
                    <RadioGroupItem
                      id={`product-${option.id}`}
                      value={option.id}
                      className="h-4 w-4 text-primary focus:ring-primary"
                    />
                    <Label
                      htmlFor={`product-${option.id}`}
                      className="ml-2 text-sm text-neutral-700"
                    >
                      {option.name} (${(option.cost / 1000).toFixed(0)}k)
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            
            <div className="mt-4 text-xs text-neutral-500">
              <p>
                Current focus:{" "}
                {isLoading ? (
                  <Skeleton className="inline-block h-3 w-24" />
                ) : (
                  <span className="font-medium">
                    {productOptions.find(o => o.id === decisions.product)?.name}
                  </span>
                )}
              </p>
              <p className="mt-1">
                AI Recommendation:{" "}
                {isLoading ? (
                  <Skeleton className="inline-block h-3 w-36" />
                ) : (
                  <span className="font-medium text-secondary">
                    {productOptions.find(o => o.id === recommendations.product)?.name}
                  </span>
                )}{" "}
                to reach new users
              </p>
            </div>
          </div>

          {/* Funding Decision */}
          <div className="border border-neutral-200 rounded-lg p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-neutral-800">Funding Strategy</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  Secure capital for expansion
                </p>
              </div>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-primary">
                <FundingIcon className="h-5 w-5" />
              </span>
            </div>
            
            {isLoading ? (
              <div className="mt-5 space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-5 w-48" />
                  </div>
                ))}
              </div>
            ) : (
              <RadioGroup
                value={decisions.funding}
                onValueChange={(value) => handleDecisionChange("funding", value)}
                className="mt-5 space-y-3"
              >
                {fundingOptions.map(option => (
                  <div key={option.id} className="flex items-center">
                    <RadioGroupItem
                      id={`funding-${option.id}`}
                      value={option.id}
                      className="h-4 w-4 text-primary focus:ring-primary"
                    />
                    <Label
                      htmlFor={`funding-${option.id}`}
                      className="ml-2 text-sm text-neutral-700"
                    >
                      {option.name}
                      {option.equity > 0 && (
                        <span> ({option.equity}% equity)</span>
                      )}
                      {option.interest > 0 && (
                        <span> ({option.interest}% interest)</span>
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            
            <div className="mt-4 text-xs text-neutral-500">
              <p>
                Current strategy:{" "}
                {isLoading ? (
                  <Skeleton className="inline-block h-3 w-24" />
                ) : (
                  <span className="font-medium">
                    {fundingOptions.find(o => o.id === decisions.funding)?.name}
                  </span>
                )}
              </p>
              <p className="mt-1">
                AI Recommendation:{" "}
                {isLoading ? (
                  <Skeleton className="inline-block h-3 w-36" />
                ) : (
                  <span className="font-medium text-secondary">
                    {fundingOptions.find(o => o.id === recommendations.funding)?.name}
                  </span>
                )}{" "}
                for rapid expansion
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={resetDecisions}
            disabled={isLoading || submitting}
            className="text-neutral-700 hover:text-neutral-900 text-sm font-medium"
          >
            Reset Decisions
          </Button>
          <Button
            onClick={submitDecisions}
            disabled={isLoading || submitting}
            className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {submitting ? "Processing..." : "Submit Quarterly Decisions"}
          </Button>
        </div>
      </div>
    </div>
  );
}
