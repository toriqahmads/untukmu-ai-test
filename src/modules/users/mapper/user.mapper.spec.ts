import { UserMapper } from './user.mapper';
import { UserEntity } from 'src/entities/user.entity';
import { Like, Not } from 'typeorm';
import { CreateUserDto } from '../dto/create.user.dto';
import { UpdateUserDto } from '../dto/update.user.dto';
import { FindAllUserDto } from '../dto/findall.user.dto';

describe('UserMapper', () => {
  let mapper: UserMapper;

  beforeEach(() => {
    mapper = new UserMapper();
  });

  describe('toCreatePayload', () => {
    it('should map CreateUserDto to UserEntity', () => {
      const _createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password123',
        referralCode: 'TEST123',
      };
      const createUserDto = new CreateUserDto();
      Object.assign(createUserDto, _createUserDto);

      const result = mapper.toCreatePayload(createUserDto);

      expect(result).toBeInstanceOf(UserEntity);
      expect(result.username).toBe(createUserDto.username);
      expect(result.password).toBe(createUserDto.password);
      expect(result.referralCode).toBe(createUserDto.referralCode);
    });
  });

  describe('toUpdatePayload', () => {
    it('should map UpdateUserDto to partial UserEntity', () => {
      const _updateUserDto: UpdateUserDto = {
        password: 'updateduser',
      };
      const updateUserDto = new UpdateUserDto();
      Object.assign(updateUserDto, _updateUserDto);

      const result = mapper.toUpdatePayload(updateUserDto);

      expect(result).toBeInstanceOf(UserEntity);
      expect(result.password).toBe(updateUserDto.password);
    });
  });

  describe('toFindAllPayload', () => {
    it('should create FindManyOptions from FindAllUserDto', () => {
      const _findAllUserDto: FindAllUserDto = {
        page: 2,
        limit: 15,
        username: 'test',
        refferalCode: 'REF123',
        referredBy: 'referrer',
        referrerId: 1,
      };
      const findAllUserDto = new FindAllUserDto();
      Object.assign(findAllUserDto, _findAllUserDto);

      const expectWhere = {
        username: Like('%test%'),
        referralCode: 'REF123',
        referredBy: { username: Like('%referrer%') },
        referrer: 1,
      };

      const result = mapper.toFindAllPayload(findAllUserDto);

      expect(result.skip).toBe(15);
      expect(result.take).toBe(15);
      expect(result.where).toEqual(expectWhere);
    });

    it('should use default values when page and limit are not provided', () => {
      const findAllUserDto = new FindAllUserDto();

      const result = mapper.toFindAllPayload(findAllUserDto);

      expect(result.skip).toBe(0);
      expect(result.take).toBe(25);
    });
  });

  describe('toFindOne', () => {
    it('should create FindOneOptions for finding by id', () => {
      const id = 1;

      const result = mapper.toFindOne(id);

      expect(result.where).toEqual({ userId: id });
      expect(result.relationLoadStrategy).toBe('join');
    });
  });

  describe('toFindOneByUsername', () => {
    it('should create FindOneOptions for finding by username', () => {
      const username = 'testuser';

      const result = mapper.toFindOneByUsername(username);

      expect(result.where).toEqual({ username });
    });
  });

  describe('toFindOneReferrer', () => {
    it('should create FindOneOptions for finding referrer', () => {
      const referrer = 1;

      const result = mapper.toFindOneReferrer(referrer);

      expect(result.where).toEqual({ userId: referrer });
    });
  });

  describe('toFindOneByReferralCode', () => {
    it('should create FindOneOptions for finding by referral code', () => {
      const referralCode = 'REF123';

      const result = mapper.toFindOneByReferralCode(referralCode);

      expect(result.where).toEqual({ referralCode });
    });
  });

  describe('toCheckUsernameExist', () => {
    it('should create FindOneOptions for checking username existence', () => {
      const username = 'testuser';

      const result = mapper.toCheckUsernameExist(username);

      expect(result.where).toEqual({ username });
      expect(result.withDeleted).toBe(true);
    });

    it('should exclude a specific id when provided', () => {
      const username = 'testuser';
      const excludedId = 1;

      const result = mapper.toCheckUsernameExist(username, excludedId);

      expect(result.where).toEqual({
        username,
        userId: Not(1),
      });
      expect(result.withDeleted).toBe(true);
    });
  });
});
