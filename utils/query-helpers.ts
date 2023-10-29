//@ts-nocheck
import { NextFunction } from 'express';
export const registerOrigin = function (origin: string) {
  return function (next: NextFunction) {
    console.log('before', origin, this.options.origin);
    this.options.origin = this.options.origin || origin;
    console.log('after', origin, this.options.origin);
    next();
  };
};
