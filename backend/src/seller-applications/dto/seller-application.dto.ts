import { IsString, IsNotEmpty, IsIn, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSellerApplicationDto {
  @ApiProperty({ example: 'physical', enum: ['physical', 'digital'] })
  @IsIn(['physical', 'digital'])
  sellerTypeRequested: string;

  @ApiProperty({ example: 'Saya ingin berjualan karena...' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiPropertyOptional({ example: { tokopedia: 'https://tokopedia.com/toko-saya' } })
  @IsOptional()
  marketplaceLinks?: object;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsInt()
  @Min(1)
  estimatedProducts?: number;

  @ApiPropertyOptional({ example: 10000000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  estimatedRevenue?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(0)
  experienceYears?: number;

  @ApiProperty({ example: 'https://r2.mireng.com/ktp.jpg' })
  @IsString()
  @IsNotEmpty()
  documentKtp: string;

  @ApiPropertyOptional({ example: 'https://r2.mireng.com/support.jpg' })
  @IsOptional()
  @IsString()
  documentSupport?: string;
}

export class ReviewApplicationDto {
  @ApiProperty({ enum: ['approved', 'rejected', 'need_info'] })
  @IsIn(['approved', 'rejected', 'need_info'])
  status: string;

  @ApiPropertyOptional({ example: 'Dokumen KTP kurang jelas' })
  @IsOptional()
  @IsString()
  adminNotes?: string;

  @ApiPropertyOptional({ example: 'Tidak memenuhi syarat' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}