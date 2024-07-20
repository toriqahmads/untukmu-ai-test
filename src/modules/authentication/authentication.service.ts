import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { UserService } from '../users/user.service';
import { IJWTPayload } from 'src/interfaces/jwt.payload.interface';
import { jwtConstants } from 'src/configs/jwt.config';
import { RegisterDto } from './dto/register.dto';
import { ILoginResponse } from './interface/login.response.interface';
import { IAuthenticationService } from './interface/authentication.service.interface';
import { IUserEntity } from '../users/interface/user.entity.interface';

@Injectable()
export class AuthenticationService implements IAuthenticationService {
  constructor(
    protected userService: UserService,
    protected jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<Partial<IUserEntity> | null> {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException(`invalid username`);
    }
    if (user.password) {
      if (!compareSync(pass, user.password)) {
        throw new UnauthorizedException(`invalid password`);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: Partial<IUserEntity>): Promise<ILoginResponse> {
    try {
      const payload: IJWTPayload = {
        userId: user.userId,
        username: user.username,
        referralCode: user.referralCode,
      };

      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: jwtConstants.refresh_expiration,
        secret: jwtConstants.refresh_secret,
      });

      return Promise.resolve({
        user: user,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async loginByRefreshToken(refreshToken: string): Promise<ILoginResponse> {
    try {
      const validateRefresToken = this.jwtService.verify<IJWTPayload>(
        refreshToken,
        { secret: jwtConstants.refresh_secret },
      );
      if (!validateRefresToken) {
        throw new UnauthorizedException(`refresh token expired or not valid`);
      }

      const user = await this.userService.findByUsername(
        validateRefresToken.username,
      );

      const login = await this.login(user);

      return Promise.resolve(login);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async register(registerDto: RegisterDto): Promise<Partial<IUserEntity>> {
    try {
      const user = await this.userService.create({
        username: registerDto.username,
        password: registerDto.password,
        referralCode: registerDto.referralCode,
      });

      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
