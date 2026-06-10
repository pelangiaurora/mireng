import {
  IsString,
  IsOptional,
  IsIn,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty({ example: 'Toko Serbaguna Aurora' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'physical', enum: ['physical', 'digital'] })
  @IsIn(['physical', 'digital'])
  sellerType: string;

  @ApiProperty({ example: 'personal', enum: ['personal', 'umkm', 'official'] })
  @IsIn(['personal', 'umkm', 'official'])
  storeType: string;

  @ApiPropertyOptional({ example: 'Toko kami menjual berbagai produk...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Surabaya' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Jawa Timur' })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '60111' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;
}
