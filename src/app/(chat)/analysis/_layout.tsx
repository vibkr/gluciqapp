import { Stack } from 'expo-router';

export default function AnalysisLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="food-results" 
        options={{ 
          headerShown: false,
          title: 'Food Results' 
        }} 
      />
    </Stack>
  );
} 