import React from 'react';
import { View } from 'react-native';
import { Colors } from '../constants';

/**
 * Custom minimal-line tab bar icons built with composed Views (no icon font).
 */

const WRAP = {
  width: 28,
  height: 28,
  alignItems: 'center',
  justifyContent: 'center',
};

export const HomeIcon = ({ focused, color }) => {
  const c = focused ? color : Colors.textTertiary;
  return (
    <View style={WRAP}>
      {/* Roof */}
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: 10,
          borderRightWidth: 10,
          borderBottomWidth: 9,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: c,
        }}
      />
      {/* Body */}
      <View
        style={{
          width: 15,
          height: 10,
          borderWidth: 2,
          borderTopWidth: 0,
          borderColor: c,
          borderBottomLeftRadius: 3,
          borderBottomRightRadius: 3,
          backgroundColor: focused ? c : 'transparent',
        }}
      />
    </View>
  );
};

export const ReportIcon = ({ focused, color }) => {
  const c = focused ? color : Colors.textTertiary;
  const line = { height: 2, backgroundColor: c, borderRadius: 1, marginBottom: 2.5 };
  return (
    <View style={WRAP}>
      <View
        style={{
          width: 17,
          height: 21,
          borderRadius: 4,
          borderWidth: 2,
          borderColor: c,
          paddingHorizontal: 3,
          justifyContent: 'center',
          backgroundColor: focused ? c + '1A' : 'transparent',
        }}
      >
        <View style={[line, { width: '100%' }]} />
        <View style={[line, { width: '65%' }]} />
        <View style={[line, { width: '85%', marginBottom: 0 }]} />
      </View>
    </View>
  );
};

export const HistoryIcon = ({ focused, color }) => {
  const c = focused ? color : Colors.textTertiary;
  return (
    <View style={WRAP}>
      <View
        style={{
          width: 21,
          height: 21,
          borderRadius: 11,
          borderWidth: 2,
          borderColor: c,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: focused ? c + '1A' : 'transparent',
        }}
      >
        {/* Hour hand (up) */}
        <View
          style={{
            position: 'absolute',
            width: 2,
            height: 6,
            backgroundColor: c,
            borderRadius: 1,
            top: 4,
            left: 8.5,
          }}
        />
        {/* Minute hand (right) */}
        <View
          style={{
            position: 'absolute',
            width: 5,
            height: 2,
            backgroundColor: c,
            borderRadius: 1,
            top: 8.5,
            left: 9,
          }}
        />
      </View>
    </View>
  );
};

export const ProfileIcon = ({ focused, color }) => {
  const c = focused ? color : Colors.textTertiary;
  return (
    <View style={WRAP}>
      {/* Head */}
      <View
        style={{
          width: 9,
          height: 9,
          borderRadius: 5,
          borderWidth: 2,
          borderColor: c,
          marginBottom: 2,
          backgroundColor: focused ? c : 'transparent',
        }}
      />
      {/* Shoulders */}
      <View
        style={{
          width: 17,
          height: 9,
          borderWidth: 2,
          borderBottomWidth: 0,
          borderColor: c,
          borderTopLeftRadius: 9,
          borderTopRightRadius: 9,
          backgroundColor: focused ? c + '1A' : 'transparent',
        }}
      />
    </View>
  );
};
