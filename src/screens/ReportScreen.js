import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { globalStyles } from '../styles/globalStyles';
import { Button, AnimatedBackground } from '../components';
import { Colors, Sizes } from '../constants';

/**
 * Minimal luxury Report Screen with smooth animations
 */
export const ReportScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDownload = () => {
    console.log('Downloading report...');
    alert('Report download started!');
  };

  const reportData = {
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    isHypertensive: true,
    overallRisk: 'Medium',
    cardiovascular: {
      risk: 'Low',
    },
    metabolic: {
      risk: 'Medium',
    },
    thyroid: {
      risk: 'Low',
    },
  };

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return Colors.high;
      case 'medium':
        return Colors.medium;
      case 'low':
        return Colors.low;
      default:
        return Colors.textSecondary;
    }
  };

  const RiskBadge = ({ risk }) => {
    const color = getRiskColor(risk);
    return (
      <View
        style={{
          paddingHorizontal: Sizes.md,
          paddingVertical: Sizes.xs,
          borderRadius: Sizes.borderRadius.sm,
          backgroundColor: color + '15',
          borderWidth: 1,
          borderColor: color + '40',
        }}
      >
        <Text
          style={{
            color: color,
            fontWeight: '600',
            fontSize: Sizes.fontSize.xs,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}
        >
          {risk}
        </Text>
      </View>
    );
  };

  return (
    <View style={[globalStyles.container, { backgroundColor: Colors.background }]}>
      <StatusBar style="dark" />
      
      {/* Minimal Animated Background */}
      <AnimatedBackground />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: Sizes.xl,
          paddingTop: Sizes.xxl,
          paddingBottom: Sizes.xxl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Text
            style={{
              fontSize: Sizes.fontSize.xxl,
              fontWeight: '600',
              color: Colors.text,
              marginBottom: Sizes.xs,
              textAlign: 'center',
              letterSpacing: -0.5,
            }}
          >
            Health Report
          </Text>
          <Text
            style={{
              fontSize: Sizes.fontSize.sm,
              color: Colors.textSecondary,
              textAlign: 'center',
              marginBottom: Sizes.xxl,
              letterSpacing: 0.3,
            }}
          >
            {reportData.date}
          </Text>

          {/* Hypertensive Status - Prominent */}
          <View
            style={{
              backgroundColor: Colors.surface,
              borderRadius: 20,
              padding: Sizes.xl,
              marginBottom: Sizes.lg,
              borderWidth: 1,
              borderColor: reportData.isHypertensive ? Colors.error + '40' : Colors.success + '40',
              borderLeftWidth: 4,
              borderLeftColor: reportData.isHypertensive ? Colors.error : Colors.success,
            }}
          >
            <Text
              style={{
                fontSize: Sizes.fontSize.xs,
                color: Colors.textSecondary,
                marginBottom: Sizes.sm,
                fontWeight: '500',
                letterSpacing: 0.5,
                textTransform: 'uppercase',
              }}
            >
              Hypertension Status
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Sizes.sm }}>
              <Text
                style={{
                  fontSize: Sizes.fontSize.xl,
                  fontWeight: '600',
                  color: Colors.text,
                  letterSpacing: -0.5,
                }}
              >
                {reportData.isHypertensive ? 'Yes' : 'No'}
              </Text>
              <RiskBadge risk={reportData.isHypertensive ? 'High' : 'Low'} />
            </View>
            <Text
              style={{
                fontSize: Sizes.fontSize.md,
                color: Colors.text,
                fontWeight: '400',
                letterSpacing: -0.2,
                lineHeight: 22,
              }}
            >
              The person {reportData.isHypertensive ? 'is' : 'is not'} hypertensive.
            </Text>
            {reportData.isHypertensive && (
              <Text
                style={{
                  fontSize: Sizes.fontSize.sm,
                  color: Colors.textSecondary,
                  marginTop: Sizes.sm,
                  lineHeight: 20,
                }}
              >
                Elevated blood pressure detected. Consult with your healthcare provider for management strategies.
              </Text>
            )}
          </View>

          {/* Overall Risk */}
          <View
            style={{
              backgroundColor: Colors.surface,
              borderRadius: 20,
              padding: Sizes.xl,
              marginBottom: Sizes.lg,
              borderWidth: 1,
              borderColor: Colors.border,
            }}
          >
            <Text
              style={{
                fontSize: Sizes.fontSize.xs,
                color: Colors.textSecondary,
                marginBottom: Sizes.sm,
                fontWeight: '500',
                letterSpacing: 0.5,
                textTransform: 'uppercase',
              }}
            >
              Overall Risk Level
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text
                style={{
                  fontSize: Sizes.fontSize.xl,
                  fontWeight: '600',
                  color: Colors.text,
                  letterSpacing: -0.5,
                }}
              >
                {reportData.overallRisk}
              </Text>
              <RiskBadge risk={reportData.overallRisk} />
            </View>
          </View>

          {/* Risk Categories - Minimal */}
          <View style={{ gap: Sizes.md, marginBottom: Sizes.xl }}>
            <View
              style={{
                backgroundColor: Colors.surface,
                borderRadius: 20,
                padding: Sizes.lg,
                borderWidth: 1,
                borderColor: Colors.border,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: Sizes.fontSize.md,
                    fontWeight: '500',
                    color: Colors.text,
                    letterSpacing: -0.2,
                  }}
                >
                  Cardiovascular
                </Text>
                <RiskBadge risk={reportData.cardiovascular.risk} />
              </View>
            </View>

            <View
              style={{
                backgroundColor: Colors.surface,
                borderRadius: 20,
                padding: Sizes.lg,
                borderWidth: 1,
                borderColor: Colors.border,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: Sizes.fontSize.md,
                    fontWeight: '500',
                    color: Colors.text,
                    letterSpacing: -0.2,
                  }}
                >
                  Metabolic
                </Text>
                <RiskBadge risk={reportData.metabolic.risk} />
              </View>
            </View>

            <View
              style={{
                backgroundColor: Colors.surface,
                borderRadius: 20,
                padding: Sizes.lg,
                borderWidth: 1,
                borderColor: Colors.border,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: Sizes.fontSize.md,
                    fontWeight: '500',
                    color: Colors.text,
                    letterSpacing: -0.2,
                  }}
                >
                  Thyroid Related
                </Text>
                <RiskBadge risk={reportData.thyroid.risk} />
              </View>
            </View>
          </View>

          {/* Download Button - Minimal */}
          <Button
            title="Download Report"
            onPress={handleDownload}
            style={{
              backgroundColor: Colors.primary,
              paddingVertical: Sizes.lg,
              borderRadius: 12,
            }}
            textStyle={{
              fontSize: Sizes.fontSize.md,
              fontWeight: '500',
              letterSpacing: 0.3,
            }}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
};
