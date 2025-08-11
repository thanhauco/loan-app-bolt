export interface TestDocument {
  filename: string;
  content: string;
  category: string;
  expectedStatus: 'valid' | 'invalid';
  description: string;
}

export class SBATestDocumentGenerator {
  static generateBusinessLicense(isValid: boolean = true): TestDocument {
    const currentDate = new Date();
    const expirationDate = new Date();
    expirationDate.setFullYear(currentDate.getFullYear() + (isValid ? 1 : -1));
    
    const content = `
STATE OF CALIFORNIA
DEPARTMENT OF CONSUMER AFFAIRS
BUSINESS LICENSE

License Number: BL-2024-789456
Business Name: Thanh's Business Solutions LLC
Business Address: 123 Main Street, San Francisco, CA 94102
License Type: General Business License

Issue Date: ${currentDate.toLocaleDateString()}
Expiration Date: ${expirationDate.toLocaleDateString()}

This license authorizes the above named business to operate within the jurisdiction
of the State of California, subject to all applicable laws and regulations.

Authorized by: California Department of Consumer Affairs
License Status: ${isValid ? 'ACTIVE' : 'EXPIRED'}

${isValid ? 'This license is valid and in good standing.' : 'This license has expired and requires renewal.'}
    `.trim();

    return {
      filename: `business_license_${isValid ? 'valid' : 'expired'}.txt`,
      content,
      category: 'business',
      expectedStatus: isValid ? 'valid' : 'invalid',
      description: `${isValid ? 'Valid' : 'Expired'} business license`
    };
  }

  static generateTaxReturn(year: number, isSigned: boolean = true): TestDocument {
    const content = `
U.S. INDIVIDUAL INCOME TAX RETURN
FORM 1040
Tax Year ${year}

Name: Thanh Nguyen
Social Security Number: XXX-XX-1234
Filing Status: Single

INCOME
Wages, salaries, tips: $85,000
Interest income: $1,250
Business income (Schedule C): $45,000
Total Income: $131,250

ADJUSTED GROSS INCOME: $131,250

DEDUCTIONS
Standard deduction: $13,850
Total deductions: $13,850

TAXABLE INCOME: $117,400

TAX COMPUTATION
Tax on taxable income: $21,678
Total tax: $21,678

PAYMENTS
Federal income tax withheld: $18,500
Estimated tax payments: $4,000
Total payments: $22,500

REFUND: $822

${isSigned ? 'TAXPAYER SIGNATURE: Thanh Nguyen' : 'UNSIGNED'}
${isSigned ? `DATE SIGNED: ${new Date(year + 1, 3, 15).toLocaleDateString()}` : ''}

This return has been prepared in accordance with the Internal Revenue Code.
    `.trim();

    return {
      filename: `tax_return_${year}_${isSigned ? 'signed' : 'unsigned'}.txt`,
      content,
      category: 'personal',
      expectedStatus: isSigned && year >= new Date().getFullYear() - 3 ? 'valid' : 'invalid',
      description: `${year} tax return - ${isSigned ? 'signed' : 'unsigned'}`
    };
  }

  static generateFinancialStatement(isRecent: boolean = true): TestDocument {
    const statementDate = new Date();
    if (!isRecent) {
      statementDate.setFullYear(statementDate.getFullYear() - 2);
    }

    const content = `
THANH'S BUSINESS SOLUTIONS LLC
BALANCE SHEET
As of ${statementDate.toLocaleDateString()}

ASSETS
Current Assets:
  Cash and cash equivalents         $45,000
  Accounts receivable              $28,500
  Inventory                        $15,000
  Prepaid expenses                  $3,200
  Total Current Assets             $91,700

Fixed Assets:
  Equipment (net)                  $35,000
  Furniture and fixtures (net)      $8,500
  Total Fixed Assets               $43,500

TOTAL ASSETS                      $135,200

LIABILITIES AND EQUITY
Current Liabilities:
  Accounts payable                 $12,300
  Accrued expenses                  $4,800
  Current portion of long-term debt $6,000
  Total Current Liabilities        $23,100

Long-term Liabilities:
  Long-term debt                   $25,000
  Total Long-term Liabilities      $25,000

Total Liabilities                  $48,100

Owner's Equity:
  Retained earnings                $87,100
  Total Owner's Equity             $87,100

TOTAL LIABILITIES AND EQUITY      $135,200

PROFIT AND LOSS STATEMENT
For the Year Ended ${statementDate.toLocaleDateString()}

Revenue:
  Service revenue                 $285,000
  Product sales                    $45,000
  Total Revenue                   $330,000

Expenses:
  Cost of goods sold               $85,000
  Salaries and wages              $125,000
  Rent                             $24,000
  Utilities                         $6,000
  Insurance                         $8,500
  Professional fees                 $4,200
  Other operating expenses         $15,300
  Total Expenses                  $268,000

Net Income                         $62,000

${isRecent ? 'Prepared by: Johnson & Associates CPA' : 'Self-prepared'}
${isRecent ? 'Date: ' + new Date().toLocaleDateString() : ''}
    `.trim();

    return {
      filename: `financial_statement_${isRecent ? 'current' : 'old'}.txt`,
      content,
      category: 'financial',
      expectedStatus: isRecent ? 'valid' : 'invalid',
      description: `Financial statement - ${isRecent ? 'current' : 'outdated'}`
    };
  }

  static generatePersonalFinancialStatement(isCurrent: boolean = true): TestDocument {
    const statementDate = new Date();
    if (!isCurrent) {
      statementDate.setMonth(statementDate.getMonth() - 4); // 4 months old
    }

    const content = `
SBA FORM 413
PERSONAL FINANCIAL STATEMENT

Name: Thanh Nguyen
Social Security Number: XXX-XX-1234
Date of Birth: 01/15/1985
Address: 123 Main Street, San Francisco, CA 94102

ASSETS
Cash on hand and in banks           $25,000
Savings accounts                    $45,000
IRA or other retirement accounts    $85,000
Accounts and notes receivable       $12,000
Life insurance (cash surrender)     $15,000
Stocks and bonds                    $65,000
Real estate owned (market value)   $450,000
Automobile (present value)          $25,000
Other personal property             $35,000
Other assets                        $8,000

TOTAL ASSETS                       $765,000

LIABILITIES
Accounts payable                     $3,500
Notes payable to banks              $15,000
Notes payable to others             $8,000
Installment accounts (auto)         $18,000
Installment accounts (other)         $5,500
Loan on life insurance              $2,000
Mortgages on real estate           $285,000
Other liabilities                    $4,000

TOTAL LIABILITIES                  $341,000

NET WORTH                          $424,000

ANNUAL INCOME
Salary                             $85,000
Business income                    $45,000
Real estate income                 $12,000
Other income                        $3,000

TOTAL ANNUAL INCOME               $145,000

ANNUAL EXPENDITURES
Living expenses                    $65,000
Insurance premiums                  $8,500
Tax payments                       $28,000
Other payments                     $12,000

TOTAL ANNUAL EXPENDITURES         $113,500

${isCurrent ? 'SIGNATURE: Thanh Nguyen' : 'UNSIGNED'}
${isCurrent ? `DATE: ${statementDate.toLocaleDateString()}` : ''}

I certify that the information provided is true and complete to the best of my knowledge.
    `.trim();

    return {
      filename: `personal_financial_statement_${isCurrent ? 'current' : 'old'}.txt`,
      content,
      category: 'personal',
      expectedStatus: isCurrent ? 'valid' : 'invalid',
      description: `Personal financial statement - ${isCurrent ? 'current' : 'outdated'}`
    };
  }

  static generateBusinessPlan(isComprehensive: boolean = true): TestDocument {
    const content = `
BUSINESS PLAN
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
- Industry: Technology Consulting Services
- Location: San Francisco, California
- Founded: 2021
- Employees: 8 full-time, 3 part-time

Services Offered:
1. IT Consulting and Support
2. Custom Software Development
3. Digital Marketing Solutions
4. Cloud Migration Services
5. Cybersecurity Assessment and Implementation

${isComprehensive ? `
MARKET ANALYSIS
Industry Overview:
The technology consulting industry has experienced significant growth, particularly in the 
small business segment. Market size is estimated at $450 billion globally, with 8% annual 
growth projected through 2028.

Target Market:
- Small businesses (10-100 employees)
- Professional services firms
- Retail and e-commerce businesses
- Healthcare practices
- Manufacturing companies

Competitive Analysis:
Our main competitors include large consulting firms like Accenture and Deloitte, as well as 
local IT service providers. Our competitive advantage lies in personalized service, 
industry-specific expertise, and cost-effective solutions.

ORGANIZATION AND MANAGEMENT
Management Team:
- Thanh Nguyen, CEO/Founder: 15 years experience in technology consulting
- Sarah Johnson, CTO: 12 years software development experience
- Michael Chen, VP Sales: 10 years business development experience

Organizational Structure:
The company operates with three main departments: Consulting Services, Software Development, 
and Sales & Marketing.

FINANCIAL PROJECTIONS
Three-Year Revenue Projections:
Year 1: $850,000
Year 2: $1,200,000
Year 3: $1,650,000

Expense Projections:
Year 1: $680,000 (Salaries: $450,000, Operations: $230,000)
Year 2: $920,000 (Salaries: $620,000, Operations: $300,000)
Year 3: $1,180,000 (Salaries: $800,000, Operations: $380,000)

Net Income Projections:
Year 1: $170,000
Year 2: $280,000
Year 3: $470,000

USE OF LOAN PROCEEDS
Total Loan Request: $250,000

Breakdown:
- Working Capital: $100,000 (40%)
- Equipment and Technology: $75,000 (30%)
- Marketing and Business Development: $35,000 (14%)
- Office Expansion: $25,000 (10%)
- Professional Services: $15,000 (6%)

The loan will enable us to expand our service offerings, hire additional skilled professionals, 
and invest in cutting-edge technology to better serve our clients.

RISK ANALYSIS
Key risks include economic downturns affecting small business spending, increased competition, 
and technology changes. We mitigate these through diversified service offerings, strong client 
relationships, and continuous technology investment.
` : `
MARKET ANALYSIS
Basic market overview provided.

FINANCIAL PROJECTIONS
Limited financial data available.

USE OF FUNDS
General business purposes.
`}

This business plan demonstrates our commitment to growth and our ability to successfully 
utilize SBA loan funding to achieve our expansion goals.
    `.trim();

    return {
      filename: `business_plan_${isComprehensive ? 'comprehensive' : 'basic'}.txt`,
      content,
      category: 'loan',
      expectedStatus: isComprehensive ? 'valid' : 'invalid',
      description: `Business plan - ${isComprehensive ? 'comprehensive' : 'incomplete'}`
    };
  }

  static generateUseOfFunds(hasBreakdown: boolean = true): TestDocument {
    const content = `
USE OF FUNDS STATEMENT
THANH'S BUSINESS SOLUTIONS LLC

Total Loan Amount Requested: $250,000

${hasBreakdown ? `
DETAILED BREAKDOWN:

1. WORKING CAPITAL: $100,000 (40%)
   - Accounts receivable financing: $60,000
   - Inventory and supplies: $25,000
   - Operating cash flow: $15,000

2. EQUIPMENT AND TECHNOLOGY: $75,000 (30%)
   - Computer hardware and servers: $45,000
   - Software licenses and development tools: $20,000
   - Office equipment and furniture: $10,000

3. MARKETING AND BUSINESS DEVELOPMENT: $35,000 (14%)
   - Digital marketing campaigns: $20,000
   - Trade show participation: $10,000
   - Sales materials and branding: $5,000

4. OFFICE EXPANSION: $25,000 (10%)
   - Lease deposits and improvements: $15,000
   - Additional workspace setup: $10,000

5. PROFESSIONAL SERVICES: $15,000 (6%)
   - Legal and accounting fees: $8,000
   - Consulting and advisory services: $7,000

TOTAL: $250,000 (100%)

JUSTIFICATION:
This funding will enable our company to expand operations, serve more clients, and increase 
revenue by approximately 40% within the first year. The working capital component will 
support our growth in accounts receivable as we take on larger projects with longer payment 
terms.

The equipment investment will modernize our technology infrastructure, improving efficiency 
and enabling us to offer new services to our clients.

EXPECTED OUTCOMES:
- Increase annual revenue from $850,000 to $1,200,000
- Add 5 new full-time employees
- Expand service offerings to include cloud migration services
- Improve operational efficiency by 25%
` : `
GENERAL USE OF FUNDS:
The loan will be used for general business purposes including working capital, equipment, 
and business expansion.

Working capital needs
Equipment purchases
Business development
`}

This use of funds statement demonstrates how the SBA loan will be utilized to grow our 
business and create jobs in our community.

Prepared by: Thanh Nguyen, CEO
Date: ${new Date().toLocaleDateString()}
    `.trim();

    return {
      filename: `use_of_funds_${hasBreakdown ? 'detailed' : 'general'}.txt`,
      content,
      category: 'loan',
      expectedStatus: hasBreakdown ? 'valid' : 'invalid',
      description: `Use of funds - ${hasBreakdown ? 'detailed breakdown' : 'general statement'}`
    };
  }

  static generateArticlesOfIncorporation(isComplete: boolean = true): TestDocument {
    const content = `
STATE OF CALIFORNIA
SECRETARY OF STATE

ARTICLES OF ORGANIZATION
LIMITED LIABILITY COMPANY

${isComplete ? `
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
` : `
ARTICLES OF ORGANIZATION
LIMITED LIABILITY COMPANY

Company Name: Thanh's Business Solutions LLC
State: California
Filing Date: [INCOMPLETE]

Basic information provided but missing required details and signatures.
`}
    `.trim();

    return {
      filename: `articles_of_incorporation_${isComplete ? 'complete' : 'incomplete'}.txt`,
      content,
      category: 'business',
      expectedStatus: isComplete ? 'valid' : 'invalid',
      description: `Articles of incorporation - ${isComplete ? 'complete' : 'incomplete'}`
    };
  }

  static generateAllTestDocuments(): TestDocument[] {
    return [
      // Business Documents
      this.generateBusinessLicense(true),
      this.generateBusinessLicense(false),
      this.generateArticlesOfIncorporation(true),
      this.generateArticlesOfIncorporation(false),
      
      // Financial Documents
      this.generateFinancialStatement(true),
      this.generateFinancialStatement(false),
      this.generateTaxReturn(2023, true),
      this.generateTaxReturn(2022, true),
      this.generateTaxReturn(2019, false), // Too old and unsigned
      
      // Personal Documents
      this.generatePersonalFinancialStatement(true),
      this.generatePersonalFinancialStatement(false),
      
      // Loan Documents
      this.generateBusinessPlan(true),
      this.generateBusinessPlan(false),
      this.generateUseOfFunds(true),
      this.generateUseOfFunds(false)
    ];
  }
}