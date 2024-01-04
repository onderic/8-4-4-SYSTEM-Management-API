// authMiddleware.ts
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const SECRET_KEY: Secret = process.env.JWT_SECRET || 'a0995f5b68e324680cb121f73966531a8cd6794eb35b2b38884d5694ec97cd70';

export interface CustomRequest extends Request {
  token?: string | JwtPayload;
}

export const auth = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentication failed', message: 'Token not provided' });
    }

    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    (req as CustomRequest).token = decoded;

    next();
  } catch (err) {
    // console.error('Authentication error:', err);
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Authentication failed', message: 'Invalid token' });
    } else if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Authentication failed', message: 'Token expired' });
    }

    res.status(401).json({ error: 'Authentication failed', message: 'Please authenticate' });
  }
};
