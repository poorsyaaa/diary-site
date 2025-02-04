import { z } from "zod";

const visitorSchema = z.object({
  type: z.enum(["visitor", "inspection", "delivery"]),
  name: z.string().nonempty({ message: "Name is required" }),
  company: z.string().optional(),
  purpose: z.string().optional(),
});

const baseFormSchema = z.object({
  date: z.string().nonempty({ message: "Date is required" }),
  siteLocation: z.string().nonempty({ message: "Site location is required" }),
  weather: z.string().nonempty({ message: "Weather is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  currentPhase: z.string().nonempty({ message: "Current phase is required" }),
  workCompleted: z.string().optional(),
  hasDelaysOrIssues: z.boolean().default(false),
  delaysOrIssues: z.string().optional(),
  labor: z.string().optional(),
  equipment: z.string().optional(),
  materials: z.string().optional(),
  visitors: z.array(visitorSchema),
  images: z.array(z.string().url("Valid image URL is required")).optional(),
});

export const formSchema = baseFormSchema.refine((data) => !data.hasDelaysOrIssues || (data.hasDelaysOrIssues && data.delaysOrIssues?.trim() !== ""), {
  message: "Please provide details for delays or issues",
  path: ["delaysOrIssues"],
});

export const siteDiaryFilterSchema = z.object({
  date: z.string().optional(),
  site: z.string().optional(),
  phase: z.string().optional(),
  hasIssues: z.boolean().optional(),
  search: z.string().optional(),
  resources: z
    .string()
    .optional()
    .transform((str) => (str ? str.split(",").filter(Boolean) : undefined)),
  orderBy: z.enum(["createdAt", "date", "currentPhase"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const updateFormSchema = baseFormSchema
  .extend({
    id: z.number(),
  })
  .refine((data) => !data.hasDelaysOrIssues || (data.hasDelaysOrIssues && data.delaysOrIssues?.trim() !== ""), {
    message: "Please provide details for delays or issues",
    path: ["delaysOrIssues"],
  });

export type SiteDiaryFormData = z.infer<typeof formSchema>;
export type SiteDiaryFilters = z.infer<typeof siteDiaryFilterSchema>;
export type UpdateSiteDiaryFormData = z.infer<typeof updateFormSchema>;
