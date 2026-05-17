import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LandingScreen, ReportScreen, ProfileScreen, InputScreen } from '../screens';
import { Colors, Sizes } from '../constants';
import { HomeIcon, ReportIcon, ProfileIcon } from '../components/TabIcons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Main Tab Navigator
 * Minimal luxury tab bar design
 */
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          paddingBottom: Sizes.md + 4,
          paddingTop: Sizes.md,
          height: 72,
          backgroundColor: Colors.surface,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          elevation: 8,
          shadowColor: Colors.black,
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: Sizes.fontSize.xs,
          fontWeight: '500',
          letterSpacing: 0.5,
          marginTop: Sizes.xs,
        },
        tabBarItemStyle: {
          paddingVertical: Sizes.xs,
        },
        tabBarIconStyle: {
          marginTop: -Sizes.md,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={LandingScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <HomeIcon focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{
          tabBarLabel: 'Report',
          tabBarIcon: ({ focused, color }) => (
            <ReportIcon focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <ProfileIcon focused={focused} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * Main App Navigator
 * Wraps the tab navigator in a stack for future navigation needs
 */
export const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 200,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Input" component={InputScreen} />
    </Stack.Navigator>
  );
};