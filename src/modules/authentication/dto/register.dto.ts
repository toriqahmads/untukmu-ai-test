import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
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
  @ApiPropertyOptional({
    type: String,
  })
  referralCode?: string;
}
