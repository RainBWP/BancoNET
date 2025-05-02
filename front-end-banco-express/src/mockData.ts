// Mock database that simulates backend storage
export const mockDB = {
    accounts: [
      {
        id: "1",
        accountNumber: "1",
        balance: 5000,
        ownerName: "Juan Pérez"
      },
      {
        id: "2",
        accountNumber: "2", 
        balance: 7500,
        ownerName: "Ana García"
      },
      {
        id: "3",
        accountNumber: "3",
        balance: 12000,
        ownerName: "Carlos López"
      }
    ],
    transactions: [
      {
        id: "t1",
        fromAccountId: "1",
        toAccountId: "2",
        amount: 500,
        description: "Pago de deuda",
        timestamp: "2025-05-01T15:30:00Z",
        status: "completed"
      },
      {
        id: "t2",
        fromAccountId: "2",
        toAccountId: "1",
        amount: 250,
        description: "Reembolso parcial",
        timestamp: "2025-05-01T16:45:00Z",
        status: "completed"
      }
    ],
    tokens: {
      "1": "token-account-1",
      "2": "token-account-2",
      "3": "token-account-3"
    }
  };