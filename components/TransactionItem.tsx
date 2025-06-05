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
export const TransactionItem = ({ item, onDelete }: { item: { id: string; amount: string; category: string }, onDelete: () => void }) => {
    const isIncome = parseFloat(item.amount) > 0;
    const iconName: IoniconName = CATEGORY_ICONS[item.category] || 'pricetag-outline';

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
                    <Text style={styles.transactionDate}>{formatDate(item.created_at)}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item?.id)}>
                <Ionicons name="trash-outline" size={20} color={COLORS.expense} />
            </TouchableOpacity>
        </View>
    )
}