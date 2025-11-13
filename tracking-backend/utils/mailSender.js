const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: , 
  port: 587,                
  secure: false,           
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.error("SMTP connection error:", err);
  } else {
    console.log("SMTP ready to send emails");
  }
});

module.exports = transporter;
