import { IBaseService } from 'src/modules/base/interface/base.service.interface';
import { CreateUserDto } from '../dto/create.user.dto';
import { UpdateUserDto } from '../dto/update.user.dto';
import { FindAllUserDto } from '../dto/findall.user.dto';
import { UserEntity } from 'src/entities/user.entity';

export interface IUserService
  extends IBaseService<
    UserEntity,
    CreateUserDto,
    UpdateUserDto,
    FindAllUserDto
  > {
  findByUsername(username: string): Promise<UserEntity>;
  findByReferralCode(referralCode: string): Promise<UserEntity>;
  findReferrer(referrer: number): Promise<UserEntity>;
  isUsernameExist(username: string, excluded_id?: number): Promise<boolean>;
}
