import {
  users, type User, type InsertUser,
  companies, type Company, type InsertCompany, 
  metrics, type Metrics, type InsertMetrics,
  decisions, type Decision, type InsertDecision,
  events, type Event, type InsertEvent,
  competitors, type Competitor, type InsertCompetitor,
  BusinessType
} from "@shared/schema";

// Define the storage interface for all entity types
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Company operations
  getCompany(id: number): Promise<Company | undefined>;
  getCompanyByUserId(userId: number): Promise<Company | undefined>;
  getAllCompanies(): Promise<Company[]>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, updates: Partial<Company>): Promise<Company | undefined>;

  // Metrics operations
  getMetrics(companyId: number): Promise<Metrics[]>;
  getMetricsForQuarter(companyId: number, quarter: number, year: number): Promise<Metrics | undefined>;
  createMetrics(metrics: InsertMetrics): Promise<Metrics>;

  // Decision operations
  getDecisions(companyId: number): Promise<Decision[]>;
  getDecisionsForQuarter(companyId: number, quarter: number, year: number): Promise<Decision[]>;
  createDecision(decision: InsertDecision): Promise<Decision>;

  // Event operations
  getEvents(companyId: number): Promise<Event[]>;
  getActiveEvents(companyId: number): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  resolveEvent(id: number): Promise<Event | undefined>;

  // Competitor operations
  getCompetitors(companyId: number): Promise<Competitor[]>;
  createCompetitor(competitor: InsertCompetitor): Promise<Competitor>;
  updateCompetitor(id: number, updates: Partial<Competitor>): Promise<Competitor | undefined>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private companies: Map<number, Company>;
  private metricsMap: Map<number, Metrics[]>;
  private decisions: Map<number, Decision[]>;
  private events: Map<number, Event[]>;
  private competitors: Map<number, Competitor[]>;
  
  private currentId: {
    users: number;
    companies: number;
    metrics: number;
    decisions: number;
    events: number;
    competitors: number;
  };

  constructor() {
    this.users = new Map();
    this.companies = new Map();
    this.metricsMap = new Map();
    this.decisions = new Map();
    this.events = new Map();
    this.competitors = new Map();
    
    this.currentId = {
      users: 1,
      companies: 1,
      metrics: 1,
      decisions: 1,
      events: 1,
      competitors: 1,
    };
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Company methods
  async getCompany(id: number): Promise<Company | undefined> {
    return this.companies.get(id);
  }

  async getCompanyByUserId(userId: number): Promise<Company | undefined> {
    return Array.from(this.companies.values()).find(
      (company) => company.userId === userId,
    );
  }

  async getAllCompanies(): Promise<Company[]> {
    return Array.from(this.companies.values());
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = this.currentId.companies++;
    const createdAt = new Date();
    const company: Company = { ...insertCompany, id, createdAt };
    this.companies.set(id, company);
    return company;
  }

  async updateCompany(id: number, updates: Partial<Company>): Promise<Company | undefined> {
    const company = this.companies.get(id);
    if (!company) return undefined;
    
    const updatedCompany: Company = { ...company, ...updates };
    this.companies.set(id, updatedCompany);
    return updatedCompany;
  }

  // Metrics methods
  async getMetrics(companyId: number): Promise<Metrics[]> {
    return this.metricsMap.get(companyId) || [];
  }

  async getMetricsForQuarter(companyId: number, quarter: number, year: number): Promise<Metrics | undefined> {
    const companyMetrics = this.metricsMap.get(companyId) || [];
    return companyMetrics.find(m => m.quarter === quarter && m.year === year);
  }

  async createMetrics(insertMetrics: InsertMetrics): Promise<Metrics> {
    const id = this.currentId.metrics++;
    const createdAt = new Date();
    const newMetrics: Metrics = { ...insertMetrics, id, createdAt };
    
    const companyMetrics = this.metricsMap.get(insertMetrics.companyId) || [];
    companyMetrics.push(newMetrics);
    this.metricsMap.set(insertMetrics.companyId, companyMetrics);
    
    return newMetrics;
  }

  // Decision methods
  async getDecisions(companyId: number): Promise<Decision[]> {
    return this.decisions.get(companyId) || [];
  }

  async getDecisionsForQuarter(companyId: number, quarter: number, year: number): Promise<Decision[]> {
    const companyDecisions = this.decisions.get(companyId) || [];
    return companyDecisions.filter(d => d.quarter === quarter && d.year === year);
  }

  async createDecision(insertDecision: InsertDecision): Promise<Decision> {
    const id = this.currentId.decisions++;
    const createdAt = new Date();
    const newDecision: Decision = { ...insertDecision, id, createdAt };
    
    const companyDecisions = this.decisions.get(insertDecision.companyId) || [];
    companyDecisions.push(newDecision);
    this.decisions.set(insertDecision.companyId, companyDecisions);
    
    return newDecision;
  }

  // Event methods
  async getEvents(companyId: number): Promise<Event[]> {
    return this.events.get(companyId) || [];
  }

  async getActiveEvents(companyId: number): Promise<Event[]> {
    const companyEvents = this.events.get(companyId) || [];
    return companyEvents.filter(e => !e.resolved);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.currentId.events++;
    const createdAt = new Date();
    const newEvent: Event = { ...insertEvent, id, resolved: false, createdAt };
    
    const companyEvents = this.events.get(insertEvent.companyId) || [];
    companyEvents.push(newEvent);
    this.events.set(insertEvent.companyId, companyEvents);
    
    return newEvent;
  }

  async resolveEvent(id: number): Promise<Event | undefined> {
    for (const [companyId, events] of this.events.entries()) {
      const eventIndex = events.findIndex(e => e.id === id);
      if (eventIndex >= 0) {
        const event = events[eventIndex];
        const updatedEvent = { ...event, resolved: true };
        events[eventIndex] = updatedEvent;
        this.events.set(companyId, events);
        return updatedEvent;
      }
    }
    return undefined;
  }

  // Competitor methods
  async getCompetitors(companyId: number): Promise<Competitor[]> {
    return this.competitors.get(companyId) || [];
  }

  async createCompetitor(insertCompetitor: InsertCompetitor): Promise<Competitor> {
    const id = this.currentId.competitors++;
    const createdAt = new Date();
    const newCompetitor: Competitor = { ...insertCompetitor, id, createdAt };
    
    const companyCompetitors = this.competitors.get(insertCompetitor.companyId) || [];
    companyCompetitors.push(newCompetitor);
    this.competitors.set(insertCompetitor.companyId, companyCompetitors);
    
    return newCompetitor;
  }

  async updateCompetitor(id: number, updates: Partial<Competitor>): Promise<Competitor | undefined> {
    for (const [companyId, competitors] of this.competitors.entries()) {
      const competitorIndex = competitors.findIndex(c => c.id === id);
      if (competitorIndex >= 0) {
        const competitor = competitors[competitorIndex];
        const updatedCompetitor = { ...competitor, ...updates };
        competitors[competitorIndex] = updatedCompetitor;
        this.competitors.set(companyId, competitors);
        return updatedCompetitor;
      }
    }
    return undefined;
  }
}

export const storage = new MemStorage();
