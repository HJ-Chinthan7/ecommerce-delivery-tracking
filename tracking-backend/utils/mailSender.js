
const nodemailer = require("nodemailer");
require("dotenv").config();
const SibApiV3Sdk = require("@sendinblue/client");

//nodemailer can tbe used in render so it is upgrade to api call by sqtransporter with nodemailer
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,           
//   secure: true,       
//   auth: {
//     user: process.env.MAIL_USER, 
//     pass: process.env.MAIL_PASS, 
//   },
// });

const client = new SibApiV3Sdk.TransactionalEmailsApi();
client.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const transporter = {
  sendMail: async ({ from, to, subject, text, html }) => {
    if (!from) from = process.env.FROM_EMAIL;
    const emailData = {
      sender: { email: from },
      to: [{ email: to }],
      subject,
      textContent: text,
      htmlContent: html || text,
    };

    try {
      const response = await client.sendTransacEmail(emailData);
      return response;
    } catch (err) {
      console.error("Brevo send error:", err.response?.body || err);
      throw err;
    }
  },
};

module.exports = transporter;