import { productsApi, clientsApi, ordersApi, pawnsApi } from './api';
import { authApi } from './auth-api';

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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/health`);
        return response.ok;
      } catch {
        return false;
      }
    },

    // Get API base URL
    getBaseUrl(): string {
      return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
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
  };
}

// Export individual APIs for backward compatibility
export { productsApi, clientsApi, ordersApi, pawnsApi, authApi };

// Export the main service
export default ApiService; 