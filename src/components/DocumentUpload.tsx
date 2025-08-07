import React, { useState, useCallback } from 'react';
import { Upload, File, CheckCircle, AlertCircle, X, Eye, Download, FileText, DollarSign, Building, User } from 'lucide-react';

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

  const documentCategories = [
    {
      id: 'business',
      name: 'Business Documents',
      icon: Building,
      color: 'blue',
      required: [
        'Business License',
        'Articles of Incorporation',
        'Operating Agreement',
        'Franchise Agreement (if applicable)'
      ]
    },
    {
      id: 'financial',
      name: 'Financial Statements',
      icon: DollarSign,
      color: 'emerald',
      required: [
        'Business Tax Returns (3 years)',
        'Profit & Loss Statements',
        'Balance Sheets',
        'Cash Flow Statements'
      ]
    },
    {
      id: 'personal',
      name: 'Personal Information',
      icon: User,
      color: 'purple',
      required: [
        'Personal Tax Returns (3 years)',
        'Personal Financial Statement',
        'Resume/Business Experience',
        'Credit Authorization'
      ]
    },
    {
      id: 'loan',
      name: 'Loan Documentation',
      icon: FileText,
      color: 'orange',
      required: [
        'Business Plan',
        'Use of Funds Statement',
        'Debt Schedule',
        'Lease Agreements',
        'Purchase Agreements'
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

      // Simulate document validation
      setTimeout(() => {
        const validationResult = validateDocument(newDoc);
        setUploadedDocuments(prev => 
          prev.map(doc => 
            doc.id === newDoc.id 
              ? { ...doc, ...validationResult }
              : doc
          )
        );
      }, 2000);
    });
  };

  const getDocumentRequirements = (filename: string): string[] => {
    const name = filename.toLowerCase();
    if (name.includes('tax') || name.includes('1040')) {
      return ['Must be signed and dated', 'All schedules included', 'Recent 3 years required'];
    } else if (name.includes('financial') || name.includes('balance')) {
      return ['CPA prepared preferred', 'Current year-to-date', 'Comparative periods'];
    } else if (name.includes('business plan')) {
      return ['Executive summary', 'Market analysis', 'Financial projections', 'Management team'];
    }
    return ['Legible and complete', 'Current and valid', 'Properly executed'];
  };

  const validateDocument = (doc: Document) => {
    // Mock demo: For first 3 files uploaded, show 2 verified and 1 failed
    const totalDocsCount = uploadedDocuments.length;
    
    if (totalDocsCount === 1) {
      // First file - verified
      return {
        status: 'valid' as const,
        issues: []
      };
    } else if (totalDocsCount === 2) {
      // Second file - verified
      return {
        status: 'valid' as const,
        issues: []
      };
    } else if (totalDocsCount === 3) {
      // Third file - failed
      return {
        status: 'invalid' as const,
        issues: [
          'Document quality is poor - please provide a clearer copy',
          'Missing required signatures',
          'Document appears to be incomplete'
        ]
      };
    }
    
    // For subsequent files, use random validation
    const isValid = Math.random() > 0.3;
    if (isValid) {
      return {
        status: 'valid' as const,
        issues: []
      };
    } else {
      return {
        status: 'invalid' as const,
        issues: [
          'Document quality is poor - please provide a clearer copy',
          'Missing required signatures',
          'Document appears to be incomplete'
        ]
      };
    }
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
              accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.jpeg,.png"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </label>
            <div className="mt-2 text-xs text-gray-500">
              Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB)
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