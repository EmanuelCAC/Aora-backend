import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CloudnaryModule } from 'src/cloudnary/cloudnary.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [
    CloudnaryModule
  ]
})
export class UserModule {}
