import { z } from "zod";
export const signupVerification = z.object({
    name: z.string({ required_error: "Name is required" }),
    email: z
        .string({ required_error: "Email is required" })
        .email("Invalid email format"),
    password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters"),
    bio: z.string(),
});
export const loginVerification = z.object({
    email: z.string({ required_error: "Email is required" })
        .email("Invalid email format"),
    password: z.string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters"),
});
export const communityCreationVerification = z.object({
    name: z.string({ required_error: "community name is required" }),
    description: z.string({ required_error: "community description is required" })
});
export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    }
    catch (err) {
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
//# sourceMappingURL=zodVerification.js.map