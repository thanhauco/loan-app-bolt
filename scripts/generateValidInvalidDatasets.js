const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

// Create directories if they don't exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Clean up existing directories
function cleanupDirectories() {
  const dirs = ['AllValid', 'Invalid'];
  dirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
}

// Generate a PDF with the given content
function generatePDF(content, filename, folderPath) {
  const doc = new jsPDF();
  
  // Set font size and add content
  doc.setFontSize(10);
  
  // Split content into lines and add to PDF
  const lines = content.split('\n');
  let yPosition = 20;
  
  lines.forEach((line, index) => {
    if (yPosition > 280) { // Start new page if needed
      doc.addPage();
      yPosition = 20;
    }
    
    // Handle long lines by splitting them
    const maxWidth = 180;
    const splitLines = doc.splitTextToSize(line, maxWidth);
    
    splitLines.forEach(splitLine => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(splitLine, 10, yPosition);
      yPosition += 6;
    });
  });
  
  // Save the PDF
  const filePath = path.join(folderPath, filename);
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(filePath, pdfBuffer);
  console.log(`Generated: ${filePath}`);
}

// VALID DOCUMENTS - All meet SBA SOP 50 10 8 requirements
const validDocuments = {
  business: [
    {
      filename: 'business_license_valid.pdf',
      content: `STATE OF CALIFORNIA
DEPARTMENT OF CONSUMER AFFAIRS
BUSINESS LICENSE

License Number: BL-2024-789456
Business Name: Thanh's Business Solutions LLC
Business Address: 123 Main Street, San Francisco, CA 94102
License Type: General Business License

Issue Date: ${new Date('2024-01-15').toLocaleDateString()}
Expiration Date: ${new Date('2025-12-31').toLocaleDateString()}

This license authorizes the above named business to operate within the jurisdiction
of the State of California, subject to all applicable laws and regulations.

Authorized by: California Department of Consumer Affairs
License Status: ACTIVE

This license is valid and in good standing.

OFFICIAL SEAL: State of California Department of Consumer Affairs

Registered Agent: Thanh Nguyen
Agent Address: 123 Main Street, San Francisco, CA 94102

This document serves as proof of business registration and authorization
to conduct business operations in the State of California.`
    },
    {
      filename: 'articles_of_incorporation_complete.pdf',
      content: `STATE OF CALIFORNIA
SECRETARY OF STATE

ARTICLES OF ORGANIZATION
LIMITED LIABILITY COMPANY

Article 1: NAME
The name of the Limited Liability Company is:
THANH'S BUSINESS SOLUTIONS LLC

Article 2: PURPOSE
The purpose of this Limited Liability Company is to engage in any lawful act or activity 
for which a Limited Liability Company may be organized under the California Corporations Code.

Article 3: AGENT FOR SERVICE OF PROCESS
The name and address of the initial agent for service of process is:
Thanh Nguyen
123 Main Street
San Francisco, CA 94102

Article 4: MANAGEMENT
This Limited Liability Company will be managed by its members.

Article 5: MEMBERS
The name and address of each person who is to be a member is:
Thanh Nguyen, 123 Main Street, San Francisco, CA 94102

Article 6: EFFECTIVE DATE
These Articles of Organization shall be effective upon filing with the Secretary of State.

SIGNATURE
I hereby declare that I am the person who executed this instrument, which execution is my act and deed.

Signature: Thanh Nguyen
Date: March 15, 2021

STATE OF CALIFORNIA FILING INFORMATION:
Filing Date: March 20, 2021
File Number: 202108954321
Status: Active - Good Standing

Registered Agent: Thanh Nguyen
Registered Address: 123 Main Street, San Francisco, CA 94102

This document has been filed with the California Secretary of State and is a matter of public record.

OFFICIAL STATE SEAL: California Secretary of State`
    }
  ],
  
  financial: [
    {
      filename: 'business_tax_return_2023_signed_complete.pdf',
      content: `U.S. CORPORATION INCOME TAX RETURN
FORM 1120S
Tax Year 2023

Corporation Name: Thanh's Business Solutions LLC
Employer Identification Number: 12-3456789
Business Address: 123 Main Street, San Francisco, CA 94102

INCOME
Total receipts or sales: $850,000
Cost of goods sold: $285,000
Gross profit: $565,000
Other income: $15,000
Total Income: $580,000

DEDUCTIONS
Compensation of officers: $125,000
Salaries and wages: $185,000
Rent: $36,000
Interest: $8,500
Depreciation: $25,000
Other deductions: $45,000
Total Deductions: $424,500

TAXABLE INCOME: $155,500

TAX COMPUTATION
Income tax: $32,655
Total tax: $32,655

PAYMENTS AND CREDITS
Estimated tax payments: $35,000
Total payments: $35,000

REFUND DUE: $2,345

SCHEDULE K-1 INFORMATION
Shareholder: Thanh Nguyen
Share of income: $155,500
Share of deductions: $424,500

TAXPAYER SIGNATURE: Thanh Nguyen
DATE SIGNED: ${new Date('2024-04-15').toLocaleDateString()}

PREPARER SIGNATURE: Johnson & Associates CPA
PREPARER DATE: ${new Date('2024-04-10').toLocaleDateString()}

This return has been prepared in accordance with the Internal Revenue Code
and includes all required schedules and supporting documentation.

IRS PROCESSING: This return meets all IRS requirements for business tax returns.`
    },
    {
      filename: 'financial_statements_current_cpa_prepared.pdf',
      content: `THANH'S BUSINESS SOLUTIONS LLC
COMPILED FINANCIAL STATEMENTS
As of December 31, 2023

BALANCE SHEET
ASSETS
Current Assets:
  Cash and cash equivalents         $65,000
  Accounts receivable              $42,500
  Inventory                        $18,000
  Prepaid expenses                  $5,200
  Total Current Assets            $130,700

Fixed Assets:
  Equipment (net)                  $45,000
  Furniture and fixtures (net)     $12,500
  Software and licenses (net)      $15,000
  Total Fixed Assets               $72,500

TOTAL ASSETS                      $203,200

LIABILITIES AND EQUITY
Current Liabilities:
  Accounts payable                 $18,300
  Accrued expenses                  $7,800
  Current portion of long-term debt $8,000
  Total Current Liabilities        $34,100

Long-term Liabilities:
  Long-term debt                   $35,000
  Total Long-term Liabilities      $35,000

Total Liabilities                  $69,100

Owner's Equity:
  Retained earnings               $134,100
  Total Owner's Equity            $134,100

TOTAL LIABILITIES AND EQUITY      $203,200

INCOME STATEMENT
For the Year Ended December 31, 2023

Revenue:
  Service revenue                 $785,000
  Product sales                    $65,000
  Total Revenue                   $850,000

Expenses:
  Cost of goods sold              $285,000
  Salaries and wages              $185,000
  Rent                             $36,000
  Utilities                         $8,500
  Insurance                        $12,500
  Professional fees                 $6,200
  Depreciation                     $25,000
  Other operating expenses         $22,300
  Total Expenses                  $580,500

Net Income                        $269,500

CASH FLOW STATEMENT
For the Year Ended December 31, 2023

Operating Activities:
  Net income                      $269,500
  Depreciation                     $25,000
  Changes in working capital       ($15,000)
  Net cash from operations        $279,500

Investing Activities:
  Equipment purchases              ($35,000)
  Net cash from investing          ($35,000)

Financing Activities:
  Loan proceeds                     $50,000
  Loan payments                    ($25,000)
  Owner distributions              ($150,000)
  Net cash from financing          ($125,000)

Net increase in cash              $119,500

COMPILATION REPORT
We have compiled the accompanying financial statements of Thanh's Business Solutions LLC
as of December 31, 2023, and for the year then ended.

Johnson & Associates, CPA
Certified Public Accountants
Date: ${new Date().toLocaleDateString()}

These financial statements have been prepared in accordance with generally accepted
accounting principles and present fairly the financial position of the company.`
    }
  ],
  
  personal: [
    {
      filename: 'personal_financial_statement_sba_form_413_current_signed.pdf',
      content: `SBA FORM 413
PERSONAL FINANCIAL STATEMENT

Name: Thanh Nguyen
Social Security Number: XXX-XX-1234
Date of Birth: 01/15/1985
Address: 123 Main Street, San Francisco, CA 94102

ASSETS
Cash on hand and in banks           $35,000
Savings accounts                    $65,000
IRA or other retirement accounts   $125,000
Accounts and notes receivable       $18,000
Life insurance (cash surrender)     $25,000
Stocks and bonds                    $85,000
Real estate owned (market value)   $650,000
Automobile (present value)          $35,000
Other personal property             $45,000
Other assets                        $12,000

TOTAL ASSETS                     $1,095,000

LIABILITIES
Accounts payable                     $5,500
Notes payable to banks              $25,000
Notes payable to others             $12,000
Installment accounts (auto)         $28,000
Installment accounts (other)         $8,500
Loan on life insurance              $3,000
Mortgages on real estate           $385,000
Other liabilities                    $6,000

TOTAL LIABILITIES                  $473,000

NET WORTH                          $622,000

ANNUAL INCOME
Salary                            $125,000
Business income                    $85,000
Real estate income                 $18,000
Other income                        $5,000

TOTAL ANNUAL INCOME               $233,000

ANNUAL EXPENDITURES
Living expenses                    $95,000
Insurance premiums                 $12,500
Tax payments                       $48,000
Other payments                     $18,000

TOTAL ANNUAL EXPENDITURES         $173,500

CONTINGENT LIABILITIES
As endorser or co-maker            $0
Legal claims or judgments          $0
Provision for federal income tax   $15,000
Other special debt                 $0

I certify that the information provided is true and complete to the best of my knowledge.
This statement is given for the purpose of obtaining credit and I understand that it will
be retained in your files.

SIGNATURE: Thanh Nguyen
DATE: ${new Date().toLocaleDateString()}

NOTARIZATION
State of California
County of San Francisco

On this day personally appeared Thanh Nguyen, who proved to me on the basis of
satisfactory evidence to be the person whose name is subscribed to the within instrument.

Notary Public Signature: _________________
Date: ${new Date().toLocaleDateString()}
Commission Expires: ${new Date(Date.now() + 365*24*60*60*1000*2).toLocaleDateString()}`
    },
    {
      filename: 'personal_tax_return_2023_signed_complete.pdf',
      content: `U.S. INDIVIDUAL INCOME TAX RETURN
FORM 1040
Tax Year 2023

Name: Thanh Nguyen
Social Security Number: XXX-XX-1234
Filing Status: Single
Address: 123 Main Street, San Francisco, CA 94102

INCOME
Wages, salaries, tips (Form W-2): $125,000
Interest income: $2,250
Business income (Schedule C): $85,000
Capital gains: $8,500
Other income: $3,000
Total Income: $223,750

ADJUSTED GROSS INCOME: $223,750

DEDUCTIONS
Standard deduction: $13,850
Total deductions: $13,850

TAXABLE INCOME: $209,900

TAX COMPUTATION
Tax on taxable income: $47,843
Total tax: $47,843

PAYMENTS
Federal income tax withheld: $28,500
Estimated tax payments: $22,000
Total payments: $50,500

REFUND: $2,657

SCHEDULE C - BUSINESS INCOME
Business name: Thanh's Business Solutions LLC
Business income: $85,000
Business expenses: $35,000
Net profit: $50,000

TAXPAYER SIGNATURE: Thanh Nguyen
DATE SIGNED: ${new Date('2024-04-15').toLocaleDateString()}

PREPARER INFORMATION
Preparer: Johnson & Associates CPA
PTIN: P01234567
Date: ${new Date('2024-04-10').toLocaleDateString()}

This return has been prepared in accordance with the Internal Revenue Code
and includes all required schedules and supporting documentation.

SCHEDULE SE - SELF-EMPLOYMENT TAX
Net earnings from self-employment: $50,000
Self-employment tax: $7,065

All required forms and schedules are attached and complete.`
    }
  ],
  
  loan: [
    {
      filename: 'comprehensive_business_plan_complete.pdf',
      content: `COMPREHENSIVE BUSINESS PLAN
THANH'S BUSINESS SOLUTIONS LLC

EXECUTIVE SUMMARY
Thanh's Business Solutions LLC is a technology consulting firm specializing in small business 
digital transformation. Founded in 2021, we provide comprehensive IT solutions, software 
development, and digital marketing services to small and medium-sized businesses.

Our mission is to empower small businesses through technology, helping them compete effectively 
in the digital marketplace while maintaining cost-effective operations.

BUSINESS DESCRIPTION
Company Overview:
- Legal Structure: Limited Liability Company (LLC)
- Industry: Technology Consulting Services (NAICS 541511)
- Location: San Francisco, California
- Founded: 2021
- Current Employees: 8 full-time, 3 part-time
- Projected Employees (Year 3): 18 full-time, 5 part-time

Services Offered:
1. IT Consulting and Support
2. Custom Software Development
3. Digital Marketing Solutions
4. Cloud Migration Services
5. Cybersecurity Assessment and Implementation

MARKET ANALYSIS
Industry Overview:
The technology consulting industry has experienced significant growth, particularly in the 
small business segment. Market size is estimated at $450 billion globally, with 8% annual 
growth projected through 2028.

Target Market:
- Small businesses (10-100 employees): 60% of revenue
- Professional services firms: 25% of revenue
- Retail and e-commerce businesses: 10% of revenue
- Healthcare practices: 5% of revenue

Competitive Analysis:
Our main competitors include large consulting firms like Accenture and Deloitte, as well as 
local IT service providers. Our competitive advantage lies in personalized service, 
industry-specific expertise, and cost-effective solutions.

MANAGEMENT TEAM AND EXPERIENCE
Management Team:
- Thanh Nguyen, CEO/Founder: 15 years experience in technology consulting, MBA from UC Berkeley
- Sarah Johnson, CTO: 12 years software development experience, MS Computer Science Stanford
- Michael Chen, VP Sales: 10 years business development experience, proven track record

Key Personnel Qualifications:
- Combined 37 years of industry experience
- Proven track record of successful project delivery
- Strong client relationships and retention rates
- Industry certifications and continuing education

FINANCIAL PROJECTIONS (3-Year Detailed Analysis)

REVENUE PROJECTIONS:
Year 1 (2024): $1,200,000
- IT Consulting: $600,000 (50%)
- Software Development: $360,000 (30%)
- Digital Marketing: $180,000 (15%)
- Other Services: $60,000 (5%)

Year 2 (2025): $1,650,000
- IT Consulting: $825,000 (50%)
- Software Development: $495,000 (30%)
- Digital Marketing: $247,500 (15%)
- Other Services: $82,500 (5%)

Year 3 (2026): $2,200,000
- IT Consulting: $1,100,000 (50%)
- Software Development: $660,000 (30%)
- Digital Marketing: $330,000 (15%)
- Other Services: $110,000 (5%)

EXPENSE PROJECTIONS:
Year 1: $920,000
- Salaries and Benefits: $650,000 (71%)
- Office and Operations: $120,000 (13%)
- Marketing and Sales: $80,000 (9%)
- Technology and Equipment: $45,000 (5%)
- Professional Services: $25,000 (3%)

Year 2: $1,250,000
- Salaries and Benefits: $875,000 (70%)
- Office and Operations: $162,500 (13%)
- Marketing and Sales: $112,500 (9%)
- Technology and Equipment: $62,500 (5%)
- Professional Services: $37,500 (3%)

Year 3: $1,650,000
- Salaries and Benefits: $1,155,000 (70%)
- Office and Operations: $214,500 (13%)
- Marketing and Sales: $148,500 (9%)
- Technology and Equipment: $82,500 (5%)
- Professional Services: $49,500 (3%)

NET INCOME PROJECTIONS:
Year 1: $280,000 (23.3% margin)
Year 2: $400,000 (24.2% margin)
Year 3: $550,000 (25.0% margin)

CASH FLOW PROJECTIONS:
Year 1: $320,000 positive cash flow
Year 2: $445,000 positive cash flow
Year 3: $595,000 positive cash flow

USE OF LOAN PROCEEDS
Total Loan Request: $350,000

DETAILED BREAKDOWN:
1. Working Capital: $150,000 (43%)
   - Accounts receivable financing: $90,000
   - Inventory and supplies: $35,000
   - Operating cash flow buffer: $25,000

2. Equipment and Technology: $100,000 (29%)
   - Computer hardware and servers: $60,000
   - Software licenses and development tools: $25,000
   - Office equipment and furniture: $15,000

3. Marketing and Business Development: $50,000 (14%)
   - Digital marketing campaigns: $30,000
   - Trade show participation: $15,000
   - Sales materials and branding: $5,000

4. Office Expansion: $35,000 (10%)
   - Lease deposits and improvements: $25,000
   - Additional workspace setup: $10,000

5. Professional Services: $15,000 (4%)
   - Legal and accounting fees: $10,000
   - Consulting and advisory services: $5,000

TOTAL: $350,000 (100%)

REPAYMENT ABILITY ANALYSIS
Debt Service Coverage Ratio:
- Year 1: 2.8x (Net Income + Depreciation) / Annual Debt Service
- Year 2: 3.2x
- Year 3: 3.6x

Monthly Loan Payment Capacity:
- Projected monthly payment: $4,200
- Available cash flow: $26,667 (Year 1 average)
- Coverage ratio: 6.3x

Historical Performance:
- 2021 Revenue: $485,000, Net Income: $95,000
- 2022 Revenue: $720,000, Net Income: $165,000
- 2023 Revenue: $850,000, Net Income: $210,000

Growth trajectory demonstrates consistent profitability and ability to service debt.

RISK ANALYSIS AND MITIGATION
Key Risks:
1. Economic downturn affecting small business IT spending
2. Increased competition from larger firms
3. Technology changes requiring additional investment
4. Key personnel departure

Mitigation Strategies:
1. Diversified client base across multiple industries
2. Long-term contracts and recurring revenue model
3. Continuous training and technology investment
4. Competitive compensation and equity participation

COLLATERAL AND GUARANTEES
Available Collateral:
- Business equipment and technology: $125,000
- Accounts receivable: $85,000
- Personal guarantee from Thanh Nguyen (Net Worth: $622,000)

This comprehensive business plan demonstrates our commitment to growth, our ability to 
successfully utilize SBA loan funding, and our capacity to repay the loan according to terms.

The financial projections are based on conservative estimates and historical performance,
ensuring realistic expectations and sustainable growth.

Prepared by: Thanh Nguyen, CEO
Date: ${new Date().toLocaleDateString()}
Reviewed by: Johnson & Associates CPA`
    },
    {
      filename: 'use_of_funds_detailed_breakdown.pdf',
      content: `USE OF FUNDS STATEMENT
THANH'S BUSINESS SOLUTIONS LLC

Total Loan Amount Requested: $350,000

DETAILED BREAKDOWN WITH JUSTIFICATION:

1. WORKING CAPITAL: $150,000 (42.9%)
   
   A. Accounts Receivable Financing: $90,000
      - Average collection period: 45 days
      - Monthly revenue target: $100,000
      - A/R financing needs: $150,000 × 60% = $90,000
      - Supports growth without cash flow constraints
   
   B. Inventory and Supplies: $35,000
      - Software licenses for client projects: $20,000
      - Hardware inventory for installations: $10,000
      - Office supplies and materials: $5,000
   
   C. Operating Cash Flow Buffer: $25,000
      - Emergency operating fund: $15,000
      - Seasonal fluctuation buffer: $10,000

2. EQUIPMENT AND TECHNOLOGY: $100,000 (28.6%)
   
   A. Computer Hardware and Servers: $60,000
      - Development workstations (8 units): $32,000
      - Server infrastructure upgrade: $20,000
      - Network equipment and security: $8,000
   
   B. Software Licenses and Development Tools: $25,000
      - Enterprise software licenses: $15,000
      - Development and testing tools: $7,000
      - Project management software: $3,000
   
   C. Office Equipment and Furniture: $15,000
      - Ergonomic workstations: $10,000
      - Conference room equipment: $3,000
      - Storage and filing systems: $2,000

3. MARKETING AND BUSINESS DEVELOPMENT: $50,000 (14.3%)
   
   A. Digital Marketing Campaigns: $30,000
      - Search engine marketing: $15,000
      - Social media advertising: $8,000
      - Content marketing and SEO: $7,000
   
   B. Trade Show Participation: $15,000
      - Industry conference exhibits: $10,000
      - Networking events and sponsorships: $5,000
   
   C. Sales Materials and Branding: $5,000
      - Website redesign and optimization: $3,000
      - Marketing collateral and materials: $2,000

4. OFFICE EXPANSION: $35,000 (10.0%)
   
   A. Lease Deposits and Improvements: $25,000
      - Security deposit for expanded space: $15,000
      - Tenant improvements and buildout: $10,000
   
   B. Additional Workspace Setup: $10,000
      - Electrical and network installation: $6,000
      - Furniture and fixtures: $4,000

5. PROFESSIONAL SERVICES: $15,000 (4.3%)
   
   A. Legal and Accounting Fees: $10,000
      - Contract review and legal counsel: $6,000
      - Accounting and tax preparation: $4,000
   
   B. Consulting and Advisory Services: $5,000
      - Business development consulting: $3,000
      - Technology advisory services: $2,000

TOTAL ALLOCATION: $350,000 (100.0%)

EXPECTED OUTCOMES AND ROI:

Revenue Impact:
- Working capital investment: +$400,000 annual revenue capacity
- Equipment and technology: +$200,000 annual revenue capacity
- Marketing investment: +$150,000 annual revenue from new clients
- Total revenue impact: +$750,000 annually

Employment Impact:
- Direct job creation: 5 new full-time positions
- Indirect job support: 3 contractor positions
- Total compensation impact: $350,000 annually

Operational Efficiency:
- Technology upgrades: 25% improvement in project delivery time
- Expanded capacity: 40% increase in concurrent projects
- Client satisfaction: Improved service quality and response time

REPAYMENT SCHEDULE ALIGNMENT:
- Monthly loan payment: $4,200 (estimated)
- Additional monthly cash flow from investment: $62,500
- Debt service coverage ratio: 14.9x

VENDOR QUOTES AND DOCUMENTATION:
All major purchases have been quoted by vendors:
- Technology equipment: Dell Business Solutions
- Software licenses: Microsoft Enterprise Agreement
- Office furniture: Herman Miller Business Solutions
- Marketing services: Digital Marketing Partners LLC

TIMELINE FOR FUND UTILIZATION:
Month 1-2: Equipment and technology purchases
Month 2-3: Office expansion and setup
Month 3-6: Marketing campaign launch
Ongoing: Working capital deployment as needed

This detailed use of funds statement demonstrates responsible allocation of loan proceeds
to generate maximum return on investment while ensuring loan repayment capacity.

The allocation is based on actual business needs, vendor quotes, and projected returns
that support both business growth and loan repayment obligations.

Prepared by: Thanh Nguyen, CEO
Date: ${new Date().toLocaleDateString()}
Reviewed by: Johnson & Associates CPA
Approved by: Board of Directors`
    }
  ]
};

// INVALID DOCUMENTS - Fail SBA SOP 50 10 8 requirements
const invalidDocuments = {
  business: [
    {
      filename: 'business_license_expired.pdf',
      content: `STATE OF CALIFORNIA
DEPARTMENT OF CONSUMER AFFAIRS
BUSINESS LICENSE

License Number: BL-2020-123456
Business Name: Old Business LLC
Business Address: 456 Old Street, Los Angeles, CA 90210
License Type: General Business License

Issue Date: ${new Date('2020-01-15').toLocaleDateString()}
Expiration Date: ${new Date('2022-12-31').toLocaleDateString()}

This license authorizes the above named business to operate within the jurisdiction
of the State of California, subject to all applicable laws and regulations.

Authorized by: California Department of Consumer Affairs
License Status: EXPIRED

This license has expired and requires immediate renewal.

WARNING: Operating with an expired license may result in penalties and fines.`
    },
    {
      filename: 'articles_incomplete.pdf',
      content: `ARTICLES OF ORGANIZATION
LIMITED LIABILITY COMPANY

Company Name: Incomplete Business LLC
State: California

Basic information provided but missing required details and signatures.

[DOCUMENT APPEARS TO BE INCOMPLETE]`
    }
  ],
  
  financial: [
    {
      filename: 'tax_return_unsigned.pdf',
      content: `U.S. CORPORATION INCOME TAX RETURN
FORM 1120S
Tax Year 2023

Corporation Name: Unsigned Business LLC
Employer Identification Number: 98-7654321

INCOME
Total receipts or sales: $450,000
Total Income: $450,000

DEDUCTIONS
Total Deductions: $380,000

TAXABLE INCOME: $70,000

TAX COMPUTATION
Total tax: $14,700

UNSIGNED - This return has not been signed by the taxpayer
Missing required signatures and dates

This return is incomplete and does not meet IRS filing requirements.`
    },
    {
      filename: 'financial_statements_outdated.pdf',
      content: `OLD BUSINESS LLC
FINANCIAL STATEMENTS
As of December 31, 2020

BALANCE SHEET
ASSETS
Total Assets: $85,000

LIABILITIES AND EQUITY
Total Liabilities: $45,000
Owner's Equity: $40,000

INCOME STATEMENT
For the Year Ended December 31, 2020
Revenue: $180,000
Expenses: $165,000
Net Income: $15,000

These financial statements are over 3 years old and do not meet
current SBA requirements for loan applications.

No CPA preparation or review.
Self-prepared statements without professional oversight.`
    }
  ],
  
  personal: [
    {
      filename: 'personal_financial_statement_old.pdf',
      content: `PERSONAL FINANCIAL STATEMENT

Name: John Doe
Date: ${new Date('2023-05-15').toLocaleDateString()}

ASSETS
Total Assets: $125,000

LIABILITIES
Total Liabilities: $85,000

NET WORTH: $40,000

This statement is over 90 days old and does not meet SBA currency requirements.

UNSIGNED - Missing required signature and notarization.

Statement does not comply with SBA Form 413 requirements.`
    },
    {
      filename: 'personal_tax_return_incomplete.pdf',
      content: `U.S. INDIVIDUAL INCOME TAX RETURN
FORM 1040
Tax Year 2023

Name: [INCOMPLETE]
Social Security Number: [MISSING]

INCOME
Wages: [AMOUNT MISSING]

This return is incomplete and missing critical information.
No signature or date provided.
Does not meet SBA documentation requirements.`
    }
  ],
  
  loan: [
    {
      filename: 'business_plan_basic.pdf',
      content: `BASIC BUSINESS PLAN

Business Name: Simple Business LLC

We want to start a business and need money.

Our business will make money by selling things.

We think we can make $100,000 per year.

Use of funds: General business purposes.

This plan lacks the comprehensive detail required by SBA SOP 50 10 8:
- No executive summary
- No market analysis
- No management team information
- No detailed financial projections
- No repayment analysis
- No use of funds breakdown`
    },
    {
      filename: 'use_of_funds_vague.pdf',
      content: `USE OF FUNDS STATEMENT

Total Loan Amount: $200,000

Use of Funds:
- Working capital needs
- Equipment purchases  
- Business development
- General business purposes

This statement lacks the detailed breakdown required by SBA SOP 50 10 8.
No specific amounts or justifications provided.
Does not meet regulatory requirements for loan documentation.`
    }
  ]
};

// Generate all documents
function generateAllDocuments() {
  console.log('🧹 Cleaning up existing directories...');
  cleanupDirectories();
  
  console.log('📁 Creating directory structure...');
  
  // Create AllValid dataset
  const validBasePath = 'AllValid';
  ensureDirectoryExists(validBasePath);
  ['business', 'financial', 'personal', 'loan'].forEach(folder => {
    ensureDirectoryExists(path.join(validBasePath, folder));
  });
  
  // Create Invalid dataset
  const invalidBasePath = 'Invalid';
  ensureDirectoryExists(invalidBasePath);
  ['business', 'financial', 'personal', 'loan'].forEach(folder => {
    ensureDirectoryExists(path.join(invalidBasePath, folder));
  });
  
  console.log('📄 Generating VALID documents...');
  // Generate valid documents
  Object.entries(validDocuments).forEach(([category, docs]) => {
    const folderPath = path.join(validBasePath, category);
    docs.forEach(doc => {
      generatePDF(doc.content, doc.filename, folderPath);
    });
  });
  
  console.log('❌ Generating INVALID documents...');
  // Generate invalid documents
  Object.entries(invalidDocuments).forEach(([category, docs]) => {
    const folderPath = path.join(invalidBasePath, category);
    docs.forEach(doc => {
      generatePDF(doc.content, doc.filename, folderPath);
    });
  });
  
  console.log('\n✅ Dataset generation complete!');
  console.log('\n📊 SUMMARY:');
  console.log('📁 AllValid/ - Contains documents that PASS SBA SOP 50 10 8 validation');
  console.log('   ├── business/ (2 files)');
  console.log('   ├── financial/ (2 files)');
  console.log('   ├── personal/ (2 files)');
  console.log('   └── loan/ (2 files)');
  console.log('');
  console.log('📁 Invalid/ - Contains documents that FAIL SBA SOP 50 10 8 validation');
  console.log('   ├── business/ (2 files)');
  console.log('   ├── financial/ (2 files)');
  console.log('   ├── personal/ (2 files)');
  console.log('   └── loan/ (2 files)');
  console.log('');
  console.log('🎯 Total: 16 test documents (8 valid + 8 invalid)');
  console.log('');
  console.log('💡 Use these datasets to test your SBA compliance validation system!');
}

// Run the generation
generateAllDocuments();