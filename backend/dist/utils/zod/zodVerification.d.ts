import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import type { AnyZodObject } from "zod";
export declare const signupVerification: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
}, {
    name: string;
    email: string;
    password: string;
}>;
export declare const validate: (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=zodVerification.d.ts.map