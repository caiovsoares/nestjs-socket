import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { Public } from 'src/auth/constants';
import { UserData } from 'src/interfaces';
import { CreateUserDTO } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  create(@Body() data: CreateUserDTO): Promise<UserData> {
    console.log(data);
    return this.userService.create(data);
  }

  @Get()
  findOne(@Request() req: any) {
    return this.userService.findOne(req.user.id);
  }
}
