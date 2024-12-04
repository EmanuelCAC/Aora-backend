import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { CloudnaryService } from 'src/cloudnary/cloudnary.service';

@Module({
  controllers: [VideoController],
  providers: [VideoService],
  imports: [CloudnaryService]
})
export class VideoModule {}
