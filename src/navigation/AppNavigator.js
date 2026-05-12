import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

const Stack = createNativeStackNavigator();

/**
 * Main App Navigator
 * Handles authentication flow and main app navigation
 */
export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="AuthStack"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          animationDuration: 300,
        }}
      >
        <Stack.Screen
          name="AuthStack"
          component={AuthNavigator}
        />
        <Stack.Screen
          name="MainApp"
          component={MainNavigator}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

