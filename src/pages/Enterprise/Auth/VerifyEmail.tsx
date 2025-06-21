import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { useVerifyEmailMutation } from '../../../store/services/authApi';
import Button from '../../../components/ui/Button';
import { useResendVerificationMutation } from '../../../store/services/authApi';


const VerifyEmail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verifyEmail] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [errorMessage, setErrorMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  
  // Extract email from location state and token from URL
  useEffect(() => {
    // Get email from location state
    const stateEmail = (location.state as any)?.email;
    if (stateEmail) {
      setEmail(stateEmail);
    }
    
    // Get token from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get('token');
    
    if (tokenParam) {
      setToken(tokenParam);
      // Auto-verify if token is present
      handleVerify(tokenParam);
    }
  }, [location]);
  
  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);
  
  const handleVerify = async (verificationToken: string) => {
    try {
      await verifyEmail({ token: verificationToken }).unwrap();
      setVerificationStatus('success');
      
      // Redirect to login after successful verification
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);

    } catch (err: any) {
      setVerificationStatus('error');
      setErrorMessage(err.data?.message || 'Email verification failed. Please try again.');
    }
  };
  

  const handleResendVerification = async () => {
  if (!email) {
    alert('No email address available to resend verification.');
    return;
  }

  try {
    await resendVerification({ email }).unwrap();

    // Set cooldown (60 seconds)
    setResendCooldown(60);

    // Show success feedback
    alert('Verification email has been resent. Please check your inbox.');
  } catch (err: any) {
    const message = err?.data?.message || 'Failed to resend verification email. Please try again.';
    alert(message);
  }
};

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-3xl">✉️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Verify Your Email</h1>
          <p className="text-gray-600 mt-2">
            {token ? 'Verifying your email address...' : 'Check your inbox to verify your email address'}
          </p>
        </div>
        
        {/* Verification Card */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          {/* Verification Status */}
          {verificationStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-green-700 font-medium">Email verified successfully!</p>
                <p className="text-green-600 text-sm mt-1">
                  Your email has been verified. Redirecting to login...
                </p>
              </div>
            </div>
          )}
          
          {verificationStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-red-700 font-medium">Verification failed</p>
                <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
              </div>
            </div>
          )}
          
          {/* If no token in URL, show instructions */}
          {!token && (
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-indigo-600" />
              </div>
              
              <h2 className="text-xl font-bold text-gray-800 mb-2">Check Your Email</h2>
              
              {email ? (
                <p className="text-gray-600 mb-6">
                  We've sent a verification link to <strong>{email}</strong>. 
                  Please check your inbox and click the link to verify your email address.
                </p>
              ) : (
                <p className="text-gray-600 mb-6">
                  We've sent a verification link to your email address.
                  Please check your inbox and click the link to verify your email address.
                </p>
              )}
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6 text-left">
                <h3 className="font-medium text-blue-700 mb-1">Didn't receive the email?</h3>
                <ul className="text-sm text-blue-600 list-disc list-inside space-y-1">
                  <li>Check your spam or junk folder</li>
                  <li>Verify you entered the correct email address</li>
                  <li>Wait a few minutes for the email to arrive</li>
                </ul>
              </div>
              
              <Button
                onClick={handleResendVerification}
                disabled={resendCooldown > 0}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {resendCooldown > 0 
                  ? `Resend Email (${resendCooldown}s)` 
                  : 'Resend Verification Email'}
              </Button>
            </div>
          )}
          
          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link 
              to="/auth/login" 
              className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;