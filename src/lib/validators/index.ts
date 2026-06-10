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

export const aiOfferInputSchema = z.object({
  businessType: businessTypeSchema,
  businessName: z.string().min(1, "Le nom du commerce est requis.").max(80),
  products: z
    .array(
      z.object({
        name: z.string().max(80),
        price: z.number().nonnegative().optional(),
      }),
    )
    .max(50)
    .optional()
    .default([]),
  intention: z
    .string()
    .min(3, "Le texte de l'offre est trop court.")
    .max(500, "Le texte est trop long."),
  timeOfDay: z.string().max(20).optional(),
  objective: z
    .enum(["sell_today", "destock", "new_product", "loyalty"])
    .optional()
    .default("sell_today"),
  language: z.string().max(5).optional().default("fr"),
});

export type AiOfferInput = z.infer<typeof aiOfferInputSchema>;

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
