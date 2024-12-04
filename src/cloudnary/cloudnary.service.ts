import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  secure: true
});

@Injectable()
export class CloudnaryService {

  async uploadImage(imagePath: string) {
    try {
      const image = await cloudinary.uploader.upload(imagePath)
      return image.secure_url
    } catch (error) {
      throw error
    }
  }

  async uploadVideo(videoPath: string) {
    try {
      const video = await cloudinary.uploader.upload(videoPath, 
        {
          resource_type: "video"
        }
      )
      return video.secure_url
    } catch (error) {
      throw error
    }
  }
}
