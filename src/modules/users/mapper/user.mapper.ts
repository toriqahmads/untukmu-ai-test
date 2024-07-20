import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Like,
  Not,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { FindAllUserDto } from '../dto/findall.user.dto';
import { CreateUserDto } from '../dto/create.user.dto';
import { UpdateUserDto } from '../dto/update.user.dto';
import { UserEntity } from 'src/entities/user.entity';
import { BaseMapper } from 'src/modules/base/base.mapper';
import { IUserMapper } from '../interface/user.mapper.interface';

export class UserMapper
  extends BaseMapper<UserEntity, CreateUserDto, UpdateUserDto>
  implements IUserMapper
{
  toCreatePayload(createDto: CreateUserDto): DeepPartial<UserEntity> {
    const userEntity = UserEntity.newEntity(createDto);
    return userEntity;
  }

  toUpdatePayload(
    updateDto: UpdateUserDto,
  ): QueryDeepPartialEntity<UserEntity> {
    const userEntity = UserEntity.newEntity(updateDto);
    return userEntity;
  }

  toFindAllPayload(findAllDto: FindAllUserDto): FindManyOptions<UserEntity> {
    let { page, limit } = findAllDto;
    page = Number(page) || 1;
    limit = Number(limit) || 25;

    const payload: FindManyOptions<UserEntity> = {
      skip: (page - 1) * limit,
      take: limit,
    };

    const where: FindOptionsWhere<UserEntity> = {};
    if (findAllDto.username) {
      where.username = Like(`%${findAllDto.username}%`);
    }
    if (findAllDto.refferalCode) {
      where.referralCode = findAllDto.refferalCode;
    }
    if (findAllDto.referredBy) {
      where.referredBy = {
        username: Like(`%${findAllDto.referredBy}%`),
      };
    }
    if (findAllDto.referrerId !== undefined) {
      where.referrer = Number(findAllDto.referrerId);
    }

    payload.where = where;

    return payload;
  }

  toFindOne(id: number): FindOneOptions<UserEntity> {
    return {
      where: {
        userId: id,
      },
      relationLoadStrategy: 'join',
    };
  }

  toFindOneByUsername(username: string): FindOneOptions<UserEntity> {
    return {
      where: {
        username,
      },
    };
  }

  toFindOneReferrer(referrer: number): FindOneOptions<UserEntity> {
    return {
      where: {
        userId: referrer,
      },
    };
  }

  toFindOneByReferralCode(referralCode: string): FindOneOptions<UserEntity> {
    return {
      where: {
        referralCode,
      },
    };
  }

  toCheckUsernameExist(
    username: string,
    excludedId?: number,
  ): FindOneOptions<UserEntity> {
    const where: FindOptionsWhere<UserEntity> = {
      username,
    };

    if (excludedId !== undefined) {
      where.userId = Not(Number(excludedId));
    }
    return {
      where,
      withDeleted: true,
    };
  }
}
