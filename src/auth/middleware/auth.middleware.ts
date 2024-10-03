import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || "1234567890";

// Extend the Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: jwt.JwtPayload;
        }
    }
}

// Middleware to protect routes
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: "No token provided, authorization denied" });
        return;
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid token" });
    }
};
