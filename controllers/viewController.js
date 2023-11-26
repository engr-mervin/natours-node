import { catchAsync } from '../utils/routerFunctions.js';
import Tour from '../models/tourModel.js';
// export const renderHome = catchAsync(async function (
//   req: Request,
//   res: Response
// ) {
//   res.status(200).render('base', {
//     tour: 'The Forest Hiker',
//     user: 'Jonas',
//   });
// });
export const renderOverview = catchAsync(async function (req, res) {
    const tours = await Tour.find();
    res.status(200).render('overview', {
        title: 'All Tours',
        tours,
    });
});
export const renderTours = catchAsync(async function (req, res) {
    const tour = await Tour.findOne({ slug: req.params.tourSlug }).populate({
        path: 'reviews',
        select: 'review rating user',
    });
    res.status(200).render('tour', {
        title: `${tour?.name || ''} Tour`,
        tour,
    });
});
export const renderLogin = catchAsync(async function (req, res) {
    if (!res.locals.user) {
        return res.status(200).render('login', { title: 'Login' });
    }
    return res.redirect('/');
});
