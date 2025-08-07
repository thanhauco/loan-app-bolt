import React, { useState } from 'react';
import { Mail, User, Shield, CheckCircle } from 'lucide-react';

interface SignInProps {
  onSignIn: (user: { name: string; email: string; type: 'gmail' | 'guest' }) => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGmailSignIn = async () => {
    setIsLoading(true);
    // Simulate Gmail OAuth flow
    setTimeout(() => {
      onSignIn({
        name: 'Thanh',
        email: 'thanh@gmail.com',
        type: 'gmail'
      });
      setIsLoading(false);
    }, 2000);
  };

  const handleGuestAccess = () => {
    onSignIn({
      name: 'Thanh',
      email: 'guest@example.com',
      type: 'guest'
    });
  };

  return (
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
            {/* Gmail Sign In */}
            <button
              onClick={handleGmailSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Mail className="h-5 w-5 text-red-500 group-hover:text-red-600" />
              )}
              <span className="font-medium text-gray-700 group-hover:text-gray-900">
                {isLoading ? 'Signing in...' : 'Continue with Gmail'}
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
    </div>
  );
};

export default SignIn;