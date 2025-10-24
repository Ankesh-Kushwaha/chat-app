import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import type { AnyZodObject } from "zod";

export const signupVerification = z.object({
  name: z.string({ required_error: "Name is required" }),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next(); 
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        errors: err.errors.map((e) => e.message),
      });
    }
    return res.status(400).json({
      success: false,
      errors: ["Invalid request"],
    });
  }
};
