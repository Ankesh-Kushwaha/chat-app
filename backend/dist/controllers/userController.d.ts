import express from 'express';
import type { Request, Response } from 'express';
export declare const userSignup: (req: Request, res: Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
export declare const userLogin: (req: Request, res: Response) => Promise<void>;
export declare const deleteProfile: (req: Request, res: Response) => Promise<void>;
export declare const getUserProfile: (req: Request, res: Response) => Promise<void>;
export declare const getUserFriends: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=userController.d.ts.map