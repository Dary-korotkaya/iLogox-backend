import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { ProductType, Supplier } from '../supplier/supplier.entity';
import { CreateProductDto } from './dtos/CreateProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async createProduct(
    supplier: Supplier,
    dto: CreateProductDto,
  ): Promise<boolean> {
    await this.productRepository.save({
      ...dto,
      supplier: supplier,
      type: supplier.productType,
    });
    return true;
  }

  async listProducts(type: ProductType, limit: number = 10, page: number = 1) {
    const query = this.productRepository.createQueryBuilder('product');

    if (type) {
      query.where('product.type = :type', { type });
    }

    if (limit) {
      query.limit(limit);
    }

    if (page) {
      query.offset((page - 1) * limit);
    }

    return query.getMany();
  }

  async updateProduct(supplier: Supplier, id: string, dto: CreateProductDto) {
    const product = await this.productRepository.findOneBy({ id: id });
    if (!product || product.supplier.id !== supplier.id) {
      throw new NotFoundException('Product not found');
    }
    await this.productRepository.save({ ...product, ...dto });

    return true;
  }
}
