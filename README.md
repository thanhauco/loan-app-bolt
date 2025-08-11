# SBA Loan Vetting Application

A comprehensive web application for Small Business Administration (SBA) loan application processing, featuring AI-powered document validation, compliance checking, and an intelligent chatbot assistant.

## Features

### 🤖 AI-Powered Chatbot Assistant
- Interactive SBA loan guidance and support
- Real-time document upload summaries
- Compliance requirement explanations
- Automated responses to common loan questions
- Context-aware suggestions and next steps

### 📄 Document Management System
- Drag-and-drop file upload interface
- Multi-category document organization (Business, Financial, Personal, Loan)
- Real-time document validation and status tracking
- Comprehensive document requirements checklist
- Support for multiple file formats (PDF, DOC, DOCX, XLS, XLSX, JPG, PNG)

### ✅ Compliance Checker
• Automated SBA SOP 50 10 8 compliance verification
- Real-time compliance status monitoring
- Detailed requirement breakdowns by category
- Action item tracking for non-compliant areas
- Industry-standard regulatory compliance

### 📊 Application Overview Dashboard
- Real-time application progress tracking
- Key metrics and statistics visualization
- Timeline management with milestone tracking
- Recent activity monitoring
- Automated alerts for required actions

### 🔐 Secure Authentication
- Gmail OAuth integration
- Guest access option
- Secure session management
- User profile management

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Development**: Hot Module Replacement (HMR)

## Project Structure

```
src/
├── components/
│   ├── SignIn.tsx              # Authentication component
│   ├── ChatBot.tsx             # AI chatbot interface
│   ├── DocumentUpload.tsx      # File upload and management
│   ├── ComplianceChecker.tsx   # SBA compliance validation
│   └── ApplicationOverview.tsx # Dashboard and metrics
├── App.tsx                     # Main application component
├── main.tsx                    # Application entry point
└── index.css                   # Global styles
```

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sba-loan-vetting-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code quality checks

## Application Workflow

### 1. Authentication
- Users can sign in with Gmail or continue as a guest
- Secure authentication with user profile management

### 2. Document Upload
- Upload documents across four categories:
  - **Business Documents**: Licenses, incorporation papers, agreements
  - **Financial Statements**: Tax returns, P&L, balance sheets, cash flow
  - **Personal Information**: Personal tax returns, financial statements, resumes
  - **Loan Documentation**: Business plans, use of funds, debt schedules

### 3. Document Validation
- Automated document processing and validation
- Real-time status updates (Valid, Failed, Pending)
- Detailed error reporting for failed validations
- Requirements checklist tracking

### 4. Compliance Checking
- Comprehensive SBA SOP 50 10 7.1 compliance verification
- Eight key compliance areas:
  - SBA Size Standards Compliance
  - Business Registration & Licensing
  - Financial Statement Requirements
  - Personal Guaranty Compliance
  - Eligible Use of Loan Proceeds
  - Credit Analysis Standards
  - Collateral & Security Requirements
  - Environmental Review Compliance

### 5. AI Assistant
- Context-aware chatbot providing SBA loan guidance
- Automatic document upload summaries
- Compliance requirement explanations
- Processing timeline information
- Eligibility criteria assistance

## SBA Compliance Features

The application ensures compliance with SBA Standard Operating Procedures (SOP 50 10 7.1):

- **Eligibility Verification**: Automated size standards checking
- **Document Requirements**: Comprehensive validation against SBA requirements
- **Financial Analysis**: Multi-year financial statement verification
- **Legal Compliance**: Business registration and licensing validation
- **Security Requirements**: Collateral and guaranty compliance
- **Environmental Review**: Required assessments for applicable businesses

## Key Metrics Tracked

- Application progress percentage
- Document upload completion rates
- Compliance check pass/fail ratios
- Processing timeline estimates
- Required action items

## User Experience Features

- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Updates**: Live status updates across all components
- **Interactive Dashboard**: Comprehensive application overview
- **Progress Tracking**: Visual progress indicators and timelines
- **Error Handling**: Clear error messages and resolution guidance

## Security & Privacy

- Secure file upload and storage
- User authentication and session management
- Compliance with SBA privacy requirements
- Bank-level security standards
- Data encryption and protection

## Development Notes

- Built with modern React patterns and TypeScript for type safety
- Modular component architecture for maintainability
- Responsive design with Tailwind CSS
- Comprehensive error handling and user feedback
- Optimized for performance with Vite build system

## Future Enhancements

- Integration with SBA APIs
- Advanced document OCR and data extraction
- Multi-language support
- Enhanced reporting and analytics
- Mobile application development
- Integration with banking systems

## Support

For technical support or questions about SBA loan requirements, use the built-in AI chatbot assistant or refer to the official SBA documentation.

---

*This application is designed to streamline the SBA loan application process while ensuring full compliance with current SBA regulations and requirements.*