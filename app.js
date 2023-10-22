import express from 'express';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import { STATIC_FOLDER } from './paths.js';
import { CustomError } from './classes/customError.js';
import { errorHandler } from './handlers/errorHandler.js';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
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
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price',
    ],
}));
//Static folder
app.use(express.static(STATIC_FOLDER));
// app.use((req: Request, res: Response, next: NextFunction) => {
//   console.log('Hello from the middleware 👌');
//   next();
// });
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});
//ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.all('*', (req, res, next) => {
    const err = new CustomError(`Can't find ${req.originalUrl} on this server!`);
    next(err);
});
app.use(errorHandler);
export default app;
