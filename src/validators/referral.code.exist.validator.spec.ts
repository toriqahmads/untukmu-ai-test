import { Test, TestingModule } from '@nestjs/testing';
import { IsReferralCodeValid } from './referral.code.exist.validator';
import { UserService } from 'src/modules/users/user.service';
import { ValidationArguments } from 'class-validator';

describe('IsReferralCodeValid', () => {
  let validator: IsReferralCodeValid;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IsReferralCodeValid,
        {
          provide: UserService,
          useValue: {
            findByReferralCode: jest.fn(),
          },
        },
      ],
    }).compile();

    validator = module.get<IsReferralCodeValid>(IsReferralCodeValid);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(validator).toBeDefined();
  });

  describe('validate', () => {
    it('should return true if referral code does not exist', async () => {
      jest.spyOn(userService, 'findByReferralCode').mockResolvedValue(null);
      const result = await validator.validate(
        'NEWCODE',
        {} as ValidationArguments,
      );
      expect(result).toBe(true);
    });

    it('should return false if referral code exists', async () => {
      jest
        .spyOn(userService, 'findByReferralCode')
        .mockResolvedValue({ userId: 1 } as any);
      const result = await validator.validate(
        'EXISTINGCODE',
        {} as ValidationArguments,
      );
      expect(result).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return the correct error message', () => {
      const args = {
        property: 'referralCode',
        value: 'INVALIDCODE',
      } as ValidationArguments;
      const message = validator.defaultMessage(args);
      expect(message).toBe('referralCode INVALIDCODE is not valid');
    });
  });
});
