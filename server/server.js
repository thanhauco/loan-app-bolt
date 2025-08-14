import dotenv from 'dotenv';
import express from 'express';
import sgMail from '@sendgrid/mail';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure SendGrid
const SENDGRID_API_KEY = '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';
const SENDER_EMAIL = 'thanhv@wmiworldwide.com';

// Set SendGrid API key
sgMail.setApiKey(SENDGRID_API_KEY);

console.log('SendGrid email sender configured');
console.log('Sender Email:', SENDER_EMAIL);
console.log('Using API Key:', '***' + SENDGRID_API_KEY.slice(-4));

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

  console.log('Received document submission request with', documents.length, 'documents');
  
  try {
    // Validate documents
    if (!Array.isArray(documents)) {
      throw new Error('Invalid documents format');
    }

    const documentListHtml = documents
      .map(
        (doc) => `
      <li>
        <strong>${doc.name || 'Unnamed Document'}</strong> (Category: ${doc.category || 'Uncategorized'})
        <ul>
          <li>Status: ${doc.status || 'unknown'}</li>
          <li>Size: ${doc.size ? (doc.size / 1024).toFixed(2) + ' KB' : 'N/A'}</li>
          ${doc.issues && doc.issues.length ? `<li>Issues: ${doc.issues.join(', ')}</li>` : ''}
          ${doc.confidence ? `<li>Confidence: ${Math.round(doc.confidence)}%</li>` : ''}
        </ul>
      </li>`
      )
      .join('');

    const totalDocs = documents.length;
    const validDocs = documents.filter(doc => doc.status === 'valid').length;
    const pendingDocs = documents.filter(doc => doc.status === 'pending').length;
    const invalidDocs = documents.filter(doc => doc.status === 'invalid').length;

    console.log(`Document summary: ${validDocs} valid, ${pendingDocs} pending, ${invalidDocs} invalid`);

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
      from: SENDER_EMAIL,
      subject: 'New Loan Application Submission',
      html: emailBody,
      // Add text version for email clients that don't support HTML
      text: `New Loan Application Submission\n\n` +
            `Total Documents: ${totalDocs}\n` +
            `Valid: ${validDocs}, Pending: ${pendingDocs}, Invalid: ${invalidDocs}\n\n` +
            documents.map(doc => 
              `- ${doc.name || 'Unnamed Document'}: ${doc.status || 'unknown'}` + 
              (doc.issues && doc.issues.length ? ` (${doc.issues.join(', ')})` : '')
            ).join('\n')
    };

    console.log('Sending email via SendGrid...');
    const sendResult = await sgMail.send(msg);
    console.log('Email sent successfully via SendGrid');
    console.log('Message ID:', sendResult[0]?.headers?.['x-message-id'] || 'Unknown');

    res.status(200).json({ 
        message: 'Application submitted successfully!'
    });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    
    let errorMessage = 'Failed to send submission email.';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response body:', error.response.body);
      errorMessage += ` (Status: ${error.response.status})`;
      
      if (error.response.body && typeof error.response.body === 'string') {
        try {
          const errorDetails = JSON.parse(error.response.body);
          if (errorDetails.errors && errorDetails.errors[0]) {
            errorMessage += ` - ${errorDetails.errors[0].message}`;
          }
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from SendGrid');
      errorMessage += ' - No response from email service.';
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up email request:', error.message);
      errorMessage += ` - ${error.message}`;
    }
    
    res.status(500).json({ 
      message: errorMessage,
      error: error.toString()
    });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});

