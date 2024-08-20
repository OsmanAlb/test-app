import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should throw NotFoundException if user is not found', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(authService.login(email, password)).rejects.toThrow(
        new NotFoundException(`No user found for email: ${email}`),
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const user = {
        id: 1,
        email,
        password: 'hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        age: 25,
        name: 'Test User',
        description: 'Test description',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(authService.login(email, password)).rejects.toThrow(
        new UnauthorizedException('Invalid password'),
      );
    });

    it('should return an AuthEntity if login is successful', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const user = {
        id: 1,
        email,
        password: 'hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        age: 25,
        name: 'Test User',
        description: 'Test description',
      };
      const accessToken = 'jwt-token';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(jwtService, 'sign').mockReturnValue(accessToken);

      const result = await authService.login(email, password);

      expect(result).toEqual({ accessToken });
      expect(jwtService.sign).toHaveBeenCalledWith({ userId: user.id });
    });
  });
});
