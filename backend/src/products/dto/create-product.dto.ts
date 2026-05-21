import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsIn,
  Min,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Sepatu Nike Air Max Ukuran 42' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Sepatu running original, kondisi baru...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 850000 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  price: number;

  @ApiProperty({
    example: 'physical',
    description: 'physical | digital | service',
  })
  @IsIn(['physical', 'digital', 'service', 'account', 'file', 'license'])
  type: string;

  @ApiPropertyOptional({ example: 'new', description: 'new | used' })
  @IsOptional()
  @IsIn(['new', 'used'])
  condition?: string;

  @ApiPropertyOptional({ example: 500, description: 'Berat dalam gram' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  weight?: number;

  @ApiPropertyOptional({ example: 30, description: 'Lebar cm' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  width?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  height?: number;

  @ApiPropertyOptional({ example: 15 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  length?: number;

  @ApiPropertyOptional({ example: 'SKU-001' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  minOrder?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isDigital?: boolean;

  @ApiPropertyOptional({ example: 'Link download: https://...' })
  @IsOptional()
  @IsString()
  digitalNote?: string;

  @ApiPropertyOptional({ description: 'UUID kategori' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
