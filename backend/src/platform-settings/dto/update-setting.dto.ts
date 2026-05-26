import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSettingDto {
  @ApiProperty({ example: 'true' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiPropertyOptional({ example: 'boolean' })
  @IsOptional()
  @IsIn(['string', 'boolean', 'number', 'json'])
  dataType?: string;

  @ApiPropertyOptional({ example: 'Toggle pendaftaran seller' })
  @IsOptional()
  @IsString()
  description?: string;
}