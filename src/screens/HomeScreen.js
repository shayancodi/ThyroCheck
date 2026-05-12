import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { globalStyles } from '../styles/globalStyles';
import { Button, Card } from '../components';
import { Colors } from '../constants';

/**
 * Home Screen Component
 */
export const HomeScreen = () => {
  return (
    <View style={globalStyles.container}>
      <StatusBar style="auto" />
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingTop: 60,
        }}
      >
        <Text style={globalStyles.heading}>Welcome to ThyroCheck</Text>
        <Text style={[globalStyles.textSecondary, { marginTop: 8, marginBottom: 24 }]}>
          Your professional Expo Go app is ready!
        </Text>

        <Card>
          <Text style={globalStyles.text}>This is a sample card component</Text>
          <Text style={[globalStyles.textSecondary, { marginTop: 8 }]}>
            You can customize this screen and add more components as needed.
          </Text>
        </Card>

        <Button
          title="Get Started"
          onPress={() => console.log('Button pressed!')}
          style={{ marginTop: 24 }}
        />
      </ScrollView>
    </View>
  );
};

