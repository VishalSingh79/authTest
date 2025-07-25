import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const navigation = useNavigation();

  // Step 1: Request reset code
  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }

    try {
      const { nextStep } = await resetPassword({ username: email.trim() });

      if (nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
        Alert.alert('Code Sent', 'A code has been sent to your registered email/phone.');
        setStep(2);
      } else if (nextStep.resetPasswordStep === 'DONE') {
        Alert.alert('Success', 'Password reset is complete.');
        navigation.navigate('Login');
      }
    } catch (err) {
      console.error('Reset Error:', err);
      Alert.alert('Error', err.message || 'Failed to reset password');
    }
  };

  // Step 2: Confirm reset with code
  const handleConfirmResetPassword = async () => {
    if (!code || !newPassword) {
      Alert.alert('Error', 'Please fill both code and new password.');
      return;
    }

    try {
      await confirmResetPassword({
        username: email.trim(),
        confirmationCode: code.trim(),
        newPassword: newPassword.trim(),
      });

      Alert.alert('Success', 'Password has been changed. Please log in.');
      setStep(1);
      setCode('');
      setNewPassword('');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Confirm Reset Error:', error);
      Alert.alert('Error', error.message || 'Failed to confirm reset');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Forgot Password</Text>

        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {step === 2 && (
          <>
            <TextInput
              placeholder="Enter code"
              value={code}
              onChangeText={setCode}
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              style={styles.input}
              secureTextEntry
            />
          </>
        )}

        <Button
          title={step === 1 ? 'Send OTP' : 'Reset Password'}
          onPress={step === 1 ? handleResetPassword : handleConfirmResetPassword}
        />

        <View style={{ marginTop: 20 }}>
          <Button title="Back to Login" onPress={() => navigation.navigate('Login')} color="#666" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 12,
    paddingHorizontal: 12,
    height: 50,
    backgroundColor: '#fff',
  },
});

export default ForgotPasswordScreen;
