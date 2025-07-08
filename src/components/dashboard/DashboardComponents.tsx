import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Animated,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

const { width } = Dimensions.get('window');

// Floating animation component
export const FloatingElement: React.FC<{
  children: React.ReactNode;
  delay?: number;
  style?: any;
}> = ({ children, delay = 0, style = {} }) => {
  const floatAnim = new Animated.Value(0);

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          delay: delay * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <Animated.View style={[style, { transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
};

// Pulsing orb component
export const PulsingOrb: React.FC<{
  size?: number;
  color?: string;
  delay?: number;
  style?: any;
}> = ({ size = 12, color = '#8B5CF6', delay = 0, style = {} }) => {
  const pulseAnim = new Animated.Value(0.4);

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 1000,
          delay: delay * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();
  }, []);

  return (
    <Animated.View 
      style={[
        {
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: size / 2,
          opacity: pulseAnim,
        },
        style
      ]}
    />
  );
};

// XP Progress Bar with animations
export const XPProgressBar: React.FC<{
  current: number;
  max: number;
  level: number;
}> = ({ current, max, level }) => {
  const { theme } = useTheme();
  const percentage = (current / max) * 100;
  const progressAnim = new Animated.Value(0);
  
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: percentage,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const animatedWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });
  
  return (
    <View style={styles.xpContainer}>
      <View style={styles.xpHeader}>
        <View style={styles.levelContainer}>
          <Ionicons name="trophy" size={20} color="#FFD700" />
          <Text style={[styles.levelText, { color: theme.colors.text }]}>
            Level {level}
          </Text>
          <LinearGradient
            colors={theme.gradients.accent as readonly [string, string, ...string[]]}
            style={styles.legendaryBadge}
          >
            <Text style={styles.legendaryText}>Legendary</Text>
          </LinearGradient>
        </View>
        <Text style={[styles.xpText, { color: theme.colors.textMuted }]}>
          {current}/{max} XP
        </Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarBg, { backgroundColor: theme.colors.border }]}>
          <Animated.View style={[styles.progressBarContainer, { width: animatedWidth }]}>
            <LinearGradient
              colors={theme.gradients.primary}
              style={styles.progressBar}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.progressShimmer} />
            </LinearGradient>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

// Quest/Achievement Card
export const QuestCard: React.FC<{
  title: string;
  description: string;
  reward: string;
  completed?: boolean;
  progress?: number;
  onPress: () => void;
}> = ({ 
  title, 
  description, 
  reward, 
  completed = false, 
  progress = 100,
  onPress 
}) => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.questCard,
        { 
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {completed && (
        <LinearGradient
          colors={['rgba(16, 185, 129, 0.1)', 'rgba(5, 150, 105, 0.1)']}
          style={styles.completedOverlay}
        />
      )}
      
      <View style={styles.questContent}>
        <View style={styles.questHeader}>
          <LinearGradient
            colors={completed ? ['#10B981', '#059669'] : theme.gradients.primary}
            style={styles.questIcon}
          >
            <Ionicons 
              name={completed ? "trophy" : "flag"} 
              size={20} 
              color="white" 
            />
          </LinearGradient>
          
          {completed && (
            <View style={styles.completeBadge}>
              <Text style={styles.completeText}>COMPLETE</Text>
            </View>
          )}
        </View>
        
        <Text style={[styles.questTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.questDescription, { color: theme.colors.textMuted }]}>
          {description}
        </Text>
        
        {!completed && (
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressLabel, { color: theme.colors.textMuted }]}>
                Progress
              </Text>
              <Text style={[styles.progressPercent, { color: theme.colors.textMuted }]}>
                {progress}%
              </Text>
            </View>
            <View style={[styles.questProgressBg, { backgroundColor: theme.colors.border }]}>
              <LinearGradient
                colors={theme.gradients.secondary}
                style={[styles.questProgress, { width: `${progress}%` }]}
              />
            </View>
          </View>
        )}
        
        <LinearGradient
          colors={theme.gradients.accent}
          style={styles.rewardGradient}
        >
          <Text style={styles.questReward}>
            {reward}
          </Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

// Hero Glucose Monitor
export const GlucoseHero: React.FC<{ 
  currentGlucose?: number; 
  timeInRange?: number; 
  avgGlucose?: number; 
  variability?: number;
}> = ({ 
  currentGlucose = 125, 
  timeInRange = 89, 
  avgGlucose = 135, 
  variability = 12 
}) => {
  const { theme } = useTheme();
  
  return (
    <LinearGradient
      colors={theme.gradients.card}
      style={[styles.glucoseHero, { borderColor: theme.colors.border }]}
    >
      <View style={styles.glucoseHeader}>
        <View style={styles.glucoseHeaderLeft}>
          <LinearGradient
            colors={theme.gradients.primary}
            style={styles.glucoseIcon}
          >
            <Ionicons name="water" size={24} color="white" />
          </LinearGradient>
          <View>
            <Text style={[styles.glucoseTitle, { color: theme.colors.text }]}>
              Glucose Status
            </Text>
            <Text style={[styles.glucoseSubtitle, { color: theme.colors.textMuted }]}>
              Last updated 2 min ago
            </Text>
          </View>
        </View>
        
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>IN RANGE</Text>
        </View>
      </View>

      <View style={styles.glucoseMainContent}>
        <View style={styles.glucoseValueContainer}>
          <Text style={[styles.glucoseValue, { color: theme.colors.primary }]}>
            {currentGlucose}
          </Text>
          <Text style={[styles.glucoseUnit, { color: theme.colors.textMuted }]}>
            mg/dL
          </Text>
          <View style={styles.trendIcon}>
            <Ionicons name="trending-up" size={24} color="#10B981" />
          </View>
        </View>

        <View style={styles.glucoseStats}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {timeInRange}%
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
              Time in Range
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {avgGlucose}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
              Avg Glucose
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {variability}%
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
              Variability
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

// GlucoBalance AI Card
export const GlucoBalanceCard: React.FC<{
  glucoBalance?: number;
  recommendation?: string;
  onAddPress: () => void;
}> = ({ 
  glucoBalance = 92, 
  recommendation = "Avocado Toast + Eggs",
  onAddPress 
}) => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.glucoBalanceCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.glucoBalanceHeader}>
        <View>
          <View style={styles.glucoBalanceTitle}>
            <Ionicons name="brain" size={20} color={theme.colors.primary} />
            <Text style={[styles.glucoBalanceTitleText, { color: theme.colors.text }]}>
              GlucoBalance™
            </Text>
          </View>
          <View style={styles.aiPoweredBadge}>
            <Text style={styles.aiPoweredText}>AI Powered</Text>
          </View>
        </View>
        
        <FloatingElement delay={0.5}>
          <View style={styles.glucoBalanceScore}>
            <LinearGradient
              colors={theme.gradients.secondary}
              style={styles.scoreCircle}
            >
              <Text style={styles.scoreText}>{glucoBalance}</Text>
              <View style={styles.gradeBadge}>
                <Text style={styles.gradeText}>A+</Text>
              </View>
            </LinearGradient>
          </View>
        </FloatingElement>
      </View>

      <View style={[styles.recommendationCard, { backgroundColor: theme.colors.cardElevated, borderColor: theme.colors.border }]}>
        <View style={styles.recommendationContent}>
          <Text style={styles.foodEmoji}>🥑</Text>
          <View style={styles.recommendationDetails}>
            <Text style={[styles.recommendationTitle, { color: theme.colors.text }]}>
              {recommendation}
            </Text>
            <Text style={[styles.recommendationSubtitle, { color: theme.colors.textMuted }]}>
              Optimized for your evening dose
            </Text>
            <View style={styles.recommendationTags}>
              <View style={styles.perfectTimingTag}>
                <Text style={styles.perfectTimingText}>Perfect Timing</Text>
              </View>
              <View style={styles.lowGLTag}>
                <Text style={styles.lowGLText}>Low GL</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={onAddPress} activeOpacity={0.8}>
            <LinearGradient
              colors={theme.gradients.accent}
              style={styles.addButton}
            >
              <Ionicons name="add" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// VictoryTrack Progress Card
export const VictoryTrackCard: React.FC<{ 
  currentStreak?: number; 
  level?: number; 
  xp?: number; 
  maxXp?: number;
}> = ({ 
  currentStreak = 23, 
  level = 5, 
  xp = 380, 
  maxXp = 400 
}) => {
  const { theme } = useTheme();
  const progressPercentage = (xp / maxXp) * 100;
  
  return (
    <View style={[styles.victoryTrackCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.victoryTrackHeader}>
        <View style={styles.victoryTrackTitle}>
          <Ionicons name="trophy" size={20} color="#FFD700" />
          <Text style={[styles.victoryTrackTitleText, { color: theme.colors.text }]}>
            VictoryTrack™
          </Text>
        </View>
        <Text style={styles.trophyEmoji}>🏆</Text>
      </View>

      <View style={styles.streakContainer}>
        <FloatingElement delay={0.3}>
          <View style={styles.streakIcon}>
            <LinearGradient
              colors={theme.gradients.accent}
              style={styles.streakCircle}
            >
              <Ionicons name="flame" size={32} color="white" />
              <View style={styles.streakBadge}>
                <Text style={styles.streakNumber}>{currentStreak}</Text>
              </View>
            </LinearGradient>
          </View>
        </FloatingElement>
        
        <View style={styles.streakDetails}>
          <Text style={[styles.streakTitle, { color: theme.colors.text }]}>
            Level {level} Progress
          </Text>
          <Text style={[styles.streakSubtitle, { color: theme.colors.textMuted }]}>
            Day Streak
          </Text>
          
          <View style={styles.streakProgress}>
            <View style={styles.streakProgressHeader}>
              <Text style={[styles.streakProgressText, { color: theme.colors.textMuted }]}>
                {xp}/{maxXp} XP
              </Text>
              <Text style={[styles.streakProgressPercent, { color: theme.colors.textMuted }]}>
                {Math.round(progressPercentage)}%
              </Text>
            </View>
            <View style={[styles.streakProgressBg, { backgroundColor: theme.colors.border }]}>
              <LinearGradient
                colors={theme.gradients.primary}
                style={[styles.streakProgressBar, { width: `${progressPercentage}%` }]}
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.nextBadgeContainer}>
        <Ionicons name="sparkles" size={16} color={theme.colors.accent} />
        <Text style={[styles.nextBadgeText, { color: theme.colors.textMuted }]}>
          20 XP to unlock Diabetes Ninja badge
        </Text>
      </View>

      <View style={styles.achievementBadges}>
        {[
          { icon: 'target', name: 'Perfect Week', unlocked: true },
          { icon: 'award', name: 'Diamond TIR', unlocked: true },
          { icon: 'brain', name: 'Data Wizard', unlocked: true },
          { icon: 'game-controller', name: 'Ninja', unlocked: false }
        ].map((badge, index) => (
          <View 
            key={index}
            style={[
              styles.achievementBadge,
              { 
                backgroundColor: badge.unlocked ? theme.colors.cardElevated : theme.colors.surface,
                borderColor: badge.unlocked ? '#FFD700' : theme.colors.border,
                opacity: badge.unlocked ? 1 : 0.5,
              }
            ]}
          >
            <Ionicons 
              name={badge.icon as any} 
              size={20} 
              color={badge.unlocked ? '#FFD700' : theme.colors.textMuted} 
            />
            <Text style={[
              styles.achievementBadgeText, 
              { color: badge.unlocked ? theme.colors.text : theme.colors.textMuted }
            ]}>
              {badge.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // XP Progress Bar Styles
  xpContainer: {
    marginBottom: 16,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  legendaryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  legendaryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  xpText: {
    fontSize: 14,
  },
  progressBarContainer: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarBg: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    position: 'relative',
  },
  progressShimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 6,
  },

  // Quest Card Styles
  questCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  completedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  questContent: {
    position: 'relative',
    zIndex: 10,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completeText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: 'bold',
  },
  questTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  questDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
  },
  progressPercent: {
    fontSize: 12,
  },
  questProgressBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  questProgress: {
    height: 8,
    borderRadius: 4,
  },
  rewardGradient: {
    alignSelf: 'flex-start',
    paddingHorizontal: 1,
    paddingVertical: 1,
    borderRadius: 4,
  },
  questReward: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'transparent',
  },

  // Glucose Hero Styles
  glucoseHero: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    marginBottom: 16,
  },
  glucoseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  glucoseHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  glucoseIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glucoseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  glucoseSubtitle: {
    fontSize: 14,
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: 'bold',
  },
  glucoseMainContent: {
    alignItems: 'center',
  },
  glucoseValueContainer: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  glucoseValue: {
    fontSize: 64,
    fontWeight: '900',
  },
  glucoseUnit: {
    fontSize: 18,
    fontWeight: '500',
  },
  trendIcon: {
    position: 'absolute',
    top: -8,
    right: -32,
  },
  glucoseStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
  },

  // GlucoBalance Card Styles
  glucoBalanceCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    marginBottom: 16,
  },
  glucoBalanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  glucoBalanceTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  glucoBalanceTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  aiPoweredBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  aiPoweredText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: 'bold',
  },
  glucoBalanceScore: {
    position: 'relative',
  },
  scoreCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  scoreText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gradeBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recommendationCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  recommendationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  foodEmoji: {
    fontSize: 32,
  },
  recommendationDetails: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recommendationSubtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  recommendationTags: {
    flexDirection: 'row',
    gap: 8,
  },
  perfectTimingTag: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  perfectTimingText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '500',
  },
  lowGLTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lowGLText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '500',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // VictoryTrack Card Styles
  victoryTrackCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    marginBottom: 16,
  },
  victoryTrackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  victoryTrackTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  victoryTrackTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  trophyEmoji: {
    fontSize: 32,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  streakIcon: {
    position: 'relative',
  },
  streakCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  streakBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakNumber: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  streakDetails: {
    flex: 1,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  streakSubtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  streakProgress: {
    marginTop: 8,
  },
  streakProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  streakProgressText: {
    fontSize: 12,
  },
  streakProgressPercent: {
    fontSize: 12,
  },
  streakProgressBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  streakProgressBar: {
    height: 8,
    borderRadius: 4,
  },
  nextBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 16,
  },
  nextBadgeText: {
    fontSize: 14,
  },
  achievementBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementBadge: {
    flex: 1,
    minWidth: '22%',
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
  },
}); 