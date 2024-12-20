import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto, SignInDto } from './dto';
import * as bcrypt from "bcrypt";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

  async signup(dto: SignUpDto) {
    const hash = await bcrypt.hash(dto.password, 10)

    try {
      const user = await this.prisma.users.create({
        data: {
          email: dto.email,
          hash: hash,
          name: dto.name,
          avatar: "https://res.cloudinary.com/duheudj5m/image/upload/v1733785827/twp9qcahnicfykuaizo7.png"
        },
      })
    

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        token: (await this.signToken(user.id, user.email, user.name, user.avatar)).token
      }
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

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        token: (await this.signToken(user.id, user.email, user.name, user.avatar)).token
      }
    } catch (error) {
      throw error
    }
  }

  async signToken(userId: number, email: string, name: string, avatar: null | string): Promise<{ token: string}> {
    const payload = {
      sub: userId,
      email,
      name,
      avatar
    }

    const secret = this.config.get('JWT_SECRET')

    const token = await this.jwt.signAsync(payload, {
      secret
    })

    return {
      token
    }
  }
}
