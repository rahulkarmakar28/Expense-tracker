import { useCallback, useState } from "react"
import { TRANSACTION_API } from "@/utils/api"
import {Alert} from "react-native"

interface Transaction {
    id: string;
    amount: number;
    date: string;
    description: string;
}
export interface TransactionSummary {
    balance: number;
    income: number;
    expenses: number;
}
export const useTransaction = (userId: string) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summary, setSummary] = useState<TransactionSummary>({
        balance: 0,
        income: 0,
        expenses: 0
    });
    const [loading, setLoading] = useState<boolean>(false);

    const getTransactions = useCallback(async () => {
        try {
            const response = await fetch(`${TRANSACTION_API.getTransactions(userId)}`);
            const data = await response.json()
            console.log('Fetched transactions:', data)
            /*
            setTransactions(data.transactions);
            */
        } catch (error) {
            console.error('Error fetching transactions:', error)
        }
    }, [userId]);

    const getTransactionSummary = useCallback(async () => {
        try {
            const response = await fetch(`${TRANSACTION_API.getTransactionSummary(userId)}`);
            const data = await response.json();
            console.log('Fetched transaction summary:', data);
            // setSummary(data.summary);
        } catch (error) {
            console.error('Error fetching transaction summary:', error);
        }
    }, [userId]);

    const loadData = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            await Promise.all([getTransactions(), getTransactionSummary()])
        } catch (error) {
            console.log('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    }, [getTransactions, getTransactionSummary, userId]);

    const deleteTransaction = async (id: string) => {
        try {
            const response = await fetch(`${TRANSACTION_API.deleteTransaction(id)}`);
            console.log(response)
            if (!response.ok) {
                throw new Error('Failed to delete transaction');
            }
            Alert.alert('Transaction deleted successfully:');
            loadData();
        } catch (error: Error | any) {
            Alert.alert('Error deleting transaction:', error.message);
        }
    }


    return { transactions, summary, loading, loadData, deleteTransaction }
}