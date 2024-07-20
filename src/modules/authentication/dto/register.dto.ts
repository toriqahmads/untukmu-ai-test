import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { IsReferralCodeUserValid } from 'src/validators/referral.code.exist.validator';
import { IsUsernameUserAlreadyExist } from 'src/validators/username.unique.validator';

export class RegisterDto {
  @IsString()
  @IsUsernameUserAlreadyExist()
  @ApiProperty({
    type: String,
  })
  username: string;

  @IsString()
  @ApiProperty({
    type: String,
  })
  password: string;

  @IsString()
  @IsOptional()
  @IsReferralCodeUserValid()
  @ApiPropertyOptional({
    type: String,
  })
  referralCode?: string;
}
