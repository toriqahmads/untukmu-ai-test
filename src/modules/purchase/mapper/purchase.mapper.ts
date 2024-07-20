import {
  Between,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { FindAllPurchaseDto } from '../dto/findall.purchase.dto';
import { CreatePurchaseDto } from '../dto/create.purchase.dto';
import { UpdatePurchaseDto } from '../dto/update.purchase.dto';
import { PurchaseEntity } from 'src/entities/purchase.entity';
import { BaseMapper } from 'src/modules/base/base.mapper';
import { IPurchaseMapper } from '../interface/purchase.mapper.interface';

export class PurchaseMapper
  extends BaseMapper<PurchaseEntity, CreatePurchaseDto, UpdatePurchaseDto>
  implements IPurchaseMapper
{
  toCreatePayload(createDto: CreatePurchaseDto): DeepPartial<PurchaseEntity> {
    const purchaseEntity = PurchaseEntity.newEntity(createDto);
    return purchaseEntity;
  }

  toUpdatePayload(
    updateDto: UpdatePurchaseDto,
  ): QueryDeepPartialEntity<PurchaseEntity> {
    const purchaseEntity = PurchaseEntity.newEntity(updateDto);
    return purchaseEntity;
  }

  toFindAllPayload(
    findAllDto: FindAllPurchaseDto,
  ): FindManyOptions<PurchaseEntity> {
    let { page, limit } = findAllDto;
    page = Number(page) || 1;
    limit = Number(limit) || 25;

    const payload: FindManyOptions<PurchaseEntity> = {
      skip: (page - 1) * limit,
      take: limit,
    };

    const where: FindOptionsWhere<PurchaseEntity> = {};
    if (findAllDto.userId) {
      where.userId = Number(findAllDto.userId);
    }
    if (findAllDto.startRangeAmount !== undefined) {
      where.amount = MoreThanOrEqual(Number(findAllDto.startRangeAmount));
    }
    if (findAllDto.endRangeAmount !== undefined) {
      where.amount = LessThanOrEqual(Number(findAllDto.endRangeAmount));
    }
    if (
      findAllDto.startRangeAmount !== undefined &&
      findAllDto.endRangeAmount !== undefined
    ) {
      where.amount = Between(
        Number(findAllDto.startRangeAmount),
        Number(findAllDto.endRangeAmount),
      );
    }

    payload.where = where;

    return payload;
  }

  toFindOne(id: number): FindOneOptions<PurchaseEntity> {
    return {
      where: {
        purchaseId: id,
      },
      relations: {
        user: true,
      },
      relationLoadStrategy: 'join',
    };
  }
}
