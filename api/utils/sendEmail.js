const nodemailer = require("nodemailer");


const sendEmail = async options => {
    const transporter = nodemailer.createTransport({
        host: sandbox.smtp.mailtrap.io,
        port: 2525,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD
        }
      });

    const message = {
        from:`${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject:options.subject,
        text:options.message
    }

    await transporter.sendMail(message)

}

exports.sendEmail = sendEmail;
