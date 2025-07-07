import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Switch, ScrollView } from 'react-native';
import { Text } from '@/src/components/Text';
import { useRouter } from 'expo-router';
import { OnboardingStep } from '@/src/components/onboarding/OnboardingStep';
import { userActions } from '@/src/stores/userStore';

export default function Preferences() {
  const router = useRouter();
  
  // Unit preferences
  const [glucoseUnit, setGlucoseUnit] = useState<'mg/dL' | 'mmol/L'>('mg/dL');
  const [preferredUnits, setPreferredUnits] = useState<'metric' | 'imperial'>('metric');
  
  // Notification preferences
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [glucoseReminders, setGlucoseReminders] = useState(true);
  const [mealReminders, setMealReminders] = useState(true);
  const [insulinReminders, setInsulinReminders] = useState(true);
  
  // Emergency contact
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelationship, setEmergencyRelationship] = useState('');

  const handleNext = async () => {
    try {
      // Update user profile with preferences
      await userActions.updateProfile({
        glucose_unit: glucoseUnit,
        preferred_units: preferredUnits,
        emergency_contact_name: emergencyName.trim() || undefined,
        emergency_contact_phone: emergencyPhone.trim() || undefined,
        emergency_contact_relationship: emergencyRelationship.trim() || undefined,
      });

      // Update user preferences
      await userActions.updatePreferences({
        notifications_enabled: notificationsEnabled,
        glucose_reminders: glucoseReminders,
        meal_reminders: mealReminders,
        insulin_reminders: insulinReminders,
      });

      // Move to next onboarding step
      await userActions.updateOnboardingStep(5);
      router.push('/onboarding/completion');
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const handleSkip = () => {
    router.push('/onboarding/completion');
  };

  return (
    <OnboardingStep
      step={5}
      totalSteps={6}
      title="Preferences"
      subtitle="Customize your experience"
      onNext={handleNext}
      onSkip={handleSkip}
      showSkip={true}
      nextLabel="Continue"
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Units</Text>
          <Text style={styles.sectionDescription}>
            Choose your preferred measurement units
          </Text>
          
          <View style={styles.unitContainer}>
            <Text style={styles.unitLabel}>Glucose Unit</Text>
            <View style={styles.unitButtons}>
              <Pressable
                style={[
                  styles.unitButton,
                  glucoseUnit === 'mg/dL' && styles.selectedUnitButton
                ]}
                onPress={() => setGlucoseUnit('mg/dL')}
              >
                <Text style={[
                  styles.unitButtonText,
                  glucoseUnit === 'mg/dL' && styles.selectedUnitText
                ]}>
                  mg/dL
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.unitButton,
                  glucoseUnit === 'mmol/L' && styles.selectedUnitButton
                ]}
                onPress={() => setGlucoseUnit('mmol/L')}
              >
                <Text style={[
                  styles.unitButtonText,
                  glucoseUnit === 'mmol/L' && styles.selectedUnitText
                ]}>
                  mmol/L
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.unitContainer}>
            <Text style={styles.unitLabel}>Weight & Height</Text>
            <View style={styles.unitButtons}>
              <Pressable
                style={[
                  styles.unitButton,
                  preferredUnits === 'metric' && styles.selectedUnitButton
                ]}
                onPress={() => setPreferredUnits('metric')}
              >
                <Text style={[
                  styles.unitButtonText,
                  preferredUnits === 'metric' && styles.selectedUnitText
                ]}>
                  kg / cm
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.unitButton,
                  preferredUnits === 'imperial' && styles.selectedUnitButton
                ]}
                onPress={() => setPreferredUnits('imperial')}
              >
                <Text style={[
                  styles.unitButtonText,
                  preferredUnits === 'imperial' && styles.selectedUnitText
                ]}>
                  lbs / ft
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <Text style={styles.sectionDescription}>
            Choose which reminders you'd like to receive
          </Text>
          
          <View style={styles.notificationContainer}>
            <View style={styles.notificationRow}>
              <View style={styles.notificationInfo}>
                <Text style={styles.notificationLabel}>Enable Notifications</Text>
                <Text style={styles.notificationDescription}>
                  Allow the app to send you reminders
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#333333', true: '#007AFF' }}
                thumbColor={notificationsEnabled ? '#FFFFFF' : '#CCCCCC'}
              />
            </View>
          </View>

          {notificationsEnabled && (
            <>
              <View style={styles.notificationContainer}>
                <View style={styles.notificationRow}>
                  <View style={styles.notificationInfo}>
                    <Text style={styles.notificationLabel}>Glucose Reminders</Text>
                    <Text style={styles.notificationDescription}>
                      Remind you to check your blood sugar
                    </Text>
                  </View>
                  <Switch
                    value={glucoseReminders}
                    onValueChange={setGlucoseReminders}
                    trackColor={{ false: '#333333', true: '#007AFF' }}
                    thumbColor={glucoseReminders ? '#FFFFFF' : '#CCCCCC'}
                  />
                </View>
              </View>

              <View style={styles.notificationContainer}>
                <View style={styles.notificationRow}>
                  <View style={styles.notificationInfo}>
                    <Text style={styles.notificationLabel}>Meal Reminders</Text>
                    <Text style={styles.notificationDescription}>
                      Remind you to log your meals
                    </Text>
                  </View>
                  <Switch
                    value={mealReminders}
                    onValueChange={setMealReminders}
                    trackColor={{ false: '#333333', true: '#007AFF' }}
                    thumbColor={mealReminders ? '#FFFFFF' : '#CCCCCC'}
                  />
                </View>
              </View>

              <View style={styles.notificationContainer}>
                <View style={styles.notificationRow}>
                  <View style={styles.notificationInfo}>
                    <Text style={styles.notificationLabel}>Insulin Reminders</Text>
                    <Text style={styles.notificationDescription}>
                      Remind you to take your insulin
                    </Text>
                  </View>
                  <Switch
                    value={insulinReminders}
                    onValueChange={setInsulinReminders}
                    trackColor={{ false: '#333333', true: '#007AFF' }}
                    thumbColor={insulinReminders ? '#FFFFFF' : '#CCCCCC'}
                  />
                </View>
              </View>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          <Text style={styles.sectionDescription}>
            Someone we can contact in case of emergency (optional)
          </Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={emergencyName}
              onChangeText={setEmergencyName}
              placeholder="Full name"
              placeholderTextColor="#666666"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={emergencyPhone}
              onChangeText={setEmergencyPhone}
              placeholder="Phone number"
              placeholderTextColor="#666666"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Relationship</Text>
            <TextInput
              style={styles.input}
              value={emergencyRelationship}
              onChangeText={setEmergencyRelationship}
              placeholder="e.g., Spouse, Parent, Friend"
              placeholderTextColor="#666666"
              autoCapitalize="words"
            />
          </View>
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
  unitContainer: {
    marginBottom: 20,
  },
  unitLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  unitButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  unitButton: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#333333',
    alignItems: 'center',
  },
  selectedUnitButton: {
    borderColor: '#007AFF',
    backgroundColor: '#001F3F',
  },
  unitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  selectedUnitText: {
    color: '#007AFF',
  },
  notificationContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationInfo: {
    flex: 1,
    marginRight: 16,
  },
  notificationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#999999',
    lineHeight: 18,
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
}); 