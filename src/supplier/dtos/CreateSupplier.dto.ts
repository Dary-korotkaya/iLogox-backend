import { IsEnum, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { ProductType } from '../supplier.entity';
import { CreateUserDto } from '../../user/dtos/CreateUserDto';

export class CreateSupplierDto extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  companyAddress: string;

  @IsString()
  companyName: string;

  @IsEnum(ProductType)
  productType: ProductType;
}
