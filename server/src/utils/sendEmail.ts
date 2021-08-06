import nodemailer from "nodemailer";
require("dotenv").config();

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  console.log(process.env.MAIL_USER);
  console.log(process.env.MAIL_PASS);

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.MAIL_USER, // sender address
    to, // list of receivers
    subject: "Bridge account password reset", // Subject line
    html, // html body
  });

  console.log("Message sent: %s", info.messageId);
};
