//@ts-nocheck
import nodemailer from 'nodemailer';
export const sendEmail = async function (options) {
    //Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAILER_HOST,
        port: process.env.EMAILER_PORT,
        auth: {
            user: process.env.EMAILER_ADDRESS,
            pass: process.env.EMAILER_PASSWORD,
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
