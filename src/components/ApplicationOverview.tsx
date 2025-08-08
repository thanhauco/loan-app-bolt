import React from 'react';
import { TrendingUp, FileText, CheckCircle, AlertCircle, Clock, Users, DollarSign, Calendar, Building } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  category: string;
  status: 'pending' | 'valid' | 'invalid' | 'missing';
}

interface ComplianceStatus {
  overall: string;
  checks: any[];
}

interface ApplicationOverviewProps {
  uploadedDocuments: Document[];
  complianceStatus: ComplianceStatus;
}

const ApplicationOverview: React.FC<ApplicationOverviewProps> = ({ uploadedDocuments, complianceStatus }) => {
  const applicationData = {
    applicationId: 'SBA-2025-001234',
    businessName: 'Thanh\'s Business Solutions LLC',
    loanAmount: 250000,
    loanType: 'SBA 7(a)',
    submissionDate: new Date('2025-01-15'),
    expectedDecision: new Date('2025-03-15'),
    currentStage: 'Document Review',
    progress: 65
  };

  const documentStats = {
    total: 16,
    uploaded: uploadedDocuments.length,
    validated: uploadedDocuments.filter(doc => doc.status === 'valid').length,
    pending: uploadedDocuments.filter(doc => doc.status === 'pending').length,
    issues: uploadedDocuments.filter(doc => doc.status === 'invalid').length
  };

  const complianceStats = {
    total: complianceStatus.checks.length,
    passed: complianceStatus.checks.filter(c => c.status === 'pass').length,
    failed: complianceStatus.checks.filter(c => c.status === 'fail').length,
    warnings: complianceStatus.checks.filter(c => c.status === 'warning').length
  };

  const nextSteps = [
    {
      title: 'Complete Document Upload',
      description: 'Upload remaining required documents',
      status: documentStats.uploaded === documentStats.total ? 'complete' : 'pending',
      dueDate: '2025-01-25'
    },
    {
      title: 'Resolve Compliance Issues',
      description: 'Address any compliance warnings or failures',
      status: complianceStats.failed === 0 && complianceStats.warnings === 0 ? 'complete' : 'pending',
      dueDate: '2025-01-30'
    },
    {
      title: 'SBA Review Process',
      description: 'Application sent to SBA for final review',
      status: 'upcoming',
      dueDate: '2025-02-05'
    },
    {
      title: 'Loan Decision',
      description: 'Receive approval or denial decision',
      status: 'upcoming',
      dueDate: '2025-03-15'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'upcoming': return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getProgressBarColor = (progress: number) => {
    if (progress >= 80) return 'bg-emerald-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Application Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">{applicationData.businessName}</h1>
            <p className="text-blue-100">Application ID: {applicationData.applicationId}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">${applicationData.loanAmount.toLocaleString()}</div>
            <div className="text-blue-100">{applicationData.loanType} Loan</div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Application Progress</span>
            <span className="text-sm">{applicationData.progress}%</span>
          </div>
          <div className="w-full bg-blue-500 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(applicationData.progress)}`}
              style={{ width: `${applicationData.progress}%` }}
            ></div>
          </div>
          <div className="text-sm text-blue-100 mt-1">
            Current Stage: {applicationData.currentStage}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{documentStats.uploaded}/{documentStats.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Documents Uploaded</div>
            </div>
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>Validated: {documentStats.validated}</span>
              <span>Issues: {documentStats.issues}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{complianceStats.passed}/{complianceStats.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Compliance Checks</div>
            </div>
            <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>Warnings: {complianceStats.warnings}</span>
              <span>Failed: {complianceStats.failed}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.ceil((applicationData.expectedDecision.getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Days to Decision</div>
            </div>
            <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="mt-4">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Expected: {applicationData.expectedDecision.toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">85%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">SBA Guarantee</div>
            </div>
            <DollarSign className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="mt-4">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Amount: ${(applicationData.loanAmount * 0.85).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Application Timeline & Next Steps */}
      <div className="grid grid-cols-2 gap-6">
        {/* Next Steps */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Next Steps</h3>
          <div className="space-y-4">
            {nextSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="mt-1">
                  {getStatusIcon(step.status)}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">{step.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{step.description}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Due: {step.dueDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Financial statements validated</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Tax returns uploaded</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">1 day ago</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Business license validation pending</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">2 days ago</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-gray-400 mt-2"></div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Application started</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">5 days ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Items */}
      {(documentStats.issues > 0 || complianceStats.failed > 0 || complianceStats.warnings > 0) && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 transition-colors">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Attention Required
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {documentStats.issues > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 transition-colors">
                <div className="font-medium text-gray-900 dark:text-white mb-2">Document Issues</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {documentStats.issues} document(s) have validation issues that need to be resolved.
                </div>
                <button className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
                  Review Documents →
                </button>
              </div>
            )}
            {(complianceStats.failed > 0 || complianceStats.warnings > 0) && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 transition-colors">
                <div className="font-medium text-gray-900 dark:text-white mb-2">Compliance Issues</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {complianceStats.failed + complianceStats.warnings} compliance check(s) need attention.
                </div>
                <button className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
                  View Compliance →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationOverview;