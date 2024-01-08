// corsMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const corsMiddleware = cors({
  origin: 'http://localhost:5173/', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});

export default function (req: Request, res: Response, next: NextFunction): void {
  corsMiddleware(req, res, next);
}
