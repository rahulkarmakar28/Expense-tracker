const BASE_API:string = process.env.BASE_API_URL!

export const TRANSACTION_API={
    createTransaction:() => `${BASE_API}/api/transactions`,
    deleteTransaction: (id: string) => `${BASE_API}/api/transactions/${id}`,
    getTransactions: (userId: string) => `${BASE_API}/api/transactions/${userId}`,
    getTransactionSummary: (userId: string) => `${BASE_API}/api/transactions/summary/${userId}`,
}
