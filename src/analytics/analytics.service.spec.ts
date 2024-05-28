import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisService } from './analysis.service';
import { RequestRepository } from '../request/request.repository';
import { SupplierRepository } from '../supplier/supplier.repository';

describe('AnalysisService', () => {
  let service: AnalysisService;
  let requestRepository: Partial<RequestRepository>;
  let supplierRepository: Partial<SupplierRepository>;

  beforeEach(async () => {
    requestRepository = {
      countRequestsForMonth: jest.fn().mockResolvedValue(10),
      count: jest.fn().mockResolvedValue(5),
      getRequestsForMonth: jest.fn().mockResolvedValue([{ cost: 100 }, { cost: 200 }]),
    };

    supplierRepository = {
      getAllSuppliers: jest.fn().mockResolvedValue([
        { id: 1, name: 'Supplier1', requests: [{ month: '2023-05', cost: 100 }, { month: '2023-05', cost: 150 }] },
        { id: 2, name: 'Supplier2', requests: [{ month: '2023-05', cost: 200 }] },
      ]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalysisService,
        { provide: RequestRepository, useValue: requestRepository },
        { provide: SupplierRepository, useValue: supplierRepository },
      ],
    }).compile();

    service = module.get<AnalysisService>(AnalysisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return total requests for a given month', async () => {
    const result = await service.getTotalRequests('2023-05');
    expect(result).toEqual({ totalRequests: 10 });
  });

  it('should return rejected requests for a given month', async () => {
    const result = await service.getRejectedRequests('2023-05');
    expect(result).toEqual(5);
    expect(requestRepository.count).toHaveBeenCalledWith({ where: { month: '2023-05', status: 'rejected' } });
  });

  it('should return completed requests for a given month', async () => {
    const result = await service.getCompletedRequests('2023-05');
    expect(result).toEqual(5);
    expect(requestRepository.count).toHaveBeenCalledWith({ where: { month: '2023-05', status: 'done' } });
  });

  it('should calculate payments for suppliers for a given month', async () => {
    const result = await service.calculatePaymentsForSuppliers('2023-05');
    expect(result).toEqual([
      { supplierId: 1, supplierName: 'Supplier1', totalPayment: 250 },
      { supplierId: 2, supplierName: 'Supplier2', totalPayment: 200 },
    ]);
    expect(supplierRepository.getAllSuppliers).toHaveBeenCalled();
  });

  it('should generate monthly report for a given month', async () => {
    const result = await service.generateMonthlyReport('2023-05');
    expect(result).toEqual({
      requests: [{ cost: 100 }, { cost: 200 }],
      totalCost: 300,
    });
    expect(requestRepository.getRequestsForMonth).toHaveBeenCalledWith('2023-05');
  });
});
