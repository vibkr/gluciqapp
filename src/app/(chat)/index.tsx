import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { Text } from '@/src/components/Text';
import { IconSymbol } from '@/src/components/IconSymbol';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { testGeminiAPI, testGeminiVisionAPI } from '@/src/lib/ai/test-api';
import { testSupabaseConnection, testSupabaseAuth, testLoadTestUser } from '@/src/lib/database/test-supabase';
import { useUserStore, userActions } from '@/src/stores/userStore';
import { use$ } from '@legendapp/state/react';

export default function Dashboard() {
  const { user } = useUser();
  const router = useRouter();
  const { store, computed } = useUserStore();
  
  // Reactive state from user store
  const profile = use$(store.profile);
  const isLoading = use$(store.isLoading);
  const onboardingCompleted = use$(store.onboardingCompleted);
  const profileCompletionPercentage = use$(store.profileCompletionPercentage);
  const syncError = use$(store.syncError);

  // Initialize user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      userActions.initializeUser(user);
    }
  }, [user]);

  // Redirect to onboarding if profile is incomplete
  useEffect(() => {
    if (!isLoading && profile && computed.needsOnboarding) {
      console.log('Redirecting to onboarding - profile incomplete');
      router.replace('/onboarding/welcome');
    }
  }, [isLoading, profile, computed.needsOnboarding, router]);

  // Show loading state while initializing user data
  if (isLoading || !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Setting up your profile...</Text>
          {syncError && (
            <Text style={styles.errorText}>
              Error: {syncError}
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Show onboarding prompt if profile is incomplete but not yet redirected
  if (computed.needsOnboarding) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.onboardingPromptContainer}>
          <Text style={styles.welcomeText}>
            Welcome to GluciQ!
          </Text>
          <Text style={styles.subText}>
            Let's set up your profile to get started
          </Text>
          <Pressable 
            style={styles.onboardingButton}
            onPress={() => router.push('/onboarding/welcome')}
          >
            <Text style={styles.onboardingButtonText}>
              Complete Setup
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleFoodScanning = () => {
    router.push('/camera/food-capture');
  };

  const handleBarcodeScanning = () => {
    router.push('/camera/barcode-scanner');
  };

  const handleProfile = () => {
    router.push('/settings/profile');
  };

  const handleTestAPI = async () => {
    try {
      Alert.alert('Testing Connections...', 'Please wait while we test all API connections.');
      
      // Test Google Gemini APIs
      const geminiWorks = await testGeminiAPI();
      const visionWorks = await testGeminiVisionAPI();
      
      // Test Supabase
      const supabaseWorks = await testSupabaseConnection();
      const supabaseAuthWorks = await testSupabaseAuth();
      const testUserWorks = await testLoadTestUser();
      
      const results = [
        `Gemini API: ${geminiWorks ? '✅' : '❌'}`,
        `Vision API: ${visionWorks ? '✅' : '❌'}`,
        `Supabase DB: ${supabaseWorks ? '✅' : '❌'}`,
        `Supabase Auth: ${supabaseAuthWorks ? '✅' : '❌'}`,
        `Test User: ${testUserWorks ? '✅' : '❌'}`
      ].join('\n');
      
      const allWorking = geminiWorks && visionWorks && supabaseWorks && supabaseAuthWorks && testUserWorks;
      
      Alert.alert(
        allWorking ? '✅ All Tests Passed!' : '⚠️ Some Tests Failed',
        results
      );
      
    } catch (error) {
      Alert.alert('❌ Test Error', 'Error running tests: ' + error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.welcomeText}>
                Welcome back, {profile.first_name || profile.display_name || 'User'}!
              </Text>
              <Text style={styles.subText}>
                What would you like to analyze today?
              </Text>
            </View>
            <Pressable 
              style={styles.profileButton}
              onPress={handleProfile}
            >
              <IconSymbol 
                name="person.circle.fill" 
                size={32} 
                color="#007AFF" 
              />
              {profileCompletionPercentage < 100 && (
                <View style={styles.completionBadge}>
                  <Text style={styles.completionText}>
                    {profileCompletionPercentage}%
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
          
          {profileCompletionPercentage < 100 && (
            <View style={styles.profileCompletionBar}>
              <Text style={styles.profileCompletionText}>
                Profile {profileCompletionPercentage}% complete
              </Text>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${profileCompletionPercentage}%` }
                  ]} 
                />
              </View>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Pressable 
            style={styles.scanButton}
            onPress={handleFoodScanning}
          >
            <View style={styles.buttonContent}>
              <IconSymbol 
                name="camera.fill" 
                size={40} 
                color="#007AFF" 
              />
              <Text style={styles.buttonTitle}>Food Scanning</Text>
              <Text style={styles.buttonSubtitle}>
                Take a photo of your food to get nutrition info and insulin recommendations
              </Text>
            </View>
          </Pressable>

          <Pressable 
            style={styles.scanButton}
            onPress={handleBarcodeScanning}
          >
            <View style={styles.buttonContent}>
              <IconSymbol 
                name="barcode.viewfinder" 
                size={40} 
                color="#007AFF" 
              />
              <Text style={styles.buttonTitle}>Barcode Scanning</Text>
              <Text style={styles.buttonSubtitle}>
                Scan product barcodes to get detailed nutrition information
              </Text>
            </View>
          </Pressable>

          {/* Temporary API Test Button */}
          <Pressable 
            style={[styles.scanButton, { backgroundColor: '#2c2c2c' }]}
            onPress={handleTestAPI}
          >
            <View style={styles.buttonContent}>
              <IconSymbol 
                name="gear" 
                size={30} 
                color="#FFA500" 
              />
              <Text style={styles.buttonTitle}>Test All Connections</Text>
              <Text style={styles.buttonSubtitle}>
                Test Google Gemini APIs, Supabase database, and user data
              </Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Your diabetes management companion
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  onboardingPromptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  onboardingButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 32,
  },
  onboardingButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  profileButton: {
    position: 'relative',
  },
  completionBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 24,
  },
  completionText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  profileCompletionBar: {
    marginTop: 8,
  },
  profileCompletionText: {
    fontSize: 14,
    color: '#FFA500',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFA500',
    borderRadius: 2,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: '#999999',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  scanButton: {
    backgroundColor: '#1c1c1c',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#333333',
  },
  buttonContent: {
    alignItems: 'center',
    gap: 12,
  },
  buttonTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
});