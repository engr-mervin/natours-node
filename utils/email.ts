import nodemailer from 'nodemailer';
import pug from 'pug';

import { htmlToText } from 'html-to-text';
// export const sendEmail = async function (options: any) {
//   //Create transporter

//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAILER_HOST!,
//     port: process.env.EMAILER_PORT!,
//     auth: {
//       user: process.env.EMAILER_ADDRESS!,
//       pass: process.env.EMAILER_PASSWORD!,
//     },
//   });
//   //Specify options

//   const mailOptions = {
//     from: 'Eonox <dev.eonox@gmail.com>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };
//   //send the email

//   await transporter.sendMail(mailOptions);
// };

// //Create transporter

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAILER_HOST!,
//   port: process.env.EMAILER_PORT!,
//   auth: {
//     user: process.env.EMAILER_ADDRESS!,
//     pass: process.env.EMAILER_PASSWORD!,
//   },
// });

// export class Email {
//   user: any;
//   constructor(user: any) {
//     this.user = user;
//   }

//   sendResetPassword = async function (resetURL: string) {
//     //Specify options
//     const message = `Forgot password? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}\nIf you didn't forget your password, please ignore this email!`;

//     const mailOptions = {
//       from: 'Eonox <dev.eonox@gmail.com>',
//       to: this.user.email,
//       subject: 'Reset Password Request: Valid for 10mins',
//       text: message,
//     };
//     //send the email

//     await transporter.sendMail(mailOptions);
//   };
// }

export class Emailer {
  to;
  firstName;
  url;
  from;

  constructor(user: any, url: string) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Eonox ${process.env.EMAILER_FROM!}`;
  }

  newTransport(): nodemailer.Transporter | null {
    if (process.env.NODE_ENV! === 'production') {
      //Send Grid
      return null;
    }

    return nodemailer.createTransport({
      host: process.env.EMAILER_HOST!,
      port: Number(process.env.EMAILER_PORT!),
      auth: {
        user: process.env.EMAILER_ADDRESS!,
        pass: process.env.EMAILER_PASSWORD!,
      },
    });
  }

  async send(template: string, subject: string): Promise<void> {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      { firstName: this.firstName, url: this.url, subject }
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    const transporter = this.newTransport();
    await transporter?.sendMail(mailOptions);
  }

  async sendWelcome(): Promise<void> {
    await this.send('Welcome', 'Welcome to the Natours Family!');
  }
}
