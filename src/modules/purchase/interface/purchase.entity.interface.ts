import { IBaseEntity } from 'src/modules/base/interface/base.entity.interface';
import { IUserEntity } from 'src/modules/users/interface/user.entity.interface';

export interface IPurchaseEntity extends IBaseEntity {
  purchaseId: number;
  amount: number;
  userId: number;
  user: Partial<IUserEntity>;
}
