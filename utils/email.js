import nodemailer from 'nodemailer';
import pug from 'pug';
import { htmlToText } from 'html-to-text';
import { EMAIL_TEMPLATES } from '../paths.js';
export class Emailer {
    to;
    firstName;
    url;
    from;
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Eonox ${process.env.EMAILER_FROM}`;
    }
    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            //Brevo
            return nodemailer.createTransport({
                host: process.env.BREVO_HOST,
                port: Number(process.env.BREVO_PORT),
                auth: {
                    user: process.env.BREVO_ADDRESS,
                    pass: process.env.BREVO_PASSWORD,
                },
            });
        }
        return nodemailer.createTransport({
            host: process.env.EMAILER_HOST,
            port: Number(process.env.EMAILER_PORT),
            auth: {
                user: process.env.EMAILER_ADDRESS,
                pass: process.env.EMAILER_PASSWORD,
            },
        });
    }
    async send(template, subject) {
        const html = pug.renderFile(`${EMAIL_TEMPLATES}/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject,
        });
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
    async sendWelcome() {
        await this.send('Welcome', 'Welcome to the Natours Family!');
    }
    async sendPasswordReset() {
        await this.send('passwordReset', 'Reset Password Request');
    }
}
