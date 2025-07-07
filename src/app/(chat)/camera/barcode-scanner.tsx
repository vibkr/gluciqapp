import { Ionicons } from '@expo/vector-icons';
import { observer } from '@legendapp/state/react';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Button, Card } from '../../components/ui';
import { useTheme } from '../../contexts/ThemeContext';
import { enhancedFoodAnalysisService } from '../../lib/ai/EnhancedFoodAnalysisService';

// Use the provided test user ID from the database
const TEST_USER_ID = '11111111-1111-1111-1111-111111111111';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const BarcodeScannerScreen = observer(function BarcodeScannerScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
    },
    camera: {
      flex: 1,
    },
    overlay: {
      flex: 1,
      backgroundColor: 'transparent',
      justifyContent: 'space-between',
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    topBarTitle: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600',
    },
    actionButton: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: 25,
      padding: 12,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    centerArea: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    scanningOverlay: {
      width: screenWidth * 0.8,
      height: screenHeight * 0.3,
      borderWidth: 3,
      borderColor: theme.colors.primary,
      borderRadius: 20,
      backgroundColor: 'transparent',
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
    },
    scanningCorners: {
      position: 'absolute',
      width: 30,
      height: 30,
      borderColor: '#FFFFFF',
      borderWidth: 4,
    },
    cornerTopLeft: {
      top: -2,
      left: -2,
      borderRightWidth: 0,
      borderBottomWidth: 0,
      borderTopLeftRadius: 20,
    },
    cornerTopRight: {
      top: -2,
      right: -2,
      borderLeftWidth: 0,
      borderBottomWidth: 0,
      borderTopRightRadius: 20,
    },
    cornerBottomLeft: {
      bottom: -2,
      left: -2,
      borderRightWidth: 0,
      borderTopWidth: 0,
      borderBottomLeftRadius: 20,
    },
    cornerBottomRight: {
      bottom: -2,
      right: -2,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      borderBottomRightRadius: 20,
    },
    scanningTextContainer: {
      position: 'absolute',
      top: -60,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    scanningText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      overflow: 'hidden',
    },
    instructionText: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: 14,
      textAlign: 'center',
      marginTop: 20,
      paddingHorizontal: 20,
      lineHeight: 20,
    },
    bottomBar: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
      paddingVertical: 30,
      paddingBottom: 50,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    resetButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 25,
      borderWidth: 2,
      borderColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    resetButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    permissionCard: {
      margin: 20,
      padding: 30,
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
    },
    permissionIcon: {
      marginBottom: 20,
    },
    permissionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 12,
    },
    permissionText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 22,
    },
    processingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    processingContent: {
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    processingTitle: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: '600',
      textAlign: 'center',
      marginTop: 20,
      marginBottom: 8,
    },
    processingText: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 22,
    },
  });

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Card style={styles.permissionCard}>
          <Ionicons 
            name="barcode" 
            size={64} 
            color={theme.colors.primary} 
            style={styles.permissionIcon}
          />
          <Text style={styles.permissionTitle}>
            Camera Access Required
          </Text>
          <Text style={styles.permissionText}>
            GluciQ needs camera access to scan product barcodes and get instant nutrition information. Your camera data is processed securely and never shared.
          </Text>
          <Button
            title="Grant Camera Permission"
            onPress={requestPermission}
          />
        </Card>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned || isProcessing) return;
    
    setScanned(true);
    setIsProcessing(true);
    
    try {
      console.log(`Barcode scanned: ${data} (Type: ${type})`);
      
      // Use Enhanced Food Analysis Service to process the barcode
      const analysisResult = await enhancedFoodAnalysisService.analyzeBarcodeWithOpenFoodFacts(data);
      
      if (analysisResult) {
        // Navigate to results screen with the analysis data
        router.push({
          pathname: '/analysis/food-results',
          params: {
            analysisData: JSON.stringify(analysisResult),
            source: 'barcode',
            userId: TEST_USER_ID
          }
        });
      } else {
        Alert.alert(
          'Product Not Found',
          `Barcode: ${data}\n\nThis product was not found in our database. Would you like to take a photo instead?`,
          [
            { text: 'Try Again', onPress: () => { setScanned(false); setIsProcessing(false); } },
            { text: 'Take Photo', onPress: () => router.push('/camera/food-capture') }
          ]
        );
      }
    } catch (error) {
      console.error('Error processing barcode:', error);
      Alert.alert(
        'Error Processing Barcode',
        'Failed to analyze the barcode. Please try again or take a photo instead.',
        [
          { text: 'Try Again', onPress: () => { setScanned(false); setIsProcessing(false); } },
          { text: 'Take Photo', onPress: () => router.push('/camera/food-capture') }
        ]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'pdf417', 'aztec', 'ean13', 'ean8', 'upc_a', 'upc_e', 'code39', 'code93', 'code128', 'codabar', 'itf14'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.back()}
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <Text style={styles.topBarTitle}>Barcode Scanner</Text>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={toggleCameraFacing}
            >
              <Ionicons name="camera-reverse" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Center Scanning Area */}
          <View style={styles.centerArea}>
            <View style={styles.scanningOverlay}>
              {/* Corner indicators */}
              <View style={[styles.scanningCorners, styles.cornerTopLeft]} />
              <View style={[styles.scanningCorners, styles.cornerTopRight]} />
              <View style={[styles.scanningCorners, styles.cornerBottomLeft]} />
              <View style={[styles.scanningCorners, styles.cornerBottomRight]} />
              
              {/* Scanning text */}
              <View style={styles.scanningTextContainer}>
                <Text style={styles.scanningText}>
                  {scanned ? 'Barcode Scanned!' : 'Point camera at barcode'}
                </Text>
              </View>
            </View>
            
            <Text style={styles.instructionText}>
              Position the barcode within the frame for best results.{'\n'}
              Make sure the barcode is clearly visible and well-lit.
            </Text>
          </View>

          {/* Bottom Controls */}
          {scanned && !isProcessing && (
            <View style={styles.bottomBar}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => setScanned(false)}
              >
                <Text style={styles.resetButtonText}>
                  Scan Again
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Processing Overlay */}
          {isProcessing && (
            <View style={styles.processingOverlay}>
              <View style={styles.processingContent}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.processingTitle}>
                  Processing Barcode
                </Text>
                <Text style={styles.processingText}>
                  Looking up product information and nutrition data. This may take a few seconds.
                </Text>
              </View>
            </View>
          )}
        </View>
      </CameraView>
    </View>
  );
});

export default BarcodeScannerScreen;