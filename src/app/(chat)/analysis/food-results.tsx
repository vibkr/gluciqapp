import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import InsulinCalculationCard from '../../../components/food/InsulinCalculationCard';
import { Button, Card } from '../../../components/ui';
import { useTheme } from '../../../contexts/ThemeContext';
import { FoodAnalysisResult } from '../../../lib/ai/EnhancedFoodAnalysisService';
import { foodService } from '../../../lib/services/FoodService';
import { insulinService } from '../../../lib/services/InsulinService';

const { width: screenWidth } = Dimensions.get('window');

// Use the provided test user ID from the database
const TEST_USER_ID = '11111111-1111-1111-1111-111111111111';

export default function FoodResultsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [calculatingInsulin, setCalculatingInsulin] = useState(false);
  const [insulinCalculation, setInsulinCalculation] = useState<any>(null);
  
  // Get userId from params or use default
  const userId = (params.userId as string) || TEST_USER_ID;

  useEffect(() => {
    const loadAnalysisData = async () => {
      try {
        setLoading(true);
        
        // Parse analysis data from params
        if (params.analysisData) {
          const parsedAnalysis = JSON.parse(params.analysisData as string);
          setAnalysisResult(parsedAnalysis);
          console.log('Loaded analysis result:', parsedAnalysis);
          
          // Automatically calculate insulin when analysis is loaded
          await calculateInsulinForAnalysis(parsedAnalysis);
        } else {
          throw new Error('No analysis data provided');
        }

        // Set image URL if provided
        if (params.imageUrl) {
          setImageUrl(params.imageUrl as string);
        }

      } catch (error) {
        console.error('Error loading analysis data:', error);
        Alert.alert('Error', 'Failed to load analysis results');
      } finally {
        setLoading(false);
      }
    };

    loadAnalysisData();
  }, [params.analysisData, params.imageUrl]);

  const calculateInsulinForAnalysis = async (analysis: FoodAnalysisResult) => {
    try {
      setCalculatingInsulin(true);
      
      // Calculate total carbs from all foods
      const totalCarbs = analysis.foods.reduce((sum, food) => sum + food.nutrition.carbohydrates, 0);
      
      if (totalCarbs > 0) {
              // Calculate insulin dose using the insulin service
      const insulinResponse = await insulinService.calculateInsulinDose({
        userId: userId,
        carbohydrates: totalCarbs,
        mealType: 'afternoon_snack'
      });
        
        if (insulinResponse.success && insulinResponse.data) {
          setInsulinCalculation(insulinResponse.data);
        } else {
          console.warn('Failed to calculate insulin:', insulinResponse.error);
        }
      }
    } catch (error) {
      console.error('Error calculating insulin for analysis:', error);
    } finally {
      setCalculatingInsulin(false);
    }
  };

  const handleSaveFood = async () => {
    if (!analysisResult || saving) return;
    
    try {
      setSaving(true);
      
      // First, analyze and store the food using the existing service
      const analysisResponse = await foodService.analyzeFood(imageUrl || '', userId);
      
      if (!analysisResponse.success || !analysisResponse.data) {
        throw new Error(analysisResponse.error || 'Failed to store food analysis');
      }
      
      // Create a meal entry from the analysis
      const mealResponse = await foodService.createMealFromAnalysis(
        analysisResponse.data.id,
        'snack', // Default to snack, user can change later
        userId
      );
      
      if (mealResponse.success && mealResponse.data) {
        Alert.alert(
          'Food Saved!', 
          'Your food analysis has been saved to your nutrition log.',
          [
            { 
              text: 'Add Another', 
              onPress: () => router.push('/camera/food-capture') 
            },
            { 
              text: 'View Dashboard', 
              onPress: () => router.push('/(tabs)')
            }
          ]
        );
      } else {
        throw new Error(mealResponse.error || 'Failed to create meal entry');
      }
    } catch (error) {
      console.error('Error saving food analysis:', error);
      Alert.alert('Error', 'Failed to save food analysis. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFoodWithInsulin = async () => {
    if (!analysisResult || calculatingInsulin) return;
    
    try {
      setCalculatingInsulin(true);
      
      // Calculate total carbs from all foods
      const totalCarbs = analysisResult.foods.reduce((sum, food) => sum + food.nutrition.carbohydrates, 0);
      
      // Calculate insulin dose using the insulin service
      const insulinResponse = await insulinService.calculateInsulinDose({
        userId: userId,
        carbohydrates: totalCarbs,
        mealType: 'afternoon_snack'
      });
      
      if (insulinResponse.success && insulinResponse.data) {
        setInsulinCalculation(insulinResponse.data);
        
        // Show insulin calculation results
        Alert.alert(
          'Insulin Calculation',
          `Based on ${totalCarbs}g carbohydrates:\n\n` +
          `Recommended dose: ${insulinResponse.data.total_recommendation.units} units\n` +
          `Confidence: ${insulinResponse.data.total_recommendation.confidence_level}%\n\n` +
          `Breakdown:\n` +
          `• Carb dose: ${insulinResponse.data.carb_dose.units} units\n` +
          `• Correction: ${insulinResponse.data.correction_dose.units} units\n` +
          `• IOB: ${insulinResponse.data.insulin_on_board.active_units} units\n\n` +
          `Would you like to save this meal with the insulin calculation?`,
          [
            { 
              text: 'Save Both', 
              onPress: () => saveFoodAndInsulin(insulinResponse.data)
            },
            { 
              text: 'Just Save Food', 
              onPress: handleSaveFood
            },
            { 
              text: 'Cancel', 
              style: 'cancel'
            }
          ]
        );
      } else {
        throw new Error(insulinResponse.error || 'Failed to calculate insulin dose');
      }
    } catch (error) {
      console.error('Error calculating insulin:', error);
      Alert.alert(
        'Insulin Calculation Failed',
        'Failed to calculate insulin dose. Would you like to save just the food analysis?',
        [
          { 
            text: 'Save Food Only', 
            onPress: handleSaveFood
          },
          { 
            text: 'Cancel', 
            style: 'cancel'
          }
        ]
      );
    } finally {
      setCalculatingInsulin(false);
    }
  };

  const saveFoodAndInsulin = async (insulinCalc: any) => {
    if (!analysisResult) return;
    
    try {
      setSaving(true);
      
      // Save the food analysis first
      const analysisResponse = await foodService.analyzeFood(imageUrl || '', userId);
      
      if (!analysisResponse.success || !analysisResponse.data) {
        throw new Error('Failed to store food analysis');
      }
      
      // Create meal entry
      const mealResponse = await foodService.createMealFromAnalysis(
        analysisResponse.data.id,
        'afternoon_snack',
        userId
      );
      
      if (!mealResponse.success || !mealResponse.data) {
        throw new Error('Failed to create meal entry');
      }
      
      // Log insulin dose
      const insulinDoseResponse = await insulinService.logInsulinDose({
        user_id: userId,
        dose_type: 'meal',
        calculated_dose: insulinCalc?.total_recommendation?.units || 0,
        user_final_dose: insulinCalc?.total_recommendation?.units || 0,
        carbohydrates: analysisResult.foods.reduce((sum, food) => sum + (food.nutrition?.carbohydrates || 0), 0),
        meal_id: mealResponse.data.id,
        notes: `Calculated from food analysis: ${insulinCalc?.total_recommendation?.confidence_level || 'Unknown'}% confidence`
      });
      
      if (insulinDoseResponse.success) {
        Alert.alert(
          'Success!',
          'Your food analysis and insulin dose have been saved successfully.',
          [
            { 
              text: 'Add Another', 
              onPress: () => router.push('/camera/food-capture') 
            },
            { 
              text: 'View Dashboard', 
              onPress: () => router.push('/(tabs)')
            }
          ]
        );
      } else {
        console.warn('Failed to log insulin dose:', insulinDoseResponse.error);
        Alert.alert(
          'Partially Saved',
          'Food analysis was saved but insulin dose logging failed. You can manually log the dose later.',
          [
            { 
              text: 'OK', 
              onPress: () => router.push('/(tabs)')
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error saving food and insulin:', error);
      Alert.alert('Error', 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getGlycemicImpactColor = (impact: 'low' | 'medium' | 'high') => {
    switch (impact) {
      case 'low': return '#22C55E';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      default: return theme.colors.textSecondary;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#22C55E';
    if (confidence >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getMainFoodName = (foods: any[]): string => {
    if (foods.length === 0) return 'Unknown Food';
    if (foods.length === 1) {
      const name = foods[0].name;
      return name.length > 30 ? name.substring(0, 27) + '...' : name;
    }
    
    // For multiple foods, show the first one with "& more"
    const firstName = foods[0].name;
    const maxLength = 30 - 7; // Reserve space for " & more"
    const truncatedName = firstName.length > maxLength ? firstName.substring(0, maxLength - 3) + '...' : firstName;
    return `${truncatedName} & more`;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: theme.colors.text,
    },
    scrollContainer: {
      flex: 1,
    },
    header: {
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    sourceInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    sourceText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginLeft: 8,
    },
    confidenceInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    confidenceText: {
      fontSize: 14,
      marginLeft: 8,
    },
    imageContainer: {
      margin: 16,
      borderRadius: 12,
      overflow: 'hidden',
    },
    foodImage: {
      width: '100%',
      height: 200,
      backgroundColor: theme.colors.surface,
    },
    summaryCard: {
      margin: 16,
      padding: 16,
    },
    summaryTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    summaryLabel: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    summaryValue: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    foodCard: {
      margin: 16,
      marginTop: 8,
      padding: 16,
    },
    foodHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    foodName: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      flex: 1,
    },
    categoryBadge: {
      backgroundColor: theme.colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    categoryText: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    portionInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    portionText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginLeft: 8,
    },
    nutritionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 12,
    },
    nutritionItem: {
      width: '50%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 4,
    },
    nutritionLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    nutritionValue: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
    },
    glycemicInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    glycemicBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 8,
    },
    glycemicText: {
      fontSize: 12,
      fontWeight: '500',
      color: '#FFFFFF',
    },
    diabetesFriendly: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    diabetesFriendlyText: {
      fontSize: 14,
      marginLeft: 8,
      color: '#22C55E',
      fontWeight: '500',
    },
    notesCard: {
      margin: 16,
      marginTop: 8,
      padding: 16,
    },
    notesTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
    },
    noteItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    noteText: {
      fontSize: 14,
      color: theme.colors.text,
      marginLeft: 8,
      flex: 1,
    },
    actionButtons: {
      flexDirection: 'row',
      padding: 16,
      gap: 12,
    },
    actionButton: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
    },
    insulinButton: {
      backgroundColor: theme.colors.secondary || '#6B7280',
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    bottomSpacer: {
      height: 32,
    },
    disabledButton: {
      backgroundColor: '#999999',
      opacity: 0.6,
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading analysis results...</Text>
      </View>
    );
  }

  if (!analysisResult) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="warning" size={48} color={theme.colors.error} />
        <Text style={[styles.loadingText, { color: theme.colors.error }]}>
          Failed to load analysis results
        </Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {getMainFoodName(analysisResult.foods)}
          </Text>
          
          <View style={styles.sourceInfo}>
            <Ionicons 
              name={analysisResult.source === 'vision' ? 'camera' : 'barcode'} 
              size={16} 
              color={theme.colors.textSecondary} 
            />
            <Text style={styles.sourceText}>
              Analyzed via {analysisResult.source === 'vision' ? 'AI Vision' : 'Barcode'}
            </Text>
          </View>
          
          <View style={styles.confidenceInfo}>
            <Ionicons name="checkmark-circle" size={16} color={getConfidenceColor(analysisResult.confidence)} />
            <Text style={[styles.confidenceText, { color: getConfidenceColor(analysisResult.confidence) }]}>
              {analysisResult.confidence}% confidence
            </Text>
          </View>
        </View>

        {/* Image */}
        {imageUrl && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUrl }} style={styles.foodImage} />
          </View>
        )}

                 {/* Insulin Calculation Card */}
         {insulinCalculation && (
           <InsulinCalculationCard
             calculation={insulinCalculation}
             onAcceptDose={handleSaveFoodWithInsulin}
             onModifyDose={handleSaveFood}
           />
         )}

        {/* Summary */}
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Nutrition Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Calories:</Text>
            <Text style={styles.summaryValue}>
              {analysisResult.foods.reduce((sum, food) => sum + food.nutrition.calories, 0)} cal
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Carbs:</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
              {analysisResult.foods.reduce((sum, food) => sum + food.nutrition.carbohydrates, 0).toFixed(1)}g
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Protein:</Text>
            <Text style={styles.summaryValue}>
              {analysisResult.foods.reduce((sum, food) => sum + food.nutrition.protein, 0).toFixed(1)}g
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Fat:</Text>
            <Text style={styles.summaryValue}>
              {analysisResult.foods.reduce((sum, food) => sum + food.nutrition.fat, 0).toFixed(1)}g
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Fiber:</Text>
            <Text style={styles.summaryValue}>
              {analysisResult.foods.reduce((sum, food) => sum + food.nutrition.fiber, 0).toFixed(1)}g
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Sugar:</Text>
            <Text style={styles.summaryValue}>
              {analysisResult.foods.reduce((sum, food) => sum + food.nutrition.sugar, 0).toFixed(1)}g
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items Analyzed:</Text>
            <Text style={styles.summaryValue}>{analysisResult.foods.length} item(s)</Text>
          </View>
        </Card>

        {/* Food Items */}
        {analysisResult.foods.map((food, index) => (
          <Card key={food.id} style={styles.foodCard}>
            <View style={styles.foodHeader}>
              <Text style={styles.foodName}>{food.name}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{food.category}</Text>
              </View>
            </View>

            <View style={styles.portionInfo}>
              <Ionicons name="scale" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.portionText}>
                {food.portion.amount}{food.portion.unit} ({food.portion.confidence}% confidence)
              </Text>
            </View>

            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Calories:</Text>
                <Text style={styles.nutritionValue}>{food.nutrition.calories}</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Carbs:</Text>
                <Text style={[styles.nutritionValue, { color: theme.colors.primary }]}>
                  {food.nutrition.carbohydrates}g
                </Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Protein:</Text>
                <Text style={styles.nutritionValue}>{food.nutrition.protein}g</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Fat:</Text>
                <Text style={styles.nutritionValue}>{food.nutrition.fat}g</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Fiber:</Text>
                <Text style={styles.nutritionValue}>{food.nutrition.fiber}g</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Sugar:</Text>
                <Text style={styles.nutritionValue}>{food.nutrition.sugar}g</Text>
              </View>
            </View>

            <View style={styles.glycemicInfo}>
              <Text style={styles.nutritionLabel}>Blood Sugar Impact:</Text>
              <View style={[styles.glycemicBadge, { backgroundColor: getGlycemicImpactColor(food.glycemic_info.estimated_bg_impact) }]}>
                <Text style={styles.glycemicText}>{food.glycemic_info.estimated_bg_impact.toUpperCase()}</Text>
              </View>
            </View>

            {food.isDiabetesFriendly && (
              <View style={styles.diabetesFriendly}>
                <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
                <Text style={styles.diabetesFriendlyText}>Diabetes-friendly</Text>
              </View>
            )}
          </Card>
        ))}

        {/* Diabetes Notes */}
        {analysisResult.recommendations.diabetes_notes && analysisResult.recommendations.diabetes_notes.length > 0 && (
          <Card style={styles.notesCard}>
            <Text style={styles.notesTitle}>Diabetes Notes</Text>
            {analysisResult.recommendations.diabetes_notes.map((note, index) => (
              <View key={index} style={styles.noteItem}>
                <Ionicons name="information-circle" size={16} color={theme.colors.primary} />
                <Text style={styles.noteText}>{note}</Text>
              </View>
            ))}
          </Card>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.saveButton, saving && styles.disabledButton]} 
          onPress={handleSaveFood}
          disabled={saving || calculatingInsulin}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.actionButtonText}>Save Food</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.insulinButton, calculatingInsulin && styles.disabledButton]} 
          onPress={handleSaveFoodWithInsulin}
          disabled={saving || calculatingInsulin}
        >
          {calculatingInsulin ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.actionButtonText}>Save + Insulin</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}