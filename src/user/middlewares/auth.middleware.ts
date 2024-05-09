import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserService } from '../user.service';
import { NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req, _: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization;

    try {
      const decode = this.userService.verifyToken(
        token,
        process.env.JWT_SECRET,
      );
      req.user = await this.userService.findById(decode.id);
      next();
    } catch (err) {
      req.user = null;
      next();
    }
  }
}
