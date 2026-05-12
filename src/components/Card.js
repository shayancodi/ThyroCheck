import React from 'react';
import { View } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

/**
 * Minimal Card component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {Object} props.style - Custom styles
 */
export const Card = ({ children, style }) => {
  return <View style={[globalStyles.card, style]}>{children}</View>;
};

