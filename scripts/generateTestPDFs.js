#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

// Ensure output directory exists
const outputDir = path.join(__dirname, '..', 'test-pdfs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

class SBAPDFGenerator {
  constructor() {
    this.currentDate = new Date();
    this.businessName = "Thanh's Business Solutions LLC";
    this.ownerName = "Thanh Nguyen";
    this.businessAddress = "123 Main Street, San Francisco, CA 94102";
  }

  generateBusinessLicense(isValid = true) {
    const doc = new jsPDF();
    const expirationDate = new Date();
    expirationDate.setFullYear(this.currentDate.getFullYear() + (isValid ? 1 : -1));
    
    // Header
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('STATE OF CALIFORNIA', 105, 20, { align: 'center' });
    doc.text('DEPARTMENT OF CONSUMER AFFAIRS', 105, 30, { align: 'center' });
    doc.text('BUSINESS LICENSE', 105, 40, { align: 'center' });
    
    // License details
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('License Number: BL-2024-789456', 20, 60);
    doc.text(`Business Name: ${this.businessName}`, 20, 75);
    doc.text(`Business Address: ${this.businessAddress}`, 20, 90);
    doc.text('License Type: General Business License', 20, 105);
    
    doc.text(`Issue Date: ${this.currentDate.toLocaleDateString()}`, 20, 125);
    doc.text(`Expiration Date: ${expirationDate.toLocaleDateString()}`, 20, 140);
    
    doc.text('This license authorizes the above named business to operate within', 20, 160);
    doc.text('the jurisdiction of the State of California, subject to all applicable', 20, 175);
    doc.text('laws and regulations.', 20, 190);
    
    doc.text('Authorized by: California Department of Consumer Affairs', 20, 210);
    doc.text(`License Status: ${isValid ? 'ACTIVE' : 'EXPIRED'}`, 20, 225);
    
    if (isValid) {
      doc.text('This license is valid and in good standing.', 20, 245);
    } else {
      doc.text('This license has expired and requires renewal.', 20, 245);
    }
    
    const filename = `business_license_${isValid ? 'valid' : 'expired'}.pdf`;
    doc.save(path.join(outputDir, filename));
    console.log(`✓ Generated: ${filename}`);
  }

  generateTaxReturn(year = 2023, isSigned = true) {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('U.S. INDIVIDUAL INCOME TAX RETURN', 105, 20, { align: 'center' });
    doc.text('FORM 1040', 105, 30, { align: 'center' });
    doc.text(`Tax Year ${year}`, 105, 40, { align: 'center' });
    
    // Personal info
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Name: ${this.ownerName}`, 20, 60);
    doc.text('Social Security Number: XXX-XX-1234', 20, 70);
    doc.text('Filing Status: Single', 20, 80);
    
    // Income section
    doc.setFont(undefined, 'bold');
    doc.text('INCOME', 20, 100);
    doc.setFont(undefined, 'normal');
    doc.text('Wages, salaries, tips: $85,000', 30, 115);
    doc.text('Interest income: $1,250', 30, 125);
    doc.text('Business income (Schedule C): $45,000', 30, 135);
    doc.text('Total Income: $131,250', 30, 145);
    
    // AGI
    doc.setFont(undefined, 'bold');
    doc.text('ADJUSTED GROSS INCOME: $131,250', 20, 165);
    
    // Deductions
    doc.setFont(undefined, 'bold');
    doc.text('DEDUCTIONS', 20, 185);
    doc.setFont(undefined, 'normal');
    doc.text('Standard deduction: $13,850', 30, 200);
    doc.text('Total deductions: $13,850', 30, 210);
    
    // Tax
    doc.setFont(undefined, 'bold');
    doc.text('TAXABLE INCOME: $117,400', 20, 230);
    doc.text('TAX COMPUTATION', 20, 250);
    doc.setFont(undefined, 'normal');
    doc.text('Tax on taxable income: $21,678', 30, 265);
    doc.text('Total tax: $21,678', 30, 275);
    
    // Signature section
    if (isSigned) {
      doc.text(`TAXPAYER SIGNATURE: ${this.ownerName}`, 20, 295);
      doc.text(`DATE SIGNED: ${new Date(year + 1, 3, 15).toLocaleDateString()}`, 120, 295);
    } else {
      doc.text('TAXPAYER SIGNATURE: ________________', 20, 295);
      doc.text('DATE SIGNED: ________________', 120, 295);
    }
    
    const filename = `tax_return_${year}_${isSigned ? 'signed' : 'unsigned'}.pdf`;
    doc.save(path.join(outputDir, filename));
    console.log(`✓ Generated: ${filename}`);
  }

  generatePersonalFinancialStatement(isCurrent = true) {
    const doc = new jsPDF();
    const statementDate = new Date();
    if (!isCurrent) {
      statementDate.setMonth(statementDate.getMonth() - 4); // 4 months old
    }
    
    // Header
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('SBA FORM 413', 105, 20, { align: 'center' });
    doc.text('PERSONAL FINANCIAL STATEMENT', 105, 30, { align: 'center' });
    
    // Personal info
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Name: ${this.ownerName}`, 20, 50);
    doc.text('Social Security Number: XXX-XX-1234', 20, 60);
    doc.text('Date of Birth: 01/15/1985', 20, 70);
    doc.text(`Address: ${this.businessAddress}`, 20, 80);
    
    // Assets
    doc.setFont(undefined, 'bold');
    doc.text('ASSETS', 20, 100);
    doc.setFont(undefined, 'normal');
    doc.text('Cash on hand and in banks: $25,000', 30, 115);
    doc.text('Savings accounts: $45,000', 30, 125);
    doc.text('IRA or other retirement accounts: $85,000', 30, 135);
    doc.text('Stocks and bonds: $65,000', 30, 145);
    doc.text('Real estate owned (market value): $450,000', 30, 155);
    doc.text('Automobile (present value): $25,000', 30, 165);
    doc.text('Other personal property: $35,000', 30, 175);
    
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL ASSETS: $765,000', 30, 190);
    
    // Liabilities
    doc.setFont(undefined, 'bold');
    doc.text('LIABILITIES', 20, 210);
    doc.setFont(undefined, 'normal');
    doc.text('Notes payable to banks: $15,000', 30, 225);
    doc.text('Installment accounts (auto): $18,000', 30, 235);
    doc.text('Mortgages on real estate: $285,000', 30, 245);
    doc.text('Other liabilities: $23,000', 30, 255);
    
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL LIABILITIES: $341,000', 30, 270);
    doc.text('NET WORTH: $424,000', 30, 285);
    
    // Signature
    if (isCurrent) {
      doc.text(`SIGNATURE: ${this.ownerName}`, 20, 305);
      doc.text(`DATE: ${statementDate.toLocaleDateString()}`, 120, 305);
    } else {
      doc.text('SIGNATURE: ________________', 20, 305);
      doc.text('DATE: ________________', 120, 305);
    }
    
    const filename = `personal_financial_statement_${isCurrent ? 'current' : 'old'}.pdf`;
    doc.save(path.join(outputDir, filename));
    console.log(`✓ Generated: ${filename}`);
  }

  generateBusinessPlan(isComprehensive = true) {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('BUSINESS PLAN', 105, 20, { align: 'center' });
    doc.text(this.businessName.toUpperCase(), 105, 30, { align: 'center' });
    
    // Executive Summary
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('EXECUTIVE SUMMARY', 20, 50);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const execSummary = [
      `${this.businessName} is a technology consulting firm specializing`,
      'in small business digital transformation. Founded in 2021, we provide',
      'comprehensive IT solutions, software development, and digital marketing',
      'services to small and medium-sized businesses.',
      '',
      'Our mission is to empower small businesses through technology, helping',
      'them compete effectively in the digital marketplace while maintaining',
      'cost-effective operations.'
    ];
    
    let yPos = 65;
    execSummary.forEach(line => {
      doc.text(line, 20, yPos);
      yPos += 10;
    });
    
    if (isComprehensive) {
      // Business Description
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('BUSINESS DESCRIPTION', 20, yPos + 10);
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      yPos += 25;
      const businessDesc = [
        'Company Overview:',
        '- Legal Structure: Limited Liability Company (LLC)',
        '- Industry: Technology Consulting Services',
        '- Location: San Francisco, California',
        '- Founded: 2021',
        '- Employees: 8 full-time, 3 part-time',
        '',
        'Services Offered:',
        '1. IT Consulting and Support',
        '2. Custom Software Development',
        '3. Digital Marketing Solutions',
        '4. Cloud Migration Services',
        '5. Cybersecurity Assessment and Implementation'
      ];
      
      businessDesc.forEach(line => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, 20, yPos);
        yPos += 10;
      });
      
      // Financial Projections
      doc.addPage();
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('FINANCIAL PROJECTIONS', 20, 20);
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const projections = [
        'Three-Year Revenue Projections:',
        'Year 1: $850,000',
        'Year 2: $1,200,000',
        'Year 3: $1,650,000',
        '',
        'USE OF LOAN PROCEEDS',
        'Total Loan Request: $250,000',
        '',
        'Breakdown:',
        '- Working Capital: $100,000 (40%)',
        '- Equipment and Technology: $75,000 (30%)',
        '- Marketing and Business Development: $35,000 (14%)',
        '- Office Expansion: $25,000 (10%)',
        '- Professional Services: $15,000 (6%)'
      ];
      
      yPos = 35;
      projections.forEach(line => {
        doc.text(line, 20, yPos);
        yPos += 10;
      });
    } else {
      // Basic plan
      yPos += 20;
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('BUSINESS DESCRIPTION', 20, yPos);
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      yPos += 15;
      const basicContent = [
        `${this.businessName} provides technology consulting services to small businesses.`,
        'The company has been operating since 2021 with experienced management.',
        'Our target market consists of small businesses needing IT solutions.',
        '',
        'MANAGEMENT EXPERIENCE',
        `${this.ownerName} has 10 years of experience in technology consulting.`,
        'The management team has proven ability to operate and grow the business.',
        '',
        'FINANCIAL PROJECTIONS',
        'Revenue projections: Year 1 - $400,000, Year 2 - $550,000, Year 3 - $700,000',
        'Expense projections: Year 1 - $320,000, Year 2 - $420,000, Year 3 - $520,000',
        'Net income projections: Year 1 - $80,000, Year 2 - $130,000, Year 3 - $180,000',
        'Cash flow analysis demonstrates ability to repay loan obligations.',
        '',
        'USE OF FUNDS',
        'Total loan request: $150,000',
        '- Working capital: $75,000 (50%)',
        '- Equipment purchases: $45,000 (30%)', 
        '- Marketing and expansion: $30,000 (20%)',
        '',
        'REPAYMENT ABILITY',
        'Based on projected cash flow, the business can comfortably service debt.',
        'Monthly debt service coverage ratio projected at 1.5x or higher.',
        'The loan will enable growth that supports repayment capacity.'
      ];
      
      basicContent.forEach(line => {
        doc.text(line, 20, yPos);
        yPos += 10;
      });
    }
    
    const filename = `business_plan_${isComprehensive ? 'comprehensive' : 'basic'}.pdf`;
    doc.save(path.join(outputDir, filename));
    console.log(`✓ Generated: ${filename}`);
  }

  generateArticlesOfIncorporation(isComplete = true) {
    const doc = new jsPDF();
    
    if (isComplete) {
      // Header
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('STATE OF CALIFORNIA', 105, 20, { align: 'center' });
      doc.text('SECRETARY OF STATE', 105, 30, { align: 'center' });
      doc.text('ARTICLES OF ORGANIZATION', 105, 45, { align: 'center' });
      doc.text('LIMITED LIABILITY COMPANY', 105, 55, { align: 'center' });
      
      // Articles
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text('Article 1: NAME', 20, 75);
      doc.setFont(undefined, 'normal');
      doc.text('The name of the Limited Liability Company is:', 20, 90);
      doc.setFont(undefined, 'bold');
      doc.text(this.businessName.toUpperCase(), 20, 105);
      
      doc.setFont(undefined, 'bold');
      doc.text('Article 2: PURPOSE', 20, 125);
      doc.setFont(undefined, 'normal');
      doc.text('The purpose of this Limited Liability Company is to engage in any', 20, 140);
      doc.text('lawful act or activity for which a Limited Liability Company may be', 20, 150);
      doc.text('organized under the California Corporations Code.', 20, 160);
      
      doc.setFont(undefined, 'bold');
      doc.text('Article 3: AGENT FOR SERVICE OF PROCESS', 20, 180);
      doc.setFont(undefined, 'normal');
      doc.text('The name and address of the initial agent for service of process is:', 20, 195);
      doc.text(this.ownerName, 20, 210);
      doc.text(this.businessAddress, 20, 220);
      
      doc.setFont(undefined, 'bold');
      doc.text('Article 4: MANAGEMENT', 20, 240);
      doc.setFont(undefined, 'normal');
      doc.text('This Limited Liability Company will be managed by its members.', 20, 255);
      
      // Signature and filing info
      doc.text(`Signature: ${this.ownerName}`, 20, 275);
      doc.text('Date: March 15, 2021', 20, 285);
      
      doc.setFont(undefined, 'bold');
      doc.text('STATE OF CALIFORNIA FILING INFORMATION:', 20, 305);
      doc.setFont(undefined, 'normal');
      doc.text('Filing Date: March 20, 2021', 20, 315);
      doc.text('File Number: 202108954321', 20, 325);
      doc.text('Status: Active - Good Standing', 20, 335);
    } else {
      // Incomplete version
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('ARTICLES OF ORGANIZATION', 105, 20, { align: 'center' });
      doc.text('LIMITED LIABILITY COMPANY', 105, 30, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Company Name: ${this.businessName}`, 20, 60);
      doc.text('State: California', 20, 75);
      doc.text('Filing Date: [INCOMPLETE]', 20, 90);
      doc.text('Basic information provided but missing required details and signatures.', 20, 120);
    }
    
    const filename = `articles_of_incorporation_${isComplete ? 'complete' : 'incomplete'}.pdf`;
    doc.save(path.join(outputDir, filename));
    console.log(`✓ Generated: ${filename}`);
  }

  generateAllPDFs() {
    console.log('🚀 Generating SBA Test PDFs...\n');
    
    // Business Documents
    console.log('📄 Business Documents:');
    this.generateBusinessLicense(true);
    this.generateBusinessLicense(false);
    this.generateArticlesOfIncorporation(true);
    this.generateArticlesOfIncorporation(false);
    
    // Financial Documents
    console.log('\n💰 Financial Documents:');
    this.generateTaxReturn(2023, true);
    this.generateTaxReturn(2022, true);
    this.generateTaxReturn(2019, false);
    
    // Personal Documents
    console.log('\n👤 Personal Documents:');
    this.generatePersonalFinancialStatement(true);
    this.generatePersonalFinancialStatement(false);
    
    // Loan Documents
    console.log('\n📋 Loan Documents:');
    this.generateBusinessPlan(true);
    this.generateBusinessPlan(false);
    
    console.log(`\n✅ All PDFs generated successfully in: ${outputDir}`);
    console.log('\n📝 Usage:');
    console.log('1. Upload these PDFs to test the OCR and document vetting system');
    console.log('2. Valid documents should pass validation');
    console.log('3. Invalid documents should show specific SBA SOP 50 10 8 compliance issues');
  }
}

// CLI execution
if (require.main === module) {
  const generator = new SBAPDFGenerator();
  
  const args = process.argv.slice(2);
  if (args.length === 0) {
    generator.generateAllPDFs();
  } else {
    const command = args[0];
    switch (command) {
      case 'license':
        generator.generateBusinessLicense(args[1] !== 'invalid');
        break;
      case 'tax':
        generator.generateTaxReturn(parseInt(args[1]) || 2023, args[2] !== 'unsigned');
        break;
      case 'personal':
        generator.generatePersonalFinancialStatement(args[1] !== 'old');
        break;
      case 'business-plan':
        generator.generateBusinessPlan(args[1] !== 'basic');
        break;
      case 'articles':
        generator.generateArticlesOfIncorporation(args[1] !== 'incomplete');
        break;
      default:
        console.log('Usage: node scripts/generateTestPDFs.js [command] [options]');
        console.log('Commands:');
        console.log('  license [invalid]     - Generate business license');
        console.log('  tax [year] [unsigned] - Generate tax return');
        console.log('  personal [old]        - Generate personal financial statement');
        console.log('  business-plan [basic] - Generate business plan');
        console.log('  articles [incomplete] - Generate articles of incorporation');
        console.log('  (no command)          - Generate all PDFs');
    }
  }
}

module.exports = SBAPDFGenerator;