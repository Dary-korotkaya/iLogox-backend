import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateProductDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  totalQuantity: number;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
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
