import nodeMailer from "nodemailer";

export const contactUsEmail = async ({ email, subject, message }) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    service: process.env.SMTP_SERVICE,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const options = {
    from: email,
    to: process.env.ADMIN_EMAIL,
    subject,
    html: message,
  };
  await transporter.sendMail( options );
};