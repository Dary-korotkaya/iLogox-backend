import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRequestDto } from './dtos/CreateRequest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Request, RequestStatus } from './request.entity';
import { LogistService } from '../logist/logist.service';
import { Product } from '../product/product.entity';
import { SupplierService } from '../supplier/supplier.service';
import { ReplyDto } from './dtos/Reply.dto';
import { ChangeStatusDto } from './dtos/ChangeStatus.dto';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request) private requestRepository: Repository<Request>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private readonly logistService: LogistService,
    private readonly supplierService: SupplierService,
  ) {}

  async create(logistId: string, createRequestDto: CreateRequestDto) {
    const logist = await this.logistService.findOne(logistId);

    const productIds = createRequestDto.productInfo.map(
      (info) => info.productId,
    );
    const products = await this.productRepository.findBy({
      id: In(productIds),
    });

    const supplierIds = new Set(products.map((product) => product.supplier.id));
    if (supplierIds.size !== 1) {
      throw new Error('All products must have the same supplier');
    }

    const supplier = await this.supplierService.getById(
      Array.from(supplierIds)[0],
    );

    const request = this.requestRepository.create({
      ...createRequestDto,
      logist: logist,
      supplier: supplier,
      productInfo: products.map((product, i) => ({
        product,
        quantity: createRequestDto.productInfo[i].quantity,
      })),
    });

    return this.requestRepository.save(request);
  }

  async supReplyToRequest(
    requestId: string,
    supplierId: string,
    replyDetails: ReplyDto,
  ) {
    const request = await this.requestRepository.findOne({
      where: { id: requestId },
      relations: { supplier: true },
    });
    if (!request) {
      throw new NotFoundException('Request not found');
    }
    if (request.supplier.id !== supplierId) {
      throw new ConflictException('This supplier cannot reply to this request');
    }
    if (request.status !== RequestStatus.IN_PROCESS) {
      throw new ConflictException('Request is not in process');
    }
    const newStatus = replyDetails.confirm
      ? RequestStatus.CONFIRMED
      : RequestStatus.REJECTED;
    const result = await this.requestRepository.update(
      { id: requestId },
      {
        status: newStatus,
      },
    );
    if (result.affected === 0) {
      throw new ConflictException('Failed to update request');
    }

    return {
      newStatus: newStatus,
    };
  }
  async findOne(id: string): Promise<Request> {
    const request = this.requestRepository.findOne({
      where: { id: id },
      relations: ['logist', 'supplier'],
    });
    if (!request) {
      throw new NotFoundException('Request not found');
    }
    return request;
  }
  async changeRequestStatus(requestId: string, status: ChangeStatusDto) {
    const request = await this.findOne(requestId);

    if (request.status >= status.status) {
      throw new ConflictException(
        'Cannot move to a previous or the same status',
      );
    }

    if (status.status - request.status > 1) {
      throw new ConflictException('Can only move to the next status');
    }

    request.status = status.status;
    await this.requestRepository.save(request);
    return true;
  }

  async confirmRequest(logistId: string, requestId: string) {
    const logist = await this.logistService.findOne(logistId);
    const request = await this.findOne(requestId);

    if (request.logist.id === logist.id) {
      throw new ConflictException('This logist cannot confirm this request');
    }
    if (request.status !== RequestStatus.WAITING_FOR_PAYMENT) {
      throw new ConflictException('Request is not confirmed');
    }

    request.status = RequestStatus.COMPLETED;
    await this.requestRepository.save(request);
    return true;
  }

  getAllCurrentRequests(id: string) {
    return Promise.resolve(undefined);
  }

  getAllHistoryRequests(id: string) {
    return Promise.resolve(undefined);
  }

  getSupplierCurrentRequests(id) {
    return Promise.resolve(undefined);
  }

  getSupplierHistoryRequests(id) {
    return Promise.resolve(undefined);
  }
}
