import { Test, TestingModule } from '@nestjs/testing';
import { SupplierService } from './supplier.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Supplier } from './supplier.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { CreateSupplierDto } from './dtos/CreateSupplier.dto';
import { EditSupplierDto } from './dtos/EditSupplier.dto';
import { NotFoundException } from '@nestjs/common';

describe('SupplierService', () => {
  let service: SupplierService;
  let supplierRepository: Repository<Supplier>;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierService,
        {
          provide: getRepositoryToken(Supplier),
          useClass: Repository,
        },
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            updateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SupplierService>(SupplierService);
    supplierRepository = module.get<Repository<Supplier>>(getRepositoryToken(Supplier));
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateSupplier', () => {
    it('should update supplier details', async () => {
      const user = { id: '1' } as User;
      const supplierDto: EditSupplierDto = { companyName: 'New Company' };

      const supplier = { id: '1', user } as Supplier;

      jest.spyOn(supplierRepository, 'findOneBy').mockResolvedValue(supplier);
      jest.spyOn(userService, 'updateUser').mockResolvedValue(true);
      jest.spyOn(supplierRepository, 'save').mockResolvedValue(supplier);

      const result = await service.updateSupplier(user, supplierDto);

      expect(supplierRepository.findOneBy).toHaveBeenCalledWith({ user: { id: user.id } });
      expect(userService.updateUser).toHaveBeenCalledWith(user.id, supplierDto);
      expect(supplierRepository.save).toHaveBeenCalledWith({ ...supplier, ...supplierDto });
      expect(result).toBe(true);
    });

    it('should return false if supplier not found', async () => {
      const user = { id: '1' } as User;
      const supplierDto: EditSupplierDto = { companyName: 'New Company' };

      jest.spyOn(supplierRepository, 'findOneBy').mockResolvedValue(null);

      const result = await service.updateSupplier(user, supplierDto);

      expect(result).toBe(false);
    });
  });

  describe('createSupplier', () => {
    it('should create a new supplier', async () => {
      const dto: CreateSupplierDto = {
        companyAddress: 'Address',
        companyName: 'Company',
        productType: 'Type',
        email: 'email@example.com',
        password: 'password',
      };

      const user = { id: '1' } as User;
      const supplier = { id: '1', user } as Supplier;

      jest.spyOn(userService, 'createUser').mockResolvedValue(user);
      jest.spyOn(supplierRepository, 'create').mockReturnValue(supplier);
      jest.spyOn(supplierRepository, 'save').mockResolvedValue(supplier);

      const result = await service.createSupplier(dto);

      expect(userService.createUser).toHaveBeenCalledWith(dto);
      expect(supplierRepository.create).toHaveBeenCalledWith({
        companyAddress: dto.companyAddress,
        companyName: dto.companyName,
        productType: dto.productType,
        user,
      });
      expect(supplierRepository.save).toHaveBeenCalledWith(supplier);
      expect(result).toBe(true);
    });
  });

  describe('getById', () => {
    it('should return a supplier by id', async () => {
      const id = '1';
      const supplier = { id } as Supplier;

      jest.spyOn(supplierRepository, 'findOneBy').mockResolvedValue(supplier);

      const result = await service.getById(id);

      expect(supplierRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(result).toBe(supplier);
    });

    it('should throw NotFoundException if supplier not found', async () => {
      const id = '1';

      jest.spyOn(supplierRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.getById(id)).rejects.toThrow(NotFoundException);
    });
  });
});
