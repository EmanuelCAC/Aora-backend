import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { CloudnaryModule } from 'src/cloudnary/cloudnary.module';

@Module({
  controllers: [VideoController],
  providers: [VideoService],
  imports: [CloudnaryModule]
})
export class VideoModule {}
