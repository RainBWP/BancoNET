import api from './api';

export interface Account {
  id: string;
  accountNumber: string;
  balance: number;
  ownerName: string;
  // Add other properties as needed
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    // Other user properties
  };
}

export const accountService = {
  // Get account info
  getAccount: async (accountId: string): Promise<Account> => {
    const response = await api.get(`/accounts/${accountId}`);
    return response.data;
  },
  
  // Verify account exists
  verifyAccount: async (accountId: string): Promise<boolean> => {
    try {
      const response = await api.get(`/accounts/verify/${accountId}`);
      return response.data.exists;
    } catch (error) {
        // Handle error (e.g., account not found)
        console.error('Error verifying account:', error);
      return false;
    }
  },
  
  // Login with account
  login: async (accountId: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { accountId});
    return response.data;
  },
  
  // Get account transactions
  getTransactions: async (accountId: string) => {
    const response = await api.get(`/accounts/${accountId}/transactions`);
    return response.data;
  }
};

export default accountService;