import { Request } from 'express';

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
    }
  }
}
