import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginDto } from './dto/login.dto';
import { AuthInterface } from '../../interfaces/auth.interface';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // Создаем тестовый модуль с помощью Test.createTestingModule.
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login with correct parameters', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const result: AuthInterface = {
        accessToken: '123456',
        user: { id: 1, email: 'test@example.com' },
      };

      jest.spyOn(authService, 'login').mockResolvedValue(result);

      expect(await authController.login(loginDto)).toBe(result);
      expect(authService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
    });
  });
});
