import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { InjectRepository }
    from '@nestjs/typeorm';

import { Repository }
    from 'typeorm';

import { ProductImage }
    from './entities/product-image.entity';

import { Product }
    from '../products/entities/product.entity';

@Injectable()
export class ProductImagesService {

    constructor(

        @InjectRepository(ProductImage)
        private imageRepo:
            Repository<ProductImage>,

        @InjectRepository(Product)
        private productRepo:
            Repository<Product>,

    ) { }

    async addImages(
        productId: string,
        images: {
            imageUrl: string;
            isThumbnail?: boolean;
        }[],
    ) {

        const product =
            await this.productRepo.findOne({
                where: { id: productId },
                relations: ['images'],
            });

        if (!product) {
            throw new NotFoundException(
                'Product not found',
            );
        }

        const imageEntities =
            images.map((image, index) => {

                return this.imageRepo.create({
                    imageUrl: image.imageUrl,

                    isThumbnail:
                        image.isThumbnail ??
                        (
                            product.images.length === 0
                            && index === 0
                        ),

                    product,
                });

            });

        return this.imageRepo.save(
            imageEntities,
        );
    }
}