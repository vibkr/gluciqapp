import { Stack } from 'expo-router';

export default function CameraLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="food-capture" 
        options={{ 
          headerShown: false,
          title: 'Food Capture' 
        }} 
      />
      <Stack.Screen 
        name="barcode-scanner" 
        options={{ 
          headerShown: false,
          title: 'Barcode Scanner' 
        }} 
      />
    </Stack>
  );
} 