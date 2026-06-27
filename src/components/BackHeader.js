import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors, Sizes } from '../constants';

/**
 * Top header with a back button that returns to the Home tab.
 * Built with a drawn chevron (no icon font).
 */
export const BackHeader = ({ navigation, title }) => {
  const goHome = () => {
    navigation.navigate('MainTabs', { screen: 'Home' });
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Sizes.lg,
        paddingTop: Sizes.xl + Sizes.xs,
        paddingBottom: Sizes.sm,
      }}
    >
      <TouchableOpacity
        onPress={goHome}
        activeOpacity={0.7}
        accessibilityLabel="Back to Home"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={{
          width: 42,
          height: 42,
          borderRadius: 14,
          backgroundColor: Colors.surface,
          borderWidth: 1,
          borderColor: Colors.border,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 11,
            height: 11,
            borderLeftWidth: 2.5,
            borderBottomWidth: 2.5,
            borderColor: Colors.text,
            transform: [{ rotate: '45deg' }],
            marginLeft: 4,
          }}
        />
      </TouchableOpacity>

      {title ? (
        <Text
          style={{
            marginLeft: Sizes.md,
            fontSize: Sizes.fontSize.lg,
            fontWeight: '600',
            color: Colors.text,
            letterSpacing: -0.3,
          }}
        >
          {title}
        </Text>
      ) : null}
    </View>
  );
};
