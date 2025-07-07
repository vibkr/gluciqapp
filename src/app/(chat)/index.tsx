import React from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { Text } from '@/src/components/Text';
import { IconSymbol } from '@/src/components/IconSymbol';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { testGeminiAPI, testGeminiVisionAPI } from '@/src/lib/ai/test-api';
import { testSupabaseConnection, testSupabaseAuth, testLoadTestUser } from '@/src/lib/database/test-supabase';

export default function Dashboard() {
  const { user } = useUser();
  const router = useRouter();

  const handleFoodScanning = () => {
    router.push('/camera/food-capture');
  };

  const handleBarcodeScanning = () => {
    router.push('/camera/barcode-scanner');
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
          <Text style={styles.welcomeText}>
            Welcome back, {user?.firstName || 'User'}!
          </Text>
          <Text style={styles.subText}>
            What would you like to analyze today?
          </Text>
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
  header: {
    marginTop: 20,
    marginBottom: 40,
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