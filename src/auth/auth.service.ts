import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: AuthDto) {
    //find user by email
    const user = await this.prismaService.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    //error if not exist
    if (!user) {
      throw new ForbiddenException('Invalid credentials!');
    }

    //compare password
    const isPasswordMatch = await argon.verify(user.password!, dto.password);

    //return user
    if (!isPasswordMatch) {
      throw new ForbiddenException('Invalid credentials!');
    }

    const responseUser = {
      ...user,
      password: undefined,
    };
    const token = await this.signToken(user.id, user.email);

    return {
      user: responseUser,
      access_token: token,
    };
  }

  async signToken(id_user?: number | null, email?: string | null) {
    const payload = {
      sub: id_user,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.getOrThrow('JWT_SECRET'),
    });

    return token;
  }

  async register(dto: AuthDto) {
    try {
      // gen password
      const hash = await argon.hash(dto.password);

      const user = await this.prismaService.user.findFirst({
        where: {
          email: dto.email,
        },
        select: {
          email: true,
        },
      });

      if (user) {
        throw new ForbiddenException('User already exists!');
      }

      // save user in db
      const newUser = await this.prismaService.user.create({
        data: {
          email: dto.email,
          password: hash,
        },
        omit: {
          password: true,
        },
      });

      //return saved user
      return newUser;
    } catch (error) {
      throw error;
    }
  }
}
