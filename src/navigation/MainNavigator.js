import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LandingScreen, ReportScreen, ProfileScreen, InputScreen, HistoryScreen } from '../screens';
import { Colors, Sizes } from '../constants';
import { HomeIcon, ReportIcon, ProfileIcon, HistoryIcon } from '../components/TabIcons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_CONTENT_HEIGHT = 56;

/**
 * Main Tab Navigator
 * Minimal luxury tab bar design
 */
const MainTabs = () => {
  const insets = useSafeAreaInsets();
  const tabBarPaddingBottom = Math.max(insets.bottom, Sizes.sm) + Sizes.sm;
  const tabBarHeight = TAB_CONTENT_HEIGHT + Sizes.md + tabBarPaddingBottom;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          paddingBottom: tabBarPaddingBottom,
          paddingTop: Sizes.md,
          height: tabBarHeight,
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
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ focused, color }) => (
            <HistoryIcon focused={focused} color={color} />
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
      <Stack.Screen name="Report" component={ReportScreen} />
    </Stack.Navigator>
  );
};
