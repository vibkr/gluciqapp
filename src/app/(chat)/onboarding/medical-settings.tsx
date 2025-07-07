import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Switch, ScrollView } from 'react-native';
import { Text } from '@/src/components/Text';
import { useRouter } from 'expo-router';
import { OnboardingStep } from '@/src/components/onboarding/OnboardingStep';
import { userActions } from '@/src/stores/userStore';

export default function MedicalSettings() {
  const router = useRouter();
  
  // Basic medical settings
  const [targetGlucoseMin, setTargetGlucoseMin] = useState('80');
  const [targetGlucoseMax, setTargetGlucoseMax] = useState('180');
  const [goalA1c, setGoalA1c] = useState('7.0');
  
  // Device information
  const [hasCGM, setHasCGM] = useState(false);
  const [cgmBrand, setCgmBrand] = useState('');
  const [hasInsulinPump, setHasInsulinPump] = useState(false);
  const [insulinPumpBrand, setInsulinPumpBrand] = useState('');

  const handleNext = async () => {
    try {
      // Update user profile with medical settings
      await userActions.updateProfile({
        goal_a1c: goalA1c ? parseFloat(goalA1c) : undefined,
        has_cgm: hasCGM,
        cgm_brand: cgmBrand.trim() || undefined,
        has_insulin_pump: hasInsulinPump,
        insulin_pump_brand: insulinPumpBrand.trim() || undefined,
      });

      // Update diabetes settings if we have target glucose values
      if (targetGlucoseMin && targetGlucoseMax) {
        await userActions.updateDiabetesSettings({
          target_glucose_min: parseInt(targetGlucoseMin),
          target_glucose_max: parseInt(targetGlucoseMax),
        });
      }

      // Move to next onboarding step
      await userActions.updateOnboardingStep(4);
      router.push('/onboarding/preferences');
    } catch (error) {
      console.error('Error updating medical settings:', error);
    }
  };

  const handleSkip = () => {
    router.push('/onboarding/preferences');
  };

  return (
    <OnboardingStep
      step={4}
      totalSteps={6}
      title="Medical Settings"
      subtitle="Help us personalize your diabetes management"
      onNext={handleNext}
      onSkip={handleSkip}
      showSkip={true}
      nextLabel="Continue"
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target Glucose Range</Text>
          <Text style={styles.sectionDescription}>
            Your target blood glucose range in mg/dL
          </Text>
          
          <View style={styles.rangeContainer}>
            <View style={styles.rangeInput}>
              <Text style={styles.label}>Minimum</Text>
              <TextInput
                style={styles.input}
                value={targetGlucoseMin}
                onChangeText={setTargetGlucoseMin}
                placeholder="80"
                placeholderTextColor="#666666"
                keyboardType="numeric"
              />
            </View>
            
            <Text style={styles.rangeSeparator}>to</Text>
            
            <View style={styles.rangeInput}>
              <Text style={styles.label}>Maximum</Text>
              <TextInput
                style={styles.input}
                value={targetGlucoseMax}
                onChangeText={setTargetGlucoseMax}
                placeholder="180"
                placeholderTextColor="#666666"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>A1C Goal</Text>
          <Text style={styles.sectionDescription}>
            Your target A1C percentage (optional)
          </Text>
          
          <View style={styles.formGroup}>
            <TextInput
              style={styles.input}
              value={goalA1c}
              onChangeText={setGoalA1c}
              placeholder="7.0"
              placeholderTextColor="#666666"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Devices</Text>
          <Text style={styles.sectionDescription}>
            Tell us about your diabetes management devices
          </Text>
          
          <View style={styles.deviceContainer}>
            <View style={styles.deviceRow}>
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceLabel}>Continuous Glucose Monitor (CGM)</Text>
                <Text style={styles.deviceDescription}>
                  Automatically tracks your blood sugar
                </Text>
              </View>
              <Switch
                value={hasCGM}
                onValueChange={setHasCGM}
                trackColor={{ false: '#333333', true: '#007AFF' }}
                thumbColor={hasCGM ? '#FFFFFF' : '#CCCCCC'}
              />
            </View>
            
            {hasCGM && (
              <View style={styles.deviceBrandContainer}>
                <Text style={styles.label}>CGM Brand</Text>
                <TextInput
                  style={styles.input}
                  value={cgmBrand}
                  onChangeText={setCgmBrand}
                  placeholder="e.g., Dexcom G6, FreeStyle Libre"
                  placeholderTextColor="#666666"
                />
              </View>
            )}
          </View>

          <View style={styles.deviceContainer}>
            <View style={styles.deviceRow}>
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceLabel}>Insulin Pump</Text>
                <Text style={styles.deviceDescription}>
                  Automatically delivers insulin
                </Text>
              </View>
              <Switch
                value={hasInsulinPump}
                onValueChange={setHasInsulinPump}
                trackColor={{ false: '#333333', true: '#007AFF' }}
                thumbColor={hasInsulinPump ? '#FFFFFF' : '#CCCCCC'}
              />
            </View>
            
            {hasInsulinPump && (
              <View style={styles.deviceBrandContainer}>
                <Text style={styles.label}>Insulin Pump Brand</Text>
                <TextInput
                  style={styles.input}
                  value={insulinPumpBrand}
                  onChangeText={setInsulinPumpBrand}
                  placeholder="e.g., Medtronic, Omnipod"
                  placeholderTextColor="#666666"
                />
              </View>
            )}
          </View>
        </View>

        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimer}>
            💡 Don't worry if you don't know these values yet. You can always update them later in settings, or work with your healthcare provider to determine the right targets for you.
          </Text>
        </View>
      </ScrollView>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#999999',
    lineHeight: 20,
    marginBottom: 16,
  },
  rangeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
  },
  rangeInput: {
    flex: 1,
  },
  rangeSeparator: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 14,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#333333',
  },
  deviceContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  deviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceInfo: {
    flex: 1,
    marginRight: 16,
  },
  deviceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  deviceDescription: {
    fontSize: 14,
    color: '#999999',
    lineHeight: 18,
  },
  deviceBrandContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  disclaimerContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  disclaimer: {
    fontSize: 14,
    color: '#999999',
    lineHeight: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 