import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';

// Structured response interfaces
export interface NutritionAnalysis {
  analysis: {
    confidence: number; // 0-100
    processing_time: number;
    image_quality: 'excellent' | 'good' | 'fair' | 'poor';
  };
  foods: {
    id: string;
    name: string;
    category: string;
    portion: {
      amount: number;
      unit: 'grams' | 'ml' | 'pieces';
      confidence: number;
    };
    nutrition: {
      calories: number;
      carbohydrates: number;  // CRITICAL for insulin calc
      fat: number;
      protein: number;
      fiber: number;
      sugar: number;
      confidence: number;
    };
    glycemic_info: {
      glycemic_index: number;
      glycemic_load: number;
      estimated_bg_impact: 'low' | 'medium' | 'high';
    };
    preparation_notes?: string;
    uncertainty_flags?: string[];
  }[];
  recommendations: {
    total_carbs: number;
    estimated_portions: string;
    meal_complexity: 'simple' | 'moderate' | 'complex';
    user_verification_needed: boolean;
  };
}

class GeminiVisionService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    const apiKey = Constants.expoConfig?.extra?.GOOGLE_GEMINI_API_KEY || 'AIzaSyAtXTnLzyoNFQjuT1QMatG5ay0_Og5Pb3w';
    
    if (!apiKey) {
      console.error('Google Gemini API key not found in environment variables');
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      
      // Use Gemini 2.5 Flash Preview model for better food analysis
      this.model = this.genAI.getGenerativeModel({
        model: "gemini-2.5-flash-preview-05-20",
        generationConfig: {
          temperature: 0.1, // Low temperature for consistent nutrition analysis
          topK: 1,
          topP: 0.1,
          maxOutputTokens: 8192, // Increased limit to handle complex food analysis
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      });

      console.log('Gemini Vision Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gemini Vision Service:', error);
    }
  }

  private get nutritionAnalysisPrompt(): string {
    return `You are a nutrition expert analyzing food images for diabetic patients.
Analyze this image and return ONLY valid JSON with the exact schema provided.

REQUIREMENTS:
- Identify the COMPLETE MEAL with proper descriptive names (e.g., "Chicken Burger", "South Indian Thali", "Chole Bhature")
- Understand the WHOLE MEAL context, not just individual components
- For Indian meals, identify complete dishes like "Chole Bhature", "Dosa with Sambar", "Biryani", etc.
- For Western meals, identify complete dishes like "Chicken Burger with Fries", "Pasta Carbonara", etc.
- Estimate portion sizes in grams (be conservative and realistic)
- Calculate precise carbohydrates, fats, protein per item
- Provide confidence scores (0-100) for each estimate
- Include glycemic index estimates where applicable
- Flag any uncertainty or multiple possible foods
- Focus especially on carbohydrate content as it's critical for insulin dosing

CRITICAL RULES:
1. Response must be valid JSON only, no explanations or markdown
2. If you can't identify food clearly, set confidence low and add uncertainty flags
3. Carbohydrate estimates must be as accurate as possible - diabetic safety depends on this
4. Include preparation method impact (fried vs baked affects carbs/fats)
5. Consider portion size context (plate size, utensils, hands for scale)
6. ALWAYS provide descriptive, recognizable food names that users would understand

FOOD CATEGORIES - Use ONLY these exact categories:
- "grains" (rice, bread, pasta, cereals, wheat products, oats, quinoa)
- "vegetables" (all vegetables, greens, herbs, salads)
- "fruits" (fresh fruits, berries, dried fruits, fruit juices)
- "proteins" (meat, fish, poultry, eggs, beans, nuts, seeds, tofu)
- "dairy" (milk, cheese, yogurt, butter, cream, ice cream)
- "packaged_food" (processed/packaged items, canned goods, frozen meals)
- "beverages" (drinks, juices, sodas, water, tea, coffee, alcohol)
- "sweets" (desserts, candy, chocolate, sugary items, pastries)
- "snacks" (chips, crackers, bars, popcorn)
- "mixed_meal" (combination dishes, recipes with multiple components)
- "unknown" (if you cannot identify the food clearly)

JSON Schema (follow exactly):
{
  "analysis": {
    "confidence": number, // 0-100 overall confidence
    "processing_time": 0, // will be calculated automatically
    "image_quality": "excellent" | "good" | "fair" | "poor"
  },
  "foods": [
    {
      "id": string, // unique identifier like "food_001"
      "name": string, // specific food name
      "category": string, // MUST be one of the categories above
      "portion": {
        "amount": number, // portion in grams (be realistic)
        "unit": "grams" | "ml" | "pieces",
        "confidence": number // 0-100 confidence in portion estimate
      },
      "nutrition": {
        "calories": number,
        "carbohydrates": number, // CRITICAL - in grams, be precise
        "fat": number, // in grams
        "protein": number, // in grams
        "fiber": number, // in grams
        "sugar": number, // in grams
        "confidence": number // 0-100 confidence in nutrition data
      },
      "glycemic_info": {
        "glycemic_index": number, // 0-100 scale
        "glycemic_load": number,
        "estimated_bg_impact": "low" | "medium" | "high"
      },
      "preparation_notes": string, // optional cooking method/preparation
      "uncertainty_flags": string[] // optional uncertainty warnings
    }
  ],
  "recommendations": {
    "total_carbs": number, // sum of all carbohydrates
    "estimated_portions": string, // human readable portion description
    "meal_complexity": "simple" | "moderate" | "complex",
    "user_verification_needed": boolean // true if low confidence
  }
}

EXAMPLES:
- If you see rice: category="grains", estimate portion conservatively
- If you see mixed curry: category="mixed_meal", break down components if possible
- If unclear: set confidence low, add uncertainty_flags, category="unknown"

Return valid JSON only. No explanations, no markdown formatting.`;
  }

  async analyzeFood(imagePath: string): Promise<NutritionAnalysis | null> {
    if (!this.model) {
      throw new Error('Gemini Vision Service not initialized. Check API key.');
    }

    try {
      const startTime = Date.now();
      
      // Read image file and convert to base64
      const imageData = await this.convertImageToBase64(imagePath);
      
      const imagePart = {
        inlineData: {
          data: imageData,
          mimeType: "image/jpeg"
        }
      };

      console.log('Sending image to Gemini Vision API...');
      
      const result = await this.model.generateContent([
        this.nutritionAnalysisPrompt,
        imagePart
      ]);

      const response = await result.response;
      const text = response.text();
      
      console.log('Raw Gemini response:', text);

      // Parse JSON response
      let parsedResponse: NutritionAnalysis;
      try {
        // Clean the response to ensure it's valid JSON
        const cleanedText = text.replace(/```json\s*|\s*```/g, '').trim();
        
        // Check if response appears truncated
        if (!cleanedText.endsWith('}') && !cleanedText.endsWith(']')) {
          console.warn('Response appears truncated, attempting to fix...');
          console.log('Truncated response length:', cleanedText.length);
          throw new Error('Response was truncated - try reducing image complexity or size');
        }
        
        parsedResponse = JSON.parse(cleanedText);
        
        // Validate essential fields exist
        if (!parsedResponse.analysis || !parsedResponse.foods || !parsedResponse.recommendations) {
          throw new Error('Response missing required fields');
        }
        
      } catch (parseError) {
        console.error('Failed to parse Gemini response as JSON:', parseError);
        console.error('Response text length:', text.length);
        console.error('First 500 chars:', text.substring(0, 500));
        console.error('Last 500 chars:', text.substring(Math.max(0, text.length - 500)));
        
        const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown parsing error';
        
        if (text.length > 7000) {
          throw new Error('Response too long and likely truncated - try a simpler image');
        } else {
          throw new Error(`Invalid JSON response from Gemini API: ${errorMessage}`);
        }
      }

      // Add processing time
      parsedResponse.analysis.processing_time = Date.now() - startTime;

      console.log('Gemini analysis completed:', parsedResponse);
      return parsedResponse;

    } catch (error) {
      console.error('Error analyzing food with Gemini Vision:', error);
      throw error;
    }
  }

  private async convertImageToBase64(imagePath: string): Promise<string> {
    try {
      // Use expo-file-system to read the file as base64 (compatible with Expo Go)
      const base64String = await FileSystem.readAsStringAsync(imagePath, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64String;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw new Error('Failed to process image file');
    }
  }

  // Test connection to Gemini API
  async testConnection(): Promise<boolean> {
    if (!this.model) {
      return false;
    }

    try {
      const result = await this.model.generateContent("Test connection");
      await result.response;
      return true;
    } catch (error) {
      console.error('Gemini API connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const geminiVisionService = new GeminiVisionService();
export default geminiVisionService;