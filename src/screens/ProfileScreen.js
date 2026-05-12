import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { globalStyles } from '../styles/globalStyles';
import { AnimatedBackground } from '../components';
import { Colors, Sizes } from '../constants';

/**
 * Minimal luxury Profile Screen with smooth animations
 */
export const ProfileScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
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
  }, []);

  const handleSignOut = () => {
    navigation.getParent()?.getParent()?.replace('AuthStack');
  };

  const profileData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: 'January 15, 1990',
    gender: 'Male',
    memberSince: 'January 2024',
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
                  Phone Number
                </Text>
                <Text
                  style={{
                    fontSize: Sizes.fontSize.md,
                    color: Colors.text,
                    fontWeight: '400',
                    letterSpacing: -0.2,
                  }}
                >
                  {profileData.phone}
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
                  Date of Birth
                </Text>
                <Text
                  style={{
                    fontSize: Sizes.fontSize.md,
                    color: Colors.text,
                    fontWeight: '400',
                    letterSpacing: -0.2,
                  }}
                >
                  {profileData.dateOfBirth}
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
                  Gender
                </Text>
                <Text
                  style={{
                    fontSize: Sizes.fontSize.md,
                    color: Colors.text,
                    fontWeight: '400',
                    letterSpacing: -0.2,
                  }}
                >
                  {profileData.gender}
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
            </View>
          </View>

          {/* Sign Out Button - Minimal */}
          <TouchableOpacity
            onPress={handleSignOut}
            style={{
              backgroundColor: Colors.primary,
              paddingVertical: Sizes.lg,
              borderRadius: 12,
              alignItems: 'center',
              marginTop: Sizes.md,
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
              Sign Out
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};
