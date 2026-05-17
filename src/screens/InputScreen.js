import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { globalStyles } from '../styles/globalStyles';
import { Button, AnimatedBackground } from '../components';
import { Colors, Sizes } from '../constants';
import { predictRisk } from '../services/api';

export const InputScreen = ({ navigation }) => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [tsh, setTsh] = useState('');
  const [tt3, setTt3] = useState('');
  const [tt4, setTt4] = useState('');
  const [ft3, setFt3] = useState('');
  const [ft4, setFt4] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!age || !gender || !tsh || !tt3 || !tt4) {
      Alert.alert('Missing Fields', 'Please fill in Age, Gender, TSH, TT3, and TT4.');
      return;
    }

    const patientData = {
      age: parseInt(age),
      gender: gender,
      TSH: parseFloat(tsh),
      TT3: parseFloat(tt3),
      TT4: parseFloat(tt4),
    };
    if (ft3) patientData.FT3 = parseFloat(ft3);
    if (ft4) patientData.FT4 = parseFloat(ft4);

    setLoading(true);
    try {
      const result = await predictRisk(patientData);
      navigation.navigate('Report', { results: result });
    } catch (error) {
      Alert.alert('Error', 'Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, value, onChangeText, placeholder, required }) => (
    <View style={{ marginBottom: Sizes.md }}>
      <Text style={{
        fontSize: Sizes.fontSize.xs,
        color: Colors.textSecondary,
        marginBottom: Sizes.xs,
        fontWeight: '500',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
      }}>
        {label} {required ? '' : '(Optional)'}
      </Text>
      <TextInput
        style={{
          backgroundColor: Colors.surface,
          borderRadius: Sizes.borderRadius.md,
          padding: Sizes.lg,
          fontSize: Sizes.fontSize.md,
          borderWidth: 1,
          borderColor: Colors.border,
          color: Colors.text,
        }}
        placeholder={placeholder}
        placeholderTextColor={Colors.textTertiary}
        value={value}
        onChangeText={onChangeText}
        keyboardType="numeric"
      />
    </View>
  );

  return (
    <View style={[globalStyles.container, { backgroundColor: Colors.background }]}>
      <StatusBar style="dark" />
      <AnimatedBackground />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: Sizes.xl,
            paddingTop: Sizes.xxl,
            paddingBottom: Sizes.xxl,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={{
            fontSize: Sizes.fontSize.xxl,
            fontWeight: '600',
            color: Colors.text,
            marginBottom: Sizes.xs,
            textAlign: 'center',
            letterSpacing: -0.5,
          }}>
            Enter Thyroid Values
          </Text>
          <Text style={{
            fontSize: Sizes.fontSize.sm,
            color: Colors.textSecondary,
            textAlign: 'center',
            marginBottom: Sizes.xl,
          }}>
            Fill in your thyroid report values
          </Text>

          <InputField label="Age" value={age} onChangeText={setAge} placeholder="e.g. 45" required />

          {/* Gender Selection */}
          <View style={{ marginBottom: Sizes.md }}>
            <Text style={{
              fontSize: Sizes.fontSize.xs,
              color: Colors.textSecondary,
              marginBottom: Sizes.xs,
              fontWeight: '500',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}>
              Gender
            </Text>
            <View style={{ flexDirection: 'row', gap: Sizes.md }}>
              <TouchableOpacity
                onPress={() => setGender('Male')}
                style={{
                  flex: 1,
                  padding: Sizes.lg,
                  borderRadius: Sizes.borderRadius.md,
                  borderWidth: 1,
                  borderColor: gender === 'Male' ? Colors.primary : Colors.border,
                  backgroundColor: gender === 'Male' ? Colors.primary : Colors.surface,
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  color: gender === 'Male' ? Colors.white : Colors.text,
                  fontWeight: '500',
                  fontSize: Sizes.fontSize.md,
                }}>
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGender('Female')}
                style={{
                  flex: 1,
                  padding: Sizes.lg,
                  borderRadius: Sizes.borderRadius.md,
                  borderWidth: 1,
                  borderColor: gender === 'Female' ? Colors.primary : Colors.border,
                  backgroundColor: gender === 'Female' ? Colors.primary : Colors.surface,
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  color: gender === 'Female' ? Colors.white : Colors.text,
                  fontWeight: '500',
                  fontSize: Sizes.fontSize.md,
                }}>
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <InputField label="TSH" value={tsh} onChangeText={setTsh} placeholder="e.g. 2.5" required />
          <InputField label="TT3" value={tt3} onChangeText={setTt3} placeholder="e.g. 110" required />
          <InputField label="TT4" value={tt4} onChangeText={setTt4} placeholder="e.g. 8.0" required />
          <InputField label="FT3" value={ft3} onChangeText={setFt3} placeholder="e.g. 3.1" />
          <InputField label="FT4" value={ft4} onChangeText={setFt4} placeholder="e.g. 0.8" />

          <View style={{ marginTop: Sizes.md }}>
            <Button
              title={loading ? "Analyzing..." : "Get Risk Assessment"}
              onPress={handlePredict}
              loading={loading}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};