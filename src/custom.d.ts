// custom.d.ts

import { Staff } from '../models/staff';
import { Request } from 'express';

declare module 'express' {
  interface Request {
    staff?: Staff;
  }
}
