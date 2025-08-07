import React, { useState } from 'react';
import { Mail, User, Shield, CheckCircle, X } from 'lucide-react';

interface SignInProps {
  onSignIn: (user: { name: string; email: string; type: 'gmail' | 'guest' }) => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  const [showGmailPopup, setShowGmailPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShowGmailPopup = () => {
    setShowGmailPopup(true);
  };

  const handleGmailSignIn = (email: string) => {
    setIsLoading(true);
    setShowGmailPopup(false);
    
    // Simulate Gmail OAuth flow
    setTimeout(() => {
      onSignIn({
        name: 'Thanh',
        email: email,
        type: 'gmail'
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleGuestAccess = () => {
    onSignIn({
      name: 'Thanh',
      email: 'guest@example.com',
      type: 'guest'
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SBA Loan Vetting</h1>
          <p className="text-gray-600">Secure access to your loan application portal</p>
        </div>

        {/* Sign In Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="space-y-6">
            {/* Sign In Button */}
            <button
              onClick={handleShowGmailPopup}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Shield className="h-5 w-5" />
              )}
              <span>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </span>
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Guest Access */}
            <button
              onClick={handleGuestAccess}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 group"
            >
              <User className="h-5 w-5 text-gray-600 group-hover:text-gray-700" />
              <span className="font-medium text-gray-700 group-hover:text-gray-900">
                Continue as Guest
              </span>
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <div className="font-medium text-emerald-800 mb-1">Secure & Compliant</div>
                <div className="text-emerald-700">
                  Your data is protected with bank-level security and complies with SBA privacy requirements.
                </div>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <div className="text-xs text-gray-500">
              By continuing, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 underline">Privacy Policy</a>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@sbaloan.com" className="text-blue-600 hover:text-blue-700 underline">
              support@sbaloan.com
            </a>
          </p>
        </div>
      </div>
      
      {/* Gmail Login Popup */}
      {showGmailPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowGmailPopup(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="text-center mb-6">
              <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in with Gmail</h2>
              <p className="text-gray-600">Choose your Gmail account to continue</p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => handleGmailSignIn('thanh@gmail.com')}
                className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">T</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Thanh</div>
                  <div className="text-sm text-gray-600">thanh@gmail.com</div>
                </div>
              </button>
              
              <button
                onClick={() => handleGmailSignIn('thanh.business@gmail.com')}
                className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">TB</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Thanh Business</div>
                  <div className="text-sm text-gray-600">thanh.business@gmail.com</div>
                </div>
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowGmailPopup(false)}
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Use another account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignIn;