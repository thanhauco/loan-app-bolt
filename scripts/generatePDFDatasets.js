import fs from 'fs';
import path from 'path';
import { jsPDF } from 'jspdf';

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

// Helper function to create PDF from text content
const createPDF = (content, filename, outputPath) => {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  // Split content into lines and add to PDF
  const lines = content.split('\n');
  let yPosition = 20;
  const lineHeight = 6;
  const pageHeight = 280;
  
  lines.forEach((line, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Handle long lines by wrapping
    if (line.length > 80) {
      const wrappedLines = doc.splitTextToSize(line, 180);
      wrappedLines.forEach(wrappedLine => {
        if (yPosition > pageHeight) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(wrappedLine, 10, yPosition);
        yPosition += lineHeight;
      });
    } else {
      doc.text(line, 10, yPosition);
      yPosition += lineHeight;
    }
  });
  
  // Save PDF
  const fullPath = path.join(outputPath, filename);
  doc.save(fullPath);
  console.log(`✅ Generated: ${fullPath}`);
};

// Generate comprehensive valid documents
const generateValidDocuments = () => {
  console.log('📄 Generating AllValid PDF documents...');
  
  // BUSINESS DOCUMENTS (5 files)
  
  // 1. Current Business License
  const validBusinessLicense = `BUSINESS LICENSE
License Number: BL-2024-12345
Business Name: Tech Solutions LLC
License Type: General Business License
Issue Date: January 15, 2024
Expiration Date: January 15, 2026
Issuing Authority: City of San Francisco Business Registration
Status: ACTIVE
Business Address: 123 Main Street, San Francisco, CA 94102
Phone: (555) 123-4567
Email: info@techsolutions.com

AUTHORIZED ACTIVITIES:
- Technology Consulting Services
- Software Development
- Digital Marketing Services
- IT Support and Maintenance

CONDITIONS:
This license is valid for the activities listed above and must be renewed annually.
Any changes to business activities require license amendment.

Authorized Signature: John Smith, City Clerk
Date Signed: January 15, 2024
Official Seal: [CITY OF SAN FRANCISCO SEAL]`;

  // 2. Articles of Incorporation
  const validArticlesOfIncorporation = `ARTICLES OF INCORPORATION
State of California
Secretary of State Filing

ARTICLE I - NAME
The name of the Limited Liability Company is:
TECH SOLUTIONS LLC

ARTICLE II - PURPOSE
The purpose of this Limited Liability Company is to engage in any lawful act or activity 
for which a Limited Liability Company may be organized under the California Corporations Code.

ARTICLE III - AGENT FOR SERVICE OF PROCESS
The name and address of the initial agent for service of process is:
John Smith
123 Main Street
San Francisco, CA 94102

ARTICLE IV - MANAGEMENT
This Limited Liability Company will be managed by its members.

ARTICLE V - MEMBERS
The name and address of each person who is to be a member is:
John Smith, 123 Main Street, San Francisco, CA 94102 - 100% ownership

ARTICLE VI - EFFECTIVE DATE
These Articles of Organization shall be effective upon filing with the Secretary of State.

SIGNATURE
I hereby declare that I am the person who executed this instrument, which execution is my act and deed.

Signature: John Smith
Date: December 1, 2023

STATE OF CALIFORNIA FILING INFORMATION:
Filing Date: December 1, 2023
File Number: 202312010001
Status: Active - Good Standing
Filing Fee Paid: $70.00

SECRETARY OF STATE CERTIFICATION:
I hereby certify that the foregoing is a true and correct copy of the Articles of Organization
of TECH SOLUTIONS LLC, filed in this office.

State of California Secretary of State
Certificate Number: LLC-2023-001
Date: December 1, 2023`;

  // 3. Operating Agreement
  const validOperatingAgreement = `OPERATING AGREEMENT
TECH SOLUTIONS LLC
A California Limited Liability Company

This Operating Agreement is entered into on December 1, 2023, by and among the Members 
of Tech Solutions LLC, a California Limited Liability Company.

ARTICLE 1 - ORGANIZATION
1.1 Formation: The Company was formed by filing Articles of Organization with the 
California Secretary of State on December 1, 2023.

1.2 Name: The name of the Company is Tech Solutions LLC.

1.3 Principal Place of Business: 123 Main Street, San Francisco, CA 94102

ARTICLE 2 - MEMBERS AND MEMBERSHIP INTERESTS
2.1 Initial Members:
John Smith - 100% Membership Interest
Capital Contribution: $50,000

ARTICLE 3 - MANAGEMENT
3.1 Management Structure: The Company shall be managed by its Members.

3.2 Authority: Members have the authority to bind the Company in the ordinary 
course of business.

ARTICLE 4 - CAPITAL CONTRIBUTIONS
4.1 Initial Contributions: Each Member has made the capital contributions set forth 
in Article 2.

ARTICLE 5 - DISTRIBUTIONS
5.1 Distributions shall be made to Members in proportion to their Membership Interests.

SIGNATURES:
John Smith, Member
Date: December 1, 2023
Signature: [SIGNED] John Smith`;

  // 4. Business Registration Certificate
  const validBusinessRegistration = `BUSINESS REGISTRATION CERTIFICATE
State of California
Department of Business Oversight

Certificate Number: BR-2024-789456
Business Name: Tech Solutions LLC
DBA: Tech Solutions
Business Type: Limited Liability Company
Registration Date: January 10, 2024
Expiration Date: January 10, 2025

BUSINESS INFORMATION:
Principal Address: 123 Main Street, San Francisco, CA 94102
Mailing Address: 123 Main Street, San Francisco, CA 94102
Phone: (555) 123-4567
Email: info@techsolutions.com

BUSINESS ACTIVITIES:
NAICS Code: 541511 - Custom Computer Programming Services
Description: Technology consulting, software development, and IT services

OWNERSHIP:
John Smith - Managing Member - 100%

This certificate confirms that the above-named business is properly registered 
with the State of California and is authorized to conduct business.

Issued by: California Department of Business Oversight
Date: January 10, 2024
Official Seal: [STATE OF CALIFORNIA SEAL]`;

  // 5. Good Standing Certificate
  const validGoodStanding = `CERTIFICATE OF GOOD STANDING
State of California
Secretary of State

Entity Name: TECH SOLUTIONS LLC
Entity Number: 202312010001
Entity Type: Limited Liability Company
Jurisdiction: California
Formation Date: December 1, 2023

This is to certify that the above-named entity:
1. Is duly organized and validly existing under the laws of California
2. Has paid all required fees and penalties
3. Has filed all required documents and reports
4. Is in good standing with the Secretary of State

This certificate is issued as of January 20, 2025.

Secretary of State
State of California
Certificate Number: GS-2025-001234
Date Issued: January 20, 2025`;

  // FINANCIAL DOCUMENTS (6 files)
  
  // Business Tax Returns for 2022, 2023, 2024
  const generateBusinessTaxReturn = (year) => `U.S. CORPORATION INCOME TAX RETURN
Form 1120 - ${year}
Tech Solutions LLC
EIN: 12-3456789
Address: 123 Main Street, San Francisco, CA 94102

TAX YEAR: ${year}

INCOME:
1a. Gross receipts or sales: $${year === 2024 ? '650,000' : year === 2023 ? '500,000' : '350,000'}
1b. Returns and allowances: $5,000
1c. Balance (subtract line 1b from 1a): $${year === 2024 ? '645,000' : year === 2023 ? '495,000' : '345,000'}
2. Cost of goods sold: $${year === 2024 ? '250,000' : year === 2023 ? '200,000' : '140,000'}
3. Gross profit (subtract line 2 from line 1c): $${year === 2024 ? '395,000' : year === 2023 ? '295,000' : '205,000'}

DEDUCTIONS:
12. Salaries and wages: $${year === 2024 ? '180,000' : year === 2023 ? '150,000' : '120,000'}
13. Repairs and maintenance: $8,000
14. Bad debts: $2,000
15. Rents: $${year === 2024 ? '48,000' : year === 2023 ? '36,000' : '30,000'}
16. Taxes and licenses: $12,000
17. Interest: $5,000
26. Other deductions: $${year === 2024 ? '65,000' : year === 2023 ? '50,000' : '35,000'}
27. Total deductions: $${year === 2024 ? '320,000' : year === 2023 ? '251,000' : '210,000'}

28. Taxable income: $${year === 2024 ? '75,000' : year === 2023 ? '44,000' : '0'}
31. Total tax: $${year === 2024 ? '15,750' : year === 2023 ? '9,240' : '0'}

SIGNATURE SECTION:
Under penalties of perjury, I declare that I have examined this return and accompanying 
schedules and statements, and to the best of my knowledge and belief, they are true, 
correct, and complete.

Signature of officer: [SIGNED] John Smith
Title: President
Date: ${year === 2024 ? 'March 15, 2025' : year === 2023 ? 'March 15, 2024' : 'March 15, 2023'}

PREPARER INFORMATION:
Prepared by: Smith & Associates CPA
CPA License: CA-12345
Address: 456 Oak Street, San Francisco, CA 94103
Phone: (555) 987-6543
Date: ${year === 2024 ? 'March 15, 2025' : year === 2023 ? 'March 15, 2024' : 'March 15, 2023'}
Signature: [SIGNED] Robert Smith, CPA`;

  // Financial Statements for 2022, 2023, 2024
  const generateFinancialStatements = (year) => `FINANCIAL STATEMENTS
Tech Solutions LLC
For Year Ended December 31, ${year}

BALANCE SHEET
As of December 31, ${year}

ASSETS
Current Assets:
  Cash and cash equivalents: $${year === 2024 ? '95,000' : year === 2023 ? '75,000' : '55,000'}
  Accounts receivable: $${year === 2024 ? '145,000' : year === 2023 ? '125,000' : '85,000'}
  Inventory: $${year === 2024 ? '65,000' : year === 2023 ? '50,000' : '35,000'}
  Prepaid expenses: $${year === 2024 ? '8,000' : year === 2023 ? '6,000' : '4,000'}
  Total Current Assets: $${year === 2024 ? '313,000' : year === 2023 ? '256,000' : '179,000'}

Fixed Assets:
  Equipment (cost): $${year === 2024 ? '150,000' : year === 2023 ? '120,000' : '80,000'}
  Less: Accumulated depreciation: $(${year === 2024 ? '45,000' : year === 2023 ? '30,000' : '16,000'})
  Net Fixed Assets: $${year === 2024 ? '105,000' : year === 2023 ? '90,000' : '64,000'}

TOTAL ASSETS: $${year === 2024 ? '418,000' : year === 2023 ? '346,000' : '243,000'}

LIABILITIES AND EQUITY
Current Liabilities:
  Accounts payable: $${year === 2024 ? '35,000' : year === 2023 ? '28,000' : '22,000'}
  Accrued expenses: $${year === 2024 ? '18,000' : year === 2023 ? '15,000' : '12,000'}
  Current portion of long-term debt: $${year === 2024 ? '12,000' : year === 2023 ? '10,000' : '8,000'}
  Total Current Liabilities: $${year === 2024 ? '65,000' : year === 2023 ? '53,000' : '42,000'}

Long-term Liabilities:
  Long-term debt: $${year === 2024 ? '85,000' : year === 2023 ? '95,000' : '105,000'}
  Total Long-term Liabilities: $${year === 2024 ? '85,000' : year === 2023 ? '95,000' : '105,000'}

Total Liabilities: $${year === 2024 ? '150,000' : year === 2023 ? '148,000' : '147,000'}

Owner's Equity:
  Member contributions: $50,000
  Retained earnings: $${year === 2024 ? '218,000' : year === 2023 ? '148,000' : '96,000'}
  Total Owner's Equity: $${year === 2024 ? '268,000' : year === 2023 ? '198,000' : '146,000'}

TOTAL LIABILITIES AND EQUITY: $${year === 2024 ? '418,000' : year === 2023 ? '346,000' : '243,000'}

INCOME STATEMENT
For the Year Ended December 31, ${year}

Revenue:
  Service revenue: $${year === 2024 ? '550,000' : year === 2023 ? '420,000' : '290,000'}
  Product sales: $${year === 2024 ? '95,000' : year === 2023 ? '75,000' : '55,000'}
  Total Revenue: $${year === 2024 ? '645,000' : year === 2023 ? '495,000' : '345,000'}

Cost of Sales: $${year === 2024 ? '250,000' : year === 2023 ? '200,000' : '140,000'}
Gross Profit: $${year === 2024 ? '395,000' : year === 2023 ? '295,000' : '205,000'}

Operating Expenses:
  Salaries and wages: $${year === 2024 ? '180,000' : year === 2023 ? '150,000' : '120,000'}
  Rent: $${year === 2024 ? '48,000' : year === 2023 ? '36,000' : '30,000'}
  Utilities: $${year === 2024 ? '12,000' : year === 2023 ? '9,000' : '7,000'}
  Insurance: $${year === 2024 ? '15,000' : year === 2023 ? '12,000' : '10,000'}
  Professional fees: $${year === 2024 ? '8,000' : year === 2023 ? '6,000' : '5,000'}
  Depreciation: $${year === 2024 ? '15,000' : year === 2023 ? '14,000' : '12,000'}
  Other expenses: $${year === 2024 ? '42,000' : year === 2023 ? '24,000' : '16,000'}
  Total Operating Expenses: $${year === 2024 ? '320,000' : year === 2023 ? '251,000' : '200,000'}

Net Income: $${year === 2024 ? '75,000' : year === 2023 ? '44,000' : '5,000'}

CASH FLOW STATEMENT
For the Year Ended December 31, ${year}

Operating Activities:
  Net income: $${year === 2024 ? '75,000' : year === 2023 ? '44,000' : '5,000'}
  Depreciation: $${year === 2024 ? '15,000' : year === 2023 ? '14,000' : '12,000'}
  Changes in working capital: $${year === 2024 ? '(25,000)' : year === 2023 ? '(15,000)' : '(8,000)'}
  Net Cash from Operations: $${year === 2024 ? '65,000' : year === 2023 ? '43,000' : '9,000'}

Investing Activities:
  Equipment purchases: $(${year === 2024 ? '30,000' : year === 2023 ? '40,000' : '25,000'})
  Net Cash from Investing: $(${year === 2024 ? '30,000' : year === 2023 ? '40,000' : '25,000'})

Financing Activities:
  Loan payments: $(${year === 2024 ? '10,000' : year === 2023 ? '10,000' : '5,000'})
  Member distributions: $(${year === 2024 ? '5,000' : year === 2023 ? '0' : '0'})
  Net Cash from Financing: $(${year === 2024 ? '15,000' : year === 2023 ? '10,000' : '5,000'})

Net Change in Cash: $${year === 2024 ? '20,000' : year === 2023 ? '(7,000)' : '(21,000)'}
Beginning Cash: $${year === 2024 ? '75,000' : year === 2023 ? '82,000' : '103,000'}
Ending Cash: $${year === 2024 ? '95,000' : year === 2023 ? '75,000' : '82,000'}

NOTES TO FINANCIAL STATEMENTS:
1. Basis of Accounting: These financial statements are prepared using the accrual method.
2. Revenue Recognition: Revenue is recognized when services are performed or products delivered.
3. Depreciation: Equipment is depreciated using straight-line method over 5-7 years.

COMPILATION REPORT:
We have compiled the accompanying financial statements of Tech Solutions LLC as of and 
for the year ended December 31, ${year}. We have not audited or reviewed these financial 
statements and do not express an opinion or provide any assurance about whether the 
financial statements are in accordance with accounting principles generally accepted 
in the United States of America.

Smith & Associates CPA
Certified Public Accountants
License: CA-12345
Date: ${year === 2024 ? 'February 28, 2025' : year === 2023 ? 'February 28, 2024' : 'February 28, 2023'}
Signature: [SIGNED] Robert Smith, CPA`;

  // PERSONAL DOCUMENTS (4 files)
  
  // Personal Tax Returns for 2022, 2023, 2024
  const generatePersonalTaxReturn = (year) => `U.S. INDIVIDUAL INCOME TAX RETURN
Form 1040 - ${year}
John Smith
SSN: XXX-XX-1234
Address: 123 Main Street, San Francisco, CA 94102
Filing Status: Single

TAX YEAR: ${year}

INCOME:
1. Wages, salaries, tips: $${year === 2024 ? '200,000' : year === 2023 ? '180,000' : '160,000'}
2a. Tax-exempt interest: $500
2b. Taxable interest: $${year === 2024 ? '4,200' : year === 2023 ? '3,500' : '2,800'}
3a. Qualified dividends: $${year === 2024 ? '9,500' : year === 2023 ? '8,200' : '6,800'}
3b. Ordinary dividends: $${year === 2024 ? '9,500' : year === 2023 ? '8,200' : '6,800'}
4a. IRA distributions: $0
4b. Taxable amount: $0
5a. Pensions and annuities: $0
5b. Taxable amount: $0
6. Social security benefits: $0
7. Capital gain or (loss): $${year === 2024 ? '12,000' : year === 2023 ? '8,000' : '5,000'}
8. Other income: $${year === 2024 ? '75,000' : year === 2023 ? '64,000' : '52,000'}

Total Income: $${year === 2024 ? '300,700' : year === 2023 ? '263,700' : '225,600'}

ADJUSTMENTS TO INCOME:
10. Educator expenses: $0
11. Business expenses: $3,000
12. Health savings account deduction: $${year === 2024 ? '4,300' : year === 2023 ? '4,150' : '3,900'}
13. Moving expenses: $0
14. Self-employment tax deduction: $${year === 2024 ? '5,300' : year === 2023 ? '4,500' : '3,700'}
15. Self-employed SEP, SIMPLE plans: $${year === 2024 ? '15,000' : year === 2023 ? '12,000' : '10,000'}
16. Self-employed health insurance: $${year === 2024 ? '8,500' : year === 2023 ? '7,800' : '7,200'}

Total Adjustments: $${year === 2024 ? '36,100' : year === 2023 ? '32,450' : '27,800'}

Adjusted Gross Income: $${year === 2024 ? '264,600' : year === 2023 ? '231,250' : '197,800'}

STANDARD DEDUCTION:
Standard deduction: $${year === 2024 ? '14,600' : year === 2023 ? '13,850' : '12,950'}

Taxable Income: $${year === 2024 ? '250,000' : year === 2023 ? '217,400' : '184,850'}

TAX COMPUTATION:
Tax (from tax table): $${year === 2024 ? '55,678' : year === 2023 ? '46,720' : '38,456'}
Alternative minimum tax: $0
Total Tax: $${year === 2024 ? '55,678' : year === 2023 ? '46,720' : '38,456'}

PAYMENTS:
Federal income tax withheld: $${year === 2024 ? '58,000' : year === 2023 ? '48,500' : '40,000'}
Estimated tax payments: $${year === 2024 ? '8,000' : year === 2023 ? '6,500' : '5,000'}
Earned income credit: $0
Additional child tax credit: $0
American opportunity credit: $0

Total Payments: $${year === 2024 ? '66,000' : year === 2023 ? '55,000' : '45,000'}

REFUND OR AMOUNT OWED:
${year === 2024 ? 'Refund: $10,322' : year === 2023 ? 'Refund: $8,280' : 'Refund: $6,544'}

SIGNATURE SECTION:
Under penalties of perjury, I declare that I have examined this return and accompanying 
schedules and statements, and to the best of my knowledge and belief, they are true, 
correct, and complete. Declaration of preparer (other than taxpayer) is based on all 
information of which preparer has any knowledge.

Your signature: [SIGNED] John Smith
Date: ${year === 2024 ? 'April 12, 2025' : year === 2023 ? 'April 10, 2024' : 'April 8, 2023'}
Occupation: Business Owner
Phone number: (555) 123-4567

PREPARER INFORMATION:
Preparer's name: Robert Smith, CPA
Preparer's signature: [SIGNED] Robert Smith, CPA
Date: ${year === 2024 ? 'April 12, 2025' : year === 2023 ? 'April 10, 2024' : 'April 8, 2023'}
PTIN: P01234567
Firm's name: Smith & Associates CPA
Firm's address: 456 Oak Street, San Francisco, CA 94103
Phone: (555) 987-6543`;

  // Current Personal Financial Statement
  const validPersonalFinancialStatement = `SBA FORM 413 - PERSONAL FINANCIAL STATEMENT
Date: January 10, 2025

PERSONAL INFORMATION:
Name: John Smith
Address: 123 Main Street, San Francisco, CA 94102
City, State, ZIP: San Francisco, CA 94102
Phone: (555) 123-4567
Date of Birth: 01/15/1980
Social Security Number: XXX-XX-1234

ASSETS (Omit Cents)
Cash on hand and in banks: $35,000
Savings accounts: $185,000
IRA or other retirement accounts: $125,000
Accounts and notes receivable: $25,000
Life insurance (cash surrender value): $22,000
Stocks and bonds: $285,000
Real estate owned (market value): $950,000
Automobile (present value): $55,000
Other personal property: $65,000
Other assets (describe): Investment property $450,000

TOTAL ASSETS: $2,197,000

LIABILITIES (Omit Cents)
Accounts payable: $8,500
Notes payable to banks and others: $35,000
Installment account (auto): $28,000
Installment account (other): $12,000
Loan on life insurance: $3,500
Mortgages on real estate: $625,000
Other liabilities: $18,000

TOTAL LIABILITIES: $730,000

NET WORTH: $1,467,000

CONTINGENT LIABILITIES:
As endorser or co-maker: $0
Legal claims and judgments: $0
Provision for federal income tax: $15,000
Other special debt: $0

SOURCES OF INCOME (Annual)
Salary: $200,000
Net investment income: $45,000
Real estate income: $28,000
Other income (describe): Business distributions $75,000

TOTAL ANNUAL INCOME: $348,000

PERSONAL EXPENDITURES (Annual)
Real estate taxes: $18,500
Income taxes: $78,000
Insurance premiums: $15,000
Other living expenses: $95,000

TOTAL ANNUAL EXPENDITURES: $206,500

DETAILS OF REAL ESTATE OWNED:
Property 1:
Address: 123 Main Street, San Francisco, CA 94102
Type: Primary Residence
Date acquired: 2018
Original cost: $750,000
Present market value: $950,000
Mortgage balance: $425,000
Amount of payment per month: $3,200

Property 2:
Address: 789 Oak Avenue, San Francisco, CA 94110
Type: Investment Property
Date acquired: 2020
Original cost: $380,000
Present market value: $450,000
Mortgage balance: $200,000
Amount of payment per month: $1,800

DETAILS OF STOCKS AND BONDS:
Apple Inc. (AAPL): 500 shares @ $185 = $92,500
Microsoft Corp (MSFT): 300 shares @ $380 = $114,000
Vanguard S&P 500 ETF: 200 shares @ $425 = $85,000
US Treasury Bonds: Face value $50,000

CERTIFICATION:
I certify that the information provided in this statement is true and complete to the 
best of my knowledge. I understand that false statements may result in forfeiture of 
benefits and possible prosecution by the U.S. Attorney General.

Signature: [SIGNED] John Smith
Date: January 10, 2025`;

  // LOAN DOCUMENTS (4 files)
  
  // Comprehensive Business Plan
  const validBusinessPlan = `COMPREHENSIVE BUSINESS PLAN
TECH SOLUTIONS LLC

EXECUTIVE SUMMARY

Company Overview:
Tech Solutions LLC is a technology consulting firm specializing in small business digital 
transformation. Founded in December 2023, we provide comprehensive IT solutions including 
cloud migration, cybersecurity implementation, custom software development, and digital 
marketing services to small and medium-sized businesses in the San Francisco Bay Area.

Mission Statement:
To empower small businesses through innovative technology solutions, helping them compete 
effectively in the digital marketplace while maintaining cost-effective operations and 
achieving sustainable growth.

Key Success Factors:
• Experienced management team with 25+ years combined industry experience
• Strong relationships with technology vendors and partners
• Proven track record of successful client implementations
• Comprehensive service offerings under one roof
• Local market expertise and personalized service approach

Financial Summary:
• Year 1 Projected Revenue: $750,000
• Year 2 Projected Revenue: $1,200,000  
• Year 3 Projected Revenue: $1,800,000
• Loan Request: $250,000 for working capital and expansion
• Projected ROI: 28% annually

BUSINESS DESCRIPTION

Company History:
Tech Solutions LLC was incorporated in California in December 2023 as a Limited Liability 
Company. The company was founded by John Smith, who brings 15 years of experience in 
technology consulting and business management.

Legal Structure:
• Entity Type: Limited Liability Company (LLC)
• State of Incorporation: California
• Federal EIN: 12-3456789
• Principal Address: 123 Main Street, San Francisco, CA 94102

Products and Services:
1. IT Consulting and Strategy
   - Technology assessments and planning
   - IT infrastructure design and implementation
   - Cloud migration strategies
   - Cybersecurity assessments and solutions

2. Custom Software Development
   - Web application development
   - Mobile app development
   - Database design and implementation
   - API development and integration

3. Digital Marketing Services
   - Website design and development
   - Search engine optimization (SEO)
   - Social media marketing
   - Email marketing campaigns

4. Managed IT Services
   - 24/7 network monitoring
   - Help desk support
   - Data backup and recovery
   - Software updates and maintenance

MARKET ANALYSIS

Industry Overview:
The technology consulting industry has experienced significant growth, particularly in the 
small business segment. According to IBISWorld, the industry generates over $450 billion 
in annual revenue globally, with projected annual growth of 8.2% through 2028.

Target Market:
Primary Target: Small to medium businesses (10-100 employees) in the San Francisco Bay Area
• Professional services firms (law, accounting, consulting)
• Healthcare practices and clinics
• Retail and e-commerce businesses
• Manufacturing and distribution companies
• Non-profit organizations

Market Size:
• Total Addressable Market: $2.5 billion (SMB technology services in Bay Area)
• Serviceable Available Market: $450 million (our specific service areas)
• Serviceable Obtainable Market: $25 million (realistic 3-year capture)

Competitive Analysis:
Direct Competitors:
• Large consulting firms (Accenture, Deloitte, IBM) - Higher cost, less personalized
• Local IT service providers - Limited service scope, less strategic focus
• Freelance consultants - Inconsistent quality, limited capacity

Competitive Advantages:
• Comprehensive service portfolio under one roof
• Industry-specific expertise and solutions
• Personalized service and local market knowledge
• Competitive pricing with enterprise-quality delivery
• Strong vendor partnerships for better pricing and support

ORGANIZATION AND MANAGEMENT

Management Team:

John Smith - Chief Executive Officer and Founder
• MBA, Stanford Graduate School of Business (2015)
• BS Computer Science, UC Berkeley (2008)
• 15 years experience in technology consulting
• Former Senior Manager, Deloitte Consulting (2018-2023)
• Former Technology Consultant, Accenture (2012-2018)
• Certified Project Management Professional (PMP)
• Certified Information Systems Security Professional (CISSP)

Sarah Johnson - Chief Technology Officer (to be hired with loan proceeds)
• MS Computer Science, Stanford University
• 12 years software development and architecture experience
• Former Lead Developer, Salesforce (2019-2024)
• Former Senior Software Engineer, Google (2015-2019)
• Expert in cloud technologies, AI/ML, and cybersecurity

Michael Chen - Vice President of Sales (to be hired with loan proceeds)
• MBA, UC Berkeley Haas School of Business
• 10 years business development and sales experience
• Former Sales Director, Oracle (2020-2024)
• Former Account Manager, Microsoft (2016-2020)
• Proven track record of exceeding sales targets

Organizational Structure:
The company operates with three main departments:
1. Consulting Services - Led by CEO John Smith
2. Software Development - Led by CTO Sarah Johnson
3. Sales and Marketing - Led by VP Sales Michael Chen

Advisory Board:
• Robert Wilson - Former CTO, Wells Fargo Bank
• Lisa Martinez - Managing Partner, Bay Area Ventures
• David Kim - Founder and CEO, TechStart Accelerator

FINANCIAL PROJECTIONS

Three-Year Revenue Projections:

YEAR 1 (2024):
Revenue Breakdown:
• IT Consulting Services: $450,000 (60%)
• Software Development: $225,000 (30%)
• Digital Marketing: $75,000 (10%)
Total Revenue: $750,000

Expense Breakdown:
• Salaries and Benefits: $420,000 (56%)
• Office Rent and Utilities: $48,000 (6.4%)
• Professional Services: $15,000 (2%)
• Marketing and Sales: $35,000 (4.7%)
• Technology and Equipment: $25,000 (3.3%)
• Insurance and Legal: $18,000 (2.4%)
• Other Operating Expenses: $39,000 (5.2%)
Total Expenses: $600,000

Net Income: $150,000
EBITDA: $175,000
Cash Flow: $185,000

YEAR 2 (2025):
Revenue Breakdown:
• IT Consulting Services: $720,000 (60%)
• Software Development: $360,000 (30%)
• Digital Marketing: $120,000 (10%)
Total Revenue: $1,200,000

Total Expenses: $900,000
Net Income: $300,000
EBITDA: $340,000
Cash Flow: $365,000

YEAR 3 (2026):
Revenue Breakdown:
• IT Consulting Services: $1,080,000 (60%)
• Software Development: $540,000 (30%)
• Digital Marketing: $180,000 (10%)
Total Revenue: $1,800,000

Total Expenses: $1,300,000
Net Income: $500,000
EBITDA: $560,000
Cash Flow: $595,000

Key Financial Ratios:
• Gross Margin: 75% (industry average: 65%)
• Net Margin Year 1: 20% (industry average: 12%)
• Current Ratio: 2.5 (strong liquidity position)
• Debt-to-Equity Ratio: 0.3 (conservative leverage)

USE OF LOAN PROCEEDS

Total Loan Request: $250,000

Detailed Breakdown:

1. WORKING CAPITAL: $100,000 (40%)
   Purpose: Support accounts receivable and operational cash flow during growth phase
   • Accounts receivable financing: $60,000
   • Inventory and supplies: $25,000
   • Operating cash flow buffer: $15,000
   
   Justification: Technology consulting requires significant upfront investment in 
   project resources before client payments are received. This working capital will 
   ensure smooth operations during our rapid growth phase.

2. EQUIPMENT AND TECHNOLOGY: $75,000 (30%)
   • Server infrastructure and cloud setup: $35,000
   • Workstations and laptops (8 units): $25,000
   • Software licenses and development tools: $15,000
   
   Justification: High-quality equipment is essential for delivering professional 
   services and maintaining competitive advantage in technology consulting.

3. MARKETING AND BUSINESS DEVELOPMENT: $35,000 (14%)
   • Digital marketing campaigns: $20,000
   • Trade show participation and networking: $10,000
   • Sales materials and branding: $5,000
   
   Justification: Aggressive marketing is necessary to establish market presence 
   and achieve projected revenue growth in competitive market.

4. OFFICE EXPANSION: $25,000 (10%)
   • Additional office space lease deposits: $15,000
   • Office furniture and setup: $10,000
   
   Justification: Current space will be insufficient for planned team expansion 
   from 3 to 12 employees over next 18 months.

5. PROFESSIONAL SERVICES AND TRAINING: $15,000 (6%)
   • Legal and accounting setup costs: $8,000
   • Professional certifications and training: $7,000
   
   Justification: Maintaining current certifications and obtaining new ones is 
   critical for credibility and competitive positioning.

REPAYMENT ANALYSIS

Loan Terms Assumed:
• Loan Amount: $250,000
• Interest Rate: 7.5% (current SBA rates)
• Term: 5 years
• Monthly Payment: $5,023

Debt Service Coverage Analysis:

Year 1:
• Projected Monthly Cash Flow: $15,417
• Monthly Debt Service: $5,023
• Debt Service Coverage Ratio: 3.07x

Year 2:
• Projected Monthly Cash Flow: $30,417
• Monthly Debt Service: $5,023
• Debt Service Coverage Ratio: 6.06x

Year 3:
• Projected Monthly Cash Flow: $49,583
• Monthly Debt Service: $5,023
• Debt Service Coverage Ratio: 9.87x

The strong debt service coverage ratios demonstrate our ability to comfortably 
service the loan while maintaining healthy cash flow for operations and growth.

Alternative Repayment Sources:
• Business assets (equipment, accounts receivable): $180,000
• Personal guarantee backed by personal net worth: $1,467,000
• Strong client contracts providing predictable revenue stream

RISK ANALYSIS AND MITIGATION

Key Business Risks:

1. Economic Downturn Risk
   Risk: Reduced technology spending by small businesses during recession
   Mitigation: Diversified client base across industries, focus on cost-saving 
   solutions, flexible service offerings

2. Competition Risk
   Risk: Large consulting firms targeting small business market
   Mitigation: Superior local service, specialized industry knowledge, 
   competitive pricing, strong client relationships

3. Technology Change Risk
   Risk: Rapid technology evolution making skills obsolete
   Mitigation: Continuous training and certification, partnerships with 
   technology vendors, agile service development

4. Key Personnel Risk
   Risk: Loss of key management or technical staff
   Mitigation: Competitive compensation packages, equity participation, 
   comprehensive documentation, cross-training

5. Client Concentration Risk
   Risk: Over-dependence on large clients
   Mitigation: No single client >15% of revenue, active business development, 
   long-term contracts with key clients

GROWTH STRATEGY

Short-term Goals (Year 1):
• Establish strong local market presence
• Build team to 8 full-time employees
• Achieve $750,000 in revenue
• Develop strategic vendor partnerships
• Implement robust operational processes

Medium-term Goals (Years 2-3):
• Expand to 15 full-time employees
• Achieve $1.8M annual revenue
• Establish satellite office in Oakland
• Develop proprietary software solutions
• Build recurring revenue stream to 40% of total

Long-term Goals (Years 4-5):
• Regional expansion throughout Northern California
• Achieve $3M+ annual revenue
• Develop franchise or licensing model
• Consider strategic acquisition opportunities
• Explore exit strategies (acquisition or IPO)

CONCLUSION

Tech Solutions LLC represents a compelling investment opportunity in the rapidly 
growing technology consulting market. With experienced management, comprehensive 
service offerings, and a clear path to profitability, we are well-positioned to 
achieve our aggressive growth targets.

The requested $250,000 SBA loan will provide the necessary capital to execute our 
business plan and achieve projected returns. Our conservative financial projections, 
strong debt service coverage ratios, and comprehensive risk mitigation strategies 
demonstrate our commitment to responsible growth and loan repayment.

We look forward to partnering with the SBA and our lending institution to build 
a successful, job-creating business that contributes to the economic vitality of 
the San Francisco Bay Area.

Prepared by: John Smith, CEO
Date: January 15, 2025
Contact: (555) 123-4567
Email: john.smith@techsolutions.com`;

  // Detailed Use of Funds Statement
  const validUseOfFunds = `USE OF FUNDS STATEMENT
TECH SOLUTIONS LLC
SBA Loan Application

Loan Amount Requested: $250,000
Application Date: January 15, 2025
Prepared by: John Smith, CEO

EXECUTIVE SUMMARY

This Use of Funds statement details how Tech Solutions LLC will utilize the requested 
$250,000 SBA loan to support business expansion, increase operational capacity, and 
achieve projected revenue growth of 140% in Year 1.

The funds will be strategically deployed across five key areas to maximize return on 
investment and ensure sustainable business growth while maintaining strong debt service 
coverage ratios.

DETAILED BREAKDOWN

1. WORKING CAPITAL: $100,000 (40.0%)

1.1 Accounts Receivable Financing: $60,000 (24.0%)
Purpose: Bridge cash flow gap between project delivery and client payment
Justification: Technology consulting projects typically have 30-60 day payment terms, 
requiring significant working capital to maintain operations during growth phase.

Breakdown:
• Month 1-3 A/R financing: $25,000
• Month 4-6 A/R financing: $20,000
• Month 7-12 A/R financing: $15,000

Expected Impact: Enable acceptance of larger projects without cash flow constraints, 
supporting 40% revenue increase in Year 1.

1.2 Inventory and Supplies: $25,000 (10.0%)
• Computer hardware for client projects: $15,000
• Software licenses for resale: $8,000
• Office supplies and materials: $2,000

1.3 Operating Cash Flow Reserve: $15,000 (6.0%)
Purpose: Maintain 30-day operating expense reserve for financial stability
Coverage: Payroll, rent, utilities, and essential operating expenses

2. EQUIPMENT AND TECHNOLOGY: $75,000 (30.0%)

2.1 Server Infrastructure and Cloud Setup: $35,000 (14.0%)
• Dell PowerEdge servers (2 units): $18,000
• Network equipment and security appliances: $8,000
• Cloud infrastructure setup and migration: $6,000
• Backup and disaster recovery systems: $3,000

Justification: Essential for delivering enterprise-level services to clients and 
supporting internal operations as team grows from 3 to 8 employees.

2.2 Workstations and Computing Equipment: $25,000 (10.0%)
• High-performance workstations (5 units @ $3,500): $17,500
• Laptops for mobile consultants (3 units @ $2,500): $7,500

Specifications: Intel i7 processors, 32GB RAM, 1TB SSD storage to handle complex 
development and consulting tasks.

2.3 Software Licenses and Development Tools: $15,000 (6.0%)
• Microsoft Office 365 Enterprise (12 licenses): $3,600
• Adobe Creative Suite licenses: $2,400
• Development tools (Visual Studio, etc.): $4,000
• Project management software: $2,000
• Cybersecurity tools and licenses: $3,000

3. MARKETING AND BUSINESS DEVELOPMENT: $35,000 (14.0%)

3.1 Digital Marketing Campaigns: $20,000 (8.0%)
• Google Ads and search marketing: $8,000
• LinkedIn advertising and lead generation: $5,000
• Website development and SEO: $4,000
• Content marketing and blog development: $3,000

Expected ROI: Generate 150+ qualified leads, convert 15% to clients, average 
project value $25,000 = $562,500 revenue potential.

3.2 Trade Shows and Networking Events: $10,000 (4.0%)
• Bay Area technology conferences: $6,000
• Small business association events: $2,000
• Professional networking memberships: $2,000

3.3 Sales Materials and Branding: $5,000 (2.0%)
• Professional brochures and presentations: $2,000
• Trade show displays and materials: $2,000
• Corporate branding and logo design: $1,000

4. OFFICE EXPANSION: $25,000 (10.0%)

4.1 Additional Office Space: $15,000 (6.0%)
• Lease deposits for expanded space: $10,000
• Utility deposits and setup: $3,000
• Security system installation: $2,000

Current Space: 1,200 sq ft
Expanded Space: 2,400 sq ft
Monthly Rent Increase: $2,000 (from $3,000 to $5,000)

4.2 Office Furniture and Setup: $10,000 (4.0%)
• Desks and chairs (8 workstations): $6,000
• Conference room furniture: $2,500
• Storage and filing systems: $1,500

5. PROFESSIONAL SERVICES AND TRAINING: $15,000 (6.0%)

5.1 Legal and Accounting Setup: $8,000 (3.2%)
• Corporate legal services: $4,000
• Accounting system setup and training: $2,000
• Contract templates and legal documentation: $2,000

5.2 Professional Certifications and Training: $7,000 (2.8%)
• AWS and Microsoft Azure certifications: $3,000
• Cybersecurity training and certifications: $2,500
• Project management training: $1,500

TOTAL ALLOCATION: $250,000 (100.0%)

IMPLEMENTATION TIMELINE

Month 1 (February 2025):
• Equipment purchases and setup: $50,000
• Office expansion lease signing: $15,000
• Initial working capital deployment: $25,000
Total Month 1: $90,000

Month 2 (March 2025):
• Remaining equipment and software: $25,000
• Marketing campaign launch: $15,000
• Additional working capital: $20,000
Total Month 2: $60,000

Months 3-6 (April-July 2025):
• Ongoing working capital needs: $40,000
• Marketing and business development: $20,000
• Professional services and training: $15,000
• Office furniture and setup: $10,000
• Remaining equipment: $0
Total Months 3-6: $85,000

Months 7-12 (August 2025-January 2026):
• Final working capital deployment: $15,000
Total Months 7-12: $15,000

EXPECTED OUTCOMES AND ROI

Revenue Impact:
• Year 1 Revenue Increase: $400,000 (from $350,000 baseline to $750,000)
• Year 2 Revenue Projection: $1,200,000
• Year 3 Revenue Projection: $1,800,000

Employment Impact:
• Current Employees: 3 full-time
• Year 1 Target: 8 full-time employees
• Year 2 Target: 12 full-time employees
• Average Salary: $75,000 + benefits

Operational Efficiency Gains:
• Project delivery time reduction: 25%
• Client satisfaction score improvement: 15%
• Operational cost per dollar of revenue reduction: 20%

Financial Returns:
• Year 1 ROI: 160% ($400,000 revenue increase / $250,000 investment)
• 3-Year Cumulative ROI: 520%
• Payback Period: 7.5 months

RISK MITIGATION

Contingency Planning:
• 10% contingency built into each category for cost overruns
• Alternative suppliers identified for all major purchases
• Flexible lease terms allowing for space reduction if needed

Performance Monitoring:
• Monthly financial reviews and budget variance analysis
• Quarterly ROI assessment and strategy adjustment
• Key performance indicators tracking for all funded initiatives

CONCLUSION

This Use of Funds statement demonstrates a strategic, well-planned approach to business 
expansion that will generate significant returns while maintaining financial stability. 
The requested $250,000 will be deployed efficiently across critical business areas to 
support sustainable growth and job creation.

Our detailed implementation timeline, expected outcomes, and risk mitigation strategies 
provide confidence in our ability to achieve projected results and successfully repay 
the SBA loan.

CERTIFICATION

I certify that the information contained in this Use of Funds statement is true and 
accurate to the best of my knowledge. The funds will be used solely for the purposes 
outlined above and in accordance with SBA guidelines.

Signature: [SIGNED] John Smith
Title: Chief Executive Officer
Date: January 15, 2025
Company: Tech Solutions LLC
Phone: (555) 123-4567
Email: john.smith@techsolutions.com`;

  // SBA Loan Application Form 1919
  const validSBAForm1919 = `SBA FORM 1919 - BORROWER INFORMATION FORM
U.S. Small Business Administration

SECTION A - BORROWER INFORMATION

1. Business Legal Name: Tech Solutions LLC
2. Trade Name/DBA: Tech Solutions
3. Business Address: 123 Main Street, San Francisco, CA 94102
4. Business Phone: (555) 123-4567
5. Business Email: info@techsolutions.com
6. Federal Tax ID (EIN): 12-3456789
7. Business Type: Limited Liability Company (LLC)
8. Date Business Established: December 1, 2023
9. State of Incorporation: California
10. Number of Employees: 3 full-time, 1 part-time

SECTION B - LOAN INFORMATION

11. Loan Amount Requested: $250,000
12. Loan Purpose: Working capital and business expansion
13. Term Requested: 5 years
14. Collateral Offered: Business equipment, accounts receivable, personal guarantee

SECTION C - BUSINESS DESCRIPTION

15. Primary NAICS Code: 541511 - Custom Computer Programming Services
16. Business Description: Technology consulting firm providing IT solutions, software 
    development, and digital marketing services to small and medium businesses.

17. Products/Services:
    • IT consulting and strategy
    • Custom software development  
    • Digital marketing services
    • Managed IT services
    • Cybersecurity solutions

SECTION D - OWNERSHIP INFORMATION

18. Principal Owners (20% or more ownership):
    Name: John Smith
    Title: Managing Member/CEO
    Ownership %: 100%
    Address: 123 Main Street, San Francisco, CA 94102
    SSN: XXX-XX-1234
    Phone: (555) 123-4567

SECTION E - FINANCIAL INFORMATION

19. Annual Sales:
    Current Year (2024): $645,000
    Previous Year (2023): $495,000
    Two Years Ago (2022): $345,000

20. Current Assets: $313,000
21. Current Liabilities: $65,000
22. Net Worth: $268,000
23. Average Monthly Sales: $53,750
24. Cash on Hand: $95,000

SECTION F - BANK INFORMATION

25. Primary Bank: Wells Fargo Bank
26. Bank Address: 456 Market Street, San Francisco, CA 94105
27. Account Number: XXXX-XXXX-1234
28. Average Balance: $75,000
29. Length of Relationship: 2 years

SECTION G - EXISTING DEBT

30. Current Business Debt:
    Creditor: Equipment Finance Company
    Original Amount: $120,000
    Current Balance: $85,000
    Monthly Payment: $2,100
    Maturity Date: June 2027

SECTION H - USE OF PROCEEDS

31. Detailed Use of Loan Proceeds:
    Working Capital: $100,000 (40%)
    Equipment/Technology: $75,000 (30%)
    Marketing/Business Development: $35,000 (14%)
    Office Expansion: $25,000 (10%)
    Professional Services: $15,000 (6%)

SECTION I - ENVIRONMENTAL QUESTIONNAIRE

32. Will the loan proceeds be used for any of the following:
    a) Construction or renovation: No
    b) Manufacturing operations: No
    c) Storage of petroleum products: No
    d) Dry cleaning operations: No
    e) Operations involving hazardous materials: No

33. Is the business located in a special flood hazard area: No

SECTION J - CERTIFICATIONS

34. Applicant Certifications:
    ☑ I certify that the information provided is true and complete
    ☑ I authorize SBA and lender to verify information
    ☑ I understand that false statements may result in criminal prosecution
    ☑ I agree to comply with all SBA requirements
    ☑ I certify that the business meets SBA size standards
    ☑ I certify that the business is not engaged in prohibited activities

35. Special Considerations:
    ☐ Veteran-owned business
    ☐ Women-owned business  
    ☐ Minority-owned business
    ☐ HUBZone business
    ☐ Located in low-income area
    ☑ None of the above

SECTION K - SIGNATURES

Borrower Signature: [SIGNED] John Smith
Print Name: John Smith
Title: Managing Member/CEO
Date: January 15, 2025

Preparer Information (if applicable):
Prepared by: Smith & Associates CPA
Preparer Name: Robert Smith, CPA
License Number: CA-12345
Date: January 15, 2025
Signature: [SIGNED] Robert Smith, CPA

ATTACHMENTS REQUIRED:
☑ Personal Financial Statement (SBA Form 413)
☑ Business Financial Statements (3 years)
☑ Personal Tax Returns (3 years)
☑ Business Tax Returns (3 years)
☑ Business Plan
☑ Use of Funds Statement
☑ Articles of Incorporation
☑ Operating Agreement
☑ Business License
☑ Lease Agreement
☑ Purchase Agreements (if applicable)

FOR SBA USE ONLY:
Application Number: ________________
Date Received: ___________________
Loan Officer: ____________________
Initial Review Date: ______________`;

  // Debt Schedule (SBA Form 2202)
  const validDebtSchedule = `SBA FORM 2202 - SCHEDULE OF LIABILITIES
U.S. Small Business Administration

APPLICANT INFORMATION:
Business Name: Tech Solutions LLC
EIN: 12-3456789
Application Date: January 15, 2025
Loan Amount Requested: $250,000

SECTION A - BUSINESS LIABILITIES

1. BANK LOANS AND LINES OF CREDIT:

Creditor: Wells Fargo Bank
Original Date: June 15, 2022
Original Amount: $120,000
Current Balance: $85,000
Monthly Payment: $2,100
Interest Rate: 6.5%
Maturity Date: June 15, 2027
Collateral: Business equipment
Purpose: Equipment financing
Current Status: Current

Creditor: Business Credit Line - Wells Fargo
Original Date: January 10, 2024
Credit Limit: $50,000
Current Balance: $15,000
Monthly Payment: $500 (minimum)
Interest Rate: 8.25%
Maturity Date: Revolving
Collateral: Accounts receivable
Purpose: Working capital
Current Status: Current

2. TRADE CREDITORS:

Creditor: Office Supply Company
Current Balance: $3,500
Terms: Net 30
Status: Current

Creditor: Software Licensing Corp
Current Balance: $8,200
Terms: Net 30
Status: Current

Creditor: Equipment Leasing Inc
Monthly Payment: $1,200
Remaining Term: 18 months
Total Remaining: $21,600
Status: Current

3. OTHER BUSINESS LIABILITIES:

Creditor: California State Tax Board
Balance: $2,800
Type: Sales tax liability
Status: Current

Creditor: Payroll Tax Liability
Balance: $4,500
Type: Federal payroll taxes
Status: Current

TOTAL BUSINESS LIABILITIES: $140,600

SECTION B - PERSONAL LIABILITIES (Principal Owners)

JOHN SMITH (100% Owner):

1. REAL ESTATE MORTGAGES:

Primary Residence:
Lender: Bank of America
Original Amount: $600,000
Current Balance: $425,000
Monthly Payment: $3,200
Interest Rate: 4.25%
Property Value: $950,000
Property Address: 123 Main Street, San Francisco, CA 94102

Investment Property:
Lender: Chase Bank
Original Amount: $300,000
Current Balance: $200,000
Monthly Payment: $1,800
Interest Rate: 5.0%
Property Value: $450,000
Property Address: 789 Oak Avenue, San Francisco, CA 94110

2. AUTOMOBILE LOANS:

Vehicle: 2022 Tesla Model S
Lender: Tesla Financial
Original Amount: $85,000
Current Balance: $28,000
Monthly Payment: $1,200
Interest Rate: 2.49%

3. CREDIT CARDS:

Chase Sapphire Reserve:
Credit Limit: $25,000
Current Balance: $5,200
Minimum Payment: $150
Interest Rate: 18.99%

American Express Gold:
Credit Limit: $15,000
Current Balance: $2,800
Minimum Payment: $85
Interest Rate: 16.99%

4. OTHER PERSONAL LIABILITIES:

Student Loan:
Lender: Federal Student Aid
Current Balance: $12,000
Monthly Payment: $180
Interest Rate: 4.5%

TOTAL PERSONAL LIABILITIES: $673,000

SECTION C - CONTINGENT LIABILITIES

1. Personal Guarantees Given:
   None

2. Pending Lawsuits:
   None

3. Tax Disputes:
   None

4. Other Contingent Liabilities:
   None

SECTION D - SUMMARY

Total Business Liabilities: $140,600
Total Personal Liabilities: $673,000
Combined Total Liabilities: $813,600

Business Net Worth: $268,000
Personal Net Worth: $1,467,000
Combined Net Worth: $1,735,000

Debt-to-Worth Ratio: 0.47
Current Ratio: 4.82
Quick Ratio: 3.85

SECTION E - DEBT SERVICE ANALYSIS

Current Monthly Business Debt Service: $3,800
Proposed SBA Loan Payment: $5,023
Total Projected Business Debt Service: $8,823

Current Monthly Personal Debt Service: $6,615
Total Combined Monthly Debt Service: $15,438

Projected Monthly Business Cash Flow: $15,417
Business Debt Service Coverage: 1.75x

Combined Personal Income: $29,000
Combined Debt Service Coverage: 1.88x

SECTION F - CERTIFICATIONS

I certify that the information contained in this Schedule of Liabilities is true and 
complete to the best of my knowledge. I understand that any false statements may 
result in denial of the loan application and possible criminal prosecution.

I authorize the SBA and the lender to verify any information contained herein and 
to obtain credit reports as necessary to process this application.

Signature: [SIGNED] John Smith
Print Name: John Smith
Title: Managing Member/CEO
Date: January 15, 2025

Spouse Signature (if applicable): [SIGNED] Jane Smith
Print Name: Jane Smith
Date: January 15, 2025

PREPARER CERTIFICATION:
This schedule was prepared by:
Name: Robert Smith, CPA
License: CA-12345
Firm: Smith & Associates CPA
Date: January 15, 2025
Signature: [SIGNED] Robert Smith, CPA`;

  // Create all valid PDFs
  createPDF(validBusinessLicense, 'business_license_current.pdf', 'AllValid/business');
  createPDF(validArticlesOfIncorporation, 'articles_of_incorporation.pdf', 'AllValid/business');
  createPDF(validOperatingAgreement, 'operating_agreement.pdf', 'AllValid/business');
  createPDF(validBusinessRegistration, 'business_registration_certificate.pdf', 'AllValid/business');
  createPDF(validGoodStanding, 'good_standing_certificate.pdf', 'AllValid/business');

  // Financial documents
  createPDF(generateBusinessTaxReturn(2022), 'business_tax_return_2022_signed.pdf', 'AllValid/financial');
  createPDF(generateBusinessTaxReturn(2023), 'business_tax_return_2023_signed.pdf', 'AllValid/financial');
  createPDF(generateBusinessTaxReturn(2024), 'business_tax_return_2024_signed.pdf', 'AllValid/financial');
  createPDF(generateFinancialStatements(2022), 'financial_statements_2022.pdf', 'AllValid/financial');
  createPDF(generateFinancialStatements(2023), 'financial_statements_2023.pdf', 'AllValid/financial');
  createPDF(generateFinancialStatements(2024), 'financial_statements_2024.pdf', 'AllValid/financial');

  // Personal documents
  createPDF(generatePersonalTaxReturn(2022), 'personal_tax_return_2022_signed.pdf', 'AllValid/personal');
  createPDF(generatePersonalTaxReturn(2023), 'personal_tax_return_2023_signed.pdf', 'AllValid/personal');
  createPDF(generatePersonalTaxReturn(2024), 'personal_tax_return_2024_signed.pdf', 'AllValid/personal');
  createPDF(validPersonalFinancialStatement, 'personal_financial_statement_sba_form_413_current.pdf', 'AllValid/personal');

  // Loan documents
  createPDF(validBusinessPlan, 'comprehensive_business_plan.pdf', 'AllValid/loan');
  createPDF(validUseOfFunds, 'use_of_funds_statement.pdf', 'AllValid/loan');
  createPDF(validSBAForm1919, 'sba_loan_application_form_1919.pdf', 'AllValid/loan');
  createPDF(validDebtSchedule, 'debt_schedule_sba_form_2202.pdf', 'AllValid/loan');
};

// Generate invalid documents
const generateInvalidDocuments = () => {
  console.log('📄 Generating Invalid PDF documents...');
  
  // BUSINESS DOCUMENTS - INVALID
  
  const invalidBusinessLicense = `BUSINESS LICENSE
License Number: BL-2020-98765
Business Name: Old Tech LLC
License Type: General Business License
Issue Date: January 15, 2020
Expiration Date: January 15, 2022  *** EXPIRED ***
Issuing Authority: City of San Francisco Business Registration
Status: EXPIRED

*** THIS LICENSE HAS EXPIRED ***
*** RENEWAL REQUIRED ***

// MISSING SIGNATURE - INVALID PER SBA REQUIREMENTS
// EXPIRED LICENSE - DOES NOT MEET SBA CURRENCY REQUIREMENTS`;

  const invalidArticlesOfIncorporation = `ARTICLES OF INCORPORATION
State of California

Business Name: Incomplete Corp
Entity Type: Corporation
Filing Date: [MISSING]
State Filing Number: [MISSING]
Registered Agent: [MISSING]

*** INCOMPLETE DOCUMENT ***
*** MISSING CRITICAL INFORMATION ***
*** NO STATE CERTIFICATION STAMP ***

// INCOMPLETE - MISSING REQUIRED FIELDS
// NO OFFICIAL STATE FILING INFORMATION
// DOES NOT MEET SBA DOCUMENTATION REQUIREMENTS`;

  // FINANCIAL DOCUMENTS - INVALID
  
  const invalidTaxReturns = `U.S. CORPORATION INCOME TAX RETURN
Form 1120 - 2023
Incomplete Corp
EIN: 12-3456789

INCOME:
Total Income: $300,000
// INCOMPLETE FINANCIAL DATA
// MISSING DETAILED BREAKDOWN

SIGNATURE SECTION:
Prepared by: [UNSIGNED]
Date: [MISSING]

*** MISSING SIGNATURE - INVALID PER SBA REQUIREMENTS ***
*** INCOMPLETE TAX RETURN ***
*** DOES NOT MEET SBA DOCUMENTATION STANDARDS ***`;

  const invalidFinancialStatements = `FINANCIAL STATEMENTS
Old Business LLC
For Year Ended December 31, 2021  *** TOO OLD - OVER 12 MONTHS ***

BALANCE SHEET
ASSETS:
Current Assets: [INCOMPLETE]
// MISSING DETAILED BREAKDOWN

LIABILITIES:
[INCOMPLETE DATA]

*** OUTDATED - INVALID PER SBA CURRENCY REQUIREMENTS ***
*** NO CPA PREPARATION ***
*** INSUFFICIENT DETAIL FOR SBA EVALUATION ***`;

  // PERSONAL DOCUMENTS - INVALID
  
  const invalidPersonalFinancialStatement = `SBA FORM 413 - PERSONAL FINANCIAL STATEMENT
Date: June 15, 2024  *** OVER 90 DAYS OLD - INVALID ***

PERSONAL INFORMATION:
Name: John Doe
Address: [INCOMPLETE]

ASSETS:
Cash: $10,000
// INCOMPLETE ASSET LISTING

LIABILITIES:
// MISSING LIABILITY INFORMATION

*** MISSING SIGNATURE - INVALID ***
*** TOO OLD - EXCEEDS 90-DAY SBA REQUIREMENT ***
*** INCOMPLETE FINANCIAL INFORMATION ***`;

  const invalidPersonalTaxReturns = `U.S. INDIVIDUAL INCOME TAX RETURN
Form 1040 - 2020  *** TOO OLD - OVER 3 YEARS ***
John Doe

INCOME:
Wages: $50,000
// INCOMPLETE INCOME INFORMATION

*** MISSING SIGNATURE SECTION - INVALID ***
*** INCOMPLETE TAX RETURN ***
*** EXCEEDS 3-YEAR SBA REQUIREMENT ***`;

  // LOAN DOCUMENTS - INVALID
  
  const invalidBusinessPlan = `BASIC BUSINESS PLAN
Simple Business LLC

EXECUTIVE SUMMARY:
We want to start a business.

BUSINESS DESCRIPTION:
General business activities.

*** MISSING CRITICAL SECTIONS ***
*** NO MANAGEMENT TEAM INFORMATION ***
*** NO FINANCIAL PROJECTIONS (CRITICAL SBA REQUIREMENT) ***
*** NO USE OF FUNDS STATEMENT ***
*** NO REPAYMENT ANALYSIS ***
*** INSUFFICIENT DETAIL FOR SBA REQUIREMENTS ***

// DOES NOT MEET SBA SOP 50 10 8 BUSINESS PLAN STANDARDS
// LACKS REQUIRED SECTIONS PER SBA GUIDELINES`;

  const invalidUseOfFunds = `USE OF FUNDS
Loan Amount: $100,000

General business purposes: $100,000

*** VAGUE AND INSUFFICIENT DETAIL ***
*** MISSING SPECIFIC BREAKDOWN ***
*** NO PERCENTAGES OR CATEGORIES ***
*** DOES NOT MEET SBA REQUIREMENTS FOR DETAILED USE OF FUNDS ***

// FAILS SBA SOP 50 10 8 USE OF FUNDS REQUIREMENTS
// LACKS REQUIRED DETAIL AND JUSTIFICATION`;

  // Create all invalid PDFs
  createPDF(invalidBusinessLicense, 'business_license_expired.pdf', 'Invalid/business');
  createPDF(invalidArticlesOfIncorporation, 'incomplete_articles.pdf', 'Invalid/business');
  
  createPDF(invalidTaxReturns, 'unsigned_tax_returns.pdf', 'Invalid/financial');
  createPDF(invalidFinancialStatements, 'outdated_financial_statements.pdf', 'Invalid/financial');
  
  createPDF(invalidPersonalFinancialStatement, 'old_personal_financial_statement.pdf', 'Invalid/personal');
  createPDF(invalidPersonalTaxReturns, 'incomplete_personal_returns.pdf', 'Invalid/personal');
  
  createPDF(invalidBusinessPlan, 'basic_business_plan.pdf', 'Invalid/loan');
  createPDF(invalidUseOfFunds, 'vague_use_of_funds.pdf', 'Invalid/loan');
};

// Main execution
console.log('🚀 Starting PDF dataset generation...');
createDirectories();
generateValidDocuments();
generateInvalidDocuments();
console.log('✅ PDF dataset generation complete!');
console.log('📁 AllValid/ - Contains comprehensive SBA-compliant PDF documents');
console.log('📁 Invalid/ - Contains non-compliant PDF documents');
console.log('🎯 Ready for validation testing!');