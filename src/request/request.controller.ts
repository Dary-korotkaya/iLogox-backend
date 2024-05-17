import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RequestService } from './request.service';
import { UserGuard } from '../user/guards/user.guard';
import { Role } from '../user/decorators/role.decorator';
import { Roles } from '../user/domain/roles.enum';
import { CreateRequestDto } from './dtos/CreateRequest.dto';
import { Me } from '../user/decorators/Me.decorator';
import { Logist } from '../logist/logist.entity';
import { ReplyDto } from './dtos/Reply.dto';
import { ChangeStatusDto } from './dtos/ChangeStatus.dto';

@Controller('request')
@UseGuards(UserGuard)
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post('create')
  @Role(Roles.LOGISTIC)
  create(
    @Me('logist') logist: Logist,
    @Body() createRequestDto: CreateRequestDto,
  ) {
    return this.requestService.create(logist.id, createRequestDto);
  }

  @Post('reply/:requestId')
  @Role(Roles.SUPPLIER)
  async replyToRequest(
    @Me('supplier') supplier,
    @Body() replyDetails: ReplyDto,
    @Param('requestId') requestId: string,
  ) {
    return this.requestService.supReplyToRequest(
      requestId,
      supplier.id,
      replyDetails,
    );
  }

  @Post('change-status/:requestId')
  @Role(Roles.SUPPLIER)
  async changeRequestStatus(
    @Param('requestId') requestId: string,
    @Body('status') status: ChangeStatusDto,
  ) {
    const success = await this.requestService.changeRequestStatus(
      requestId,
      status,
    );
    return { success };
  }

  @Post('confirm/:requestId')
  @Role(Roles.LOGISTIC)
  async confirmRequest(
    @Me('logist') logist: Logist,
    @Param('requestId') requestId: string,
  ) {
    const success = await this.requestService.confirmRequest(
      logist.id,
      requestId,
    );
    return { success };
  }

  @Get('all/current')
  @Role(Roles.LOGISTIC)
  async getAllCurrentRequests(@Me('logist') logist: Logist) {
    return this.requestService.getAllCurrentRequests(logist.id);
  }

  @Get('all/history')
  @Role(Roles.LOGISTIC)
  async getAllHistoryRequests(@Me('logist') logist: Logist) {
    return this.requestService.getAllHistoryRequests(logist.id);
  }

  @Get('supplier/current')
  @Role(Roles.SUPPLIER)
  async getSupplierCurrentRequests(@Me('supplier') supplier) {
    return this.requestService.getSupplierCurrentRequests(supplier.id);
  }

  @Get('supplier/history')
  @Role(Roles.SUPPLIER)
  async getSupplierHistoryRequests(@Me('supplier') supplier) {
    return this.requestService.getSupplierHistoryRequests(supplier.id);
  }
}
