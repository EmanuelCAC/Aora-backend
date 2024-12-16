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

  async getUserVideos(id: number) {
    try {
      const videos = await this.prisma.videos.findMany({
        include: {
          creator: {
            select: {
              name: true,
              avatar: true
            }
          }
        },
        where: {
          creatorId: id
        }
      })

      return videos
    } catch (error) {
      throw error
    }
  }

  async create(dto: VideoDto, files: { image?: Express.Multer.File[], video?: Express.Multer.File[] }) {
    try {
      const thumbnail_url = await this.cloundnary.uploadImage(files.image[0].path)

      if(!thumbnail_url) throw new ForbiddenException('No thumbnail')

      const video_url = await this.cloundnary.uploadVideo(files.video[0].path)

      if(!video_url) throw new ForbiddenException('No video')

      const video = await this.prisma.videos.create({
        data: {
          title: dto.title,
          thumbnail: thumbnail_url,
          video: video_url,
          prompt: dto.prompt || null,
          creatorId: Number(dto.creatorId)
        }
      })

      if(!video) throw new ForbiddenException(`Couldn't create the post`)

      return { success: 'true'}
    } catch (error) {
      throw error
    }
  }

  async search(query: string) {
    try {
      const videos = await this.prisma.videos.findMany({
        include: {
          creator: {
            select: {
              name: true,
              avatar: true
            }
          }
        },
        where: {
          OR: [
            {
              title: {
                contains: query,
                mode: 'insensitive'
              }
            },
            {
              prompt: {
                contains: query,
                mode: 'insensitive'
              }
            }
          ]
        }
      })

      return videos
    } catch (error) {
      throw error
    }
  }

  async remove(id: number) {
    try {
      const video = await this.prisma.videos.delete({
        where: {
          id: id
        }
      })

      if (!video) throw new ForbiddenException('Video not found')

      return { success: 'true' }
    } catch (error) {
      throw error
    }
  }
}
