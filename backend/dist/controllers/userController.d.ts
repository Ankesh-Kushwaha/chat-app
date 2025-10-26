import express from 'express';
import type { Request, Response } from 'express';
export declare const userSignup: (req: Request, res: Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
export declare const userLogin: (req: Request, res: Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
export declare const deleteProfile: (req: Request, res: Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
export declare const updateProfile: (req: Request, res: Response) => Promise<void>;
export declare const getUserProfile: (req: Request, res: Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
export declare const getUserFriends: (req: Request, res: Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
export declare const getAllUser: (req: Request, res: Response) => Promise<void>;
export declare const sendFriendRequest: (req: Request, res: Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
export declare const acceptFriendRequest: (req: Request, res: Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
export declare const getAllPendingRequest: (req: Request, res: Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
export declare const declineArequest: (req: Request, res: Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=userController.d.ts.map