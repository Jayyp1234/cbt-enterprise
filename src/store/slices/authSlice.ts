import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { User } from '../services/authApi';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

// Helper function to get initial state from localStorage
const loadAuthState = (): AuthState => {
  try {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (token) {
      // Decode JWT to get user info
      const decodedToken = jwtDecode<{ user: User }>(token);
      return {
        user: decodedToken.user,
        token,
        refreshToken,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    // If there's an error (invalid token, etc.), clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
  
  return {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
  };
};

const initialState: AuthState = loadAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user?: User;
        token: string;
        refreshToken: string;
      }>
    ) => {
      const { user, token, refreshToken } = action.payload;
      
      // If user is provided, use it directly
      if (user) {
        state.user = user;
      } else if (token) {
        // Otherwise, decode the token to get user info
        try {
          const decodedToken = jwtDecode<{ user: User }>(token);
          state.user = decodedToken.user;
        } catch (error) {
          console.error('Failed to decode token:', error);
        }
      }
      
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
    },
    
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
    
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;

export default authSlice.reducer;