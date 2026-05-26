import { IsString, IsIn, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdminOverrideTierDto {
  @ApiProperty({
    example: 'star',
    enum: ['regular', 'star', 'star_plus', 'top', 'official'],
  })
  @IsIn(['regular', 'star', 'star_plus', 'top', 'official'])
  tier: string;

  @ApiPropertyOptional({ example: 'Performa sangat baik bulan ini' })
  @IsOptional()
  @IsString()
  reason?: string;
}