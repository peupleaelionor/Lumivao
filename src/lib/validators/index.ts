import { z } from "zod";

// ── Schémas Zod — validation de toutes les entrées API ───────────────

export const businessTypeSchema = z.enum([
  "snack",
  "restaurant",
  "epicerie",
  "salon",
  "onglerie",
  "telephone",
  "pressing",
  "bazar",
]);

export const advisorObjectiveSchema = z.enum([
  "sell_today",
  "clear_stock",
  "increase_basket",
  "bring_back_customers",
  "fill_empty_slot",
  "get_reviews",
  "build_loyalty",
]);

export const advisorInputSchema = z.object({
  businessType: businessTypeSchema,
  businessName: z.string().min(1, "Le nom du commerce est requis.").max(80),
  city: z.string().max(60).optional(),
  products: z
    .array(z.object({ name: z.string().max(80), price: z.number().nonnegative().optional() }))
    .max(50)
    .optional()
    .default([]),
  customersCount: z.number().int().nonnegative().max(100000).optional().default(0),
  intention: z.string().max(500).optional().default(""),
  timeOfDay: z.enum(["matin", "midi", "apres_midi", "soir"]).optional(),
  dayOfWeek: z.string().max(20).optional(),
  objective: advisorObjectiveSchema.optional().default("sell_today"),
  language: z.string().max(5).optional().default("fr"),
});

export type AdvisorInput = z.infer<typeof advisorInputSchema>;

export const offerEngineInputSchema = z.object({
  businessType: businessTypeSchema,
  businessName: z.string().min(1, "Le nom du commerce est requis.").max(80),
  city: z.string().max(60).optional(),
  intention: z
    .string()
    .max(500, "La situation est trop longue.")
    .optional()
    .default(""),
  products: z
    .array(z.object({ name: z.string().max(80), price: z.number().nonnegative().optional() }))
    .max(50)
    .optional()
    .default([]),
  timeOfDay: z.enum(["matin", "midi", "apres_midi", "soir"]).optional(),
  dayOfWeek: z.string().max(20).optional(),
  objective: advisorObjectiveSchema.optional().default("sell_today"),
  averageBasket: z.number().nonnegative().max(100000).nullable().optional(),
  language: z.string().max(5).optional().default("fr"),
});

export type OfferEngineInput = z.infer<typeof offerEngineInputSchema>;

export const flyerInputSchema = z.object({
  businessName: z.string().min(1).max(80),
  headline: z.string().min(1).max(120),
  description: z.string().max(240).optional().default(""),
  price: z.string().max(40).optional().default(""),
  oldPrice: z.string().max(40).optional().default(""),
  cta: z.string().max(60).optional().default("Commander sur WhatsApp"),
  qrUrl: z.string().url().optional(),
  format: z.enum(["square", "story", "a4"]).optional().default("square"),
});

export type FlyerInput = z.infer<typeof flyerInputSchema>;

export const qrInputSchema = z.object({
  data: z.string().min(1, "Le contenu du QR est requis.").max(1000),
  size: z.coerce.number().int().min(120).max(1024).optional().default(360),
});

export const whatsappInputSchema = z.object({
  phone: z.string().min(5).max(25),
  message: z.string().min(1).max(2000),
});

export const publicBusinessQuerySchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Slug invalide."),
});
