import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../constants';

/**
 * Minimal luxury tab bar icons
 */

export const HomeIcon = ({ focused, color }) => (
  <View
    style={{
      alignItems: 'center',
      justifyContent: 'center',
      width: 28,
      height: 28,
    }}
  >
    <Text
      style={{
        fontSize: focused ? 24 : 22,
        color: focused ? color : Colors.textTertiary,
        fontWeight: focused ? '600' : '400',
        lineHeight: 24,
      }}
    >
      {focused ? '◉' : '○'}
    </Text>
  </View>
);

export const ReportIcon = ({ focused, color }) => (
  <View
    style={{
      alignItems: 'center',
      justifyContent: 'center',
      width: 28,
      height: 28,
    }}
  >
    <Text
      style={{
        fontSize: focused ? 24 : 22,
        color: focused ? color : Colors.textTertiary,
        fontWeight: focused ? '600' : '400',
        lineHeight: 24,
      }}
    >
      {focused ? '◼' : '◻'}
    </Text>
  </View>
);

export const ProfileIcon = ({ focused, color }) => (
  <View
    style={{
      alignItems: 'center',
      justifyContent: 'center',
      width: 28,
      height: 28,
    }}
  >
    <Text
      style={{
        fontSize: focused ? 24 : 22,
        color: focused ? color : Colors.textTertiary,
        fontWeight: focused ? '600' : '400',
        lineHeight: 24,
      }}
    >
      {focused ? '◈' : '◇'}
    </Text>
  </View>
);
