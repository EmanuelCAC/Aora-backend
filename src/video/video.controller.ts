import { Body, Controller, Get, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { VideoService } from './video.service';
import { JwtGuard } from 'src/auth/guard';
import { VideoDto } from './dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';



@UseGuards(JwtGuard)
@Controller('videos')
export class VideoController {
  constructor(private videoService: VideoService) { }

  @Get('all')
  getAll() {
    return this.videoService.getAll()
  }

  @Get('latest')
  getLatest() {
    return this.videoService.getLatest()
  }

  @Post('new')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 2 },
    { name: 'video', maxCount: 1 },
  ]))
  create(
    @Body() dto: VideoDto,
    @UploadedFiles() files: { image?: Express.Multer.File[], video?: Express.Multer.File[] }
  ) {
    return this.videoService.create(dto, files)
  }

  @Post('search')
  search(@Body() dto: {query: string}) {
    return this.videoService.search(dto.query)
  }
}
