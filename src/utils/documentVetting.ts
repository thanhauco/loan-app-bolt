import Tesseract from 'tesseract.js';

// PDF.js configuration - only import if available
let pdfjsLib: any = null;
try {
  // Dynamic import to avoid build issues
  import('pdfjs-dist').then((pdf) => {
    pdfjsLib = pdf;
    // Configure PDF.js worker
    if (pdfjsLib.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
    }
  }).catch(() => {
    console.warn('PDF.js not available, PDF processing will be limited');
  });
} catch (error) {
  console.warn('PDF.js import failed:', error);
}

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
    requiredSections: [ // Per SBA SOP 50 10 8 Chapter 6
      /executive\s+summary/i,
      /business\s+description/i,
      /management\s+(?:team|experience)/i,
      /financial\s+projections/i,
      /use\s+of\s+(?:funds|proceeds)/i,
      /repayment\s+ability/i
    ],
    minimumPages: 5, // SBA allows shorter plans for smaller loans
    mustDemonstrateRepayment: true,
    requiresReasonableProjections: true
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
      /operating\s+agreement/i,
      /limited\s+liability\s+company/i,
      /secretary\s+of\s+state/i
    ],
    requiredFields: [
      /business\s+name/i,
      /company.*name/i,
      /state\s+of\s+incorporation/i,
      /state\s+of\s+california/i,
      /registered\s+agent/i,
      /agent\s+for\s+service/i,
      /file\s+date|filing\s+date/i,
      /file\s+number/i,
      /effective\s+date/i
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
      // If it's a text file, read it directly
      if (file.type === 'text/plain') {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const text = e.target?.result as string;
            resolve(text);
          };
          reader.onerror = () => reject(new Error('Failed to read text file'));
          reader.readAsText(file);
        });
      }
      
      // Handle PDF files with special conversion
      if (file.type === 'application/pdf') {
        return await this.extractTextFromPDF(file);
      }

      // Handle image files
      const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff'];
      if (imageTypes.includes(file.type)) {
        return await this.extractTextFromImage(file);
      }

      throw new Error(`File type ${file.type} is not supported for text extraction. Please upload PDF, image, or text files only.`);
    } catch (error) {
      console.error('OCR extraction failed:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to extract text from document: ${error.message}`);
      } else {
        throw new Error('Failed to extract text from document');
      }
    }
  }

  private async extractTextFromPDF(file: File): Promise<string> {
    try {
      // Check if PDF.js is available
      if (!pdfjsLib) {
        console.warn('PDF.js not available, using OCR fallback for PDF');
        return await this.convertPDFToImageAndOCR(file);
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      // If we got text directly from PDF, return it
      if (fullText.trim().length > 50) {
        return fullText;
      }

      // If no text or minimal text, convert to image and use OCR
      console.log('PDF has minimal text, converting to image for OCR...');
      return await this.convertPDFToImageAndOCR(file);
    } catch (error) {
      console.error('PDF text extraction failed, trying OCR fallback:', error);
      return await this.convertPDFToImageAndOCR(file);
    }
  }

  private async convertPDFToImageAndOCR(file: File): Promise<string> {
    try {
      // Check if PDF.js is available
      if (!pdfjsLib) {
        console.warn('PDF.js not available, using basic OCR fallback');
        // For now, just return a basic message - in production you'd want a better fallback
        return 'PDF document - OCR processing required. Please ensure the document is clear and legible.';
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      // Process first 3 pages (to avoid performance issues)
      const maxPages = Math.min(pdf.numPages, 3);
      
      for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });
        
        // Create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page to canvas
        await page.render({
          canvasContext: context!,
          viewport: viewport
        }).promise;

        // Convert canvas to blob and run OCR
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => resolve(blob!), 'image/png');
        });

        const result = await Tesseract.recognize(blob, 'eng', {
          logger: (m) => console.log(`OCR Page ${pageNum}:`, m)
        });
        
        fullText += result.data.text + '\n';
      }

      return fullText;
    } catch (error) {
      console.error('PDF to image conversion failed:', error);
      // Fallback to basic OCR if PDF processing fails
      return 'PDF document - OCR processing required. Please ensure the document is clear and legible.';
    }
  }

  private async extractTextFromImage(file: File): Promise<string> {
    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => console.log('OCR Progress:', m)
      });
      return result.data.text;
    } catch (error) {
      throw new Error(`Failed to extract text from image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  identifyDocumentType(filename: string, extractedText: string): string {
    const text = extractedText.toLowerCase();
    const name = filename.toLowerCase();
    
    // Score each document type based on content patterns
    const documentScores = {
      businessLicense: 0,
      taxReturns: 0,
      financialStatements: 0,
      personalFinancialStatement: 0,
      businessPlan: 0,
      useOfFunds: 0,
      articlesOfIncorporation: 0
    };

    // Business License - Content-based scoring
    SBA_REQUIREMENTS.businessLicense.patterns.forEach(pattern => {
      if (pattern.test(text)) documentScores.businessLicense += 3;
    });
    SBA_REQUIREMENTS.businessLicense.requiredFields.forEach(field => {
      if (field.test(text)) documentScores.businessLicense += 2;
    });
    if (name.includes('license')) documentScores.businessLicense += 1; // Filename hint

    // Tax Returns - Content-based scoring
    SBA_REQUIREMENTS.taxReturns.patterns.forEach(pattern => {
      if (pattern.test(text)) documentScores.taxReturns += 3;
    });
    SBA_REQUIREMENTS.taxReturns.requiredFields.forEach(field => {
      if (field.test(text)) documentScores.taxReturns += 2;
    });
    if (name.includes('tax') || name.includes('1040') || name.includes('1120')) {
      documentScores.taxReturns += 1; // Filename hint
    }

    // Financial Statements - Content-based scoring
    SBA_REQUIREMENTS.financialStatements.patterns.forEach(pattern => {
      if (pattern.test(text)) documentScores.financialStatements += 3;
    });
    SBA_REQUIREMENTS.financialStatements.requiredFields.forEach(field => {
      if (field.test(text)) documentScores.financialStatements += 2;
    });
    if (name.includes('financial') || name.includes('balance') || name.includes('profit')) {
      documentScores.financialStatements += 1; // Filename hint
    }

    // Personal Financial Statement - Content-based scoring
    SBA_REQUIREMENTS.personalFinancialStatement.patterns.forEach(pattern => {
      if (pattern.test(text)) documentScores.personalFinancialStatement += 3;
    });
    SBA_REQUIREMENTS.personalFinancialStatement.requiredFields.forEach(field => {
      if (field.test(text)) documentScores.personalFinancialStatement += 2;
    });
    if (name.includes('personal') || name.includes('413')) {
      documentScores.personalFinancialStatement += 1; // Filename hint
    }

    // Business Plan - Content-based scoring
    SBA_REQUIREMENTS.businessPlan.patterns.forEach(pattern => {
      if (pattern.test(text)) documentScores.businessPlan += 3;
    });
    SBA_REQUIREMENTS.businessPlan.requiredSections.forEach(section => {
      if (section.test(text)) documentScores.businessPlan += 2;
    });
    if (name.includes('business') && name.includes('plan')) {
      documentScores.businessPlan += 1; // Filename hint
    }

    // Use of Funds - Content-based scoring
    SBA_REQUIREMENTS.useOfFunds.patterns.forEach(pattern => {
      if (pattern.test(text)) documentScores.useOfFunds += 3;
    });
    SBA_REQUIREMENTS.useOfFunds.requiredFields.forEach(field => {
      if (field.test(text)) documentScores.useOfFunds += 2;
    });
    if (name.includes('use') && name.includes('funds')) {
      documentScores.useOfFunds += 1; // Filename hint
    }

    // Articles of Incorporation - Content-based scoring
    SBA_REQUIREMENTS.articlesOfIncorporation.patterns.forEach(pattern => {
      if (pattern.test(text)) documentScores.articlesOfIncorporation += 3;
    });
    SBA_REQUIREMENTS.articlesOfIncorporation.requiredFields.forEach(field => {
      if (field.test(text)) documentScores.articlesOfIncorporation += 2;
    });
    if (name.includes('articles') || name.includes('incorporation') || name.includes('organization')) {
      documentScores.articlesOfIncorporation += 1; // Filename hint
    }

    // Find the document type with the highest score
    const maxScore = Math.max(...Object.values(documentScores));
    
    // Require minimum score of 3 to identify (at least one strong content match)
    if (maxScore < 3) {
      return 'unknown';
    }

    // Return the document type with the highest score
    const identifiedType = Object.entries(documentScores)
      .find(([type, score]) => score === maxScore)?.[0];
    
    return identifiedType || 'unknown';
  }

  validateBusinessLicense(text: string, filename: string): VettingResult {
    const issues: string[] = [];
    let confidence = 0;

    // Check for required fields
    const requiredFields = SBA_REQUIREMENTS.businessLicense.requiredFields;
    const foundFields = requiredFields.filter(pattern => pattern.test(text));
    confidence += (foundFields.length / requiredFields.length) * 50;

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

    // SBA SOP 50 10 8: Business license must be current and complete
    const status = confidence >= 75 && issues.filter(i => !i.includes('quality')).length === 0 ? 'valid' : 'invalid';
    
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

    // SBA SOP 50 10 8: Tax returns must be signed, complete, and within 3 years
    const status = confidence >= 80 && issues.filter(i => !i.includes('incomplete')).length === 0 ? 'valid' : 'invalid';
    
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

    // SBA SOP 50 10 8: Financial statements must be current and complete
    const status = confidence >= 70 && issues.filter(i => !i.includes('CPA')).length === 0 ? 'valid' : 'invalid';
    
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

    // SBA SOP 50 10 8: Personal financial statement must be current (90 days) and signed
    const status = confidence >= 75 && issues.length === 0 ? 'valid' : 'invalid';
    
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

    // SBA SOP 50 10 8 Chapter 6: Business Plan Requirements
    const requiredSections = SBA_REQUIREMENTS.businessPlan.requiredSections;
    const foundSections = requiredSections.filter(pattern => pattern.test(text));
    confidence += (foundSections.length / requiredSections.length) * 50;

    // SBA requires minimum essential sections
    if (foundSections.length < 3) {
      issues.push(`Insufficient business plan content. SBA SOP 50 10 8 requires comprehensive business plan with key sections. Found ${foundSections.length} of ${requiredSections.length} required sections`);
    }

    // SBA SOP 50 10 8: Business plan must be comprehensive enough to evaluate creditworthiness
    if (text.length < 1000) {
      issues.push('Business plan lacks sufficient detail for SBA evaluation per SOP 50 10 8');
      confidence -= 25;
    } else if (text.length > 2000) {
      confidence += 20;
    } else if (text.length > 1000) {
      confidence += 10;
    }

    // SBA SOP 50 10 8: Financial projections are REQUIRED, not optional
    const projectionPattern = /(?:projection|forecast|budget).*(?:\$|revenue|income|profit|cash\s+flow)/i;
    if (!projectionPattern.test(text)) {
      issues.push('Financial projections are required per SBA SOP 50 10 8 - must include revenue, expense, and cash flow projections');
      confidence -= 20;
    } else {
      confidence += 25;
    }

    // SBA SOP 50 10 8: Use of funds is MANDATORY
    if (!/use\s+of\s+funds|loan\s+proceeds/i.test(text)) {
      issues.push('Use of funds statement is required per SBA SOP 50 10 8');
      confidence -= 20;
    } else {
      confidence += 20;
    }

    // SBA SOP 50 10 8: Must demonstrate repayment ability
    const repaymentPattern = /(?:repayment|cash\s+flow|debt\s+service|ability\s+to\s+repay)/i;
    if (!repaymentPattern.test(text)) {
      issues.push('Business plan must demonstrate repayment ability per SBA SOP 50 10 8');
      confidence -= 15;
    } else {
      confidence += 15;
    }

    // SBA SOP 50 10 8: Management experience must be documented
    const managementPattern = /(?:management|experience|owner|principal|key\s+personnel)/i;
    if (!managementPattern.test(text)) {
      issues.push('Management experience and qualifications must be documented per SBA SOP 50 10 8');
      confidence -= 10;
    } else {
      confidence += 10;
    }

    // Check for business plan header/title
    if (/business\s+plan/i.test(text)) {
      confidence += 10;
    }

    // SBA SOP 50 10 8: Business plan must meet regulatory standards - no exceptions for "basic" plans
    const status = confidence >= 70 && foundSections.length >= 3 ? 'valid' : 'invalid';
    
    return {
      status,
      issues,
      confidence: Math.max(0, Math.min(100, confidence)),
      extractedData: {
        sectionsFound: foundSections.length,
        totalSectionsRequired: requiredSections.length,
        hasProjections: projectionPattern.test(text),
        hasRepaymentAnalysis: repaymentPattern.test(text),
        hasManagementInfo: managementPattern.test(text),
        wordCount: text.split(/\s+/).length,
        meetsSOPRequirements: confidence >= 70 && foundSections.length >= 3
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

    // SBA SOP 50 10 8: Use of funds must have detailed breakdown
    const status = confidence >= 70 && issues.length === 0 ? 'valid' : 'invalid';
    
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

    if (foundFields.length < 2) {
      issues.push('Missing required incorporation information');
    }

    // Check for state filing
    if (!/state\s+of|filed\s+with|secretary\s+of\s+state/i.test(text)) {
      issues.push('State filing information not clearly visible');
      confidence -= 15;
    } else {
      confidence += 20;
    }

    // SBA SOP 50 10 8: Articles must be properly filed with state
    const status = confidence >= 65 && issues.length === 0 ? 'valid' : 'invalid';
    
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