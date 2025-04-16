import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertCompanySchema, businessTypes, fundingTypes, decisionTypes } from "@shared/schema";
import { 
  generateInitialCompany, 
  generateCompetitors, 
  generateInitialMetrics, 
  generateMarketEvent,
  applyDecisionEffects,
  calculateDecisionImpact
} from "./simulation";

// Validation schemas
const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(4),
});

const companySetupSchema = z.object({
  name: z.string().min(1),
  type: z.enum(businessTypes),
  fundingType: z.enum(fundingTypes),
});

const decisionSchema = z.object({
  type: z.enum(decisionTypes),
  decision: z.string().min(1),
});

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();

  // User registration
  router.post("/register", async (req: Request, res: Response) => {
    try {
      console.log("Registration request body:", req.body);
      
      const userData = insertUserSchema.parse(req.body);
      console.log("Parsed user data:", userData);
      
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      console.log("User created:", user);
      
      return res.status(201).json({ id: user.id, username: user.username });
    } catch (error) {
      console.error("Registration error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      return res.status(500).json({ message: "Server error" });
    }
  });

  // User login
  router.post("/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Return user info and company if exists
      const company = await storage.getCompanyByUserId(user.id);
      
      return res.status(200).json({ 
        user: { id: user.id, username: user.username },
        hasCompany: !!company,
        companyId: company?.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Company setup route
  router.post("/companies", async (req: Request, res: Response) => {
    try {
      const { name, type, fundingType } = companySetupSchema.parse(req.body);
      const userId = Number(req.body.userId);
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      // Check if user already has a company
      const existingCompany = await storage.getCompanyByUserId(userId);
      if (existingCompany) {
        return res.status(400).json({ message: "User already has a company" });
      }
      
      // Determine funding amount based on funding type
      let fundingAmount = 0;
      switch (fundingType) {
        case "Seed":
          fundingAmount = 1000000;
          break;
        case "Bank Loan":
          fundingAmount = 500000;
          break;
        case "Strategic Partnership":
          fundingAmount = 750000;
          break;
        case "Series A":
          fundingAmount = 2000000;
          break;
        case "Bootstrap":
          fundingAmount = 250000;
          break;
      }
      
      // Create new company
      const companyData = generateInitialCompany(userId, name, type, fundingType, fundingAmount);
      const company = await storage.createCompany(companyData);
      
      // Generate competitors
      const competitors = generateCompetitors(company.id, type);
      await Promise.all(competitors.map(competitor => storage.createCompetitor(competitor)));
      
      // Generate initial metrics
      const initialMetrics = generateInitialMetrics(company);
      await storage.createMetrics(initialMetrics);
      
      // Generate possible market event
      const initialEvent = generateMarketEvent(company.id, 1, 1);
      if (initialEvent) {
        await storage.createEvent(initialEvent);
      }
      
      return res.status(201).json(company);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      return res.status(500).json({ message: "Server error", error });
    }
  });

  // Get company info
  router.get("/companies/:id", async (req: Request, res: Response) => {
    try {
      const companyId = Number(req.params.id);
      const company = await storage.getCompany(companyId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      return res.status(200).json(company);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Get company metrics
  router.get("/companies/:id/metrics", async (req: Request, res: Response) => {
    try {
      const companyId = Number(req.params.id);
      const metrics = await storage.getMetrics(companyId);
      
      return res.status(200).json(metrics);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Get company competitors
  router.get("/companies/:id/competitors", async (req: Request, res: Response) => {
    try {
      const companyId = Number(req.params.id);
      const competitors = await storage.getCompetitors(companyId);
      
      return res.status(200).json(competitors);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Get active events
  router.get("/companies/:id/events", async (req: Request, res: Response) => {
    try {
      const companyId = Number(req.params.id);
      const events = await storage.getActiveEvents(companyId);
      
      return res.status(200).json(events);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Resolve an event
  router.post("/events/:id/resolve", async (req: Request, res: Response) => {
    try {
      const eventId = Number(req.params.id);
      const event = await storage.resolveEvent(eventId);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      return res.status(200).json(event);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Submit quarterly decisions
  router.post("/companies/:id/decisions", async (req: Request, res: Response) => {
    try {
      const companyId = Number(req.params.id);
      const company = await storage.getCompany(companyId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      // Validate decisions
      const decisions = req.body.decisions;
      if (!Array.isArray(decisions) || decisions.length === 0) {
        return res.status(400).json({ message: "Decisions are required" });
      }
      
      // Process each decision
      const processedDecisions = [];
      for (const decisionData of decisions) {
        const { type, decision } = decisionSchema.parse(decisionData);
        
        // Calculate cost and impact
        let cost = 0;
        
        // Find cost based on decision type and choice
        switch (type) {
          case 'marketing':
            if (decision === 'content') cost = 25000;
            else if (decision === 'paid') cost = 40000;
            else if (decision === 'influencer') cost = 35000;
            else if (decision === 'conference') cost = 50000;
            break;
            
          case 'hiring':
            if (decision === 'engineers') cost = 220000;
            else if (decision === 'sales') cost = 240000;
            else if (decision === 'support') cost = 110000;
            break;
            
          case 'product':
            if (decision === 'features') cost = 80000;
            else if (decision === 'performance') cost = 60000;
            else if (decision === 'mobile') cost = 100000;
            else if (decision === 'enterprise') cost = 75000;
            break;
            
          case 'funding':
            // Funding doesn't have a cost
            cost = 0;
            break;
        }
        
        // Calculate impact of decision
        const impact = calculateDecisionImpact(type, decision);
        
        // Create decision record
        const newDecision = await storage.createDecision({
          companyId,
          quarter: company.currentQuarter,
          year: company.currentYear,
          type,
          decision,
          cost,
          impact,
        });
        
        processedDecisions.push(newDecision);
      }
      
      // Apply decisions to company
      const updates = applyDecisionEffects(company, processedDecisions);
      
      // Update company with new values
      const updatedCompany = await storage.updateCompany(companyId, updates);
      
      if (!updatedCompany) {
        return res.status(500).json({ message: "Failed to update company" });
      }
      
      // Create metrics for the quarter
      await storage.createMetrics({
        companyId,
        quarter: company.currentQuarter,
        year: company.currentYear,
        revenue: company.revenue,
        expenses: company.expenses,
        profit: company.revenue - company.expenses,
        cash: company.cash,
        marketShare: company.marketShare,
        valuation: company.valuation,
        employees: company.employees,
      });
      
      // Generate possible market event for next quarter
      const nextEvent = generateMarketEvent(
        companyId, 
        updatedCompany.currentQuarter, 
        updatedCompany.currentYear
      );
      
      if (nextEvent) {
        await storage.createEvent(nextEvent);
      }
      
      return res.status(200).json({
        company: updatedCompany,
        decisions: processedDecisions,
        nextQuarter: {
          quarter: updatedCompany.currentQuarter,
          year: updatedCompany.currentYear
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      return res.status(500).json({ message: "Server error", error });
    }
  });

  // Get leaderboard
  router.get("/leaderboard", async (req: Request, res: Response) => {
    try {
      const companies = await storage.getAllCompanies();
      
      // Sort companies by profit
      const sortedCompanies = companies.sort((a: any, b: any) => {
        const profitA = a.revenue - a.expenses;
        const profitB = b.revenue - b.expenses;
        return profitB - profitA;
      });
      
      // Calculate market share for each company
      const totalRevenue = sortedCompanies.reduce((sum: number, company: any) => sum + company.revenue, 0);
      const companiesWithMarketShare = sortedCompanies.map((company: any) => ({
        ...company,
        profit: company.revenue - company.expenses,
        marketShare: totalRevenue > 0 ? (company.revenue / totalRevenue) * 100 : 0
      }));
      
      return res.status(200).json(companiesWithMarketShare);
    } catch (error) {
      console.error("Leaderboard error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Register the router with /api prefix
  app.use("/api", router);

  const httpServer = createServer(app);
  return httpServer;
}
