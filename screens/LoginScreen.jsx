import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signIn, signOut } from 'aws-amplify/auth';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      return Alert.alert('Error', 'Please enter both email and password.');
    }
    await signOut();
    setLoading(true);
    try {

      const { isSignedIn } = await signIn({ username: email, password }); 

      if (isSignedIn) {
          console.log('User signed in successfully, App.jsx will handle navigation.');   
      }
    } catch (error) {
      console.error('SignIn Error:', error);
      Alert.alert('Error', error.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
};
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <View style={styles.buttonContainer}>
          <Button
            title={loading ? 'Signing In...' : 'Sign In'}
            onPress={handleSignIn}
            disabled={loading}
            color="#007bff"
          />
        </View>

        <View style={styles.linkButton}>
          <Button
            title="Don't have an account? Sign Up"
            onPress={() => navigation.navigate('SignUp')}
            color="#6c757d"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5', 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#333',
  },
  input: {
    width: '100%', 
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8, 
    marginBottom: 15, 
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonContainer: {
    marginTop: 10,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  linkButton: {
    marginTop: 15,
  },
});

export default LoginScreen;