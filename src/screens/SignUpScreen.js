import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  alert,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { globalStyles } from '../styles/globalStyles';
import { Button } from '../components';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { Colors, Sizes } from '../constants';

/**
 * Minimal Sign Up Screen
 */
export const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('MainApp');
    }, 1000);
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
            Create your account
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
            Full Name
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
            placeholder="Enter your full name"
            placeholderTextColor={Colors.textTertiary}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
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
            placeholder="Create a password"
            placeholderTextColor={Colors.textTertiary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
          />
        </View>

        <Button
          title="Sign Up"
          onPress={handleSignUp}
          loading={loading}
          style={{ marginBottom: Sizes.lg }}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: Sizes.md }}>
          <Text style={{ color: Colors.textSecondary, fontSize: Sizes.fontSize.sm }}>
            Already have an account?{' '}
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
