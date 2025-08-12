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

The application ensures compliance with SBA Standard Operating Procedures (SOP 50 10 8):

- **Eligibility Verification**: Automated size standards checking
- **Document Requirements**: Comprehensive validation against SBA requirements
- **Financial Analysis**: Multi-year financial statement verification
- **Legal Compliance**: Business registration and licensing validation
- **Security Requirements**: Collateral and guaranty compliance
- **Environmental Review**: Required assessments for applicable businesses

## Document Validation Logic (SBA SOP 50 10 8 Compliant)

### Confidence Calculation Framework

All document validation follows SBA SOP 50 10 8 requirements with binary pass/fail criteria rather than arbitrary scoring:

#### Business License Validation
- **SBA Requirement**: Current, valid business license per SOP 50 10 8 Chapter 3
- **Validation Logic**:
  - REQUIRED: License number, business name, expiration date, issuing authority
  - CRITICAL: Must not be expired (automatic fail if expired)
  - PASS THRESHOLD: All required fields present + current status
  - CONFIDENCE: Based on field completeness and date validity

#### Tax Returns Validation (SOP 50 10 8 Chapter 4)
- **SBA Requirement**: 3 complete years, signed and dated
- **Validation Logic**:
  - REQUIRED: Form identification (1040, 1120, 1120S, 1065), signature, date
  - CRITICAL: Must be signed (automatic fail if unsigned)
  - CRITICAL: Must be within 3-year requirement
  - PASS THRESHOLD: Signed + complete + within timeframe
  - CONFIDENCE: Based on completeness and signature verification

#### Financial Statements Validation (SOP 50 10 8 Chapter 4)
- **SBA Requirement**: Current financial statements with key metrics
- **Validation Logic**:
  - REQUIRED: Balance sheet data, P&L data, statement date
  - PREFERRED: CPA preparation (bonus points, not required)
  - CRITICAL: Must be current (within 12 months for interim statements)
  - PASS THRESHOLD: Key financial data present + current date
  - CONFIDENCE: Based on data completeness and recency

#### Personal Financial Statement (SBA Form 413)
- **SBA Requirement**: Current (90 days), signed, complete per SOP 50 10 8 Chapter 5
- **Validation Logic**:
  - REQUIRED: Assets, liabilities, net worth, signature, date
  - CRITICAL: Must be within 90 days (automatic fail if older)
  - CRITICAL: Must be signed (automatic fail if unsigned)
  - PASS THRESHOLD: Complete + signed + current
  - CONFIDENCE: Based on completeness and currency

#### Business Plan Validation (SOP 50 10 8 Chapter 6)
- **SBA Requirement**: Comprehensive plan demonstrating repayment ability
- **Validation Logic**:
  - REQUIRED SECTIONS (per SOP 50 10 8):
    - Executive Summary
    - Business Description
    - Management Team/Experience
    - Financial Projections (3-year minimum)
    - Use of Funds Statement
    - Repayment Analysis
  - CRITICAL: Financial projections are MANDATORY, not optional
  - CRITICAL: Must demonstrate repayment ability
  - PASS THRESHOLD: ≥4 of 6 required sections + financial projections + repayment analysis
  - CONFIDENCE: Based on section completeness and regulatory compliance

#### Use of Funds Validation (SOP 50 10 8 Chapter 6)
- **SBA Requirement**: Detailed breakdown of loan proceeds usage
- **Validation Logic**:
  - REQUIRED: Total loan amount, category breakdown, specific amounts
  - REQUIRED CATEGORIES: Working capital, equipment, real estate, debt refinancing
  - CRITICAL: Amounts must add up to total loan request
  - PASS THRESHOLD: Detailed breakdown + amounts balance
  - CONFIDENCE: Based on detail level and mathematical accuracy

#### Articles of Incorporation Validation
- **SBA Requirement**: Proper business formation documentation
- **Validation Logic**:
  - REQUIRED: Business name, state filing, registered agent, filing date
  - REQUIRED: State certification or filing stamp
  - PASS THRESHOLD: Complete state filing information
  - CONFIDENCE: Based on official documentation completeness

### Overall Validation Thresholds

- **VALID**: Document meets ALL SBA SOP 50 10 8 requirements + confidence ≥70%
- **INVALID**: Missing critical requirements OR confidence <70% OR has compliance issues
- **PENDING**: Document processing in progress

### SBA SOP 50 10 8 Compliance Notes

1. **No Exceptions**: SBA regulations are federal requirements - no "good enough" standards
2. **Binary Requirements**: Documents either meet SBA standards or they don't
3. **Critical vs. Preferred**: Some items are required (signature, dates), others are preferred (CPA preparation)
4. **Timeframe Sensitivity**: Many documents have specific currency requirements (90 days, 12 months, 3 years)
5. **Completeness Standard**: Partial documents don't meet SBA standards

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