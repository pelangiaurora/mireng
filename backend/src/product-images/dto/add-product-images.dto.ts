import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsUrl,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

class ImageItemDto {

  @IsUrl()
  imageUrl: string;

  @IsOptional()
  @IsBoolean()
  isThumbnail?: boolean;
}

export class CreateProductImageDto {

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageItemDto)
  images: ImageItemDto[];
}