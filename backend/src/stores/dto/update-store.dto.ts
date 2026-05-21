import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsString } from 'class-validator';
import { CreateStoreDto } from './create-store.dto';

export class UpdateStoreDto extends PartialType(CreateStoreDto) {
  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  banner?: string;

  @IsOptional()
  @IsBoolean()
  holidayMode?: boolean;

  @IsOptional()
  @IsString()
  holidayNote?: string;

  @IsOptional()
  operatingHours?: object;
}
