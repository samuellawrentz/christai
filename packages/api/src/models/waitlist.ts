import Elysia from "elysia";
import { z } from "zod";

export const waitlistInsertSchema = z.object({
  email: z.string().email("Invalid email format"),
  source: z.string().optional(),
});

export type WaitlistInsert = z.infer<typeof waitlistInsertSchema>;

export const waitlistModels = new Elysia().model({
  waitlistInsert: waitlistInsertSchema,
});
