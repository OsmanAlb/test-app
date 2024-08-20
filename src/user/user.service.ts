import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { User } from '@prisma/client';
import { UserEntity } from './entities/user.entity';
import Decimal from 'decimal.js';

export const roundsOfHashing = 10;

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;

    const balance = new Decimal(createUserDto.balance);

    const newUser = new UserEntity({
      ...createUserDto,
      balance,
    });

    const createdUser = await this.prisma.user.create({
      data: newUser,
    });

    return new UserEntity(createdUser);
  }

  async findAll(): Promise<User[] | null> {
    const cachedData = await this.cacheService.get<User[]>('users');

    if (cachedData) {
      console.log(`Getting data from cache!`);
      return cachedData;
    }
    const users = await this.prisma.user.findMany({
      where: { deletedAt: null },
    });

    await this.cacheService.set('user', users);
    return users;
  }

  async findOne(id: number): Promise<User> {
    const cacheKey = `user_${id}`;
    const cachedData = await this.cacheService.get<User>(cacheKey);

    if (cachedData) {
      console.log(`Getting data from cache from user by ID: ${id}!`);
      return cachedData;
    }

    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });

    if (user) await this.cacheService.set('user', user);

    return user;
  }

  async findByLogin(email: string): Promise<User> {
    const cacheKey = `user_email_${email}`;
    const cachedData = await this.cacheService.get<User>(cacheKey);

    if (cachedData) {
      console.log(`Getting data from cache from cache by email: ${email}`);
      return cachedData;
    }
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) await this.cacheService.set('user', user);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

// findAll() {
//   return this.prisma.user.findMany({
//     where: { deletedAt: null },
//   });
// }
// findOne(id: number) {
//   return this.prisma.user.findUnique({ where: { id, deletedAt: null } });
// }
// async findByLogin(email: string) {
//   return this.prisma.user.findUnique({ where: { email } });
// }
