import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByLogin: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        PrismaService,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'test',
        age: 123,
        description: 'test description',
      };
      const createdUser = { id: 1, ...createUserDto };
      mockUsersService.create.mockResolvedValue(createdUser);

      expect(await controller.create(createUserDto)).toEqual(
        new UserEntity(createdUser),
      );
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        { id: 1, email: 'test@example.com', password: 'hashedPassword' },
      ];
      mockUsersService.findAll.mockResolvedValue(users);

      expect(await controller.findAll()).toEqual(
        users.map((user) => new UserEntity(user)),
      );
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      mockUsersService.findOne.mockResolvedValue(user);

      expect(await controller.findOne(1)).toEqual(new UserEntity(user));
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('search', () => {
    it('should return a user by email', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      mockUsersService.findByLogin.mockResolvedValue(user);

      expect(await controller.search('test@example.com')).toEqual(
        new UserEntity(user),
      );
      expect(service.findByLogin).toHaveBeenCalledWith('test@example.com');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { password: 'newPassword123' };
      const updatedUser = {
        id: 1,
        email: 'test@example.com',
        password: 'newHashedPassword',
      };
      mockUsersService.update.mockResolvedValue(updatedUser);

      expect(await controller.update(1, updateUserDto)).toEqual(
        new UserEntity(updatedUser),
      );
      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const removedUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      mockUsersService.remove.mockResolvedValue(removedUser);

      expect(await controller.remove(1)).toEqual(new UserEntity(removedUser));
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
