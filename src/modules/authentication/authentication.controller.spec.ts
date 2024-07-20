import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import { LoginByRefreshTokenDto } from './dto/login.by.refresh.token.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { LocalAuthGuard } from 'src/guards/local.guard';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let authService: AuthenticationService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    loginByRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    authService = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login and return the result', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
      };
      const mockLoginResponse = {
        user: mockUser,
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login({ user: mockUser });

      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockLoginResponse);
    });
  });

  describe('register', () => {
    it('should call authService.register and return the result', async () => {
      const _registerDto: RegisterDto = {
        username: 'newuser',
        password: 'password123',
        referralCode: 'REF123',
      };

      const registerDto = new RegisterDto();
      Object.assign(registerDto, _registerDto);

      const mockRegisteredUser = {
        id: 1,
        username: 'newuser',
        referralCode: 'REF123',
      };

      mockAuthService.register.mockResolvedValue(mockRegisteredUser);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockRegisteredUser);
    });
  });

  describe('loginByRefreshToken', () => {
    it('should call authService.loginByRefreshToken and return the result', async () => {
      const _loginByRefreshTokenDto: LoginByRefreshTokenDto = {
        refreshToken: 'validRefreshToken',
      };

      const loginByRefreshTokenDto = new LoginByRefreshTokenDto();
      Object.assign(loginByRefreshTokenDto, _loginByRefreshTokenDto);

      const mockLoginResponse = {
        user: {
          id: 1,
          username: 'testuser',
          referralCode: 'TES123',
        },
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      };

      mockAuthService.loginByRefreshToken.mockResolvedValue(mockLoginResponse);

      const result = await controller.loginByRefreshToken(
        loginByRefreshTokenDto,
      );

      expect(authService.loginByRefreshToken).toHaveBeenCalledWith(
        'validRefreshToken',
      );
      expect(result).toEqual(mockLoginResponse);
    });
  });

  describe('profile', () => {
    it('should return the user from the request', () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        referralCode: 'TES123',
      };
      const mockRequest = { user: mockUser };

      const result = controller.profile(mockRequest);

      expect(result).toEqual(mockUser);
    });
  });
});
