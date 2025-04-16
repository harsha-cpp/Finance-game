import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface User {
  id: number;
  username: string;
}

interface BusinessContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasCompany: boolean;
  companyId: number | null;
  loadingAuth: boolean;
}

const BusinessContext = createContext<BusinessContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  hasCompany: false,
  companyId: null,
  loadingAuth: true,
});

export const useBusinessContext = () => useContext(BusinessContext);

export const BusinessProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [hasCompany, setHasCompany] = useState<boolean>(false);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Check for saved auth on mount and handle redirection
  useEffect(() => {
    const savedUser = localStorage.getItem("simulator_user");
    const savedCompany = localStorage.getItem("simulator_company");
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        
        if (savedCompany) {
          const companyData = JSON.parse(savedCompany);
          setHasCompany(true);
          setCompanyId(companyData.id);
          navigate(`/dashboard/${companyData.id}`);
        } else {
          navigate("/setup");
        }
      } catch (error) {
        console.error("Error loading saved auth", error);
        localStorage.removeItem("simulator_user");
        localStorage.removeItem("simulator_company");
      }
    }
    setLoadingAuth(false);
  }, [navigate]);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      console.log("Sending login request:", { username, password });
      
      // Use fetch directly instead of apiRequest to better handle the response
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include"
      });
      
      console.log("Login fetch status:", res.status);
      
      // Check if response was not successful
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Login API error:", errorData);
        
        toast({
          title: "Login failed",
          description: errorData.message || "Invalid credentials",
          variant: "destructive",
        });
        return false;
      }
      
      // Parse successful response
      const data = await res.json();
      console.log("Login response data:", data);
      
      setUser(data.user);
      setHasCompany(data.hasCompany);
      setCompanyId(data.companyId);
      
      // Save to localStorage
      localStorage.setItem("simulator_user", JSON.stringify(data.user));
      if (data.hasCompany) {
        localStorage.setItem("simulator_company", JSON.stringify({ id: data.companyId }));
      }
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.username}!`,
      });
      
      return true;
    } catch (error) {
      console.error("Login client error:", error);
      
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
      return false;
    }
  };

  // Register function
  const register = async (username: string, password: string) => {
    try {
      console.log("Sending registration request:", { username, password });
      
      // Use fetch directly instead of apiRequest to better handle the response
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include"
      });
      
      console.log("Registration fetch status:", res.status);
      
      // Check if response was not successful
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Registration API error:", errorData);
        
        toast({
          title: "Registration failed",
          description: errorData.message || "Could not create account",
          variant: "destructive",
        });
        return false;
      }
      
      // Parse successful response
      const data = await res.json();
      console.log("Registration response data:", data);
      
      // Format user data correctly
      const userData = { 
        id: data.id, 
        username: data.username 
      };
      
      setUser(userData);
      setHasCompany(false);
      
      // Save to localStorage
      localStorage.setItem("simulator_user", JSON.stringify(userData));
      
      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });
      
      return true;
    } catch (error) {
      console.error("Registration client error:", error);
      
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Could not create account",
        variant: "destructive",
      });
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setHasCompany(false);
    setCompanyId(null);
    localStorage.removeItem("simulator_user");
    localStorage.removeItem("simulator_company");
    
    toast({
      title: "Logged out",
      description: "You have been logged out.",
    });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    hasCompany,
    companyId,
    loadingAuth,
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
};
