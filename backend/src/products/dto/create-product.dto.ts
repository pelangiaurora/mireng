import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  IsUrl,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class CreateProductDto {

  @ApiProperty({
    example: 'Netflix Premium 1 Bulan',
    description: 'Nama product',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Private account sharing',
    description: 'Deskripsi product',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 50000,
    description: 'Harga product',
  })
  @IsNumber()
  @Min(1)
  price: number;

  @ApiPropertyOptional({
    example:
      'https://i.imgur.com/example.jpg',
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}