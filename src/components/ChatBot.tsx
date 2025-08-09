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
    const lowerMessage = message.toLowerCase();
    let response = '';
    let suggestions: string[] = ['SBA loan requirements', 'Document checklist', 'Eligibility criteria', 'Interest rates'];

    if (lowerMessage.includes('messi') || lowerMessage.includes('ronaldo')) {
      if (lowerMessage.includes('messi') && lowerMessage.includes('ronaldo')) {
        // Both mentioned
        const responses = [
          "I could talk about Messi's loan applications… but I don't think he needs one. Let's get back to SBA loans.",
          "I'm more of a fan of interest rates than football scores — but I can help you score a compliant loan application.",
          "Both are great at goals. I'm better at goal sheets. What's your business goal?",
          "Messi vs Ronaldo? That's a tough call. SBA 7(a) vs SBA Express? Now that I can help you decide."
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
      } else if (lowerMessage.includes('messi')) {
        const responses = [
          "Messi? Great at goals. I'm better at goal sheets.",
          "I could talk about Messi's loan applications… but I don't think he needs one. Let's get back to SBA loans.",
          "Messi's got amazing ball control. I've got amazing loan control. Which one helps your business?",
          "If Messi ever needs business financing, I'll be here. Until then, let's focus on YOUR loan needs."
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
      } else if (lowerMessage.includes('ronaldo')) {
        const responses = [
          "Ronaldo's great at free kicks. I'm great at free consultations on SBA loans.",
          "I'm more of a fan of interest rates than football scores — but I can help you score a compliant loan application.",
          "Ronaldo's got dedication. I've got dedication to getting your loan approved. Let's channel that energy!",
          "CR7? Impressive. SBA 7(a) loans? Also impressive, and more relevant to your business goals."
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
      }
    } else if (lowerMessage.includes('football') || lowerMessage.includes('soccer') || lowerMessage.includes('sports')) {
      response = "I'm more of a fan of interest rates than football scores — but I can help you score a compliant loan application.";
    } else if (lowerMessage.includes('celebrity') || lowerMessage.includes('celebrities')) {
      response = "Celebrity gossip isn't my forte, but I can make you feel like a celebrity when your loan gets approved. What's your business about?";
    } else if (lowerMessage.includes('politics') || lowerMessage.includes('political')) {
      response = "I stay out of politics, but I'm very political about proper loan documentation. Let's focus on what we can control.";
    } else if (lowerMessage.includes('weather')) {
      response = "The only forecast I'm good at is loan approval odds. Speaking of which, what documents do you need help with?";
    } else {
      response = "That's outside my wheelhouse — I'm laser-focused on SBA loans, business finance, and compliance. What can I help you with regarding your business financing needs?";
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: response,
      timestamp: new Date(),
      suggestions
    };
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
      const rateResponses = [
        `🎯 **Current SBA 7(a) Rates** (January 2025):

**Standard 7(a) Loans:**
• ≤$50K: Prime + 4.75% (~12.25% today)
• >$50K: Prime + 2.75% (~10.25% today)

**SBA Express:** Prime + 6.5% (~14%) - *36-hour approval!*

**Real Estate:** 10-25 year terms, better rates for owner-occupied

💡 **Pro Tip:** These rates are 1-3% lower than conventional business loans. Your credit score and loan amount will fine-tune the exact rate.

What loan amount are you considering? I can give you a more precise estimate! 🎯`,
        
        `📊 **Interest Rate Reality Check** (January 2025):

The good news: SBA rates are government-subsidized, so you're getting a deal!

**Current Landscape:**
• Prime Rate: 7.5% (thanks, Federal Reserve! 📈)
• SBA 7(a): 10.25%-12.25% depending on loan size
• Conventional Business Loans: 13%-18% (ouch!)

**Rate Factors That Matter:**
✅ Your credit score (720+ gets the best rates)
✅ Loan amount (bigger loans = better rates)
✅ Collateral strength
✅ Industry risk level

**Reality Check:** Rates change monthly with Fed decisions, but SBA loans consistently beat conventional financing.

What's your target loan amount? Let's see what rate bracket you'd fall into! 💰`
      ];
      response = rateResponses[Math.floor(Math.random() * rateResponses.length)];
      suggestions = ['Loan terms and payments', 'Fixed vs variable rates', 'How to qualify for best rates'];
    } else if (lowerMessage.includes('tax') || lowerMessage.includes('irs') || lowerMessage.includes('return')) {
      const taxResponses = [
        `📋 **Tax Return Requirements** (The *Fun* Stuff):

**What You Need:**
• Business returns: 3 complete years + current YTD
• Personal returns: 3 years for all owners ≥20%
• **MUST BE SIGNED & DATED** ← This trips up 40% of applicants!

**What We're Really Looking For:**
• Consistent income trends
• Can you actually pay this loan back?
• No scary IRS liens lurking around
• Owner salary that makes sense (not $1M on $50K revenue!)

**Common Mistakes:**
❌ Unsigned returns = instant rejection
❌ Missing K-1s or depreciation schedules
❌ Amended returns with no explanation
❌ Massive losses with no business reason

**Pro Tip:** CPA-prepared returns get bonus points. Shows you take compliance seriously!

What's your business structure? I can tell you exactly which forms you need! 🎯`,
        
        `🎭 **Tax Returns: The SBA's Favorite Bedtime Reading**

Here's what makes the SBA's heart flutter when reviewing your taxes:

**The Golden Rules:**
1. **Signatures Required** - Unsigned = automatic "nope"
2. **Complete Packages** - All schedules, all attachments
3. **3-Year Story** - They want to see your business journey
4. **Consistency** - Wild swings need explanations

**Business Structure Breakdown:**
• **Sole Prop:** Schedule C + personal 1040s
• **S-Corp:** 1120S + K-1s + personal returns
• **Partnership:** 1065 + K-1s + everyone's personal returns
• **C-Corp:** 1120 + personal returns for owners

**Red Flags That Make Underwriters Nervous:**
🚩 Losses without clear business reasons
🚩 Owner salary of $200K when business made $50K
🚩 Amended returns with mysterious explanations
🚩 Missing depreciation schedules

**Green Flags That Make Them Happy:**
✅ CPA preparation
✅ Consistent profitability
✅ Reasonable owner compensation
✅ Clean IRS compliance history

Got your returns ready, or do we need to discuss what's missing? 📊`
      ];
      response = taxResponses[Math.floor(Math.random() * taxResponses.length)];
      suggestions = ['Tax return red flags', 'Amended return issues', 'Business vs personal tax questions'];
    } else {
      const generalResponses = [
        `🎯 **I'm Your SBA Loan Specialist** — Think of me as your compliance-focused financial advisor with a sense of humor!

**My Superpowers:**
• SBA loan requirements & eligibility (SOP 50 10 7.1)
• Document prep that actually gets approved
• Spotting red flags before they become problems
• Translating SBA-speak into human language
• Making compliance... dare I say... interesting?

**Questions I Love Answering:**
• "What documents do I *actually* need?" (not the generic list)
• "Why do applications get denied?" (spoiler: usually documentation)
• "How do I improve my approval odds?" (I have strategies!)
• "What's realistic for my situation?" (honest assessments only)

**My Promise:** No generic answers, no false hope, just practical guidance that actually works.

What's your biggest SBA loan question or concern right now? 🚀`,
        
        `💼 **Welcome to SBA Loan Mastery 101!**

I'm like a GPS for navigating SBA loan requirements — I'll get you there, avoid the traffic jams, and maybe crack a joke along the way.

**What Makes Me Different:**
✨ I actually read the SBA SOPs (all 700+ pages!)
✨ I've seen every mistake in the book (and some creative new ones)
✨ I give you the real timeline, not the marketing timeline
✨ I explain *why* things matter, not just *what* you need

**My Favorite Topics:**
🎯 Eligibility requirements (are you actually qualified?)
📋 Document strategies (what order, what format, what matters)
💰 Interest rates & terms (current market reality)
⚡ Timeline expectations (spoiler: longer than you think)
🚩 Red flags & how to avoid them

**Current Market Reality Check:**
• Approval rates: ~60% (but 90%+ with proper prep)
• Average timeline: 60-90 days (if everything goes smoothly)
• Most common rejection reason: Incomplete documentation

What's your starting point? New to SBA loans, or already in the process? 🎯`
      ];
      response = generalResponses[Math.floor(Math.random() * generalResponses.length)];
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