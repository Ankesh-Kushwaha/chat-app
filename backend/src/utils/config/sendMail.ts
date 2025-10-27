import 'dotenv/config';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import logger from '../logger.js';

const apiKey = process.env.MAILER_SEND_API;
if (!apiKey) {
  throw new Error("MAILER_SEND_API is not defined");
}

export const sendMail = async (recipientMailId: string,receipientName:string) => {
  const mailerSend = new MailerSend({
    apiKey,
  });

  const sentFrom = new Sender("ankeshkush9651@gmail.com", "welcome message");

  const recipient = [new Recipient(recipientMailId)];

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Welcome to Chatty</title>
    <style>
      body { font-family: 'Segoe UI', sans-serif; background-color: #f4f6f8; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);}
      .header { background: #4f46e5; color: #fff; text-align: center; padding: 30px; font-size: 24px; font-weight: bold; }
      .content { padding: 30px; line-height: 1.6; font-size: 16px; }
      .content h1 { font-size: 22px; margin-bottom: 15px; color: #111827; }
      .content p { margin-bottom: 20px; }
      .btn { display: inline-block; background-color: #4f46e5; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; }
      .footer { text-align: center; font-size: 12px; color: #9ca3af; padding: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Welcome to Chatty! 🎉</div>
      <div class="content">
        <h1>Hello ${receipientName}!</h1>
        <p>We’re thrilled to have you join Chatty, your go-to platform for seamless messaging and collaboration.</p>
        <p>Get started now and explore features like real-time chat, group conversations, and more.</p>
        <a href="https://your-chatty-app.com/login" class="btn">Get Started</a>
      </div>
      <div class="footer">
        You received this email because you signed up for Chatty.<br>
        &copy; 2025 Chatty. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;

 const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipient)
    .setReplyTo(sentFrom)
    .setSubject("Welcome to Chatty")
    .setHtml(htmlContent)
   .setText(`Hello ${receipientName}! Welcome to Chatty. Get started by logging into your account.`);
  

  try {
    const response = await mailerSend.email.send(emailParams);
    logger.info("message sent to user:", recipientMailId);
  } catch (err) {
    logger.error("error while sending mail to :", recipientMailId);
    console.error("❌ Error sending welcome email:", err);
  }
}