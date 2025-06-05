import { useState } from "react"
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { useUser } from "@clerk/clerk-expo"
import { Alert, TextInput } from "react-native"
import { TRANSACTION_API } from "@/utils/api"
import { styles } from "@/assets/styles/create.styles"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "@/constants/colors"
import type { IconProps } from "@expo/vector-icons/build/createIconSet";



interface category {
    id: string, name: string, icon: IconProps<string>["name"]
}

const CATEGORIES: category[] = [
    { id: "food", name: "Food & Drinks", icon: "fast-food" },
    { id: "shopping", name: "Shopping", icon: "cart" },
    { id: "transportation", name: "Transportation", icon: "car" },
    { id: "entertainment", name: "Entertainment", icon: "film" },
    { id: "bills", name: "Bills", icon: "receipt" },
    { id: "miscellaneous", name: "Miscellaneous", icon: "ellipsis-horizontal" },
    { id: "health", name: "Health", icon: "heart-outline" },
    { id: "education", name: "Education", icon: "school" },
    { id: "income", name: "Income", icon: "cash" }
]
const create = () => {
    const router = useRouter()
    const { user } = useUser()

    const [title, setTitle] = useState<string>("")
    const [amount, setAmount] = useState<string>("")
    const [selectedCategory, setSelectedCategory] = useState<string>("")
    const [isExpense, setIsExpense] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleCreate = async () => {
        if (!title.trim()) return Alert.alert("Error", "Please enter a transaction title")
        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            Alert.alert("Error", "Please Enter a valid amount")
            return
        }
        if (!selectedCategory) return Alert.alert("Error", "Please select a Category")
        try {
            setIsLoading(true)
            const formattedAmount = Math.abs(parseFloat(amount))
            const response = await fetch(`${TRANSACTION_API.createTransaction}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: user?.id,
                        title,
                        amount: formattedAmount,
                        category: selectedCategory,
                        isExpense
                    })
                })
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to create transaction")
            }
            Alert.alert("Success", "Transaction created successfully")
            router.back()
        } catch (error: Object | any) {
            Alert.alert("Error", error.message || "Failed to create Transaction")
            console.log("Error in creating Transaction", error)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <View style={styles.container}>
            {/* header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Transaction</Text>
                <TouchableOpacity
                    style={[styles.saveButtonContainer, isLoading && styles.saveButtonDisabled]}
                    onPress={handleCreate}
                    disabled={isLoading}
                >
                    <Text style={styles.saveButton}>{isLoading ? "Saving..." : "Save"}</Text>
                    {!isLoading && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <View style={styles.typeSelector}>
                    {/* expense  */}
                    <TouchableOpacity
                        style={[styles.typeButton, isExpense && styles.typeButtonActive]}
                        onPress={() => setIsExpense(true)}
                    >
                        <Ionicons name="arrow-down-circle" size={22} color={isExpense ? COLORS.white : COLORS.expense} style={styles.typeIcon} />
                        <Text style={[styles.typeButtonText, isExpense && styles.typeButtonTextActive]}>Expense</Text>
                    </TouchableOpacity>
                    {/* income */}
                    <TouchableOpacity
                        style={[styles.typeButton, isExpense && styles.typeButtonActive]}
                        onPress={() => setIsExpense(false)}
                    >
                        <Ionicons name="arrow-up-circle" size={22} color={isExpense ? COLORS.white : COLORS.expense} style={styles.typeIcon} />
                        <Text style={[styles.typeButtonText, !isExpense && styles.typeButtonTextActive]}>Income</Text>
                    </TouchableOpacity>
                </View>

                {/* amount */}
                <View style={styles.amountContainer}>
                    <Text style={styles.currencySymbol}>₹</Text>
                    <TextInput
                        style={styles.amountInput}
                        placeholder="0.00"
                        placeholderTextColor={COLORS.textLight}
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                    />
                </View>

                {/* input title */}
                <View style={styles.inputContainer}>
                    <Ionicons
                        name="create-outline"
                        size={22}
                        color={COLORS.textLight}
                        style={styles.inputIcon}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Transaction Title"
                        placeholderTextColor={COLORS.textLight}
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* title */}
                <Text style={styles.sectionTitle}>
                    <Ionicons name="pricetag-outline" size={16} color={COLORS.text} /> Category
                </Text>

                <View style={styles.categoryGrid}>
                    {CATEGORIES.map(category => (
                        <TouchableOpacity
                            key={category.id}
                            style={[styles.categoryButton,
                            selectedCategory === category.name && styles.categoryButtonActive
                            ]}
                            onPress={() => setSelectedCategory(category.name)}
                        >
                            <Ionicons
                                name={category.icon}
                                size={20}
                                color={selectedCategory === category.name ? COLORS.white : COLORS.text}
                                style={styles.categoryIcon}
                            />
                            <Text
                            style={[styles.categoryButtonText, selectedCategory===category.name && styles.categoryButtonTextActive]}
                            >{category.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary}/>
                    </View>
            )}
        </View>
    )
}

export default create