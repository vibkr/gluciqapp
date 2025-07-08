import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { useTheme } from "../../../contexts/ThemeContext";
import { foodService } from "../../../lib/services/FoodService";
import { MealEntry } from "../../../lib/api/types";
import { useUserStore } from "../../../stores/userStore";

interface Food {
  name: string;
  weight: number;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  sugar: number;
}

interface FoodAnalysisResult {
  foods: Food[];
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
  totalFiber: number;
  totalSugar: number;
  imageUri: string;
}

export default function FoodResultsScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { store } = useUserStore();

  // Parse the analysis result from params with error handling
  let analysisResult: FoodAnalysisResult;
  try {
    // Check for different parameter names (analysisData from camera screens, result from other sources)
    const rawData = (params.analysisData as string) || (params.result as string) || "{}";
    const parsedData = JSON.parse(rawData);
    
    console.log("Parsed analysis data:", parsedData);
    
    // Handle different data structures from different sources
    if (parsedData.foods && Array.isArray(parsedData.foods)) {
      // Data from Enhanced Food Analysis Service (camera/barcode)
      const foods = parsedData.foods.map((food: any) => ({
        name: food.name || "Unknown Food",
        weight: Number(food.portion?.amount) || Number(food.weight) || 100,
        calories: Number(food.nutrition?.calories) || 0,
        carbs: Number(food.nutrition?.carbohydrates) || 0,
        protein: Number(food.nutrition?.protein) || 0,
        fat: Number(food.nutrition?.fat) || 0,
        fiber: Number(food.nutrition?.fiber) || 0,
        sugar: Number(food.nutrition?.sugar) || 0,
      }));
      
      // Calculate totals from individual foods
      const totalCalories = foods.reduce((sum: number, food: Food) => sum + food.calories, 0);
      const totalCarbs = foods.reduce((sum: number, food: Food) => sum + food.carbs, 0);
      const totalProtein = foods.reduce((sum: number, food: Food) => sum + food.protein, 0);
      const totalFat = foods.reduce((sum: number, food: Food) => sum + food.fat, 0);
      const totalFiber = foods.reduce((sum: number, food: Food) => sum + food.fiber, 0);
      const totalSugar = foods.reduce((sum: number, food: Food) => sum + food.sugar, 0);
      
      analysisResult = {
        foods,
        totalCalories,
        totalCarbs,
        totalProtein,
        totalFat,
        totalFiber,
        totalSugar,
        imageUri: (params.imageUrl as string) || parsedData.imageUri || "",
      };
    } else {
      // Legacy format or direct FoodAnalysisResult format
      if (!parsedData.foods || !Array.isArray(parsedData.foods)) {
        throw new Error("Invalid analysis result format - no foods array found");
      }
      
      analysisResult = {
        foods: parsedData.foods.map((food: any) => ({
          name: food.name || "Unknown Food",
          weight: Number(food.weight) || 0,
          calories: Number(food.calories) || 0,
          carbs: Number(food.carbs) || 0,
          protein: Number(food.protein) || 0,
          fat: Number(food.fat) || 0,
          fiber: Number(food.fiber) || 0,
          sugar: Number(food.sugar) || 0,
        })),
        totalCalories: Number(parsedData.totalCalories) || 0,
        totalCarbs: Number(parsedData.totalCarbs) || 0,
        totalProtein: Number(parsedData.totalProtein) || 0,
        totalFat: Number(parsedData.totalFat) || 0,
        totalFiber: Number(parsedData.totalFiber) || 0,
        totalSugar: Number(parsedData.totalSugar) || 0,
        imageUri: parsedData.imageUri || "",
      };
    }
  } catch (error) {
    console.error("Error parsing analysis result:", error);
    console.error("Raw params:", params);
    Alert.alert(
      "Error",
      "Failed to load food analysis results. Please try again.",
      [{ text: "OK", onPress: () => router.back() }]
    );
    return null;
  }

  const handleSaveMeal = async (mealType: string) => {
    try {
      setIsLoading(true);
      
      // Get current user ID
      const currentUser = store.profile.get();
      if (!currentUser?.id) {
        Alert.alert("Error", "Please log in to save meals");
        return;
      }

      // Map meal types to the expected enum values
      const mapMealType = (type: string) => {
        switch(type) {
          case "breakfast": return "breakfast";
          case "lunch": return "lunch";
          case "dinner": return "dinner";
          case "afternoon_snack": return "afternoon_snack";
          default: return "afternoon_snack";
        }
      };

      const mealData = {
        user_id: currentUser.id, // Use actual user ID
        meal_type: mapMealType(mealType) as "breakfast" | "morning_snack" | "lunch" | "afternoon_snack" | "dinner" | "evening_snack" | "pre_workout" | "post_workout",
        total_calories: analysisResult.totalCalories,
        total_carbs_g: analysisResult.totalCarbs,
        total_protein_g: analysisResult.totalProtein,
        total_fat_g: analysisResult.totalFat,
        total_fiber_g: analysisResult.totalFiber || 0,
        notes: `Food analysis from ${new Date().toLocaleDateString()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Omit<MealEntry, 'id' | 'logged_at'>;

      const response = await foodService.logMeal(mealData);
      
      if (response.success) {
        Alert.alert(
          "Success",
          "Meal saved successfully!",
          [{ text: "OK", onPress: () => router.back() }]
        );
      } else {
        console.error("Failed to save meal:", response.error);
        Alert.alert("Error", "Failed to save meal. Please try again.");
      }
    } catch (error) {
      console.error("Error saving meal:", error);
      Alert.alert("Error", "Failed to save meal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const MacroProgressBar = ({ 
    label, 
    value, 
    maxValue, 
    color, 
    unit = "g" 
  }: { 
    label: string; 
    value: number; 
    maxValue: number; 
    color: string; 
    unit?: string; 
  }) => {
    const safeValue = Number(value) || 0;
    const percentage = Math.min((safeValue / maxValue) * 100, 100);
    
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressLabel, { color: theme.colors.text }]}>
            {label}
          </Text>
          <Text style={[styles.progressValue, { color: theme.colors.text }]}>
            {safeValue.toFixed(1)}{unit}
          </Text>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${percentage}%`, backgroundColor: color }
            ]} 
          />
        </View>
      </View>
    );
  };

  const NutritionCard = ({ 
    icon, 
    label, 
    value, 
    unit, 
    color 
  }: { 
    icon: string; 
    label: string; 
    value: number; 
    unit: string; 
    color: string; 
  }) => {
    const safeValue = Number(value) || 0;
    
    return (
      <View style={[styles.nutritionCard, { backgroundColor: theme.colors.card }]}>
        <View style={[styles.nutritionIcon, { backgroundColor: `${color}15` }]}>
          <Ionicons name={icon as any} size={24} color={color} />
        </View>
        <Text style={[styles.nutritionValue, { color: theme.colors.text }]}>
          {safeValue.toFixed(0)}
        </Text>
        <Text style={[styles.nutritionUnit, { color: theme.colors.textSecondary }]}>
          {unit}
        </Text>
        <Text style={[styles.nutritionLabel, { color: theme.colors.textSecondary }]}>
          {label}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Food Analysis
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Food Image */}
        {analysisResult.imageUri && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: analysisResult.imageUri }} style={styles.foodImage} />
          </View>
        )}

        {/* Nutrition Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Nutrition Summary
          </Text>
          <View style={styles.nutritionGrid}>
            <NutritionCard
              icon="flame"
              label="Calories"
              value={analysisResult.totalCalories}
              unit="kcal"
              color={theme.colors.secondary}
            />
            <NutritionCard
              icon="leaf"
              label="Carbs"
              value={analysisResult.totalCarbs}
              unit="g"
              color={theme.colors.accent}
            />
            <NutritionCard
              icon="fitness"
              label="Protein"
              value={analysisResult.totalProtein}
              unit="g"
              color={theme.colors.primary}
            />
            <NutritionCard
              icon="water"
              label="Fat"
              value={analysisResult.totalFat}
              unit="g"
              color="#9333EA"
            />
          </View>
        </View>

        {/* Macronutrients Progress */}
        <Card>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Macronutrients
          </Text>
          <View style={styles.macrosContainer}>
            <MacroProgressBar
              label="Carbohydrates"
              value={analysisResult.totalCarbs}
              maxValue={150}
              color={theme.colors.accent}
            />
            <MacroProgressBar
              label="Protein"
              value={analysisResult.totalProtein}
              maxValue={50}
              color={theme.colors.primary}
            />
            <MacroProgressBar
              label="Fat"
              value={analysisResult.totalFat}
              maxValue={65}
              color="#9333EA"
            />
            <MacroProgressBar
              label="Fiber"
              value={analysisResult.totalFiber}
              maxValue={25}
              color="#059669"
            />
          </View>
        </Card>

        {/* Food Items */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Detected Foods
          </Text>
          {analysisResult.foods && analysisResult.foods.length > 0 ? analysisResult.foods.map((food, index) => (
            <Card key={index}>
              <View style={styles.foodItem}>
                <View style={styles.foodHeader}>
                  <View style={[styles.foodIcon, { backgroundColor: `${theme.colors.primary}15` }]}>
                    <Ionicons name="restaurant" size={20} color={theme.colors.primary} />
                  </View>
                  <View style={styles.foodInfo}>
                    <Text style={[styles.foodName, { color: theme.colors.text }]}>
                      {food.name || "Unknown Food"}
                    </Text>
                    <Text style={[styles.foodWeight, { color: theme.colors.textSecondary }]}>
                      {(Number(food.weight) || 0).toFixed(0)}g
                    </Text>
                  </View>
                  <View style={styles.foodCalories}>
                    <Text style={[styles.calorieValue, { color: theme.colors.secondary }]}>
                      {(Number(food.calories) || 0).toFixed(0)}
                    </Text>
                    <Text style={[styles.calorieLabel, { color: theme.colors.textSecondary }]}>
                      kcal
                    </Text>
                  </View>
                </View>
                
                <View style={styles.nutritionBreakdown}>
                  <View style={styles.nutritionItem}>
                    <Text style={[styles.nutritionLabel, { color: theme.colors.textSecondary }]}>
                      Carbs
                    </Text>
                    <Text style={[styles.nutritionValue, { color: theme.colors.text }]}>
                      {(Number(food.carbs) || 0).toFixed(1)}g
                    </Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={[styles.nutritionLabel, { color: theme.colors.textSecondary }]}>
                      Protein
                    </Text>
                    <Text style={[styles.nutritionValue, { color: theme.colors.text }]}>
                      {(Number(food.protein) || 0).toFixed(1)}g
                    </Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={[styles.nutritionLabel, { color: theme.colors.textSecondary }]}>
                      Fat
                    </Text>
                    <Text style={[styles.nutritionValue, { color: theme.colors.text }]}>
                      {(Number(food.fat) || 0).toFixed(1)}g
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          )) : (
            <Card>
              <View style={styles.emptyState}>
                <Ionicons name="restaurant-outline" size={48} color={theme.colors.textSecondary} />
                <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
                  No food items detected
                </Text>
              </View>
            </Card>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Save as Meal
          </Text>
          <View style={styles.mealButtons}>
            <TouchableOpacity
              style={[styles.mealButton, { backgroundColor: theme.colors.card }]}
              onPress={() => handleSaveMeal("breakfast")}
              disabled={isLoading}
            >
              <View style={[styles.mealIcon, { backgroundColor: `${theme.colors.secondary}15` }]}>
                <Ionicons name="sunny" size={24} color={theme.colors.secondary} />
              </View>
              <Text style={[styles.mealButtonText, { color: theme.colors.text }]}>
                Breakfast
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.mealButton, { backgroundColor: theme.colors.card }]}
              onPress={() => handleSaveMeal("lunch")}
              disabled={isLoading}
            >
              <View style={[styles.mealIcon, { backgroundColor: `${theme.colors.accent}15` }]}>
                <Ionicons name="partly-sunny" size={24} color={theme.colors.accent} />
              </View>
              <Text style={[styles.mealButtonText, { color: theme.colors.text }]}>
                Lunch
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.mealButton, { backgroundColor: theme.colors.card }]}
              onPress={() => handleSaveMeal("dinner")}
              disabled={isLoading}
            >
              <View style={[styles.mealIcon, { backgroundColor: `${theme.colors.primary}15` }]}>
                <Ionicons name="moon" size={24} color={theme.colors.primary} />
              </View>
              <Text style={[styles.mealButtonText, { color: theme.colors.text }]}>
                Dinner
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.mealButton, { backgroundColor: theme.colors.card }]}
              onPress={() => handleSaveMeal("afternoon_snack")}
              disabled={isLoading}
            >
              <View style={[styles.mealIcon, { backgroundColor: `#9333EA15` }]}>
                <Ionicons name="cafe" size={24} color="#9333EA" />
              </View>
              <Text style={[styles.mealButtonText, { color: theme.colors.text }]}>
                Snack
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <Button
            variant="outline"
            size="large"
            onPress={() => router.back()}
            style={{ flex: 1, marginRight: 8 }}
          >
            <Ionicons name="arrow-back" size={18} color={theme.colors.primary} />
            <Text> Back</Text>
          </Button>
          <Button
            variant="primary"
            size="large"
            onPress={() => router.push("/(chat)/analysis/camera")}
            style={{ flex: 1, marginLeft: 8 }}
          >
            <Ionicons name="camera" size={18} color={theme.colors.background} />
            <Text> New Analysis</Text>
          </Button>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginLeft: 8,
  },
  headerSpacer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  foodImage: {
    width: 280,
    height: 240,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  nutritionCard: {
    width: "48%",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  nutritionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  nutritionValue: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  nutritionUnit: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  macrosContainer: {
    gap: 16,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  progressValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  foodItem: {
    gap: 16,
  },
  foodHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  foodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  foodWeight: {
    fontSize: 14,
  },
  foodCalories: {
    alignItems: "flex-end",
  },
  calorieValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  calorieLabel: {
    fontSize: 12,
  },
  nutritionBreakdown: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  nutritionItem: {
    alignItems: "center",
  },
  actionSection: {
    paddingHorizontal: 20,
    marginVertical: 16,
  },
  mealButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  mealButton: {
    width: "48%",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  mealIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  mealButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  bottomActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 16,
  },
  bottomSpacer: {
    height: 40,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
});