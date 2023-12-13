//@ts-nocheck
import * as argon2 from 'argon2';
import crypto from 'crypto';
import mongoose from '../mongooseClient.js';
import { validator } from '../utils/validators.js';
import { EMAIL_REGEX } from '../utils/constants.js';
import { registerOrigin } from '../utils/query-helpers.js';

export const userSchema = new mongoose.Schema(
  {
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
      default: 'default.jpg',
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'guide', 'lead-guide'],
      default: 'user',
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
        validator: function (el: string) {
          return this.password === el;
        },
        message: 'The passwords do not match.',
      },
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//save hashed password
userSchema.pre('save', async function (next) {
  if (this.isModified('password') === false) {
    return next();
  }

  let password = this.password;

  try {
    password = await argon2.hash(password, { type: 2 });

    this.password = password;
    this.passwordConfirm = undefined;

    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//Set last password modification time
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, registerOrigin('user'));

userSchema.pre(/^find/, async function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

userSchema.methods.passwordsMatch = async function (candidatePassword) {
  const result = await argon2.verify(this.password, candidatePassword, {
    type: 2,
  });

  return result;
};

userSchema.methods.passwordUpdate = async function (password, passwordConfirm) {
  this.password = password;
  this.passwordConfirm = passwordConfirm;
  await user.save();
};

userSchema.methods.passwordModifiedAfter = async function (jwtStamp: Date) {
  if (this.passwordChangedAt) {
    const timeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    if (timeStamp > jwtStamp) return true;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  //save the hashed reset token in the database in
  //the form of a field in the userSchema
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 5 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;
