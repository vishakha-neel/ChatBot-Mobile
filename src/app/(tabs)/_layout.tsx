import { Tabs } from 'expo-router';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useAuthStore } from '../../store/authStore';

export default function TabsLayout() {
  const clearAuth = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: clearAuth },
    ]);
  };

  return (
    <Tabs>
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  logoutBtn: {
    marginRight: 16,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});