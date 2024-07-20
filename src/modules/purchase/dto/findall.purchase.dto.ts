import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';
import { BaseFindAllDto } from 'src/modules/base/dto/base.findall.dto';

export class FindAllPurchaseDto extends BaseFindAllDto {
  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional()
  userId?: number;

  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional()
  startRangeAmount?: number;

  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional()
  endRangeAmount?: number;
}
