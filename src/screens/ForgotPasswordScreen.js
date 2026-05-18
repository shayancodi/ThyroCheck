import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { globalStyles } from '../styles/globalStyles';
import { Button } from '../components';
import { Colors, Sizes } from '../constants';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebase';

/**
 * Minimal Forgot Password Screen
 */
export const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
    } catch (error) {
      let message = 'Something went wrong.';
      if (error.code === 'auth/user-not-found') message = 'No account found with this email.';
      if (error.code === 'auth/invalid-email') message = 'Invalid email address.';
      Alert.alert('Reset Failed', message);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <KeyboardAvoidingView
        style={globalStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StatusBar style="dark" />
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: Sizes.xl,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ alignItems: 'center', marginBottom: Sizes.xxl }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: Colors.success + '20',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: Sizes.xl,
              }}
            >
              <Text style={{ fontSize: 40, color: Colors.success }}>✓</Text>
            </View>
            <Text
              style={{
                fontSize: Sizes.fontSize.xxl,
                fontWeight: '600',
                color: Colors.text,
                marginBottom: Sizes.sm,
                letterSpacing: -0.5,
                textAlign: 'center',
              }}
            >
              Check Your Email
            </Text>
            <Text
              style={{
                fontSize: Sizes.fontSize.md,
                color: Colors.textSecondary,
                textAlign: 'center',
                lineHeight: 22,
                paddingHorizontal: Sizes.md,
              }}
            >
              We've sent a password reset link to {email}
            </Text>
          </View>

          <Button
            title="Back to Sign In"
            onPress={() => navigation.navigate('SignIn')}
            style={{ marginTop: Sizes.lg }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: Sizes.xl,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ alignItems: 'center', marginBottom: Sizes.xxl }}>
          <Text
            style={{
              fontSize: Sizes.fontSize.xxxl,
              fontWeight: '600',
              color: Colors.text,
              marginBottom: Sizes.xs,
              letterSpacing: -1,
            }}
          >
            ThyroCheck
          </Text>
          <Text
            style={{
              fontSize: Sizes.fontSize.sm,
              color: Colors.textSecondary,
              letterSpacing: 0.3,
            }}
          >
            Reset your password
          </Text>
        </View>

        <Text
          style={{
            fontSize: Sizes.fontSize.md,
            color: Colors.textSecondary,
            textAlign: 'center',
            marginBottom: Sizes.xl,
            lineHeight: 22,
            paddingHorizontal: Sizes.md,
          }}
        >
          Enter your email address and we'll send you a link to reset your password.
        </Text>

        <View style={{ marginBottom: Sizes.xl }}>
          <Text
            style={{
              fontSize: Sizes.fontSize.xs,
              color: Colors.textSecondary,
              marginBottom: Sizes.sm,
              fontWeight: '500',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}
          >
            Email
          </Text>
          <TextInput
            style={{
              backgroundColor: Colors.surface,
              borderRadius: Sizes.borderRadius.md,
              padding: Sizes.lg,
              fontSize: Sizes.fontSize.md,
              borderWidth: 1,
              borderColor: Colors.border,
              color: Colors.text,
            }}
            placeholder="Enter your email"
            placeholderTextColor={Colors.textTertiary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        <Button
          title="Send Reset Link"
          onPress={handleResetPassword}
          loading={loading}
          style={{ marginBottom: Sizes.lg }}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: Sizes.md }}>
          <Text style={{ color: Colors.textSecondary, fontSize: Sizes.fontSize.sm }}>
            Remember your password?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text
              style={{
                color: Colors.primary,
                fontWeight: '500',
                fontSize: Sizes.fontSize.sm,
              }}
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

