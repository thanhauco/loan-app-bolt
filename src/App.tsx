import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { MessageCircle, Upload, CheckCircle, AlertCircle, FileText, DollarSign, Building, Users, Calendar, ChevronRight, Moon, Sun } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import SignIn from './components/SignIn';
import ChatBot from './components/ChatBot';
import DocumentUpload from './components/DocumentUpload';
import ComplianceChecker from './components/ComplianceChecker';
import ApplicationOverview from './components/ApplicationOverview';

function App() {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string; type: 'gmail' | 'guest' } | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  const [complianceStatus, setComplianceStatus] = useState({
    overall: 'pending',
    checks: []
  });
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [triggerChatUpdate, setTriggerChatUpdate] = useState(0);
  const [chatPanelWidth, setChatPanelWidth] = useState(384); // 24rem = 384px
  const [isDragging, setIsDragging] = useState(false);

  const handleSignIn = (userData: { name: string; email: string; type: 'gmail' | 'guest' }) => {
    setUser(userData);
    navigate('/');
  };

  const handleSignOut = () => {
    setUser(null);
    setActiveTab('overview');
    setUploadedDocuments([]);
    setComplianceStatus({ overall: 'pending', checks: [] });
    setChatMessages([]);
    setTriggerChatUpdate(0);
    navigate('/signin');
  };

  const handleDocumentUpload = (docs: any[]) => {
    setUploadedDocuments(docs);
    // Trigger chatbot to show upload summary
    setTriggerChatUpdate(prev => prev + 1);
  };
  const MainApp = () => {
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newWidth = e.clientX;
    const maxWidth = window.innerWidth * 0.4; // 40% of screen width
    const minWidth = 280; // Minimum width for usability
    
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setChatPanelWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

    if (!user) {
      return <Navigate to="/signin" replace />;
    }

    const tabs = [
      { id: 'overview', label: 'Overview', icon: Building },
      { id: 'documents', label: 'Documents', icon: FileText },
      { id: 'compliance', label: 'Compliance', icon: CheckCircle },
    ];

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
          <div className="max-w-full px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 dark:bg-blue-500 p-2 rounded-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI-Powered SBA Loan Agent</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Compliant with SBA SOPs June 2025</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  )}
                </button>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Welcome {user.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      {user.type === 'gmail' ? user.email : 'Guest User'}
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Active Application</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span>Last updated: Today</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex h-[calc(100vh-80px)]">
          {/* Chatbot Sidebar */}
          <div 
            className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors"
            style={{ width: `${chatPanelWidth}px` }}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h2 className="font-semibold text-gray-900 dark:text-white">SBA Loan Assistant</h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Get guidance on SBA loan requirements</p>
            </div>
            <ChatBot 
              uploadedDocuments={uploadedDocuments} 
              triggerUpdate={triggerChatUpdate}
            />
          </div>

          {/* Resizable Divider */}
          <div
            className={`w-1 bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-400 cursor-col-resize transition-colors ${
              isDragging ? 'bg-blue-500 dark:bg-blue-400' : ''
            }`}
            onMouseDown={handleMouseDown}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Tab Navigation */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
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
                  setUploadedDocuments={handleDocumentUpload}
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
  };

  return (
    <Routes>
      <Route path="/signin" element={<SignIn onSignIn={handleSignIn} />} />
      <Route path="/" element={<MainApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;