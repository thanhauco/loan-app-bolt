import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, HelpCircle, FileText, DollarSign, Building } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const ChatBot: React.FC = () => {
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

    if (lowerMessage.includes('document') || lowerMessage.includes('7(a)')) {
      response = `For an SBA 7(a) loan, you'll need these key documents:

• **Business Documents**: Business license, articles of incorporation, operating agreement
• **Financial Statements**: 3 years of tax returns, profit & loss statements, balance sheets
• **Personal Information**: Personal tax returns, personal financial statement, resume
• **Loan Details**: Business plan, use of funds statement, debt schedule
• **Additional**: Lease agreements, contracts, franchise agreements (if applicable)

All documents must be current and comply with SBA SOP 50 10 7.1 guidelines.`;
      suggestions = ['What are the eligibility requirements?', 'How much can I borrow?', 'Processing timeline?'];
    } else if (lowerMessage.includes('eligibility') || lowerMessage.includes('qualify')) {
      response = `SBA loan eligibility requirements include:

• **Business Size**: Must meet SBA size standards for your industry
• **Business Type**: For-profit businesses operating in the US
• **Owner Requirements**: Owner must invest own resources and have good credit
• **Use of Funds**: Must be for legitimate business purposes
• **Collateral**: May be required for loans over $25,000
• **Industry Restrictions**: Some industries are ineligible

Your business must demonstrate ability to repay the loan.`;
      suggestions = ['Required documents checklist', 'Loan amount limits', 'Interest rates'];
    } else if (lowerMessage.includes('time') || lowerMessage.includes('process') || lowerMessage.includes('long')) {
      response = `SBA loan processing timeline:

• **Pre-Application**: 1-2 weeks (document preparation)
• **Application Review**: 30-60 days (lender review)
• **SBA Review**: 5-10 business days (SBA approval)
• **Closing**: 2-3 weeks (final documentation)

**Total Timeline**: 60-90 days on average

Factors affecting timeline: completeness of application, loan amount, business complexity, and lender efficiency.`;
      suggestions = ['Speed up my application', 'What causes delays?', 'Required documents'];
    } else if (lowerMessage.includes('amount') || lowerMessage.includes('much') || lowerMessage.includes('size')) {
      response = `SBA 7(a) loan amounts and limits:

• **Maximum Loan**: $5 million
• **SBA Guarantee**: Up to 85% for loans ≤$150K, 75% for loans >$150K
• **Use of Funds**: Working capital, equipment, real estate, refinancing
• **Down Payment**: Typically 10-15% required

**Size Standards** vary by industry (measured by employees or annual receipts). Most businesses qualify if they have fewer than 500 employees.`;
      suggestions = ['Calculate loan payments', 'Industry size standards', 'Guarantee percentages'];
    } else {
      response = `I can help you with:

• **Document Requirements**: What papers you need to submit
• **Eligibility Criteria**: If your business qualifies
• **Application Process**: Step-by-step guidance
• **Compliance Issues**: SBA SOP requirements
• **Timeline Expectations**: How long approval takes

What specific aspect would you like to know more about?`;
      suggestions = ['Document checklist', 'Am I eligible?', 'Processing time', 'Loan amounts'];
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
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                <div className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
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
              <div className="bg-gray-100 rounded-lg px-3 py-2">
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
                className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors border border-blue-200"
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
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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