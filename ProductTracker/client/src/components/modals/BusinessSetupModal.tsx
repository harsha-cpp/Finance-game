import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/contexts/GameContext";
import { useBusinessContext } from "@/contexts/BusinessContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BusinessType } from "@/lib/types";

type SetupStep = "business-type" | "funding" | "strategy";

export function BusinessSetupModal() {
  const { state, closeBusinessSetup, createBusiness } = useGameContext();
  const { getBusinessTypeName, getBusinessTypeDescription, getBusinessTypeDetails } = useBusinessContext();
  
  const [currentStep, setCurrentStep] = useState<SetupStep>("business-type");
  const [businessType, setBusinessType] = useState<BusinessType>("tech");
  const [businessName, setBusinessName] = useState("TechNova");
  const [fundingType, setFundingType] = useState<"bootstrapped" | "angel" | "venture">("bootstrapped");
  const [initialCapital, setInitialCapital] = useState(100000);
  const [strategy, setStrategy] = useState<"growth" | "balanced" | "conservative">("balanced");
  
  const handleNext = () => {
    if (currentStep === "business-type") {
      setCurrentStep("funding");
    } else if (currentStep === "funding") {
      setCurrentStep("strategy");
    } else {
      handleCreateBusiness();
    }
  };
  
  const handleBack = () => {
    if (currentStep === "funding") {
      setCurrentStep("business-type");
    } else if (currentStep === "strategy") {
      setCurrentStep("funding");
    }
  };
  
  const handleCreateBusiness = async () => {
    const capitalByFunding = {
      bootstrapped: 50000,
      angel: 250000,
      venture: 1000000
    };
    
    const equityByFunding = {
      bootstrapped: 0,
      angel: 15,
      venture: 30
    };
    
    const business = {
      name: businessName,
      type: businessType,
      fundingType,
      initialCapital: capitalByFunding[fundingType],
      currentCash: capitalByFunding[fundingType],
      valuation: capitalByFunding[fundingType] * 4,
      equityGiven: equityByFunding[fundingType],
      strategy
    };
    
    await createBusiness(business);
  };
  
  return (
    <Dialog open={state.showBusinessSetup} onOpenChange={closeBusinessSetup}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Startup Business Setup</DialogTitle>
          <DialogDescription>
            Configure your business to start the simulation
          </DialogDescription>
        </DialogHeader>
        
        {/* Step Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`flex items-center justify-center h-8 w-8 rounded-full font-medium ${
                currentStep === "business-type" 
                  ? "bg-primary-500 text-white" 
                  : "bg-primary-100 text-primary-700"
              }`}>
                1
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  currentStep === "business-type" ? "text-gray-900" : "text-gray-500"
                }`}>Business Type</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-0.5 w-16 bg-gray-200"></div>
            </div>
            <div className="flex items-center">
              <div className={`flex items-center justify-center h-8 w-8 rounded-full font-medium ${
                currentStep === "funding" 
                  ? "bg-primary-500 text-white" 
                  : currentStep === "strategy" 
                  ? "bg-primary-100 text-primary-700" 
                  : "border-2 border-gray-300 text-gray-500"
              }`}>
                2
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  currentStep === "funding" ? "text-gray-900" : "text-gray-500"
                }`}>Funding</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-0.5 w-16 bg-gray-200"></div>
            </div>
            <div className="flex items-center">
              <div className={`flex items-center justify-center h-8 w-8 rounded-full font-medium ${
                currentStep === "strategy" 
                  ? "bg-primary-500 text-white" 
                  : "border-2 border-gray-300 text-gray-500"
              }`}>
                3
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  currentStep === "strategy" ? "text-gray-900" : "text-gray-500"
                }`}>Strategy</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Business Type Selection */}
        {currentStep === "business-type" && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select your startup type</h3>
            
            <RadioGroup value={businessType} onValueChange={(value) => setBusinessType(value as BusinessType)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tech Startup */}
                <Card className={`p-4 ${businessType === "tech" ? 'border-2 border-primary-500 bg-primary-50' : 'border border-gray-200 hover:border-primary-300 hover:bg-gray-50'}`}>
                  <div className="flex items-start">
                    <RadioGroupItem value="tech" id="tech" className="mt-1" />
                    <div className="ml-3">
                      <Label htmlFor="tech" className="font-medium text-gray-900">{getBusinessTypeName("tech")}</Label>
                      <p className="text-sm text-gray-600">{getBusinessTypeDescription("tech")}</p>
                      <ul className="mt-2 text-xs text-gray-600">
                        {getBusinessTypeDetails("tech").map((detail, index) => (
                          <li key={index} className="flex items-center">
                            <i className={`${detail.includes("High") || detail.includes("Scalable") ? "fa-solid fa-check text-success-500" : "fa-solid fa-xmark text-danger-500"} mr-1`}></i>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
                
                {/* E-commerce */}
                <Card className={`p-4 ${businessType === "ecommerce" ? 'border-2 border-primary-500 bg-primary-50' : 'border border-gray-200 hover:border-primary-300 hover:bg-gray-50'}`}>
                  <div className="flex items-start">
                    <RadioGroupItem value="ecommerce" id="ecommerce" className="mt-1" />
                    <div className="ml-3">
                      <Label htmlFor="ecommerce" className="font-medium text-gray-900">{getBusinessTypeName("ecommerce")}</Label>
                      <p className="text-sm text-gray-600">{getBusinessTypeDescription("ecommerce")}</p>
                      <ul className="mt-2 text-xs text-gray-600">
                        {getBusinessTypeDetails("ecommerce").map((detail, index) => (
                          <li key={index} className="flex items-center">
                            <i className={`${detail.includes("Consistent") ? "fa-solid fa-check text-success-500" : "fa-solid fa-xmark text-danger-500"} mr-1`}></i>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
                
                {/* Service Business */}
                <Card className={`p-4 ${businessType === "service" ? 'border-2 border-primary-500 bg-primary-50' : 'border border-gray-200 hover:border-primary-300 hover:bg-gray-50'}`}>
                  <div className="flex items-start">
                    <RadioGroupItem value="service" id="service" className="mt-1" />
                    <div className="ml-3">
                      <Label htmlFor="service" className="font-medium text-gray-900">{getBusinessTypeName("service")}</Label>
                      <p className="text-sm text-gray-600">{getBusinessTypeDescription("service")}</p>
                      <ul className="mt-2 text-xs text-gray-600">
                        {getBusinessTypeDetails("service").map((detail, index) => (
                          <li key={index} className="flex items-center">
                            <i className={`${detail.includes("Limited") ? "fa-solid fa-xmark text-danger-500" : "fa-solid fa-check text-success-500"} mr-1`}></i>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
                
                {/* Manufacturing */}
                <Card className={`p-4 ${businessType === "manufacturing" ? 'border-2 border-primary-500 bg-primary-50' : 'border border-gray-200 hover:border-primary-300 hover:bg-gray-50'}`}>
                  <div className="flex items-start">
                    <RadioGroupItem value="manufacturing" id="manufacturing" className="mt-1" />
                    <div className="ml-3">
                      <Label htmlFor="manufacturing" className="font-medium text-gray-900">{getBusinessTypeName("manufacturing")}</Label>
                      <p className="text-sm text-gray-600">{getBusinessTypeDescription("manufacturing")}</p>
                      <ul className="mt-2 text-xs text-gray-600">
                        {getBusinessTypeDetails("manufacturing").map((detail, index) => (
                          <li key={index} className="flex items-center">
                            <i className={`${detail.includes("Tangible") ? "fa-solid fa-check text-success-500" : "fa-solid fa-xmark text-danger-500"} mr-1`}></i>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            </RadioGroup>
            
            {/* Business Name */}
            <div className="mt-6">
              <Label htmlFor="business-name" className="block text-sm font-medium text-gray-700">Business Name</Label>
              <Input 
                type="text" 
                id="business-name" 
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        )}
        
        {/* Funding Selection */}
        {currentStep === "funding" && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select your funding approach</h3>
            
            <RadioGroup value={fundingType} onValueChange={(value) => setFundingType(value as any)}>
              <div className="grid grid-cols-1 gap-4">
                {/* Bootstrapped */}
                <Card className={`p-4 ${fundingType === "bootstrapped" ? 'border-2 border-primary-500 bg-primary-50' : 'border border-gray-200 hover:border-primary-300 hover:bg-gray-50'}`}>
                  <div className="flex items-start">
                    <RadioGroupItem value="bootstrapped" id="bootstrapped" className="mt-1" />
                    <div className="ml-3">
                      <Label htmlFor="bootstrapped" className="font-medium text-gray-900">Bootstrapped</Label>
                      <p className="text-sm text-gray-600">Fund your startup with personal savings and revenue</p>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center">
                          <i className="fa-solid fa-coins text-warning-500 mr-1"></i>
                          <span className="text-gray-600">Starting Capital: <span className="font-medium">$50,000</span></span>
                        </div>
                        <div className="flex items-center">
                          <i className="fa-solid fa-chart-pie text-success-500 mr-1"></i>
                          <span className="text-gray-600">Equity Retained: <span className="font-medium">100%</span></span>
                        </div>
                        <div className="flex items-center">
                          <i className="fa-solid fa-clock text-primary-500 mr-1"></i>
                          <span className="text-gray-600">Growth Speed: <span className="font-medium">Slow</span></span>
                        </div>
                        <div className="flex items-center">
                          <i className="fa-solid fa-shield-alt text-danger-500 mr-1"></i>
                          <span className="text-gray-600">Risk Level: <span className="font-medium">Low</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
                
                {/* Angel Investment */}
                <Card className={`p-4 ${fundingType === "angel" ? 'border-2 border-primary-500 bg-primary-50' : 'border border-gray-200 hover:border-primary-300 hover:bg-gray-50'}`}>
                  <div className="flex items-start">
                    <RadioGroupItem value="angel" id="angel" className="mt-1" />
                    <div className="ml-3">
                      <Label htmlFor="angel" className="font-medium text-gray-900">Angel Investment</Label>
                      <p className="text-sm text-gray-600">Raise capital from angel investors for a percentage of equity</p>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center">
                          <i className="fa-solid fa-coins text-warning-500 mr-1"></i>
                          <span className="text-gray-600">Starting Capital: <span className="font-medium">$250,000</span></span>
                        </div>
                        <div className="flex items-center">
                          <i className="fa-solid fa-chart-pie text-success-500 mr-1"></i>
                          <span className="text-gray-600">Equity Given: <span className="font-medium">15%</span></span>
                        </div>
                        <div className="flex items-center">
                          <i className="fa-solid fa-clock text-primary-500 mr-1"></i>
                          <span className="text-gray-600">Growth Speed: <span className="font-medium">Medium</span></span>
                        </div>
                        <div className="flex items-center">
                          <i className="fa-solid fa-shield-alt text-danger-500 mr-1"></i>
                          <span className="text-gray-600">Risk Level: <span className="font-medium">Medium</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
                
                {/* Venture Capital */}
                <Card className={`p-4 ${fundingType === "venture" ? 'border-2 border-primary-500 bg-primary-50' : 'border border-gray-200 hover:border-primary-300 hover:bg-gray-50'}`}>
                  <div className="flex items-start">
                    <RadioGroupItem value="venture" id="venture" className="mt-1" />
                    <div className="ml-3">
                      <Label htmlFor="venture" className="font-medium text-gray-900">Venture Capital</Label>
                      <p className="text-sm text-gray-600">Secure a significant investment from VC firms for rapid growth</p>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center">
                          <i className="fa-solid fa-coins text-warning-500 mr-1"></i>
                          <span className="text-gray-600">Starting Capital: <span className="font-medium">$1,000,000</span></span>
                        </div>
                        <div className="flex items-center">
                          <i className="fa-solid fa-chart-pie text-success-500 mr-1"></i>
                          <span className="text-gray-600">Equity Given: <span className="font-medium">30%</span></span>
                        </div>
                        <div className="flex items-center">
                          <i className="fa-solid fa-clock text-primary-500 mr-1"></i>
                          <span className="text-gray-600">Growth Speed: <span className="font-medium">Fast</span></span>
                        </div>
                        <div className="flex items-center">
                          <i className="fa-solid fa-shield-alt text-danger-500 mr-1"></i>
                          <span className="text-gray-600">Risk Level: <span className="font-medium">High</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </RadioGroup>
          </div>
        )}
        
        {/* Business Strategy */}
        {currentStep === "strategy" && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select your business strategy</h3>
            
            <RadioGroup value={strategy} onValueChange={(value) => setStrategy(value as any)}>
              <div className="grid grid-cols-1 gap-4">
                {/* Growth-focused */}
                <Card className={`p-4 ${strategy === "growth" ? 'border-2 border-primary-500 bg-primary-50' : 'border border-gray-200 hover:border-primary-300 hover:bg-gray-50'}`}>
                  <div className="flex items-start">
                    <RadioGroupItem value="growth" id="growth" className="mt-1" />
                    <div className="ml-3">
                      <Label htmlFor="growth" className="font-medium text-gray-900">Growth-focused</Label>
                      <p className="text-sm text-gray-600">Prioritize rapid expansion and market share over short-term profits</p>
                      <div className="mt-2 grid grid-cols-1 gap-2 text-xs">
                        <div className="flex items-center">
                          <i className="fa-solid fa-check text-success-500 mr-1"></i>
                          <span className="text-gray-600">Higher marketing and development budget allocation</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fa-solid fa-check text-success-500 mr-1"></i>
                          <span className="text-gray-600">More aggressive hiring and expansion</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fa-solid fa-xmark text-danger-500 mr-1"></i>
                          <span className="text-gray-600">Faster cash burn rate with longer path to profitability</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fa-solid fa-xmark text-danger-500 mr-1"></i>
                          <span className="text-gray-600">Higher risk of running out of capital</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
                
                {/* Balanced */}
                <Card className={`p-4 ${strategy === "balanced" ? 'border-2 border-primary-500 bg-primary-50' : 'border border-gray-200 hover:border-primary-300 hover:bg-gray-50'}`}>
                  <div className="flex items-start">
                    <RadioGroupItem value="balanced" id="balanced" className="mt-1" />
                    <div className="ml-3">
                      <Label htmlFor="balanced" className="font-medium text-gray-900">Balanced Approach</Label>
                      <p className="text-sm text-gray-600">Strike a balance between growth and sustainability</p>
                      <div className="mt-2 grid grid-cols-1 gap-2 text-xs">
                        <div className="flex items-center">
                          <i className="fa-solid fa-check text-success-500 mr-1"></i>
                          <span className="text-gray-600">Equal focus on acquisition and retention</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fa-solid fa-check text-success-500 mr-1"></i>
                          <span className="text-gray-600">Moderate hiring pace with strategic positions</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fa-solid fa-check text-success-500 mr-1"></i>
                          <span className="text-gray-600">Sustainability-focused financial management</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fa-solid fa-check text-success-500 mr-1"></i>
                          <span className="text-gray-600">Lower risk with moderate growth potential</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
                
                {/* Conservative */}
                <Card className={`p-4 ${strategy === "conservative" ? 'border-2 border-primary-500 bg-primary-50' : 'border border-gray-200 hover:border-primary-300 hover:bg-gray-50'}`}>
                  <div className="flex items-start">
                    <RadioGroupItem value="conservative" id="conservative" className="mt-1" />
                    <div className="ml-3">
                      <Label htmlFor="conservative" className="font-medium text-gray-900">Conservative</Label>
                      <p className="text-sm text-gray-600">Focus on profitability and minimizing cash burn</p>
                      <div className="mt-2 grid grid-cols-1 gap-2 text-xs">
                        <div className="flex items-center">
                          <i className="fa-solid fa-check text-success-500 mr-1"></i>
                          <span className="text-gray-600">Minimal overhead and operating costs</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fa-solid fa-check text-success-500 mr-1"></i>
                          <span className="text-gray-600">Focus on revenue-generating activities</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fa-solid fa-check text-success-500 mr-1"></i>
                          <span className="text-gray-600">Longer runway with lower cash burn</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fa-solid fa-xmark text-danger-500 mr-1"></i>
                          <span className="text-gray-600">Slower growth and market capture</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </RadioGroup>
          </div>
        )}
        
        <DialogFooter className="gap-2">
          {currentStep !== "business-type" && (
            <Button 
              variant="outline" 
              onClick={handleBack}
            >
              Back
            </Button>
          )}
          <Button 
            onClick={handleNext}
          >
            {currentStep === "strategy" ? "Create Business" : "Continue"}
            {currentStep !== "strategy" && <i className="fa-solid fa-arrow-right ml-1"></i>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
