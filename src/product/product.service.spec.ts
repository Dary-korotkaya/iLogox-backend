import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/CreateProduct.dto';
import { NotFoundException } from '@nestjs/common';
import { Supplier } from '../supplier/supplier.entity';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const supplier: Supplier = { id: '1', productType: 'type1' } as Supplier;
      const dto: CreateProductDto = { name: 'Product1', price: 100 } as CreateProductDto;

      jest.spyOn(repository, 'save').mockResolvedValue({} as Product);

      expect(await service.createProduct(supplier, dto)).toEqual(true);
      expect(repository.save).toHaveBeenCalledWith({
        ...dto,
        supplier: supplier,
        type: supplier.productType,
      });
    });
  });

  describe('listProducts', () => {
    it('should return a list of products', async () => {
      const products = [{ id: '1', name: 'Product1' }, { id: '2', name: 'Product2' }] as Product[];
      jest.spyOn(repository, 'createQueryBuilder').mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(products),
      } as any));

      expect(await service.listProducts('type1', 10, 1)).toEqual(products);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const supplier: Supplier = { id: '1' } as Supplier;
      const dto: CreateProductDto = { name: 'UpdatedProduct', price: 150 } as CreateProductDto;
      const product: Product = { id: '1', supplier: supplier } as Product;

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(product);
      jest.spyOn(repository, 'save').mockResolvedValue(product);

      expect(await service.updateProduct(supplier, '1', dto)).toEqual(true);
      expect(repository.save).toHaveBeenCalledWith({ ...product, ...dto });
    });

    it('should throw NotFoundException if product not found or supplier mismatch', async () => {
      const supplier: Supplier = { id: '1' } as Supplier;
      const dto: CreateProductDto = { name: 'UpdatedProduct', price: 150 } as CreateProductDto;

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.updateProduct(supplier, '1', dto)).rejects.toThrow(NotFoundException);
    });
  });
});
