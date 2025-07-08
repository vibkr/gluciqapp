import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';



// Type helper for LinearGradient colors
const getGradientColors = (colors: string[]): readonly [string, string, ...string[]] => {
  if (colors.length < 2) {
    return [colors[0] || '#000000', colors[0] || '#000000'];
  }
  return colors as unknown as readonly [string, string, ...string[]];
};

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
            colors={getGradientColors(theme.gradients.accent)}
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
              colors={getGradientColors(theme.gradients.primary)}
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
            colors={completed ? ['#10B981', '#059669'] : getGradientColors(theme.gradients.primary)}
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
                colors={getGradientColors(theme.gradients.secondary)}
                style={[styles.questProgress, { width: `${progress}%` }]}
              />
            </View>
          </View>
        )}
        
        <LinearGradient
          colors={getGradientColors(theme.gradients.accent)}
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
      colors={getGradientColors(theme.gradients.card)}
      style={[styles.glucoseHero, { borderColor: theme.colors.border }]}
    >
      <View style={styles.glucoseHeader}>
        <View style={styles.glucoseHeaderLeft}>
          <LinearGradient
            colors={getGradientColors(theme.gradients.primary)}
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
            <Ionicons name="bulb" size={20} color={theme.colors.primary} />
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
              colors={getGradientColors(theme.gradients.secondary)}
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
              colors={getGradientColors(theme.gradients.accent)}
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
              colors={getGradientColors(theme.gradients.accent)}
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
                colors={getGradientColors(theme.gradients.primary)}
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
          { icon: 'flag' as const, name: 'Perfect Week', unlocked: true },
          { icon: 'medal' as const, name: 'Diamond TIR', unlocked: true },
          { icon: 'analytics' as const, name: 'Data Wizard', unlocked: true },
          { icon: 'game-controller' as const, name: 'Ninja', unlocked: false }
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
              name={badge.icon} 
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
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '600',
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  questReward: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Glucose Hero Styles
  glucoseHero: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  glucoseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: 'bold',
  },
  glucoseMainContent: {
    gap: 20,
  },
  glucoseValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  glucoseValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  glucoseUnit: {
    fontSize: 18,
    fontWeight: '600',
  },
  trendIcon: {
    marginLeft: 8,
  },
  glucoseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },

  // GlucoBalance Card Styles
  glucoBalanceCard: {
    borderRadius: 16,
    padding: 16,
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
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
  },
  aiPoweredText: {
    color: '#8B5CF6',
    fontSize: 10,
    fontWeight: 'bold',
  },
  glucoBalanceScore: {
    alignItems: 'center',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  scoreText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  gradeBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFD700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  gradeText: {
    color: '#1E293B',
    fontSize: 10,
    fontWeight: 'bold',
  },
  recommendationCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  recommendationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  perfectTimingText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: 'bold',
  },
  lowGLTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  lowGLText: {
    color: '#3B82F6',
    fontSize: 10,
    fontWeight: 'bold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // VictoryTrack Card Styles
  victoryTrackCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  victoryTrackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    fontSize: 24,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  streakIcon: {
    alignItems: 'center',
  },
  streakCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  streakBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFD700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  streakNumber: {
    color: '#1E293B',
    fontSize: 12,
    fontWeight: 'bold',
  },
  streakDetails: {
    flex: 1,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  streakSubtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  streakProgress: {
    gap: 8,
  },
  streakProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakProgressText: {
    fontSize: 12,
    fontWeight: '600',
  },
  streakProgressPercent: {
    fontSize: 12,
    fontWeight: '600',
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
    gap: 8,
    marginBottom: 16,
  },
  nextBadgeText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  achievementBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 80,
  },
  achievementBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
}); 