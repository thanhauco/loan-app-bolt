import fs from 'fs';
import path from 'path';

// Create directory structure
const createDirectories = () => {
  const baseDirs = ['AllValid', 'Invalid'];
  const subDirs = ['business', 'financial', 'personal', 'loan'];
  
  baseDirs.forEach(baseDir => {
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir);
    }
    subDirs.forEach(subDir => {
      const fullPath = path.join(baseDir, subDir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    });
  });
};

// Generate valid documents
const generateValidDocuments = () => {
  // Business documents - VALID
  const validBusinessLicense = `BUSINESS LICENSE
License Number: BL-2024-12345
Business Name: Tech Solutions LLC
License Type: General Business License
Issue Date: January 15, 2024
Expiration Date: January 15, 2026
Issuing Authority: City of San Francisco Business Registration
Status: ACTIVE
Authorized Signature: John Smith, City Clerk
Date Signed: January 15, 2024`;

  const validArticlesOfIncorporation = `ARTICLES OF INCORPORATION
State of California
Secretary of State Filing

Business Name: Tech Solutions LLC
Entity Type: Limited Liability Company
Filing Date: December 1, 2023
State Filing Number: 202312010001
Registered Agent: John Smith
Registered Address: 123 Main St, San Francisco, CA 94102
Principal Address: 123 Main St, San Francisco, CA 94102
Purpose: General business purposes
Members: John Smith (Managing Member)

STATE CERTIFICATION STAMP
Filed with Secretary of State
December 1, 2023
Certificate Number: LLC-2023-001`;

  // Financial documents - VALID
  const validTaxReturns = `U.S. CORPORATION INCOME TAX RETURN
Form 1120 - 2023
Tech Solutions LLC
EIN: 12-3456789

INCOME:
Total Income: $500,000
Cost of Goods Sold: $200,000
Gross Profit: $300,000

DEDUCTIONS:
Salaries and Wages: $150,000
Rent: $36,000
Other Deductions: $50,000
Total Deductions: $236,000

TAXABLE INCOME: $64,000
Tax Liability: $13,440

SIGNATURE SECTION:
Prepared by: John Smith, President
Date: March 15, 2024
Signature: [SIGNED] John Smith
Title: President

CPA CERTIFICATION:
Prepared by: Smith & Associates CPA
CPA License: CA-12345
Date: March 15, 2024`;

  const validFinancialStatements = `FINANCIAL STATEMENTS
Tech Solutions LLC
For Year Ended December 31, 2023

BALANCE SHEET
ASSETS:
Current Assets:
  Cash: $75,000
  Accounts Receivable: $125,000
  Inventory: $50,000
  Total Current Assets: $250,000

Fixed Assets:
  Equipment: $100,000
  Less Depreciation: ($20,000)
  Net Fixed Assets: $80,000

TOTAL ASSETS: $330,000

LIABILITIES:
Current Liabilities:
  Accounts Payable: $45,000
  Accrued Expenses: $15,000
  Total Current Liabilities: $60,000

Long-term Debt: $120,000
TOTAL LIABILITIES: $180,000

EQUITY:
Owner's Equity: $150,000
TOTAL LIABILITIES & EQUITY: $330,000

INCOME STATEMENT
Revenue: $500,000
Cost of Sales: $200,000
Gross Profit: $300,000
Operating Expenses: $236,000
Net Income: $64,000

Prepared by: Smith & Associates CPA
CPA License: CA-12345
Date: February 28, 2024`;

  // Personal documents - VALID
  const validPersonalFinancialStatement = `SBA FORM 413 - PERSONAL FINANCIAL STATEMENT
Date: January 10, 2025

PERSONAL INFORMATION:
Name: John Smith
Address: 123 Main St, San Francisco, CA 94102
Phone: (555) 123-4567
Date of Birth: 01/15/1980

ASSETS:
Cash on Hand: $25,000
Savings Account: $150,000
Checking Account: $35,000
Real Estate (Primary Residence): $800,000
Automobiles: $45,000
Securities: $200,000
Other Assets: $50,000
TOTAL ASSETS: $1,305,000

LIABILITIES:
Mortgage (Primary Residence): $450,000
Auto Loans: $25,000
Credit Cards: $8,000
Other Debts: $12,000
TOTAL LIABILITIES: $495,000

NET WORTH: $810,000

SIGNATURE:
I certify that the information provided is true and complete.
Signature: [SIGNED] John Smith
Date: January 10, 2025`;

  const validPersonalTaxReturns = `U.S. INDIVIDUAL INCOME TAX RETURN
Form 1040 - 2023
John Smith
SSN: XXX-XX-1234

INCOME:
Wages: $180,000
Business Income: $64,000
Interest: $3,500
Dividends: $8,200
Total Income: $255,700

DEDUCTIONS:
Standard Deduction: $13,850
Total Deductions: $13,850

TAXABLE INCOME: $241,850
Tax: $52,832
Federal Tax Withheld: $55,000
REFUND DUE: $2,168

SIGNATURE:
Taxpayer Signature: [SIGNED] John Smith
Date: April 10, 2024
Spouse Signature: [SIGNED] Jane Smith
Date: April 10, 2024`;

  // Loan documents - VALID
  const validBusinessPlan = `COMPREHENSIVE BUSINESS PLAN
Tech Solutions LLC

EXECUTIVE SUMMARY:
Tech Solutions LLC is a technology consulting firm specializing in small business digital transformation. Founded in 2023, we provide comprehensive IT solutions including cloud migration, cybersecurity, and digital marketing services.

BUSINESS DESCRIPTION:
Our company serves small to medium businesses in the San Francisco Bay Area, helping them modernize their technology infrastructure and improve operational efficiency through strategic technology implementations.

MANAGEMENT TEAM:
John Smith - CEO/Founder
- MBA from Stanford University
- 15 years experience in technology consulting
- Former Senior Manager at Deloitte Consulting
- Certified Project Management Professional (PMP)

Jane Smith - COO
- BS Computer Science from UC Berkeley
- 12 years experience in operations management
- Former Operations Director at TechStart Inc.

FINANCIAL PROJECTIONS (3-Year):

YEAR 1 (2024):
Revenue: $750,000
Expenses: $600,000
Net Income: $150,000
Cash Flow: $175,000

YEAR 2 (2025):
Revenue: $1,200,000
Expenses: $900,000
Net Income: $300,000
Cash Flow: $350,000

YEAR 3 (2026):
Revenue: $1,800,000
Expenses: $1,300,000
Net Income: $500,000
Cash Flow: $575,000

USE OF FUNDS:
Total Loan Request: $250,000
- Working Capital: $100,000 (40%)
- Equipment Purchase: $75,000 (30%)
- Marketing & Sales: $50,000 (20%)
- Office Expansion: $25,000 (10%)

REPAYMENT ANALYSIS:
Monthly Loan Payment: $4,167 (assuming 7% interest, 5-year term)
Projected Monthly Cash Flow Year 1: $14,583
Debt Service Coverage Ratio: 3.5x
Strong repayment capacity demonstrated through conservative projections.

MARKET ANALYSIS:
Target market size: $2.5B (SMB technology services in Bay Area)
Growth rate: 12% annually
Competitive advantages: Local expertise, personalized service, proven track record`;

  const validUseOfFunds = `USE OF FUNDS STATEMENT
Tech Solutions LLC
Loan Amount Requested: $250,000

DETAILED BREAKDOWN:

1. WORKING CAPITAL: $100,000 (40%)
   - Accounts Receivable Financing: $60,000
   - Inventory/Supplies: $25,000
   - Operating Cash Reserve: $15,000

2. EQUIPMENT PURCHASE: $75,000 (30%)
   - Server Infrastructure: $35,000
   - Workstations (5 units): $25,000
   - Software Licenses: $15,000

3. MARKETING & SALES: $50,000 (20%)
   - Digital Marketing Campaign: $30,000
   - Trade Show Participation: $10,000
   - Sales Materials & Collateral: $10,000

4. OFFICE EXPANSION: $25,000 (10%)
   - Lease Deposits: $15,000
   - Office Furniture: $10,000

TOTAL: $250,000

JUSTIFICATION:
This funding will enable Tech Solutions LLC to expand operations, serve more clients, and increase revenue capacity. The working capital component ensures smooth operations during growth phase, while equipment purchases directly support service delivery capabilities.

TIMELINE:
Funds will be deployed over 6 months:
- Month 1: Equipment purchases ($75,000)
- Month 2: Office expansion ($25,000)
- Months 3-6: Working capital and marketing ($150,000)

Expected ROI: 24% annually based on projected revenue growth and operational efficiency improvements.`;

  // Write valid documents
  fs.writeFileSync('AllValid/business/business_license.txt', validBusinessLicense);
  fs.writeFileSync('AllValid/business/articles_of_incorporation.txt', validArticlesOfIncorporation);
  fs.writeFileSync('AllValid/financial/tax_returns_2023.txt', validTaxReturns);
  fs.writeFileSync('AllValid/financial/financial_statements.txt', validFinancialStatements);
  fs.writeFileSync('AllValid/personal/personal_financial_statement.txt', validPersonalFinancialStatement);
  fs.writeFileSync('AllValid/personal/personal_tax_returns.txt', validPersonalTaxReturns);
  fs.writeFileSync('AllValid/loan/comprehensive_business_plan.txt', validBusinessPlan);
  fs.writeFileSync('AllValid/loan/use_of_funds.txt', validUseOfFunds);
};

// Generate invalid documents
const generateInvalidDocuments = () => {
  // Business documents - INVALID
  const invalidBusinessLicense = `BUSINESS LICENSE
License Number: BL-2020-98765
Business Name: Old Tech LLC
License Type: General Business License
Issue Date: January 15, 2020
Expiration Date: January 15, 2022  // EXPIRED!
Issuing Authority: City of San Francisco Business Registration
Status: EXPIRED
// MISSING SIGNATURE - INVALID`;

  const invalidArticlesOfIncorporation = `ARTICLES OF INCORPORATION
State of California

Business Name: Incomplete Corp
Entity Type: Corporation
Filing Date: [MISSING]
State Filing Number: [MISSING]
Registered Agent: [MISSING]
// INCOMPLETE - MISSING CRITICAL INFORMATION
// NO STATE CERTIFICATION STAMP`;

  // Financial documents - INVALID
  const invalidTaxReturns = `U.S. CORPORATION INCOME TAX RETURN
Form 1120 - 2023
Incomplete Corp
EIN: 12-3456789

INCOME:
Total Income: $300,000
// INCOMPLETE FINANCIAL DATA

SIGNATURE SECTION:
Prepared by: [UNSIGNED]
Date: [MISSING]
// MISSING SIGNATURE - INVALID PER SBA REQUIREMENTS`;

  const invalidFinancialStatements = `FINANCIAL STATEMENTS
Old Business LLC
For Year Ended December 31, 2021  // TOO OLD - OVER 12 MONTHS

BALANCE SHEET
ASSETS:
Current Assets: [INCOMPLETE]
// MISSING DETAILED BREAKDOWN

LIABILITIES:
[INCOMPLETE DATA]

// NO CPA PREPARATION
// OUTDATED - INVALID PER SBA CURRENCY REQUIREMENTS`;

  // Personal documents - INVALID
  const invalidPersonalFinancialStatement = `SBA FORM 413 - PERSONAL FINANCIAL STATEMENT
Date: June 15, 2024  // OVER 90 DAYS OLD - INVALID

PERSONAL INFORMATION:
Name: John Doe
Address: [INCOMPLETE]

ASSETS:
Cash: $10,000
// INCOMPLETE ASSET LISTING

LIABILITIES:
// MISSING LIABILITY INFORMATION

// MISSING SIGNATURE - INVALID
// TOO OLD - EXCEEDS 90-DAY REQUIREMENT`;

  const invalidPersonalTaxReturns = `U.S. INDIVIDUAL INCOME TAX RETURN
Form 1040 - 2023
John Doe

INCOME:
Wages: $50,000
// INCOMPLETE INCOME INFORMATION

// MISSING SIGNATURE SECTION - INVALID
// INCOMPLETE TAX RETURN`;

  // Loan documents - INVALID
  const invalidBusinessPlan = `BASIC BUSINESS PLAN
Simple Business LLC

EXECUTIVE SUMMARY:
We want to start a business.

BUSINESS DESCRIPTION:
General business activities.

// MISSING CRITICAL SECTIONS:
// - No Management Team Information
// - No Financial Projections (CRITICAL SBA REQUIREMENT)
// - No Use of Funds Statement
// - No Repayment Analysis
// - Insufficient Detail for SBA Requirements`;

  const invalidUseOfFunds = `USE OF FUNDS
Loan Amount: $100,000

General business purposes: $100,000

// VAGUE AND INSUFFICIENT DETAIL
// MISSING SPECIFIC BREAKDOWN
// NO PERCENTAGES OR CATEGORIES
// DOES NOT MEET SBA REQUIREMENTS FOR DETAILED USE OF FUNDS`;

  // Write invalid documents
  fs.writeFileSync('Invalid/business/expired_business_license.txt', invalidBusinessLicense);
  fs.writeFileSync('Invalid/business/incomplete_articles.txt', invalidArticlesOfIncorporation);
  fs.writeFileSync('Invalid/financial/unsigned_tax_returns.txt', invalidTaxReturns);
  fs.writeFileSync('Invalid/financial/outdated_financial_statements.txt', invalidFinancialStatements);
  fs.writeFileSync('Invalid/personal/old_personal_financial_statement.txt', invalidPersonalFinancialStatement);
  fs.writeFileSync('Invalid/personal/incomplete_personal_returns.txt', invalidPersonalTaxReturns);
  fs.writeFileSync('Invalid/loan/basic_business_plan.txt', invalidBusinessPlan);
  fs.writeFileSync('Invalid/loan/vague_use_of_funds.txt', invalidUseOfFunds);
};

// Main execution
console.log('Creating directory structure...');
createDirectories();

console.log('Generating valid documents...');
generateValidDocuments();

console.log('Generating invalid documents...');
generateInvalidDocuments();

console.log('✅ Dataset generation complete!');
console.log('📁 AllValid/ - Contains 8 SBA-compliant documents');
console.log('📁 Invalid/ - Contains 8 non-compliant documents');
console.log('🎯 Ready for validation testing!');