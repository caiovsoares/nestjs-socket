import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserLastRotation, UserLastPosition, User } from '@prisma/client';
import { UserService } from '../user/user.service';
import { AuthDTO } from './auth.dto';
import { UserData } from 'src/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser({ login, password }: AuthDTO): Promise<any> {
    const user = await this.userService.findOneAuth(login);
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(
    user: User & {
      lastPosition: UserLastPosition;
      lastRotation: UserLastRotation;
    },
  ) {
    const { id, lastPosition, lastRoom, lastRotation, login, nick } = user;

    const payload: UserData = {
      id,
      login,
      nick,
      lastPosition,
      lastRoom,
      lastRotation,
    };
    const userData: UserData & { access_token: string } = {
      access_token: this.jwtService.sign(payload),
      id,
      login,
      nick,
      lastRoom,
      lastPosition,
      lastRotation,
    };

    return userData;
  }
}
