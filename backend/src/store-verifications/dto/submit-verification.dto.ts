import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubmitVerificationDto {
  @ApiProperty({ example: 'physical', enum: ['physical', 'digital'] })
  @IsIn(['physical', 'digital'])
  sellerType: string;

  @ApiProperty({ example: 'personal', enum: ['personal', 'umkm', 'official'] })
  @IsIn(['personal', 'umkm', 'official'])
  storeType: string;

  @ApiPropertyOptional({ example: 'https://r2.mireng.com/ktp.jpg' })
  @IsOptional()
  @IsString()
  documentKtp?: string;

  @ApiPropertyOptional({ example: 'https://r2.mireng.com/selfie.jpg' })
  @IsOptional()
  @IsString()
  documentSelfie?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  documentNib?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  documentSiup?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  documentAkta?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  documentNpwp?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  documentBrand?: string;

  @ApiPropertyOptional({ example: 'Toko saya sudah berjalan 2 tahun' })
  @IsOptional()
  @IsString()
  notesFromSeller?: string;
}

export class ReviewVerificationDto {
  @ApiProperty({ enum: ['approved', 'rejected', 'need_revision'] })
  @IsIn(['approved', 'rejected', 'need_revision'])
  status: string;

  @ApiPropertyOptional({ example: 'Dokumen KTP tidak jelas' })
  @IsOptional()
  @IsString()
  notesFromAdmin?: string;
}