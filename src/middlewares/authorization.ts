// import { CustomRequest } from './authentication';
// import { Response, NextFunction } from 'express';

// export const requireRole = (requiredRole: string) => {
//   return (req: CustomRequest, res: Response, next: NextFunction) => {
//     const userRole = (req.token as { role?: string })?.role;

//     if (!userRole || userRole !== requiredRole) {
//       return res.status(403).json({
//         error: 'Authorization failed',
//         message: 'You do not have the required role to access this resource',
//       });
//     }

//     next();
//   };
// };
