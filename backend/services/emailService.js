const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendSignerEmail = async (email, documentId) => {

  const link = `http://localhost:5173/sign/${documentId}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Document Signature Request",
    html: `
      <h2>You have been requested to sign a document</h2>
      <p>Click the link below to sign:</p>
      <a href="${link}">${link}</a>
    `,
  });

};

module.exports = sendSignerEmail;