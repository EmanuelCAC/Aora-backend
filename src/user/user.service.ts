import { ForbiddenException, Injectable } from '@nestjs/common';
import { CloudnaryService } from 'src/cloudnary/cloudnary.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private cloundnary: CloudnaryService) {}
  
  async edit(id: number, file?: Express.Multer.File) {
    try {
      let avatar_url: string
      if(file) {
        avatar_url = await this.cloundnary.uploadImage(file.path)
      } else {
        avatar_url = "https://res.cloudinary.com/duheudj5m/image/upload/v1733785827/twp9qcahnicfykuaizo7.png"
      }
      
      if(!avatar_url) throw new ForbiddenException('No avatar image')

      const user = await this.prisma.users.update({
        data: {
          avatar: avatar_url
        },
        where: {
          id
        }
      })

      return { avatar: user.avatar }
    } catch (error) {
      throw error
    }
  }
}
