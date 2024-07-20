import { IBaseEntity } from 'src/modules/base/interface/base.entity.interface';

export interface IUserEntity extends IBaseEntity {
  userId: number;
  username: string;
  password: string;
  referralCode: string;
  referrer?: number;
  earnings: number;
  purchases?: Partial<IUserEntity[]>;
  referredBy?: Partial<IUserEntity>;
  referrals?: Partial<IUserEntity[]>;
}
