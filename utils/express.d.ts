import { Request } from 'express';
import { ObjectId } from 'mongoose';
import { Multer } from 'multer';

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
      user: any;
      filterObj: any;
    }
  }
}
