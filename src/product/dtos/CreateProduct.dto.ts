import {
  IsBoolean,
  IsNotEmpty,
  IsNumber, IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  totalQuantity: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsBoolean()
  @IsOptional()
  inStock: boolean;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  description: string;
}
