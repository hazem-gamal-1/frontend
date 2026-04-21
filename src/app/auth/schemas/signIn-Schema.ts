import { z } from "zod";

export const signIn_Schema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignInFormValues = z.infer<typeof signIn_Schema>;
