import { Module, Provider } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOption } from './configs/typeorm.config';
import { IsUsernameAlreadyExist } from './validators/username.unique.validator';
import { UserModule } from './modules/users/user.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { IsReferralCodeValid } from './validators/referral.code.exist.validator';
import { PurchaseModule } from './modules/purchase/purchase.module';

const validators: Provider[] = [IsUsernameAlreadyExist, IsReferralCodeValid];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        ...TypeOrmModuleOption,
      }),
    }),
    UserModule,
    AuthenticationModule,
    PurchaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...validators],
})
export class AppModule {}
