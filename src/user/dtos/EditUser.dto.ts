import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class EditUserDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  login?: string;
}
