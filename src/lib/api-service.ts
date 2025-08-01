import { productsApi, clientsApi, ordersApi, pawnsApi } from './api';
import { authApi } from './auth-api';
import { config } from './config';

// Comprehensive API Service
export class ApiService {
  // Authentication
  static auth = {
    signIn: authApi.signIn,
    refreshToken: authApi.refreshToken,
    createUser: authApi.createUser,
    decodeToken: authApi.decodeToken,
    isTokenExpired: authApi.isTokenExpired,
    getUserFromToken: authApi.getUserFromToken,
  };

  // Products
  static products = {
    getAll: productsApi.getAll,
    create: productsApi.create,
    update: productsApi.update,
    delete: productsApi.delete,
    search: productsApi.search,
  };

  // Clients
  static clients = {
    getAll: clientsApi.getAll,
    create: clientsApi.create,
    getByPhone: clientsApi.getByPhone,
  };

  // Orders
  static orders = {
    getAll: ordersApi.getAll,
    create: ordersApi.create,
    getAllClientOrders: ordersApi.getAllClientOrders,
    getClientOrderById: ordersApi.getClientOrderById,
    search: ordersApi.search,
    getNextOrderId: ordersApi.getNextOrderId,
    getLastOrders: ordersApi.getLastOrders,
    printOrder: ordersApi.printOrder,
  };

  // Pawns
  static pawns = {
    getById: pawnsApi.getById,
    create: pawnsApi.create,
    getAllClientPawns: pawnsApi.getAllClientPawns,
    getClientPawnById: pawnsApi.getClientPawnById,
    search: pawnsApi.search,
    getNextPawnId: pawnsApi.getNextPawnId,
    getLastPawns: pawnsApi.getLastPawns,
    printPawn: pawnsApi.printPawn,
  };

  // Utility methods
  static utils = {
    // Check if API is available
    async checkApiHealth(): Promise<boolean> {
      try {
        // Extract base URL without /api/v1 for health check
        const baseUrl = config.apiUrl.replace('/api/v1', '');
        const response = await fetch(`${baseUrl}/health`);
        return response.ok;
      } catch {
        return false;
      }
    },

    // Get API base URL
    getBaseUrl(): string {
      return config.apiUrl;
    },

    // Get app configuration
    getConfig() {
      return {
        apiUrl: config.apiUrl,
        appName: config.appName,
        appVersion: config.appVersion,
        timeout: config.timeout,
        isDevelopment: config.isDevelopment,
        isProduction: config.isProduction,
      };
    },

    // Format error message
    formatErrorMessage(error: any): string {
      if (error.response?.data?.message) {
        return error.response.data.message;
      }
      if (error.message) {
        return error.message;
      }
      return 'An unexpected error occurred';
    },

    // Debug log (only in development)
    debugLog(message: string, data?: any): void {
      if (config.enableDebug && config.isDevelopment) {
        console.log(`[API Service] ${message}`, data || '');
      }
    },
  };
}

// Export individual APIs for backward compatibility
export { productsApi, clientsApi, ordersApi, pawnsApi, authApi };

// Export the main service
export default ApiService;