import User from '../models/userModel.js';
import { catchAsync } from '../utils/routerFunctions.js';
import jwt from 'jsonwebtoken';
import { CustomError } from '../classes/customError.js';
import { validator } from '../utils/validators.js';
import { EMAIL_REGEX } from '../utils/constants.js';
const signToken = function (id) {
    return jwt.sign({ id }, process.env.JSONWEBTOKEN_SECRET, {
        expiresIn: process.env.JSONWEBTOKEN_EXPIRY,
    });
};
export const signup = catchAsync(async function (req, res, next) {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });
    const token = signToken(newUser._id);
    res.status(201).json({
        status: 'success',
        token,
    });
});
export const login = catchAsync(async function (req, res, next) {
    const { email, password } = req.body;
    //check the validity of email and passowrd
    if (!email || !password) {
        throw new CustomError('Please provide email and password!', 400);
    }
    //validate the email
    if (!validator(EMAIL_REGEX)(email)) {
        throw new CustomError('Email is invalid!', 400);
    }
    //get the hash of email from server
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new CustomError('User does not exist!', 400);
    }
    //hash the password and compare
    const matched = await user.passwordsMatch(password);
    if (!matched) {
        throw new CustomError('The password does not match with our records.', 401);
    }
    //if it exists send a JWT
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token,
    });
});
export const protect = catchAsync(async function (req, res, next) {
    //check request if it contains a JWT
    if (!req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer')) {
        throw new CustomError('You are not logged in, please log in to get access.', 401);
    }
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        throw new CustomError('Invalid user credentials.', 401);
    }
    //verify the JWT
    const payload = jwt.verify(token, process.env.JSONWEBTOKEN_SECRET, (error, payload) => {
        if (error)
            throw error;
        return payload;
    });
    console.log(payload);
    //if verified get the user
    const candidateUser = await User.findById(payload.id);
    if (candidateUser === undefined || candidateUser === null) {
        throw new CustomError('User does not exist.', 401);
    }
    const isModified = await candidateUser.passwordModifiedAfter(payload.iat);
    console.log(isModified);
    if (isModified) {
        throw new CustomError('Token is no longer valid. Please log in again.', 401);
    }
    next();
});
