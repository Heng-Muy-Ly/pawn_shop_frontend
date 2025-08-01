// Centralized message system for consistent Khmer translations
export const messages = {
  // Success Messages
  success: {
    // Client related
    clientCreated: 'អតិថិជនត្រូវបានបង្កើតដោយជោគជ័យ',
    clientFound: 'រកឃើញអតិថិជន',
    clientUpdated: 'អតិថិជនត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ',
    
    // Product related
    productCreated: 'ទំនិញត្រូវបានបង្កើតដោយជោគជ័យ',
    productUpdated: 'ទំនិញត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ',
    productDeleted: 'ទំនិញត្រូវបានលុបដោយជោគជ័យ',
    
    // Order related
    orderCreated: 'ការបញ្ជាទិញត្រូវបានបង្កើតដោយជោគជ័យ',
    orderUpdated: 'ការបញ្ជាទិញត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ',
    orderDeleted: 'ការបញ្ជាទិញត្រូវបានលុបដោយជោគជ័យ',
    
    // Pawn related
    pawnCreated: 'ការបញ្ចាំត្រូវបានបង្កើតដោយជោគជ័យ',
    pawnUpdated: 'ការបញ្ចាំត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ',
    pawnDeleted: 'ការបញ្ចាំត្រូវបានលុបដោយជោគជ័យ',
    
    // Settings
    settingsSaved: 'ការកំណត់ត្រូវបានរក្សាទុកដោយជោគជ័យ',
    
    // Data loading
    dataLoaded: 'ទិន្នន័យត្រូវបានទាញយកដោយជោគជ័យ',
    searchCompleted: 'ការស្វែងរកត្រូវបានបញ្ចប់ដោយជោគជ័យ',
    
    // Print related
    printSuccess: 'ការបោះពុម្ពត្រូវបានបញ្ចប់ដោយជោគជ័យ',
  },

  // Error Messages
  error: {
    // General errors
    general: 'មានបញ្ហាក្នុងការទាញយកទិន្នន័យ',
    networkError: 'មានបញ្ហាក្នុងការភ្ជាប់ទៅម៉ាស៊ីនបម្រើ',
    serverError: 'មានបញ្ហាពីម៉ាស៊ីនបម្រើ សូមព្យាយាមម្តងទៀត',
    unauthorized: 'សូមចូលប្រើប្រាស់ម្តងទៀត',
    notFound: 'ព័ត៌មានមិនត្រូវបានរកឃើញ',
    invalidData: 'ទិន្នន័យមិនត្រឹមត្រូវ',
    
    // API related
    apiEndpointNotFound: 'API endpoint មិនត្រូវបានរកឃើញ',
    backendError: 'Backend មិនត្រឹមត្រូវ - សូមពិនិត្យ API endpoint',
    jsonParseError: 'មានបញ្ហាក្នុងការបកស្រាយទិន្នន័យ',
    
    // Client related
    clientNotFound: 'មិនរកឃើញអតិថិជនដែលមានលេខទូរសព្ទនេះទេ',
    clientLoadError: 'មិនអាចទាញយកបញ្ជីអតិថិជនបានទេ',
    clientSaveError: 'មានបញ្ហាក្នុងការរក្សាទុកអតិថិជន',
    clientSearchError: 'មានបញ្ហាក្នុងការស្វែងរកអតិថិជន',
    clientDetailError: 'មិនអាចទាញយកព័ត៌មានលម្អិតអតិថិជនបានទេ',
    
    // Product related
    productLoadError: 'មិនអាចទាញយកបញ្ជីទំនិញបានទេ',
    productSaveError: 'មានបញ្ហាក្នុងការរក្សាទុកទំនិញ',
    productDeleteError: 'មិនអាចលុបទំនិញបានទេ',
    productNotFound: 'មិនរកឃើញទំនិញនេះទេ',
    
    // Order related
    orderLoadError: 'មិនអាចទាញយកការបញ្ជាទិញចុងក្រោយបានទេ',
    orderSaveError: 'មានបញ្ហាក្នុងការបង្កើតការបញ្ជាទិញ',
    orderUpdateError: 'មានបញ្ហាក្នុងការធ្វើបច្ចុប្បន្នភាពការបញ្ជាទិញ',
    orderDeleteError: 'មានបញ្ហាក្នុងការលុបការបញ្ជាទិញ',
    orderNotFound: 'មិនរកឃើញការបញ្ជាទិញនេះទេ',
    
    // Pawn related
    pawnLoadError: 'មិនអាចទាញយកបញ្ជីការបញ្ចាំបានទេ',
    pawnSaveError: 'មានបញ្ហាក្នុងការបង្កើតការបញ្ចាំ',
    pawnUpdateError: 'មានបញ្ហាក្នុងការធ្វើបច្ចុប្បន្នភាពការបញ្ចាំ',
    pawnDeleteError: 'មានបញ្ហាក្នុងការលុបការបញ្ចាំ',
    pawnNotFound: 'មិនរកឃើញការបញ្ចាំនេះទេ',
    
    // Validation errors
    requiredField: 'សូមបញ្ចូលព័ត៌មានដែលត្រូវការ',
    invalidPhone: 'លេខទូរសព្ទមិនត្រឹមត្រូវ',
    invalidDate: 'កាលបរិច្ចេទមិនត្រឹមត្រូវ',
    invalidAmount: 'ចំនួនទឹកប្រាក់មិនត្រឹមត្រូវ',
    invalidQuantity: 'ចំនួនមិនត្រឹមត្រូវ',
    
    // Form validation
    customerNameRequired: 'សូមបញ្ចូលឈ្មោះអតិថិជន',
    phoneNumberRequired: 'សូមបញ្ចូលលេខទូរសព្ទ',
    addressRequired: 'សូមបញ្ចូលអាសយដ្ឋាន',
    productNameRequired: 'សូមបញ្ចូលឈ្មោះទំនិញ',
    productRequired: 'សូមបញ្ចូលឈ្មោះផលិតផលសម្រាប់គ្រប់ទំនិញ',
    customerPhoneRequired: 'សូមបញ្ចូលលេខទូរសព្ទអតិថិជន',
    atLeastOneProduct: 'សូមបន្ថែមផលិតផលយ៉ាងហោចណាស់មួយ',
    searchCriteriaRequired: 'សូមបញ្ចូលលក្ខខណ្ឌស្វែងរកយ៉ាងតិច ១',
    phoneRequiredForSearch: 'សូមបញ្ចូលលេខទូរសព្ទដើម្បីស្វែងរក',
    
    // Date validation
    expireDateAfterPawnDate: 'កាលបរិច្ចេទផុតកំណត់ត្រូវតែធំជាងកាលបរិច្ចេទបញ្ចាំ',
    
    // Search related
    noResultsFound: 'មិនរកឃើញអតិថិជនដែលត្រូវគ្នាទេ',
    searchError: 'មានបញ្ហាក្នុងការស្វែងរក',
    
    // Print related
    printError: 'មានបញ្ហាក្នុងការបោះពុម្ព',
    
    // Settings
    settingsSaveError: 'មានបញ្ហាក្នុងការរក្សាទុកការកំណត់',
  },

  // Info Messages
  info: {
    loading: 'កំពុងទាញយកទិន្នន័យ...',
    searching: 'កំពុងស្វែងរក...',
    saving: 'កំពុងរក្សាទុក...',
    printing: 'កំពុងបោះពុម្ព...',
    noData: 'គ្មានទិន្នន័យ',
    selectOption: 'សូមជ្រើសរើសជម្រើស',
  },

  // Warning Messages
  warning: {
    unsavedChanges: 'មានការផ្លាស់ប្តូរដែលមិនទាន់រក្សាទុក',
    confirmDelete: 'តើអ្នកប្រាកដជាចង់លុបមែនទេ?',
    sessionExpired: 'វគ្គប្រើប្រាស់ផុតកំណត់ សូមចូលម្តងទៀត',
  }
};

// Helper function to get messages with consistent formatting
export const getMessage = (category: keyof typeof messages, key: string, ...args: string[]): string => {
  const message = messages[category][key as keyof typeof messages[typeof category]];
  if (!message) {
    return `Message not found: ${category}.${key}`;
  }
  
  // Replace placeholders with arguments
  if (args.length > 0) {
    return args.reduce((msg, arg, index) => {
      return msg.replace(`{${index}}`, arg);
    }, message);
  }
  
  return message;
};

// Helper function to get client found message with name
export const getClientFoundMessage = (clientName: string): string => {
  return `${messages.success.clientFound}: ${clientName}`;
};

// Helper function to get data loaded message with count
export const getDataLoadedMessage = (count: number, type: string): string => {
  return `ទាញយក${type} ${count} ចំនួនបានជោគជ័យ`;
};

// Export individual message categories for direct access
export const successMessages = messages.success;
export const errorMessages = messages.error;
export const infoMessages = messages.info;
export const warningMessages = messages.warning; 