import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import type { Request } from '../types/express';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for video uploads
const videoFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allow video formats
  const allowedMimeTypes = [
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-ms-wmv',
    'video/webm',
    'video/ogg'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only video files are allowed.'));
  }
};

// Multer upload configuration
export const videoUpload = multer({
  storage,
  fileFilter: videoFileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  }
});

export interface VideoUploadResult {
  url: string;
  publicId: string;
  duration: number;
  format: string;
  width: number;
  height: number;
  size: number;
  thumbnail: string;
}

export class MediaService {
  /**
   * Upload video to Cloudinary
   */
  async uploadVideo(
    buffer: Buffer, 
    options?: {
      folder?: string;
      publicId?: string;
      transformation?: any[];
    }
  ): Promise<VideoUploadResult> {
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        resource_type: 'video' as const,
        folder: options?.folder || 'revela/tests',
        public_id: options?.publicId,
        transformation: options?.transformation || [
          { quality: 'auto', fetch_format: 'auto' }
        ],
        eager: [
          { width: 640, height: 360, crop: 'fill', quality: 'auto' },
          { width: 1280, height: 720, crop: 'fill', quality: 'auto' }
        ],
        eager_async: true,
        allowed_formats: ['mp4', 'webm', 'mov', 'avi'],
        max_file_size: 100 * 1024 * 1024 // 100MB
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error('Failed to upload video'));
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              duration: result.duration || 0,
              format: result.format,
              width: result.width,
              height: result.height,
              size: result.bytes,
              thumbnail: result.secure_url.replace(/\.[^/.]+$/, '.jpg')
            });
          }
        }
      );

      uploadStream.end(buffer);
    });
  }

  /**
   * Delete video from Cloudinary
   */
  async deleteVideo(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
    } catch (error) {
      console.error('Failed to delete video:', error);
      throw new Error('Failed to delete video');
    }
  }

  /**
   * Generate thumbnail from video
   */
  getThumbnailUrl(videoUrl: string, options?: {
    width?: number;
    height?: number;
    crop?: string;
    gravity?: string;
    startOffset?: number;
  }): string {
    // Extract public ID from URL
    const matches = videoUrl.match(/\/v\d+\/(.+)\.\w+$/);
    if (!matches) return videoUrl;

    const publicId = matches[1];
    const transformation = [];

    if (options?.width) transformation.push(`w_${options.width}`);
    if (options?.height) transformation.push(`h_${options.height}`);
    if (options?.crop) transformation.push(`c_${options.crop}`);
    if (options?.gravity) transformation.push(`g_${options.gravity}`);
    if (options?.startOffset) transformation.push(`so_${options.startOffset}`);

    transformation.push('f_jpg');

    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload/${transformation.join(',')}/${publicId}.jpg`;
  }

  /**
   * Get video analytics URL (for AI processing)
   */
  getAnalyticsUrl(videoUrl: string): string {
    // Extract public ID from URL
    const matches = videoUrl.match(/\/v\d+\/(.+)\.\w+$/);
    if (!matches) return videoUrl;

    const publicId = matches[1];
    
    // Apply transformations for AI analysis
    const transformation = [
      'w_640',      // Reduce width for faster processing
      'h_360',      // Reduce height
      'c_fill',     // Crop to fill
      'q_auto:low', // Lower quality for analysis
      'f_mp4'       // Ensure MP4 format
    ].join(',');

    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload/${transformation}/${publicId}.mp4`;
  }

  /**
   * Validate video metadata
   */
  validateVideo(metadata: {
    duration?: number;
    size: number;
    format: string;
  }): { valid: boolean; error?: string } {
    // Check duration (max 2 minutes for test videos)
    if (metadata.duration && metadata.duration > 120) {
      return { valid: false, error: 'Video must be less than 2 minutes long' };
    }

    // Check file size (max 100MB)
    if (metadata.size > 100 * 1024 * 1024) {
      return { valid: false, error: 'Video file size must be less than 100MB' };
    }

    // Check format
    const allowedFormats = ['mp4', 'webm', 'mov', 'avi', 'mpeg'];
    if (!allowedFormats.includes(metadata.format.toLowerCase())) {
      return { valid: false, error: 'Invalid video format' };
    }

    return { valid: true };
  }
}

// Export singleton instance
export const mediaService = new MediaService();