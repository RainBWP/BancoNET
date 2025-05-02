import { mockDB } from '../mockData';

export interface Account {
  id: string;
  accountNumber: string;
  balance: number;
  ownerName: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
  };
}

export interface TransferResponse {
  success: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transaction?: any;
}

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const accountService = {
  // Get account info
  getAccount: async (accountId: string): Promise<Account> => {
    await delay(500); // Simulate network delay
    const account = mockDB.accounts.find(a => a.id === accountId);
    if (!account) {
      throw new Error('Account not found');
    }
    return account;
  },
  
  // Verify account exists
  verifyAccount: async (accountId: string): Promise<boolean> => {
    await delay(500);
    return mockDB.accounts.some(a => a.id === accountId);
  },
  
  // Login with account
  login: async (accountId: string): Promise<LoginResponse> => {
    await delay(500);
    const account = mockDB.accounts.find(a => a.id === accountId);
    if (!account) {
      throw new Error('Account not found');
    }
    
    return {
      token: (mockDB.tokens as Record<string, string>)[accountId] || 'mock-token',
      user: {
        id: account.id,
        name: account.ownerName
      }
    };
  },
  
  // Get account transactions
  getTransactions: async (accountId: string) => {
    await delay(500);
    return mockDB.transactions.filter(
      t => t.fromAccountId === accountId || t.toAccountId === accountId
    );
  },
  
  // Transfer money between accounts
  transferMoney: async (fromAccountId: string, toAccountId: string, amount: number, description?: string): Promise<TransferResponse> => {
    await delay(800);
    
    // Verify accounts exist
    const sourceAccount = mockDB.accounts.find(a => a.id === fromAccountId);
    const destAccount = mockDB.accounts.find(a => a.id === toAccountId);
    
    if (!sourceAccount) {
      return { success: false, message: 'Cuenta origen no encontrada' };
    }
    
    if (!destAccount) {
      return { success: false, message: 'Cuenta destino no encontrada' };
    }
    
    // Check sufficient funds
    if (sourceAccount.balance < amount) {
      return { 
        success: false, 
        message: `Fondos insuficientes. Saldo actual: $${sourceAccount.balance.toFixed(2)}` 
      };
    }
    
    // Perform transfer in mock DB
    sourceAccount.balance -= amount;
    destAccount.balance += amount;
    
    const newTransaction = {
      id: `t${mockDB.transactions.length + 1}`,
      fromAccountId,
      toAccountId,
      amount,
      description: description || 'Transferencia',
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    
    mockDB.transactions.push(newTransaction);
    
    return {
      success: true,
      message: 'Transferencia completada exitosamente',
      transaction: newTransaction
    };
  }
};

export default accountService;