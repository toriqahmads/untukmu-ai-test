import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { LocalAuthGuard } from 'src/guards/local.guard';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { LoginByRefreshTokenDto } from './dto/login.by.refresh.token.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('AUTHENTICATION')
@Controller({
  path: 'auth',
  version: '1',
})
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @ApiBody({
    schema: {
      properties: {
        username: {
          type: 'string',
          title: 'username',
          example: 'username',
        },
        password: {
          type: 'string',
          title: 'password',
          example: 'password123',
        },
      },
    },
  })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Request() req) {
    const { user } = req;
    return this.authenticationService.login(user);
  }

  @Post('register')
  async register(@Body() register: RegisterDto) {
    return this.authenticationService.register(register);
  }

  @Post('login/refresh-token')
  async loginByRefreshToken(@Body() payload: LoginByRefreshTokenDto) {
    return this.authenticationService.loginByRefreshToken(payload.refreshToken);
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  profile(@Request() req) {
    return req.user;
  }
}
