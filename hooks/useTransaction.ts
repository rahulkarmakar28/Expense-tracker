import { useCallback, useState } from "react"
import { TRANSACTION_API } from "@/utils/api"
import { Alert } from "react-native"

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
            // console.log(`${TRANSACTION_API.getTransactions(userId)}`)
            const response = await fetch(`${TRANSACTION_API.getTransactions(userId)}`);
            const res = await response.json()
            // console.log('Fetched transactions:', res)
            setTransactions(res.data);
        } catch (error) {
            console.error('Error fetching transactions:', error)
        }
    }, [userId]);

    const getTransactionSummary = useCallback(async () => {
        try {
            const response = await fetch(`${TRANSACTION_API.getTransactionSummary(userId)}`);
            const res = await response.json();
            console.log('Fetched transaction summary:', res);
            if (!res.data) {
                setSummary({
                    balance: 0,
                    income: 0,
                    expenses: 0
                });
            } else {
                setSummary({
                    balance: res.data.total,
                    income: res.data.Income,
                    expenses: res.data.Expense
                });
            }
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

    const deleteTransaction = async (id: Number) => {
        try {
            const response = await fetch(`${TRANSACTION_API.deleteTransaction(id)}`, {
                method: 'DELETE',
            });
            const res = await response.json();

            if (!res.success) {
                throw new Error('Failed to delete transaction');
            }

            // const updatedTransactions = transactions.filter(item => item.id !== id.toString());

            // const income = updatedTransactions
            //     .filter(item => item.description === 'Income')
            //     .reduce((sum, t) => sum + t.amount, 0);

            // const expenses = updatedTransactions
            //     .filter(item => item.description === 'Expense')
            //     .reduce((sum, t) => sum + t.amount, 0);

            // setTransactions(updatedTransactions);
            // setSummary({
            //     income,
            //     expenses,
            //     balance: income - expenses,
            // });
            loadData()

            Alert.alert('Transaction deleted successfully');

        } catch (error: any) {
            Alert.alert('Error deleting transaction', error.message);
        }
    };



    return { transactions, summary, loading, loadData, deleteTransaction }
}