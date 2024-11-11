import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto, SignInDto } from './dto';
import * as bcrypt from "bcrypt";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: SignUpDto) {
    const hash = await bcrypt.hash(dto.password, 10)

    try {
      const user = await this.prisma.users.create({
        data: {
          email: dto.email,
          hash: hash,
          name: dto.name,
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

  async signin(dto: SignInDto) {
    try {
      const user = await this.prisma.users.findUnique({
        where: {
          email: dto.email
        }
      })

      if (!user) throw new ForbiddenException('Credentials incorrect')

      const passMatches = await bcrypt.compare(dto.password, user.hash)

      if (!passMatches) throw new ForbiddenException('Credentials incorrect')

      delete user.hash

      return user
    } catch (error) {
      throw error
    }
  }
}
