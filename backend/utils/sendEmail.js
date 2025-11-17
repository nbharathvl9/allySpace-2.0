const nodemailer = require("nodemailer");

const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Password OTP - AllySpace",
    html: `
      <h3>Password Reset Request</h3>
      <p>Your OTP is: <b style="font-size: 20px;">${otp}</b></p>
      <p>This code expires in 5 minutes.</p>
    `,
  });
};

module.exports = sendEmail;