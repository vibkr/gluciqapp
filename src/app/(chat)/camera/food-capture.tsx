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
import { SupabaseImageService } from '../../lib/storage/SupabaseImageService';

// Use the provided test user ID from the database
const TEST_USER_ID = '11111111-1111-1111-1111-111111111111';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const FoodCaptureScreen = observer(function FoodCaptureScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState('');

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
    guidanceOverlay: {
      width: screenWidth * 0.8,
      height: screenHeight * 0.4,
      borderWidth: 3,
      borderColor: '#FFFFFF',
      borderRadius: 20,
      backgroundColor: 'transparent',
      position: 'relative',
      borderStyle: 'dashed',
    },
    guidanceCorners: {
      position: 'absolute',
      width: 30,
      height: 30,
      borderColor: theme.colors.primary,
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
    guidanceTextContainer: {
      position: 'absolute',
      top: -60,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    guidanceText: {
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
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingHorizontal: 40,
      paddingVertical: 30,
      paddingBottom: 50,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    bottomBarSide: {
      width: 60,
      alignItems: 'center',
    },
    captureButtonContainer: {
      alignItems: 'center',
    },
    captureButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 4,
      borderColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    captureButtonDisabled: {
      opacity: 0.6,
      backgroundColor: '#666666',
    },
    captureButtonInner: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#FFFFFF',
    },
    secondaryButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 25,
      padding: 12,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.4)',
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
    progressIndicator: {
      marginTop: 20,
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 20,
    },
    progressText: {
      color: theme.colors.primary,
      fontSize: 14,
      fontWeight: '500',
    },
  });

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Card style={styles.permissionCard}>
          <Ionicons 
            name="camera" 
            size={64} 
            color={theme.colors.primary} 
            style={styles.permissionIcon}
          />
          <Text style={styles.permissionTitle}>
            Camera Access Required
          </Text>
          <Text style={styles.permissionText}>
            GluciQ needs camera access to analyze your food and calculate insulin recommendations. Your photos are processed securely and never shared.
          </Text>
          <Button
            title="Grant Camera Permission"
            onPress={requestPermission}
          />
        </Card>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing || isAnalyzing) return;

    try {
      setIsCapturing(true);
      setAnalysisProgress('Capturing image...');
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });

      setIsCapturing(false);
      setIsAnalyzing(true);
      setAnalysisProgress('Uploading image...');

      console.log('Photo captured:', photo.uri);

      // Save image to Supabase storage first
      let imageUrl = photo.uri;
      let imageId: string | undefined;
      
      try {
        console.log('Starting food image upload:', photo.uri);
        const imageService = new SupabaseImageService();
        const uploadResult = await imageService.uploadFoodImage(photo.uri, TEST_USER_ID);
        if (uploadResult.imageRecord && uploadResult.uploadResult) {
          imageUrl = uploadResult.uploadResult.publicUrl;
          imageId = uploadResult.imageRecord.id;
          console.log('Image uploaded to Supabase:', imageUrl);
        }
      } catch (uploadError) {
        console.error('Failed to upload image to Supabase:', uploadError);
        console.warn('Failed to upload image to Supabase, using local URI:', uploadError);
        // Continue with local URI if upload fails
      }

      setAnalysisProgress('Analyzing food with AI...');

      // Analyze the food using Enhanced Food Analysis Service with the LOCAL image path
      // Always use the local photo.uri for analysis, not the remote URL
      console.log('Starting food analysis for user:', TEST_USER_ID);
      const analysisResult = await enhancedFoodAnalysisService.analyzeImageWithVision(photo.uri);

      if (analysisResult) {
        setAnalysisProgress('Processing results...');
        
        // Navigate to results screen with the analysis data
        router.push({
          pathname: '/analysis/food-results',
          params: {
            analysisData: JSON.stringify(analysisResult),
            imageUrl: imageUrl,
            imageId: imageId,
            source: 'camera',
            userId: TEST_USER_ID
          }
        });
      } else {
        throw new Error('Failed to analyze food image');
      }

    } catch (error) {
      console.error('Error capturing and analyzing photo:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      Alert.alert(
        'Analysis Failed', 
        `Failed to analyze the food image: ${errorMessage}\n\nPlease try again with better lighting and make sure the food is clearly visible.`,
        [
          { text: 'Try Again', onPress: () => {} },
          { text: 'Go Back', onPress: () => router.back() }
        ]
      );
    } finally {
      setIsCapturing(false);
      setIsAnalyzing(false);
      setAnalysisProgress('');
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const openGallery = () => {
    // TODO: Implement gallery selection
    Alert.alert(
      'Coming Soon',
      'Gallery selection will be available in a future update. For now, please use the camera to capture your food.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.overlay}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.back()}
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <Text style={styles.topBarTitle}>Scanner</Text>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={toggleCameraFacing}
            >
              <Ionicons name="camera-reverse" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Center Guidance Area */}
          <View style={styles.centerArea}>
            <View style={styles.guidanceOverlay}>
              {/* Corner indicators */}
              <View style={[styles.guidanceCorners, styles.cornerTopLeft]} />
              <View style={[styles.guidanceCorners, styles.cornerTopRight]} />
              <View style={[styles.guidanceCorners, styles.cornerBottomLeft]} />
              <View style={[styles.guidanceCorners, styles.cornerBottomRight]} />
              
              {/* Guidance text */}
              <View style={styles.guidanceTextContainer}>
                <Text style={styles.guidanceText}>
                  Frame your food in the viewfinder
                </Text>
              </View>
            </View>
            
            <Text style={styles.instructionText}>
              Position your food within the frame for best results.{'\n'}
              Make sure the lighting is good and the food is clearly visible.
            </Text>
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomBar}>
            <View style={styles.bottomBarSide}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={openGallery}
              >
                <Ionicons name="images" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.captureButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.captureButton,
                  (isCapturing || isAnalyzing) && styles.captureButtonDisabled,
                ]}
                onPress={takePicture}
                disabled={isCapturing || isAnalyzing}
              >
                {isCapturing || isAnalyzing ? (
                  <ActivityIndicator size="large" color="#FFFFFF" />
                ) : (
                  <View style={styles.captureButtonInner} />
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.bottomBarSide}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.push('/camera/barcode-scanner')}
              >
                <Ionicons name="barcode" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Processing Overlay */}
          {isAnalyzing && (
            <View style={styles.processingOverlay}>
              <View style={styles.processingContent}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.processingTitle}>
                  Analyzing Your Food
                </Text>
                <Text style={styles.processingText}>
                  Our AI is identifying the food and calculating nutrition information. This may take a few seconds.
                </Text>
                {analysisProgress && (
                  <View style={styles.progressIndicator}>
                    <Text style={styles.progressText}>
                      {analysisProgress}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </CameraView>
    </View>
  );
});

export default FoodCaptureScreen;