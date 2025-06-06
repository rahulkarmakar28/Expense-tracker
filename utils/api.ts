const BASE_API:string = process.env.EXPO_PUBLIC_BASE_API_URL!
export const TRANSACTION_API={
    createTransaction: `${BASE_API}/api/transaction`,
    deleteTransaction: (id: Number) => `${BASE_API}/api/transaction/${id}`,
    getTransactions: (userId: string) => `${BASE_API}/api/transaction/${userId}`,
    getTransactionSummary: (userId: string) => `${BASE_API}/api/transaction/summary/${userId}`,
}
