import { z } from "zod";
export declare const signupVerification: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    bio: z.ZodString;
}, z.core.$strip>;
export declare const loginVerification: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const communityCreationVerification: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=zodVerification.d.ts.map