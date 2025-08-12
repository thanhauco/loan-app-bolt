import React, { useState, useCallback } from 'react';
import { Upload, File, CheckCircle, AlertCircle, X, Eye, Download, FileText, DollarSign, Building, User } from 'lucide-react';
import { DocumentVettingEngine, VettingResult } from '../utils/documentVetting';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  category: string;
  status: 'pending' | 'valid' | 'invalid' | 'missing';
  uploadDate: Date;
  requirements?: string[];
  issues?: string[];
}

interface DocumentUploadProps {
  uploadedDocuments: Document[];
  setUploadedDocuments: (docs: Document[]) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ uploadedDocuments, setUploadedDocuments }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('business');
  const [vettingEngine] = useState(() => DocumentVettingEngine.getInstance());

  const documentCategories = [
    {
      id: 'business',
      name: 'Business Documents',
      icon: Building,
      color: 'blue',
      required: [
        'Business License (current)',
        'Articles of Incorporation/Organization',
        'Operating Agreement/Partnership Agreement',
        'Franchise Agreement (if applicable)',
        'Business Registration Certificate'
      ]
    },
    {
      id: 'financial',
      name: 'Financial Statements',
      icon: DollarSign,
      color: 'emerald',
      required: [
        'Business Tax Returns (3 complete years)',
        'Interim Financial Statements (current YTD)',
        'Profit & Loss Statements (3 years)',
        'Balance Sheets (3 years)',
        'Cash Flow Statements',
        'Accounts Receivable/Payable Aging'
      ]
    },
    {
      id: 'personal',
      name: 'Personal Information',
      icon: User,
      color: 'purple',
      required: [
        'Personal Tax Returns (3 complete years)',
        'Personal Financial Statement (SBA Form 413)',
        'Resume/Business Experience Summary',
        'Credit Authorization (SBA Form 1846)',
        'Personal History Statement (SBA Form 912)'
      ]
    },
    {
      id: 'loan',
      name: 'Loan Documentation',
      icon: FileText,
      color: 'orange',
      required: [
        'Business Plan (comprehensive)',
        'Use of Funds Statement (detailed)',
        'Debt Schedule (SBA Form 2202)',
        'Lease Agreements (current)',
        'Purchase Agreements/Contracts',
        'Loan Application (SBA Form 1919)',
        'Environmental Questionnaire'
      ]
    }
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      // Validate file type and size
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/bmp',
        'image/tiff',
        'text/plain'
      ];

      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not a supported format.`);
        return;
      }

      const newDoc: Document = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        category: selectedCategory,
        status: 'pending',
        uploadDate: new Date(),
        requirements: getDocumentRequirements(file.name),
      };

      // Add document immediately with pending status
      setUploadedDocuments(prev => [...prev, newDoc]);

      // Perform real document vetting
      vettingEngine.vetDocument(file).then((result: VettingResult) => {
        setUploadedDocuments(prev => 
          prev.map(doc => 
            doc.id === newDoc.id 
              ? { 
                  ...doc, 
                  status: result.status,
                  issues: result.issues,
                  requirements: getDocumentRequirements(file.name),
                  confidence: result.confidence,
                  extractedData: result.extractedData
                }
              : doc
          )
        );
      }).catch((error) => {
        console.error('Document vetting failed:', error);
        setUploadedDocuments(prev => 
          prev.map(doc => 
            doc.id === newDoc.id 
              ? { 
                  ...doc, 
                  status: 'invalid',
                  issues: ['Document processing failed. Please ensure the file is not corrupted and try again.']
                }
              : doc
          )
        );
      });
    });
  };

  const getDocumentRequirements = (filename: string): string[] => {
    const name = filename.toLowerCase();
    if (name.includes('tax') || name.includes('1040') || name.includes('1120')) {
      return ['Must be signed and dated', 'All schedules included', 'Complete 3 years required', 'IRS transcripts may be requested'];
    } else if (name.includes('financial') || name.includes('balance') || name.includes('profit')) {
      return ['CPA prepared preferred', 'Current year-to-date required', 'Comparative 3-year periods', 'Notes to financial statements'];
    } else if (name.includes('business plan')) {
      return ['Executive summary', 'Market analysis', '3-year financial projections', 'Management team bios', 'Use of loan proceeds'];
    } else if (name.includes('personal financial') || name.includes('413')) {
      return ['SBA Form 413 required', 'Must be current (within 90 days)', 'All assets and liabilities', 'Signed and dated'];
    }
    return ['Legible and complete', 'Current and valid', 'Properly executed', 'All pages included'];
  };

  const removeDocument = (docId: string) => {
    setUploadedDocuments(uploadedDocuments.filter(doc => doc.id !== docId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'text-emerald-600 bg-emerald-50';
      case 'invalid': return 'text-red-600 bg-red-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="h-4 w-4" />;
      case 'invalid': return <AlertCircle className="h-4 w-4" />;
      case 'pending': return <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const selectedCategoryData = documentCategories.find(cat => cat.id === selectedCategory);

  return (
    <div className="p-6 space-y-6">
      {/* Category Selection */}
      <div className="grid grid-cols-4 gap-4">
        {documentCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedCategory === category.id
                ? `border-${category.color}-500 bg-${category.color}-50`
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <category.icon className={`h-6 w-6 mx-auto mb-2 ${
              selectedCategory === category.id ? `text-${category.color}-600` : 'text-gray-400'
            }`} />
            <div className={`text-sm font-medium ${
              selectedCategory === category.id ? `text-${category.color}-900` : 'text-gray-600'
            }`}>
              {category.name}
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Upload Area */}
        <div className="col-span-2 space-y-4">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload {selectedCategoryData?.name}
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop files here, or click to browse
            </p>
            <input
              type="file"
              multiple
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.jpeg,.png,.txt"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </label>
            <div className="mt-2 text-xs text-gray-500">
              Supported formats: PDF, JPG, PNG, GIF, BMP, TIFF, TXT (Max 10MB)
            </div>
          </div>

          {/* Uploaded Documents */}
          <div className="space-y-3">
            {uploadedDocuments
              .filter(doc => doc.category === selectedCategory)
              .map((doc) => (
                <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">{doc.name}</div>
                        <div className="text-sm text-gray-500">
                          {formatFileSize(doc.size)} • Uploaded {doc.uploadDate.toLocaleDateString()}
                        </div>
                        {(doc as any).confidence && (
                          <span className="ml-2">• Confidence: {Math.round((doc as any).confidence)}%</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                        {getStatusIcon(doc.status)}
                        <span className="capitalize">{doc.status}</span>
                      </div>
                      <button
                        onClick={() => removeDocument(doc.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {doc.issues && doc.issues.length > 0 && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="text-sm font-medium text-red-800 mb-1">Issues Found:</div>
                      <ul className="text-sm text-red-700 space-y-1">
                        {doc.issues.map((issue, index) => (
                          <li key={index} className="flex items-start space-x-1">
                            <span>•</span>
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {doc.status === 'valid' && (doc as any).extractedData && (
                    <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <div className="text-sm font-medium text-emerald-800 mb-1">Verification Complete:</div>
                      <div className="text-sm text-emerald-700">
                        Document successfully validated against SBA SOP 50 10 8 requirements.
                        {(doc as any).confidence && ` Confidence: ${Math.round((doc as any).confidence)}%`}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Requirements Checklist */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Required Documents</h3>
          <div className="space-y-3">
            {selectedCategoryData?.required.map((requirement, index) => {
              const hasDocument = uploadedDocuments.some(
                doc => doc.category === selectedCategory && 
                doc.name.toLowerCase().includes(requirement.toLowerCase().split(' ')[0])
              );
              
              return (
                <div key={index} className="flex items-start space-x-2">
                  <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                    hasDocument ? 'bg-emerald-500' : 'bg-gray-200'
                  }`}>
                    {hasDocument && <CheckCircle className="h-3 w-3 text-white" />}
                  </div>
                  <div className={`text-sm ${hasDocument ? 'text-emerald-700' : 'text-gray-600'}`}>
                    {requirement}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-900 mb-1">Pro Tip</div>
            <div className="text-sm text-blue-700">
              Upload documents in PDF format for faster processing and better compatibility with SBA systems.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;