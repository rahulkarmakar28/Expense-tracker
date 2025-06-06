import { useState } from 'react'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link, router, useRouter } from 'expo-router'
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'
import { useTransaction } from '@/hooks/useTransaction'
import { useEffect } from 'react'
import PageLoader from '@/components/PageLoader'
import { styles } from '@/assets/styles/home.styles'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import BalanceCard from '@/components/BalanceCard'
import { TransactionItem } from '@/components/TransactionItem'
import { Alert } from 'react-native'
import NoTransactionFound from "@/components/NoTransactionFound"



export default function Page() {
  const { user } = useUser()
  const router = useRouter()
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const { transactions, summary, loading, loadData, deleteTransaction } = useTransaction(user?.id as string)

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleDelete = (id: Number) => {
    Alert.alert("Delete Transaction", "Are you sure you want to delete this transaction?", [
      { text:"Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteTransaction(id) }
    ])
  }
  const onRefresh = async ()=>{
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }
  if (loading && !refreshing) return <PageLoader />
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* header */}
        <View style={styles.header}>
          {/* left */}
          <View style={styles.headerLeft}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.headerLogo}
              contentFit='contain'
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome ,</Text>
              <Text style={styles.usernameText}>{user?.username}</Text>
            </View>
          </View>
          {/* right */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push('./create')}>
              <Ionicons name="add" size={24} color="#FFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>

        <BalanceCard summary={summary} />

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
      </View>

      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        // keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
        renderItem={({ item }) => <TransactionItem item={item} onDelete={handleDelete} />}
        ListEmptyComponent={<NoTransactionFound/>}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  )
}