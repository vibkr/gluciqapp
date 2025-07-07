interface OpenFoodFactsProduct {
  code: string;
  product?: {
    product_name?: string;
    brands?: string;
    categories?: string;
    nutriments?: {
      'energy-kcal_100g'?: number;
      'carbohydrates_100g'?: number;
      'fat_100g'?: number;
      'proteins_100g'?: number;
      'fiber_100g'?: number;
      'sugars_100g'?: number;
      'sodium_100g'?: number;
      'salt_100g'?: number;
    };
    allergens_tags?: string[];
    labels_tags?: string[];
    nutrition_grade_fr?: string;
    ecoscore_grade?: string;
    nova_group?: number;
    serving_size?: string;
    image_url?: string;
    image_front_url?: string;
  };
  status: number;
  status_verbose: string;
}

export interface BarcodeNutritionData {
  barcode: string;
  name: string;
  brand?: string;
  category?: string;
  nutrition: {
    calories: number;
    carbohydrates: number;
    fat: number;
    protein: number;
    fiber: number;
    sugar: number;
    sodium: number;
    salt: number;
  };
  allergens: string[];
  labels: string[];
  nutritionGrade?: string;
  ecoScore?: string;
  novaGroup?: number;
  servingSize?: string;
  imageUrl?: string;
  isVegan?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  isDiabetesFriendly?: boolean;
}

class OpenFoodFactsService {
  private readonly baseUrl = 'https://world.openfoodfacts.org/api/v0/product';
  private readonly userAgent = 'GluciQ-DiabetesApp/1.0 (https://gluciq.app)';

  async getProductByBarcode(barcode: string): Promise<BarcodeNutritionData | null> {
    try {
      console.log(`Fetching product data for barcode: ${barcode}`);
      
      const response = await fetch(`${this.baseUrl}/${barcode}.json`, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`OpenFoodFacts API error: ${response.status}`);
        return null;
      }

      const data: OpenFoodFactsProduct = await response.json();
      
      if (data.status !== 1 || !data.product) {
        console.log(`Product not found for barcode: ${barcode}`);
        return null;
      }

      return this.transformProductData(data);
    } catch (error) {
      console.error('Error fetching product from OpenFoodFacts:', error);
      return null;
    }
  }

  private transformProductData(data: OpenFoodFactsProduct): BarcodeNutritionData {
    const product = data.product!;
    const nutriments = product.nutriments || {};
    
    return {
      barcode: data.code,
      name: product.product_name || 'Unknown Product',
      brand: product.brands?.split(',')[0]?.trim(),
      category: this.getMainCategory(product.categories),
      nutrition: {
        calories: Math.round(nutriments['energy-kcal_100g'] || 0),
        carbohydrates: Math.round((nutriments['carbohydrates_100g'] || 0) * 10) / 10,
        fat: Math.round((nutriments['fat_100g'] || 0) * 10) / 10,
        protein: Math.round((nutriments['proteins_100g'] || 0) * 10) / 10,
        fiber: Math.round((nutriments['fiber_100g'] || 0) * 10) / 10,
        sugar: Math.round((nutriments['sugars_100g'] || 0) * 10) / 10,
        sodium: Math.round((nutriments['sodium_100g'] || 0) * 1000) / 1000, // Convert to mg
        salt: Math.round((nutriments['salt_100g'] || 0) * 10) / 10,
      },
      allergens: this.parseAllergens(product.allergens_tags || []),
      labels: this.parseLabels(product.labels_tags || []),
      nutritionGrade: product.nutrition_grade_fr?.toUpperCase(),
      ecoScore: product.ecoscore_grade?.toUpperCase(),
      novaGroup: product.nova_group,
      servingSize: product.serving_size,
      imageUrl: product.image_front_url || product.image_url,
      isVegan: this.checkLabel(product.labels_tags, 'vegan'),
      isVegetarian: this.checkLabel(product.labels_tags, 'vegetarian'),
      isGlutenFree: this.checkLabel(product.labels_tags, 'gluten-free'),
      isDiabetesFriendly: this.assessDiabetesFriendliness(product),
    };
  }

  private getMainCategory(categories?: string): string | undefined {
    if (!categories) return undefined;
    
    const categoryList = categories.split(',').map(c => c.trim());
    // Return the most specific (usually last) category
    return categoryList[categoryList.length - 1] || categoryList[0];
  }

  private parseAllergens(allergenTags: string[]): string[] {
    return allergenTags
      .map(tag => tag.replace(/^en:/, '').replace(/-/g, ' '))
      .filter(allergen => allergen.length > 0);
  }

  private parseLabels(labelTags: string[]): string[] {
    return labelTags
      .map(tag => tag.replace(/^en:/, '').replace(/-/g, ' '))
      .filter(label => label.length > 0);
  }

  private checkLabel(labelTags: string[] = [], targetLabel: string): boolean {
    return labelTags.some(tag => 
      tag.toLowerCase().includes(targetLabel.toLowerCase())
    );
  }

  private assessDiabetesFriendliness(product: any): boolean {
    const nutriments = product.nutriments || {};
    const sugars = nutriments['sugars_100g'] || 0;
    const carbs = nutriments['carbohydrates_100g'] || 0;
    const fiber = nutriments['fiber_100g'] || 0;
    
    // Basic diabetes-friendly criteria
    const lowSugar = sugars < 5; // Less than 5g sugar per 100g
    const reasonableCarbs = carbs < 15; // Less than 15g carbs per 100g
    const highFiber = fiber > 3; // More than 3g fiber per 100g
    
    return lowSugar && (reasonableCarbs || highFiber);
  }

  // Search products by name (useful for manual entry)
  async searchProducts(query: string, limit: number = 10): Promise<BarcodeNutritionData[]> {
    try {
      const searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=1&page_size=${limit}`;
      
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`OpenFoodFacts search error: ${response.status}`);
        return [];
      }

      const data = await response.json();
      
      if (!data.products || !Array.isArray(data.products)) {
        return [];
      }

      return data.products
        .filter((product: any) => product.code && product.product_name)
        .map((product: any) => this.transformProductData({ 
          code: product.code, 
          product, 
          status: 1, 
          status_verbose: 'found' 
        }));
    } catch (error) {
      console.error('Error searching products from OpenFoodFacts:', error);
      return [];
    }
  }

  // Get nutrition facts for a specific serving size
  calculateNutritionForServing(productData: BarcodeNutritionData, servingGrams: number): BarcodeNutritionData {
    const multiplier = servingGrams / 100; // OpenFoodFacts data is per 100g
    
    return {
      ...productData,
      nutrition: {
        calories: Math.round(productData.nutrition.calories * multiplier),
        carbohydrates: Math.round(productData.nutrition.carbohydrates * multiplier * 10) / 10,
        fat: Math.round(productData.nutrition.fat * multiplier * 10) / 10,
        protein: Math.round(productData.nutrition.protein * multiplier * 10) / 10,
        fiber: Math.round(productData.nutrition.fiber * multiplier * 10) / 10,
        sugar: Math.round(productData.nutrition.sugar * multiplier * 10) / 10,
        sodium: Math.round(productData.nutrition.sodium * multiplier * 1000) / 1000,
        salt: Math.round(productData.nutrition.salt * multiplier * 10) / 10,
      },
    };
  }
}

export const openFoodFactsService = new OpenFoodFactsService();
export default openFoodFactsService;