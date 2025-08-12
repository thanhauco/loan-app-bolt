import React, { useState } from 'react';
import { Download, FileText, CheckCircle, XCircle, Folder } from 'lucide-react';
import { SBATestDocumentGenerator, TestDocument } from '../utils/testDocumentGenerator';

const TestDocumentGenerator: React.FC = () => {
  const [generatedDocs, setGeneratedDocs] = useState<TestDocument[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const generateAllDocs = () => {
    const docs = SBATestDocumentGenerator.generateAllTestDocuments();
    setGeneratedDocs(docs);
  };

  const downloadDocument = (doc: TestDocument) => {
    const blob = new Blob([doc.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const createTestFile = (doc: TestDocument): File => {
    const blob = new Blob([doc.content], { type: 'text/plain' });
    return new File([blob], doc.filename, { type: 'text/plain' });
  };

  const categories = [
    { id: 'all', name: 'All Documents', count: generatedDocs.length },
    { id: 'business', name: 'Business', count: generatedDocs.filter(d => d.category === 'business').length },
    { id: 'financial', name: 'Financial', count: generatedDocs.filter(d => d.category === 'financial').length },
    { id: 'personal', name: 'Personal', count: generatedDocs.filter(d => d.category === 'personal').length },
    { id: 'loan', name: 'Loan', count: generatedDocs.filter(d => d.category === 'loan').length }
  ];

  const filteredDocs = selectedCategory === 'all' 
    ? generatedDocs 
    : generatedDocs.filter(doc => doc.category === selectedCategory);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">SBA Document Test Generator</h2>
          <p className="text-gray-600 dark:text-gray-300">Generate sample documents for testing SBA SOP 50 10 8 compliance</p>
        </div>
        <button
          onClick={generateAllDocs}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <FileText className="h-4 w-4" />
          <span>Generate All Documents</span>
        </button>
      </div>

      {generatedDocs.length > 0 && (
        <>
          {/* Category Filter */}
          <div className="flex space-x-2 mb-6 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* Document List */}
          <div className="space-y-3">
            {filteredDocs.map((doc, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      doc.category === 'business' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      doc.category === 'financial' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                      doc.category === 'personal' ? 'bg-purple-100 dark:bg-purple-900/30' :
                      'bg-orange-100 dark:bg-orange-900/30'
                    }`}>
                      <FileText className={`h-5 w-5 ${
                        doc.category === 'business' ? 'text-blue-600 dark:text-blue-400' :
                        doc.category === 'financial' ? 'text-emerald-600 dark:text-emerald-400' :
                        doc.category === 'personal' ? 'text-purple-600 dark:text-purple-400' :
                        'text-orange-600 dark:text-orange-400'
                      }`} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{doc.filename}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{doc.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                      doc.expectedStatus === 'valid' 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    }`}>
                      {doc.expectedStatus === 'valid' ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      <span>Expected: {doc.expectedStatus}</span>
                    </div>
                    <button
                      onClick={() => downloadDocument(doc)}
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="Download document"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <Folder className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900 dark:text-blue-100">Testing Instructions</div>
                <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  1. Download the generated documents using the download buttons<br/>
                  2. Upload them through the Documents tab to test the vetting system<br/>
                  3. Valid documents should pass validation, invalid ones should show specific issues<br/>
                  4. Check that the OCR correctly identifies document types and validates SBA SOP 50 10 8 requirements
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TestDocumentGenerator;