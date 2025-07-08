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

  // Add null safety checks for nutrition data
  const safeNutrition = {
    calories: nutrition?.calories || 0,
    carbohydrates: nutrition?.carbohydrates || 0,
    fat: nutrition?.fat || 0,
    protein: nutrition?.protein || 0,
    fiber: nutrition?.fiber || 0,
    sugar: nutrition?.sugar || 0,
    sodium: nutrition?.sodium,
  };

  // Safe calculation of macro percentages with fallback values
  const calculateMacroPercentages = () => {
    if (!safeNutrition.calories || safeNutrition.calories <= 0) {
      return { carbs: 0, protein: 0, fat: 0 };
    }
    
    const carbsPercent = (safeNutrition.carbohydrates * 4) / safeNutrition.calories * 100;
    const proteinPercent = (safeNutrition.protein * 4) / safeNutrition.calories * 100;
    const fatPercent = (safeNutrition.fat * 9) / safeNutrition.calories * 100;
    
    return {
      carbs: isFinite(carbsPercent) ? carbsPercent : 0,
      protein: isFinite(proteinPercent) ? proteinPercent : 0,
      fat: isFinite(fatPercent) ? fatPercent : 0,
    };
  };

  const macroPercentages = calculateMacroPercentages();

  // Ensure all percentage values are valid numbers before using toFixed
  const safePercentages = {
    carbs: typeof macroPercentages.carbs === 'number' && isFinite(macroPercentages.carbs) ? macroPercentages.carbs : 0,
    protein: typeof macroPercentages.protein === 'number' && isFinite(macroPercentages.protein) ? macroPercentages.protein : 0,
    fat: typeof macroPercentages.fat === 'number' && isFinite(macroPercentages.fat) ? macroPercentages.fat : 0,
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
            {safeNutrition.calories}
          </Text>
        </View>

        {/* Macronutrients */}
        <View style={styles.macroSection}>
          <View style={styles.macroRow}>
            <Text style={[styles.macroLabel, { color: theme.colors.text }]}>
              Carbohydrates
            </Text>
            <Text style={[styles.macroValue, { color: theme.colors.primary }]}>
              {safeNutrition.carbohydrates}g
            </Text>
          </View>
          
          <View style={styles.macroRow}>
            <Text style={[styles.macroLabel, { color: theme.colors.text }]}>
              Protein
            </Text>
            <Text style={[styles.macroValue, { color: theme.colors.text }]}>
              {safeNutrition.protein}g
            </Text>
          </View>
          
          <View style={styles.macroRow}>
            <Text style={[styles.macroLabel, { color: theme.colors.text }]}>
              Fat
            </Text>
            <Text style={[styles.macroValue, { color: theme.colors.text }]}>
              {safeNutrition.fat}g
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
                  {safeNutrition.fiber}g
                </Text>
              </View>
              
              <View style={styles.microRow}>
                <Text style={[styles.microLabel, { color: theme.colors.textSecondary }]}>
                  Sugar
                </Text>
                <Text style={[styles.microValue, { color: theme.colors.text }]}>
                  {safeNutrition.sugar}g
                </Text>
              </View>
              
              {safeNutrition.sodium !== undefined && (
                <View style={styles.microRow}>
                  <Text style={[styles.microLabel, { color: theme.colors.textSecondary }]}>
                    Sodium
                  </Text>
                  <Text style={[styles.microValue, { color: theme.colors.text }]}>
                    {safeNutrition.sodium}mg
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
                    {((safePercentages.carbs || 0)).toFixed(0)}%
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
                    {((safePercentages.protein || 0)).toFixed(0)}%
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
                    {((safePercentages.fat || 0)).toFixed(0)}%
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