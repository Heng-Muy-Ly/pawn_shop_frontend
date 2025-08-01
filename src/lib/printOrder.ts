// lib/print.ts - Print utility functions
import { ordersApi } from '@/lib/api';

// Print Data Interfaces
interface PrintProduct {
  prod_name: string;
  order_weight: string;
  order_amount: number;
  product_sell_price: number;
  product_labor_cost: number;
  product_buy_price: number;
  subtotal: number;
}

interface PrintData {
  header: {
    title: string;
    order_id: string;
    date: string;
  };
  customer: {
    name: string;
    phone: string;
    address: string;
    customer_id?: string;
  };
  items: PrintProduct[];
  totals: {
    subtotal: number;
    total_labor: number;
    grand_total: number;
    deposit: number;
    balance_due: number;
  };
  footer: {
    thank_you: string;
    note: string;
  };
}

// Backend data interfaces
interface BackendProduct {
  prod_name?: string;
  order_weight?: string;
  order_amount?: number;
  product_sell_price?: number;
  product_labor_cost?: number;
  product_buy_price?: number;
}

interface BackendCustomer {
  customer_name?: string;
  phone_number?: string;
  address?: string;
  cus_id?: number;
}

interface BackendOrderData {
  order_id?: number;
  order_date?: string;
  order_deposit?: number;
  customer?: BackendCustomer;
  products?: BackendProduct[];
}

// Transform backend data to print format
export const transformPrintData = (backendData: BackendOrderData): PrintData => {
  try {
    // Calculate totals
    const subtotal = backendData.products?.reduce((sum: number, item: BackendProduct) => {
      return sum + ((item.order_amount || 0) * (item.product_sell_price || 0));
    }, 0) || 0;

    const totalLabor = backendData.products?.reduce((sum: number, item: BackendProduct) => {
      return sum + (item.product_labor_cost || 0);
    }, 0) || 0;

    const grandTotal = subtotal + totalLabor;
    const deposit = backendData.order_deposit || 0;
    const balanceDue = grandTotal - deposit;

    return {
      header: {
        title: 'វិក្កយបត្រ',
        order_id: `ការបញ្ជាទិញលេខ #${backendData.order_id}`,
        date: backendData.order_date || new Date().toISOString().split('T')[0]
      },
      customer: {
        name: backendData.customer?.customer_name || 'មិនបានបញ្ចូល',
        phone: backendData.customer?.phone_number || 'មិនបានបញ្ចូល',
        address: backendData.customer?.address || 'មិនបានបញ្ចូល',
        customer_id: backendData.customer?.cus_id?.toString() || 'មិនបានបញ្ចូល'
      },
      items: backendData.products?.map((product: BackendProduct) => ({
        prod_name: product.prod_name || 'មិនបានបញ្ចូល',
        order_weight: product.order_weight || '-',
        order_amount: product.order_amount || 0,
        product_sell_price: product.product_sell_price || 0,
        product_labor_cost: product.product_labor_cost || 0,
        product_buy_price: product.product_buy_price || 0,
        subtotal: (product.order_amount || 0) * (product.product_sell_price || 0)
      })) || [],
      totals: {
        subtotal: subtotal,
        total_labor: totalLabor,
        grand_total: grandTotal,
        deposit: deposit,
        balance_due: balanceDue
      },
      footer: {
        thank_you: 'អរគុណសម្រាប់ការទិញ!',
        note: 'សូមរក្សាវិក្កយបត្រនេះសម្រាប់ការយោង។'
      }
    };
  } catch (error) {
    console.error(' Error transforming print data:', error);
    throw new Error('Failed to transform print data');
  }
};

// Generate the HTML for printing using your preferred format
export const generatePrintHTML = (printData: PrintData, orderId: number): string => {
  try {
    // Validate print data structure
    if (!printData || !printData.header || !printData.customer || !printData.items || !printData.totals) {
      console.error(' Invalid print data structure:', printData);
      throw new Error('Print data is missing required fields');
    }

    // Convert items to the format expected by your template
    const orders = printData.items.map((item) => ({
      product: {
        prod_name: item.prod_name,
        order_weight: item.order_weight,
        order_amount: item.order_amount,
        product_sell_price: item.product_sell_price,
        product_labor_cost: item.product_labor_cost,
        product_buy_price: item.product_buy_price
      }
    }));

    return `
      <html>
      <head>
        <title>វិក្កយបត្រ: ${orderId}</title>
        <style>
            @page { size: A4; margin: 10mm; }
        body { font-family: 'Khmer OS Battambang', Arial, sans-serif; padding: 20px; }
        .header-section {
          display: flex;
          justify-content: space-between; 
          align-items: center;
          margin-bottom: 20px;
          padding-right: 20px;    
        }

        .logo-section {
          padding-left: 1px;
        }

        .logo {
          margin-top: 25px;
          max-height: 100px;
          width: auto;
        }
        .date-id-section {
          display: flex;
          flex-direction: column;   
          text-align: right;        
          gap: 5px;                 
        }

        .date-section {
          font-size: 14px;
        }

        .id-section {
          font-size: 14px;
        }
                                                  
        .invoice-title { text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; }
        .customer-info { display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 20px; }
        .customer-info div { padding: 5px 0; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid black; padding: 8px; text-align: center; }
        .total-section { width: 30%; margin-left: auto; border-collapse: collapse; }
        .total-section tr { height: 30px; }
        .total-section td { border: 1px solid black; padding: 5px 10px; font-size: 14px; }
        .total-section td:first-child { text-align: left; width: 40%; }
        .total-section td:last-child { text-align: right; width: 60%; }
        .signatures { display: flex; justify-content: space-between; margin-top: 50px; text-align: center; }
        .signatures div { width: 200px; }
        </style>
      </head>
      <body>

         <div class="header-section">
          <div class="logo-section">
            <img src="/logo.png" alt="Company Logo" class="logo">
          </div>
          <div class="date-id-section">
            <div class="date-section">កាលបរិច្ឆេទ៖ ${printData.header.date}</div>
            <div class="id-section">លេខវិក្កយបត្រ៖ ${orderId}</div>
          </div>
        </div>

        <div class="invoice-title">វិក្កយបត្រ<br>INVOICE</div>

        <div class="customer-info">
          <div>
            <div>លេខអតិថិជន៖ ${printData.customer.customer_id}</div>
            <div>លេខទូរស័ព្ទ៖ ${printData.customer.phone}</div>
            <div>អាសយដ្ឋាន៖ ${printData.customer.address}</div>
          </div>
          <div>
             
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>ល.រ</th>
              <th>ឈ្មោះទំនិញ</th>
              <th>ទំងន់</th>
              <th>ចំនួន</th>
              <th>តម្លៃ</th>
              <th>ឈ្នូល</th>
              <th>លក់វិញ</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map((orderItem, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${orderItem.product.prod_name}</td>
                <td>${orderItem.product.order_weight}</td>
                <td>${orderItem.product.order_amount}</td>
                <td>${orderItem.product.product_sell_price}</td>
                <td>${orderItem.product.product_labor_cost}</td>
                <td>${orderItem.product.product_buy_price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <table class="total-section">
          <tr><td>សរុប</td><td>${printData.totals.grand_total.toFixed(2)}</td></tr>
          <tr><td>កក់មុន</td><td>${printData.totals.deposit.toFixed(2)}</td></tr>
          <tr><td>នៅខ្វះ</td><td>${printData.totals.balance_due.toFixed(2)}</td></tr>
        </table>

        <div class="signatures">
          <div>ហត្ថលេខាអ្នកទិញ</div>
          <div>ហត្ថលេខាអ្នកលក់</div>
        </div>

        <script>
          window.onload = function() {
            window.print();
            window.close();
          };
        </script>
      </body>
      </html>
    `;
  } catch (error) {
    console.error(' Error generating print HTML:', error);
    throw new Error('Failed to generate print HTML');
  }
};

// Main print function that handles the entire print process
export const printOrder = async (
  orderId: number,
  onNotification: (type: 'success' | 'error', message: string) => void
): Promise<void> => {
  try {
    console.log(`🖨 Starting print for order ID: ${orderId}`);
    const response = await ordersApi.printOrder(orderId);
    
    if (response.code === 200 && response.result) {
      console.log(' Print data received:', response.result);
      
      // Transform the backend data to match our print format
      const transformedData = transformPrintData(response.result);
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        // Generate HTML for printing using your preferred format
        const printHTML = generatePrintHTML(transformedData, orderId);
        
        printWindow.document.write(printHTML);
        printWindow.document.close();
        
        onNotification('success', 'បានបើកទំព័របោះពុម្ពដោយជោគជ័យ');
      } else {
        onNotification('error', 'មិនអាចបើកទំព័របោះពុម្ពបានទេ - browser បានរារាំង popup');
      }
    } else {
      console.log(' Print failed:', response);
      onNotification('error', response.message || 'មានបញ្ហាក្នុងការរៀបចំទិន្នន័យសម្រាប់បោះពុម្ព');
    }
  } catch (error: unknown) {
    console.error(' Error printing order:', error);
    
    // Better error handling for print functionality
    const errorMessage = error instanceof Error ? error.message : '';
    const errorResponse = error && typeof error === 'object' && 'response' in error ? error.response as { status?: number } : null;
    
    if (errorMessage?.includes('Unexpected token') || errorMessage?.includes('JSON')) {
      onNotification('error', 'Print API មិនត្រឹមត្រូវ - សូមពិនិត្យ backend');
    } else if (errorResponse?.status === 404) {
      onNotification('error', `ការបញ្ជាទិញលេខ ${orderId} មិនត្រូវបានរកឃើញ`);
    } else if (errorResponse?.status === 401) {
      onNotification('error', 'សូមចូលប្រើប្រាស់ម្តងទៀត');
    } else {
      onNotification('error', 'មានបញ្ហាក្នុងការបោះពុម្ព');
    }
  }
};