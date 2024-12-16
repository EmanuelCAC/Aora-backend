import { Post, Controller, Get, UploadedFile, UseGuards, UseInterceptors, Body, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { Users } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: Users) {
    return user
  }

  @Post('edit')
  @UseInterceptors(FileFieldsInterceptor([
      { name: 'image', maxCount: 1 }
    ]))
  edit(
    @Body() dto: {userId: number},
    @UploadedFiles() files: { image?: Express.Multer.File[] }
  ) {
    if (files.image) {
      return this.userService.edit(Number(dto.userId), files.image[0])
    }
    return this.userService.edit(Number(dto.userId))
  }
}
