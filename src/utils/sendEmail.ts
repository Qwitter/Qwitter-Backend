import nodemailer from 'nodemailer';
import { emailType } from '../types/email-types';
const sendEmail = async (options: emailType) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_SMTP_USERNAME,
      pass: process.env.EMAIL_SMTP_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL,
    to: options.to,
    text: options.text,
    subject: options.subject,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
