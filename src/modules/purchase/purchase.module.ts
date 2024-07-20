import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseEntity } from 'src/entities/purchase.entity';
import { PurchaseMapper } from './mapper/purchase.mapper';
import { UserModule } from '../users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseEntity]), UserModule],
  controllers: [PurchaseController],
  providers: [PurchaseService, PurchaseMapper],
  exports: [PurchaseService],
})
export class PurchaseModule {}
