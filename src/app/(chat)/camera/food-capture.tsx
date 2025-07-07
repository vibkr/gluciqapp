import React, { useRef, useState } from 'react';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FoodAnalysisPipeline } from '@/src/lib/services/FoodAnalysisPipeline';
import { userStore } from '@/src/stores/userStore';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function FoodCaptureScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const foodPipeline = new FoodAnalysisPipeline();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing || isAnalyzing) return;
    
    try {
      setIsCapturing(true);
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      
      if (photo?.uri) {
        console.log('Photo captured:', photo.uri);
        setIsCapturing(false);
        setIsAnalyzing(true);
        
        // Get current user
        const currentProfile = userStore.profile.get();
        if (!currentProfile) {
          Alert.alert('Error', 'User profile not found. Please complete onboarding first.');
          return;
        }

        // Run complete food analysis pipeline
        const result = await foodPipeline.analyzeFoodImage(
          photo.uri,
          currentProfile.id,
          {
            image_width: photo.width,
            image_height: photo.height,
            capture_location_lat: null, // Could add GPS if needed
            capture_location_lng: null
          }
        );

        if (result.success) {
          // Navigate to results page with analysis data
          router.push({
            pathname: '/analysis/food-results',
            params: {
              analysisId: result.analysisResult.id,
              imageId: result.imageRecord.id,
              totalCarbs: result.insulinCalculation.carb_dose.units * result.insulinCalculation.carb_dose.ratio_used,
              recommendedDose: result.insulinCalculation.total_recommendation.units,
              confidence: result.insulinCalculation.total_recommendation.confidence_level
            }
          });
        } else {
          Alert.alert(
            'Analysis Failed',
            result.error || 'Failed to analyze food image. Please try again.',
            [
              { text: 'Try Again', style: 'default' },
              { text: 'Go Back', onPress: () => router.back(), style: 'cancel' }
            ]
          );
        }
      }
    } catch (error) {
      console.error('Error in food capture process:', error);
      Alert.alert('Error', 'Failed to process food image. Please try again.');
    } finally {
      setIsCapturing(false);
      setIsAnalyzing(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <CameraView 
        ref={cameraRef}
        style={styles.camera} 
        facing={facing}
      >
        <View style={styles.overlay}>
          {/* Header with close button */}
          <SafeAreaView style={styles.header}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => router.back()}
              disabled={isAnalyzing}
            >
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>Scan Food</Text>
            <TouchableOpacity 
              style={styles.flipButton}
              onPress={toggleCameraFacing}
              disabled={isAnalyzing}
            >
              <Ionicons name="camera-reverse" size={30} color="white" />
            </TouchableOpacity>
          </SafeAreaView>

          {/* Camera guide overlay */}
          <View style={styles.centerGuide}>
            <View style={styles.frameGuide}>
              <Text style={styles.guideText}>
                {isAnalyzing ? 'Analyzing food...' : 'Center your food in the frame'}
              </Text>
            </View>
          </View>

          {/* Bottom controls */}
          <View style={styles.controls}>
            <Text style={styles.instructionText}>
              {isAnalyzing 
                ? 'Please wait while we analyze your food and calculate insulin...'
                : 'Position food clearly in the frame and tap to capture'
              }
            </Text>
            
            <View style={styles.captureButtonContainer}>
              <TouchableOpacity 
                style={[
                  styles.captureButton, 
                  (isCapturing || isAnalyzing) && styles.captureButtonDisabled
                ]}
                onPress={takePicture}
                disabled={isCapturing || isAnalyzing}
              >
                {(isCapturing || isAnalyzing) ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                  <View style={styles.captureButtonInner} />
                )}
              </TouchableOpacity>
            </View>
            
            {isAnalyzing && (
              <Text style={styles.analysisText}>
                🔍 Analyzing food with AI...
              </Text>
            )}
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  closeButton: {
    padding: 10,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  flipButton: {
    padding: 10,
  },
  centerGuide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameGuide: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  guideText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  controls: {
    paddingBottom: 50,
    alignItems: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 40,
  },
  captureButtonContainer: {
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  analysisText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
});