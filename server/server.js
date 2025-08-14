import dotenv from 'dotenv';
import express from 'express';
import sgMail from '@sendgrid/mail';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hardcoded SendGrid configuration for demo purposes
sgMail.setApiKey('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');
const SENDER_EMAIL = 'thanhv@wmiworldwide.com';

const app = express();
const port = 3001;

// Configure allowed origins from environment variable or default to localhost
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173'];

console.log('Allowed CORS origins:', allowedOrigins);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

app.post('/api/submit-application', async (req, res) => {
  const { documents } = req.body;

  if (!documents || !Array.isArray(documents) || documents.length === 0) {
    return res.status(400).json({ message: 'No documents provided.' });
  }

  try {

    const documentListHtml = documents
      .map(
        (doc) => `
      <li>
        <strong>${doc.name}</strong> (Category: ${doc.category})
        <ul>
          <li>Status: ${doc.status}</li>
          <li>Size: ${(doc.size / 1024).toFixed(2)} KB</li>
          ${doc.issues ? `<li>Issues: ${doc.issues.join(', ')}</li>` : ''}
        </ul>
      </li>`
      )
      .join('');

    const totalDocs = documents.length;
    const validDocs = documents.filter(doc => doc.status === 'valid').length;
    const pendingDocs = documents.filter(doc => doc.status === 'pending').length;
    const invalidDocs = documents.filter(doc => doc.status === 'invalid').length;

    const emailBody = `
      <h1>SBA Loan Application Submission</h1>
      <p>Thank you for submitting your loan application documents.</p>
      <p>Here is a summary of your submission:</p>
      <ul>
        <li><strong>Total Documents Uploaded:</strong> ${totalDocs}</li>
        <li><strong>Valid Documents:</strong> ${validDocs}</li>
        <li><strong>Pending Review:</strong> ${pendingDocs}</li>
        <li><strong>Documents with Issues:</strong> ${invalidDocs}</li>
      </ul>
      <h2>Document Details:</h2>
      <ul>
        ${documentListHtml}
      </ul>
      <p>Your application will be reviewed by our team shortly.</p>
      <p>Sincerely,</p>
      <p>The SBA Loan Team</p>
    `;

    const msg = {
      to: 'thanhv@wmiworldwide.com', // Hardcoded recipient email for demo
      from: SENDER_EMAIL, // Using the hardcoded sender email
      subject: 'New Loan Application Submission',
      html: emailBody,
    };

    await sgMail.send(msg);

    console.log('Email sent successfully via SendGrid');

    res.status(200).json({ 
        message: 'Application submitted successfully!'
    });
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    res.status(500).json({ message: 'Failed to send submission email.' });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});

