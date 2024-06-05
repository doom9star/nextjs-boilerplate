import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
  },
});
