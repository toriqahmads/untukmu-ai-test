import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseFindAllDto } from 'src/modules/base/dto/base.findall.dto';

export class FindAllUserDto extends BaseFindAllDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  username?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  refferalCode?: string;
}
