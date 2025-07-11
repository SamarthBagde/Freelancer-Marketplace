import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  console.log(process.env.EMAIL_USERNAME, process.env.EMAIL_PASSWORD);

  //1. create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //2. define the email options
  const mailOptions = {
    from: "Freelancer-Marketpalce admin",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //3. send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
