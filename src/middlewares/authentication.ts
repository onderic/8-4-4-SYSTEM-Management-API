import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import CustomRequest from '../types/custom';

export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  const tokenParts = authorizationHeader.split(' ');

  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    res.status(401).json({ message: 'Unauthorized: Invalid token format' });
    return;
  }

  const token = tokenParts[1];

  jwt.verify(
    token,
    process.env.JWT_SECRET || '',
    (err: jwt.VerifyErrors | null, decoded: any) => {
      if (err) {
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
        return;
      }

      // Attach the decoded information to the request object for use in other middleware or routes
      req.staffId = decoded.staffId;
      req.email = decoded.email;
      req.role = decoded.role;

      next();
    }
  );
};
