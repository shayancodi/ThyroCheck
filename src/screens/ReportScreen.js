import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { globalStyles } from '../styles/globalStyles';
import { Button, AnimatedBackground, BackHeader } from '../components';
import { Colors, Sizes } from '../constants';
import { generatePdfReport } from '../services/api';
import { auth } from '../services/firebase';
import { saveHistory } from '../services/history';

/**
 * Report Screen - Shows real API prediction results
 */
export const ReportScreen = ({ navigation, route }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const results = route.params?.results;
  const patientData = route.params?.patientData;
  const [downloading, setDownloading] = useState(false);

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

    if (results && patientData) {
      saveHistory(patientData, results).catch((err) =>
        console.warn('Failed to save history:', err)
      );
    }
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

  const handleDownloadPdf = async () => {
    if (!patientData || !results) {
      Alert.alert('Error', 'Missing data to generate PDF.');
      return;
    }
    setDownloading(true);
    try {
      const user = auth.currentUser;
      const reportData = {
        name: user?.displayName || user?.email?.split('@')[0] || 'User',
        age: patientData.age,
        gender: patientData.gender,
        TSH: patientData.TSH,
        FT3: patientData.FT3 ?? null,
        FT4: patientData.FT4 ?? null,
        TT3: patientData.TT3,
        TT4: patientData.TT4,
        hf_risk_percent: results.heart_failure.risk_percent,
        hf_risk_level: results.heart_failure.risk_level,
        chd_risk_percent: results.coronary_heart_disease.risk_percent,
        chd_risk_level: results.coronary_heart_disease.risk_level,
      };

      const { pdf_base64, filename } = await generatePdfReport(reportData);

      const fileUri = FileSystem.documentDirectory + filename;
      await FileSystem.writeAsStringAsync(fileUri, pdf_base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Save or Share Your ThyroCheck Report',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('Saved', `PDF saved to: ${fileUri}`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Download Failed', error.message || 'Could not generate PDF report.');
    } finally {
      setDownloading(false);
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

      {navigation.canGoBack() && <BackHeader navigation={navigation} title="Home" />}

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: Sizes.xl,
          paddingTop: navigation.canGoBack() ? Sizes.md : Sizes.xxl,
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

          {/* Download PDF Button */}
          <Button
            title={downloading ? 'Generating PDF...' : '📄 Download PDF Report'}
            onPress={handleDownloadPdf}
            loading={downloading}
            disabled={downloading}
            style={{
              backgroundColor: Colors.primary,
              paddingVertical: Sizes.lg,
              borderRadius: 12,
              marginBottom: Sizes.md,
            }}
            textStyle={{
              fontSize: Sizes.fontSize.md,
              fontWeight: '500',
              letterSpacing: 0.3,
            }}
          />

          {/* New Assessment Button (Secondary) */}
          <Button
            title="New Assessment"
            onPress={() => navigation.navigate('Input')}
            style={{
              backgroundColor: 'transparent',
              paddingVertical: Sizes.lg,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: Colors.primary,
            }}
            textStyle={{
              color: Colors.primary,
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