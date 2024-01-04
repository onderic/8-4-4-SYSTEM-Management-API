// custom.d.ts

import { Staff } from '../models/staff'; // Update the import path based on your project structure
import { Request } from 'express';

declare module 'express' {
  interface Request {
    staff?: Staff;
  }
}
