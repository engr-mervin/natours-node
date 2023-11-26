import express from 'express';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import viewRouter from './routes/viewRoutes.js';
import { STATIC_FOLDER, VIEW_FOLDER } from './paths.js';
import { CustomError } from './classes/customError.js';
import { errorHandler } from './handlers/errorHandler.js';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
const app = express();
const scriptSrcUrls = ['https://unpkg.com/', 'https://tile.openstreetmap.org'];
const styleSrcUrls = [
    'https://unpkg.com/',
    'https://tile.openstreetmap.org',
    'https://fonts.googleapis.com/',
    'https://tiles.stadiamaps.com',
];
const connectSrcUrls = ['https://unpkg.com', 'https://tile.openstreetmap.org'];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];
//MIDDLEWARES
//Security Headers
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: [],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", 'blob:'],
        objectSrc: [],
        imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
        fontSrc: ["'self'", ...fontSrcUrls],
    },
}));
//Log actions
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(cookieParser());
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
app.set('view engine', 'pug');
app.set('views', VIEW_FOLDER);
//Static folder
app.use(express.static(STATIC_FOLDER));
// app.use((req: Request, res: Response, next: NextFunction) => {
//   console.log('Hello from the middleware 👌');
//   next();
// });
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.cookies);
    next();
});
app.use('*', async function (req, res, next) {
    req.filterObj = {};
    req.user = {};
    next();
});
//ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
//PAGES
app.use('/', viewRouter);
app.all('*', (req, res, next) => {
    const err = new CustomError(`Can't find ${req.originalUrl} on this server!`);
    next(err);
});
app.use(errorHandler);
export default app;
