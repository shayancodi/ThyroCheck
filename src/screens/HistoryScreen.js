import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import { globalStyles } from '../styles/globalStyles';
import { Colors, Sizes } from '../constants';
import { getHistory } from '../services/history';

/**
 * History Screen — lists all past ThyroCheck assessments from Firestore
 */
export const HistoryScreen = ({ navigation }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      const data = await getHistory();
      setRecords(data);
    } catch (err) {
      console.warn('History fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchHistory();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const getRiskColor = (level) => {
    switch ((level || '').toLowerCase()) {
      case 'high':     return Colors.high;
      case 'moderate':
      case 'medium':   return Colors.medium;
      default:         return Colors.low;
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const RiskBadge = ({ level }) => (
    <View style={{
      paddingHorizontal: Sizes.sm,
      paddingVertical: 3,
      borderRadius: 6,
      backgroundColor: getRiskColor(level) + '20',
      borderWidth: 1,
      borderColor: getRiskColor(level) + '50',
    }}>
      <Text style={{
        color: getRiskColor(level),
        fontSize: Sizes.fontSize.xs,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
      }}>
        {level}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[globalStyles.container, { backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ color: Colors.textSecondary, marginTop: Sizes.md, fontSize: Sizes.fontSize.sm }}>
          Loading history...
        </Text>
      </View>
    );
  }

  return (
    <View style={[globalStyles.container, { backgroundColor: Colors.background }]}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: Sizes.xl,
          paddingTop: Sizes.xxl + 16,
          paddingBottom: Sizes.xxl,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* Header */}
        <Text style={{
          fontSize: Sizes.fontSize.xxl,
          fontWeight: '600',
          color: Colors.text,
          marginBottom: Sizes.xs,
          letterSpacing: -0.5,
        }}>
          History
        </Text>
        <Text style={{
          fontSize: Sizes.fontSize.sm,
          color: Colors.textSecondary,
          marginBottom: Sizes.xl,
          letterSpacing: 0.3,
        }}>
          {records.length} past assessment{records.length !== 1 ? 's' : ''}
        </Text>

        {records.length === 0 ? (
          <View style={{
            alignItems: 'center',
            marginTop: Sizes.xxl * 2,
          }}>
            <Text style={{ fontSize: 48, marginBottom: Sizes.lg }}>📋</Text>
            <Text style={{
              fontSize: Sizes.fontSize.lg,
              fontWeight: '600',
              color: Colors.text,
              marginBottom: Sizes.sm,
            }}>
              No assessments yet
            </Text>
            <Text style={{
              fontSize: Sizes.fontSize.sm,
              color: Colors.textSecondary,
              textAlign: 'center',
              lineHeight: 20,
            }}>
              Complete a thyroid scan and prediction to see your history here.
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Input')}
              style={{
                marginTop: Sizes.xl,
                backgroundColor: Colors.primary,
                paddingHorizontal: Sizes.xl,
                paddingVertical: Sizes.md,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: Colors.white, fontWeight: '600', fontSize: Sizes.fontSize.sm }}>
                Start Assessment
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          records.map((item, index) => (
            <View
              key={item.id}
              style={{
                backgroundColor: Colors.surface,
                borderRadius: 16,
                padding: Sizes.xl,
                marginBottom: Sizes.md,
                borderWidth: 1,
                borderColor: Colors.border,
              }}
            >
              {/* Date + index */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Sizes.md }}>
                <Text style={{
                  fontSize: Sizes.fontSize.xs,
                  color: Colors.textTertiary,
                  fontWeight: '500',
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                }}>
                  {formatDate(item.createdAt)}
                </Text>
                <Text style={{
                  fontSize: Sizes.fontSize.xs,
                  color: Colors.textTertiary,
                }}>
                  #{records.length - index}
                </Text>
              </View>

              {/* Patient info row */}
              <Text style={{
                fontSize: Sizes.fontSize.sm,
                color: Colors.textSecondary,
                marginBottom: Sizes.md,
              }}>
                Age {item.age} · {item.gender}  ·  TSH {item.TSH}  ·  TT3 {item.TT3}  ·  TT4 {item.TT4}
              </Text>

              {/* Risk results */}
              <View style={{ flexDirection: 'row', gap: Sizes.md }}>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: Sizes.fontSize.xs,
                    color: Colors.textTertiary,
                    marginBottom: 4,
                  }}>
                    Heart Failure
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: Sizes.xs }}>
                    <Text style={{
                      fontSize: Sizes.fontSize.md,
                      fontWeight: '600',
                      color: Colors.text,
                    }}>
                      {item.heart_failure?.risk_percent?.toFixed(1)}%
                    </Text>
                    <RiskBadge level={item.heart_failure?.risk_level} />
                  </View>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: Sizes.fontSize.xs,
                    color: Colors.textTertiary,
                    marginBottom: 4,
                  }}>
                    Coronary HD
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: Sizes.xs }}>
                    <Text style={{
                      fontSize: Sizes.fontSize.md,
                      fontWeight: '600',
                      color: Colors.text,
                    }}>
                      {item.coronary_heart_disease?.risk_percent?.toFixed(1)}%
                    </Text>
                    <RiskBadge level={item.coronary_heart_disease?.risk_level} />
                  </View>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};
