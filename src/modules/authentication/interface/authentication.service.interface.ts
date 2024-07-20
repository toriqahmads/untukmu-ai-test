import { IUserEntity } from 'src/modules/users/interface/user.entity.interface';
import { RegisterDto } from '../dto/register.dto';
import { ILoginResponse } from './login.response.interface';

export interface IAuthenticationService {
  validateUser(
    username: string,
    password: string,
  ): Promise<Partial<IUserEntity> | null>;
  register(registerDto: RegisterDto): Promise<Partial<IUserEntity>>;
  login(user: Partial<IUserEntity>): Promise<ILoginResponse>;
  loginByRefreshToken(refreshToken: string): Promise<ILoginResponse>;
}
