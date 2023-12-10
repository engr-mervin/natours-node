//@ts-nocheck
import nodemailer from 'nodemailer';

export const sendEmail = async function (options: any) {
  //Create transporter

  const transporter = nodemailer.createTransport({
    host: process.env.EMAILER_HOST!,
    port: process.env.EMAILER_PORT!,
    auth: {
      user: process.env.EMAILER_ADDRESS!,
      pass: process.env.EMAILER_PASSWORD!,
    },
  });
  //Specify options

  const mailOptions = {
    from: 'Eonox <dev.eonox@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //send the email

  await transporter.sendMail(mailOptions);
};

//Create transporter

const transporter = nodemailer.createTransport({
  host: process.env.EMAILER_HOST!,
  port: process.env.EMAILER_PORT!,
  auth: {
    user: process.env.EMAILER_ADDRESS!,
    pass: process.env.EMAILER_PASSWORD!,
  },
});

export class Email {
  user: any;
  constructor(user: any) {
    this.user = user;
  }

  sendResetPassword = async function (resetURL: string) {
    //Specify options
    const message = `Forgot password? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}\nIf you didn't forget your password, please ignore this email!`;

    const mailOptions = {
      from: 'Eonox <dev.eonox@gmail.com>',
      to: this.user.email,
      subject: 'Reset Password Request: Valid for 10mins',
      text: message,
    };
    //send the email

    await transporter.sendMail(mailOptions);
  };
}
