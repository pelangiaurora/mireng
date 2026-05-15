import {
  IsArray,
  ValidateNested,
  IsString,
  IsBoolean,
} from 'class-validator';

import { Type } from 'class-transformer';

class ProductImageItemDto {

  @IsString()
  imageUrl: string;

  @IsBoolean()
  isThumbnail: boolean;
}

export class CreateProductImageDto {

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageItemDto)
  images: ProductImageItemDto[];
}
