import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { Colors } from '../constants';

/**
 * Reusable Button component
 * @param {Object} props - Component props
 * @param {string} props.title - Button text
 * @param {Function} props.onPress - Press handler
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.disabled - Disabled state
 * @param {Object} props.style - Custom styles
 */
export const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[
        globalStyles.button,
        (disabled || loading) && { opacity: 0.5 },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={Colors.white} />
      ) : (
        <Text style={[globalStyles.buttonText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

