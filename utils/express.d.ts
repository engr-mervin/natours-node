import { Request } from 'express';
import { ObjectId } from 'mongoose';

export enum Roles {
  Admin = 'admin',
  User = 'user',
  Guide = 'guide',
  LeadGuide = 'lead-guide',
}
declare global {
  namespace Express {
    interface Request {
      requestTime: string;
      payload: { [key: string]: any };
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      user: any;
      filterObj: any;
    }
  }
}
