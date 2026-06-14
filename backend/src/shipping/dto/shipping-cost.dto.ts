import { IsString, IsNotEmpty, IsNumber, IsIn, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ShippingCostDto {
  @ApiProperty({ example: '501', description: 'ID kota/kecamatan asal (dari endpoint search destination)' })
  @IsString()
  @IsNotEmpty()
  origin: string;

  @ApiProperty({ example: '114', description: 'ID kota/kecamatan tujuan' })
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiProperty({ example: 1000, description: 'Berat dalam gram' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  weight: number;

  @ApiProperty({ example: 'jne', enum: ['jne', 'jnt', 'sicepat', 'anteraja', 'pos'] })
  @IsString()
  @IsIn(['jne', 'jnt', 'sicepat', 'anteraja', 'pos', 'tiki', 'ninja'])
  courier: string;
}