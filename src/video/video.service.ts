import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VideoDto } from './dto';
import { CloudnaryService } from 'src/cloudnary/cloudnary.service';

@Injectable()
export class VideoService {
  constructor(private prisma: PrismaService, private cloundnary: CloudnaryService) {}

  async getAll() {
    try {
      const videos = await this.prisma.videos.findMany({
        include: {
          creator: {
            select: {
              name: true,
              avatar: true
            }
          }
        }
      })

      return videos
    } catch (error) {
      throw error
    }
  }

  async getLatest() {
    try {
      const latestVideos = await this.prisma.videos.findMany({
        include: {
          creator: {
            select: {
              name: true,
              avatar: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      })

      return latestVideos
    } catch (error) {
      throw error
    }
  }

  async create(dto: VideoDto) {
    try {
      const thumbnail_url = await this.cloundnary.uploadImage(dto.thumbnail)

      if(!thumbnail_url) throw new ForbiddenException('No thumbnail')

      const video_url = await this.cloundnary.uploadVideo(dto.video)

      if(!video_url) throw new ForbiddenException('No video')

      const video = await this.prisma.videos.create({
        data: {
          title: dto.title,
          thumbnail: thumbnail_url,
          video: video_url,
          prompt: dto.prompt || null,
          creatorId: dto.creatorId
        }
      })

      return video
    } catch (error) {
      throw error
    }
  }
}
