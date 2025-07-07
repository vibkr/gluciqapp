import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Card } from '../ui';

interface NutritionValues {
  calories: number;
  carbohydrates: number;
  fat: number;
  protein: number;
  fiber: number;
  sugar: number;
  sodium?: number;
}

interface NutritionCardProps {
  nutrition: NutritionValues;
  portion?: {
    amount: number;
    unit: string;
  };
  showDetailed?: boolean;
  onPress?: () => void;
  style?: any;
}

export default function NutritionCard({ 
  nutrition, 
  portion, 
  showDetailed = false, 
  onPress,
  style 
}: NutritionCardProps) {
  const { theme } = useTheme();

  const macroPercentages = {
    carbs: (nutrition.carbohydrates * 4) / nutrition.calories * 100,
    protein: (nutrition.protein * 4) / nutrition.calories * 100,
    fat: (nutrition.fat * 9) / nutrition.calories * 100,
  };

  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper style={[style]} onPress={onPress}>
      <Card>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Nutrition Facts
            </Text>
            {portion && (
              <Text style={[styles.portion, { color: theme.colors.textSecondary }]}>
                Per {portion.amount}{portion.unit}
              </Text>
            )}
          </View>
          {onPress && (
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          )}
        </View>

        {/* Calories */}
        <View style={[styles.caloriesSection, { borderColor: theme.colors.border }]}>
          <Text style={[styles.caloriesLabel, { color: theme.colors.textSecondary }]}>
            Calories
          </Text>
          <Text style={[styles.caloriesValue, { color: theme.colors.text }]}>
            {nutrition.calories}
          </Text>
        </View>

        {/* Macronutrients */}
        <View style={styles.macroSection}>
          <View style={styles.macroRow}>
            <Text style={[styles.macroLabel, { color: theme.colors.text }]}>
              Carbohydrates
            </Text>
            <Text style={[styles.macroValue, { color: theme.colors.primary }]}>
              {nutrition.carbohydrates}g
            </Text>
          </View>
          
          <View style={styles.macroRow}>
            <Text style={[styles.macroLabel, { color: theme.colors.text }]}>
              Protein
            </Text>
            <Text style={[styles.macroValue, { color: theme.colors.text }]}>
              {nutrition.protein}g
            </Text>
          </View>
          
          <View style={styles.macroRow}>
            <Text style={[styles.macroLabel, { color: theme.colors.text }]}>
              Fat
            </Text>
            <Text style={[styles.macroValue, { color: theme.colors.text }]}>
              {nutrition.fat}g
            </Text>
          </View>
        </View>

        {showDetailed && (
          <>
            {/* Micronutrients */}
            <View style={[styles.microSection, { borderColor: theme.colors.border }]}>
              <View style={styles.microRow}>
                <Text style={[styles.microLabel, { color: theme.colors.textSecondary }]}>
                  Fiber
                </Text>
                <Text style={[styles.microValue, { color: theme.colors.text }]}>
                  {nutrition.fiber}g
                </Text>
              </View>
              
              <View style={styles.microRow}>
                <Text style={[styles.microLabel, { color: theme.colors.textSecondary }]}>
                  Sugar
                </Text>
                <Text style={[styles.microValue, { color: theme.colors.text }]}>
                  {nutrition.sugar}g
                </Text>
              </View>
              
              {nutrition.sodium !== undefined && (
                <View style={styles.microRow}>
                  <Text style={[styles.microLabel, { color: theme.colors.textSecondary }]}>
                    Sodium
                  </Text>
                  <Text style={[styles.microValue, { color: theme.colors.text }]}>
                    {nutrition.sodium}mg
                  </Text>
                </View>
              )}
            </View>

            {/* Macro Distribution */}
            <View style={[styles.distributionSection, { borderColor: theme.colors.border }]}>
              <Text style={[styles.distributionTitle, { color: theme.colors.text }]}>
                Calorie Distribution
              </Text>
              
              <View style={styles.distributionBars}>
                <View style={styles.distributionRow}>
                  <View style={styles.distributionLabel}>
                    <View style={[styles.distributionDot, { backgroundColor: theme.colors.primary }]} />
                    <Text style={[styles.distributionText, { color: theme.colors.textSecondary }]}>
                      Carbs
                    </Text>
                  </View>
                  <Text style={[styles.distributionPercent, { color: theme.colors.text }]}>
                    {macroPercentages.carbs.toFixed(0)}%
                  </Text>
                </View>
                
                <View style={styles.distributionRow}>
                  <View style={styles.distributionLabel}>
                    <View style={[styles.distributionDot, { backgroundColor: '#10B981' }]} />
                    <Text style={[styles.distributionText, { color: theme.colors.textSecondary }]}>
                      Protein
                    </Text>
                  </View>
                  <Text style={[styles.distributionPercent, { color: theme.colors.text }]}>
                    {macroPercentages.protein.toFixed(0)}%
                  </Text>
                </View>
                
                <View style={styles.distributionRow}>
                  <View style={styles.distributionLabel}>
                    <View style={[styles.distributionDot, { backgroundColor: '#F59E0B' }]} />
                    <Text style={[styles.distributionText, { color: theme.colors.textSecondary }]}>
                      Fat
                    </Text>
                  </View>
                  <Text style={[styles.distributionPercent, { color: theme.colors.text }]}>
                    {macroPercentages.fat.toFixed(0)}%
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </Card>
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  portion: {
    fontSize: 14,
    marginTop: 2,
  },
  caloriesSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 2,
  },
  caloriesLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  caloriesValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  macroSection: {
    marginBottom: 16,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  macroLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  microSection: {
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
  },
  microRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  microLabel: {
    fontSize: 14,
    marginLeft: 16,
  },
  microValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  distributionSection: {
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
  },
  distributionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  distributionBars: {
    gap: 8,
  },
  distributionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distributionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distributionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  distributionText: {
    fontSize: 14,
  },
  distributionPercent: {
    fontSize: 14,
    fontWeight: '600',
  },
});