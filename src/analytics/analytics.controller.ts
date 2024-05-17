import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { UserGuard } from '../user/guards/user.guard';
import { Roles } from '../user/domain/roles.enum';
import { Role } from '../user/decorators/role.decorator';
import { RequestService } from '../request/request.service';
import { ReportService } from './report.service';

@Controller('analytics')
@UseGuards(UserGuard)
export class AnalyticsController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get('overview')
  @Role(Roles.ADMIN)
  getOverview() {
    return this.analysisService.getOverview();
  }

  @Get('total-requests')
  @Role(Roles.ADMIN)
  getTotalRequests(@Query('month') month: string) {
    return this.analysisService.getTotalRequests(month);
  }

  @Get('rejected-requests')
  @Role(Roles.ADMIN)
  getRejectedRequests(@Query('month') month: string) {
    return this.analysisService.getRejectedRequests(month);
  }

  @Get('completed-requests')
  @Role(Roles.ADMIN)
  getCompletedRequests(@Query('month') month: string) {
    return this.analysisService.getCompletedRequests(month);
  }

  @Get('supplier-payments')
  @Role(Roles.ADMIN)
  getSupplierPayments(@Query('month') month: string) {
    return this.analysisService.getSupplierPayments(month);
  }

  @Get('monthly-report')
  @Role(Roles.ADMIN)
  generateMonthlyReport(@Query('month') month: string) {
    return this.analysisService.generateMonthlyReport(month);
  }
}
