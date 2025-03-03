import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  personalInfo: json("personal_info").$type<{
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  }>().notNull(),
  education: json("education").$type<{
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }[]>().notNull(),
  experience: json("experience").$type<{
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string[];
  }[]>().notNull(),
  skills: text("skills").array().notNull(),
  template: text("template").notNull(),
});

export const insertResumeSchema = createInsertSchema(resumes);

export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;

// Form validation schemas
export const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  summary: z.string().min(50, "Summary must be at least 50 characters"),
});

export const educationSchema = z.object({
  school: z.string().min(2, "School name is required"),
  degree: z.string().min(2, "Degree is required"),
  field: z.string().min(2, "Field of study is required"),
  startDate: z.string().min(4, "Start date is required"),
  endDate: z.string().min(4, "End date is required"),
});

export const experienceSchema = z.object({
  company: z.string().min(2, "Company name is required"),
  position: z.string().min(2, "Position is required"),
  location: z.string().min(2, "Location is required"),
  startDate: z.string().min(4, "Start date is required"),
  endDate: z.string().min(4, "End date is required"),
  description: z.array(z.string().min(10, "Description must be at least 10 characters")),
});
