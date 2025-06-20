import { Express, Request, Response } from 'express';
import { mediaService, videoUpload } from '../services/media.service';
import { storage } from '../storage';

export function setupMediaRoutes(app: Express) {
  // Upload video for test
  app.post('/api/media/upload/test-video', 
    videoUpload.single('video'),
    async (req: Request, res: Response) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: 'No video file provided' });
        }

        // Get authenticated user
        const userId = (req as any).session?.userId || (req as any).user?.claims?.sub;
        if (!userId) {
          return res.status(401).json({ message: 'Not authenticated' });
        }

        // Get athlete
        const athlete = await storage.getAthleteByUserId(userId);
        if (!athlete) {
          return res.status(403).json({ message: 'Only athletes can upload test videos' });
        }

        // Check subscription for video uploads
        const subscription = await storage.getUserSubscription(userId);
        if (!subscription || subscription.status !== 'active') {
          return res.status(403).json({ 
            message: 'Video upload requires an active subscription',
            requiresSubscription: true 
          });
        }

        // Extract test metadata from request
        const { testType, testId } = req.body;
        if (!testType) {
          return res.status(400).json({ message: 'Test type is required' });
        }

        // Upload to Cloudinary
        const uploadResult = await mediaService.uploadVideo(req.file.buffer, {
          folder: `revela/athletes/${athlete.id}/tests`,
          publicId: `${testType}_${Date.now()}`
        });

        // Validate video
        const validation = mediaService.validateVideo({
          duration: uploadResult.duration,
          size: uploadResult.size,
          format: uploadResult.format
        });

        if (!validation.valid) {
          // Delete uploaded video if validation fails
          await mediaService.deleteVideo(uploadResult.publicId);
          return res.status(400).json({ message: validation.error });
        }

        // If testId provided, update existing test
        if (testId) {
          const test = await storage.updateTest(parseInt(testId), {
            videoUrl: uploadResult.url,
            metadata: {
              ...uploadResult,
              uploadedAt: new Date().toISOString()
            }
          });
          
          return res.json({
            message: 'Video uploaded successfully',
            test,
            video: uploadResult
          });
        }

        // Return upload result for new test creation
        res.json({
          message: 'Video uploaded successfully',
          video: uploadResult,
          thumbnail: mediaService.getThumbnailUrl(uploadResult.url),
          analyticsUrl: mediaService.getAnalyticsUrl(uploadResult.url)
        });

      } catch (error: any) {
        console.error('Video upload error:', error);
        
        if (error.message === 'Invalid file type. Only video files are allowed.') {
          return res.status(400).json({ message: error.message });
        }
        
        if (error.message === 'File too large') {
          return res.status(400).json({ message: 'Video file must be less than 100MB' });
        }
        
        res.status(500).json({ message: 'Failed to upload video' });
      }
    }
  );

  // Delete video
  app.delete('/api/media/video/:publicId', async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId || (req as any).user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const { publicId } = req.params;
      
      // Verify ownership by checking if video belongs to user's tests
      // This is a simplified check - in production, store video metadata in DB
      const athlete = await storage.getAthleteByUserId(userId);
      if (!athlete) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      await mediaService.deleteVideo(publicId);
      
      res.json({ message: 'Video deleted successfully' });
    } catch (error) {
      console.error('Video deletion error:', error);
      res.status(500).json({ message: 'Failed to delete video' });
    }
  });

  // Get video thumbnail
  app.get('/api/media/thumbnail', (req: Request, res: Response) => {
    try {
      const { videoUrl, width, height, startOffset } = req.query;
      
      if (!videoUrl || typeof videoUrl !== 'string') {
        return res.status(400).json({ message: 'Video URL is required' });
      }

      const thumbnailUrl = mediaService.getThumbnailUrl(videoUrl, {
        width: width ? parseInt(width as string) : 640,
        height: height ? parseInt(height as string) : 360,
        crop: 'fill',
        gravity: 'center',
        startOffset: startOffset ? parseInt(startOffset as string) : 1
      });

      res.json({ thumbnailUrl });
    } catch (error) {
      console.error('Thumbnail generation error:', error);
      res.status(500).json({ message: 'Failed to generate thumbnail' });
    }
  });
}