//@ts-nocheck
import { NextFunction } from 'express';
export const registerOrigin = function (origin: string) {
  return function (next: NextFunction) {
    this.options.origin = this.options.origin || origin;
    next();
  };
};
