import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create.purchase.dto';
import { FindAllPurchaseDto } from './dto/findall.purchase.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@ApiTags('PURCHASE')
@Controller({
  path: 'purchases',
  version: '1',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  create(@Body() createPurchaseDto: CreatePurchaseDto) {
    createPurchaseDto.userId = createPurchaseDto.context.user.userId;
    return this.purchaseService.create(createPurchaseDto);
  }

  @Get()
  findAll(@Query() findAllDto: FindAllPurchaseDto) {
    return this.purchaseService.findAll(findAllDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.purchaseService.findById(id);
  }
}
