import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import 'react-native-get-random-values';
import { supabaseClientManager } from '../database';

export interface ImageUploadResult {
  url: string;
  path: string;
  publicUrl: string;
}

export interface FoodImageMetadata {
  id?: string;
  user_id: string;
  original_filename: string;
  file_size: number;
  mime_type: string;
  image_width?: number;
  image_height?: number;
  capture_location_lat?: number;
  capture_location_lng?: number;
  capture_timestamp?: string;
}

class SupabaseImageService {
  private readonly BUCKET_NAME = 'food-images';
  private supabaseClient: any;

  constructor(supabaseClient?: any) {
    // Use the food_analysis schema client from the client manager
    if (supabaseClient) {
      this.supabaseClient = supabaseClient;
    } else if (supabaseClientManager.isAvailable) {
      this.supabaseClient = supabaseClientManager.foodAnalysis;
    } else {
      console.warn('SupabaseImageService: No Supabase client available. Image operations will fail.');
    }
  }
  
  /**
   * Upload image to Supabase Storage and save metadata to database
   */
  async uploadFoodImage(
    imageUri: string, 
    userId: string, 
    metadata: Partial<FoodImageMetadata> = {}
  ): Promise<{ imageRecord: any; uploadResult: ImageUploadResult }> {
    try {
      console.log('Starting food image upload:', imageUri);
      
      // Read image file info
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (!fileInfo.exists) {
        throw new Error('Image file does not exist');
      }

      // Read image as base64
      const base64Data = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Get file extension and MIME type
      const fileExtension = this.getFileExtension(imageUri);
      const mimeType = this.getMimeType(fileExtension);
      
      // Generate unique filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const fileName = `${userId}/${timestamp}-${randomSuffix}.${fileExtension}`;

      // Upload to Supabase Storage
      console.log('Uploading to storage bucket:', fileName);
      const { data: uploadData, error: uploadError } = await this.supabaseClient.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, decode(base64Data), {
          contentType: mimeType,
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = this.supabaseClient.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(fileName);

      if (!urlData?.publicUrl) {
        throw new Error('Failed to get public URL for uploaded image');
      }

      const uploadResult: ImageUploadResult = {
        url: urlData.publicUrl,
        path: fileName,
        publicUrl: urlData.publicUrl,
      };

      // Save image metadata to database (using simple table name since schema is configured)
      const imageMetadata = {
        user_id: userId,
        original_filename: metadata.original_filename || `food-${timestamp}.${fileExtension}`,
        file_size_bytes: fileInfo.size || 0,
        mime_type: mimeType,
        width: metadata.image_width,
        height: metadata.image_height,
        storage_url: urlData.publicUrl,
        storage_path: fileName,
        taken_at: metadata.capture_timestamp || new Date().toISOString(),
        location_data: metadata.capture_location_lat && metadata.capture_location_lng ? {
          latitude: metadata.capture_location_lat,
          longitude: metadata.capture_location_lng
        } : null,
      };

      console.log('Saving image metadata to database:', imageMetadata);
      
      const { data: imageRecord, error: dbError } = await this.supabaseClient
        .from('food_images')
        .insert(imageMetadata)
        .select()
        .single();

      if (dbError) {
        console.error('Database insert error:', dbError);
        // Try to cleanup uploaded file
        await this.deleteImage(fileName);
        throw new Error(`Failed to save image metadata: ${dbError.message}`);
      }

      console.log('Food image upload completed successfully:', imageRecord.id);
      return { imageRecord, uploadResult };

    } catch (error) {
      console.error('Error uploading food image:', error);
      throw error;
    }
  }

  /**
   * Delete image from storage and database
   */
  async deleteFoodImage(imageId: string, userId: string): Promise<void> {
    try {
      console.log('Deleting food image:', imageId);

      // Get image record from database
      const { data: imageRecord, error: fetchError } = await this.supabaseClient
        .from('food_images')
        .select('storage_path, user_id')
        .eq('id', imageId)
        .eq('user_id', userId) // Ensure user owns the image
        .single();

      if (fetchError || !imageRecord) {
        throw new Error('Image not found or access denied');
      }

      // Delete from storage
      const { error: storageError } = await this.supabaseClient.storage
        .from(this.BUCKET_NAME)
        .remove([imageRecord.storage_path]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
        // Continue with database deletion even if storage fails
      }

      // Mark as deleted in database (soft delete) - update processing status
      const { error: dbError } = await this.supabaseClient
        .from('food_images')
        .update({ 
          processing_status: 'failed',
          error_message: 'Deleted by user'
        })
        .eq('id', imageId)
        .eq('user_id', userId);

      if (dbError) {
        throw new Error(`Failed to delete image record: ${dbError.message}`);
      }

      console.log('Food image deleted successfully');
    } catch (error) {
      console.error('Error deleting food image:', error);
      throw error;
    }
  }

  /**
   * Get user's food images
   */
  async getUserFoodImages(
    userId: string, 
    limit: number = 20, 
    offset: number = 0
  ): Promise<any[]> {
    try {
      const { data, error } = await this.supabaseClient
        .from('food_images')
        .select('*')
        .eq('user_id', userId)
        .neq('processing_status', 'failed')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new Error(`Failed to fetch food images: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching user food images:', error);
      throw error;
    }
  }

  /**
   * Update image processing status
   */
  async updateProcessingStatus(
    imageId: string,
    status: {
      is_processed?: boolean;
      processing_started_at?: string;
      processing_completed_at?: string;
      processing_error?: string;
    }
  ): Promise<void> {
    try {
      const { error } = await this.supabaseClient
        .from('food_images')
        .update(status)
        .eq('id', imageId);

      if (error) {
        throw new Error(`Failed to update processing status: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating processing status:', error);
      throw error;
    }
  }

  /**
   * Get signed URL for temporary access
   */
  async getSignedUrl(imagePath: string, expiresIn: number = 3600): Promise<string> {
    try {
      console.log('Creating signed URL for path:', imagePath);
      
      // First check if the object exists
      const { data: listData, error: listError } = await this.supabaseClient.storage
        .from(this.BUCKET_NAME)
        .list(imagePath.substring(0, imagePath.lastIndexOf('/')), {
          limit: 1000,
          search: imagePath.substring(imagePath.lastIndexOf('/') + 1)
        });

      if (listError) {
        console.error('Error checking object existence:', listError);
      }

      if (!listData || listData.length === 0) {
        console.warn('Object not found in storage:', imagePath);
        throw new Error('Object not found');
      }

      const { data, error } = await this.supabaseClient.storage
        .from(this.BUCKET_NAME)
        .createSignedUrl(imagePath, expiresIn);

      if (error) {
        console.error('Error creating signed URL:', error);
        throw new Error(`Failed to create signed URL: ${error.message}`);
      }

      if (!data?.signedUrl) {
        throw new Error('No signed URL returned from storage');
      }

      console.log('Successfully created signed URL');
      return data.signedUrl;
    } catch (error) {
      console.error('Error creating signed URL:', error);
      throw error;
    }
  }

  /**
   * Helper method to delete image from storage (internal use)
   */
  private async deleteImage(imagePath: string): Promise<void> {
    try {
      await this.supabaseClient.storage
        .from(this.BUCKET_NAME)
        .remove([imagePath]);
    } catch (error) {
      console.error('Error deleting image from storage:', error);
      // Don't throw - this is cleanup
    }
  }

  /**
   * Get file extension from URI
   */
  private getFileExtension(uri: string): string {
    const match = uri.match(/\.([^.]+)$/);
    return match ? match[1].toLowerCase() : 'jpg';
  }

  /**
   * Get MIME type from file extension
   */
  private getMimeType(extension: string): string {
    const mimeTypes: { [key: string]: string } = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      heic: 'image/heic',
      heif: 'image/heif',
    };
    return mimeTypes[extension] || 'image/jpeg';
  }

  /**
   * Validate image file
   */
  validateImageFile(uri: string, maxSizeBytes: number = 50 * 1024 * 1024): boolean {
    const extension = this.getFileExtension(uri);
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'];
    
    if (!allowedExtensions.includes(extension)) {
      throw new Error(`Unsupported file type: ${extension}`);
    }

    // Additional size check would be done during upload
    return true;
  }

  /**
   * Batch upload multiple images
   */
  async uploadMultipleFoodImages(
    imageUris: string[],
    userId: string,
    metadata: Partial<FoodImageMetadata>[] = []
  ): Promise<{ imageRecord: any; uploadResult: ImageUploadResult }[]> {
    const results = [];
    
    for (let i = 0; i < imageUris.length; i++) {
      try {
        const result = await this.uploadFoodImage(
          imageUris[i], 
          userId, 
          metadata[i] || {}
        );
        results.push(result);
      } catch (error) {
        console.error(`Failed to upload image ${i + 1}:`, error);
        // Continue with other uploads
      }
    }
    
    return results;
  }
}

export { SupabaseImageService };
export const supabaseImageService = new SupabaseImageService();
export default supabaseImageService;