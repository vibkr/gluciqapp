import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/contexts/ThemeContext';
import { Card } from '@/src/components/ui';
import { userStore } from '@/src/stores/userStore';
import { foodStore, foodActions } from '@/src/stores/foodStore';
import { insulinStore } from '@/src/stores/insulinStore';

export default function DashboardScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Get current user profile
  const currentProfile = userStore.profile.get();
  const recentAnalysis = foodStore.recentAnalysis.get();
  const mealHistory = foodStore.mealHistory.get();

  useEffect(() => {
    const loadDashboardData = async () => {
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
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [currentProfile?.id]);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'scan_food':
        router.push('/camera/food-capture');
        break;
      case 'scan_barcode':
        router.push('/camera/barcode-scanner');
        break;
      case 'log_insulin':
        router.push('/insulin');
        break;
      case 'view_foods':
        router.push('/food');
        break;
      default:
        Alert.alert('Coming Soon', 'This feature is being developed.');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flex: 1,
      padding: 16,
    },
    welcomeCard: {
      marginBottom: 20,
      padding: 20,
    },
    welcomeText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    welcomeSubtext: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    quickActionsTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 24,
    },
    quickActionButton: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    quickActionIcon: {
      marginBottom: 8,
    },
    quickActionText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
      textAlign: 'center',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
    },
    recentItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    recentItemIcon: {
      marginRight: 12,
    },
    recentItemContent: {
      flex: 1,
    },
    recentItemTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: 4,
    },
    recentItemSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    recentItemTime: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    emptyState: {
      alignItems: 'center',
      padding: 20,
    },
    emptyStateIcon: {
      marginBottom: 12,
    },
    emptyStateText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 16,
    },
    emptyStateButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    emptyStateButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '500',
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
          Loading dashboard...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Welcome Card */}
        <Card style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>
            Welcome back{currentProfile?.first_name ? `, ${currentProfile.first_name}` : ''}!
          </Text>
          <Text style={styles.welcomeSubtext}>
            Track your nutrition and manage your diabetes with ease.
          </Text>
        </Card>

        {/* Quick Actions */}
        <Text style={styles.quickActionsTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleQuickAction('scan_food')}
          >
            <Ionicons
              name="camera"
              size={32}
              color={theme.colors.primary}
              style={styles.quickActionIcon}
            />
            <Text style={styles.quickActionText}>Scan Food</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleQuickAction('scan_barcode')}
          >
            <Ionicons
              name="barcode"
              size={32}
              color={theme.colors.primary}
              style={styles.quickActionIcon}
            />
            <Text style={styles.quickActionText}>Scan Barcode</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleQuickAction('log_insulin')}
          >
            <Ionicons
              name="medical"
              size={32}
              color={theme.colors.primary}
              style={styles.quickActionIcon}
            />
            <Text style={styles.quickActionText}>Log Insulin</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleQuickAction('view_foods')}
          >
            <Ionicons
              name="restaurant"
              size={32}
              color={theme.colors.primary}
              style={styles.quickActionIcon}
            />
            <Text style={styles.quickActionText}>Food History</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Food Analysis */}
        <Text style={styles.sectionTitle}>Recent Food Analysis</Text>
        {recentAnalysis.length > 0 ? (
          recentAnalysis.slice(0, 3).map((analysis, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recentItem}
              onPress={() => router.push('/food')}
            >
              <Ionicons
                name="restaurant"
                size={24}
                color={theme.colors.primary}
                style={styles.recentItemIcon}
              />
              <View style={styles.recentItemContent}>
                <Text style={styles.recentItemTitle}>
                  Food Analysis
                </Text>
                                 <Text style={styles.recentItemSubtitle}>
                   {analysis.confidence_score}% confidence
                 </Text>
              </View>
              <Text style={styles.recentItemTime}>
                {new Date(analysis.created_at).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Card style={styles.emptyState}>
            <Ionicons
              name="restaurant-outline"
              size={48}
              color={theme.colors.textSecondary}
              style={styles.emptyStateIcon}
            />
            <Text style={styles.emptyStateText}>
              No food analysis yet.{'\n'}Start by scanning your first meal!
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => handleQuickAction('scan_food')}
            >
              <Text style={styles.emptyStateButtonText}>Scan Food</Text>
            </TouchableOpacity>
          </Card>
        )}

        {/* Recent Meals */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Recent Meals</Text>
        {mealHistory.length > 0 ? (
          mealHistory.slice(0, 3).map((meal, index) => (
            <TouchableOpacity
              key={meal.id || index}
              style={styles.recentItem}
              onPress={() => router.push('/food')}
            >
              <Ionicons
                name="nutrition"
                size={24}
                color={theme.colors.primary}
                style={styles.recentItemIcon}
              />
              <View style={styles.recentItemContent}>
                <Text style={styles.recentItemTitle}>
                  {meal.meal_type || 'Meal'}
                </Text>
                                 <Text style={styles.recentItemSubtitle}>
                   {meal.total_calories || 0} calories
                 </Text>
              </View>
              <Text style={styles.recentItemTime}>
                {new Date(meal.logged_at).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Card style={styles.emptyState}>
            <Ionicons
              name="nutrition-outline"
              size={48}
              color={theme.colors.textSecondary}
              style={styles.emptyStateIcon}
            />
            <Text style={styles.emptyStateText}>
              No meals logged yet.{'\n'}Start tracking your nutrition!
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => handleQuickAction('scan_food')}
            >
              <Text style={styles.emptyStateButtonText}>Log First Meal</Text>
            </TouchableOpacity>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}