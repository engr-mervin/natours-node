import { readFile } from 'fs/promises';
import 'dotenv/config';

import Tour from './models/tourModel.js';
import User from './models/userModel.js';
import Review from './models/reviewModel.js';

const devData = await readFile('./dev-data/data/tours.json', {
  encoding: 'utf-8',
});
const userData = await readFile('./dev-data/data/users.json', {
  encoding: 'utf-8',
});
const reviewsData = await readFile('./dev-data/data/reviews.json', {
  encoding: 'utf-8',
});

const tours = JSON.parse(devData).map((el: any) => {
  // delete el.id;
  return el;
});
const users = JSON.parse(userData).map((el: any) => {
  // delete el.id;
  return el;
});
const reviews = JSON.parse(reviewsData).map((el: any) => {
  // delete el.id;
  return el;
});

const uploadTours = async () => {
  try {
    await Tour.create(tours);
    await User.create(users);
    await Review.create(reviews);
    console.log('Successfully uploaded tours');
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
};

const deleteTours = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Successfully deleted DB');
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
};

console.log(process.argv);
if (process.argv[2] === '--delete') {
  deleteTours();
} else {
  uploadTours();
}
