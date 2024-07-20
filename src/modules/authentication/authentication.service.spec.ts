import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { UserService } from '../users/user.service';
import { RegisterDto } from './dto/register.dto';
import { IUserEntity } from '../users/interface/user.entity.interface';
import { jwtConstants } from 'src/configs/jwt.config';

jest.mock('bcrypt');

describe('AuthenticationService', () => {
  let authService: AuthenticationService;

  const now = new Date();
  const mockUser: IUserEntity = {
    userId: 1,
    username: 'testuser',
    password: 'hashedpassword',
    referralCode: 'TEST123',
    earnings: 0,
    createdAt: now,
    updatedAt: now,
  };

  const mockUserService = {
    findByUsername: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthenticationService>(AuthenticationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      mockUserService.findByUsername.mockResolvedValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

      const result = await authService.validateUser(
        mockUser.username,
        mockUser.password,
      );

      expect(result).toEqual({
        userId: mockUser.userId,
        username: mockUser.username,
        referralCode: mockUser.referralCode,
        earnings: mockUser.earnings,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });

    it('should throw UnauthorizedException when username is invalid', async () => {
      mockUserService.findByUsername.mockResolvedValue(null);

      await expect(
        authService.validateUser(mockUser.username, mockUser.password),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      mockUserService.findByUsername.mockResolvedValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

      await expect(
        authService.validateUser(mockUser.username, mockUser.password),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return null when user has no password', async () => {
      const userWithoutPassword = { ...mockUser, password: undefined };
      mockUserService.findByUsername.mockResolvedValue(userWithoutPassword);

      const result = await authService.validateUser(
        mockUser.username,
        mockUser.password,
      );

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return login response with tokens', async () => {
      const user: Partial<IUserEntity> = {
        userId: 1,
        username: 'testuser',
        referralCode: 'TEST123',
      };

      mockJwtService.sign.mockReturnValueOnce('mockaccesstoken');
      mockJwtService.sign.mockReturnValueOnce('mockrefreshtoken');

      const result = await authService.login(user);

      expect(result).toEqual({
        user,
        accessToken: 'mockaccesstoken',
        refreshToken: 'mockrefreshtoken',
      });
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
    });

    it('should reject with error if token generation fails', async () => {
      const mockTokenError = 'Token generation failed';
      const user: Partial<IUserEntity> = {
        userId: 1,
        username: 'testuser',
        referralCode: 'TEST123',
      };

      mockJwtService.sign.mockImplementation(() => {
        throw new Error(mockTokenError);
      });

      await expect(authService.login(user)).rejects.toThrow(mockTokenError);
    });
  });

  describe('loginByRefreshToken', () => {
    it('should return new login response when refresh token is valid', async () => {
      const decodedToken = {
        userId: mockUser.userId,
        username: mockUser.username,
        referralCode: mockUser.referralCode,
      };

      mockJwtService.verify.mockReturnValue(decodedToken);
      mockUserService.findByUsername.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValueOnce('newaccesstoken');
      mockJwtService.sign.mockReturnValueOnce('newrefreshtoken');

      const result = await authService.loginByRefreshToken('validrefreshtoken');

      expect(result).toEqual({
        user: mockUser,
        accessToken: 'newaccesstoken',
        refreshToken: 'newrefreshtoken',
      });

      expect(mockJwtService.verify).toHaveBeenCalledWith('validrefreshtoken', {
        secret: jwtConstants.refresh_secret,
      });
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      mockJwtService.verify.mockReturnValueOnce(null);

      await expect(
        authService.loginByRefreshToken('invalidrefreshtoken'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should create a new user and return it', async () => {
      const _registerDto: RegisterDto = {
        username: 'newuser',
        password: 'password123',
        referralCode: 'NEW123',
      };

      const registerDto = new RegisterDto();
      Object.assign(registerDto, _registerDto);

      const createdUser: Partial<IUserEntity> = {
        userId: 2,
        username: 'newuser',
        referralCode: 'NEW123',
      };

      mockUserService.create.mockResolvedValue(createdUser);

      const result = await authService.register(registerDto);

      expect(result).toEqual(createdUser);
      expect(mockUserService.create).toHaveBeenCalledWith(registerDto);
    });

    it('should reject with error if user creation fails', async () => {
      const mockErrorRegister = 'User creation failed';
      const _registerDto: RegisterDto = {
        username: 'newuser',
        password: 'password123',
        referralCode: 'NEW123',
      };

      const registerDto = new RegisterDto();
      Object.assign(registerDto, _registerDto);

      mockUserService.create.mockRejectedValue(new Error(mockErrorRegister));

      await expect(authService.register(registerDto)).rejects.toThrow(
        mockErrorRegister,
      );
    });
  });
});
