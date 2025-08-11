import Tesseract from 'tesseract.js';

export interface VettingResult {
  status: 'valid' | 'invalid' | 'pending';
  issues: string[];
  confidence: number;
  extractedData?: Record<string, any>;
}

export interface SBARequirement {
  name: string;
  required: boolean;
  patterns: RegExp[];
  validator: (text: string, filename: string) => boolean;
  errorMessage: string;
}

// SBA SOP 50 10 8 Document Requirements
export const SBA_REQUIREMENTS = {
  businessLicense: {
    patterns: [
      /business\s+license/i,
      /license\s+to\s+operate/i,
      /professional\s+license/i,
      /state\s+license/i
    ],
    requiredFields: [
      /license\s+number/i,
      /expiration\s+date/i,
      /issue\s+date/i,
      /business\s+name/i
    ],
    dateValidation: true,
    mustBeCurrent: true
  },
  
  taxReturns: {
    patterns: [
      /form\s+1040/i,
      /form\s+1120/i,
      /form\s+1120s/i,
      /form\s+1065/i,
      /tax\s+return/i,
      /income\s+tax/i
    ],
    requiredFields: [
      /taxpayer\s+identification/i,
      /adjusted\s+gross\s+income/i,
      /total\s+income/i,
      /signature/i,
      /date\s+signed/i
    ],
    mustBeSigned: true,
    yearValidation: true,
    requiresThreeYears: true
  },
  
  financialStatements: {
    patterns: [
      /balance\s+sheet/i,
      /profit\s+and\s+loss/i,
      /income\s+statement/i,
      /cash\s+flow/i,
      /financial\s+statement/i
    ],
    requiredFields: [
      /total\s+assets/i,
      /total\s+liabilities/i,
      /net\s+income/i,
      /revenue/i,
      /date/i
    ],
    mustBeRecent: true,
    requiresCPASignature: false // Preferred but not required
  },
  
  personalFinancialStatement: {
    patterns: [
      /sba\s+form\s+413/i,
      /personal\s+financial\s+statement/i,
      /statement\s+of\s+personal\s+history/i
    ],
    requiredFields: [
      /name/i,
      /social\s+security/i,
      /total\s+assets/i,
      /total\s+liabilities/i,
      /net\s+worth/i,
      /signature/i,
      /date/i
    ],
    mustBeSigned: true,
    mustBeCurrent: true // Within 90 days
  },
  
  businessPlan: {
    patterns: [
      /business\s+plan/i,
      /executive\s+summary/i,
      /market\s+analysis/i,
      /financial\s+projections/i
    ],
    requiredSections: [
      /executive\s+summary/i,
      /business\s+description/i,
      /market\s+analysis/i,
      /organization\s+management/i,
      /financial\s+projections/i,
      /use\s+of\s+funds/i
    ],
    minimumPages: 10
  },
  
  useOfFunds: {
    patterns: [
      /use\s+of\s+funds/i,
      /loan\s+proceeds/i,
      /purpose\s+of\s+loan/i
    ],
    requiredFields: [
      /total\s+loan\s+amount/i,
      /working\s+capital/i,
      /equipment/i,
      /real\s+estate/i,
      /debt\s+refinancing/i
    ],
    mustAddUpToTotal: true
  },
  
  articlesOfIncorporation: {
    patterns: [
      /articles\s+of\s+incorporation/i,
      /certificate\s+of\s+incorporation/i,
      /articles\s+of\s+organization/i,
      /operating\s+agreement/i
    ],
    requiredFields: [
      /business\s+name/i,
      /state\s+of\s+incorporation/i,
      /registered\s+agent/i,
      /authorized\s+shares/i,
      /file\s+date/i
    ],
    mustBeRecent: false
  }
};

export class DocumentVettingEngine {
  private static instance: DocumentVettingEngine;
  
  public static getInstance(): DocumentVettingEngine {
    if (!DocumentVettingEngine.instance) {
      DocumentVettingEngine.instance = new DocumentVettingEngine();
    }
    return DocumentVettingEngine.instance;
  }

  async extractTextFromFile(file: File): Promise<string> {
    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: m => console.log('OCR Progress:', m)
      });
      return result.data.text;
    } catch (error) {
      console.error('OCR extraction failed:', error);
      throw new Error('Failed to extract text from document');
    }
  }

  identifyDocumentType(filename: string, extractedText: string): string {
    const name = filename.toLowerCase();
    const text = extractedText.toLowerCase();

    // Business License
    if (name.includes('license') || SBA_REQUIREMENTS.businessLicense.patterns.some(p => p.test(text))) {
      return 'businessLicense';
    }

    // Tax Returns
    if (name.includes('tax') || name.includes('1040') || name.includes('1120') || 
        SBA_REQUIREMENTS.taxReturns.patterns.some(p => p.test(text))) {
      return 'taxReturns';
    }

    // Financial Statements
    if (name.includes('financial') || name.includes('balance') || name.includes('profit') ||
        SBA_REQUIREMENTS.financialStatements.patterns.some(p => p.test(text))) {
      return 'financialStatements';
    }

    // Personal Financial Statement
    if (name.includes('personal') || text.includes('form 413') ||
        SBA_REQUIREMENTS.personalFinancialStatement.patterns.some(p => p.test(text))) {
      return 'personalFinancialStatement';
    }

    // Business Plan
    if (name.includes('business plan') || name.includes('plan') ||
        SBA_REQUIREMENTS.businessPlan.patterns.some(p => p.test(text))) {
      return 'businessPlan';
    }

    // Use of Funds
    if (name.includes('use of funds') || name.includes('loan purpose') ||
        SBA_REQUIREMENTS.useOfFunds.patterns.some(p => p.test(text))) {
      return 'useOfFunds';
    }

    // Articles of Incorporation
    if (name.includes('articles') || name.includes('incorporation') || name.includes('organization') ||
        SBA_REQUIREMENTS.articlesOfIncorporation.patterns.some(p => p.test(text))) {
      return 'articlesOfIncorporation';
    }

    return 'unknown';
  }

  validateBusinessLicense(text: string, filename: string): VettingResult {
    const issues: string[] = [];
    let confidence = 0;

    // Check for required fields
    const requiredFields = SBA_REQUIREMENTS.businessLicense.requiredFields;
    const foundFields = requiredFields.filter(pattern => pattern.test(text));
    confidence += (foundFields.length / requiredFields.length) * 40;

    if (foundFields.length < requiredFields.length) {
      issues.push(`Missing required fields: ${requiredFields.length - foundFields.length} fields not found`);
    }

    // Check for expiration date
    const expirationMatch = text.match(/expir(?:ation|es?)?\s*(?:date)?:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i);
    if (expirationMatch) {
      const expirationDate = new Date(expirationMatch[1]);
      const currentDate = new Date();
      
      if (expirationDate < currentDate) {
        issues.push('Business license has expired');
        confidence -= 30;
      } else {
        confidence += 30;
      }
    } else {
      issues.push('Expiration date not clearly visible or missing');
      confidence -= 20;
    }

    // Check document quality
    if (text.length < 100) {
      issues.push('Document quality is poor - text extraction yielded minimal content');
      confidence -= 20;
    } else {
      confidence += 20;
    }

    // Check for business name consistency
    const businessNameMatch = text.match(/business\s+name:?\s*([^\n\r]+)/i);
    if (!businessNameMatch) {
      issues.push('Business name not clearly visible');
      confidence -= 10;
    } else {
      confidence += 10;
    }

    const status = confidence >= 70 && issues.length === 0 ? 'valid' : 'invalid';
    
    return {
      status,
      issues,
      confidence: Math.max(0, Math.min(100, confidence)),
      extractedData: {
        businessName: businessNameMatch?.[1]?.trim(),
        expirationDate: expirationMatch?.[1]
      }
    };
  }

  validateTaxReturns(text: string, filename: string): VettingResult {
    const issues: string[] = [];
    let confidence = 0;

    // Check for tax form type
    const formTypes = [/form\s+1040/i, /form\s+1120/i, /form\s+1120s/i, /form\s+1065/i];
    const foundForm = formTypes.find(pattern => pattern.test(text));
    
    if (foundForm) {
      confidence += 25;
    } else {
      issues.push('Tax form type not clearly identified');
      confidence -= 20;
    }

    // Check for required fields
    const requiredFields = SBA_REQUIREMENTS.taxReturns.requiredFields;
    const foundFields = requiredFields.filter(pattern => pattern.test(text));
    confidence += (foundFields.length / requiredFields.length) * 30;

    if (foundFields.length < 3) {
      issues.push('Missing critical tax return information');
    }

    // Check for signature
    const signaturePatterns = [/signature/i, /signed/i, /taxpayer.*signature/i];
    const hasSig = signaturePatterns.some(pattern => pattern.test(text));
    
    if (!hasSig) {
      issues.push('Tax return must be signed and dated');
      confidence -= 25;
    } else {
      confidence += 25;
    }

    // Check for tax year
    const yearMatch = text.match(/(?:tax\s+year|for\s+year)\s*(\d{4})/i) || text.match(/(\d{4})/g);
    if (yearMatch) {
      const year = parseInt(yearMatch[1] || yearMatch[0]);
      const currentYear = new Date().getFullYear();
      
      if (year < currentYear - 3) {
        issues.push('Tax return is older than 3 years - may not meet SBA requirements');
        confidence -= 15;
      } else {
        confidence += 20;
      }
    } else {
      issues.push('Tax year not clearly identified');
      confidence -= 15;
    }

    // Check document completeness
    if (text.length < 500) {
      issues.push('Document appears incomplete - insufficient content extracted');
      confidence -= 20;
    }

    const status = confidence >= 70 && issues.length === 0 ? 'valid' : 'invalid';
    
    return {
      status,
      issues,
      confidence: Math.max(0, Math.min(100, confidence)),
      extractedData: {
        formType: foundForm?.toString(),
        taxYear: yearMatch?.[1] || yearMatch?.[0],
        hasSig
      }
    };
  }

  validateFinancialStatements(text: string, filename: string): VettingResult {
    const issues: string[] = [];
    let confidence = 0;

    // Check for statement type
    const statementTypes = SBA_REQUIREMENTS.financialStatements.patterns;
    const foundType = statementTypes.find(pattern => pattern.test(text));
    
    if (foundType) {
      confidence += 20;
    } else {
      issues.push('Financial statement type not clearly identified');
      confidence -= 15;
    }

    // Check for required financial fields
    const requiredFields = SBA_REQUIREMENTS.financialStatements.requiredFields;
    const foundFields = requiredFields.filter(pattern => pattern.test(text));
    confidence += (foundFields.length / requiredFields.length) * 40;

    if (foundFields.length < 3) {
      issues.push('Missing key financial data fields');
    }

    // Check for monetary amounts (indicates actual financial data)
    const moneyPattern = /\$[\d,]+(?:\.\d{2})?/g;
    const moneyMatches = text.match(moneyPattern);
    
    if (!moneyMatches || moneyMatches.length < 5) {
      issues.push('Insufficient financial data - document may be incomplete');
      confidence -= 20;
    } else {
      confidence += 20;
    }

    // Check for date
    const datePattern = /(?:as\s+of|date|period\s+ending):?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i;
    const dateMatch = text.match(datePattern);
    
    if (dateMatch) {
      const statementDate = new Date(dateMatch[1]);
      const currentDate = new Date();
      const monthsOld = (currentDate.getTime() - statementDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      
      if (monthsOld > 12) {
        issues.push('Financial statement is more than 12 months old');
        confidence -= 15;
      } else {
        confidence += 20;
      }
    } else {
      issues.push('Statement date not clearly visible');
      confidence -= 10;
    }

    // Check for CPA signature (bonus points)
    const cpaPattern = /cpa|certified\s+public\s+accountant|accountant/i;
    if (cpaPattern.test(text)) {
      confidence += 10;
    }

    const status = confidence >= 65 && issues.length <= 1 ? 'valid' : 'invalid';
    
    return {
      status,
      issues,
      confidence: Math.max(0, Math.min(100, confidence)),
      extractedData: {
        statementType: foundType?.toString(),
        statementDate: dateMatch?.[1],
        hasCPA: cpaPattern.test(text),
        monetaryValues: moneyMatches?.length || 0
      }
    };
  }

  validatePersonalFinancialStatement(text: string, filename: string): VettingResult {
    const issues: string[] = [];
    let confidence = 0;

    // Check for SBA Form 413
    if (/sba\s+form\s+413/i.test(text) || /personal\s+financial\s+statement/i.test(text)) {
      confidence += 30;
    } else {
      issues.push('Document does not appear to be SBA Form 413 or equivalent personal financial statement');
      confidence -= 20;
    }

    // Check for required fields
    const requiredFields = SBA_REQUIREMENTS.personalFinancialStatement.requiredFields;
    const foundFields = requiredFields.filter(pattern => pattern.test(text));
    confidence += (foundFields.length / requiredFields.length) * 40;

    if (foundFields.length < 4) {
      issues.push('Missing required personal financial information');
    }

    // Check for signature
    if (!/signature|signed/i.test(text)) {
      issues.push('Personal financial statement must be signed');
      confidence -= 25;
    } else {
      confidence += 25;
    }

    // Check for recent date (within 90 days)
    const dateMatch = text.match(/date:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i);
    if (dateMatch) {
      const statementDate = new Date(dateMatch[1]);
      const currentDate = new Date();
      const daysOld = (currentDate.getTime() - statementDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysOld > 90) {
        issues.push('Personal financial statement must be current (within 90 days)');
        confidence -= 20;
      } else {
        confidence += 5;
      }
    } else {
      issues.push('Statement date not clearly visible');
      confidence -= 10;
    }

    const status = confidence >= 70 && issues.length === 0 ? 'valid' : 'invalid';
    
    return {
      status,
      issues,
      confidence: Math.max(0, Math.min(100, confidence)),
      extractedData: {
        statementDate: dateMatch?.[1],
        isSBAForm: /sba\s+form\s+413/i.test(text)
      }
    };
  }

  validateBusinessPlan(text: string, filename: string): VettingResult {
    const issues: string[] = [];
    let confidence = 0;

    // Check for required sections
    const requiredSections = SBA_REQUIREMENTS.businessPlan.requiredSections;
    const foundSections = requiredSections.filter(pattern => pattern.test(text));
    confidence += (foundSections.length / requiredSections.length) * 60;

    if (foundSections.length < 4) {
      issues.push(`Missing required business plan sections. Found ${foundSections.length} of ${requiredSections.length} required sections`);
    }

    // Check document length (business plans should be comprehensive)
    if (text.length < 2000) {
      issues.push('Business plan appears too brief - should be comprehensive and detailed');
      confidence -= 20;
    } else if (text.length > 5000) {
      confidence += 20;
    }

    // Check for financial projections
    const projectionPattern = /(?:projection|forecast|budget).*(?:\$|revenue|income|profit)/i;
    if (!projectionPattern.test(text)) {
      issues.push('Financial projections not clearly identified');
      confidence -= 15;
    } else {
      confidence += 15;
    }

    // Check for use of funds section
    if (!/use\s+of\s+funds|loan\s+proceeds/i.test(text)) {
      issues.push('Use of funds section not found');
      confidence -= 15;
    } else {
      confidence += 15;
    }

    const status = confidence >= 60 && issues.length <= 1 ? 'valid' : 'invalid';
    
    return {
      status,
      issues,
      confidence: Math.max(0, Math.min(100, confidence)),
      extractedData: {
        sectionsFound: foundSections.length,
        hasProjections: projectionPattern.test(text),
        wordCount: text.split(/\s+/).length
      }
    };
  }

  async vetDocument(file: File): Promise<VettingResult> {
    try {
      // Extract text using OCR
      const extractedText = await this.extractTextFromFile(file);
      
      // Identify document type
      const docType = this.identifyDocumentType(file.name, extractedText);
      
      // Validate based on document type
      switch (docType) {
        case 'businessLicense':
          return this.validateBusinessLicense(extractedText, file.name);
        case 'taxReturns':
          return this.validateTaxReturns(extractedText, file.name);
        case 'financialStatements':
          return this.validateFinancialStatements(extractedText, file.name);
        case 'personalFinancialStatement':
          return this.validatePersonalFinancialStatement(extractedText, file.name);
        case 'businessPlan':
          return this.validateBusinessPlan(extractedText, file.name);
        case 'useOfFunds':
          return this.validateUseOfFunds(extractedText, file.name);
        case 'articlesOfIncorporation':
          return this.validateArticlesOfIncorporation(extractedText, file.name);
        default:
          return {
            status: 'invalid',
            issues: ['Document type could not be identified or is not supported'],
            confidence: 0,
            extractedData: { docType: 'unknown' }
          };
      }
    } catch (error) {
      return {
        status: 'invalid',
        issues: [`Document processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        confidence: 0
      };
    }
  }

  validateUseOfFunds(text: string, filename: string): VettingResult {
    const issues: string[] = [];
    let confidence = 0;

    // Check for use of funds patterns
    if (/use\s+of\s+funds|loan\s+proceeds|purpose\s+of\s+loan/i.test(text)) {
      confidence += 25;
    } else {
      issues.push('Document does not appear to be a use of funds statement');
      confidence -= 20;
    }

    // Check for required categories
    const categories = ['working capital', 'equipment', 'real estate', 'debt', 'inventory'];
    const foundCategories = categories.filter(cat => new RegExp(cat, 'i').test(text));
    confidence += (foundCategories.length / categories.length) * 30;

    // Check for monetary amounts
    const moneyPattern = /\$[\d,]+(?:\.\d{2})?/g;
    const amounts = text.match(moneyPattern);
    
    if (!amounts || amounts.length < 2) {
      issues.push('Insufficient financial breakdown - need specific dollar amounts');
      confidence -= 25;
    } else {
      confidence += 25;
    }

    // Check for total loan amount
    if (!/total\s+(?:loan\s+)?amount/i.test(text)) {
      issues.push('Total loan amount not clearly specified');
      confidence -= 15;
    } else {
      confidence += 20;
    }

    const status = confidence >= 65 ? 'valid' : 'invalid';
    
    return {
      status,
      issues,
      confidence: Math.max(0, Math.min(100, confidence)),
      extractedData: {
        categoriesFound: foundCategories,
        amountCount: amounts?.length || 0
      }
    };
  }

  validateArticlesOfIncorporation(text: string, filename: string): VettingResult {
    const issues: string[] = [];
    let confidence = 0;

    // Check for incorporation patterns
    const patterns = SBA_REQUIREMENTS.articlesOfIncorporation.patterns;
    const foundPattern = patterns.find(pattern => pattern.test(text));
    
    if (foundPattern) {
      confidence += 30;
    } else {
      issues.push('Document does not appear to be articles of incorporation/organization');
      confidence -= 25;
    }

    // Check for required fields
    const requiredFields = SBA_REQUIREMENTS.articlesOfIncorporation.requiredFields;
    const foundFields = requiredFields.filter(pattern => pattern.test(text));
    confidence += (foundFields.length / requiredFields.length) * 50;

    if (foundFields.length < 3) {
      issues.push('Missing required incorporation information');
    }

    // Check for state filing
    if (!/state\s+of|filed\s+with|secretary\s+of\s+state/i.test(text)) {
      issues.push('State filing information not clearly visible');
      confidence -= 15;
    } else {
      confidence += 20;
    }

    const status = confidence >= 70 ? 'valid' : 'invalid';
    
    return {
      status,
      issues,
      confidence: Math.max(0, Math.min(100, confidence)),
      extractedData: {
        documentType: foundPattern?.toString(),
        fieldsFound: foundFields.length
      }
    };
  }
}