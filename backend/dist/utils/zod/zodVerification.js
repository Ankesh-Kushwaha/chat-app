import { z } from "zod";
export const signupVerification = z.object({
    name: z.string(),
    email: z
        .string()
        .email("Invalid email format"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
    bio: z.string(),
});
export const loginVerification = z.object({
    email: z.string()
        .email("Invalid email format"),
    password: z.string()
        .min(6, "Password must be at least 6 characters"),
});
export const communityCreationVerification = z.object({
    name: z.string(),
    description: z.string()
});
//# sourceMappingURL=zodVerification.js.map