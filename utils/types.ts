import { type } from 'os';

export type Tour = {
  id: number;
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  startDates: string[];
};

export type JSEND = {
  status: string;
  results?: number;
  data?: { [key: string]: any };
};
