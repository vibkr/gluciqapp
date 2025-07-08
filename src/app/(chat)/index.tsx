import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/src/contexts/ThemeContext';
import { Card } from '@/src/components/ui';
import { userStore } from '@/src/stores/userStore';
import { foodStore, foodActions } from '@/src/stores/foodStore';
import { insulinStore } from '@/src/stores/insulinStore';
import {
  FloatingElement,
  PulsingOrb,
  XPProgressBar,
  QuestCard,
  GlucoseHero,
  GlucoBalanceCard,
  VictoryTrackCard,
} from '@/src/components/dashboard/DashboardComponents';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Mock data for viral dashboard (replace with real data later)
  const [dashboardData, setDashboardData] = useState({
    currentGlucose: 125,
    timeInRange: 89,
    avgGlucose: 135,
    variability: 12,
    glucoBalance: 92,
    currentStreak: 23,
    playerLevel: 12,
    xp: 2340,
    xpToNext: 2500,
    a1cValue: 6.4,
  });

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

  const handleQuestPress = (questId: string) => {
    Alert.alert('Quest Selected', `You selected quest: ${questId}`);
  };

  const handleAddFood = () => {
    router.push('/camera/food-capture');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flex: 1,
    },
    contentContainer: {
      padding: 16,
      paddingBottom: 100, // Extra padding for floating action button
    },
    headerContainer: {
      marginBottom: 24,
    },
    welcomeText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    welcomeSubtext: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 16,
      marginTop: 8,
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
      borderRadius: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
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
    questsContainer: {
      marginBottom: 24,
    },
    questsGrid: {
      gap: 12,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    loadingText: {
      color: theme.colors.text,
      marginTop: 16,
      fontSize: 16,
    },
    floatingActionButton: {
      position: 'absolute',
      bottom: 90,
      right: 20,
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    decorativeOrbs: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
    },
    orb1: {
      position: 'absolute',
      top: 100,
      right: 50,
    },
    orb2: {
      position: 'absolute',
      top: 300,
      left: 30,
    },
    orb3: {
      position: 'absolute',
      top: 500,
      right: 80,
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading your health dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Decorative floating orbs */}
      <View style={styles.decorativeOrbs}>
        <View style={styles.orb1}>
          <PulsingOrb size={16} color={theme.colors.primary} delay={0} />
        </View>
        <View style={styles.orb2}>
          <PulsingOrb size={12} color={theme.colors.secondary} delay={1} />
        </View>
        <View style={styles.orb3}>
          <PulsingOrb size={20} color={theme.colors.accent} delay={2} />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Header */}
        <FloatingElement delay={0} style={styles.headerContainer}>
          <Text style={styles.welcomeText}>
            Welcome back, {currentProfile?.first_name || 'Champion'}! 💪
          </Text>
          <Text style={styles.welcomeSubtext}>
            Ready to level up your health game today?
          </Text>
          
          {/* XP Progress Bar */}
          <XPProgressBar 
            current={dashboardData.xp} 
            max={dashboardData.xpToNext} 
            level={dashboardData.playerLevel} 
          />
        </FloatingElement>

        {/* Glucose Hero Card */}
        <FloatingElement delay={0.1}>
          <GlucoseHero 
            currentGlucose={dashboardData.currentGlucose}
            timeInRange={dashboardData.timeInRange}
            avgGlucose={dashboardData.avgGlucose}
            variability={dashboardData.variability}
          />
        </FloatingElement>

        {/* Quick Actions */}
        <FloatingElement delay={0.2}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
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
                color={theme.colors.secondary} 
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
                color={theme.colors.accent} 
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
        </FloatingElement>

        {/* GlucoBalance Card */}
        <FloatingElement delay={0.3}>
          <GlucoBalanceCard 
            glucoBalance={dashboardData.glucoBalance}
            recommendation="Avocado Toast + Eggs"
            onAddPress={handleAddFood}
          />
        </FloatingElement>

        {/* Victory Track Card */}
        <FloatingElement delay={0.4}>
          <VictoryTrackCard 
            currentStreak={dashboardData.currentStreak}
            level={5}
            xp={380}
            maxXp={400}
          />
        </FloatingElement>

        {/* Daily Quests */}
        <FloatingElement delay={0.5}>
          <Text style={styles.sectionTitle}>Daily Quests</Text>
          <View style={styles.questsContainer}>
            <QuestCard 
              title="Morning Glucose Check"
              description="Log your morning glucose reading"
              reward="+50 XP, Health Streak"
              completed={true}
              progress={100}
              onPress={() => handleQuestPress('morning-glucose')}
            />
            
            <QuestCard 
              title="Balanced Breakfast"
              description="Eat a balanced breakfast with protein and fiber"
              reward="+75 XP, Nutrition Badge"
              completed={false}
              progress={60}
              onPress={() => handleQuestPress('balanced-breakfast')}
            />
            
            <QuestCard 
              title="Post-Meal Walk"
              description="Take a 10-minute walk after lunch"
              reward="+40 XP, Activity Boost"
              completed={false}
              progress={0}
              onPress={() => handleQuestPress('post-meal-walk')}
            />
          </View>
        </FloatingElement>
      </ScrollView>

      {/* Floating Action Button for Camera */}
      <TouchableOpacity
        style={styles.floatingActionButton}
        onPress={() => handleQuickAction('scan_food')}
      >
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          style={styles.floatingActionButton}
        >
          <Ionicons name="camera" size={28} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}