import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/services/prisma.service';
import { compare, hash } from 'bcrypt';
import { CredentialsDto } from './dto/credentials.dto';
import { UsersService } from 'src/users/users.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async passwordMatching(newPassword: string, realPassword: string) {
    return await compare(newPassword, realPassword);
  }

  async login(credentialsDto: CredentialsDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: credentialsDto.email },
    });
    if (!user) {
      return { message: 'User not found' };
    }
    const isPasswordMatching = await this.passwordMatching(
      credentialsDto.password,
      user.password,
    );
    if (!isPasswordMatching) {
      return { message: 'Password incorrect' };
    }
    return {
      token: jwt.sign(
        {
          id: user.id,
        },
        process.env.JWT_SECRET,
      ),
      user,
    };
  }

  async register(credentialsDto: CredentialsDto) {
    const hashPassword = await hash(credentialsDto.password, 10);
    return this.usersService.create({
      ...credentialsDto,
      password: hashPassword,
    });
  }
}
