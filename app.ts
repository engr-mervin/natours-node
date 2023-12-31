import { Request, Response, NextFunction } from 'express';
import express from 'express';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import { STATIC_FOLDER, VIEW_FOLDER, __rootdirname } from './paths.js';
import { CustomError } from './classes/customError.js';
import { errorHandler } from './handlers/errorHandler.js';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import { catchAsync } from './utils/routerFunctions.js';

const app = express();

//MIDDLEWARES

//Security Headers
app.use(helmet());

//Log actions
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit API requests
const limiter = rateLimit({
  max: 360,
  windowMs: 3600000,
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api', limiter);

//Body parser
app.use(express.json({ limit: '10kb' }));

//sanitizers
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.set('view engine', 'pug');
app.set('views', VIEW_FOLDER);
//Static folder
app.use(express.static(STATIC_FOLDER));

// app.use((req: Request, res: Response, next: NextFunction) => {
//   console.log('Hello from the middleware 👌');
//   next();
// });

app.use((req: Request, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use('*', async function (req: Request, res: Response, next: NextFunction) {
  req.filterObj = {};
  req.user = {};
  next();
});

//PAGES
app.get(
  '/',
  catchAsync(async function (req: Request, res: Response) {
    res.status(200).render('base', {
      tour: 'The Forest Hiker',
      user: 'Jonas',
    });
  })
);

app.get(
  '/overview',
  catchAsync(async function (req: Request, res: Response) {
    res.status(200).render('overview', {
      title: 'All Tours',
    });
  })
);

app.get(
  '/tour',
  catchAsync(async function (req: Request, res: Response) {
    res.status(200).render('tour', {
      title: 'The Forest Hiker Tour',
    });
  })
);

//ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new CustomError(`Can't find ${req.originalUrl} on this server!`);
  next(err);
});

app.use(errorHandler);

export default app;
