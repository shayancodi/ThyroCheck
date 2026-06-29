import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { globalStyles } from '../styles/globalStyles';
import { AnimatedBackground } from '../components';
import { Colors, Sizes } from '../constants';
import { auth } from '../services/firebase';

/**
 * Minimal luxury Profile Screen with smooth animations
 */
export const ProfileScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [user, setUser] = useState(auth.currentUser);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
    return unsubscribe;
  }, []);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          setSigningOut(true);
          try {
            await signOut(auth);
            navigation.getParent()?.getParent()?.replace('AuthStack');
          } catch (error) {
            Alert.alert('Error', 'Failed to sign out. Please try again.');
          } finally {
            setSigningOut(false);
          }
        },
      },
    ]);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const profileData = {
    name: displayName,
    email: user?.email || 'Not signed in',
    memberSince: formatDate(user?.metadata?.creationTime),
    lastSignIn: formatDate(user?.metadata?.lastSignInTime),
    emailVerified: user?.emailVerified ? 'Verified' : 'Not Verified',
  };

  return (
    <View style={[globalStyles.container, { backgroundColor: Colors.background }]}>
      <StatusBar style="dark" />
      
      {/* Minimal Animated Background */}
      <AnimatedBackground />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: Sizes.xl,
          paddingTop: Sizes.xxl,
          paddingBottom: Sizes.xxl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Profile Header - Minimal */}
          <View style={{ alignItems: 'center', marginBottom: Sizes.xxl }}>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: Colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: Sizes.lg,
              }}
            >
              <Text
                style={{
                  fontSize: 40,
                  color: Colors.accent,
                  fontWeight: '300',
                  letterSpacing: 2,
                }}
              >
                {profileData.name.charAt(0)}
              </Text>
            </View>
            <Text
              style={{
                fontSize: Sizes.fontSize.xl,
                fontWeight: '600',
                color: Colors.text,
                marginBottom: Sizes.xs,
                letterSpacing: -0.5,
              }}
            >
              {profileData.name}
            </Text>
            <Text
              style={{
                fontSize: Sizes.fontSize.sm,
                color: Colors.textSecondary,
                letterSpacing: 0.2,
              }}
            >
              {profileData.email}
            </Text>
          </View>

          {/* Personal Information Section */}
          <View
            style={{
              backgroundColor: Colors.surface,
              borderRadius: 20,
              padding: Sizes.xl,
              marginBottom: Sizes.lg,
              borderWidth: 1,
              borderColor: Colors.border,
            }}
          >
            <Text
              style={{
                fontSize: Sizes.fontSize.md,
                fontWeight: '600',
                color: Colors.text,
                marginBottom: Sizes.lg,
                letterSpacing: -0.3,
              }}
            >
              Personal Information
            </Text>

            <View style={{ gap: Sizes.lg }}>
              <View>
                <Text
                  style={{
                    fontSize: Sizes.fontSize.xs,
                    color: Colors.textSecondary,
                    marginBottom: Sizes.xs,
                    fontWeight: '500',
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                  }}
                >
                  Full Name
                </Text>
                <Text
                  style={{
                    fontSize: Sizes.fontSize.md,
                    color: Colors.text,
                    fontWeight: '400',
                    letterSpacing: -0.2,
                  }}
                >
                  {profileData.name}
                </Text>
              </View>

              <View
                style={{
                  height: 1,
                  backgroundColor: Colors.divider,
                  marginVertical: Sizes.xs,
                }}
              />

              <View>
                <Text
                  style={{
                    fontSize: Sizes.fontSize.xs,
                    color: Colors.textSecondary,
                    marginBottom: Sizes.xs,
                    fontWeight: '500',
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                  }}
                >
                  Email Address
                </Text>
                <Text
                  style={{
                    fontSize: Sizes.fontSize.md,
                    color: Colors.text,
                    fontWeight: '400',
                    letterSpacing: -0.2,
                  }}
                >
                  {profileData.email}
                </Text>
              </View>

              <View
                style={{
                  height: 1,
                  backgroundColor: Colors.divider,
                  marginVertical: Sizes.xs,
                }}
              />

              <View>
                <Text
                  style={{
                    fontSize: Sizes.fontSize.xs,
                    color: Colors.textSecondary,
                    marginBottom: Sizes.xs,
                    fontWeight: '500',
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                  }}
                >
                  Email Status
                </Text>
                <Text
                  style={{
                    fontSize: Sizes.fontSize.md,
                    color: user?.emailVerified ? Colors.text : Colors.warning || Colors.text,
                    fontWeight: '400',
                    letterSpacing: -0.2,
                  }}
                >
                  {profileData.emailVerified}
                </Text>
              </View>
            </View>
          </View>

          {/* Additional Details Section */}
          <View
            style={{
              backgroundColor: Colors.surface,
              borderRadius: 20,
              padding: Sizes.xl,
              marginBottom: Sizes.lg,
              borderWidth: 1,
              borderColor: Colors.border,
            }}
          >
            <Text
              style={{
                fontSize: Sizes.fontSize.md,
                fontWeight: '600',
                color: Colors.text,
                marginBottom: Sizes.lg,
                letterSpacing: -0.3,
              }}
            >
              Additional Details
            </Text>

            <View style={{ gap: Sizes.lg }}>
              <View>
                <Text
                  style={{
                    fontSize: Sizes.fontSize.xs,
                    color: Colors.textSecondary,
                    marginBottom: Sizes.xs,
                    fontWeight: '500',
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                  }}
                >
                  Member Since
                </Text>
                <Text
                  style={{
                    fontSize: Sizes.fontSize.md,
                    color: Colors.text,
                    fontWeight: '400',
                    letterSpacing: -0.2,
                  }}
                >
                  {profileData.memberSince}
                </Text>
              </View>

              <View
                style={{
                  height: 1,
                  backgroundColor: Colors.divider,
                  marginVertical: Sizes.xs,
                }}
              />

              <View>
                <Text
                  style={{
                    fontSize: Sizes.fontSize.xs,
                    color: Colors.textSecondary,
                    marginBottom: Sizes.xs,
                    fontWeight: '500',
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                  }}
                >
                  Last Sign In
                </Text>
                <Text
                  style={{
                    fontSize: Sizes.fontSize.md,
                    color: Colors.text,
                    fontWeight: '400',
                    letterSpacing: -0.2,
                  }}
                >
                  {profileData.lastSignIn}
                </Text>
              </View>
            </View>
          </View>

          {/* Sign Out Button - Minimal */}
          <TouchableOpacity
            onPress={handleSignOut}
            disabled={signingOut}
            style={{
              backgroundColor: Colors.primary,
              paddingVertical: Sizes.lg,
              borderRadius: 12,
              alignItems: 'center',
              marginTop: Sizes.md,
              opacity: signingOut ? 0.6 : 1,
            }}
            activeOpacity={0.8}
          >
            <Text
              style={{
                color: Colors.white,
                fontSize: Sizes.fontSize.md,
                fontWeight: '500',
                letterSpacing: 0.3,
              }}
            >
              {signingOut ? 'Signing Out...' : 'Sign Out'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};
