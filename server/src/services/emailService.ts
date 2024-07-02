import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'empresamedocupa@gmail.com', 
      pass: process.env.EMAIL_PASS || 'tklf utga dvkz jljx', 
    },
  });
  
  export const sendEmail = async (to: string, subject: string, text: string) => {
    const mailOptions = {
      from: {
        name: 'Empresa Medicina Ocupacional',
        address: process.env.EMAIL_USER || 'empresamedocupa@gmail.com'
      },
      to,
      subject,
      text,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };