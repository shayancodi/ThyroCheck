import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../constants';

const Stack = createNativeStackNavigator();

/**
 * Main App Navigator
 * Handles authentication flow and main app navigation
 */
export const AppNavigator = () => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });
    return unsubscribe;
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? "MainApp" : "AuthStack"}
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