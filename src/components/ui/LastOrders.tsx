// components/ui/LastOrders.tsx
'use client';

import { useState } from 'react';
import { colors } from '@/lib/colors';
import { 
  Clock,
  User,
  Package,
  Printer,
  RefreshCw,
  Calendar,
  Phone,
  MapPin
} from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { printOrder } from '@/lib/printOrder'; // Import the print utility

// Order Interfaces - Updated to match API response structure
interface OrderItem {
  prod_id: number;
  prod_name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface Order {
  order_id?: number;
  cus_id: number;
  cus_name: string;
  phone_number: string;
  order_date: string;
  total_amount: number;
  items: OrderItem[];
}

interface LastOrdersProps {
  orders: Order[];
  loading: boolean;
  onRefresh: () => void;
  onNotification: (type: 'success' | 'error', message: string) => void;
}

export default function LastOrders({ 
  orders, 
  loading, 
  onRefresh, 
  onNotification 
}: LastOrdersProps) {
  const [printing, setPrinting] = useState<{ [key: number]: boolean }>({});

  // Debug: Log the first order to see its structure
  if (orders.length > 0) {
    console.log('🔍 LastOrders - First order structure:', orders[0]);
    console.log('🔍 LastOrders - First order items:', orders[0].items);
  }

  // Simplified print handler using the utility function
  const handlePrintOrder = async (orderId: number) => {
    setPrinting(prev => ({ ...prev, [orderId]: true }));
    
    try {
      await printOrder(orderId, onNotification);
    } catch (error) {
      // Error handling is already done in the print utility
      console.error('Print failed:', error);
    } finally {
      setPrinting(prev => ({ ...prev, [orderId]: false }));
    }
  };

  return (
    <Card 
      title="ការបញ្ជាទិញចុងក្រោយ"
      className="h-full flex flex-col"
      action={
        <Button
          onClick={onRefresh}
          loading={loading}
          icon={<RefreshCw className="h-4 w-4" />}
          size="sm"
          variant="secondary"
        >
          ទាញយកថ្មី
        </Button>
      }
    >
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" style={{ color: colors.primary[500] }} />
              <p style={{ color: colors.secondary[600] }}>កំពុងទាញយកទិន្នន័យ...</p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 mx-auto mb-4" style={{ color: colors.secondary[400] }} />
            <p style={{ color: colors.secondary[600] }}>មិនមានការបញ្ជាទិញណាមួយទេ</p>
            <p className="text-xs mt-2" style={{ color: colors.secondary[500] }}>
              ការបញ្ជាទិញថ្មីនឹងបង្ហាញនៅទីនេះ
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
            {orders.map((order, index) => (
              <div 
                key={order.order_id || `order-${index}`}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                style={{ 
                  borderColor: colors.secondary[200],
                  backgroundColor: index === 0 ? colors.success[25] : 'white'
                }}
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: index === 0 ? colors.success[100] : colors.primary[100],
                        color: index === 0 ? colors.success[700] : colors.primary[700]
                      }}
                    >
                      #{order.order_id}
                      {index === 0 && ' (ថ្មីបំផុត)'}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handlePrintOrder(order.order_id!)}
                    loading={printing[order.order_id!]}
                    icon={<Printer className="h-4 w-4" />}
                    size="sm"
                    variant="secondary"
                    disabled={printing[order.order_id!]}
                  >
                    {printing[order.order_id!] ? 'កំពុងបោះពុម្ព...' : 'បោះពុម្ព'}
                  </Button>
                </div>

                {/* Order Date */}
                <div className="flex items-center text-sm mb-3" style={{ color: colors.secondary[600] }}>
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(order.order_date).toLocaleDateString('km-KH')}
                </div>

                {/* Customer Info */}
                <div className="mb-4">
                  <div className="flex items-center mb-1">
                    <User className="h-4 w-4 mr-2" style={{ color: colors.secondary[500] }} />
                    <span className="text-sm font-medium" style={{ color: colors.secondary[700] }}>
                      {order.cus_name}
                    </span>
                  </div>
                  <div className="flex items-center mb-1">
                    <Phone className="h-4 w-4 mr-2" style={{ color: colors.secondary[500] }} />
                    <span className="text-sm" style={{ color: colors.secondary[600] }}>
                      {order.phone_number}
                    </span>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-2 mb-4 p-3 rounded" style={{ backgroundColor: colors.secondary[50] }}>
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: colors.secondary[600] }}>ផលិតផល:</span>
                    <span className="text-sm font-medium">{order.items?.length || 0} ប្រភេទ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: colors.secondary[600] }}>សរុប:</span>
                    <span className="text-sm font-medium">${(order.total_amount || 0).toFixed(2)}</span>
                  </div>
                </div>

                {/* Products List */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2" style={{ color: colors.secondary[500] }} />
                    <span className="text-sm font-medium" style={{ color: colors.secondary[700] }}>
                      បញ្ជីផលិតផល
                    </span>
                  </div>
                  <div className="space-y-1">
                    {order.items && order.items.length > 0 ? (
                      <>
                        {order.items.slice(0, 3).map((item, itemIndex) => (
                          <div 
                            key={`${order.order_id || 'unknown'}-item-${item.prod_id || itemIndex}-${itemIndex}`}
                            className="flex justify-between items-center py-1 px-2 rounded text-sm"
                            style={{ backgroundColor: colors.secondary[25] }}
                          >
                            <span className="truncate mr-2" title={item.prod_name}>
                              {item.prod_name}
                            </span>
                            <div className="flex items-center space-x-2 text-xs flex-shrink-0" style={{ color: colors.secondary[600] }}>
                              <span>x{item.quantity}</span>
                              <span className="font-medium">${item.total.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="text-xs text-center py-1" style={{ color: colors.secondary[500] }}>
                            ... និង {order.items.length - 3} ផលិតផលផ្សេងទៀត
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-xs text-center py-2" style={{ color: colors.secondary[500] }}>
                        មិនមានផលិតផល
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}