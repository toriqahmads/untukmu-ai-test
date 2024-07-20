import { Test, TestingModule } from '@nestjs/testing';
import { IsUsernameAlreadyExist } from './username.unique.validator';
import { UserService } from 'src/modules/users/user.service';
import { ValidationArguments } from 'class-validator';

describe('IsUsernameAlreadyExist', () => {
  let validator: IsUsernameAlreadyExist;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IsUsernameAlreadyExist,
        {
          provide: UserService,
          useValue: {
            isUsernameExist: jest.fn(),
          },
        },
      ],
    }).compile();

    validator = module.get<IsUsernameAlreadyExist>(IsUsernameAlreadyExist);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(validator).toBeDefined();
  });

  describe('validate', () => {
    it('should return true if username does not exist', async () => {
      jest.spyOn(userService, 'isUsernameExist').mockResolvedValue(false);
      const args = {
        object: { context: { params: { id: 1 } } },
      } as ValidationArguments;
      const result = await validator.validate('newuser', args);
      expect(result).toBe(true);
    });

    it('should return false if username exists', async () => {
      jest.spyOn(userService, 'isUsernameExist').mockResolvedValue(true);
      const args = {
        object: { context: { params: { id: 1 } } },
      } as ValidationArguments;
      const result = await validator.validate('existinguser', args);
      expect(result).toBe(false);
    });

    it('should pass the correct parameters to isUsernameExist', async () => {
      const isUsernameExistSpy = jest
        .spyOn(userService, 'isUsernameExist')
        .mockResolvedValue(false);
      const args = {
        object: { context: { params: { id: 1 } } },
      } as ValidationArguments;
      await validator.validate('testuser', args);
      expect(isUsernameExistSpy).toHaveBeenCalledWith('testuser', 1);
    });

    it('should handle case when context is not provided', async () => {
      jest.spyOn(userService, 'isUsernameExist').mockResolvedValue(false);
      const args = {
        object: {},
      } as ValidationArguments;
      const result = await validator.validate('newuser', args);
      expect(result).toBe(true);
    });
  });

  describe('defaultMessage', () => {
    it('should return the correct error message', () => {
      const args = {
        property: 'username',
        value: 'existinguser',
      } as ValidationArguments;
      const message = validator.defaultMessage(args);
      expect(message).toBe('username existinguser already exist');
    });
  });
});
