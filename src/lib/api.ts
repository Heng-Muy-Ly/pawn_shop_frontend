import axios from 'axios';
import { config } from './config';
import { authApi } from './auth-api';

// Create axios instance
const apiClient = axios.create({
  baseURL: config.apiUrl,
  timeout: config.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors and auto-refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
          try {
            // Try to refresh token
            const response = await authApi.refreshToken(refreshToken);
            
            if (response.code === 200 && response.result) {
              // Update stored token
              localStorage.setItem('access_token', response.result.access_token);
              
              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${response.result.access_token}`;
              return apiClient(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // No refresh token or refresh failed
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// API Response Types
export interface ApiResponse<T = unknown> {
  code: number;
  status: string;
  message?: string;
  result?: T;
}

// Product types
export interface Product {
  id: number;
  name: string;
  price?: number | null;
  amount?: number | null;
}

export interface ProductCreateData {
  prod_name: string;
  unit_price?: number;
  amount?: number;
}

export interface ProductUpdateData {
  prod_id?: number;
  prod_name?: string;
  unit_price?: number;
  amount?: number;
}

// Client types
export interface Client {
  cus_id?: number;
  cus_name: string;
  address: string;
  phone_number: string;
}

export interface ClientCreateData {
  cus_name: string;
  address: string;
  phone_number: string;
}

// Search parameters
export interface ClientSearchParams {
  phone_number?: string;
  cus_name?: string;
  cus_id?: number;
}

// Order types
export interface OrderItem {
  prod_id: number;
  prod_name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Order {
  order_id?: number;
  cus_id: number;
  cus_name: string;
  phone_number: string;
  order_date: string;
  total_amount: number;
  items: OrderItem[];
}

export interface OrderCreateData {
  order_id?: number;
  cus_id: number;
  cus_name: string;
  address: string;
  phone_number: string;
  order_date: string;
  order_deposit: number;
  order_product_detail: {
    prod_id: number;
    prod_name: string;
    order_weight: string | number;
    order_amount: number;
    product_sell_price: number;
    product_labor_cost: number;
    product_buy_price: number;
  }[];
}

// Pawn types
export interface PawnItem {
  item_name: string;
  item_description?: string;
  estimated_value: number;
}

export interface Pawn {
  pawn_id?: number;
  cus_id: number;
  cus_name: string;
  phone_number: string;
  pawn_date: string;
  total_value: number;
  interest_rate: number;
  duration_months: number;
  items: PawnItem[];
}

export interface PawnCreateData {
  pawn_id?: number;
  cus_id: number;
  cus_name: string;
  address: string;
  phone_number: string;
  pawn_date: string;
  pawn_expire_date: string;
  pawn_deposit: number;
  pawn_product_detail: {
    prod_id: number;
    prod_name: string;
    pawn_weight: string;
    pawn_amount: number;
    pawn_unit_price: number;
  }[];
}

// Products API - Based on your exact endpoints "/api/v1/product"
export const productsApi = {
  getAll: async (page = 1, limit = 10): Promise<ApiResponse<{products: Product[], pagination: any}>> => {
    const response = await apiClient.get(`product?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  create: async (product: ProductCreateData): Promise<ApiResponse<Product>> => {
    const response = await apiClient.post('product', product);
    return response.data;
  },
  
  update: async (updateData: ProductUpdateData): Promise<ApiResponse<Product>> => {
    const response = await apiClient.put('product', updateData);
    return response.data;
  },
  
  delete: async (productId: number): Promise<ApiResponse> => {
    const response = await apiClient.delete(`product/${productId}`);
    return response.data;
  },
  
  search: async (searchTerm: string): Promise<ApiResponse<Product[]>> => {
    const response = await apiClient.get(`product/search?search=${searchTerm}`);
    return response.data;
  }
};

// Clients API - Based on your Swagger "/api/v1/client"
export const clientsApi = {
  getAll: async (page = 1, limit = 10): Promise<ApiResponse<{clients: Client[], pagination: any}>> => {
    const response = await apiClient.get(`client?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  create: async (client: ClientCreateData): Promise<ApiResponse<Client>> => {
    const response = await apiClient.post('client', client);
    return response.data;
  },

  getByPhone: async (phoneNumber: string): Promise<ApiResponse<Client>> => {
    const response = await apiClient.get(`client/${phoneNumber}`);
    return response.data;
  }
};

// Orders API - Based on your Swagger "/api/v1/order"
export const ordersApi = {
  getAll: async (): Promise<ApiResponse<Order[]>> => {
    const response = await apiClient.get('order');
    return response.data;
  },

  create: async (order: OrderCreateData): Promise<ApiResponse<Order>> => {
    const response = await apiClient.post('order', order);
    return response.data;
  },
  
  getAllClientOrders: async (params?: { page?: number; search_id?: number; search_name?: string; search_phone?: string; search_address?: string }): Promise<ApiResponse<Order[]>> => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.search_id) {
      queryParams.append('search_id', params.search_id.toString());
    }
    if (params?.search_name) {
      queryParams.append('search_name', params.search_name);
    }
    if (params?.search_phone) {
      queryParams.append('search_phone', params.search_phone);
    }
    if (params?.search_address) {
      queryParams.append('search_address', params.search_address);
    }
    
    const url = queryParams.toString() 
      ? `order/all_client?${queryParams.toString()}`
      : 'order/all_client';

    const response = await apiClient.get(url);
    return response.data;
  },

  getClientOrderById: async (clientId: string): Promise<ApiResponse<Order[]>> => {
    const response = await apiClient.get(`order/client/${clientId}`);
    return response.data;
  },

  search: async (params: ClientSearchParams): Promise<ApiResponse<Order[]>> => {
    const searchParams = new URLSearchParams();
    if (params.cus_id) searchParams.append('cus_id', params.cus_id.toString());
    if (params.cus_name) searchParams.append('cus_name', params.cus_name);
    if (params.phone_number) searchParams.append('phone_number', params.phone_number);

    const response = await apiClient.get(`order/search?${searchParams.toString()}`);
    return response.data;
  },

  getNextOrderId: async (): Promise<ApiResponse<{ next_order_id: number }>> => {
    const response = await apiClient.get('order/next-id');
    return response.data;
  },

  getLastOrders: async (): Promise<ApiResponse<Order[]>> => {
    console.log('🔍 Calling getLastOrders endpoint: order (to get all orders)');
    try {
      const response = await apiClient.get('order');
      console.log('🔍 getLastOrders response:', response);
      console.log('🔍 getLastOrders response.data:', response.data);
      
      // If we get orders, return only the last 3
      if (response.data.code === 200 && response.data.result && Array.isArray(response.data.result)) {
        const allOrders = response.data.result;
        const lastOrders = allOrders.slice(-3); // Get last 3 orders
        console.log('🔍 Returning last 3 orders:', lastOrders);
        
        return {
          ...response.data,
          result: lastOrders
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('🔍 Error in getLastOrders:', error);
      throw error;
    }
  },

  printOrder: async (orderId: number): Promise<ApiResponse> => {
    const response = await apiClient.get(`order/print?order_id=${orderId}`);
    return response.data;
  },
};

// Pawns API - Based on your Swagger "/api/v1/pawn"
export const pawnsApi = {
  getById: async (pawnId: number): Promise<ApiResponse<Pawn>> => {
    const response = await apiClient.get(`pawn/${pawnId}`);
    return response.data;
  },
  
  create: async (pawn: PawnCreateData): Promise<ApiResponse<Pawn>> => {
    const response = await apiClient.post('pawn', pawn);
    return response.data;
  },

  getAllClientPawns: async (params?: { page?: number; search_id?: number; search_name?: string; search_phone?: string; search_address?: string }): Promise<ApiResponse<Pawn[]>> => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.search_id) {
      queryParams.append('search_id', params.search_id.toString());
    }
    if (params?.search_name) {
      queryParams.append('search_name', params.search_name);
    }
    if (params?.search_phone) {
      queryParams.append('search_phone', params.search_phone);
    }
    if (params?.search_address) {
      queryParams.append('search_address', params.search_address);
    }
    
    const url = queryParams.toString() 
      ? `pawn/all_client?${queryParams.toString()}`
      : 'pawn/all_client';

    const response = await apiClient.get(url);
    return response.data;
  },

  getClientPawnById: async (clientId: string): Promise<ApiResponse<Pawn[]>> => {
    const response = await apiClient.get(`pawn/client/${clientId}`);
    return response.data;
  },
  
  search: async (params: ClientSearchParams): Promise<ApiResponse<Pawn[]>> => {
    const searchParams = new URLSearchParams();
    if (params.cus_id) searchParams.append('cus_id', params.cus_id.toString());
    if (params.cus_name) searchParams.append('cus_name', params.cus_name);
    if (params.phone_number) searchParams.append('phone_number', params.phone_number);

    const response = await apiClient.get(`pawn/search?${searchParams.toString()}`);
    return response.data;
  },

  getNextPawnId: async (): Promise<ApiResponse<{ next_id: number }>> => {
    const response = await apiClient.get('pawn/next-id');
    return response.data;
  },

  getLastPawns: async (): Promise<ApiResponse<Pawn[]>> => {
    const response = await apiClient.get('pawn/last');
    return response.data;
  },

  printPawn: async (pawnId: number): Promise<ApiResponse> => {
    const response = await apiClient.get(`pawn/print?pawn_id=${pawnId}`);
    return response.data;
  },
};

// Test function to debug API issues
export const testApiConnection = async () => {
  console.log('🧪 Testing API connection...');
  
  try {
    // Test basic connectivity
    const response = await apiClient.get('order');
    console.log('✅ API connection successful');
    console.log('📊 Response:', response.data);
    
    if (response.data.code === 200) {
      console.log('✅ API returned success code');
      if (response.data.result) {
        console.log(`📦 Found ${Array.isArray(response.data.result) ? response.data.result.length : 'non-array'} result(s)`);
      } else {
        console.log('❌ No result in response');
      }
    } else {
      console.log('❌ API returned error code:', response.data.code);
      console.log('📝 Error message:', response.data.message);
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ API connection failed:', error);
    throw error;
  }
};

export default apiClient;