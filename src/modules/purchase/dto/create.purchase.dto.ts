import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { BaseCreateDto } from 'src/modules/base/dto/base.create.dto';

export class CreatePurchaseDto extends BaseCreateDto {
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  amount: number;
}
