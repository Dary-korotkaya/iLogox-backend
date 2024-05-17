import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalysisService } from './analysis.service';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalysisService],
})
export class AnalyticsModule {}
