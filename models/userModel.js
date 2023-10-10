//@ts-nocheck
import * as argon2 from 'argon2';
import mongoose from '../mongooseClient.js';
import { validator } from '../utils/validators.js';
import { EMAIL_REGEX } from '../utils/constants.js';
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Name is required for a user.'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'E-mail is required for user.'],
        lowercase: true,
        validate: {
            validator: validator(EMAIL_REGEX),
            message: 'E-mail is invalid.',
        },
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        minlength: 8,
        validate: {
            validator: function (el) {
                return this.password === el;
            },
            message: 'The passwords do not match.',
        },
    },
    lastPasswordModification: {
        type: Date,
    },
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });
userSchema.pre('save', async function (next) {
    if (this.isModified('password') === false) {
        return next();
    }
    let password = this.password;
    try {
        password = await argon2.hash(password, { type: 2 });
        this.password = password;
        this.passwordConfirm = undefined;
        //FOR MODIFICATION
        this.lastPasswordModification = Date.now();
        next();
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
userSchema.methods.passwordsMatch = async function (candidatePassword) {
    const result = await argon2.verify(this.password, candidatePassword, {
        type: 2,
    });
    return result;
};
userSchema.methods.passwordModifiedAfter = async function (jwtStamp) {
    if (this.lastPasswordModification) {
        const timeStamp = parseInt(this.lastPasswordModification.getTime() / 1000, 10);
        console.log(timeStamp, jwtStamp);
        if (timeStamp > jwtStamp)
            return true;
    }
    return false;
};
const User = mongoose.model('User', userSchema);
export default User;
