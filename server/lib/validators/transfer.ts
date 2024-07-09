import { z } from "zod";

export const TRANSACTIONSPERPAGE = 10;

export const TransferSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid email format." }),
  note: z.string().min(4, "Transfer note is too short"),
  amount: z.coerce.number().min(10, "Minimum amount is 10"),
  senderBank: z.string().min(1, "Please select a valid bank account"),
  sharaebleId: z.string().min(8, "Please select a valid sharable Id"),
});

export type TransferValidator = z.infer<typeof TransferSchema>;
