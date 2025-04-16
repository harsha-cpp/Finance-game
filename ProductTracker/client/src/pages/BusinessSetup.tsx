import { useState } from "react";
import { useLocation } from "wouter";
import { useBusinessContext } from "@/context/BusinessContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { businessTypes, fundingTypes } from "@shared/schema";
import { Briefcase, Building, ShoppingBag, Cpu, Database, Coins, CreditCard, HandshakeIcon } from "lucide-react";

// Business setup form schema
const businessSetupSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters").max(50),
  type: z.enum(businessTypes, {
    errorMap: () => ({ message: "Please select a business type" }),
  }),
  fundingType: z.enum(fundingTypes, {
    errorMap: () => ({ message: "Please select a funding method" }),
  }),
});

export default function BusinessSetup() {
  const [location, navigate] = useLocation();
  const { user, isAuthenticated, loadingAuth } = useBusinessContext();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Create form
  const form = useForm<z.infer<typeof businessSetupSchema>>({
    resolver: zodResolver(businessSetupSchema),
    defaultValues: {
      name: "",
      type: undefined,
      fundingType: undefined,
    },
  });

  // Handle setup form submission
  const onSubmit = async (values: z.infer<typeof businessSetupSchema>) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Not authenticated",
        description: "Please log in first",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiRequest("POST", "/api/companies", {
        ...values,
        userId: user.id,
      });
      
      const company = await response.json();
      
      // Save company to local storage
      localStorage.setItem(
        "simulator_company",
        JSON.stringify({ id: company.id })
      );
      
      toast({
        title: "Business created!",
        description: `${values.name} has been founded successfully!`,
      });
      
      // Redirect to the business dashboard
      navigate(`/dashboard/${company.id}`);
    } catch (error) {
      toast({
        title: "Error creating business",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Redirect if not authenticated
  if (!isAuthenticated && !loadingAuth) {
    navigate("/");
    return null;
  }

  // Render business type icon based on type
  const renderBusinessTypeIcon = (type: string) => {
    switch (type) {
      case "Tech":
        return <Cpu className="h-5 w-5" />;
      case "E-commerce":
        return <ShoppingBag className="h-5 w-5" />;
      case "Service":
        return <Briefcase className="h-5 w-5" />;
      case "Manufacturing":
        return <Building className="h-5 w-5" />;
      default:
        return null;
    }
  };

  // Render funding type icon based on type
  const renderFundingTypeIcon = (type: string) => {
    switch (type) {
      case "Bootstrap":
        return <Database className="h-5 w-5" />;
      case "Seed":
        return <Coins className="h-5 w-5" />;
      case "Series A":
        return <Coins className="h-5 w-5" />;
      case "Bank Loan":
        return <CreditCard className="h-5 w-5" />;
      case "Strategic Partnership":
        return <HandshakeIcon className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl">Startup Your Business</CardTitle>
          <CardDescription>
            Configure your new startup and begin your entrepreneurial journey
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Business Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your company name" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Choose a unique name for your startup
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Business Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Business Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {businessTypes.map((type) => (
                          <FormItem key={type} className="flex">
                            <FormControl>
                              <RadioGroupItem
                                value={type}
                                id={`type-${type}`}
                                className="peer sr-only"
                              />
                            </FormControl>
                            <FormLabel
                              htmlFor={`type-${type}`}
                              className="flex flex-1 items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                  {renderBusinessTypeIcon(type)}
                                </div>
                                <div>
                                  <div className="font-medium">{type}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {type === "Tech"
                                      ? "Software, SaaS, Mobile Apps"
                                      : type === "E-commerce"
                                      ? "Online Retail & Marketplaces"
                                      : type === "Service"
                                      ? "Consulting, Agency, B2B"
                                      : "Production & Assembly"}
                                  </div>
                                </div>
                              </div>
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      Select the industry your startup will operate in
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Funding Method */}
              <FormField
                control={form.control}
                name="fundingType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Funding Method</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {fundingTypes.map((type) => (
                          <FormItem key={type} className="flex">
                            <FormControl>
                              <RadioGroupItem
                                value={type}
                                id={`funding-${type}`}
                                className="peer sr-only"
                              />
                            </FormControl>
                            <FormLabel
                              htmlFor={`funding-${type}`}
                              className="flex flex-1 items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                  {renderFundingTypeIcon(type)}
                                </div>
                                <div>
                                  <div className="font-medium">{type}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {type === "Bootstrap"
                                      ? "Start small with personal funds"
                                      : type === "Seed"
                                      ? "Initial investor funding"
                                      : type === "Series A"
                                      ? "Major investment round"
                                      : type === "Bank Loan"
                                      ? "Debt-based financing"
                                      : "Partner with established company"}
                                  </div>
                                </div>
                              </div>
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      How will you finance your business?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/")}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={submitting || !form.formState.isValid}
              >
                {submitting ? "Creating Business..." : "Start Your Business"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
