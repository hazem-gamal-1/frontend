import { z } from "zod";

export const resetPassword_Schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"], // 👈 error will appear under the confirm field
  });

export type ResetPasswordSchema = z.infer<typeof resetPassword_Schema>;
