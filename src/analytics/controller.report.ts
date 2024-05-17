import { Controller, Get, Query } from '@nestjs/common';
import { RequestService } from '../request/request.service';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(
    private readonly requestService: RequestService,
    private readonly reportService: ReportService,
  ) {}

  @Get('monthly')
  async generateMonthlyReport(@Query('month') month: string) {
    const requests = await this.requestService.getRequestsForMonth(month);
    this.reportService.generateMonthlyReport(requests, month);
    return { message: 'Monthly report generated successfully' };
  }
}
