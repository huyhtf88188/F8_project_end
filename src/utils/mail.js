import nodemailer from "nodemailer";
import env from "../config/config.js";

const {
  SMTP_PASSWORD,
  SMTP_PORT,
  SMTP_HOST,
  SMTP_OF_MY,
  SMTP_SECRET,
  SMTP_USERNAME,
} = env;

export const transporter = nodemailer.createTransport({
  host: `${SMTP_HOST}`,
  port: `${SMTP_HOST}`,
  secure: `${SMTP_SECRET}`, // true for port 465, false for other ports
  auth: {
    user: `${SMTP_OF_MY}`,
    pass: `${SMTP_PASSWORD}`,
  },
});

// async..await is not allowed in global scope, must use a wrapper
export const sendMailTo = async (to, subject, content) => {
  console.log(to);

  const info = await transporter.sendMail({
    from: `${SMTP_USERNAME}  <${SMTP_USERNAME}>`,
    to, // list of receivers
    subject,
    html: content,
    replyTo: `${SMTP_OF_MY}`,
  });
  return info;
};
