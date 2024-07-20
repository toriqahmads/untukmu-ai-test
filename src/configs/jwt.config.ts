import { ConfigService } from '@nestjs/config';

const configService: ConfigService = new ConfigService();

export const jwtConstants = {
  secret: configService.get<string>('JWT_SECRET', 'secret1234'),
  refresh_secret: configService.get<string>(
    'JWT_REFRESH_SECRET',
    'refreshsecret1234',
  ),
  expiration: Number(configService.get<number>('JWT_EXPIRATION', 3600)),
  refresh_expiration: Number(
    configService.get<number>('JWT_REFRESH_EXPIRATION', 7200),
  ),
};
