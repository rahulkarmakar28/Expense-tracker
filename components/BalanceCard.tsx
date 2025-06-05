import { TransactionSummary } from '@/hooks/useTransaction'
import { styles } from "@/assets/styles/home.styles"
import { View } from 'react-native'
import { Text } from 'react-native'
import { COLORS } from '@/constants/colors'



const BalanceCard = ({ summary }: { summary: TransactionSummary }) => {
    return (
        <View style={styles.balanceCard}>
            <Text style={styles.balanceTitle}>Total Balance</Text>
            <Text style={styles.balanceAmount}>₹{parseFloat(String(summary.balance)).toFixed(2)}</Text>
            <View style={styles.balanceStats}>
                <View style={styles.balanceStatItem}>
                    <Text style={styles.balanceStatLabel}>Income</Text>
                    <Text style={[styles.balanceStatAmount, { color: COLORS.income }]}>+₹{parseFloat(String(summary.income)).toFixed(2)}</Text>
                </View>
                <View style={[styles.balanceStatItem, styles.statDivider]} />
                <View style={styles.balanceStatItem}>
                    <Text style={styles.balanceStatLabel}>Expenses</Text>
                    <Text style={[styles.balanceStatAmount, { color: COLORS.expense }]}>-₹{parseFloat(String(summary.expenses)).toFixed(2)}</Text>
                </View>
            </View>
        </View>
    )
}
export default BalanceCard