import { IUserEntity } from 'src/modules/users/interface/user.entity.interface';

export interface ILoginResponse {
  user: Partial<IUserEntity>;
  accessToken: string;
  refreshToken: string;
}
