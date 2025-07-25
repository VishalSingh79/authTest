import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import amplifyconfig from './src/amplifyconfiguration.json';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';

Amplify.configure(amplifyconfig);

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(''); 
  const [loading, setLoading] = useState(true);
  console.log('User data', user);

  const checkUser = async () => {
    try {
      const session = await fetchAuthSession();
      const accessToken = session.tokens?.accessToken?.toString();
      setUser(accessToken); 
      console.log('checkUser: User found:', accessToken); 
    } catch (e) {
      setUser(null);
      console.log('checkUser: No user found or error:', e); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  
    const unsubscribe = Hub.listen('auth', ({ payload: { event } }) => {
      console.log('Hub Auth Event detected:', event); 
      if (
        event === 'signedIn' ||
        event === 'signedOut' ||
        event === 'updateUserAttributes'
      ) {
        checkUser();
      }
    });

    return () => unsubscribe();
  }, []); 

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading application...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
      
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignupScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});
