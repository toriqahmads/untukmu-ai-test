import { IBaseService } from 'src/modules/base/interface/base.service.interface';
import { CreatePurchaseDto } from '../dto/create.purchase.dto';
import { UpdatePurchaseDto } from '../dto/update.purchase.dto';
import { FindAllPurchaseDto } from '../dto/findall.purchase.dto';
import { PurchaseEntity } from 'src/entities/purchase.entity';

export interface IPurchaseService
  extends IBaseService<
    PurchaseEntity,
    CreatePurchaseDto,
    UpdatePurchaseDto,
    FindAllPurchaseDto
  > {}
