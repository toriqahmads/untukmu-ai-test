import { Injectable } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create.purchase.dto';
import { UpdatePurchaseDto } from './dto/update.purchase.dto';
import { BaseService } from '../base/base.service';
import { PurchaseEntity } from 'src/entities/purchase.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseMapper } from './mapper/purchase.mapper';
import { IPurchaseService } from './interface/purchase.service.interface';
import { UserService } from '../users/user.service';

@Injectable()
export class PurchaseService
  extends BaseService<PurchaseEntity, CreatePurchaseDto, UpdatePurchaseDto>
  implements IPurchaseService
{
  constructor(
    @InjectRepository(PurchaseEntity)
    protected repository: Repository<PurchaseEntity>,
    protected mapper: PurchaseMapper,
    protected userService: UserService,
  ) {
    super(repository, mapper);
  }

  async create(createDto: CreatePurchaseDto): Promise<PurchaseEntity> {
    try {
      const payload = this.mapper.toCreatePayload(createDto);
      const entity = await this.repository.save(payload);

      await this.processReferralEarning(entity.userId, entity.amount, 1);

      return Promise.resolve(entity);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async processReferralEarning(
    userReferredId: number,
    purchaseAmount: number,
    level: number = 1,
  ): Promise<void> {
    try {
      if (level > 2) return;

      const user = await this.userService.findById(userReferredId);
      if (!user.referrer) return;

      const referrer = await this.userService.findReferrer(user.referrer);
      if (!referrer) return;

      const earning =
        referrer.earnings +
        (level == 2 ? purchaseAmount * 0.05 : purchaseAmount * 0.1);

      await this.userService.updateEarning(referrer.userId, earning);

      level++;

      return this.processReferralEarning(
        referrer.userId,
        purchaseAmount,
        level,
      );
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
