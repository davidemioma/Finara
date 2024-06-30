import { z } from "zod";

export const exchangeTokenSchema = z.object({
  publicToken: z.string().min(1, { message: "Public token is required" }),
});
