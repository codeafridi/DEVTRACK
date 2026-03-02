import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required").max(100),
  category: z.string().min(1, "Category is required").max(50),
  targetLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
});

export const skillLogSchema = z.object({
  hours: z.number().min(0.1, "Minimum 0.1 hours").max(24, "Maximum 24 hours"),
  notes: z.string().max(500).optional(),
});

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  description: z.string().max(500).optional(),
  status: z.enum(["PLANNING", "BUILDING", "COMPLETED"]),
  githubRepoUrl: z.string().url().optional().or(z.literal("")),
});

export const projectNoteSchema = z.object({
  content: z.string().min(1, "Note content is required").max(1000),
});

export const activityLogSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  description: z.string().min(1, "Description is required").max(500),
  hours: z.number().min(0.1, "Minimum 0.1 hours").max(24, "Maximum 24 hours"),
  tags: z.array(z.string().max(30)).max(10).default([]),
});

export const profileSchema = z.object({
  name: z.string().min(2).max(50),
  githubUsername: z.string().max(39).optional().or(z.literal("")),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type SkillLogInput = z.infer<typeof skillLogSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type ProjectNoteInput = z.infer<typeof projectNoteSchema>;
export type ActivityLogInput = z.infer<typeof activityLogSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
