import nodemailer from 'nodemailer';
import { emailType } from '../types/email-types';
import * as aws from '@aws-sdk/client-ses';

const awsConfig = {
  apiVersion: '2010-12-01',
  region: 'eu-north-1',
  credentials: {
    accessKeyId: process.env.EMAIL_SMTP_USERNAME,
    secretAccessKey: process.env.EMAIL_SMTP_PASSWORD,
  },
} as aws.SESClientConfig;
const ses = new aws.SES(awsConfig);
const sendEmail = async (options: emailType) => {
  const transporter = nodemailer.createTransport({
    SES: { ses, aws },
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
