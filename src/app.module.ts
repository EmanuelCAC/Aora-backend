import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { VideoController } from './video/video.controller';
import { VideoService } from './video/video.service';
import { VideoModule } from './video/video.module';
import { CloudnaryService } from './cloudnary/cloudnary.service';
import { CloudnaryModule } from './cloudnary/cloudnary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    VideoModule,
    CloudnaryModule
  ],
  controllers: [AppController, VideoController],
  providers: [VideoService, CloudnaryService],
})
export class AppModule {}
