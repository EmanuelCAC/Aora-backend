import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { VideoService } from './video.service';
import { JwtGuard } from 'src/auth/guard';
import { VideoDto } from './dto';

@UseGuards(JwtGuard)
@Controller('videos')
export class VideoController {
  constructor(private videoService: VideoService) {}

  @Get('all')
  getAll() {
    return this.videoService.getAll()
  }

  @Get('latest')
  getLatest() {
    return this.videoService.getLatest()
  }

  @Post('new')
  create(@Body() dto: VideoDto) {
    return this.videoService.create(dto)
  }
}
