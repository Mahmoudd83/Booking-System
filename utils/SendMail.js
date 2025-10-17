const nodemailer = require("nodemailer");

const SendMail = async (to, subject, message) => {
  const transporter = nodemailer.createTransport({
     service: "gmail",
    secure: true,
    auth: {
      user: process.env.Email_User,
      pass: process.env.Email_Pass,
    },
  });

  const mailoption = {
    from: process.env.Email_User,
    to,
    subject,
    html: message,
  };

  await transporter.sendMail(mailoption);
};

module.exports = SendMail;