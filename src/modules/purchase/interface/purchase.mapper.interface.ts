import { CreatePurchaseDto } from '../dto/create.purchase.dto';
import { UpdatePurchaseDto } from '../dto/update.purchase.dto';
import { FindAllPurchaseDto } from '../dto/findall.purchase.dto';
import { IBaseMapper } from 'src/modules/base/interface/base.mapper.interface';
import { PurchaseEntity } from 'src/entities/purchase.entity';

export interface IPurchaseMapper
  extends IBaseMapper<
    PurchaseEntity,
    CreatePurchaseDto,
    UpdatePurchaseDto,
    FindAllPurchaseDto
  > {}
