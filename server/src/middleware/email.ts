import nodemailer from 'nodemailer';

const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.RESET_EMAIL,
        pass: process.env.RESET_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to, 
      subject, 
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw error;
  }
};

export default sendEmail;