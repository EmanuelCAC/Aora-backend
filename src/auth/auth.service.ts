import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from "bcrypt";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    const hash = await bcrypt.hash(dto.password, 10)

    try {
      const user = await this.prisma.users.create({
        data: {
          email: dto.email,
          hash: hash,
          name: dto.name,
          avatar: dto.avatar
        },
      })
  
      delete user.hash
  
      return user
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken')
        }
      }
      throw error
    }
  }

  signin() {
    return { msg: 'I have signed in'}
  }
}
