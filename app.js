import express from 'express';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import { STATIC_FOLDER } from './paths.js';
import { CustomError } from './classes/customError.js';
import { errorHandler } from './handlers/errorHandler.js';
const app = express();
//MIDDLEWARES
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }
app.use(express.json());
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
app.all('*', (req, res, next) => {
    const err = new CustomError(`Can't find ${req.originalUrl} on this server!`);
    next(err);
});
app.use(errorHandler);
export default app;
