import {
    Injectable,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { ProductImage } from '../product-images/entities/product-image.entity';
import { ProductResponseDto } from './dto/product-response.dto';
import { Product } from './entities/product.entity';
import { User } from '../users/entities/user.entity';
import { unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { R2Service } from '../common/r2.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productRepo: Repository<Product>,

        @InjectRepository(User)
        private userRepo: Repository<User>,

        @InjectRepository(ProductImage)
        private productImageRepo: Repository<ProductImage>,

        private r2Service: R2Service,
    ) { }

    async create(
        data: any,
        sellerId: string,
    ) {
        // cari seller
        const seller = await this.userRepo.findOne({
            where: {
                id: sellerId,
            },
        });

        // buat product
        const product = this.productRepo.create({
            ...data,
            seller,
        });

        return this.productRepo.save(product);
    }

    async findAll(query: any) {
        const page = Number(query.page) || 1;

        const limit = Number(query.limit) || 10;

        const search = query.search || '';

        const minPrice =
            Number(query.minPrice) || 0;

        const maxPrice =
            Number(query.maxPrice) || 999999999;

        const [products, total] =
            await this.productRepo
                .createQueryBuilder('product')

                .leftJoinAndSelect(
                    'product.seller',
                    'seller',
                )

                .leftJoinAndSelect(
                    'product.images',
                    'images',
                )

                .where(
                    'LOWER(product.name) LIKE LOWER(:search)',
                    {
                        search: `%${search}%`,
                    },
                )

                .andWhere(
                    'product.price >= :minPrice',
                    {
                        minPrice,
                    },
                )

                .andWhere(
                    'product.price <= :maxPrice',
                    {
                        maxPrice,
                    },
                )

                .skip((page - 1) * limit)

                .take(limit)

                .getManyAndCount();

        return {
            data: products.map(
                product => new ProductResponseDto(product),
            ),

            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(
                    total / limit,
                ),
            },
        };
    }

    async findOne(productId: string) {
        // cari product
        const product =
            await this.productRepo.findOne({
                where: {
                    id: productId,
                },

                relations: [
                    'seller',
                    'images',
                ],
            });

        // kalau product tidak ada
        if (!product) {
            throw new NotFoundException(
                'Product not found',
            );
        }

        // return dto
        return new ProductResponseDto(
            product,
        );
    }

    async uploadImagesToProduct(
        productId: string,
        files: Express.Multer.File[],
        sellerId: string,
    ) {
        // Cari product
        const product =
            await this.productRepo.findOne({
                where: { id: productId },
                relations: [
                    'seller',
                    'images',
                ],
            });

        // Product tidak ditemukan
        if (!product) {
            throw new NotFoundException(
                'Product not found',
            );
        }

        // Pastikan product milik seller
        if (
            product.seller.id !== sellerId
        ) {
            throw new ForbiddenException(
                'Access denied',
            );
        }

        // Cek apakah sudah ada thumbnail
        const hasThumbnail =
            product.images.some(
                (image) =>
                    image.isThumbnail,
            );

        const savedImages: ProductImage[] = [];

        for (
            let i = 0;
            i < files.length;
            i++
        ) {
            const file = files[i];

            const image =
                this.productImageRepo.create({
                    imageUrl: await this.r2Service.uploadFile(file),
                    product,
                    isThumbnail:
                        !hasThumbnail && i === 0,
                });

            const saved =
                await this.productImageRepo.save(
                    image,
                );

            savedImages.push(saved);
        }

        return savedImages.map((image) => ({
            id: image.id,
            imageUrl: image.imageUrl,
            isThumbnail: image.isThumbnail,
        }));
    }

    async deleteImage(
        imageId: string,
        sellerId: string,
    ) {
        // Cari image beserta product dan seller
        const image =
            await this.productImageRepo.findOne({
                where: {
                    id: imageId,
                },
                relations: [
                    'product',
                    'product.seller',
                ],
            });

        // Jika image tidak ditemukan
        if (!image) {
            throw new NotFoundException(
                'Image not found',
            );
        }

        // Pastikan product milik seller
        if (
            image.product.seller.id !==
            sellerId
        ) {
            throw new ForbiddenException(
                'Access denied',
            );
        }

        // Simpan status thumbnail
        const wasThumbnail =
            image.isThumbnail;

        // Hapus file fisik jika file lokal
        if (
            image.imageUrl.startsWith(
                '/uploads/',
            )
        ) {
            const filePath = join(
                process.cwd(),
                image.imageUrl,
            );

            if (existsSync(filePath)) {
                unlinkSync(filePath);
            }
        }

        // Simpan product sebelum image dihapus
        const product =
            await this.productRepo.findOne({
                where: {
                    id: image.product.id,
                },
                relations: ['images'],
            });

        // Hapus data image dari database
        await this.productImageRepo.remove(
            image,
        );

        // Jika image yang dihapus adalah thumbnail,
        // pilih gambar lain sebagai thumbnail
        if (
            wasThumbnail &&
            product
        ) {
            const remainingImages =
                await this.productImageRepo.find({
                    where: {
                        product: {
                            id: product.id,
                        },
                    },
                });

            if (
                remainingImages.length > 0
            ) {
                remainingImages[0].isThumbnail =
                    true;

                await this.productImageRepo.save(
                    remainingImages[0],
                );
            }
        }

        return {
            message:
                'Image deleted successfully',
        };
    }

    async update(
        productId: string,
        data: any,
        sellerId: string,
    ) {
        // cari product
        const product = await this.productRepo.findOne({
            where: {
                id: productId,
            },
            relations: [
                'seller',
                'images',
            ],
        });

        // product tidak ada
        if (!product) {
            throw new NotFoundException(
                'Product not found',
            );
        }

        // bukan pemilik product
        if (product.seller.id !== sellerId) {
            throw new ForbiddenException(
                'Access denied',
            );
        }

        // update data
        Object.assign(product, data);

        const updated =
            await this.productRepo.save(product);

        return new ProductResponseDto(
            updated,
        );
    }

    async setThumbnail(
        imageId: string,
        sellerId: string,
    ) {
        // Cari image beserta product dan seller
        const image =
            await this.productImageRepo.findOne({
                where: {
                    id: imageId,
                },
                relations: [
                    'product',
                    'product.seller',
                ],
            });

        // Jika image tidak ditemukan
        if (!image) {
            throw new NotFoundException(
                'Image not found',
            );
        }

        // Pastikan product milik seller
        if (
            image.product.seller.id !==
            sellerId
        ) {
            throw new ForbiddenException(
                'Access denied',
            );
        }

        // Nonaktifkan semua thumbnail
        await this.productImageRepo.update(
            {
                product: {
                    id: image.product.id,
                },
            },
            {
                isThumbnail: false,
            },
        );

        // Set image terpilih sebagai thumbnail
        image.isThumbnail = true;

        const saved =
            await this.productImageRepo.save(
                image,
            );

        return saved;
    }


    async deleteProduct(
        productId: string,
        sellerId: string,
    ) {
        // cari product
        const product = await this.productRepo.findOne({
            where: {
                id: productId,
            },
            relations: [
                'seller',
                'images',
            ],
        });

        // kalau product tidak ada
        if (!product) {
            throw new NotFoundException(
                'Product not found',
            );
        }

        // cek ownership
        if (product.seller.id !== sellerId) {
            throw new ForbiddenException(
                'Access denied',
            );
        }

        // delete product
        await this.productRepo.remove(product);

        return {
            message: 'Product deleted',
        };
    }
}