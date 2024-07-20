import { CreateUserDto } from '../dto/create.user.dto';
import { UpdateUserDto } from '../dto/update.user.dto';
import { FindAllUserDto } from '../dto/findall.user.dto';
import { IBaseMapper } from 'src/modules/base/interface/base.mapper.interface';
import { UserEntity } from 'src/entities/user.entity';
import { FindOneOptions } from 'typeorm';

export interface IUserMapper
  extends IBaseMapper<
    UserEntity,
    CreateUserDto,
    UpdateUserDto,
    FindAllUserDto
  > {
  toFindOneByUsername(username: string): FindOneOptions<UserEntity>;
  toFindOneReferrer(referrer: number): FindOneOptions<UserEntity>;
  toFindOneByReferralCode(referralCode: string): FindOneOptions<UserEntity>;
  toCheckUsernameExist(
    username: string,
    excludedId?: number,
  ): FindOneOptions<UserEntity>;
}
