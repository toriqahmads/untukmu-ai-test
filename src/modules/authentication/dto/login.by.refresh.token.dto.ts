import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseCreateDto } from 'src/modules/base/dto/base.create.dto';

export class LoginByRefreshTokenDto extends BaseCreateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  refreshToken: string;
}
