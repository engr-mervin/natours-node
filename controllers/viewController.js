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
    options: {
      origin: 'tour',
    },
  });
  console.log(tour);
  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});
