import type { NextFunction, Response, Request } from "express";
export interface AuthenticatedRequest extends Request {
    userId?: string;
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=auth.d.ts.map