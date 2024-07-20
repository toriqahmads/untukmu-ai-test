import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { FindAllUserDto } from './dto/findall.user.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { IUserEntity } from './interface/user.entity.interface';
import { UserEntity } from 'src/entities/user.entity';
import { paginate } from 'src/helpers/pagination.helper';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    updateById: jest.fn(),
    removeById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const _createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password123',
        referralCode: 'TES123',
      };

      const createUserDto = new CreateUserDto();
      Object.assign(createUserDto, _createUserDto);

      const userEntity: IUserEntity = {
        userId: 1,
        username: createUserDto.username,
        password: 'hashedpassword',
        referralCode: createUserDto.referralCode,
        referrer: null,
        earnings: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const expectedResult = new UserEntity();
      Object.assign(expectedResult, userEntity);

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      expect(await controller.create(createUserDto)).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const _findAllDto: FindAllUserDto = { page: 1, limit: 10 };
      const findAllDto = new FindAllUserDto();
      Object.assign(findAllDto, _findAllDto);

      const user: IUserEntity = {
        userId: 1,
        username: 'user',
        password: 'hashedpassword',
        referralCode: 'TES123',
        referrer: null,
        earnings: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const userEntity = new UserEntity();
      Object.assign(userEntity, user);

      const userEntity2 = new UserEntity();
      Object.assign(userEntity2, {
        ...user,
        userId: 2,
        username: 'user2',
        referralCode: 'TES234',
      });

      const users = [userEntity, userEntity2];
      const expectedResult = paginate(
        users,
        users.length,
        findAllDto.page,
        findAllDto.limit,
      );

      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult);

      expect(await controller.findAll(findAllDto)).toBe(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(findAllDto);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = 1;
      const user: IUserEntity = {
        userId: 1,
        username: 'user',
        password: 'hashedpassword',
        referralCode: 'TES123',
        referrer: null,
        earnings: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const expectedResult = new UserEntity();
      Object.assign(expectedResult, user);

      jest.spyOn(service, 'findById').mockResolvedValue(expectedResult);

      expect(await controller.findOne(userId)).toBe(expectedResult);
      expect(service.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('findReferrals', () => {
    it('should return referrals for a user', async () => {
      const id = 1;
      const user: IUserEntity = {
        userId: 1,
        username: 'user',
        password: 'hashedpassword',
        referralCode: 'TES123',
        referrer: null,
        earnings: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const userEntity = new UserEntity();
      Object.assign(userEntity, user);

      const userEntity2 = new UserEntity();
      Object.assign(userEntity2, {
        ...user,
        userId: 2,
        username: 'user2',
        referralCode: 'TES234',
      });

      const users = [userEntity, userEntity2];
      const expectedResult = paginate(users, users.length, 1, 999);

      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult);

      expect(await controller.findReferrals(id)).toBe(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ referrerId: id }),
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = 1;
      const _updateUserDto: UpdateUserDto = { password: 'password' };
      const updateUserDto = new UpdateUserDto();
      Object.assign(updateUserDto, _updateUserDto);

      const user: IUserEntity = {
        userId: 1,
        username: 'user',
        password: 'hashedpassword',
        referralCode: 'TES123',
        referrer: null,
        earnings: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const expectedResult = new UserEntity();
      Object.assign(expectedResult, user);

      jest.spyOn(service, 'updateById').mockResolvedValue(expectedResult);

      expect(await controller.update(userId, updateUserDto)).toBe(
        expectedResult,
      );
      expect(service.updateById).toHaveBeenCalledWith(userId, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = 1;
      const user: IUserEntity = {
        userId: 1,
        username: 'user',
        password: 'hashedpassword',
        referralCode: 'TES123',
        referrer: null,
        earnings: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const expectedResult = new UserEntity();
      Object.assign(expectedResult, user);

      jest.spyOn(service, 'removeById').mockResolvedValue(expectedResult);

      expect(await controller.remove(userId)).toBe(expectedResult);
      expect(service.removeById).toHaveBeenCalledWith(userId);
    });
  });
});
