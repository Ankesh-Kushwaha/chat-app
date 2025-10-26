import type { NextFunction, Response, Request } from "express";
import logger from "../utils/logger.js";
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction)=>{
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(400).json("unauthorised");
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET_KEY;
    if (!token || !secret) return res.status(400).json("jwt payload error");
    //verify the token 
    const decodedToken = jwt.verify(token,secret) as JwtPayload;
    if (!decodedToken) return res.status(400).json("authorisation failed");
    const userId = decodedToken.userId;
    (req as AuthenticatedRequest).userId = userId;
    next();
  }
  catch (err) {
    if (err instanceof Error) {
      logger.error("error in auth middleware", err.message);
      res.status(500).json({ success: false, message: "Something went wrong" });
    } else {
      logger.error("error in auth middleware:", String(err));
      res.status(500).json({ success: false, message: "Unknown error" });
    }
  }
}