import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/contexts/ThemeContext';
import { Card } from '@/src/components/ui';
import { userStore } from '@/src/stores/userStore';
import { foodStore, foodActions } from '@/src/stores/foodStore';

export default function FoodScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'analysis' | 'meals'>('analysis');
  
  // Get current user profile
  const currentProfile = userStore.profile.get();
  const recentAnalysis = foodStore.recentAnalysis.get();
  const mealHistory = foodStore.mealHistory.get();

  useEffect(() => {
    const loadFoodData = async () => {
      if (!currentProfile?.id) {
        setLoading(false);
        return;
      }

      try {
        // Load recent food analysis and meal history
        await Promise.all([
          foodActions.refreshRecentAnalysis(currentProfile.id),
          foodActions.refreshMealHistory(currentProfile.id),
        ]);
      } catch (error) {
        console.error('Error loading food data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFoodData();
  }, [currentProfile?.id]);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'scan_food':
        router.push('/camera/food-capture');
        break;
      case 'scan_barcode':
        router.push('/camera/barcode-scanner');
        break;
      default:
        Alert.alert('Coming Soon', 'This feature is being developed.');
    }
  };

  const renderAnalysisItem = ({ item }: { item: any }) => (
    <Card style={styles.analysisItem}>
      <View style={styles.analysisHeader}>
        <Ionicons 
          name="restaurant" 
          size={24} 
          color={theme.colors.primary} 
        />
        <View style={styles.analysisInfo}>
          <Text style={styles.analysisTitle}>Food Analysis</Text>
          <Text style={styles.analysisSubtitle}>
            {item.confidence_score}% confidence
          </Text>
        </View>
        <Text style={styles.analysisDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      
      {item.detected_foods && item.detected_foods.length > 0 && (
        <View style={styles.detectedFoods}>
          <Text style={styles.detectedFoodsTitle}>Detected Foods:</Text>
          {item.detected_foods.slice(0, 3).map((food: any, index: number) => (
            <Text key={index} style={styles.foodItem}>
              • {food.name || 'Unknown food'}
            </Text>
          ))}
          {item.detected_foods.length > 3 && (
            <Text style={styles.foodItem}>
              • And {item.detected_foods.length - 3} more...
            </Text>
          )}
        </View>
      )}
    </Card>
  );

  const renderMealItem = ({ item }: { item: any }) => (
    <Card style={styles.mealItem}>
      <View style={styles.mealHeader}>
        <Ionicons 
          name="nutrition" 
          size={24} 
          color={theme.colors.primary} 
        />
        <View style={styles.mealInfo}>
          <Text style={styles.mealTitle}>
            {item.meal_type?.charAt(0).toUpperCase() + item.meal_type?.slice(1) || 'Meal'}
          </Text>
          <Text style={styles.mealSubtitle}>
            {item.total_calories || 0} calories • {item.total_carbs_g || 0}g carbs
          </Text>
        </View>
        <Text style={styles.mealDate}>
          {new Date(item.logged_at).toLocaleDateString()}
        </Text>
      </View>
      
      {item.notes && (
        <Text style={styles.mealNotes}>{item.notes}</Text>
      )}
    </Card>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    quickActionsContainer: {
      flexDirection: 'row',
      gap: 8,
    },
    quickActionButton: {
      backgroundColor: theme.colors.primary,
      padding: 8,
      borderRadius: 8,
      minWidth: 44,
      alignItems: 'center',
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      marginHorizontal: 16,
      marginTop: 8,
      borderRadius: 8,
      padding: 4,
    },
    tabButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 6,
      alignItems: 'center',
    },
    activeTab: {
      backgroundColor: theme.colors.primary,
    },
    tabText: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.textSecondary,
    },
    activeTabText: {
      color: '#FFFFFF',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    analysisItem: {
      marginBottom: 12,
      padding: 16,
    },
    analysisHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    analysisInfo: {
      flex: 1,
      marginLeft: 12,
    },
    analysisTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 4,
    },
    analysisSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    analysisDate: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    detectedFoods: {
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    detectedFoodsTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 4,
    },
    foodItem: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 2,
    },
    mealItem: {
      marginBottom: 12,
      padding: 16,
    },
    mealHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    mealInfo: {
      flex: 1,
      marginLeft: 12,
    },
    mealTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 4,
    },
    mealSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    mealDate: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    mealNotes: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      fontStyle: 'italic',
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyStateIcon: {
      marginBottom: 16,
    },
    emptyStateText: {
      fontSize: 18,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 8,
    },
    emptyStateSubtext: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
    },
    emptyStateButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    emptyStateButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.text, marginTop: 16 }}>
          Loading food data...
        </Text>
      </View>
    );
  }

  const currentData = activeTab === 'analysis' ? recentAnalysis : mealHistory;
  const renderItem = activeTab === 'analysis' ? renderAnalysisItem : renderMealItem;

  return (
    <View style={styles.container}>
      {/* Header with quick actions */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Food Tracking</Text>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleQuickAction('scan_food')}
          >
            <Ionicons name="camera" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleQuickAction('scan_barcode')}
          >
            <Ionicons name="barcode" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'analysis' && styles.activeTab]}
          onPress={() => setActiveTab('analysis')}
        >
          <Text style={[styles.tabText, activeTab === 'analysis' && styles.activeTabText]}>
            Analysis
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'meals' && styles.activeTab]}
          onPress={() => setActiveTab('meals')}
        >
          <Text style={[styles.tabText, activeTab === 'meals' && styles.activeTabText]}>
            Meals
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {currentData.length > 0 ? (
          <FlatList
            data={currentData}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id || index.toString()}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name={activeTab === 'analysis' ? 'search' : 'restaurant'}
              size={64}
              color={theme.colors.textSecondary}
              style={styles.emptyStateIcon}
            />
            <Text style={styles.emptyStateText}>
              {activeTab === 'analysis' ? 'No food analysis yet' : 'No meals logged yet'}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {activeTab === 'analysis' 
                ? 'Start by scanning your first food item' 
                : 'Track your meals to see them here'}
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => handleQuickAction('scan_food')}
            >
              <Text style={styles.emptyStateButtonText}>
                {activeTab === 'analysis' ? 'Scan Food' : 'Log First Meal'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
} 