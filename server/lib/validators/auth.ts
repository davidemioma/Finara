import { z } from "zod";

export const RegisterSchema = z.object({
  firstName: z.string().min(3, { message: "First name is required." }).trim(),
  lastName: z.string().min(3, { message: "Last name is required." }).trim(),
  address: z.string().min(3, { message: "Adress is required." }).trim(),
  city: z.string().min(3, { message: "City is required." }).trim(),
  country: z.string().min(3, { message: "Country is required." }).trim(),
  state: z.string().min(3, { message: "State is required." }).trim(),
  postcode: z
    .string()
    .min(3, { message: "City is required." })
    .max(6, { message: "Invalid postcode" })
    .trim(),
  dateOfBirth: z
    .string()
    .min(3, { message: "Date of Birth is required." })
    .trim(),
  ssn: z.string().min(3, { message: "SSN is required." }).trim(),
  email: z.string().email({ message: "Invalid email format." }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(20, { message: "Password must be at most 20 characters long." })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

export type RegisterValidator = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid email format." }),
  password: z.string().min(1, { message: "Password is required" }),
  code: z.optional(z.string()),
});

export type LoginValidator = z.infer<typeof LoginSchema>;

export const VerifyTokenSchema = z.object({
  token: z
    .string()
    .refine(
      (val) =>
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
          val
        ),
      {
        message: "Invalid token format",
      }
    ),
});

export const ResetSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid email format." }),
});

export type ResetValidator = z.infer<typeof ResetSchema>;

export const NewPasswordSchema = z.object({
  token: z
    .string()
    .refine(
      (val) =>
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
          val
        ),
      {
        message: "Invalid token format",
      }
    ),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(20, { message: "Password must be at most 20 characters long." })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

export type NewPasswordValidator = z.infer<typeof NewPasswordSchema>;

export const SettingsSchema = z
  .object({
    firstName: z.string().min(3, { message: "First name is required." }).trim(),
    lastName: z.string().min(3, { message: "Last name is required." }).trim(),
    address: z.string().min(3, { message: "Adress is required." }).trim(),
    city: z.string().min(3, { message: "City is required." }).trim(),
    country: z.string().min(3, { message: "Country is required." }).trim(),
    state: z.string().min(3, { message: "State is required." }).trim(),
    ssn: z.string().min(3, { message: "SSN is required." }).trim(),
    postcode: z
      .string()
      .min(3, { message: "City is required." })
      .max(6, { message: "Invalid postcode" })
      .trim(),
    dateOfBirth: z
      .string()
      .min(3, { message: "Date of Birth is required." })
      .trim(),
    isTwoFactorEnabled: z.optional(z.boolean()),
    email: z.optional(z.string().email()),
    password: z.optional(
      z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .max(20, { message: "Password must be at most 20 characters long." })
        .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
        .regex(/[0-9]/, { message: "Contain at least one number." })
        .regex(/[^a-zA-Z0-9]/, {
          message: "Contain at least one special character.",
        })
        .trim()
    ),
    newPassword: z.optional(
      z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .max(20, { message: "Password must be at most 20 characters long." })
        .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
        .regex(/[0-9]/, { message: "Contain at least one number." })
        .regex(/[^a-zA-Z0-9]/, {
          message: "Contain at least one special character.",
        })
        .trim()
    ),
  })
  .refine((data) => {
    if (!data.password && !data.newPassword) {
      return true;
    }
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    }
  );

export type SettingsValidator = z.infer<typeof SettingsSchema>;
