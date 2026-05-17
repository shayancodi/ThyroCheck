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
 * Report Screen - Shows real API prediction results
 */
export const ReportScreen = ({ navigation, route }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const results = route.params?.results;

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

  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

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

  if (!results) {
    return (
      <View style={[globalStyles.container, { backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: Sizes.fontSize.lg, color: Colors.textSecondary }}>
          No results yet.
        </Text>
        <Button
          title="Enter Thyroid Values"
          onPress={() => navigation.navigate('Input')}
          style={{ marginTop: Sizes.lg, backgroundColor: Colors.primary, paddingHorizontal: Sizes.xl, paddingVertical: Sizes.md, borderRadius: 12 }}
        />
      </View>
    );
  }

const hfRisk = results.heart_failure.risk_percent;
const chdRisk = results.coronary_heart_disease.risk_percent;
const hfLevel = results.heart_failure.risk_level;
const chdLevel = results.coronary_heart_disease.risk_level;

  const overallLevel = hfRisk > 50 || chdRisk > 50 ? 'High' : hfRisk > 25 || chdRisk > 25 ? 'Medium' : 'Low';

  return (
    <View style={[globalStyles.container, { backgroundColor: Colors.background }]}>
      <StatusBar style="dark" />
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
          <Text style={{
            fontSize: Sizes.fontSize.xxl,
            fontWeight: '600',
            color: Colors.text,
            marginBottom: Sizes.xs,
            textAlign: 'center',
            letterSpacing: -0.5,
          }}>
            Health Report
          </Text>
          <Text style={{
            fontSize: Sizes.fontSize.sm,
            color: Colors.textSecondary,
            textAlign: 'center',
            marginBottom: Sizes.xxl,
            letterSpacing: 0.3,
          }}>
            {date}
          </Text>

          {/* Overall Risk */}
          <View style={{
            backgroundColor: Colors.surface,
            borderRadius: 20,
            padding: Sizes.xl,
            marginBottom: Sizes.lg,
            borderWidth: 1,
            borderColor: Colors.border,
          }}>
            <Text style={{
              fontSize: Sizes.fontSize.xs,
              color: Colors.textSecondary,
              marginBottom: Sizes.sm,
              fontWeight: '500',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}>
              Overall Risk Level
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{
                fontSize: Sizes.fontSize.xl,
                fontWeight: '600',
                color: Colors.text,
                letterSpacing: -0.5,
              }}>
                {overallLevel}
              </Text>
              <RiskBadge risk={overallLevel} />
            </View>
          </View>

          {/* Heart Failure */}
          <View style={{
            backgroundColor: Colors.surface,
            borderRadius: 20,
            padding: Sizes.xl,
            marginBottom: Sizes.lg,
            borderWidth: 1,
            borderColor: getRiskColor(hfLevel) + '40',
            borderLeftWidth: 4,
            borderLeftColor: getRiskColor(hfLevel),
          }}>
            <Text style={{
              fontSize: Sizes.fontSize.xs,
              color: Colors.textSecondary,
              marginBottom: Sizes.sm,
              fontWeight: '500',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}>
              Heart Failure Risk
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Sizes.sm }}>
              <Text style={{
                fontSize: Sizes.fontSize.xxxl,
                fontWeight: '600',
                color: Colors.text,
              }}>
                {hfRisk.toFixed(1)}%
              </Text>
              <RiskBadge risk={hfLevel} />
            </View>
            <Text style={{
              fontSize: Sizes.fontSize.sm,
              color: Colors.textSecondary,
              lineHeight: 20,
            }}>
              Based on thyroid panel analysis using AI prediction model.
            </Text>
          </View>

          {/* Coronary Heart Disease */}
          <View style={{
            backgroundColor: Colors.surface,
            borderRadius: 20,
            padding: Sizes.xl,
            marginBottom: Sizes.xl,
            borderWidth: 1,
            borderColor: getRiskColor(chdLevel) + '40',
            borderLeftWidth: 4,
            borderLeftColor: getRiskColor(chdLevel),
          }}>
            <Text style={{
              fontSize: Sizes.fontSize.xs,
              color: Colors.textSecondary,
              marginBottom: Sizes.sm,
              fontWeight: '500',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}>
              Coronary Heart Disease Risk
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Sizes.sm }}>
              <Text style={{
                fontSize: Sizes.fontSize.xxxl,
                fontWeight: '600',
                color: Colors.text,
              }}>
                {chdRisk.toFixed(1)}%
              </Text>
              <RiskBadge risk={chdLevel} />
            </View>
            <Text style={{
              fontSize: Sizes.fontSize.sm,
              color: Colors.textSecondary,
              lineHeight: 20,
            }}>
              Based on thyroid panel analysis using AI prediction model.
            </Text>
          </View>

          {/* Disclaimer */}
          <View style={{
            backgroundColor: Colors.surfaceElevated,
            borderRadius: 12,
            padding: Sizes.lg,
            marginBottom: Sizes.xl,
          }}>
            <Text style={{
              fontSize: Sizes.fontSize.xs,
              color: Colors.textTertiary,
              lineHeight: 18,
              textAlign: 'center',
            }}>
              This assessment is for informational purposes only and should not replace professional medical advice. Consult your healthcare provider for diagnosis and treatment.
            </Text>
          </View>

          {/* Back Button */}
          <Button
            title="New Assessment"
            onPress={() => navigation.navigate('Input')}
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