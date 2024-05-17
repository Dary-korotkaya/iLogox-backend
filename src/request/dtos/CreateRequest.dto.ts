import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRequestProductInfoDto)
  productInfo: CreateRequestProductInfoDto[];

  @IsNotEmpty()
  @IsDateString()
  dateOfDelivery: Date;

  @IsNotEmpty()
  addressOfDelivery: string;

  @IsOptional()
  description: string;
}

class CreateRequestProductInfoDto {
  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
