import React, { useState } from 'react';
import { MessageCircle, Upload, CheckCircle, AlertCircle, FileText, DollarSign, Building, Users, Calendar, ChevronRight } from 'lucide-react';
import ChatBot from './components/ChatBot';
import DocumentUpload from './components/DocumentUpload';
import ComplianceChecker from './components/ComplianceChecker';
import ApplicationOverview from './components/ApplicationOverview';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  const [complianceStatus, setComplianceStatus] = useState({
    overall: 'pending',
    checks: []
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'compliance', label: 'Compliance', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SBA Loan Vetting System</h1>
                <p className="text-sm text-gray-600">Compliant with SBA SOPs June 2025</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-emerald-50 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-emerald-700">Active Application</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Last updated: Today</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Chatbot Sidebar */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <h2 className="font-semibold text-gray-900">SBA Loan Assistant</h2>
            </div>
            <p className="text-sm text-gray-600 mt-1">Get guidance on SBA loan requirements</p>
          </div>
          <ChatBot />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Tab Navigation */}
          <div className="bg-white border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto">
            {activeTab === 'overview' && (
              <ApplicationOverview 
                uploadedDocuments={uploadedDocuments}
                complianceStatus={complianceStatus}
              />
            )}
            {activeTab === 'documents' && (
              <DocumentUpload 
                uploadedDocuments={uploadedDocuments}
                setUploadedDocuments={setUploadedDocuments}
              />
            )}
            {activeTab === 'compliance' && (
              <ComplianceChecker 
                uploadedDocuments={uploadedDocuments}
                complianceStatus={complianceStatus}
                setComplianceStatus={setComplianceStatus}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;