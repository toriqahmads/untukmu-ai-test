import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseCreateDto } from 'src/modules/base/dto/base.create.dto';
import { IsReferralCodeUserValid } from 'src/validators/referral.code.exist.validator';
import { IsUsernameUserAlreadyExist } from 'src/validators/username.unique.validator';

export class CreateUserDto extends BaseCreateDto {
  @IsString()
  @IsUsernameUserAlreadyExist()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsReferralCodeUserValid()
  @ApiPropertyOptional()
  referralCode?: string;
}
