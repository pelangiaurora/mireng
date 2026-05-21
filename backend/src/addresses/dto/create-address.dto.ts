import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumberString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiPropertyOptional({
    example: 'Rumah',
    description: 'Label: Rumah, Kantor, dll',
  })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({ example: 'Ahlam Aurora' })
  @IsString()
  recipientName: string;

  @ApiProperty({ example: '08123456789' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'Jl. Raya No. 10' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Surabaya' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Jawa Timur' })
  @IsString()
  province: string;

  @ApiPropertyOptional({ example: 'Sukolilo' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiProperty({ example: '60111' })
  @IsString()
  postalCode: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
