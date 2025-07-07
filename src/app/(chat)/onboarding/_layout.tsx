import { Stack } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function OnboardingLayout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: styles.content,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="welcome" />
        <Stack.Screen name="basic-profile" />
        <Stack.Screen name="diabetes-type" />
        <Stack.Screen name="medical-settings" />
        <Stack.Screen name="preferences" />
        <Stack.Screen name="completion" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    backgroundColor: '#000000',
  },
}); 