import { BaseEntity } from './base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'purcahses' })
export class PurchaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'purchase_id',
  })
  purchaseId: number;

  @Column({
    default: 0,
    type: 'double precision',
    precision: 2,
    name: 'amount',
  })
  amount: number;

  @Column({
    name: 'user_id',
  })
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.purchases, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'userId',
  })
  user: Partial<UserEntity>;

  static newEntity(partial: Partial<PurchaseEntity>) {
    const entity = new PurchaseEntity();
    delete partial['context'];
    return Object.assign(entity, partial);
  }
}
