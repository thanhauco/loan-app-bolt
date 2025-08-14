import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure dotenv to load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Set the SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// This is a self-contained script to test email sending with Ethereal.
// To run it, use the command: node scripts/test_email.js

async function sendTestEmail() {
  console.log('Attempting to send a test email with SendGrid...');

  if (!process.env.SENDGRID_API_KEY) {
    console.error('❌ SENDGRID_API_KEY is not set in the .env file.');
    return;
  }
  if (!process.env.SENDER_EMAIL || !process.env.RECIPIENT_EMAIL) {
    console.error('❌ SENDER_EMAIL or RECIPIENT_EMAIL are not set in the .env file.');
    return;
  }

  const msg = {
    to: process.env.RECIPIENT_EMAIL,
    from: process.env.SENDER_EMAIL, // This must be a verified sender in your SendGrid account
    subject: 'SendGrid Test Email',
    text: 'This is a test email sent from the test script.',
    html: '<strong>This is a test email sent from the test script.</strong>',
  };

  try {
    console.log('Sending email...');
    await sgMail.send(msg);
    console.log('---');
    console.log('✅ Email sent successfully via SendGrid!');
    console.log(`To: ${msg.to}`);
    console.log(`From: ${msg.from}`);
    console.log(`Subject: ${msg.subject}`);
    console.log('---');
  } catch (error) {
    console.error('---');
    console.error('❌ Failed to send test email:');
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
    console.error('---');
  }
}

// Run the test
sendTestEmail();
