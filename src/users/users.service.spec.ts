import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

jest.mock('../prisma/prisma.service');
jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;
  const roundsOfHashing = 10;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should hash the password and create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'test',
        age: 123,
        description: 'test description',
      };
      const hashedPassword = 'hashedPassword';
      const createdUser = { id: 1, ...createUserDto, password: hashedPassword };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.user.create.mockResolvedValue(createdUser);

      expect(await service.create(createUserDto)).toEqual(createdUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', roundsOfHashing);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: { ...createUserDto, password: hashedPassword },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        {
          id: 1,
          email: 'test@example.com',
          password: 'hashedPassword',
          deletedAt: null,
        },
      ];
      mockPrismaService.user.findMany.mockResolvedValue(users);

      expect(await service.findAll()).toEqual(users);
      expect(prismaService.user.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        deletedAt: null,
      };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      expect(await service.findOne(1)).toEqual(user);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1, deletedAt: null },
      });
    });
  });

  describe('findByLogin', () => {
    it('should return a user by email', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      expect(await service.findByLogin('test@example.com')).toEqual(user);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });
  });

  describe('update', () => {
    it('should hash the new password if provided and update the user', async () => {
      const updateUserDto: UpdateUserDto = { password: 'newPassword123' };
      const hashedPassword = 'newHashedPassword';
      const updatedUser = {
        id: 1,
        email: 'test@example.com',
        password: hashedPassword,
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      prismaService.user.update = jest.fn().mockResolvedValue(updatedUser);

      expect(await service.update(1, updateUserDto)).toEqual(updatedUser);
      expect(bcrypt.hash).toHaveBeenCalledWith(
        'newPassword123',
        roundsOfHashing,
      );
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { ...updateUserDto, password: hashedPassword },
      });
    });
  });
});
