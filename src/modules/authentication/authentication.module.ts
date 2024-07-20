import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../users/user.module';
import { jwtConstants } from 'src/configs/jwt.config';
import { AuthenticationController } from './authentication.controller';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { AuthenticationService } from './authentication.service';
import { LocalStrategy } from 'src/strategies/local.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: jwtConstants.expiration || '1h',
      },
    }),
  ],
  providers: [AuthenticationService, LocalStrategy, JwtStrategy],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
