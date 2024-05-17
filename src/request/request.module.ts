import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestProductInfo } from './RequestProductInfo.entity';
import { Request } from './Request.entity';
import { UserModule } from '../user/user.module';
import { LogistModule } from '../logist/logist.module';
import { Product } from '../product/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Request, RequestProductInfo, Product]),
    UserModule,
    LogistModule,
  ],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
