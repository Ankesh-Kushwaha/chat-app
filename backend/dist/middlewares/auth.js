import logger from "../utils/logger.js";
import jwt from 'jsonwebtoken';
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(400).json("unauthorised");
        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET_KEY;
        if (!token || !secret)
            return res.status(400).json("jwt payload error");
        //verify the token 
        const decodedToken = jwt.verify(token, secret);
        if (!decodedToken)
            return res.status(400).json("authorisation failed");
        const userId = decodedToken.userId;
        req.userId = userId;
        next();
    }
    catch (err) {
        if (err instanceof Error) {
            logger.error("error in auth middleware", err.message);
            res.status(500).json({ success: false, message: "Something went wrong" });
        }
        else {
            logger.error("error in auth middleware:", String(err));
            res.status(500).json({ success: false, message: "Unknown error" });
        }
    }
};
//# sourceMappingURL=auth.js.map