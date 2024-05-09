import { Module } from '@nestjs/common';
import { LogistController } from './logist.controller';
import { LogistService } from './logist.service';

@Module({
  controllers: [LogistController],
  providers: [LogistService]
})
export class LogistModule {}
