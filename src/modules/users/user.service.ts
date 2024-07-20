import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { BaseService } from '../base/base.service';
import { UserEntity } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMapper } from './mapper/user.mapper';
import { IUserService } from './interface/user.service.interface';

@Injectable()
export class UserService
  extends BaseService<UserEntity, CreateUserDto, UpdateUserDto>
  implements IUserService
{
  constructor(
    @InjectRepository(UserEntity)
    protected repository: Repository<UserEntity>,
    protected mapper: UserMapper,
  ) {
    super(repository, mapper);
  }

  async create(createDto: CreateUserDto): Promise<UserEntity> {
    try {
      const payload = this.mapper.toCreatePayload(createDto);
      if (createDto.referralCode) {
        const referrer = await this.findByReferralCode(createDto.referralCode);
        payload.referrer = referrer.userId;
      }
      const entity = await this.repository.save(payload);

      return Promise.resolve(entity);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async findByUsername(username: string): Promise<UserEntity> {
    try {
      const where = this.mapper.toFindOneByUsername(username);
      const user = await this.repository.findOne(where);

      return Promise.resolve(user);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async findByReferralCode(referralCode: string): Promise<UserEntity> {
    try {
      const where = this.mapper.toFindOneByReferralCode(referralCode);
      const user = await this.repository.findOne(where);

      return Promise.resolve(user);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async findReferrer(referrer: number): Promise<UserEntity> {
    try {
      const where = this.mapper.toFindOneReferrer(referrer);
      const user = await this.repository.findOne(where);

      return Promise.resolve(user);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async isUsernameExist(
    username: string,
    excluded_id?: number,
  ): Promise<boolean> {
    try {
      const where = this.mapper.toCheckUsernameExist(username, excluded_id);
      const exist = await this.repository.exists(where);

      return Promise.resolve(exist);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
