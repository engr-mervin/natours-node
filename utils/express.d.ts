import { Request } from 'express';
import { ObjectId } from 'mongoose';
import { Multer } from 'multer';
import SMTPConnection from 'nodemailer/lib/smtp-connection';

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

declare global {
  namespace SMTPConnection {
    interface TransportOptions {
      host?: string;
    }
  }
}
