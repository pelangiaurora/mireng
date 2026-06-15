import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ShippingOptionDto {
  @ApiProperty({ example: 'store-uuid-here' })
  @IsString()
  @IsNotEmpty()
  storeId: string;

  @ApiProperty({ example: 'jne' })
  @IsString()
  @IsNotEmpty()
  courier: string;

  @ApiProperty({ example: 'REG' })
  @IsString()
  @IsNotEmpty()
  service: string;

  @ApiProperty({ example: 56000 })
  shippingFee: number;
}

export class CheckoutDto {
  @ApiProperty({ example: 'address-uuid-here' })
  @IsString()
  @IsNotEmpty()
  addressId: string;

  @ApiProperty({ type: [ShippingOptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShippingOptionDto)
  shippingOptions: ShippingOptionDto[];

  @ApiProperty({
    example: 'bank_transfer',
    enum: ['bank_transfer', 'qris', 'gopay', 'shopeepay', 'credit_card', 'cod'],
  })
  @IsIn(['bank_transfer', 'qris', 'gopay', 'shopeepay', 'credit_card', 'cod'])
  paymentMethod: string;

  @ApiPropertyOptional({ example: 'Tolong dibungkus rapih ya' })
  @IsOptional()
  @IsString()
  notes?: string;
}
