// Simple test for Google Gemini Vision API
import { GoogleGenerativeAI } from '@google/generative-ai';
import Constants from 'expo-constants';

export async function testGeminiAPI(): Promise<boolean> {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || Constants.expoConfig?.extra?.googleGeminiApiKey;
    
    if (!apiKey) {
      console.error('Google Gemini API key not found');
      return false;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Simple test prompt
    const result = await model.generateContent('Hello, can you respond with "API working" if you receive this?');
    const response = await result.response;
    const text = response.text();
    
    console.log('Gemini API test response:', text);
    return text.toLowerCase().includes('api working');
    
  } catch (error) {
    console.error('Gemini API test failed:', error);
    return false;
  }
}

export async function testGeminiVisionAPI(): Promise<boolean> {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || Constants.expoConfig?.extra?.googleGeminiApiKey;
    
    if (!apiKey) {
      console.error('Google Gemini API key not found');
      return false;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

    console.log('Gemini Vision API configured successfully');
    return true;
    
  } catch (error) {
    console.error('Gemini Vision API test failed:', error);
    return false;
  }
}