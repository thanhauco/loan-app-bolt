import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, HelpCircle, FileText, DollarSign, Building } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface Document {
  id: string;
  name: string;
  category: string;
  status: 'pending' | 'valid' | 'invalid' | 'missing';
}

interface ChatBotProps {
  uploadedDocuments?: Document[];
  triggerUpdate?: number;
}

const ChatBot: React.FC<ChatBotProps> = ({ uploadedDocuments = [], triggerUpdate = 0 }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your SBA Loan Assistant. I can help you understand SBA loan requirements, document checklist, and compliance guidelines. How can I assist you today?',
      timestamp: new Date(),
      suggestions: [
        'What documents do I need for SBA 7(a) loan?',
        'SBA loan eligibility requirements',
        'How long does the approval process take?',
        'SBA loan size standards'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Auto-generate document summary when documents are uploaded
    if (triggerUpdate > 0 && uploadedDocuments.length > 0) {
      const botResponse = generateDocumentSummary();
      setMessages(prev => [...prev, botResponse]);
    }
  }, [triggerUpdate, uploadedDocuments]);

  const generateDocumentSummary = (): Message => {
    const totalDocs = uploadedDocuments.length;
    const validDocs = uploadedDocuments.filter(doc => doc.status === 'valid').length;
    const invalidDocs = uploadedDocuments.filter(doc => doc.status === 'invalid').length;
    const pendingDocs = uploadedDocuments.filter(doc => doc.status === 'pending').length;
    
    let response = `Document Upload Update:

Total Documents: ${totalDocs}
• Verified: ${validDocs} documents
• Failed Validation: ${invalidDocs} documents
• Processing: ${pendingDocs} documents`;
    
    const categories = ['business', 'financial', 'personal', 'loan'];
    const categoryBreakdown = categories
      .map(category => {
        const categoryDocs = uploadedDocuments.filter(doc => doc.category === category);
        if (categoryDocs.length > 0) {
          const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
          return `• ${categoryName}: ${categoryDocs.length} files`;
        }
        return null;
      })
      .filter(Boolean);
    
    if (categoryBreakdown.length > 0) {
      response += `\n\nDocument Breakdown:\n${categoryBreakdown.join('\n')}`;
    }
    
    if (invalidDocs > 0) {
      response += `\n\nAction Required: ${invalidDocs} document(s) failed validation and need to be re-uploaded with corrections.`;
    }
    
    if (pendingDocs > 0) {
      response += `\n\nProcessing: ${pendingDocs} document(s) are currently being validated.`;
    }
    
    if (validDocs >= 8) {
      response += `\n\nExcellent progress! You have most required documents uploaded and verified.`;
    } else if (totalDocs >= 5) {
      response += `\n\nGood progress! Continue uploading the remaining required documents.`;
    } else {
      response += `\n\nKeep going! Upload more documents to complete your application.`;
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: response,
      timestamp: new Date(),
      suggestions: ['What documents are missing?', 'Why did documents fail?', 'Next steps for my application']
    };
  };
  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(message);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    let response = '';
    let suggestions: string[] = [];

    // Check for off-topic questions first
    if (isOffTopic(lowerMessage)) {
      return generateOffTopicResponse(lowerMessage);
    }
    if (lowerMessage.includes('upload') || lowerMessage.includes('document') || lowerMessage.includes('file') || lowerMessage.includes('status')) {
      const totalDocs = uploadedDocuments.length;
      const validDocs = uploadedDocuments.filter(doc => doc.status === 'valid').length;
      const invalidDocs = uploadedDocuments.filter(doc => doc.status === 'invalid').length;
      const pendingDocs = uploadedDocuments.filter(doc => doc.status === 'pending').length;
      
      if (totalDocs === 0) {
        response = `You haven't uploaded any documents yet. Here's what you need to get started:

Required Documents for SBA 7(a) Loan:
• Business Documents: Business license, articles of incorporation
• Financial Statements: 3 years tax returns, P&L, balance sheets
• Personal Information: Personal tax returns, financial statement
• Loan Documentation: Business plan, use of funds statement

Upload your documents using the Documents tab to get started with your application.`;
        suggestions = ['What documents do I need?', 'How to upload files?', 'Document requirements'];
      } else {
        response = `Document Upload Summary:

Total Documents: ${totalDocs}
• Verified: ${validDocs} documents
• Failed Validation: ${invalidDocs} documents
• Processing: ${pendingDocs} documents

Document Breakdown by Category:`;
        
        const categories = ['business', 'financial', 'personal', 'loan'];
        categories.forEach(category => {
          const categoryDocs = uploadedDocuments.filter(doc => doc.category === category);
          if (categoryDocs.length > 0) {
            const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
            response += `\n• ${categoryName}: ${categoryDocs.length} files`;
          }
        });
        
        if (invalidDocs > 0) {
          response += `\n\nAction Required: ${invalidDocs} document(s) failed validation and need to be re-uploaded with corrections.`;
        }
        
        if (validDocs >= 8) {
          response += `\n\nGreat progress! You have most required documents uploaded. Your application is moving forward well.`;
        } else {
          response += `\n\nYou're making good progress. Continue uploading the remaining required documents to complete your application.`;
        }
        
        suggestions = ['What documents are missing?', 'Why did documents fail?', 'Next steps for my application'];
      }
    } else if (lowerMessage.includes('document') || lowerMessage.includes('7(a)')) {
      response = `For an SBA 7(a) loan, you'll need these key documents:

• Business Documents: Business license, articles of incorporation, operating agreement
• Financial Statements: 3 years of tax returns, profit & loss statements, balance sheets
• Personal Information: Personal tax returns, personal financial statement, resume
• Loan Details: Business plan, use of funds statement, debt schedule
• Additional: Lease agreements, contracts, franchise agreements (if applicable)

All documents must be current and comply with SBA SOP 50 10 7.1 guidelines.`;
      suggestions = ['What are the eligibility requirements?', 'How much can I borrow?', 'Processing timeline?'];
    } else if (lowerMessage.includes('eligibility') || lowerMessage.includes('qualify')) {
      response = `SBA loan eligibility requirements include:

• Business Size: Must meet SBA size standards for your industry
• Business Type: For-profit businesses operating in the US
• Owner Requirements: Owner must invest own resources and have good credit
• Use of Funds: Must be for legitimate business purposes
• Collateral: May be required for loans over $25,000
• Industry Restrictions: Some industries are ineligible

Your business must demonstrate ability to repay the loan.`;
      suggestions = ['Required documents checklist', 'Loan amount limits', 'Interest rates'];
    } else if (lowerMessage.includes('time') || lowerMessage.includes('process') || lowerMessage.includes('long')) {
      response = `SBA loan processing timeline:

• Pre-Application: 1-2 weeks (document preparation)
• Application Review: 30-60 days (lender review)
• SBA Review: 5-10 business days (SBA approval)
• Closing: 2-3 weeks (final documentation)

Total Timeline: 60-90 days on average

Factors affecting timeline: completeness of application, loan amount, business complexity, and lender efficiency.`;
      suggestions = ['Speed up my application', 'What causes delays?', 'Required documents'];
    } else if (lowerMessage.includes('amount') || lowerMessage.includes('much') || lowerMessage.includes('size')) {
      response = `SBA 7(a) loan amounts and limits:

• Maximum Loan: $5 million
• SBA Guarantee: Up to 85% for loans ≤$150K, 75% for loans >$150K
• Use of Funds: Working capital, equipment, real estate, refinancing
• Down Payment: Typically 10-15% required

Size Standards vary by industry (measured by employees or annual receipts). Most businesses qualify if they have fewer than 500 employees.`;
      suggestions = ['Calculate loan payments', 'Industry size standards', 'Guarantee percentages'];
    } else if (lowerMessage.includes('interest') || lowerMessage.includes('rate')) {
      response = `Current SBA 7(a) loan interest rates (as of January 2025):

📈 Standard 7(a) Loans:
• Loans ≤$50,000: Prime + 4.75% (currently ~12.25%)
• Loans >$50,000: Prime + 2.75% (currently ~10.25%)
• Variable or fixed rate options available

⚡ SBA Express Loans:
• Up to $500,000
• Prime + 6.5% (currently ~14%)
• Faster approval (36 hours)

🏢 Real Estate Loans:
• 10-25 year terms available
• Slightly lower rates for owner-occupied properties

💡 Rate Factors:
• Prime rate (currently 7.5%)
• Loan amount and term
• Borrower creditworthiness
• Lender's margin

Remember: Rates change with the Federal Reserve's decisions. What you see today might be different next month — but SBA rates are typically 1-3% lower than conventional business loans.`;
      suggestions = ['Loan terms and payments', 'Fixed vs variable rates', 'How to qualify for best rates'];
    } else if (lowerMessage.includes('tax') || lowerMessage.includes('irs') || lowerMessage.includes('return')) {
      response = `Tax return requirements for SBA loans (the fun stuff):

📋 Required Tax Documents:
• Business returns: 3 complete years + current YTD
• Personal returns: 3 years for all owners ≥20%
• All schedules and attachments included
• **Must be signed and dated** (this trips up 40% of applicants)

🔍 What the SBA Looks For:
• Consistent income trends
• Debt service coverage ability
• No significant tax liens or issues
• Reasonable owner compensation

⚠️ Common Tax Return Issues:
• Unsigned returns (automatic rejection)
• Missing schedules (K-1s, depreciation, etc.)
• Amended returns without explanation
• Large NOLs without business justification

💼 Business Structure Matters:
• C-Corp: 1120 + personal returns
• S-Corp: 1120S + K-1s + personal returns
• Partnership: 1065 + K-1s + personal returns
• Sole Prop: Schedule C + personal returns

Pro tip: If your accountant prepared them, get a "prepared by" statement. The SBA loves seeing professional tax prep — it suggests you take compliance seriously.`;
      suggestions = ['Tax return red flags', 'Amended return issues', 'Business vs personal tax questions'];
    } else {
      response = `I'm your SBA loan specialist — think of me as your compliance-focused financial advisor. Here's what I can help you navigate:

🎯 **My Expertise:**
• SBA loan requirements & eligibility (SOP 50 10 7.1)
• Document preparation & compliance
• Financial statement analysis
• Tax return requirements & red flags
• Business plan guidance
• Loan application strategy

💡 **Popular Questions:**
• "What documents do I need for my industry?"
• "Why was my application denied?"
• "How do I improve my approval odds?"
• "What's taking so long with my application?"

🚀 **Quick Wins:**
• Upload your documents for instant feedback
• Get compliance status in real-time
• Understand exactly what the SBA wants to see

What specific aspect of your SBA loan journey can I help you tackle today?`;
      suggestions = ['Check my eligibility', 'Required documents for my business', 'Why do applications get denied?', 'Current interest rates'];
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: response,
      timestamp: new Date(),
      suggestions
    };
  };

  const isOffTopic = (message: string): boolean => {
    const offTopicKeywords = [
      'messi', 'ronaldo', 'football', 'soccer', 'sports', 'celebrity', 'celebrities',
      'politics', 'political', 'trump', 'biden', 'election', 'weather', 'recipe',
      'cooking', 'movie', 'movies', 'music', 'song', 'dating', 'relationship',
      'joke', 'funny', 'meme', 'cat', 'dog', 'pet', 'game', 'gaming', 'vacation',
      'travel', 'holiday', 'christmas', 'birthday', 'party', 'gossip'
    ];
    
    return offTopicKeywords.some(keyword => message.includes(keyword));
  };

  const generateOffTopicResponse = (message: string): Message => {
    let response = '';
    let suggestions: string[] = ['SBA loan requirements', 'Document checklist', 'Eligibility criteria', 'Interest rates'];

    if (message.includes('messi') || message.includes('ronaldo')) {
      const responses = [
        "Both are great at scoring goals. I'm better at scoring you a compliant loan application. ⚽→💰",
        "Messi's balance sheet? Untouchable. His SBA loan application? I'd have to see his tax returns first. 📊",
        "If they ever apply for SBA loans, I'll give you the compliance breakdown. Until then, let's focus on YOUR financial goals! 🎯"
      ];
      response = responses[Math.floor(Math.random() * responses.length)];
    } else if (message.includes('football') || message.includes('soccer') || message.includes('sports')) {
      response = "I'm more of a fan of interest rates than football scores — but I can help you score with a winning loan application! 🏆";
    } else if (message.includes('joke') || message.includes('funny')) {
      response = "Here's a good one: Why did the business owner love SBA loans? Because they come with a government guarantee — unlike my jokes! 😄 Now, what can I help you with regarding your loan application?";
    } else if (message.includes('cat') || message.includes('dog') || message.includes('pet')) {
      response = "Pets are great, but I specialize in business loans! Though if you're starting a pet-related business, I can definitely help with SBA financing options. 🐕💼";
    } else if (message.includes('weather')) {
      response = "The only forecast I'm good at is loan approval odds! ☀️ Speaking of which, let's check what documents you need to brighten your approval chances.";
    } else if (message.includes('movie') || message.includes('music')) {
      response = "I'm more into reading SBA SOPs than scripts, but I can help you finance your entertainment business if that's what you're planning! 🎬💰";
    } else {
      response = "That's outside my wheelhouse — I'm laser-focused on SBA loans, business finance, and compliance. Think of me as your dedicated loan specialist. What can I help you with regarding your business financing needs? 🎯";
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: response,
      timestamp: new Date(),
      suggestions
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' ? 'bg-blue-600' : 'bg-gray-100'
              }`}>
                {message.type === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-gray-600" />
                )}
              </div>
              <div className={`rounded-lg px-3 py-2 ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}>
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                <div className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Bot className="h-4 w-4 text-gray-600" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Suggestions */}
        {messages.length > 0 && messages[messages.length - 1].type === 'bot' && messages[messages.length - 1].suggestions && !isTyping && (
          <div className="flex flex-wrap gap-2 mt-2">
            {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-blue-200 dark:border-blue-800"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
            placeholder="Ask about SBA loan requirements..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;