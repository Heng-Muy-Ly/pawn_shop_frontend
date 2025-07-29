import axios from 'axios';
import { config } from './config';
import { 
  LoginCredentials, 
  AuthResponse, 
  RefreshTokenResponse,
  DecodedToken 
} from '@/types/auth';

// Create separate auth API client (no auth interceptor to avoid loops)
const authApiClient = axios.create({
  baseURL: config.apiUrl,
  timeout: config.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT decode function (simple implementation)
function decodeJWT(token: string): DecodedToken | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// Auth API for business management system
export const authApi = {
  // GET /sign_in - Login with phone number and password (as query params)
  signIn: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await authApiClient.get('sign_in', {
      params: {
        phone_number: credentials.phone_number,
        password: credentials.password
      }
    });
    return response.data;
  },

  // POST /refresh_token - Refresh access token
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await authApiClient.post('refresh_token', {
      refresh_token: refreshToken
    });
    return response.data;
  },

  // POST /create_user - Create new user
  createUser: async (userData: {
    phone_number: string;
    password: string;
    role?: string;
  }): Promise<AuthResponse> => {
    const response = await authApiClient.post('create_user', userData);
    return response.data;
  },

  // Utility functions
  decodeToken: (token: string): DecodedToken | null => {
    return decodeJWT(token);
  },

  isTokenExpired: (token: string): boolean => {
    const decoded = decodeJWT(token);
    if (!decoded) return true;
    return Date.now() >= decoded.exp * 1000;
  },

  // Get user info from token
  getUserFromToken: (token: string): DecodedToken | null => {
    const decoded = decodeJWT(token);
    if (!decoded || decoded.type !== 'access_token') return null;
    return decoded;
  }
};