import User from '../models/userModel.js';
import { catchAsync } from '../utils/routerFunctions.js';
import { CustomError } from '../classes/customError.js';
import { filterObject } from '../utils/objectFunctions.js';
import { createOne, deleteOne, getAll, getOne, updateOne, } from './genericController.js';
import multer from 'multer';
import sharp from 'sharp';
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const extension = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${extension}`);
//   },
// });
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        return cb(null, true);
    }
    cb(new CustomError('File is not an image.', 400));
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
export const uploadPhoto = upload.single('photo');
// export const getAllUsers = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     let users = await User.find();
//
//     const usersCleaned = JSON.parse(JSON.stringify(users)).map((el: any) => {
//       if (el.passwordChangedAt) delete el.passwordChangedAt;
//       return el;
//     });
//
//     res.status(200).json({
//       status: 'success',
//       results: users.length,
//       data: { usersCleaned },
//     });
//   }
// );
export const updateMyInfo = catchAsync(async function (req, res, next) {
    if (req.body.password || req.body.passwordConfirm) {
        throw new CustomError("You can't change password here", 400);
    }
    const filteredInfo = filterObject(req.body, 'name', 'email');
    if (req.file)
        filteredInfo.photo = req.file.filename;
    const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredInfo, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: 'success',
        data: {
            updatedUser,
        },
    });
});
export const resizeUserPhoto = catchAsync(async function (req, res, next) {
    if (!req.file)
        return next();
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);
    next();
});
export const deleteMyAccount = catchAsync(async function (req, res, next) {
    //get user from req.user
    const user = await User.findById(req.user._id).select('+password +isActive');
    if (!user) {
        throw new CustomError('User not found', 400);
    }
    //ask for log in credentials
    //check password to records
    const passwordIsValid = await user.passwordsMatch(req.body.password);
    if (!passwordIsValid) {
        throw new CustomError('Password does not match our records', 400);
    }
    //set isactive to false
    if (!user.isActive) {
        throw new CustomError('Account already deleted', 400);
    }
    user.isActive = false;
    try {
        await user.save({ validateBeforeSave: false });
    }
    catch (error) {
        console.error(error);
        throw error;
    }
    res.status(204).json();
});
export const setID = catchAsync(async function (req, res, next) {
    if (!req.params.userId) {
        req.params.userId = req.user._id;
    }
    next();
});
export const getUser = getOne(User);
export const createUser = createOne(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
export const getAllUsers = getAll(User);
