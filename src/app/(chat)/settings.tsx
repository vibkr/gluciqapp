import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/contexts/ThemeContext';
import { Card } from '@/src/components/ui';
import { userStore, userActions } from '@/src/stores/userStore';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { signOut } = useAuth();
  const router = useRouter();
  
  // Get current data from store
  const currentProfile = userStore.profile.get();
  const currentPreferences = userStore.preferences.get();
  const currentDiabetesSettings = userStore.diabetesSettings.get();
  const [loading, setLoading] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  
  // Form states
  const [profileData, setProfileData] = useState({
    first_name: currentProfile?.first_name || '',
    last_name: currentProfile?.last_name || '',
    height_cm: currentProfile?.height_cm?.toString() || '',
    current_weight_kg: currentProfile?.current_weight_kg?.toString() || '',
    diabetes_type: currentProfile?.diabetes_type || 'type1',
  });
  
  const [diabetesData, setDiabetesData] = useState({
    carb_ratio: (currentDiabetesSettings?.carb_ratios?.[0] as any)?.ratio?.toString() || '15',
    correction_factor: (currentDiabetesSettings?.correction_factors?.[0] as any)?.factor?.toString() || '50',
    target_glucose_min: currentDiabetesSettings?.target_glucose_min?.toString() || '80',
    target_glucose_max: currentDiabetesSettings?.target_glucose_max?.toString() || '180',
    insulin_duration_hours: currentDiabetesSettings?.insulin_duration_hours?.toString() || '4',
    insulin_onset_minutes: currentDiabetesSettings?.insulin_onset_minutes?.toString() || '15',
    max_bolus_units: currentDiabetesSettings?.max_bolus_units?.toString() || '10',
  });

  const [preferencesData, setPreferencesData] = useState({
    notifications_enabled: currentPreferences?.notifications_enabled ?? true,
    glucose_reminders: currentPreferences?.glucose_reminders ?? true,
    insulin_reminders: currentPreferences?.insulin_reminders ?? true,
    meal_reminders: currentPreferences?.meal_reminders ?? true,
    theme: currentPreferences?.theme || 'dark',
  });

  // Update form data when store data changes
  useEffect(() => {
    if (currentProfile) {
      setProfileData({
        first_name: currentProfile.first_name || '',
        last_name: currentProfile.last_name || '',
        height_cm: currentProfile.height_cm?.toString() || '',
        current_weight_kg: currentProfile.current_weight_kg?.toString() || '',
        diabetes_type: currentProfile.diabetes_type || 'type1',
      });
    }
  }, [currentProfile]);

  useEffect(() => {
    if (currentDiabetesSettings) {
      setDiabetesData({
        carb_ratio: (currentDiabetesSettings.carb_ratios?.[0] as any)?.ratio?.toString() || '15',
        correction_factor: (currentDiabetesSettings.correction_factors?.[0] as any)?.factor?.toString() || '50',
        target_glucose_min: currentDiabetesSettings.target_glucose_min?.toString() || '80',
        target_glucose_max: currentDiabetesSettings.target_glucose_max?.toString() || '180',
        insulin_duration_hours: currentDiabetesSettings.insulin_duration_hours?.toString() || '4',
        insulin_onset_minutes: currentDiabetesSettings.insulin_onset_minutes?.toString() || '15',
        max_bolus_units: currentDiabetesSettings.max_bolus_units?.toString() || '10',
      });
    }
  }, [currentDiabetesSettings]);

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const updates = {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        height_cm: profileData.height_cm ? parseFloat(profileData.height_cm) : undefined,
        current_weight_kg: profileData.current_weight_kg ? parseFloat(profileData.current_weight_kg) : undefined,
        diabetes_type: profileData.diabetes_type as any,
      };

      const success = await userActions.updateProfile(updates);
      if (success) {
        setEditingSection(null);
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'An error occurred while updating your profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDiabetesSettings = async () => {
    try {
      setLoading(true);
      const settings = {
        carb_ratios: [
          { time_start: '00:00', time_end: '23:59', ratio: parseFloat(diabetesData.carb_ratio) || 15 }
        ],
        correction_factors: [
          { time_start: '00:00', time_end: '23:59', factor: parseFloat(diabetesData.correction_factor) || 50 }
        ],
        target_glucose_min: parseFloat(diabetesData.target_glucose_min) || 80,
        target_glucose_max: parseFloat(diabetesData.target_glucose_max) || 180,
        insulin_duration_hours: parseFloat(diabetesData.insulin_duration_hours) || 4,
        insulin_onset_minutes: parseFloat(diabetesData.insulin_onset_minutes) || 15,
        max_bolus_units: parseFloat(diabetesData.max_bolus_units) || 10,
      };

      const success = await userActions.updateDiabetesSettings(settings);
      if (success) {
        setEditingSection(null);
        Alert.alert('Success', 'Diabetes settings updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update diabetes settings. Please try again.');
      }
    } catch (error) {
      console.error('Error updating diabetes settings:', error);
      Alert.alert('Error', 'An error occurred while updating your diabetes settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      setLoading(true);
      const success = await userActions.updatePreferences(preferencesData);
      if (success) {
        setEditingSection(null);
        Alert.alert('Success', 'Preferences updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update preferences. Please try again.');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      Alert.alert('Error', 'An error occurred while updating your preferences.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await userActions.clearUserData();
            await signOut();
            router.replace('/(auth)');
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flex: 1,
      padding: 16,
    },
    sectionCard: {
      marginBottom: 16,
      padding: 16,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    editButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: theme.colors.primary,
      borderRadius: 6,
    },
    editButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '500',
    },
    saveButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: theme.colors.success || '#4CAF50',
      borderRadius: 6,
    },
    cancelButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: theme.colors.textSecondary,
      borderRadius: 6,
      marginRight: 8,
    },
    buttonRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    fieldContainer: {
      marginBottom: 16,
    },
    fieldLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: 8,
    },
    fieldValue: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    fieldInput: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: theme.colors.text,
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    switchLabel: {
      fontSize: 16,
      color: theme.colors.text,
      flex: 1,
    },
    diabetesRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    diabetesField: {
      flex: 1,
    },
    helpText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 4,
      fontStyle: 'italic',
    },
    dangerButton: {
      backgroundColor: theme.colors.error || '#F44336',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
    },
    dangerButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Profile Section */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Profile</Text>
            {editingSection === 'profile' ? (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setEditingSection(null)}
                >
                  <Text style={styles.editButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveProfile}
                  disabled={loading}
                >
                  <Text style={styles.editButtonText}>
                    {loading ? 'Saving...' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setEditingSection('profile')}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>First Name</Text>
            {editingSection === 'profile' ? (
              <TextInput
                style={styles.fieldInput}
                value={profileData.first_name}
                onChangeText={(text) => setProfileData({...profileData, first_name: text})}
                placeholder="Enter your first name"
                placeholderTextColor={theme.colors.textSecondary}
              />
            ) : (
              <Text style={styles.fieldValue}>{profileData.first_name || 'Not set'}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Last Name</Text>
            {editingSection === 'profile' ? (
              <TextInput
                style={styles.fieldInput}
                value={profileData.last_name}
                onChangeText={(text) => setProfileData({...profileData, last_name: text})}
                placeholder="Enter your last name"
                placeholderTextColor={theme.colors.textSecondary}
              />
            ) : (
              <Text style={styles.fieldValue}>{profileData.last_name || 'Not set'}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Height (cm)</Text>
            {editingSection === 'profile' ? (
              <TextInput
                style={styles.fieldInput}
                value={profileData.height_cm}
                onChangeText={(text) => setProfileData({...profileData, height_cm: text})}
                placeholder="170"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.fieldValue}>{profileData.height_cm || 'Not set'} cm</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Weight (kg)</Text>
            {editingSection === 'profile' ? (
              <TextInput
                style={styles.fieldInput}
                value={profileData.current_weight_kg}
                onChangeText={(text) => setProfileData({...profileData, current_weight_kg: text})}
                placeholder="70"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.fieldValue}>{profileData.current_weight_kg || 'Not set'} kg</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Diabetes Type</Text>
            <Text style={styles.fieldValue}>
              {profileData.diabetes_type === 'type1' ? 'Type 1' : 
               profileData.diabetes_type === 'type2' ? 'Type 2' : 'Gestational'}
            </Text>
          </View>
        </Card>

        {/* Diabetes Settings Section */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Diabetes Settings</Text>
            {editingSection === 'diabetes' ? (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setEditingSection(null)}
                >
                  <Text style={styles.editButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveDiabetesSettings}
                  disabled={loading}
                >
                  <Text style={styles.editButtonText}>
                    {loading ? 'Saving...' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setEditingSection('diabetes')}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.diabetesRow}>
            <View style={styles.diabetesField}>
              <Text style={styles.fieldLabel}>Carb Ratio (1:X)</Text>
              {editingSection === 'diabetes' ? (
                <TextInput
                  style={styles.fieldInput}
                  value={diabetesData.carb_ratio}
                  onChangeText={(text) => setDiabetesData({...diabetesData, carb_ratio: text})}
                  placeholder="15"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.fieldValue}>1:{diabetesData.carb_ratio}</Text>
              )}
              <Text style={styles.helpText}>1 unit per X grams of carbs</Text>
            </View>

            <View style={styles.diabetesField}>
              <Text style={styles.fieldLabel}>Correction Factor</Text>
              {editingSection === 'diabetes' ? (
                <TextInput
                  style={styles.fieldInput}
                  value={diabetesData.correction_factor}
                  onChangeText={(text) => setDiabetesData({...diabetesData, correction_factor: text})}
                  placeholder="50"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.fieldValue}>1:{diabetesData.correction_factor}</Text>
              )}
              <Text style={styles.helpText}>1 unit per X mg/dL</Text>
            </View>
          </View>

          <View style={styles.diabetesRow}>
            <View style={styles.diabetesField}>
              <Text style={styles.fieldLabel}>Target Glucose Min</Text>
              {editingSection === 'diabetes' ? (
                <TextInput
                  style={styles.fieldInput}
                  value={diabetesData.target_glucose_min}
                  onChangeText={(text) => setDiabetesData({...diabetesData, target_glucose_min: text})}
                  placeholder="80"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.fieldValue}>{diabetesData.target_glucose_min} mg/dL</Text>
              )}
            </View>

            <View style={styles.diabetesField}>
              <Text style={styles.fieldLabel}>Target Glucose Max</Text>
              {editingSection === 'diabetes' ? (
                <TextInput
                  style={styles.fieldInput}
                  value={diabetesData.target_glucose_max}
                  onChangeText={(text) => setDiabetesData({...diabetesData, target_glucose_max: text})}
                  placeholder="180"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.fieldValue}>{diabetesData.target_glucose_max} mg/dL</Text>
              )}
            </View>
          </View>

          <View style={styles.diabetesRow}>
            <View style={styles.diabetesField}>
              <Text style={styles.fieldLabel}>Insulin Duration</Text>
              {editingSection === 'diabetes' ? (
                <TextInput
                  style={styles.fieldInput}
                  value={diabetesData.insulin_duration_hours}
                  onChangeText={(text) => setDiabetesData({...diabetesData, insulin_duration_hours: text})}
                  placeholder="4"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.fieldValue}>{diabetesData.insulin_duration_hours} hours</Text>
              )}
            </View>

            <View style={styles.diabetesField}>
              <Text style={styles.fieldLabel}>Insulin Onset</Text>
              {editingSection === 'diabetes' ? (
                <TextInput
                  style={styles.fieldInput}
                  value={diabetesData.insulin_onset_minutes}
                  onChangeText={(text) => setDiabetesData({...diabetesData, insulin_onset_minutes: text})}
                  placeholder="15"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.fieldValue}>{diabetesData.insulin_onset_minutes} minutes</Text>
              )}
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Max Bolus Units</Text>
            {editingSection === 'diabetes' ? (
              <TextInput
                style={styles.fieldInput}
                value={diabetesData.max_bolus_units}
                onChangeText={(text) => setDiabetesData({...diabetesData, max_bolus_units: text})}
                placeholder="10"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.fieldValue}>{diabetesData.max_bolus_units} units</Text>
            )}
            <Text style={styles.helpText}>Safety limit for single dose</Text>
          </View>
        </Card>

        {/* Preferences Section */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            {editingSection === 'preferences' ? (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setEditingSection(null)}
                >
                  <Text style={styles.editButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSavePreferences}
                  disabled={loading}
                >
                  <Text style={styles.editButtonText}>
                    {loading ? 'Saving...' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setEditingSection('preferences')}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Enable Notifications</Text>
            <Switch
              value={preferencesData.notifications_enabled}
              onValueChange={(value) => setPreferencesData({...preferencesData, notifications_enabled: value})}
              disabled={editingSection !== 'preferences'}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Glucose Reminders</Text>
            <Switch
              value={preferencesData.glucose_reminders}
              onValueChange={(value) => setPreferencesData({...preferencesData, glucose_reminders: value})}
              disabled={editingSection !== 'preferences'}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Insulin Reminders</Text>
            <Switch
              value={preferencesData.insulin_reminders}
              onValueChange={(value) => setPreferencesData({...preferencesData, insulin_reminders: value})}
              disabled={editingSection !== 'preferences'}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Meal Reminders</Text>
            <Switch
              value={preferencesData.meal_reminders}
              onValueChange={(value) => setPreferencesData({...preferencesData, meal_reminders: value})}
              disabled={editingSection !== 'preferences'}
            />
          </View>
        </Card>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.dangerButton} onPress={handleSignOut}>
          <Text style={styles.dangerButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
} 