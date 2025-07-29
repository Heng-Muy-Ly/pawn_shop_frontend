import ApiService from './api-service';

// Example usage of the API service in your components

// Authentication Examples
export const authExamples = {
  // Login user
  async loginUser(phoneNumber: string, password: string) {
    try {
      const response = await ApiService.auth.signIn({ phone_number: phoneNumber, password });
      if (response.code === 200 && response.result) {
        // Store tokens
        localStorage.setItem('access_token', response.result.access_token);
        localStorage.setItem('refresh_token', response.result.refresh_token);
        return response.result;
      }
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Create new user
  async createUser(phoneNumber: string, password: string, role = 'user') {
    try {
      const response = await ApiService.auth.createUser({
        phone_number: phoneNumber,
        password,
        role
      });
      return response;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }
};

// Product Examples
export const productExamples = {
  // Get all products
  async getAllProducts(page = 1, limit = 10) {
    try {
      const response = await ApiService.products.getAll(page, limit);
      return response.result?.products || [];
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  },

  // Create new product
  async createProduct(productData: {
    prod_name: string;
    unit_price?: number;
    amount?: number;
  }) {
    try {
      const response = await ApiService.products.create(productData);
      return response.result;
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  },

  // Search products
  async searchProducts(searchTerm: string) {
    try {
      const response = await ApiService.products.search(searchTerm);
      return response.result || [];
    } catch (error) {
      console.error('Search products error:', error);
      throw error;
    }
  }
};

// Client Examples
export const clientExamples = {
  // Get all clients
  async getAllClients(page = 1, limit = 10) {
    try {
      const response = await ApiService.clients.getAll(page, limit);
      return response.result?.clients || [];
    } catch (error) {
      console.error('Get clients error:', error);
      throw error;
    }
  },

  // Create new client
  async createClient(clientData: {
    cus_name: string;
    address: string;
    phone_number: string;
  }) {
    try {
      const response = await ApiService.clients.create(clientData);
      return response.result;
    } catch (error) {
      console.error('Create client error:', error);
      throw error;
    }
  },

  // Get client by phone number
  async getClientByPhone(phoneNumber: string) {
    try {
      const response = await ApiService.clients.getByPhone(phoneNumber);
      return response.result;
    } catch (error) {
      console.error('Get client error:', error);
      throw error;
    }
  }
};

// Order Examples
export const orderExamples = {
  // Get all orders
  async getAllOrders() {
    try {
      const response = await ApiService.orders.getAll();
      return response.result || [];
    } catch (error) {
      console.error('Get orders error:', error);
      throw error;
    }
  },

  // Create new order
  async createOrder(orderData: {
    cus_id: number;
    cus_name: string;
    address: string;
    phone_number: string;
    order_date: string;
    order_deposit: number;
    order_product_detail: Array<{
      prod_id: number;
      prod_name: string;
      order_weight: string | number;
      order_amount: number;
      product_sell_price: number;
      product_labor_cost: number;
      product_buy_price: number;
    }>;
  }) {
    try {
      const response = await ApiService.orders.create(orderData);
      return response.result;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },

  // Get client orders
  async getClientOrders(params?: {
    page?: number;
    search_id?: number;
    search_name?: string;
    search_phone?: string;
    search_address?: string;
  }) {
    try {
      const response = await ApiService.orders.getAllClientOrders(params);
      return response.result || [];
    } catch (error) {
      console.error('Get client orders error:', error);
      throw error;
    }
  },

  // Print order
  async printOrder(orderId: number) {
    try {
      const response = await ApiService.orders.printOrder(orderId);
      return response.result;
    } catch (error) {
      console.error('Print order error:', error);
      throw error;
    }
  }
};

// Pawn Examples
export const pawnExamples = {
  // Get pawn by ID
  async getPawnById(pawnId: number) {
    try {
      const response = await ApiService.pawns.getById(pawnId);
      return response.result;
    } catch (error) {
      console.error('Get pawn error:', error);
      throw error;
    }
  },

  // Create new pawn
  async createPawn(pawnData: {
    cus_id: number;
    cus_name: string;
    address: string;
    phone_number: string;
    pawn_date: string;
    pawn_expire_date: string;
    pawn_deposit: number;
    pawn_product_detail: Array<{
      prod_id: number;
      prod_name: string;
      pawn_weight: string;
      pawn_amount: number;
      pawn_unit_price: number;
    }>;
  }) {
    try {
      const response = await ApiService.pawns.create(pawnData);
      return response.result;
    } catch (error) {
      console.error('Create pawn error:', error);
      throw error;
    }
  },

  // Get all client pawns
  async getAllClientPawns() {
    try {
      const response = await ApiService.pawns.getAllClientPawns();
      return response.result || [];
    } catch (error) {
      console.error('Get client pawns error:', error);
      throw error;
    }
  },

  // Print pawn
  async printPawn(pawnId: number) {
    try {
      const response = await ApiService.pawns.printPawn(pawnId);
      return response.result;
    } catch (error) {
      console.error('Print pawn error:', error);
      throw error;
    }
  }
};

// React Hook Example
export const useApiService = () => {
  return {
    auth: authExamples,
    products: productExamples,
    clients: clientExamples,
    orders: orderExamples,
    pawns: pawnExamples,
    utils: ApiService.utils,
  };
}; 