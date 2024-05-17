import { Injectable, NotFoundException } from '@nestjs/common';
import { Supplier } from './supplier.entity';
import { CreateSupplierDto } from './dtos/CreateSupplier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { EditSupplierDto } from './dtos/EditSupplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    private readonly userService: UserService,
  ) {}

  async updateSupplier(
    user: User,
    supplierDto: EditSupplierDto,
  ): Promise<boolean> {
    let supplier = await this.supplierRepository.findOneBy({
      user: { id: user.id },
    });

    if (!supplier) {
      return false;
    }

    await this.userService.updateUser(user.id, supplierDto);

    supplier = { ...supplier, ...supplierDto };
    await this.supplierRepository.save(supplier);
    return true;
  }

  supReplyToRequest(requestId: number, replyDetails: any): void {
    // Логика ответа на заявку от логиста
  }

  changeRequestStatus(requestId: number, status: string): void {
    // Логика изменения статуса заявки на поставку
  }

  viewRequestHistorySupplier(supplierId: number): any {
    // Логика просмотра истории заявок
  }

  addProductToCatalog(userId: number, productDetails: any): void {
    // Логика добавления товара в каталог
  }

  async createSupplier(dto: CreateSupplierDto) {
    const user: User = await this.userService.createUser(dto);

    const supplier = this.supplierRepository.create({
      companyAddress: dto.companyAddress,
      companyName: dto.companyName,
      productType: dto.productType,
      user: user,
    });

    await this.supplierRepository.save(supplier);
    return true;
  }

  async getById(id: string) {
    const supplier = this.supplierRepository.findOneBy({ id: id });
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }
    return supplier;
  }
}
