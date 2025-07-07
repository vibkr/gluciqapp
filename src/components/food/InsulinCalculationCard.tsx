import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, Button } from '../ui';
import { InsulinCalculationResult } from '../../types/insulin';

interface InsulinCalculationCardProps {
  calculation: InsulinCalculationResult;
  onAcceptDose?: (dose: number) => void;
  onModifyDose?: (calculation: InsulinCalculationResult) => void;
  style?: any;
}

export default function InsulinCalculationCard({ 
  calculation, 
  onAcceptDose,
  onModifyDose,
  style 
}: InsulinCalculationCardProps) {
  const { theme } = useTheme();
  const [showDetails, setShowDetails] = useState(false);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#10B981'; // green
    if (confidence >= 60) return '#F59E0B'; // yellow
    return '#EF4444'; // red
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80) return 'checkmark-circle';
    if (confidence >= 60) return 'warning';
    return 'alert-circle';
  };

  const handleAcceptDose = () => {
    if (calculation.total_recommendation.safety_warnings.length > 0) {
      Alert.alert(
        'Safety Warning',
        `This calculation has safety warnings:\n\n${calculation.total_recommendation.safety_warnings.join('\n')}\n\nDo you want to proceed?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Proceed', 
            style: 'destructive',
            onPress: () => onAcceptDose?.(calculation.total_recommendation.units)
          }
        ]
      );
    } else {
      onAcceptDose?.(calculation.total_recommendation.units);
    }
  };

  return (
    <Card style={[style]}>
      {/* Header */}
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setShowDetails(!showDetails)}
      >
        <View style={styles.titleContainer}>
          <Ionicons name="medical" size={20} color={theme.colors.primary} />
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Insulin Recommendation
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          <View style={styles.doseContainer}>
            <Text style={[styles.doseValue, { color: theme.colors.primary }]}>
              {calculation.total_recommendation.units}
            </Text>
            <Text style={[styles.doseUnit, { color: theme.colors.textSecondary }]}>
              units
            </Text>
          </View>
          <Ionicons 
            name={showDetails ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={theme.colors.textSecondary} 
          />
        </View>
      </TouchableOpacity>

      {/* Confidence Indicator */}
      <View style={styles.confidenceContainer}>
        <Ionicons 
          name={getConfidenceIcon(calculation.total_recommendation.confidence_level)} 
          size={16} 
          color={getConfidenceColor(calculation.total_recommendation.confidence_level)} 
        />
        <Text style={[styles.confidenceText, { color: getConfidenceColor(calculation.total_recommendation.confidence_level) }]}>
          {calculation.total_recommendation.confidence_level}% confidence
        </Text>
        {calculation.total_recommendation.safety_warnings.length > 0 && (
          <>
            <View style={styles.separator} />
            <Ionicons name="warning" size={16} color="#F59E0B" />
            <Text style={[styles.warningCount, { color: '#F59E0B' }]}>
              {calculation.total_recommendation.safety_warnings.length} warning{calculation.total_recommendation.safety_warnings.length !== 1 ? 's' : ''}
            </Text>
          </>
        )}
      </View>

      {/* Quick Summary */}
      <View style={styles.quickSummary}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
            Carb Coverage
          </Text>
          <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
            {calculation.carb_dose.units.toFixed(1)} units
          </Text>
        </View>
        
        {calculation.correction_dose.units > 0 && (
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Correction
            </Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
              {calculation.correction_dose.units.toFixed(1)} units
            </Text>
          </View>
        )}
        
        {calculation.insulin_on_board.active_units > 0 && (
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              IOB Adjustment
            </Text>
            <Text style={[styles.summaryValue, { color: '#EF4444' }]}>
              -{calculation.insulin_on_board.active_units.toFixed(1)} units
            </Text>
          </View>
        )}
      </View>

      {/* Detailed Breakdown */}
      {showDetails && (
        <View style={[styles.detailsContainer, { borderColor: theme.colors.border }]}>
          <Text style={[styles.detailsTitle, { color: theme.colors.text }]}>
            Calculation Details
          </Text>
          
          <Text style={[styles.breakdown, { color: theme.colors.textSecondary }]}>
            {calculation.total_recommendation.breakdown}
          </Text>

          {/* Carb Dose Details */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.text }]}>
              Carb Ratio Used:
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.textSecondary }]}>
              1:{calculation.carb_dose.ratio_used}
            </Text>
          </View>

          {calculation.correction_dose.units > 0 && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.text }]}>
                Sensitivity Factor:
              </Text>
              <Text style={[styles.detailValue, { color: theme.colors.textSecondary }]}>
                1:{calculation.correction_dose.sensitivity_used}
              </Text>
            </View>
          )}

          {/* Safety Warnings */}
          {calculation.total_recommendation.safety_warnings.length > 0 && (
            <View style={styles.warningsSection}>
              <Text style={[styles.warningsTitle, { color: '#F59E0B' }]}>
                Safety Warnings
              </Text>
              {calculation.total_recommendation.safety_warnings.map((warning, index) => (
                <View key={index} style={styles.warningItem}>
                  <Ionicons name="warning" size={14} color="#F59E0B" />
                  <Text style={[styles.warningText, { color: theme.colors.text }]}>
                    {warning}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* IOB Details */}
          {calculation.insulin_on_board.active_units > 0 && (
            <View style={styles.iobSection}>
              <Text style={[styles.iobTitle, { color: theme.colors.text }]}>
                Insulin on Board
              </Text>
              <Text style={[styles.iobDetails, { color: theme.colors.textSecondary }]}>
                {calculation.insulin_on_board.active_units.toFixed(1)} units active
              </Text>
              <Text style={[styles.iobDetails, { color: theme.colors.textSecondary }]}>
                ~{calculation.insulin_on_board.remaining_action_time} minutes remaining
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          title="Accept Dose"
          onPress={handleAcceptDose}
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          disabled={!onAcceptDose}
        />
        <Button
          title="Modify"
          onPress={() => onModifyDose?.(calculation)}
          style={[styles.actionButton, { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.primary }]}
          textStyle={{ color: theme.colors.primary }}
          disabled={!onModifyDose}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doseContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginRight: 8,
  },
  doseValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  doseUnit: {
    fontSize: 14,
    marginLeft: 4,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  separator: {
    width: 1,
    height: 12,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  warningCount: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  quickSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  detailsContainer: {
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  breakdown: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
  },
  warningsSection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  warningsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    marginLeft: 6,
    flex: 1,
    lineHeight: 18,
  },
  iobSection: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  iobTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  iobDetails: {
    fontSize: 13,
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
  },
});