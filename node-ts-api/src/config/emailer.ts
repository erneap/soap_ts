import nodemailer from 'nodemailer';

export const sendMail = async(from: string, to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_HOST,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    html: html
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}