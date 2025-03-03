import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertResumeSchema } from "@shared/schema";
import { improveSummary, improveExperience } from "./lib/openai";
import { ZodError } from "zod";

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Create new resume
  app.post("/api/resumes", async (req, res) => {
    try {
      const resume = insertResumeSchema.parse(req.body);
      const created = await storage.createResume(resume);
      res.json(created);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid resume data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create resume" });
      }
    }
  });

  // Get resume by id
  app.get("/api/resumes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const resume = await storage.getResume(id);
    if (!resume) {
      res.status(404).json({ message: "Resume not found" });
      return;
    }
    res.json(resume);
  });

  // Get all resumes
  app.get("/api/resumes", async (_req, res) => {
    const resumes = await storage.getAllResumes();
    res.json(resumes);
  });

  // Update resume
  app.put("/api/resumes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const resume = insertResumeSchema.parse(req.body);
      const updated = await storage.updateResume(id, resume);
      res.json(updated);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid resume data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update resume" });
      }
    }
  });

  // Delete resume
  app.delete("/api/resumes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteResume(id);
    res.status(204).end();
  });

  // AI improvement endpoints
  app.post("/api/improve/summary", async (req, res) => {
    try {
      const { summary } = req.body;
      const improved = await improveSummary(summary);
      res.json({ improved });
    } catch (error) {
      res.status(500).json({ message: "Failed to improve summary" });
    }
  });

  app.post("/api/improve/experience", async (req, res) => {
    try {
      const { description } = req.body;
      const improved = await improveExperience(description);
      res.json({ improved });
    } catch (error) {
      res.status(500).json({ message: "Failed to improve experience" });
    }
  });

  return httpServer;
}
