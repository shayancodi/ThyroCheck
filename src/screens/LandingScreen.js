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
 * Minimal luxury Landing/Home Screen with smooth animations
 */
export const LandingScreen = ({ navigation }) => {
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

  const handleUpload = () => {
    navigation.navigate('Input');
  };

  return (
    <View style={[globalStyles.container, { backgroundColor: Colors.background }]}>
      <StatusBar style="dark" />
      
      {/* Minimal Animated Background */}
      <AnimatedBackground />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: Sizes.xl,
          paddingTop: Sizes.xxl + 20,
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
          {/* Hero Section - Minimal */}
          <View style={{ alignItems: 'center', marginBottom: Sizes.xxl }}>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: Colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: Sizes.xl,
              }}
            >
              <Text
                style={{
                  fontSize: 40,
                  color: Colors.accent,
                  fontWeight: '300',
                  letterSpacing: 2,
                }}
              >
                TC
              </Text>
            </View>

            <Text
              style={{
                fontSize: 26,
                fontWeight: '600',
                textAlign: 'center',
                color: Colors.text,
                marginBottom: Sizes.md,
                letterSpacing: -0.5,
                lineHeight: 32,
              }}
            >
              Hyper Tension & Disease Risk Predictor
            </Text>

            <Text
              style={{
                fontSize: Sizes.fontSize.md,
                textAlign: 'center',
                color: Colors.textSecondary,
                lineHeight: 24,
                paddingHorizontal: Sizes.lg,
              }}
            >
              Advanced AI-powered health analysis for comprehensive risk assessment across cardiovascular, metabolic, and thyroid health
            </Text>
          </View>

          {/* About Section - Minimal Card */}
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
                fontSize: Sizes.fontSize.lg,
                fontWeight: '600',
                color: Colors.text,
                marginBottom: Sizes.md,
                letterSpacing: -0.3,
              }}
            >
              About ThyroCheck
            </Text>
            <Text
              style={{
                fontSize: Sizes.fontSize.md,
                color: Colors.textSecondary,
                lineHeight: 24,
                marginBottom: Sizes.md,
              }}
            >
              ThyroCheck leverages cutting-edge artificial intelligence to analyze your medical data and provide comprehensive risk assessments. Our advanced system processes medical reports, images, and PDF documents to generate personalized health insights.
            </Text>
            <Text
              style={{
                fontSize: Sizes.fontSize.md,
                color: Colors.textSecondary,
                lineHeight: 24,
              }}
            >
              Simply upload your medical documents, and our AI will analyze your health profile across multiple disease categories, providing you with actionable insights and risk assessments.
            </Text>
          </View>

          {/* Analysis Categories - Minimal */}
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
                fontSize: Sizes.fontSize.lg,
                fontWeight: '600',
                color: Colors.text,
                marginBottom: Sizes.lg,
                letterSpacing: -0.3,
              }}
            >
              Analysis Categories
            </Text>

            <View style={{ gap: Sizes.lg }}>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Sizes.xs }}>
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: Colors.accent,
                      marginRight: Sizes.md,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: Sizes.fontSize.md,
                      fontWeight: '600',
                      color: Colors.text,
                      letterSpacing: -0.2,
                    }}
                  >
                    Cardiovascular Health
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: Sizes.fontSize.sm,
                    color: Colors.textSecondary,
                    lineHeight: 20,
                    paddingLeft: Sizes.lg,
                  }}
                >
                  Comprehensive assessment of heart disease risk, hypertension indicators, and cardiovascular conditions through advanced pattern recognition and biomarker analysis.
                </Text>
              </View>

              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Sizes.xs }}>
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: Colors.accent,
                      marginRight: Sizes.md,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: Sizes.fontSize.md,
                      fontWeight: '600',
                      color: Colors.text,
                      letterSpacing: -0.2,
                    }}
                  >
                    Metabolic Disorders
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: Sizes.fontSize.sm,
                    color: Colors.textSecondary,
                    lineHeight: 20,
                    paddingLeft: Sizes.lg,
                  }}
                >
                  Evaluation of metabolic markers including diabetes risk factors, cholesterol levels, insulin resistance, and metabolic syndrome indicators for early detection and prevention.
                </Text>
              </View>

              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Sizes.xs }}>
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: Colors.accent,
                      marginRight: Sizes.md,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: Sizes.fontSize.md,
                      fontWeight: '600',
                      color: Colors.text,
                      letterSpacing: -0.2,
                    }}
                  >
                    Thyroid Function
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: Sizes.fontSize.sm,
                    color: Colors.textSecondary,
                    lineHeight: 20,
                    paddingLeft: Sizes.lg,
                  }}
                >
                  Detailed monitoring of thyroid health, detection of abnormalities in hormone levels, and comprehensive risk assessment for thyroid-related diseases and conditions.
                </Text>
              </View>
            </View>
          </View>

          {/* Process - Minimal */}
          <View
            style={{
              backgroundColor: Colors.surface,
              borderRadius: 20,
              padding: Sizes.xl,
              marginBottom: Sizes.xl,
              borderWidth: 1,
              borderColor: Colors.border,
            }}
          >
            <Text
              style={{
                fontSize: Sizes.fontSize.lg,
                fontWeight: '600',
                color: Colors.text,
                marginBottom: Sizes.md,
                letterSpacing: -0.3,
              }}
            >
              How It Works
            </Text>
            <View style={{ gap: Sizes.md }}>
              <Text
                style={{
                  fontSize: Sizes.fontSize.sm,
                  color: Colors.textSecondary,
                  lineHeight: 22,
                }}
              >
                Upload your medical documents in image or PDF format. Our AI system processes your data using advanced machine learning algorithms to extract relevant health information.
              </Text>
              <Text
                style={{
                  fontSize: Sizes.fontSize.sm,
                  color: Colors.textSecondary,
                  lineHeight: 22,
                }}
              >
                Receive a comprehensive risk assessment report detailing your health status across all three categories, with clear risk levels and actionable recommendations.
              </Text>
              <Text
                style={{
                  fontSize: Sizes.fontSize.sm,
                  color: Colors.textSecondary,
                  lineHeight: 22,
                }}
              >
                Download your personalized report and share it with healthcare providers for informed medical decisions and proactive health management.
              </Text>
            </View>
          </View>

          {/* Upload Button - Minimal */}
          <View style={{ marginTop: Sizes.md }}>
            <Button
              title="Upload Image or PDF to Check"
              onPress={handleUpload}
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
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};
