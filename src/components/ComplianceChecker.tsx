import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, FileText, Shield, Clock, TrendingUp } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  category: string;
  status: 'pending' | 'valid' | 'invalid' | 'missing';
}

interface ComplianceStatus {
  overall: string;
  checks: ComplianceCheck[];
}

interface ComplianceCheck {
  id: string;
  category: string;
  title: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  description: string;
  requirement: string;
  documents?: string[];
}

interface ComplianceCheckerProps {
  uploadedDocuments: Document[];
  complianceStatus: ComplianceStatus;
  setComplianceStatus: (status: ComplianceStatus) => void;
}

const ComplianceChecker: React.FC<ComplianceCheckerProps> = ({ 
  uploadedDocuments, 
  complianceStatus, 
  setComplianceStatus 
}) => {
  
  useEffect(() => {
    // Run compliance checks when documents change
    const runComplianceChecks = () => {
      const checks: ComplianceCheck[] = [
        {
          id: 'sba-size-standards',
          category: 'Eligibility',
          title: 'SBA Size Standards Compliance',
          status: uploadedDocuments.some(doc => doc.name.toLowerCase().includes('tax')) ? 'pass' : 'warning',
          description: 'Business must meet SBA size standards for industry classification',
          requirement: 'SBA SOP 50 10 8 - Chapter 2, Section A',
          documents: ['Business Tax Returns', 'Financial Statements']
        },
        {
          id: 'business-registration',
          category: 'Legal',
          title: 'Business Registration & Licensing',
          status: uploadedDocuments.some(doc => doc.name.toLowerCase().includes('license')) ? 'pass' : 'fail',
          description: 'Valid business registration and required licenses must be current',
          requirement: 'SBA SOP 50 10 8 - Chapter 3, Section B',
          documents: ['Business License', 'Articles of Incorporation']
        },
        {
          id: 'financial-statements',
          category: 'Financial',
          title: 'Financial Statement Requirements',
          status: uploadedDocuments.filter(doc => 
            doc.category === 'financial' && doc.status === 'valid'
          ).length >= 2 ? 'pass' : 'warning',
          description: 'Complete and current financial statements with enhanced analysis requirements',
          requirement: 'SBA SOP 50 10 8 - Chapter 4, Section C',
          documents: ['Profit & Loss', 'Balance Sheet', 'Cash Flow']
        },
        {
          id: 'personal-guaranty',
          category: 'Legal',
          title: 'Personal Guaranty Compliance',
          status: uploadedDocuments.some(doc => 
            doc.category === 'personal' && doc.status === 'valid'
          ) ? 'pass' : 'pending',
          description: 'Enhanced personal guaranty requirements for owners with 20% or more ownership',
          requirement: 'SBA SOP 50 10 8 - Chapter 5, Section D',
          documents: ['Personal Financial Statement', 'Credit Authorization']
        },
        {
          id: 'use-of-funds',
          category: 'Loan Purpose',
          title: 'Eligible Use of Loan Proceeds',
          status: uploadedDocuments.some(doc => 
            doc.name.toLowerCase().includes('use of funds')
          ) ? 'pass' : 'fail',
          description: 'Loan proceeds must comply with updated eligible use guidelines',
          requirement: 'SBA SOP 50 10 8 - Chapter 6, Section E',
          documents: ['Use of Funds Statement', 'Purchase Agreements']
        },
        {
          id: 'credit-analysis',
          category: 'Credit',
          title: 'Credit Analysis Standards',
          status: uploadedDocuments.some(doc => 
            doc.category === 'personal' && doc.name.toLowerCase().includes('credit')
          ) ? 'pass' : 'warning',
          description: 'Enhanced credit analysis with updated scoring methodology',
          requirement: 'SBA SOP 50 10 8 - Chapter 7, Section F',
          documents: ['Credit Reports', 'Debt Schedule']
        },
        {
          id: 'collateral-requirements',
          category: 'Security',
          title: 'Collateral & Security Requirements',
          status: 'warning',
          description: 'Updated collateral requirements with streamlined valuation process',
          requirement: 'SBA SOP 50 10 8 - Chapter 8, Section G',
          documents: ['Appraisals', 'UCC Filings', 'Lease Agreements']
        },
        {
          id: 'environmental-compliance',
          category: 'Environmental',
          title: 'Environmental Review Compliance',
          status: 'pending',
          description: 'Enhanced environmental screening with updated assessment criteria',
          requirement: 'SBA SOP 50 10 8 - Chapter 9, Section H',
          documents: ['Environmental Questionnaire', 'Site Assessment']
        }
      ];

      const passCount = checks.filter(check => check.status === 'pass').length;
      const failCount = checks.filter(check => check.status === 'fail').length;
      const warningCount = checks.filter(check => check.status === 'warning').length;

      let overall = 'pending';
      if (failCount > 0) {
        overall = 'non-compliant';
      } else if (warningCount > 0) {
        overall = 'conditional';
      } else if (passCount === checks.length) {
        overall = 'compliant';
      }

      const newStatus = { overall, checks };
      
      // Only update if the status has actually changed
      setComplianceStatus(prevStatus => {
        if (JSON.stringify(prevStatus) !== JSON.stringify(newStatus)) {
          return newStatus;
        }
        return prevStatus;
      });
    };

    runComplianceChecks();
  }, [uploadedDocuments]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'fail': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'pending': return <Clock className="h-5 w-5 text-gray-400" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-emerald-50 border-emerald-200';
      case 'fail': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'pending': return 'bg-gray-50 border-gray-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getOverallStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-emerald-700 bg-emerald-100';
      case 'conditional': return 'text-yellow-700 bg-yellow-100';
      case 'non-compliant': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const categorizeChecks = (checks: ComplianceCheck[]) => {
    const categories = ['Eligibility', 'Legal', 'Financial', 'Credit', 'Loan Purpose', 'Security', 'Environmental'];
    return categories.map(category => ({
      name: category,
      checks: checks.filter(check => check.category === category)
    })).filter(cat => cat.checks.length > 0);
  };

  const stats = {
    total: complianceStatus.checks.length,
    passed: complianceStatus.checks.filter(c => c.status === 'pass').length,
    failed: complianceStatus.checks.filter(c => c.status === 'fail').length,
    warnings: complianceStatus.checks.filter(c => c.status === 'warning').length,
    pending: complianceStatus.checks.filter(c => c.status === 'pending').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Overall Status */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">SBA Compliance Status</h2>
            <p className="text-gray-600">Based on SBA SOP 50 10 8 (January 2025)</p>
          </div>
          <div className={`px-4 py-2 rounded-full font-medium ${getOverallStatusColor(complianceStatus.overall)}`}>
            {complianceStatus.overall.charAt(0).toUpperCase() + complianceStatus.overall.slice(1).replace('-', ' ')}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Checks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{stats.passed}</div>
            <div className="text-sm text-gray-600">Passed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
            <div className="text-sm text-gray-600">Warnings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>
      </div>

      {/* Compliance Checks by Category */}
      <div className="space-y-6">
        {categorizeChecks(complianceStatus.checks).map((category) => (
          <div key={category.name} className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              {category.name} Requirements
            </h3>
            
            <div className="space-y-4">
              {category.checks.map((check) => (
                <div key={check.id} className={`border rounded-lg p-4 ${getStatusColor(check.status)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusIcon(check.status)}
                        <h4 className="font-medium text-gray-900">{check.title}</h4>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{check.description}</p>
                      <div className="text-xs text-gray-600 mb-2">
                        <strong>Requirement:</strong> {check.requirement}
                      </div>
                      {check.documents && (
                        <div className="flex flex-wrap gap-1">
                          {check.documents.map((doc, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                              <FileText className="h-3 w-3 mr-1" />
                              {doc}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Action Items */}
      {(stats.failed > 0 || stats.warnings > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Action Items Required
          </h3>
          <div className="space-y-2">
            {complianceStatus.checks
              .filter(check => check.status === 'fail' || check.status === 'warning')
              .map((check) => (
                <div key={check.id} className="flex items-start space-x-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                  <div>
                    <strong>{check.title}:</strong> {check.description}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceChecker;