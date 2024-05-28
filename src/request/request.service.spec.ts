import { Test, TestingModule } from '@nestjs/testing';
import { RequestService } from './request.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Request, RequestStatus } from './request.entity';
import { Product } from '../product/product.entity';
import { Repository } from 'typeorm';
import { LogistService } from '../logist/logist.service';
import { SupplierService } from '../supplier/supplier.service';
import { CreateRequestDto } from './dtos/CreateRequest.dto';
import { ReplyDto } from './dtos/Reply.dto';
import { ChangeStatusDto } from './dtos/ChangeStatus.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('RequestService', () => {
  let service: RequestService;
  let requestRepository: Repository<Request>;
  let productRepository: Repository<Product>;
  let logistService: LogistService;
  let supplierService: SupplierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestService,
        {
          provide: getRepositoryToken(Request),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
        {
          provide: LogistService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: SupplierService,
          useValue: {
            getById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RequestService>(RequestService);
    requestRepository = module.get<Repository<Request>>(getRepositoryToken(Request));
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    logistService = module.get<LogistService>(LogistService);
    supplierService = module.get<SupplierService>(SupplierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new request', async () => {
      const logistId = '1';
      const createRequestDto: CreateRequestDto = {
        productInfo: [
          { productId: '1', quantity: 10 },
          { productId: '2', quantity: 5 },
        ],
      };

      const logist = { id: '1' };
      const products = [
        { id: '1', supplier: { id: 'supplier1' } },
        { id: '2', supplier: { id: 'supplier1' } },
      ];
      const supplier = { id: 'supplier1' };

      jest.spyOn(logistService, 'findOne').mockResolvedValue(logist);
      jest.spyOn(productRepository, 'findBy').mockResolvedValue(products);
      jest.spyOn(supplierService, 'getById').mockResolvedValue(supplier);
      jest.spyOn(requestRepository, 'save').mockResolvedValue({});

      await service.create(logistId, createRequestDto);

      expect(logistService.findOne).toHaveBeenCalledWith(logistId);
      expect(productRepository.findBy).toHaveBeenCalledWith({ id: expect.anything() });
      expect(supplierService.getById).toHaveBeenCalledWith('supplier1');
      expect(requestRepository.save).toHaveBeenCalled();
    });

    it('should throw an error if products have different suppliers', async () => {
      const logistId = '1';
      const createRequestDto: CreateRequestDto = {
        productInfo: [
          { productId: '1', quantity: 10 },
          { productId: '2', quantity: 5 },
        ],
      };

      const logist = { id: '1' };
      const products = [
        { id: '1', supplier: { id: 'supplier1' } },
        { id: '2', supplier: { id: 'supplier2' } },
      ];

      jest.spyOn(logistService, 'findOne').mockResolvedValue(logist);
      jest.spyOn(productRepository, 'findBy').mockResolvedValue(products);

      await expect(service.create(logistId, createRequestDto)).rejects.toThrowError('All products must have the same supplier');
    });
  });

  describe('supReplyToRequest', () => {
    it('should update the status of the request', async () => {
      const requestId = '1';
      const supplierId = '1';
      const replyDetails: ReplyDto = { confirm: true };

      const request = {
        id: '1',
        status: RequestStatus.IN_PROCESS,
        supplier: { id: '1' },
      };

      jest.spyOn(requestRepository, 'findOne').mockResolvedValue(request);
      jest.spyOn(requestRepository, 'update').mockResolvedValue({ affected: 1 });

      const result = await service.supReplyToRequest(requestId, supplierId, replyDetails);

      expect(requestRepository.findOne).toHaveBeenCalledWith({ where: { id: requestId }, relations: { supplier: true } });
      expect(requestRepository.update).toHaveBeenCalledWith({ id: requestId }, { status: RequestStatus.CONFIRMED });
      expect(result).toEqual({ newStatus: RequestStatus.CONFIRMED });
    });

    it('should throw NotFoundException if request not found', async () => {
      const requestId = '1';
      const supplierId = '1';
      const replyDetails: ReplyDto = { confirm: true };

      jest.spyOn(requestRepository, 'findOne').mockResolvedValue(null);

      await expect(service.supReplyToRequest(requestId, supplierId, replyDetails)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if supplier mismatch', async () => {
      const requestId = '1';
      const supplierId = '1';
      const replyDetails: ReplyDto = { confirm: true };

      const request = {
        id: '1',
        status: RequestStatus.IN_PROCESS,
        supplier: { id: '2' },
      };

      jest.spyOn(requestRepository, 'findOne').mockResolvedValue(request);

      await expect(service.supReplyToRequest(requestId, supplierId, replyDetails)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if request status is not IN_PROCESS', async () => {
      const requestId = '1';
      const supplierId = '1';
      const replyDetails: ReplyDto = { confirm: true };

      const request = {
        id: '1',
        status: RequestStatus.CONFIRMED,
        supplier: { id: '1' },
      };

      jest.spyOn(requestRepository, 'findOne').mockResolvedValue(request);

      await expect(service.supReplyToRequest(requestId, supplierId, replyDetails)).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return a request', async () => {
      const id = '1';
      const request = { id: '1' };

      jest.spyOn(requestRepository, 'findOne').mockResolvedValue(request);

      expect(await service.findOne(id)).toEqual(request);
    });

    it('should throw NotFoundException if request not found', async () => {
      const id = '1';

      jest.spyOn(requestRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('changeRequestStatus', () => {
    it('should change the status of the request', async () => {
      const requestId = '1';
      const status: ChangeStatusDto = { status: RequestStatus.CONFIRMED };

      const request = { id: '1', status: RequestStatus.IN_PROCESS };

      jest.spyOn(service, 'findOne').mockResolvedValue(request);
      jest.spyOn(requestRepository, 'save').mockResolvedValue(request);

      expect(await service.changeRequestStatus(requestId, status)).toEqual(true);
      expect(requestRepository.save).toHaveBeenCalledWith({ ...request, status: RequestStatus.CONFIRMED });
    });

    it('should throw ConflictException if status change is invalid', async () => {
      const requestId = '1';
      const status: ChangeStatusDto = { status: RequestStatus.IN_PROCESS };

      const request = { id: '1', status: RequestStatus.CONFIRMED };

      jest.spyOn(service, 'findOne').mockResolvedValue(request);

      await expect(service.changeRequestStatus(requestId, status)).rejects.toThrow(ConflictException);
    });
  });

  describe('confirmRequest', () => {
    it('should confirm the request', async () => {
      const logistId = '1';
      const requestId = '1';

      const logist = { id: '1' };
      const request = { id: '1', status: RequestStatus.WAITING_FOR_PAYMENT, logist: { id: '2' } };

      jest.spyOn(logistService, 'findOne').mockResolvedValue(logist);
      jest.spyOn(service, 'findOne').mockResolvedValue(request);
      jest.spyOn(requestRepository, 'save').mockResolvedValue(request);

      expect(await service.confirmRequest(logistId, requestId)).toEqual(true);
      expect(requestRepository.save).toHaveBeenCalledWith({ ...request, status: RequestStatus.COMPLETED });
    });

    it('should throw ConflictException if logist is invalid', async () => {
      const logistId = '1';
      const requestId = '1';

      const logist = { id: '1' };
      const request = { id: '1', status: RequestStatus.WAITING_FOR_PAYMENT, logist: { id: '1' } };

      jest.spyOn(logistService, 'findOne').mockResolvedValue(logist);
      jest.spyOn(service, 'findOne').mockResolvedValue(request);

      await expect(service.confirmRequest(logistId, requestId)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if request status is not WAITING_FOR_PAYMENT', async () => {
      const logistId = '1';
      const requestId = '1';

      const logist = { id: '1' };
      const request = { id: '1', status: RequestStatus.CONFIRMED, logist: { id: '2' } };

      jest.spyOn(logistService, 'findOne').mockResolvedValue(logist);
      jest.spyOn(service, 'findOne').mockResolvedValue(request);

      await expect(service.confirmRequest(logistId, requestId)).rejects.toThrow(ConflictException);
    });
  });
});
