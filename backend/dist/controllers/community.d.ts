import type { Request, Response } from "express";
export declare const createCommunity: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const DeleteCommunity: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const GetALLCommunity: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const GetSingleCommunity: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const LeaveCommunity: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const JoinACommunity: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const GetALLCommunityUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=community.d.ts.map