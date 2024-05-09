import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Hello!';
  }
  getme(): number {
    return 1;
  }
}
