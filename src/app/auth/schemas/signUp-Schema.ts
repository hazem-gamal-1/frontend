// schemas/signupSchema.ts
import { z } from "zod";

export const signUp_Schema = z.object({
  userType: z.enum(["candidate", "company"]),
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(11, "Enter a valid phone number."),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept terms and conditions",
  }),
});

export type SignupFormValues = z.infer<typeof signUp_Schema>;
