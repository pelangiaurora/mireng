import {
    Controller,
    Post,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';

import { ProductImagesService }
    from './product-images.service';

import { JwtAuthGuard }
    from '../auth/jwt-auth.guard';

import { RolesGuard }
    from '../auth/roles.guard';

import { CreateProductImageDto }
    from './dto/create-product-image.dto';

@Controller('product-images')
export class ProductImagesController {

    constructor(
        private readonly productImagesService:
            ProductImagesService,
    ) { }

    @UseGuards(
        JwtAuthGuard,
        new RolesGuard(['seller']),
    )
    @Post(':productId')
    addImages(

        @Param('productId')
        productId: string,

        @Body() dto: CreateProductImageDto

    ) {

        return this.productImagesService.addImages(
            productId,
            dto.images,
        );

    }
}