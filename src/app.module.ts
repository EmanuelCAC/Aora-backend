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
import { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';
import { BookmarkModule } from './bookmark/bookmark.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    VideoModule,
    CloudnaryModule,
    BookmarkModule
  ],
  controllers: [AppController, VideoController, UserController],
  providers: [VideoService, CloudnaryService, UserService],
})
export class AppModule {}
