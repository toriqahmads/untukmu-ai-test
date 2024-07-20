import { BaseEntity } from './base.entity';
import { hashSync } from 'bcrypt';
import { Exclude } from 'class-transformer';
import { randomString } from 'src/helpers/random.string.helper';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PurchaseEntity } from './purchase.entity';
import { IUserEntity } from 'src/modules/users/interface/user.entity.interface';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity implements IUserEntity {
  @PrimaryGeneratedColumn({
    name: 'user_id',
  })
  userId: number;

  @Column({
    unique: true,
    length: 20,
    name: 'username',
  })
  username: string;

  @Column({
    name: 'password',
  })
  @Exclude()
  password: string;

  @Column({
    unique: true,
    nullable: false,
    length: 6,
    name: 'referral_code',
  })
  referralCode: string;

  @Column({
    nullable: true,
    name: 'referrer',
  })
  referrer?: number;

  @Column({
    default: 0,
    type: 'double precision',
    precision: 2,
    name: 'earnings',
  })
  earnings: number;

  @OneToMany(() => PurchaseEntity, (purchases) => purchases.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'userId',
  })
  purchases?: Partial<UserEntity[]>;

  @ManyToOne(() => UserEntity, (referrer) => referrer.referrals, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({
    name: 'referrer',
    referencedColumnName: 'userId',
  })
  referredBy?: Partial<UserEntity>;

  @OneToMany(() => UserEntity, (referrals) => referrals.referredBy, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'referrer',
  })
  referrals?: Partial<UserEntity[]>;

  @BeforeInsert()
  hashPasswordBeforeInsert() {
    this.password = hashSync(this.password, 10);
    this.referralCode = randomString(6);
  }

  @BeforeUpdate()
  hashPasswordBeforeUpdate() {
    if (this.password && this.password != '') {
      this.password = hashSync(this.password, 10);
    }
  }

  static newEntity(partial: Partial<UserEntity>) {
    const entity = new UserEntity();
    delete partial['context'];
    return Object.assign(entity, partial);
  }
}
