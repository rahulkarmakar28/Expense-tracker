import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { Text, TouchableOpacity } from 'react-native'
import { styles } from '@/assets/styles/home.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/colors'
import { Alert } from 'react-native'



export const SignOutButton = () => {
  const { signOut } = useClerk()
  const handleSignOut = async () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => signOut() }
    ])
  }
  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
      <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
    </TouchableOpacity>
  )
}