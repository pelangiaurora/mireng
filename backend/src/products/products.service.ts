import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from '../product-images/entities/product-image.entity';
import { Store } from '../stores/entities/store.entity';
import { User } from '../users/entities/user.entity';
import { R2Service } from '../common/r2.service';
import { CreateProductDto } from './dto/create-product.dto';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(ProductImage)
    private productImageRepo: Repository<ProductImage>,

    @InjectRepository(Store)
    private storeRepo: Repository<Store>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    private r2Service: R2Service,
  ) {}

  // ── Generate slug ─────────────────────────────────────
  private generateSlug(name: string): string {
    return (
      name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim() +
      '-' +
      Date.now()
    );
  }

  // ── Create Produk ─────────────────────────────────────
  async create(dto: CreateProductDto, sellerId: string) {
    const seller = await this.userRepo.findOne({ where: { id: sellerId } });
    if (!seller) throw new NotFoundException('Seller tidak ditemukan');

    // Cari toko milik seller
    const store = await this.storeRepo.findOne({ where: { sellerId } });

    const slug = this.generateSlug(dto.name);

    const product = this.productRepo.create({
      ...dto,
      slug,
      seller,
      sellerId,
      store: store ?? undefined,
      storeId: store?.id ?? undefined,
    });

    return this.productRepo.save(product);
  }

  // ── Find All (dengan filter lengkap) ─────────────────
  async findAll(query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const search = query.search || '';
    const type = query.type || '';
    const categoryId = query.categoryId || '';
    const storeId = query.storeId || '';
    const minPrice = Number(query.minPrice) || 0;
    const maxPrice = Number(query.maxPrice) || 999999999;
    const condition = query.condition || '';
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder === 'ASC' ? 'ASC' : 'DESC';

    const qb = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.seller', 'seller')
      .leftJoinAndSelect('product.store', 'store')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .where('product.isActive = true');

    if (search) {
      qb.andWhere('LOWER(product.name) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }
    if (type) {
      qb.andWhere('product.type = :type', { type });
    }
    if (categoryId) {
      qb.andWhere('product.category_id = :categoryId', { categoryId });
    }
    if (storeId) {
      qb.andWhere('product.store_id = :storeId', { storeId });
    }
    if (condition) {
      qb.andWhere('product.condition = :condition', { condition });
    }
    if (minPrice > 0) {
      qb.andWhere('product.price >= :minPrice', { minPrice });
    }
    if (maxPrice < 999999999) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    const validSorts = ['createdAt', 'price', 'rating', 'totalSold'];
    const sort = validSorts.includes(sortBy) ? sortBy : 'createdAt';
    qb.orderBy(`product.${sort}`, sortOrder);

    const [products, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: products.map((p) => this.formatProduct(p)),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ── Find produk by toko ───────────────────────────────
  async findByStore(storeId: string, query: any) {
    return this.findAll({ ...query, storeId });
  }

  // ── Find One ──────────────────────────────────────────
  async findOne(id: string) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['seller', 'store', 'category', 'images'],
    });
    if (!product) throw new NotFoundException('Produk tidak ditemukan');
    return this.formatProduct(product);
  }

  // ── Find by Slug ──────────────────────────────────────
  async findBySlug(slug: string) {
    const product = await this.productRepo.findOne({
      where: { slug },
      relations: ['seller', 'store', 'category', 'images'],
    });
    if (!product) throw new NotFoundException('Produk tidak ditemukan');
    return this.formatProduct(product);
  }

  // ── Update ────────────────────────────────────────────
  async update(id: string, data: any, sellerId: string) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['seller'],
    });
    if (!product) throw new NotFoundException('Produk tidak ditemukan');
    if (product.seller.id !== sellerId)
      throw new ForbiddenException('Bukan produkmu');

    Object.assign(product, data);
    const updated = await this.productRepo.save(product);
    return this.formatProduct(updated);
  }

  // ── Delete ────────────────────────────────────────────
  async deleteProduct(id: string, sellerId: string) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['seller', 'images'],
    });
    if (!product) throw new NotFoundException('Produk tidak ditemukan');
    if (product.seller.id !== sellerId)
      throw new ForbiddenException('Bukan produkmu');
    await this.productRepo.remove(product);
    return { message: 'Produk berhasil dihapus' };
  }

  // ── Upload Images ─────────────────────────────────────
  async uploadImagesToProduct(
    productId: string,
    files: Express.Multer.File[],
    sellerId: string,
  ) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: ['seller', 'images'],
    });
    if (!product) throw new NotFoundException('Produk tidak ditemukan');
    if (product.seller.id !== sellerId)
      throw new ForbiddenException('Bukan produkmu');

    const hasThumbnail = product.images.some((img) => img.isThumbnail);
    const savedImages: ProductImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const image = this.productImageRepo.create({
        imageUrl: await this.r2Service.uploadFile(file),
        product,
        isThumbnail: !hasThumbnail && i === 0,
      });
      savedImages.push(await this.productImageRepo.save(image));
    }

    return savedImages.map((img) => ({
      id: img.id,
      imageUrl: img.imageUrl,
      isThumbnail: img.isThumbnail,
    }));
  }

  // ── Delete Image ──────────────────────────────────────
  async deleteImage(imageId: string, sellerId: string) {
    const image = await this.productImageRepo.findOne({
      where: { id: imageId },
      relations: ['product', 'product.seller'],
    });
    if (!image) throw new NotFoundException('Gambar tidak ditemukan');
    if (image.product.seller.id !== sellerId)
      throw new ForbiddenException('Bukan produkmu');

    const wasThumbnail = image.isThumbnail;
    if (image.imageUrl.startsWith('/uploads/')) {
      const filePath = join(process.cwd(), image.imageUrl);
      if (existsSync(filePath)) unlinkSync(filePath);
    }

    const productId = image.product.id;
    await this.productImageRepo.remove(image);

    if (wasThumbnail) {
      const remaining = await this.productImageRepo.find({
        where: { product: { id: productId } },
      });
      if (remaining.length > 0) {
        remaining[0].isThumbnail = true;
        await this.productImageRepo.save(remaining[0]);
      }
    }

    return { message: 'Gambar berhasil dihapus' };
  }

  // ── Set Thumbnail ─────────────────────────────────────
  async setThumbnail(imageId: string, sellerId: string) {
    const image = await this.productImageRepo.findOne({
      where: { id: imageId },
      relations: ['product', 'product.seller'],
    });
    if (!image) throw new NotFoundException('Gambar tidak ditemukan');
    if (image.product.seller.id !== sellerId)
      throw new ForbiddenException('Bukan produkmu');

    await this.productImageRepo.update(
      { product: { id: image.product.id } },
      { isThumbnail: false },
    );
    image.isThumbnail = true;
    return this.productImageRepo.save(image);
  }

  // ── Format response ───────────────────────────────────
  private formatProduct(product: Product) {
    const thumbnail =
      product.images?.find((i) => i.isThumbnail) ?? product.images?.[0];
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      type: product.type,
      condition: product.condition,
      weight: product.weight,
      stock: product.stock,
      isActive: product.isActive,
      isDigital: product.isDigital,
      rating: product.rating,
      totalSold: product.totalSold,
      totalReviews: product.totalReviews,
      createdAt: product.createdAt,
      images:
        product.images?.map((img) => ({
          id: img.id,
          imageUrl: img.imageUrl,
          isThumbnail: img.isThumbnail,
        })) ?? [],
      thumbnail: thumbnail?.imageUrl ?? null,
      store: product.store
        ? {
            id: product.store.id,
            name: product.store.name,
            slug: product.store.slug,
            logo: product.store.logo,
            city: product.store.city,
            rating: product.store.rating,
          }
        : null,
      seller: product.seller
        ? {
            id: product.seller.id,
            name: product.seller.name,
          }
        : null,
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
            slug: product.category.slug,
          }
        : null,
    };
  }
}
