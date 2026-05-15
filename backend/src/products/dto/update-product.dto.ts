import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsUrl
} from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {

  @ApiPropertyOptional({
    example: 'Spotify Premium',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Private account',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 25000,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  price?: number;

  @ApiPropertyOptional({
    example:
      'https://i.imgur.com/example.jpg',
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}