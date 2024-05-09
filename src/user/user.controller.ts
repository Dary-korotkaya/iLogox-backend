import {
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('auth')
  async authenticate(
    @Body('login') login: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response,
  ) {
    try {
      const user = await this.userService.authenticateUser(login, password);

      const token = this.userService.createToken(user);

      response.cookie('token', token, { httpOnly: true });

      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw error;
    }
  }

}
