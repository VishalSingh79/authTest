
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
import { signUp, confirmSignUp, signIn } from 'aws-amplify/auth';

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      return Alert.alert('Error', 'Please fill all fields');
    }
    if (password !== confirmPassword) {
      return Alert.alert('Error', 'Passwords do not match');
    }

    setLoading(true);
    try {
      const { isSignUpComplete } = await signUp({
        username: email, 
        password,
        options: {
          userAttributes: {
            email,
            name,
          },
          autoSignIn: false, 
        },
      });

      if (!isSignUpComplete) {
        
        setShowOtpInput(true); 
        Alert.alert(
          'Success',
          'Verification code sent to your email. Please check your inbox and spam folder.',
        );
      } else {
        
        Alert.alert('Success', 'Sign up complete! You can now log in.');
        navigation.navigate('Login'); 
      }
    } catch (err) {
      console.error('Signup error', err);
      Alert.alert('Error', err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };


const handleConfirmOtp = async () => {
  if (!otp.trim()) {
    return Alert.alert('Error', 'Please enter the verification code.');
  }
  setOtpLoading(true);
  try {
    const { isSignUpComplete } = await confirmSignUp({
      username: email,
      confirmationCode: otp,
    });

    setOtp('');
    setShowOtpInput(false);

    if (isSignUpComplete) {
      Alert.alert('Success', 'Email confirmed!');

      try {
        
          await signIn({ username: email, password });
        
      } catch (signInError) {
      
          if (signInError.name === 'UserAlreadyAuthenticatedException') {
              console.log('User already signed in from confirmSignUp. Navigating to Home.');
              navigation.navigate('Home'); 
          } else {
              console.error('Error signing in after confirmation:', signInError);
              Alert.alert('Error', signInError.message || 'Failed to sign in after confirmation. Please try logging in.');
              navigation.navigate('Login'); 
          }
      }

    } else {
   
      Alert.alert('Success', 'Email confirmed, but further steps are required. Please log in.');
      navigation.navigate('Login');
    }
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  } catch (err) {
    console.error('OTP Confirmation Error:', err);
    Alert.alert('Error', err.message || 'Failed to confirm sign up. Please check your code.');
  } finally {
    setOtpLoading(false);
  }
};

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
     
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#999" 
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <View style={styles.buttonContainer}>
          <Button
            title={loading ? 'Signing Up...' : 'Sign Up'}
            onPress={handleSignUp}
            disabled={loading}
            color="#007bff" 
          />
        </View>
        <View style={styles.linkButton}>
          <Button
            title="Already have an account? Login"
            onPress={() => navigation.navigate('Login')}
            color="#6c757d" 
          />
        </View>

        {showOtpInput && (
          <View style={styles.otpContainer}>
            <Text style={styles.otpPrompt}>Enter the verification code:</Text>
            <TextInput
              placeholder="Verification Code"
              placeholderTextColor="#999"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              style={styles.input}
            />
            <Button
              title={otpLoading ? 'Verifying...' : 'Verify Code'}
              onPress={handleConfirmOtp}
              disabled={otpLoading || !otp.trim()}
              color="#28a745" 
            />
          </View>
        )}
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
  otpContainer: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  otpPrompt: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
});

export default SignupScreen;
