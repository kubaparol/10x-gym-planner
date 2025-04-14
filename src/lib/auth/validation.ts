import { z } from "zod";

const passwordSchema = z.string().min(8, "Password must be at least 8 characters");

export const loginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
});

export const registerFormSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const resetPasswordFormSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const newPasswordFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginFormSchema>;
export type RegisterFormData = z.infer<typeof registerFormSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;
export type NewPasswordFormData = z.infer<typeof newPasswordFormSchema>;
