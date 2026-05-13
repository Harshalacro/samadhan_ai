import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter
// For a hackathon, we can use Ethereal (fake SMTP) or user can provide Gmail creds
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: process.env.EMAIL_PORT || 587,
  auth: {
    user: process.env.EMAIL_USER || 'placeholder@ethereal.email',
    pass: process.env.EMAIL_PASS || 'placeholder_pass',
  },
});

export const sendEmail = async (to, subject, text, html) => {
  try {
    let transporter;

    if (process.env.EMAIL_HOST === 'smtp.gmail.com') {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    } else {
        let testAccount = { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS };
        if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS.includes('YOUR_GMAIL')) {
            testAccount = await nodemailer.createTestAccount();
            console.log("Using Ethereal Test Account for Email (No password needed)");
        }

        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
            port: process.env.EMAIL_PORT || 587,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }

    const info = await transporter.sendMail({
      from: `"SAMADHAN AI Service" <${process.env.EMAIL_USER || 'notifications@samadhan.ai'}>`,
      to,
      subject,
      text,
      html,
    });
    
    console.log("✅ Email sent successfully to:", to);
    console.log("🔗 PREVIEW URL (Click to see the email):", nodemailer.getTestMessageUrl(info));
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
};
