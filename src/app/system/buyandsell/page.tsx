// buyandsell/page.tsx - Updated with Reset Both Forms Functionality and Client Search Status
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { clientsApi, productsApi, ordersApi, Client, Product, testApiConnection } from '@/lib/api';
import { colors } from '@/lib/colors';
import { getMessage, getDataLoadedMessage, getClientFoundMessage } from '@/lib/messages';

// Import local components from the same folder
import ClientForm from './ClientForm';
import OrderForm from './OrderForm';
import Notification from './Notification';
import LastOrders from '@/components/ui/LastOrders';

// Using API types directly

interface FormData {
  cus_name: string;
  address: string;
  phone_number: string;
}

interface NotificationState {
  type: 'success' | 'error';
  message: string;
}

// Last Orders Interfaces (renamed to avoid API conflicts)
interface LastOrderProduct {
  prod_name: string;
  prod_id: number;
  order_weight: string;
  order_amount: number;
  product_sell_price: number;
  product_labor_cost: number;
  product_buy_price: number;
  subtotal: number;
}

interface LastOrderInfo {
  order_id: number;
  order_date: string;
  order_deposit: number;
  total_amount: number;
  remaining_balance: number;
}

interface LastOrderClientInfo {
  cus_id: number;
  cus_name: string;
  address: string;
  phone_number: string;
}

interface LastOrderSummary {
  total_products: number;
  total_amount: number;
  deposit_paid: number;
  balance_due: number;
}

interface LastOrderData {
  order_info: LastOrderInfo;
  client_info: LastOrderClientInfo;
  products: LastOrderProduct[];
  summary: LastOrderSummary;
}

export default function BuyAndSellPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [foundClient, setFoundClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<FormData>({
    cus_name: '',
    address: '',
    phone_number: ''
  });

  // Add client search status state
  const [clientSearchStatus, setClientSearchStatus] = useState<'idle' | 'not-found' | 'found'>('idle');

  // Last Orders State
  const [lastOrders, setLastOrders] = useState<LastOrderData[]>([]);
  const [loadingLastOrders, setLoadingLastOrders] = useState(false);

  // Ref to trigger order form reset
  const orderFormResetRef = useRef<(() => void) | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    console.log('🔍 showNotification called with:', { type, message });
    setNotification({ type, message });
  };

  // Products loading removed - no longer needed since we removed the dropdown

  const loadClients = useCallback(async () => {
    try {
      const response = await clientsApi.getAll();
      if (response.code === 200 && response.result) {
        setClients(response.result.clients || response.result);
      } else {
        showNotification('error', getMessage('error', 'clientLoadError'));
      }
    } catch (error: unknown) {
      console.error('Error loading clients:', error);
      showNotification('error', getMessage('error', 'general'));
    }
  }, []);

  // Load Last 3 Orders Function - Using API
  const loadLastOrders = useCallback(async () => {
    setLoadingLastOrders(true);
    try {
      console.log('Loading last orders...');
      const response = await ordersApi.getLastOrders();
      console.log('Full response from getLastOrders:', response);
      
      if (response.code === 200 && response.result) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setLastOrders(response.result as any);
        console.log('Last orders loaded successfully:', response.result);
        if (response.result.length > 0) {
          console.log(`Found ${response.result.length} orders`);
          // showNotification('success', `ទាញយកការបញ្ជាទិញចុងក្រោយ ${response.result.length} ចំនួនបានជោគជ័យ`);
        } else {
          console.log('No orders found in result array');
        }
      } else {
        console.log('No orders found - response details:', {
          code: response.code,
          status: response.status,
          message: response.message,
          result: response.result
        });
        setLastOrders([]);
        // Always use our Khmer translation instead of API English messages
        showNotification('error', getMessage('error', 'orderLoadError'));
      }
    } catch (error: unknown) {
      console.error('Error loading last orders:', error);
      
      const apiError = error as { response?: { status?: number }; message?: string };
      
      // Check if it's a JSON parsing error (HTML response)
      if (apiError.message?.includes('Unexpected token') || apiError.message?.includes('JSON')) {
        showNotification('error', getMessage('error', 'backendError'));
      } else if (apiError.response?.status === 404) {
        showNotification('error', getMessage('error', 'apiEndpointNotFound'));
      } else if (apiError.response?.status === 401) {
        showNotification('error', getMessage('error', 'unauthorized'));
      } else {
        showNotification('error', getMessage('error', 'general'));
      }
      
      setLastOrders([]);
    } finally {
      setLoadingLastOrders(false);
    }
  }, []);

  useEffect(() => {
    // Test API connection first
    testApiConnection().then(() => {
      loadClients();
      loadLastOrders(); // Load last orders on component mount
    }).catch(error => {
      console.error('API test failed:', error);
      showNotification('error', getMessage('error', 'networkError'));
    });
  }, [loadClients, loadLastOrders]);

  const handleClientCreated = () => {
    loadClients();
  };

  const handleOrderCreated = () => {
    // Reset client form (left panel)
    setFormData({
      cus_name: '',
      address: '',
      phone_number: ''
    });
    // Clear found client
    setFoundClient(null);
    // Reset search status
    setClientSearchStatus('idle');
    // Reload clients to update the next ID
    loadClients();
    // Reload last orders to show the new order
    loadLastOrders();
  };

  // Updated handleClientFound with proper client search status handling
  const handleClientFound = (client: Client | null, searchPerformed: boolean = false, searchTerm?: string) => {
    setFoundClient(client);
    
    if (searchPerformed) {
      if (client) {
        setClientSearchStatus('found');
        showNotification('success', getClientFoundMessage(client.cus_name));
      } else {
        setClientSearchStatus('not-found');
        const message = searchTerm 
          ? `${getMessage('error', 'clientNotFound')} "${searchTerm}"` 
          : getMessage('error', 'clientNotFound');
        showNotification('error', message);
      }
    } else {
      setClientSearchStatus('idle');
    }
  };

  const handleFormDataChange = (newFormData: FormData) => {
    setFormData(newFormData);
  };

  // Function to reset both forms when called from ClientForm
  const handleResetBothForms = () => {
    console.log('Resetting both forms from page component');
    
    // Reset client form data
    setFormData({
      cus_name: '',
      address: '',
      phone_number: ''
    });
    setFoundClient(null);
    setClientSearchStatus('idle');
    
    // Reset order form by calling the ref function
    if (orderFormResetRef.current) {
      orderFormResetRef.current();
    }
  };

  // Function to register order form reset function
  const registerOrderFormReset = (resetFunction: () => void) => {
    orderFormResetRef.current = resetFunction;
  };

  return (
    <div 
      className="min-h-screen w-full" 
      style={{ backgroundColor: colors.secondary[50] }}
    >
      {/* Notification */}
      <Notification 
        notification={notification} 
        onClose={() => setNotification(null)} 
      />

      {/* Main Content */}
      <div className="w-full p-2">
        <div className="w-full flex flex-col gap-4">
          
          {/* Top Row - Client Form and Order Form */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4" style={{ minHeight: '400px' }}>
            {/* Left Panel - Client Form (1/3 width on xl screens) */}
            <div className="xl:col-span-1 flex flex-col">
              <ClientForm
                clients={clients}
                onClientCreated={handleClientCreated}
                onNotification={showNotification}
                onClientFound={handleClientFound}
                onFormDataChange={handleFormDataChange}
                formData={formData}
                foundClient={foundClient}
                onResetBothForms={handleResetBothForms}
                clientSearchStatus={clientSearchStatus} // Pass search status to ClientForm
              />
            </div>

            {/* Right Panel - Order Form (2/3 width on xl screens) */}
            <div className="xl:col-span-2 flex flex-col">
              <OrderForm
                onNotification={showNotification}
                onOrderCreated={handleOrderCreated}
                formData={formData}
                foundClient={foundClient}
                onRegisterResetFunction={registerOrderFormReset}
              />
            </div>  
          </div>

          {/* Bottom Row - Last Orders Panel */}
          <div className="w-full" style={{ minHeight: '300px' }}>
            <LastOrders
              orders={lastOrders}
              loading={loadingLastOrders}
              onRefresh={loadLastOrders}
              onNotification={showNotification}
            />
          </div>
        </div>
      </div>
    </div>
  );
}