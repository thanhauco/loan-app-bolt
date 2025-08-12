#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { jsPDF } from 'jspdf';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure output directory exists
const outputDir = path.join(__dirname, '..', 'test-pdfs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

class ComprehensiveSBAPDFGenerator {
  constructor() {
    this.currentDate = new Date();
    this.businessName = "Thanh's Business Solutions LLC";
    this.ownerName = "Thanh Nguyen";
    this.businessAddress = "123 Main Street, San Francisco, CA 94102";
    this.businessPhone = "(415) 555-0123";
    this.businessEmail = "thanh@businesssolutions.com";
    this.ein = "12-3456789";
    this.ssn = "XXX-XX-1234";
  }

  // BUSINESS DOCUMENTS
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
    doc.text('NAICS Code: 541511 - Custom Computer Programming Services', 20, 120);
    
    doc.text(`Issue Date: ${this.currentDate.toLocaleDateString()}`, 20, 140);
    doc.text(`Expiration Date: ${expirationDate.toLocaleDateString()}`, 20, 155);
    
    doc.text('This license authorizes the above named business to operate within', 20, 175);
    doc.text('the jurisdiction of the State of California, subject to all applicable', 20, 190);
    doc.text('laws and regulations.', 20, 205);
    
    doc.text('Authorized by: California Department of Consumer Affairs', 20, 225);
    doc.text(`License Status: ${isValid ? 'ACTIVE' : 'EXPIRED'}`, 20, 240);
    
    if (isValid) {
      doc.text('This license is valid and in good standing.', 20, 260);
    } else {
      doc.text('This license has expired and requires renewal.', 20, 260);
    }
    
    const filename = `business_license_${isValid ? 'current' : 'expired'}.pdf`;
    doc.save(path.join(outputDir, filename));
    console.log(`✓ Generated: ${filename}`);
  }

  generateArticlesOfIncorporation() {
    const doc = new jsPDF();
    
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
    doc.text(`SIGNATURE: ${this.ownerName}`, 20, 275);
    doc.text('DATE: March 15, 2021', 20, 285);
    
    doc.addPage();
    doc.setFont(undefined, 'bold');
    doc.text('STATE OF CALIFORNIA FILING INFORMATION:', 20, 20);
    doc.setFont(undefined, 'normal');
    doc.text('Filing Date: March 20, 2021', 20, 35);
    doc.text('File Number: 202108954321', 20, 45);
    doc.text('Status: Active - Good Standing', 20, 55);
    doc.text(`EIN: ${this.ein}`, 20, 65);
    
    const filename = 'articles_of_incorporation.pdf';
    doc.save(path.join(outputDir, filename));
    console.log(`✓ Generated: ${filename}`);
  }

  generateOperatingAgreement() {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('OPERATING AGREEMENT', 105, 20, { align: 'center' });
    doc.text(this.businessName.toUpperCase(), 105, 35, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('This Operating Agreement is entered into on March 15, 2021, by and among', 20, 60);
    doc.text('the members of the above-named Limited Liability Company.', 20, 75);
    
    doc.setFont(undefined, 'bold');
    doc.text('ARTICLE I - FORMATION', 20, 100);
    doc.setFont(undefined, 'normal');
    doc.text('1.1 Formation: The Company was formed as a Limited Liability Company', 20, 115);
    doc.text('under the laws of the State of California.', 20, 125);
    
    doc.setFont(undefined, 'bold');
    doc.text('ARTICLE II - MEMBERS', 20, 150);
    doc.setFont(undefined, 'normal');
    doc.text(`2.1 Initial Member: ${this.ownerName}`, 20, 165);
    doc.text('Ownership Percentage: 100%', 20, 175);
    doc.text('Initial Capital Contribution: $50,000', 20, 185);
    
    doc.setFont(undefined, 'bold');
    doc.text('ARTICLE III - MANAGEMENT', 20, 210);
    doc.setFont(undefined, 'normal');
    doc.text('3.1 Management Structure: Member-managed', 20, 225);
    doc.text('3.2 Managing Member: ' + this.ownerName, 20, 235);
    
    doc.addPage();
    doc.setFont(undefined, 'bold');
    doc.text('ARTICLE IV - CAPITAL CONTRIBUTIONS', 20, 20);
    doc.setFont(undefined, 'normal');
    doc.text('4.1 Initial contributions have been made as specified above.', 20, 35);
    doc.text('4.2 Additional contributions may be required by unanimous consent.', 20, 45);
    
    doc.setFont(undefined, 'bold');
    doc.text('SIGNATURES', 20, 250);
    doc.setFont(undefined, 'normal');
    doc.text(`Member: ${this.ownerName}`, 20, 270);
    doc.text(`Date: March 15, 2021`, 20, 280);
    
    const filename = 'operating_agreement.pdf';
    doc.save(path.join(outputDir, filename));
    console.log(`✓ Generated: ${filename}`);
  }

  generateBusinessRegistrationCertificate() {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('CERTIFICATE OF REGISTRATION', 105, 20, { align: 'center' });
    doc.text('STATE OF CALIFORNIA', 105, 35, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('This certifies that:', 20, 70);
    doc.setFont(undefined, 'bold');
    doc.text(this.businessName, 20, 90);
    doc.setFont(undefined, 'normal');
    doc.text('is duly registered to conduct business in the State of California.', 20, 110);
    
    doc.text(`Registration Number: REG-2021-456789`, 20, 140);
    doc.text(`Entity Type: Limited Liability Company`, 20, 155);
    doc.text(`Registration Date: March 20, 2021`, 20, 170);
    doc.text(`Status: Active`, 20, 185);
    doc.text(`Jurisdiction: California`, 20, 200);
    
    doc.text('This certificate is issued under the authority of the California', 20, 230);
    doc.text('Secretary of State and is valid as of the date shown above.', 20, 245);
    
    const filename = 'business_registration_certificate.pdf';
    doc.save(path.join(outputDir, filename));
    console.log(`✓ Generated: ${filename}`);
  }

  // FINANCIAL DOCUMENTS
  generateBusinessTaxReturn(year, isSigned = true) {
    const doc = new jsPDF();
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('U.S. RETURN OF PARTNERSHIP INCOME', 105, 20, { align: 'center' });
    doc.text('FORM 1065', 105, 30, { align: 'center' });
    doc.text(`Tax Year ${year}`, 105, 40, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Business Name: ${this.businessName}`, 20, 60);
    doc.text(`EIN: ${this.ein}`, 20, 70);
    doc.text(`Address: ${this.businessAddress}`, 20, 80);
    doc.text('Business Activity: Computer Programming Services', 20, 90);
    doc.text('NAICS Code: 541511', 20, 100);
    
    // Income section
    doc.setFont(undefined, 'bold');
    doc.text('INCOME', 20, 120);
    doc.setFont(undefined, 'normal');
    const baseRevenue = 450000 + (year - 2021) * 75000;
    doc.text(`Gross receipts or sales: $${baseRevenue.toLocaleString()}`, 30, 135);
    doc.text(`Returns and allowances: $${(baseRevenue * 0.02).toLocaleString()}`, 30, 145);
    doc.text(`Net sales: $${(baseRevenue * 0.98).toLocaleString()}`, 30, 155);
    doc.text(`Cost of goods sold: $${(baseRevenue * 0.35).toLocaleString()}`, 30, 165);
    doc.text(`Gross profit: $${(baseRevenue * 0.63).toLocaleString()}`, 30, 175);
    
    // Deductions
    doc.setFont(undefined, 'bold');
    doc.text('DEDUCTIONS', 20, 195);
    doc.setFont(undefined, 'normal');
    doc.text(`Salaries and wages: $${(baseRevenue * 0.28).toLocaleString()}`, 30, 210);
    doc.text(`Rent: $${(24000).toLocaleString()}`, 30, 220);
    doc.text(`Utilities: $${(6000).toLocaleString()}`, 30, 230);
    doc.text(`Insurance: $${(8500).toLocaleString()}`, 30, 240);
    doc.text(`Professional fees: $${(12000).toLocaleString()}`, 30, 250);
    doc.text(`Other expenses: $${(baseRevenue * 0.08).toLocaleString()}`, 30, 260);
    
    const totalDeductions = baseRevenue * 0.36 + 50500;
    const netIncome = baseRevenue * 0.63 - totalDeductions;
    
    doc.addPage();
    doc.setFont(undefined, 'bold');
    doc.text(`TOTAL DEDUCTIONS: $${totalDeductions.toLocaleString()}`, 30, 20);
    doc.text(`ORDINARY BUSINESS INCOME: $${netIncome.toLocaleString()}`, 30, 35);
    
    // Schedule K-1 information
    doc.text('SCHEDULE K-1 INFORMATION', 20, 60);
    doc.setFont(undefined, 'normal');
    doc.text(`Partner: ${this.ownerName}`, 30, 75);
    doc.text(`SSN: ${this.ssn}`, 30, 85);
    doc.text(`Share of income: $${netIncome.toLocaleString()}`, 30, 95);
    doc.text(`Guaranteed payments: $85,000`, 30, 105);
    
    // Signature section
    if (isSigned) {
      doc.text(`PREPARER SIGNATURE: ${this.ownerName}`, 20, 250);
      doc.text(`DATE SIGNED: ${new Date(year + 1, 3, 15).toLocaleDateString()}`, 120, 250);
      doc.text('PREPARER: Johnson & Associates CPA', 20, 265);
    } else {
      doc.text('PREPARER SIGNATURE: ________________', 20, 250);
      doc.text('DATE SIGNED: ________________', 120, 250);
    }
    
    const filename = `business_tax_return_${year}_${isSigned ? 'signed' : 'unsigned'}.pdf`;
    doc.save(path.join(outputDir, filename));
    console.log(`✓ Generated: ${filename}`);
  }

  generateInterimFinancialStatement() {
    const doc = new jsPDF();
    const statementDate = new Date();
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(this.businessName.toUpperCase(), 105, 20, { align: 'center' });
    doc.text('INTERIM FINANCIAL STATEMENTS', 105, 30, { align: 'center' });
    doc.text(`For the Period Ended ${statementDate.toLocaleDateString()}`, 105, 40, { align: 'center' });
    
    // Balance Sheet
    doc.setFontSize(12);
    doc.text('BALANCE SHEET', 20, 60);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('ASSETS', 20, 80);
    doc.setFont(undefined, 'normal');
    doc.text('Current Assets:', 25, 95);
    doc.text('Cash and cash equivalents         $65,000', 30, 105);
    doc.text('Accounts receivable              $42,500', 30, 115);
    doc.text('Inventory                        $18,000', 30, 125);
    doc.text('Prepaid expenses                  $4,200', 30, 135);
    doc.text('Total Current Assets            $129,700', 30, 145);
    
    doc.text('Fixed Assets:', 25, 160);
    doc.text('Equipment (net)                  $45,000', 30, 170);
    doc.text('Furniture and fixtures (net)     $12,500', 30, 180);
    doc.text('Total Fixed Assets               $57,500', 30, 190);
    
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL ASSETS                    $187,200', 30, 205);
    
    doc.text('LIABILITIES AND EQUITY', 20, 225);
    doc.setFont(undefined, 'normal');
    doc.text('Current Liabilities:', 25, 240);
    doc.text('Accounts payable                 $15,300', 30, 250);
    doc.text('Accrued expenses                  $6,800', 30, 260);
    doc.text('Current portion of long-term debt $8,000', 30, 270);
    
    doc.addPage();
    doc.text('Total Current Liabilities        $30,100', 30, 20);
    doc.text('Long-term debt                   $35,000', 30, 35);
    doc.text('Total Liabilities                $65,100', 30, 50);
    
    doc.text('Owner\'s Equity:', 25, 70);
    doc.text('Retained earnings               $122,100', 30, 80);
    doc.text('Total Owner\'s Equity            $122,100', 30, 90);
    
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL LIABILITIES AND EQUITY    $187,200', 30, 105);
    
    // Income Statement
    doc.text('INCOME STATEMENT (YTD)', 20, 130);
    doc.setFont(undefined, 'normal');
    doc.text('Revenue                         $385,000', 30, 150);
    doc.text('Cost of goods sold              $135,000', 30, 160);
    doc.text('Gross profit                    $250,000', 30, 170);
    
    doc.text('Operating Expenses:', 25, 190);
    doc.text('Salaries and wages              $145,000', 30, 200);
    doc.text('Rent                             $18,000', 30, 210);
    doc.text('Utilities                         $4,500', 30, 220);
    doc.text('Insurance                         $6,400', 30, 230);
    doc.text('Other expenses                   $18,600', 30, 240);
    doc.text('Total Operating Expenses        $192,500', 30, 250);
    
    doc.setFont(undefined, 'bold');
    doc.text('NET INCOME                       $57,500', 30, 265);
    
    doc.setFont(undefined, 'normal');
    doc.text('Prepared by: Johnson & Associates CPA', 20, 285);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 120, 285);
    
    const filename = 'interim_financial_statements_ytd.pdf';
    doc.save(path.join(outputDir, filename));
    console.log(`✓ Generated: ${filename}`);
  }

  generateProfitLossStatement(year) {
    const doc = new jsPDF();
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(this.businessName.toUpperCase(), 105, 20, { align: 'center' });
    doc.text('PROFIT & LOSS STATEMENT', 105, 30, { align: 'center' });
    doc.text(`For the Year Ended December 31, ${year}`, 105, 40, { align: 'center' });
    
    const baseRevenue = 450000 + (year - 2021) * 75000;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('REVENUE', 20, 65);
    doc.setFont(undefined, 'normal');
    doc.text(`Service revenue                 $${(baseRevenue * 0.85).toLocaleString()}`, 25, 80);
    doc.text(`Product sales                   $${(baseRevenue * 0.15).toLocaleString()}`, 25, 90);
    doc.setFont(undefined, 'bold');
    doc.text(`Total Revenue                   $${baseRevenue.toLocaleString()}`, 25, 105);
    
    doc.text('COST OF GOODS SOLD', 20, 125);
    doc.setFont(undefined, 'normal');
    const cogs = baseRevenue * 0.35;
    doc.text(`Direct materials                $${(cogs * 0.4).toLocaleString()}`, 25, 140);
    doc.text(`Direct labor                    $${(cogs * 0.6).toLocaleString()}`, 25, 150);
    doc.setFont(undefined, 'bold');
    doc.text(`Total COGS                      $${cogs.toLocaleString()}`, 25, 165);
    doc.text(`GROSS PROFIT                    $${(baseRevenue - cogs).toLocaleString()}`, 25, 180);
    
    doc.text('OPERATING EXPENSES', 20, 200);
    doc.setFont(undefined, 'normal');
    const salaries = baseRevenue * 0.28;
    doc.text(`Salaries and wages              $${salaries.toLocaleString()}`, 25, 215);
    doc.text(`Rent                            $24,000`, 25, 225);
    doc.text(`Utilities                        $6,000`, 25, 235);
    doc.text(`Insurance                        $8,500`, 25, 245);
    doc.text(`Professional fees               $12,000`, 25, 255);
    doc.text(`Marketing                       $15,000`, 25, 265);
    doc.text(`Office supplies                  $3,500`, 25, 275);
    
    doc.addPage();
    doc.text(`Depreciation                    $8,000`, 25, 20);
    doc.text(`Other expenses                  $12,000`, 25, 30);
    
    const totalExpenses = salaries + 89000;
    doc.setFont(undefined, 'bold');
    doc.text(`Total Operating Expenses        $${totalExpenses.toLocaleString()}`, 25, 45);
    
    const netIncome = (baseRevenue - cogs) - totalExpenses;
    doc.text(`NET INCOME                      $${netIncome.toLocaleString()}`, 25, 65);
    
    doc.setFont(undefined, 'normal');
    doc.text('Prepared by: Johnson & Associates CPA', 20, 250);
    doc.text(`Date: ${new Date(year + 1, 1, 28).toLocaleDateString()}`, 120, 250);
    
    const filename = `profit_loss_statement_${year}.pdf`;
    doc.save(path.join(outputDir, filename));
    console.log(`✓ Generated: ${filename}`);
  }

  generateBalanceSheet(year) {
    const doc = new jsPDF();
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(this.businessName.toUpperCase(), 105, 20, { align: 'center' });
    doc.text('BALANCE SHEET', 105, 30, { align: 'center' });
    doc.text(`As of December 31, ${year}`, 105, 40, { align: 'center' });
    
    const growthFactor = 1 + (year - 2021) * 0.15;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('ASSETS', 20, 65);
    doc.setFont(undefined, 'normal');
    doc.text('Current Assets:', 25, 80);
    doc.text(`Cash and cash equivalents       $${Math.round(45000 * growthFactor).toLocaleString()}`, 30, 90);
    doc.text(`Accounts receivable            $${Math.round(28500 * growthFactor).toLocaleString()}`, 30, 100);
    doc.text(`Inventory                      $${Math.round(15000 * growthFactor).toLocaleString()}`, 30, 110);
    doc.text(`Prepaid expenses               $${Math.round(3200 * growthFactor).toLocaleString()}`, 30, 120);
    const currentAssets = Math.round(91700 * growthFactor);
    doc.text(`Total Current Assets           $${currentAssets.toLocaleString()}`, 30, 135);
    
    doc.text('Fixed Assets:', 25, 155);
    doc.text(`Equipment (net)                $${Math.round(35000 * growthFactor).toLocaleString()}`, 30, 165);
    doc.text(`Furniture and fixtures (net)   $${Math.round(8500 * growthFactor).toLocaleString()}`, 30, 175);
    const fixedAssets = Math.round(43500 * growthFactor);
    doc.text(`Total Fixed Assets             $${fixedAssets.toLocaleString()}`, 30, 190);
    
    doc.setFont(undefined, 'bold');
    const totalAssets = currentAssets + fixedAssets;
    doc.text(`TOTAL ASSETS                   $${totalAssets.toLocaleString()}`, 30, 210);
    
    doc.text('LIABILITIES AND EQUITY', 20, 235);
    doc.setFont(undefined, 'normal');
    doc.text('Current Liabilities:', 25, 250);
    doc.text(`Accounts payable               $${Math.round(12300 * growthFactor).toLocaleString()}`, 30, 260);
    doc.text(`Accrued expenses               $${Math.round(4800 * growthFactor).toLocaleString()}`, 30, 270);
    
    doc.addPage();
    doc.text(`Current portion of long-term debt $${Math.round(6000 * growthFactor).toLocaleString()}`, 30, 20);
    const currentLiabilities = Math.round(23100 * growthFactor);
    doc.text(`Total Current Liabilities      $${currentLiabilities.toLocaleString()}`, 30, 35);
    
    doc.text('Long-term Liabilities:', 25, 55);
    const longTermDebt = Math.round(25000 * growthFactor);
    doc.text(`Long-term debt                 $${longTermDebt.toLocaleString()}`, 30, 65);
    doc.text(`Total Long-term Liabilities    $${longTermDebt.toLocaleString()}`, 30, 80);
    
    const totalLiabilities = currentLiabilities + longTermDebt;
    doc.text(`Total Liabilities              $${totalLiabilities.toLocaleString()}`, 30, 100);
    
    doc.text('Owner\'s Equity:', 25, 120);
    const equity = totalAssets - totalLiabilities;
    doc.text(`Retained earnings              $${equity.toLocaleString()}`, 30, 130);
    doc.text(`Total Owner\'s Equity           $${equity.toLocaleString()}`, 30, 145);
    
    doc.setFont(undefined, 'bold');
    doc.text(`TOTAL LIABILITIES AND EQUITY   $${totalAssets.toLocaleString()}`, 30, 165);
    
    doc.setFont(undefined, 'normal');
    doc.text('Prepared by: Johnson & Associates CPA', 20, 250);
    doc.text(`Date: ${new Date(year + 1, 1, 28).toLocaleDateString()}`, 120, 250);
    
    const filename = `balance_sheet_${year}.pdf`;
    doc.save(path.join(outputDir, filename));
    console.log(`✓ Generated: ${filename}`);
  }

  generateCashFlowStatement(year) {
    const doc = new jsPDF();
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(this.businessName.toUpperCase(), 105, 20, { align: 'center' });
    doc.text('CASH FLOW STATEMENT', 105, 30, { align: 'center' });
    doc.text(`For the Year Ended December 31, ${year}`, 105, 40, { align: 'center' });
    
    const baseRevenue = 450000 + (year - 2021) * 75000;
    const netIncome = Math.round(baseRevenue * 0.12);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('CASH FLOWS FROM OPERATING ACTIVITIES', 20, 65);
    doc.setFont(undefined, 'normal');
    doc.text(`Net income                      $${netIncome.toLocaleString()}`, 25, 80);
    doc.text('Adjustments to reconcile net income:', 25, 95);
    doc.text(`Depreciation                     $8,000`, 30, 105);
    doc.text(`Increase in accounts receivable  $(5,500)`, 30, 115);
    doc.text(`Increase in inventory            $(2,000)`, 30, 125);
    doc.text(`Increase in accounts payable      $2,300`, 30, 135);
    doc.text(`Increase in accrued expenses      $1,200`, 30, 145);
    
    const operatingCashFlow = netIncome + 8000 - 5500 - 2000 + 2300 + 1200;
    doc.setFont(undefined, 'bold');
    doc.text(`Net cash from operating activities $${operatingCashFlow.toLocaleString()}`, 25, 160);
    
    doc.text('CASH FLOWS FROM INVESTING ACTIVITIES', 20, 185);
    doc.setFont(undefined, 'normal');
    doc.text(`Purchase of equipment           $(12,000)`, 25, 200);
    doc.text(`Purchase of furniture            $(3,000)`, 25, 210);
    doc.setFont(undefined, 'bold');
    doc.text(`Net cash from investing activities $(15,000)`, 25, 225);
    
    doc.text('CASH FLOWS FROM FINANCING ACTIVITIES', 20, 250);
    doc.setFont(undefined, 'normal');
    doc.text(`Proceeds from long-term debt     $10,000`, 25, 265);
    doc.text(`Repayment of long-term debt      $(8,000)`, 25, 275);
    
    doc.addPage();
    doc.text(`Owner distributions             $(25,000)`, 25, 20);
    doc.setFont(undefined, 'bold');
    doc.text(`Net cash from financing activities $(23,000)`, 25, 35);
    
    const netCashIncrease = operatingCashFlow - 15000 - 23000;
    doc.text(`NET INCREASE IN CASH             $${netCashIncrease.toLocaleString()}`, 25, 60);
    doc.text(`Cash at beginning of year        $35,000`, 25, 75);
    doc.text(`Cash at end of year              $${(35000 + netCashIncrease).toLocaleString()}`, 25, 90);
    
    doc.setFont(undefined, 'normal');
    doc.text('Prepared by: Johnson & Associates CPA', 20, 250);
    doc.text(`Date: ${new Date(year + 1, 1, 28).toLocaleDateString()}`, 120, 250);
    
    const filename = `cash_flow_statement_${year}.pdf`;
    doc.save(path.join(outputDir, filename));
    console.log(`✓ Generated: ${filename}`);
  }

  generateAccountsReceivableAging() {
    const doc = new jsPDF();
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(this.businessName.toUpperCase(), 105, 20, { align: 'center' });
    doc.text('ACCOUNTS RECEIVABLE AGING REPORT', 105, 30, { align: 'center' });
    doc.text(`As of ${new Date().toLocaleDateString()}`, 105, 40, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Customer', 20, 65);
    doc.text('Current', 80, 65);
    doc.text('31-60 Days', 110, 65);
    doc.text('61-90 Days', 140, 65);
    doc.text('Over 90', 170, 65);
    doc.text('Total', 190, 65);
    
    doc.setFont(undefined, 'normal');
    const customers = [
      ['ABC Corp', 8500, 2000, 0, 0],
      ['XYZ Inc', 12000, 0, 1500, 0],
      ['Tech Solutions', 6500, 3000, 0, 500],
      ['Global Systems', 15000, 0, 0, 0],
      ['Digital Partners', 4500, 1200, 800, 0]
    ];
    
    let yPos = 80;
    customers.forEach(([name, current, days31, days61, over90]) => {
      const total = current + days31 + days61 + over90;
      doc.text(name, 20, yPos);
      doc.text(`$${current.toLocaleString()}`, 80, yPos);
      doc.text(`$${days31.toLocaleString()}`, 110, yPos);
      doc.text(`$${days61.toLocaleString()}`, 140, yPos);
      doc.text(`$${over90.toLocaleString()}`, 170, yPos);
      doc.text(`$${total.toLocaleString()}`, 190, yPos);
      yPos += 15;
    });
    
    // Totals
    doc.setFont(undefined, 'bold');
    doc.text('TOTALS:', 20, yPos + 10);
    doc.text('$46,500', 80, yPos + 10);
    doc.text('$6,200', 110, yPos + 10);
    doc.text('$2,300', 140, yPos + 10);
    doc.text('$500', 170, yPos + 10);
    doc.text('$55,500', 190, yPos + 10);
    
    doc.setFont(undefined, 'normal');
    doc.text('Aging Summary:', 20, yPos + 40);
    doc.text('Current (0-30 days): 83.8%', 25, yPos + 55);
    doc.text('31-60 days: 11.2%', 25, yPos + 65);
    doc.text('61-90 days: 4.1%', 25, yPos + 75);
    doc.text('Over 90 days: 0.9%', 25, yPos + 85);
    
    const filename = 'accounts_receivable_aging.pdf';
    doc.save(path.join(outputDir, filename));
    console.log(`✓ Generated: ${filename}`);
  }

  // PERSONAL DOCUMENTS
  generatePersonalTaxReturn(year, isSigned = true) {
    const doc = new jsPDF();
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('U.S. INDIVIDUAL INCOME TAX RETURN', 105, 20, { align: 'center' });
    doc.text('FORM 1040', 105, 30, { align: 'center' });
    doc.text(`Tax Year ${year}`, 105, 40, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Name: ${this.ownerName}`, 20, 60);
    doc.text(`Social Security Number: ${this.ssn}`, 20, 70);
    doc.text(`Address: ${this.businessAddress}`, 20, 80);
    doc.text('Filing Status: Single', 20, 90);
    
    // Income section
    doc.setFont(undefined, 'bold');
    doc.text('INCOME', 20, 110);
    doc.setFont(undefined, 'normal');
    const wages = 85000 + (year - 2021) * 5000;
    const businessIncome = 45000 + (year - 2021) * 8000;
    const interest = 1250 + (year - 2021) * 200;
    const totalIncome = wages + businessIncome + interest;
    
    doc.text(`Wages, salaries, tips: $${wages.toLocaleString()}`, 30, 125);
    doc.text(`Interest income: $${interest.toLocaleString()}`, 30, 135);
    doc.text(`Business income (Schedule C): $${businessIncome.toLocaleString()}`, 30, 145);
    doc.text(`Total Income: $${totalIncome.toLocaleString()}`, 30, 155);
    
    // AGI
    doc.setFont(undefined, 'bold');
    doc.text(`ADJUSTED GROSS INCOME: $${totalIncome.toLocaleString()}`, 20, 175);
    
    // Deductions
    doc.setFont(undefined, 'bold');
    doc.text('DEDUCTIONS', 20, 195);
    doc.setFont(undefined, 'normal');
    const standardDeduction = year >= 2023 ? 13850 : 12950;
    doc.text(`Standard deduction: $${standardDeduction.toLocaleString()}`, 30, 210);
    doc.text(`Total deductions: $${standardDeduction.toLocaleString()}`, 30, 220);
    
    // Tax
    const taxableIncome = totalIncome - standardDeduction;
    const tax = Math.round(taxableIncome * 0.22);
    doc.setFont(undefined, 'bold');
    doc.text(`TAXABLE INCOME: $${taxableIncome.toLocaleString()}`, 20, 240);
    doc.text('TAX COMPUTATION', 20, 260);
    doc.setFont(undefined, 'normal');
    doc.text(`Tax on taxable income: $${tax.toLocaleString()}`, 30, 275);
    
    doc.addPage();
    doc.text(`Total tax: $${tax.toLocaleString()}`, 30, 20);
    
    // Payments
    doc.setFont(undefined, 'bold');
    doc.text('PAYMENTS', 20, 40);
    doc.setFont(undefined, 'normal');
    const withheld = Math.round(tax * 0.85);
    const estimated = Math.round(tax * 0.20);
    const totalPayments = withheld + estimated;
    doc.text(`Federal income tax withheld: $${withheld.toLocaleString()}`, 30, 55);
    doc.text(`Estimated tax payments: $${estimated.toLocaleString()}`, 30, 65);
    doc.text(`Total payments: $${totalPayments.toLocaleString()}`, 30, 75);
    
    const refund = totalPayments - tax;
    if (refund > 0) {
      doc.setFont(undefined, 'bold');
      doc.text(`REFUND: $${refund.toLocaleString()}`, 30, 95);
    } else {
      doc.setFont(undefined, 'bold');
      doc.text(`AMOUNT OWED: $${Math.abs(refund).toLocaleString()}`, 30, 95);
    }
    
    // Signature section
    if (isSigned) {
      doc.setFont(undefined, 'normal');
      doc.text(`TAXPAYER SIGNATURE: ${this.ownerName}`, 20, 250);
      doc.text(`DATE SIGNED: ${new Date(year + 1, 3, 15).toLocaleDateString()}`, 120, 250);
    } else {
      doc.text('TAXPAYER SIGNATURE: ________________', 20, 250);
      doc.text('DATE SIGNED: ________________', 120, 250);
    }
    
    const filename = `personal_tax_return_${year}_${isSigned ? 'signed' : 'unsigned'}.pdf`;
    doc.save(path.join(outputDir, filename));
    console.log(`✓ Generated: ${filename}`);
  }

  generatePersonalFinancialStatement(isCurrent = true) {
    const doc = new jsPDF();
    const statementDate = new Date();
    if (!isCurrent) {
      statementDate.setMonth(statementDate.getMonth() - 4);
    }
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('SBA FORM 413', 105, 20, { align: 'center' });
    doc.text('PERSONAL FINANCIAL STATEMENT', 105, 30, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Name: ${this.ownerName}`, 20, 50);
    doc.text(`Social Security Number: ${this.ssn}`, 20, 60);
    doc.text('Date of Birth: 01/15/1985', 20, 70);
    doc.text(`Address: ${this.businessAddress}`, 20, 80);
    doc.text(`Phone: ${this.businessPhone}`, 20, 90);
    
    // Assets
    doc.setFont(undefined, 'bold');
    doc.text('ASSETS', 20, 110);
    doc.setFont(undefined, 'normal');
    doc.text('Cash on hand and in banks           $25,000', 30, 125);
    doc.text('Savings accounts                    $45,000', 30, 135);
    doc.text('IRA or other retirement accounts    $85,000', 30, 145);
    doc.text('Accounts and notes receivable       $12,000', 30, 155);
    doc.text('Life insurance (cash surrender)     $15,000', 30, 165);
    doc.text('Stocks and bonds                    $65,000', 30, 175);
    doc.text('Real estate owned (market value)   $450,000', 30, 185);
    doc.text('Automobile (present value)          $25,000', 30, 195);
    doc.text('Other personal property             $35,000', 30, 205);
    doc.text('Other assets                        $8,000', 30, 215);
    
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL ASSETS                       $765,000', 30, 230);
    
    doc.addPage();
    // Liabilities
    doc.setFont(undefined, 'bold');
    doc.text('LIABILITIES', 20, 20);
    doc.setFont(undefined, 'normal');
    doc.text('Accounts payable                     $3,500', 30, 35);
    doc.text('Notes payable to banks              $15,000', 30, 45);
    doc.text('Notes payable to others             $8,000', 30, 55);
    doc.text('Installment accounts (auto)         $18,000', 30, 65);
    doc.text('Installment accounts (other)         $5,500', 30, 75);
    doc.text('Loan on life insurance              $2,000', 30, 85);
    doc.text('Mortgages on real estate           $285,000', 30, 95);
    doc.text('Other liabilities                    $4,000', 30, 105);
    
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL LIABILITIES                  $341,000', 30, 120);
    doc.text('NET WORTH                          $424,000', 30, 135);
    
    // Income and Expenses
    doc.text('ANNUAL INCOME', 20, 160);
    doc.setFont(undefined, 'normal');
    doc.text('Salary                             $85,000', 30, 175);
    doc.text('Business income                    $45,000', 30, 185);
    doc.text('Real estate income                 $12,000', 30, 195);
    doc.text('Other income                        $3,000', 30, 205);
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL ANNUAL INCOME               $145,000', 30, 220);
    
    doc.text('ANNUAL EXPENDITURES', 20, 240);
    doc.setFont(undefined, 'normal');
    doc.text('Living expenses                    $65,000', 30, 255);
    doc.text('Insurance premiums                  $8,500', 30, 265);
    doc.text('Tax payments                       $28,000', 30, 275);
    
    doc.addPage();
    doc.text('Other payments                     $12,000', 30, 20);
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL ANNUAL EXPENDITURES         $113,500', 30, 35);
    
    // Signature
    if (isCurrent) {
      doc.setFont(undefined, 'normal');
      doc.text(`SIGNATURE: ${this.ownerName}`, 20, 250);
      doc.text(`DATE: ${statementDate.toLocaleDateString()}`, 120, 250);
      doc.text('I certify that the information provided is true and complete', 20, 265);
      doc.text('to the best of my knowledge.', 20, 275);
    } else {
      doc.text('SIGNATURE: ________________', 20, 250);
      doc.text('DATE: ________________', 120, 250);
    }
    
    const filename = `personal_financial_statement_sba_form_413_${isCurrent ? 'current' : 'old'}.pdf`;
    doc.save(path.join(outputDir, filename));
    console.log(`✓ Generated: ${filename}`);
  }

  generateResume() {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(this.ownerName.toUpperCase(), 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(this.businessAddress, 105, 30, { align: 'center' });
    doc.text(`${this.businessPhone} | ${this.businessEmail}`, 105, 40, { align: 'center' });
    
    // Professional Summary
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('PROFESSIONAL SUMMARY', 20, 60);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Experienced technology executive with 15+ years in software development,', 20, 75);
    doc.text('business consulting, and team leadership. Proven track record of building', 20, 85);
    doc.text('and scaling technology companies, with expertise in SaaS solutions,', 20, 95);
    doc.text('digital transformation, and client relationship management.', 20, 105);
    
    // Experience
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('PROFESSIONAL EXPERIENCE', 20, 125);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('CEO & Founder | Thanh\'s Business Solutions LLC | 2021 - Present', 20, 140);
    doc.setFont(undefined, 'normal');
    doc.text('• Built technology consulting firm from startup to $500K+ annual revenue', 25, 150);
    doc.text('• Manage team of 11 employees across development, sales, and operations', 25, 160);
    doc.text('• Developed proprietary software solutions for 50+ small business clients', 25, 170);
    doc.text('• Achieved 95% client retention rate through exceptional service delivery', 25, 180);
    
    doc.setFont(undefined, 'bold');
    doc.text('Senior Software Engineer | TechCorp Inc. | 2018 - 2021', 20, 195);
    doc.setFont(undefined, 'normal');
    doc.text('• Led development of enterprise software solutions serving 100K+ users', 25, 205);
    doc.text('• Managed $2M+ technology budget and vendor relationships', 25, 215);
    doc.text('• Mentored junior developers and established coding best practices', 25, 225);
    
    doc.setFont(undefined, 'bold');
    doc.text('Software Developer | StartupXYZ | 2015 - 2018', 20, 240);
    doc.setFont(undefined, 'normal');
    doc.text('• Developed full-stack web applications using modern frameworks', 25, 250);
    doc.text('• Collaborated with cross-functional teams on product development', 25, 260);
    
    doc.addPage();
    // Education
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('EDUCATION', 20, 20);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Master of Science in Computer Science', 20, 35);
    doc.text('University of California, Berkeley | 2015', 20, 45);
    doc.text('Bachelor of Science in Computer Engineering', 20, 60);
    doc.text('San Jose State University | 2013', 20, 70);
    
    // Skills
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('TECHNICAL SKILLS', 20, 90);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('• Programming: JavaScript, Python, Java, C#, SQL', 20, 105);
    doc.text('• Frameworks: React, Node.js, .NET, Spring Boot', 20, 115);
    doc.text('• Cloud Platforms: AWS, Azure, Google Cloud', 20, 125);
    doc.text('• Databases: PostgreSQL, MongoDB, MySQL', 20, 135);
    doc.text('• Project Management: Agile, Scrum, Kanban', 20, 145);
    
    // Certifications
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('CERTIFICATIONS', 20, 165);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('• AWS Certified Solutions Architect (2022)', 20, 180);
    doc.text('• Project Management Professional (PMP) (2020)', 20, 190);
    doc.text('• Certified ScrumMaster (CSM) (2019)', 20, 200);
    
    const filename = 'resume_business_experience.pdf';
    doc.save(path.join(outputDir, filename));
    console.log(`✓ Generated: ${filename}`);
  }

  generateCreditAuthorization() {
    const doc = new jsPDF();
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('SBA FORM 1846', 105, 20, { align: 'center' });
    doc.text('STATEMENT OF PERSONAL HISTORY', 105, 30, { align: 'center' });
    doc.text('CREDIT AUTHORIZATION', 105, 40, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('TO: All Credit Reporting Agencies and Creditors', 20, 65);
    doc.text('FROM: Small Business Administration', 20, 75);
    
    doc.text('The undersigned hereby authorizes any credit reporting agency,', 20, 95);
    doc.text('creditor, bank, or other lending institution to furnish any and all', 20, 105);
    doc.text('credit information in their possession concerning the undersigned', 20, 115);
    doc.text('to the Small Business Administration.', 20, 125);
    
    // Personal Information
    doc.setFont(undefined, 'bold');
    doc.text('PERSONAL INFORMATION', 20, 150);
    doc.setFont(undefined, 'normal');
    doc.text(`Full Name: ${this.ownerName}`, 25, 165);
    doc.text(`Social Security Number: ${this.ssn}`, 25, 175);
    doc.text('Date of Birth: January 15, 1985', 25, 185);
    doc.text(`Current Address: ${this.businessAddress}`, 25, 195);
    doc.text(`Phone: ${this.businessPhone}`, 25, 205);
    doc.text(`Email: ${this.businessEmail}`, 25, 215);
    
    // Previous Addresses
    doc.setFont(undefined, 'bold');
    doc.text('PREVIOUS ADDRESSES (Last 5 Years)', 20, 235);
    doc.setFont(undefined, 'normal');
    doc.text('456 Oak Street, San Francisco, CA 94103 (2019-2023)', 25, 250);
    doc.text('789 Pine Avenue, Oakland, CA 94601 (2018-2019)', 25, 260);
    
    doc.addPage();
    // Employment History
    doc.setFont(undefined, 'bold');
    doc.text('EMPLOYMENT HISTORY', 20, 20);
    doc.setFont(undefined, 'normal');
    doc.text('Current: CEO, Thanh\'s Business Solutions LLC (2021-Present)', 25, 35);
    doc.text('Previous: Senior Software Engineer, TechCorp Inc. (2018-2021)', 25, 45);
    doc.text('Previous: Software Developer, StartupXYZ (2015-2018)', 25, 55);
    
    // Authorization
    doc.setFont(undefined, 'bold');
    doc.text('AUTHORIZATION', 20, 80);
    doc.setFont(undefined, 'normal');
    doc.text('I hereby authorize the Small Business Administration to obtain', 20, 95);
    doc.text('credit reports and verify credit information for the purpose of', 20, 105);
    doc.text('evaluating my loan application. This authorization shall remain', 20, 115);
    doc.text('in effect until the loan application process is complete.', 20, 125);
    
    doc.text('I understand that this information will be used solely for the', 20, 145);
    doc.text('purpose of credit evaluation and will be kept confidential.', 20, 155);
    
    // Signature
    doc.text(`Signature: ${this.ownerName}`, 20, 200);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 215);
    doc.text('Printed Name: ' + this.ownerName, 20, 230);
    
    const filename = 'credit_authorization_sba_form_1846.pdf';
    doc.save(path.join(outputDir, filename));
    console.log(`✓ Generated: ${filename}`);
  }

  generatePersonalHistoryStatement() {
    const doc = new jsPDF();
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('SBA FORM 912', 105, 20, { align: 'center' });
    doc.text('STATEMENT OF PERSONAL HISTORY', 105, 30, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('This form must be completed by each proprietor, each general partner,', 20, 55);
    doc.text('each limited partner or stockholder owning 20% or more interest,', 20, 65);
    doc.text('each guarantor, and each management official.', 20, 75);
    
    // Personal Information
    doc.setFont(undefined, 'bold');
    doc.text('PERSONAL INFORMATION', 20, 95);
    doc.setFont(undefined, 'normal');
    doc.text(`Name: ${this.ownerName}`, 25, 110);
    doc.text(`Social Security Number: ${this.ssn}`, 25, 120);
    doc.text('Date of Birth: January 15, 1985', 25, 130);
    doc.text('Place of Birth: San Francisco, California', 25, 140);
    doc.text(`Current Address: ${this.businessAddress}`, 25, 150);
    doc.text('U.S. Citizen: Yes', 25, 160);
    
    // Background Questions
    doc.setFont(undefined, 'bold');
    doc.text('BACKGROUND INFORMATION', 20, 180);
    doc.setFont(undefined, 'normal');
    doc.text('1. Have you ever been arrested, indicted, convicted, or imprisoned', 25, 195);
    doc.text('   for any criminal offense? NO', 25, 205);
    
    doc.text('2. Are you presently subject to an indictment, criminal information,', 25, 220);
    doc.text('   arraignment, or other means of formal criminal charge? NO', 25, 230);
    
    doc.text('3. Have you ever been convicted, placed on pretrial diversion,', 25, 245);
    doc.text('   or placed on any form of parole or probation? NO', 25, 255);
    
    doc.addPage();
    doc.text('4. Are you presently an officer, director, or owner of 10% or more', 25, 20);
    doc.text('   of the voting stock of a corporation? YES - Thanh\'s Business Solutions LLC', 25, 30);
    
    doc.text('5. Have you ever been involved in bankruptcy proceedings? NO', 25, 45);
    
    doc.text('6. Are you presently delinquent on any Federal debt? NO', 25, 60);
    
    doc.text('7. Have you ever been debarred or suspended from participation', 25, 75);
    doc.text('   in any Federal program? NO', 25, 85);
    
    // Business Information
    doc.setFont(undefined, 'bold');
    doc.text('BUSINESS INFORMATION', 20, 105);
    doc.setFont(undefined, 'normal');
    doc.text(`Business Name: ${this.businessName}`, 25, 120);
    doc.text(`Business Address: ${this.businessAddress}`, 25, 130);
    doc.text('Position/Title: CEO and Owner', 25, 140);
    doc.text('Ownership Percentage: 100%', 25, 150);
    doc.text('Date Position Began: March 2021', 25, 160);
    
    // Certification
    doc.setFont(undefined, 'bold');
    doc.text('CERTIFICATION', 20, 185);
    doc.setFont(undefined, 'normal');
    doc.text('I certify that the information provided in this Statement of Personal', 20, 200);
    doc.text('History is true and complete to the best of my knowledge. I understand', 20, 210);
    doc.text('that knowingly making a false statement may result in criminal prosecution.', 20, 220);
    
    // Signature
    doc.text(`Signature: ${this.ownerName}`, 20, 250);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 120, 250);
    doc.text(`Printed Name: ${this.ownerName}`, 20, 265);
    
    const filename = 'personal_history_statement_sba_form_912.pdf';
    doc.save(path.join(outputDir, filename));
    console.log(`✓ Generated: ${filename}`);
  }

  // LOAN DOCUMENTS
  generateComprehensiveBusinessPlan() {
    const doc = new jsPDF();
    
    // Cover Page
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('BUSINESS PLAN', 105, 60, { align: 'center' });
    doc.setFontSize(16);
    doc.text(this.businessName.toUpperCase(), 105, 80, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Technology Consulting Services', 105, 100, { align: 'center' });
    doc.text(`Prepared: ${new Date().toLocaleDateString()}`, 105, 120, { align: 'center' });
    doc.text('SBA 7(a) Loan Application', 105, 140, { align: 'center' });
    
    doc.addPage();
    
    // Table of Contents
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('TABLE OF CONTENTS', 20, 30);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('1. Executive Summary ................................. 3', 20, 50);
    doc.text('2. Business Description .............................. 4', 20, 60);
    doc.text('3. Market Analysis ................................... 5', 20, 70);
    doc.text('4. Organization & Management ......................... 6', 20, 80);
    doc.text('5. Service Offerings ................................. 7', 20, 90);
    doc.text('6. Marketing & Sales Strategy ........................ 8', 20, 100);
    doc.text('7. Financial Projections ............................. 9', 20, 110);
    doc.text('8. Use of Loan Proceeds ............................. 11', 20, 120);
    doc.text('9. Repayment Ability Analysis ........................ 12', 20, 130);
    doc.text('10. Risk Analysis .................................... 13', 20, 140);
    doc.text('11. Appendices ....................................... 14', 20, 150);
    
    doc.addPage();
    
    // Executive Summary
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('1. EXECUTIVE SUMMARY', 20, 30);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const execSummary = [
      `${this.businessName} is a technology consulting firm specializing in small business`,
      'digital transformation. Founded in 2021, we provide comprehensive IT solutions,',
      'software development, and digital marketing services to small and medium-sized',
      'businesses throughout the San Francisco Bay Area.',
      '',
      'Our mission is to empower small businesses through technology, helping them compete',
      'effectively in the digital marketplace while maintaining cost-effective operations.',
      'We have established ourselves as a trusted partner for over 50 clients, achieving',
      'a 95% client retention rate and consistent year-over-year growth.',
      '',
      'LOAN REQUEST: We are seeking a $250,000 SBA 7(a) loan to fund expansion',
      'initiatives that will enable us to:',
      '• Increase working capital to support larger client projects',
      '• Invest in advanced technology infrastructure and development tools',
      '• Expand our marketing efforts to reach new market segments',
      '• Hire additional skilled professionals to meet growing demand',
      '',
      'FINANCIAL HIGHLIGHTS:',
      '• 2023 Revenue: $485,000 (32% growth from 2022)',
      '• 2023 Net Income: $58,200 (12% net margin)',
      '• Current Assets: $187,200',
      '• Strong cash flow with consistent profitability',
      '• Debt Service Coverage Ratio: 2.1x',
      '',
      'MANAGEMENT: Led by founder Thanh Nguyen, who brings 15+ years of technology',
      'industry experience, including senior roles at established tech companies and',
      'proven entrepreneurial success in building and scaling technology businesses.',
      '',
      'MARKET OPPORTUNITY: The small business technology consulting market is',
      'experiencing robust growth, driven by digital transformation needs accelerated',
      'by remote work trends and competitive pressures. Our target market represents',
      'over 50,000 small businesses in the Bay Area alone.',
      '',
      'COMPETITIVE ADVANTAGE: We differentiate through personalized service,',
      'industry-specific expertise, rapid implementation capabilities, and cost-effective',
      'solutions tailored specifically for small business needs and budgets.'
    ];
    
    let yPos = 50;
    execSummary.forEach(line => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, 20, yPos);
      yPos += 10;
    });
    
    doc.addPage();
    
    // Business Description
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('2. BUSINESS DESCRIPTION', 20, 30);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Company Overview', 20, 50);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    const businessDesc = [
      '• Legal Structure: Limited Liability Company (LLC)',
      '• Industry: Technology Consulting Services (NAICS 541511)',
      '• Location: San Francisco, California',
      '• Founded: March 2021',
      '• Employees: 8 full-time, 3 part-time contractors',
      `• Federal EIN: ${this.ein}`,
      '• California Business License: BL-2024-789456',
      '',
      'BUSINESS HISTORY:',
      'Thanh\'s Business Solutions LLC was founded in March 2021 to address the growing',
      'need for accessible, affordable technology consulting services among small',
      'businesses. Starting as a solo consultancy, the company has grown to serve over',
      '50 active clients and employ 11 team members.',
      '',
      'The company was established following founder Thanh Nguyen\'s recognition of a',
      'significant market gap: while large enterprises had access to sophisticated',
      'technology consulting services, small businesses were often underserved or',
      'priced out of the market. Our business model focuses on delivering enterprise-',
      'level solutions at small business-friendly prices and timelines.',
      '',
      'PRODUCTS AND SERVICES:',
      '1. IT Consulting and Support',
      '   • Network design and implementation',
      '   • Cybersecurity assessments and solutions',
      '   • Cloud migration and management',
      '   • Help desk and technical support',
      '',
      '2. Custom Software Development',
      '   • Web application development',
      '   • Mobile app development',
      '   • Database design and optimization',
      '   • API development and integration',
      '',
      '3. Digital Marketing Solutions',
      '   • Website design and development',
      '   • Search engine optimization (SEO)',
      '   • Social media marketing',
      '   • Email marketing automation',
      '',
      '4. Business Process Automation',
      '   • Workflow analysis and optimization',
      '   • Custom automation solutions',
      '   • Integration with existing systems',
      '   • Training and change management'
    ];
    
    yPos = 70;
    businessDesc.forEach(line => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, 20, yPos);
      yPos += 10;
    });
    
    doc.addPage();
    
    // Market Analysis
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('3. MARKET ANALYSIS', 20, 30);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const marketAnalysis = [
      'INDUSTRY OVERVIEW:',
      'The technology consulting industry has experienced significant growth, particularly',
      'in the small business segment. According to IBISWorld, the IT consulting industry',
      'generates over $450 billion globally, with small business consulting representing',
      'a rapidly growing segment projected to grow at 8.2% annually through 2028.',
      '',
      'KEY MARKET DRIVERS:',
      '• Digital transformation acceleration post-COVID-19',
      '• Increased cybersecurity awareness and regulatory requirements',
      '• Growing adoption of cloud-based solutions',
      '• Need for business process automation and efficiency',
      '• Skills gap in technology expertise among small businesses',
      '',
      'TARGET MARKET:',
      'Primary: Small businesses (10-100 employees) in professional services,',
      'healthcare, retail, and manufacturing sectors within the San Francisco Bay Area.',
      '',
      'Market Size: Over 50,000 small businesses in our geographic target area,',
      'with approximately 15,000 representing our ideal client profile.',
      '',
      'CUSTOMER DEMOGRAPHICS:',
      '• Annual revenue: $1M - $25M',
      '• Employee count: 10-100',
      '• Technology budget: $50K - $500K annually',
      '• Decision makers: Business owners, operations managers, IT managers',
      '',
      'COMPETITIVE LANDSCAPE:',
      'Direct Competitors:',
      '• Large consulting firms (Accenture, Deloitte) - serve enterprise clients',
      '• Regional IT service providers - limited service scope',
      '• Freelance consultants - capacity constraints',
      '',
      'Competitive Advantages:',
      '• Specialized focus on small business needs and budgets',
      '• Comprehensive service offering under one roof',
      '• Rapid implementation and response times',
      '• Industry-specific expertise and solutions',
      '• Strong local market presence and relationships',
      '',
      'MARKET TRENDS:',
      '• Increasing demand for cybersecurity services (+25% annually)',
      '• Growth in cloud migration projects (+30% annually)',
      '• Rising need for business automation solutions',
      '• Shift toward managed IT services vs. project-based work',
      '• Integration of AI and machine learning in business processes'
    ];
    
    yPos = 50;
    marketAnalysis.forEach(line => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, 20, yPos);
      yPos += 10;
    });
    
    doc.addPage();
    
    // Financial Projections
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('7. FINANCIAL PROJECTIONS', 20, 30);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Three-Year Revenue and Expense Projections', 20, 50);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('                           2024        2025        2026', 20, 70);
    doc.text('Revenue:                $650,000    $850,000  $1,100,000', 20, 85);
    doc.text('Cost of Services:       $227,500    $297,500    $385,000', 20, 95);
    doc.text('Gross Profit:           $422,500    $552,500    $715,000', 20, 105);
    doc.text('Gross Margin:              65.0%       65.0%       65.0%', 20, 115);
    doc.text('', 20, 125);
    doc.text('Operating Expenses:', 20, 135);
    doc.text('Salaries & Benefits:    $280,000    $365,000    $475,000', 20, 145);
    doc.text('Rent & Utilities:        $30,000     $36,000     $42,000', 20, 155);
    doc.text('Marketing:               $25,000     $35,000     $45,000', 20, 165);
    doc.text('Professional Services:   $15,000     $18,000     $22,000', 20, 175);
    doc.text('Insurance:               $12,000     $15,000     $18,000', 20, 185);
    doc.text('Other Expenses:          $18,000     $22,000     $28,000', 20, 195);
    doc.text('Total Op. Expenses:     $380,000    $491,000    $630,000', 20, 205);
    doc.text('', 20, 215);
    doc.text('EBITDA:                  $42,500     $61,500     $85,000', 20, 225);
    doc.text('Depreciation:             $8,000      $9,000     $10,000', 20, 235);
    doc.text('Interest Expense:         $3,500      $4,200      $4,800', 20, 245);
    doc.text('Net Income:              $31,000     $48,300     $70,200', 20, 255);
    doc.text('Net Margin:                4.8%        5.7%        6.4%', 20, 265);
    
    doc.addPage();
    
    // Use of Loan Proceeds
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('8. USE OF LOAN PROCEEDS', 20, 30);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Total Loan Request: $250,000', 20, 50);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const useOfFunds = [
      'DETAILED BREAKDOWN:',
      '',
      '1. WORKING CAPITAL: $100,000 (40%)',
      '   • Accounts receivable financing: $60,000',
      '   • Inventory and supplies: $25,000',
      '   • Operating cash flow buffer: $15,000',
      '',
      '2. EQUIPMENT AND TECHNOLOGY: $75,000 (30%)',
      '   • Server infrastructure and hardware: $35,000',
      '   • Software licenses and development tools: $25,000',
      '   • Office equipment and furniture: $15,000',
      '',
      '3. MARKETING AND BUSINESS DEVELOPMENT: $35,000 (14%)',
      '   • Digital marketing campaigns: $20,000',
      '   • Trade show participation and networking: $10,000',
      '   • Sales materials and branding: $5,000',
      '',
      '4. FACILITY EXPANSION: $25,000 (10%)',
      '   • Additional office space lease deposits: $15,000',
      '   • Office buildout and improvements: $10,000',
      '',
      '5. PROFESSIONAL SERVICES: $15,000 (6%)',
      '   • Legal and accounting fees: $8,000',
      '   • Business consulting and advisory services: $7,000',
      '',
      'JUSTIFICATION:',
      'This funding will enable our company to capitalize on significant growth',
      'opportunities in our market. The working capital component will support our',
      'expansion into larger client projects with longer payment cycles, while the',
      'technology investment will modernize our infrastructure and improve service',
      'delivery capabilities.',
      '',
      'EXPECTED OUTCOMES:',
      '• Increase annual revenue from $485,000 to $650,000 (34% growth)',
      '• Add 3-5 new full-time employees',
      '• Expand service offerings to include AI/ML consulting',
      '• Improve operational efficiency by 25%',
      '• Achieve debt service coverage ratio of 1.8x or higher'
    ];
    
    yPos = 70;
    useOfFunds.forEach(line => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, 20, yPos);
      yPos += 10;
    });
    
    doc.addPage();
    
    // Repayment Ability Analysis
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('9. REPAYMENT ABILITY ANALYSIS', 20, 30);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const repaymentAnalysis = [
      'LOAN TERMS ASSUMED:',
      '• Loan Amount: $250,000',
      '• Interest Rate: 10.25% (current SBA 7(a) rate)',
      '• Term: 10 years',
      '• Monthly Payment: $2,705',
      '• Annual Debt Service: $32,460',
      '',
      'DEBT SERVICE COVERAGE ANALYSIS:',
      '                           2024        2025        2026',
      'Net Income:              $31,000     $48,300     $70,200',
      'Add: Depreciation:        $8,000      $9,000     $10,000',
      'Add: Interest:            $3,500      $4,200      $4,800',
      'Cash Available:          $42,500     $61,500     $85,000',
      '',
      'Annual Debt Service:     $32,460     $32,460     $32,460',
      'Debt Service Coverage:      1.31x       1.89x       2.62x',
      '',
      'CASH FLOW PROJECTIONS:',
      'Operating Cash Flow:     $42,500     $61,500     $85,000',
      'Less: Debt Service:     ($32,460)   ($32,460)   ($32,460)',
      'Less: Capital Expenditures: ($15,000) ($12,000) ($15,000)',
      'Free Cash Flow:          ($4,960)    $17,040     $37,540',
      '',
      'REPAYMENT SOURCES:',
      '1. Primary: Operating cash flow from business operations',
      '2. Secondary: Business assets available as collateral',
      '3. Tertiary: Personal guaranty and personal assets',
      '',
      'RISK MITIGATION:',
      '• Diversified client base (50+ active clients)',
      '• Recurring revenue contracts (60% of revenue)',
      '• Strong market demand and growth trends',
      '• Experienced management team',
      '• Conservative financial projections',
      '',
      'The business demonstrates strong repayment ability with improving debt',
      'service coverage ratios and positive cash flow trends. The loan will',
      'enhance the company\'s growth trajectory and strengthen its financial',
      'position over the loan term.'
    ];
    
    yPos = 50;
    repaymentAnalysis.forEach(line => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, 20, yPos);
      yPos += 10;
    });
    
    const filename = 'business_plan_comprehensive.pdf';
    doc.save(path.join(outputDir, filename));
    console.log(`✓ Generated: ${filename}`);
  }

  generateUseOfFundsStatement() {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('USE OF FUNDS STATEMENT', 105, 30, { align: 'center' });
    doc.text(this.businessName.toUpperCase(), 105, 45, { align: 'center' });
    doc.text('SBA 7(a) LOAN APPLICATION', 105, 60, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Total Loan Amount Requested: $250,000', 20, 85);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Applicant: ${this.ownerName}`, 20, 100);
    doc.text(`Business: ${this.businessName}`, 20, 110);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 120);
    
    // Detailed breakdown
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('DETAILED BREAKDOWN:', 20, 145);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const breakdown = [
      '',
      '1. WORKING CAPITAL: $100,000 (40.0%)',
      '   Purpose: Support increased business operations and cash flow',
      '   • Accounts receivable financing         $60,000',
      '   • Inventory and supplies                $25,000',
      '   • Operating cash flow buffer            $15,000',
      '   Justification: Enable acceptance of larger client projects',
      '   with extended payment terms (30-60 days).',
      '',
      '2. EQUIPMENT AND TECHNOLOGY: $75,000 (30.0%)',
      '   Purpose: Modernize technology infrastructure',
      '   • Server hardware and infrastructure    $35,000',
      '   • Software licenses and dev tools       $25,000',
      '   • Office equipment and furniture        $15,000',
      '   Justification: Improve service delivery capabilities',
      '   and operational efficiency.',
      '',
      '3. MARKETING AND BUSINESS DEVELOPMENT: $35,000 (14.0%)',
      '   Purpose: Expand market reach and client acquisition',
      '   • Digital marketing campaigns           $20,000',
      '   • Trade shows and networking events     $10,000',
      '   • Sales materials and branding          $5,000',
      '   Justification: Accelerate revenue growth through',
      '   targeted marketing initiatives.',
      '',
      '4. FACILITY EXPANSION: $25,000 (10.0%)',
      '   Purpose: Accommodate team growth',
      '   • Additional office space deposits      $15,000',
      '   • Office buildout and improvements      $10,000',
      '   Justification: Support planned hiring of 3-5',
      '   additional employees.',
      '',
      '5. PROFESSIONAL SERVICES: $15,000 (6.0%)',
      '   Purpose: Legal and advisory support',
      '   • Legal and accounting fees             $8,000',
      '   • Business consulting services          $7,000',
      '   Justification: Ensure compliance and strategic',
      '   guidance during expansion phase.'
    ];
    
    let yPos = 160;
    breakdown.forEach(line => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, 20, yPos);
      yPos += 10;
    });
    
    doc.addPage();
    
    // Impact and outcomes
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('EXPECTED BUSINESS IMPACT:', 20, 30);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const impact = [
      '',
      'Revenue Growth:',
      '• Increase annual revenue from $485,000 to $650,000 (34% growth)',
      '• Expand client base from 50 to 75 active clients',
      '• Add new service lines (AI/ML consulting, automation)',
      '',
      'Operational Improvements:',
      '• Reduce project delivery time by 25%',
      '• Improve client satisfaction scores to 95%+',
      '• Increase operational efficiency through better tools',
      '',
      'Employment Impact:',
      '• Create 3-5 new full-time positions',
      '• Provide career advancement opportunities for existing staff',
      '• Contribute to local economic development',
      '',
      'Financial Strengthening:',
      '• Improve cash flow management and working capital',
      '• Achieve debt service coverage ratio of 1.8x+',
      '• Build stronger balance sheet for future growth',
      '',
      'TIMELINE FOR FUND UTILIZATION:',
      '',
      'Month 1-2: Working capital deployment and equipment purchases',
      'Month 3-4: Marketing campaign launch and facility expansion',
      'Month 5-6: Staff hiring and professional services engagement',
      'Month 7-12: Full utilization and performance monitoring',
      '',
      'MONITORING AND REPORTING:',
      '',
      'The company will provide quarterly reports to the lender detailing:',
      '• Fund utilization progress against this plan',
      '• Achievement of projected business outcomes',
      '• Financial performance metrics and covenant compliance',
      '• Any material changes to the use of funds',
      '',
      'This use of funds statement demonstrates how the SBA loan will be',
      'strategically deployed to achieve sustainable business growth while',
      'maintaining strong repayment capacity.'
    ];
    
    yPos = 50;
    impact.forEach(line => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, 20, yPos);
      yPos += 10;
    });
    
    // Signature
    doc.text(`Prepared by: ${this.ownerName}, CEO`, 20, yPos + 20);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPos + 35);
    doc.text(`Signature: ${this.ownerName}`, 20, yPos + 50);
    
    const filename = 'use_of_funds_statement_detailed.pdf';
    doc.save(path.join(outputDir, filename));
    console.log(`✓ Generated: ${filename}`);
  }

  generateDebtSchedule() {
    const doc = new jsPDF();
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('SBA FORM 2202', 105, 20, { align: 'center' });
    doc.text('SCHEDULE OF LIABILITIES', 105, 30, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Business Name: ${this.businessName}`, 20, 55);
    doc.text(`EIN: ${this.ein}`, 20, 65);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 75);
    
    // Table headers
    doc.setFont(undefined, 'bold');
    doc.text('