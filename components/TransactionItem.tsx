import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@/assets/styles/home.styles';
import { COLORS } from "@/constants/colors"
import { formatDate } from "@/lib/dateFormat";
import type { ComponentProps } from 'react';



type IoniconName = NonNullable<ComponentProps<typeof Ionicons>['name']>;
const CATEGORY_ICONS: Record<string, IoniconName> = {
    Food: 'fast-food',
    Transport: 'car',
    Entertainment: 'film',
    Shopping: 'cart',
    Bills: 'receipt',
    Health: 'heart-outline',
    Miscellaneous: 'ellipsis-horizontal',
    Education: 'school',
};
export interface Transaction {
    id: string;
    title: string;
    amount: string;
    type:string
    category: string;
    createdAt: string;
}
interface TransactionItemProps {
    item: Transaction;
    onDelete: (id: Number) => void;
}

export const TransactionItem = ({ item, onDelete }: TransactionItemProps) => {
    const isIncome = item.type==='Income';
    const iconName: IoniconName = CATEGORY_ICONS[item.category] || 'pricetag-outline';
// console.log(item)
    return (
        <View style={styles.transactionCard} key={item.id}>
            <TouchableOpacity style={styles.transactionContent}>
                <View style={styles.categoryIconContainer}>
                    <Ionicons name={iconName} size={22} color={isIncome ? COLORS.income : COLORS.expense} />
                </View>
                <View style={styles.transactionLeft}>
                    <Text style={styles.transactionTitle}>{item.title}</Text>
                    <Text style={styles.transactionCategory}>{item.category}</Text>
                </View>
                <View style={styles.transactionRight}>
                    <Text style={[styles.transactionAmount, { color: isIncome ? COLORS.income : COLORS.expense }]}>
                        {isIncome ? '+' : '-'}₹{Math.abs(parseFloat(item.amount)).toFixed(2)}
                    </Text>
                    <Text style={styles.transactionDate}>{formatDate(item.createdAt)}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(Number(item.id))}>
                <Ionicons name="trash-outline" size={20} color={COLORS.expense} />
            </TouchableOpacity>
        </View>
    )
}