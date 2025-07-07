import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { Text } from '@/src/components/Text';
import { useRouter } from 'expo-router';
import { OnboardingStep } from '@/src/components/onboarding/OnboardingStep';
import { userActions } from '@/src/stores/userStore';
import { onboardingLogger } from '@/src/lib/utils/logger';

export default function BasicProfile() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  
  // Validate date format YYYY-MM-DD
  const isValidDate = (dateString: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime()) && dateString === date.toISOString().split('T')[0];
  };
  
  const isFormValid = firstName.trim() && lastName.trim() && isValidDate(dateOfBirth);

  const handleNext = async () => {
    if (!isFormValid) {
      Alert.alert('Incomplete Information', 'Please fill in all required fields.');
      return;
    }

    try {
      onboardingLogger.info('Updating basic profile information');
      
      // Update user profile with basic information
      const success = await userActions.updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim() || undefined,
        date_of_birth: dateOfBirth || undefined,
      });

      if (!success) {
        Alert.alert('Error', 'Failed to save profile information. Please try again.');
        return;
      }

      // Move to next onboarding step
      await userActions.updateOnboardingStep(2);
      onboardingLogger.info('Moving to diabetes type selection');
      router.push('/onboarding/diabetes-type');
    } catch (error) {
      onboardingLogger.error('Error updating profile', error as Error);
      Alert.alert('Error', 'Failed to save profile information. Please try again.');
    }
  };

  const handleSkip = () => {
    router.push('/onboarding/diabetes-type');
  };



  return (
    <OnboardingStep
      step={2}
      totalSteps={6}
      title="Tell us about yourself"
      subtitle="This helps us personalize your experience"
      onNext={handleNext}
      onSkip={handleSkip}
      showSkip={true}
      nextLabel="Continue"
      nextDisabled={!isFormValid}
    >
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
              placeholderTextColor="#666666"
              autoCapitalize="words"
              autoComplete="given-name"
              returnKeyType="next"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
              placeholderTextColor="#666666"
              autoCapitalize="words"
              autoComplete="family-name"
              returnKeyType="next"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              placeholderTextColor="#666666"
              keyboardType="phone-pad"
              autoComplete="tel"
              returnKeyType="next"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Date of Birth *</Text>
            <TextInput
              style={[styles.input, !isValidDate(dateOfBirth) && dateOfBirth.length > 0 && styles.inputError]}
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="YYYY-MM-DD (e.g., 1990-01-15)"
              placeholderTextColor="#666666"
              keyboardType="numeric"
              maxLength={10}
              returnKeyType="done"
            />
            {dateOfBirth.length > 0 && !isValidDate(dateOfBirth) && (
              <Text style={styles.errorText}>Please enter a valid date in YYYY-MM-DD format</Text>
            )}
          </View>

          <Text style={styles.note}>
            * Required fields. This information helps us provide personalized recommendations.
          </Text>
        </View>
      </ScrollView>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    paddingTop: 20,
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
  },

  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  errorText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: 4,
  },
  note: {
    fontSize: 14,
    color: '#999999',
    lineHeight: 20,
    marginTop: 20,
  },
}); 