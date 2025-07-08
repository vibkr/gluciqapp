import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  TextInput,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/contexts/ThemeContext';
import { Card } from '@/src/components/ui';
import { userStore } from '@/src/stores/userStore';
import { insulinStore } from '@/src/stores/insulinStore';

export default function InsulinScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);
  const [doseAmount, setDoseAmount] = useState('');
  const [doseType, setDoseType] = useState<'meal' | 'correction' | 'basal'>('meal');
  const [notes, setNotes] = useState('');
  
  // Get current user profile
  const currentProfile = userStore.profile.get();
  const insulinHistory = insulinStore.recentDoses.get();

  useEffect(() => {
    const loadInsulinData = async () => {
      if (!currentProfile?.id) {
        setLoading(false);
        return;
      }

      try {
        // Load insulin history
        // await insulinActions.refreshHistory(currentProfile.id);
      } catch (error) {
        console.error('Error loading insulin data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInsulinData();
  }, [currentProfile?.id]);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'log_insulin':
        setShowLogModal(true);
        break;
      case 'scan_food':
        router.push('/camera/food-capture');
        break;
      default:
        Alert.alert('Coming Soon', 'This feature is being developed.');
    }
  };

  const handleLogInsulin = async () => {
    if (!doseAmount || isNaN(parseFloat(doseAmount))) {
      Alert.alert('Invalid Input', 'Please enter a valid dose amount.');
      return;
    }

    try {
      // Log insulin dose
      const dose = {
        user_id: currentProfile?.id,
        dose_type: doseType,
        user_final_dose: parseFloat(doseAmount),
        calculated_dose: parseFloat(doseAmount),
        notes: notes || undefined,
        timestamp: new Date(),
      };

      // await insulinActions.logDose(dose);
      
      Alert.alert('Success', 'Insulin dose logged successfully.');
      setShowLogModal(false);
      setDoseAmount('');
      setNotes('');
    } catch (error) {
      console.error('Error logging insulin:', error);
      Alert.alert('Error', 'Failed to log insulin dose. Please try again.');
    }
  };

  const renderInsulinItem = ({ item }: { item: any }) => (
    <Card style={styles.insulinItem}>
      <View style={styles.insulinHeader}>
        <Ionicons 
          name="medical" 
          size={24} 
          color={theme.colors.primary} 
        />
        <View style={styles.insulinInfo}>
          <Text style={styles.insulinTitle}>
            {item.dose_type?.charAt(0).toUpperCase() + item.dose_type?.slice(1)} Dose
          </Text>
          <Text style={styles.insulinSubtitle}>
            {item.user_final_dose || item.calculated_dose} units
          </Text>
        </View>
        <Text style={styles.insulinDate}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
      
      {item.notes && (
        <Text style={styles.insulinNotes}>{item.notes}</Text>
      )}
      
      {item.carbohydrates && (
        <Text style={styles.insulinCarbs}>
          For {item.carbohydrates}g carbs
        </Text>
      )}
    </Card>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    quickActionsContainer: {
      flexDirection: 'row',
      gap: 8,
    },
    quickActionButton: {
      backgroundColor: theme.colors.primary,
      padding: 8,
      borderRadius: 8,
      minWidth: 44,
      alignItems: 'center',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    statsContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 20,
    },
    statCard: {
      flex: 1,
      padding: 16,
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 16,
    },
    insulinItem: {
      marginBottom: 12,
      padding: 16,
    },
    insulinHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    insulinInfo: {
      flex: 1,
      marginLeft: 12,
    },
    insulinTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 4,
    },
    insulinSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    insulinDate: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    insulinNotes: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      fontStyle: 'italic',
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    insulinCarbs: {
      fontSize: 14,
      color: theme.colors.primary,
      marginTop: 4,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyStateIcon: {
      marginBottom: 16,
    },
    emptyStateText: {
      fontSize: 18,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 8,
    },
    emptyStateSubtext: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
    },
    emptyStateButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    emptyStateButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 24,
      width: '90%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 20,
      textAlign: 'center',
    },
    inputGroup: {
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
    },
    textInput: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
    },
    doseTypeContainer: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 16,
    },
    doseTypeButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
    },
    activeDoseType: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    doseTypeText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    activeDoseTypeText: {
      color: '#FFFFFF',
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 20,
    },
    modalButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    confirmButton: {
      backgroundColor: theme.colors.primary,
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    cancelButtonText: {
      color: theme.colors.text,
    },
    confirmButtonText: {
      color: '#FFFFFF',
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.text, marginTop: 16 }}>
          Loading insulin data...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with quick actions */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Insulin Management</Text>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleQuickAction('log_insulin')}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleQuickAction('scan_food')}
          >
            <Ionicons name="camera" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Daily Stats */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Today's Doses</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Total Units</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Avg per Day</Text>
          </Card>
        </View>

        {/* Recent Insulin History */}
        <Text style={styles.sectionTitle}>Recent Insulin History</Text>
        
        {insulinHistory.length > 0 ? (
          <FlatList
            data={insulinHistory}
            renderItem={renderInsulinItem}
            keyExtractor={(item, index) => item.id || index.toString()}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="medical-outline"
              size={64}
              color={theme.colors.textSecondary}
              style={styles.emptyStateIcon}
            />
            <Text style={styles.emptyStateText}>No insulin doses logged yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start tracking your insulin doses to see them here
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => handleQuickAction('log_insulin')}
            >
              <Text style={styles.emptyStateButtonText}>Log First Dose</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Log Insulin Modal */}
      <Modal
        visible={showLogModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Log Insulin Dose</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Dose Amount (units)</Text>
              <TextInput
                style={styles.textInput}
                value={doseAmount}
                onChangeText={setDoseAmount}
                placeholder="Enter dose amount"
                keyboardType="numeric"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Dose Type</Text>
              <View style={styles.doseTypeContainer}>
                {(['meal', 'correction', 'basal'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.doseTypeButton,
                      doseType === type && styles.activeDoseType,
                    ]}
                    onPress={() => setDoseType(type)}
                  >
                    <Text
                      style={[
                        styles.doseTypeText,
                        doseType === type && styles.activeDoseTypeText,
                      ]}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Notes (optional)</Text>
              <TextInput
                style={styles.textInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes about this dose"
                multiline
                numberOfLines={2}
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogModal(false)}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleLogInsulin}
              >
                <Text style={[styles.modalButtonText, styles.confirmButtonText]}>
                  Log Dose
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
} 