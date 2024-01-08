// custom.d.ts
import { Request } from 'express';

interface CustomRequest extends Request {
  staffId?: string;
  email?: string;
  role?: string;
}

export default CustomRequest;
