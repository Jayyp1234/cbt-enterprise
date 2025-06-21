import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useRefreshTokenMutation } from '../store/services/authApi';
import { useEffect } from 'react';

export const useAuth = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const [refreshToken] = useRefreshTokenMutation();
  
  // Function to check if token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expiry;
    } catch (error) {
      return true; // If there's an error parsing the token, consider it expired
    }
  };
  
  // Refresh token if it's about to expire
  useEffect(() => {
    if (auth.token && auth.refreshToken) {
      // Check if token is expired or about to expire (within 5 minutes)
      const checkTokenExpiry = () => {
        if (isTokenExpired(auth.token!)) {
          refreshToken(auth.refreshToken!);
        }
      };
      
      // Check immediately
      checkTokenExpiry();
      
      // Set up interval to check periodically
      const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000); // Check every 5 minutes
      
      return () => clearInterval(interval);
    }
  }, [auth.token, auth.refreshToken, refreshToken]);
  
  return {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
  };
};