import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/database/services/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }
  findAll() {
    return this.prisma.user.findMany();
  }
  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}