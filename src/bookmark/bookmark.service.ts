import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async getAll(id: number) {
    try {
      const videos = await this.prisma.bookmarks.findMany({
        where: {
          userId: id
        },
        include:{
          video: {
            include: {
              creator: {
                select: {
                  name: true,
                  avatar: true
                }
              }
            }
          }
        },
      })

      return videos
    } catch (error) {
      throw error
    }
  }

  async save(videoId: number, userId: number) {
    try {
      const alredySaved = await this.prisma.bookmarks.findFirst({
        where:{
          videoId: videoId,
          userId: userId
        }
      })

      if (alredySaved) return { success: true }

      const savedVideo = await this.prisma.bookmarks.create({
        data: {
          videoId,
          userId
        }
      })

      if (!savedVideo) throw new ForbiddenException("Couldn't save the video")

      return { success: true }
    } catch (error) {
      throw error
    }
  }

  async unsave(id: number) {
    try {
      const video = await this.prisma.bookmarks.delete({
        where: {
          id
        }
      })

      if (!video) throw new ForbiddenException("Video not found")

      return { success: true }
    } catch (error) {
      throw error
    }
  }
}
