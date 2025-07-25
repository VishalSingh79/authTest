import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native'; 
import { signOut } from 'aws-amplify/auth'; 

const HomeScreen = () => {
  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('Signed out successfully!');
    } catch (error) {
      Alert.alert('Sign Out Error', error.message || 'An unexpected error occurred during sign out.');
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Button title="Sign Out" onPress={handleSignOut} color="#dc3545" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
});

export default HomeScreen;