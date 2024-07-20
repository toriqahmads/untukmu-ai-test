import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { FindAllUserDto } from './dto/findall.user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@ApiTags('USER')
@Controller({
  path: 'users',
  version: '1',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Query() findAllDto: FindAllUserDto) {
    return this.userService.findAll(findAllDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findById(id);
  }

  @Get(':id/referrals')
  findReferrals(@Param('id') id: number) {
    const findAllDto = new FindAllUserDto();
    findAllDto.referrerId = id;
    return this.userService.findAll(findAllDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateById(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.removeById(id);
  }
}
