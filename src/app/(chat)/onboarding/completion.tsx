import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/src/components/Text';
import { useRouter } from 'expo-router';
import { OnboardingStep } from '@/src/components/onboarding/OnboardingStep';
import { userActions, useUserStore } from '@/src/stores/userStore';
import { use$ } from '@legendapp/state/react';

export default function Completion() {
  const router = useRouter();
  const { store } = useUserStore();
  const profile = use$(store.profile);

  const handleComplete = async () => {
    try {
      // Mark onboarding as completed
      await userActions.completeOnboarding();
      
      // Navigate to the main chat dashboard
      router.replace('/(chat)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Still navigate even if there's an error
      router.replace('/(chat)');
    }
  };

  const handleSkip = () => {
    // Same as complete for the final screen
    handleComplete();
  };

  const getWelcomeMessage = () => {
    const firstName = profile?.first_name;
    if (firstName) {
      return `Welcome to GluciQ, ${firstName}!`;
    }
    return 'Welcome to GluciQ!';
  };

  const getDiabetesTypeMessage = () => {
    const diabetesType = profile?.diabetes_type;
    switch (diabetesType) {
      case 'type1':
        return 'Type 1 Diabetes';
      case 'type2':
        return 'Type 2 Diabetes';
      case 'gestational':
        return 'Gestational Diabetes';
      default:
        return 'Diabetes Management';
    }
  };

  return (
    <OnboardingStep
      step={6}
      totalSteps={6}
      title="You're all set!"
      subtitle="Your profile is ready for personalized diabetes management"
      onNext={handleComplete}
      onSkip={handleSkip}
      showSkip={false}
      nextLabel="Start Using GluciQ"
    >
      <View style={styles.content}>
        <View style={styles.celebrationContainer}>
          <Text style={styles.celebrationIcon}>🎉</Text>
          <Text style={styles.welcomeMessage}>
            {getWelcomeMessage()}
          </Text>
          <Text style={styles.setupComplete}>
            Your {getDiabetesTypeMessage()} profile is now ready
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>What's next?</Text>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📸</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Start Food Scanning</Text>
              <Text style={styles.featureDescription}>
                Take photos of your meals to get instant nutrition analysis and insulin recommendations
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📊</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Track Your Progress</Text>
              <Text style={styles.featureDescription}>
                Log your glucose readings, meals, and insulin doses to see patterns and trends
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⚙️</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Fine-tune Settings</Text>
              <Text style={styles.featureDescription}>
                Update your insulin ratios, targets, and preferences anytime in Settings
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🩺</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Share with Your Doctor</Text>
              <Text style={styles.featureDescription}>
                Export your data to share insights with your healthcare team
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.reminderContainer}>
          <Text style={styles.reminderText}>
            💡 Remember: This app provides educational information only. Always consult with your healthcare provider for medical decisions.
          </Text>
        </View>

        <View style={styles.supportContainer}>
          <Text style={styles.supportText}>
            Need help? Access the help section in Settings or contact our support team.
          </Text>
        </View>
      </View>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 20,
  },
  celebrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  celebrationIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  welcomeMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  setupComplete: {
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  reminderContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  reminderText: {
    fontSize: 14,
    color: '#FFA500',
    lineHeight: 20,
    textAlign: 'center',
  },
  supportContainer: {
    marginBottom: 20,
  },
  supportText: {
    fontSize: 14,
    color: '#999999',
    lineHeight: 18,
    textAlign: 'center',
  },
}); 