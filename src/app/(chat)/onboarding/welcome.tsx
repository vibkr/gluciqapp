import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from '@/src/components/Text';
import { useRouter } from 'expo-router';
import { OnboardingStep } from '@/src/components/onboarding/OnboardingStep';
import { OnboardingStep as OnboardingStepEnum } from '@/src/stores/userStore';

export default function Welcome() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/onboarding/basic-profile');
  };

  const handleSkip = () => {
    // For welcome screen, skip goes to basic profile anyway
    router.push('/onboarding/basic-profile');
  };

  return (
    <OnboardingStep
      step={1}
      totalSteps={6}
      title="Welcome to GluciQ"
      subtitle="Your AI-powered diabetes management companion"
      onNext={handleNext}
      onSkip={handleSkip}
      showSkip={false}
      nextLabel="Get Started"
    >
      <View style={styles.content}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📸</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Smart Food Analysis</Text>
              <Text style={styles.featureDescription}>
                Take photos of your meals to get instant nutrition information and insulin recommendations
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>💉</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Insulin Calculations</Text>
              <Text style={styles.featureDescription}>
                Personalized insulin dose recommendations based on your carb ratios and correction factors
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📊</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Health Tracking</Text>
              <Text style={styles.featureDescription}>
                Monitor your glucose levels, meals, and insulin doses in one place
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔒</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Privacy First</Text>
              <Text style={styles.featureDescription}>
                Your health data is encrypted and stored securely. You control what you share
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.disclaimer}>
          This app is for educational purposes only. Always consult with your healthcare provider before making medical decisions.
        </Text>
      </View>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  featureList: {
    width: '100%',
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 20,
    lineHeight: 16,
  },
}); 