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
  const [analysisStep, setAnalysisStep] = useState('');
  const [analysisProgress, setAnalysisProgress] = useState(0);

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
        setAnalysisStep('Preparing image...');
        setAnalysisProgress(10);
        
        // Get current user
        const currentProfile = userStore.profile.get();
        if (!currentProfile) {
          Alert.alert('Error', 'User profile not found. Please complete onboarding first.');
          return;
        }

        // Update progress
        setAnalysisStep('Uploading image...');
        setAnalysisProgress(25);
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setAnalysisStep('Analyzing food with AI...');
        setAnalysisProgress(50);

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
        
        setAnalysisStep('Calculating nutrition...');
        setAnalysisProgress(85);

        if (result.success) {
          // Navigate to results page with analysis data
          // The food-results screen expects analysisData as a FoodAnalysisResult JSON string
          // We need to format the raw_response from the pipeline result to match the expected format
          const rawAnalysis = result.analysisResult.raw_response;
          
          // Convert raw Gemini response to FoodAnalysisResult format
          const formattedAnalysisData = {
            source: 'vision',
            confidence: rawAnalysis.analysis.confidence,
            processingTime: rawAnalysis.analysis.processing_time,
            visionAnalysis: rawAnalysis,
            foods: rawAnalysis.foods.map((food: any) => ({
              ...food,
              allergens: [],
              isDiabetesFriendly: food.nutrition.sugar < 5 && (food.nutrition.carbohydrates < 15 || food.nutrition.fiber > 3),
            })),
            recommendations: {
              ...rawAnalysis.recommendations,
              total_calories: rawAnalysis.foods.reduce((sum: number, food: any) => sum + food.nutrition.calories, 0),
              diabetes_notes: rawAnalysis.foods.some((food: any) => food.glycemic_info.estimated_bg_impact === 'high') 
                ? ['This meal contains high glycemic impact foods - monitor blood sugar closely']
                : []
            }
          };
          
          router.push({
            pathname: '/analysis/food-results',
            params: {
              analysisData: JSON.stringify(formattedAnalysisData),
              imageUrl: result.imageRecord.storage_url,
              userId: currentProfile.id
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
      setAnalysisStep('');
      setAnalysisProgress(0);
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
              <View style={styles.analysisContainer}>
                <Text style={styles.analysisText}>
                  {analysisStep || '🔍 Analyzing food with AI...'}
                </Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${analysisProgress}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {analysisProgress}%
                  </Text>
                </View>
              </View>
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
  analysisContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: 15,
    width: 200,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  progressText: {
    color: 'white',
    fontSize: 12,
    marginTop: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
});