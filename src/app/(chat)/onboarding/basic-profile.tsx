import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { Text } from '@/src/components/Text';
import { useRouter } from 'expo-router';
import { OnboardingStep } from '@/src/components/onboarding/OnboardingStep';
import { userActions } from '@/src/stores/userStore';

export default function BasicProfile() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const isFormValid = firstName.trim() && lastName.trim() && dateOfBirth;

  const handleNext = async () => {
    if (!isFormValid) return;

    try {
      // Update user profile with basic information
      await userActions.updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim() || undefined,
        date_of_birth: dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : undefined,
      });

      // Move to next onboarding step
      await userActions.updateOnboardingStep(2);
      router.push('/onboarding/diabetes-type');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSkip = () => {
    router.push('/onboarding/diabetes-type');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Date of Birth *</Text>
          <TextInput
            style={styles.input}
            value={dateOfBirth ? formatDate(dateOfBirth) : ''}
            onChangeText={(text) => {
              // Simple date parsing for YYYY-MM-DD format
              const date = new Date(text);
              if (!isNaN(date.getTime())) {
                setDateOfBirth(date);
              }
            }}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#666666"
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.note}>
          * Required fields. This information helps us provide personalized recommendations.
        </Text>
      </View>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
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

  note: {
    fontSize: 14,
    color: '#999999',
    lineHeight: 20,
    marginTop: 20,
  },
}); 