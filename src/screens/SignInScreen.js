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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

/**
 * Minimal Sign In Screen
 */
export const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('MainApp');
    } catch (error) {
      let message = 'Something went wrong.';
      if (error.code === 'auth/invalid-credential') message = 'Invalid email or password.';
      if (error.code === 'auth/user-not-found') message = 'No account found with this email.';
      if (error.code === 'auth/too-many-requests') message = 'Too many attempts. Try again later.';
      Alert.alert('Sign In Failed', message);
    } finally {
      setLoading(false);
    }
  };

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
            Sign in to continue
          </Text>
        </View>

        <View style={{ marginBottom: Sizes.lg }}>
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

        <View style={{ marginBottom: Sizes.md }}>
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
            Password
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
            placeholder="Enter your password"
            placeholderTextColor={Colors.textTertiary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={{ alignSelf: 'flex-end', marginBottom: Sizes.xl }}
        >
          <Text
            style={{
              color: Colors.primary,
              fontWeight: '500',
              fontSize: Sizes.fontSize.sm,
            }}
          >
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <Button
          title="Sign In"
          onPress={handleSignIn}
          loading={loading}
          style={{ marginBottom: Sizes.lg }}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: Sizes.md }}>
          <Text style={{ color: Colors.textSecondary, fontSize: Sizes.fontSize.sm }}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text
              style={{
                color: Colors.primary,
                fontWeight: '500',
                fontSize: Sizes.fontSize.sm,
              }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};