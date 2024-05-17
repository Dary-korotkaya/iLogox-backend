import { Injectable } from '@nestjs/common';
import { RequestRepository } from '../request/request.repository';
import { SupplierRepository } from '../supplier/supplier.repository';



@Injectable()
export class AnalysisService {
  constructor(
    private readonly requestRepository: RequestRepository,
    private readonly supplierRepository: SupplierRepository
  ) {}

  constructor(private readonly supplierRepository: SupplierRepository) {}


  async getTotalRequests(month: string) {
    const totalRequests = await this.requestRepository.countRequestsForMonth(month);
    return { totalRequests };
  }

  async getRejectedRequests(month: string) {
    const rejectedRequests = await this.requestRepository.count({ where: { month, status: 'rejected' } });
    return rejectedRequests;
  }

  async getCompletedRequests(month: string) {
      const rejectedRequests = await this.requestRepository.count({ where: { month, status: 'done' } });
      return rejectedRequests;
  }

   async calculatePaymentsForSuppliers(month: string): Promise<any[]> {
      // Логика подсчета оплаты каждому поставщику за месяц
      const suppliers = await this.supplierRepository.getAllSuppliers();
      const payments = [];

      for (const supplier of suppliers) {
        let totalPayment = 0;
        for (const request of supplier.requests) {
          if (request.month === month) {
            totalPayment += request.cost;
          }
        }
        payments.push({ supplierId: supplier.id, supplierName: supplier.name, totalPayment });
      }

      return payments;
    }
  }

  async generateMonthlyReport(month: string) {
    // Генерация отчета со всей информацией о заявках за месяц
    const requests = await this.requestRepository.getRequestsForMonth(month);
    const totalCost = requests.reduce((sum, request) => sum + request.cost, 0);

    return {
      requests,
      totalCost
    };
  }
}
