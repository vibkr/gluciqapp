import React, { useState } from 'react';
import { View, StyleSheet, Pressable, TextInput, ScrollView, Alert } from 'react-native';
import { Text } from '@/src/components/Text';
import { useRouter } from 'expo-router';
import { OnboardingStep } from '@/src/components/onboarding/OnboardingStep';
import { userActions } from '@/src/stores/userStore';
import { onboardingLogger } from '@/src/lib/utils/logger';
import type { DiabetesType } from '@/src/lib/database/types';

const diabetesTypes: { value: DiabetesType; label: string; description: string }[] = [
  {
    value: 'type1',
    label: 'Type 1 Diabetes',
    description: 'Autoimmune condition where the body doesn\'t produce insulin'
  },
  {
    value: 'type2',
    label: 'Type 2 Diabetes',
    description: 'Body doesn\'t use insulin properly or doesn\'t produce enough'
  },
  {
    value: 'gestational',
    label: 'Gestational Diabetes',
    description: 'Diabetes that develops during pregnancy'
  },
];

export default function DiabetesType() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<DiabetesType | null>(null);
  const [diagnosisDate, setDiagnosisDate] = useState('');

  const isFormValid = selectedType !== null;

  const handleNext = async () => {
    if (!isFormValid) return;

    try {
      // Update user profile with diabetes information
      await userActions.updateProfile({
        diabetes_type: selectedType,
        diagnosis_date: diagnosisDate ? diagnosisDate : undefined,
      });

      // Move to next onboarding step
      await userActions.updateOnboardingStep(3);
      router.push('/onboarding/medical-settings');
    } catch (error) {
      console.error('Error updating diabetes type:', error);
    }
  };

  const handleSkip = () => {
    router.push('/onboarding/medical-settings');
  };

  return (
    <OnboardingStep
      step={3}
      totalSteps={6}
      title="What type of diabetes do you have?"
      subtitle="This helps us provide accurate recommendations"
      onNext={handleNext}
      onSkip={handleSkip}
      showSkip={true}
      nextLabel="Continue"
      nextDisabled={!isFormValid}
    >
      <View style={styles.content}>
        <View style={styles.optionsContainer}>
          {diabetesTypes.map((type) => (
            <Pressable
              key={type.value}
              style={[
                styles.optionCard,
                selectedType === type.value && styles.selectedCard
              ]}
              onPress={() => setSelectedType(type.value)}
            >
              <View style={styles.optionHeader}>
                <Text style={[
                  styles.optionTitle,
                  selectedType === type.value && styles.selectedText
                ]}>
                  {type.label}
                </Text>
                <View style={[
                  styles.radioButton,
                  selectedType === type.value && styles.selectedRadio
                ]}>
                  {selectedType === type.value && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
              <Text style={[
                styles.optionDescription,
                selectedType === type.value && styles.selectedDescription
              ]}>
                {type.description}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Diagnosis Date (Optional)</Text>
          <TextInput
            style={styles.input}
            value={diagnosisDate}
            onChangeText={setDiagnosisDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#666666"
            keyboardType="numeric"
          />
          <Text style={styles.inputNote}>
            When were you diagnosed? This helps us understand your experience level.
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
  optionsContainer: {
    marginBottom: 32,
  },
  optionCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#333333',
  },
  selectedCard: {
    borderColor: '#007AFF',
    backgroundColor: '#001F3F',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  selectedText: {
    color: '#007AFF',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#666666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadio: {
    borderColor: '#007AFF',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  optionDescription: {
    fontSize: 14,
    color: '#999999',
    lineHeight: 20,
  },
  selectedDescription: {
    color: '#CCCCCC',
  },
  formGroup: {
    marginBottom: 24,
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
    marginBottom: 8,
  },
  inputNote: {
    fontSize: 14,
    color: '#999999',
    lineHeight: 18,
  },
}); 