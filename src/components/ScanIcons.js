import React from 'react';
import { View } from 'react-native';
import { Colors } from '../constants';

/**
 * Minimal line icons for the scan source buttons (Camera / Gallery / PDF).
 * Built from composed Views so no icon font is required.
 */

const WRAP = { width: 28, height: 28 };

export const CameraScanIcon = ({ color = Colors.primary }) => (
  <View style={WRAP}>
    {/* Viewfinder nub */}
    <View
      style={{
        position: 'absolute',
        top: 4,
        left: 9.5,
        width: 9,
        height: 4,
        borderRadius: 2,
        backgroundColor: color,
      }}
    />
    {/* Body */}
    <View
      style={{
        position: 'absolute',
        top: 7,
        left: 2,
        width: 24,
        height: 18,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: color,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Lens */}
      <View
        style={{
          width: 9,
          height: 9,
          borderRadius: 4.5,
          borderWidth: 2,
          borderColor: color,
        }}
      />
    </View>
  </View>
);

export const GalleryScanIcon = ({ color = Colors.primary }) => (
  <View style={WRAP}>
    {/* Frame */}
    <View
      style={{
        position: 'absolute',
        top: 3,
        left: 3,
        width: 22,
        height: 22,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: color,
      }}
    />
    {/* Sun */}
    <View
      style={{
        position: 'absolute',
        top: 8,
        left: 8,
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: color,
      }}
    />
    {/* Back mountain */}
    <View
      style={{
        position: 'absolute',
        bottom: 6,
        left: 7,
        width: 0,
        height: 0,
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderBottomWidth: 7,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: color,
      }}
    />
    {/* Front mountain */}
    <View
      style={{
        position: 'absolute',
        bottom: 6,
        left: 12,
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderBottomWidth: 9,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: color,
      }}
    />
  </View>
);

export const PdfScanIcon = ({ color = Colors.primary, bg = Colors.surface }) => (
  <View style={WRAP}>
    {/* Page */}
    <View
      style={{
        position: 'absolute',
        left: 5,
        top: 3,
        width: 18,
        height: 22,
        borderRadius: 3,
        borderWidth: 2,
        borderColor: color,
      }}
    />
    {/* Corner fold mask */}
    <View
      style={{
        position: 'absolute',
        left: 18.5,
        top: -1.5,
        width: 9,
        height: 9,
        backgroundColor: bg,
        transform: [{ rotate: '45deg' }],
      }}
    />
    {/* Fold edge */}
    <View
      style={{
        position: 'absolute',
        right: 4.5,
        top: 3.5,
        width: 8,
        height: 2,
        borderRadius: 1,
        backgroundColor: color,
        transform: [{ rotate: '45deg' }],
      }}
    />
    {/* Text lines */}
    <View style={{ position: 'absolute', left: 9, top: 13, width: 10, height: 2, borderRadius: 1, backgroundColor: color }} />
    <View style={{ position: 'absolute', left: 9, top: 17, width: 10, height: 2, borderRadius: 1, backgroundColor: color }} />
    <View style={{ position: 'absolute', left: 9, top: 21, width: 6, height: 2, borderRadius: 1, backgroundColor: color }} />
  </View>
);
