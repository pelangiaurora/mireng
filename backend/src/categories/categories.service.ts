// ─── categories.service.ts ───────────────────────────────
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from './entities/category.entity';

export class CreateCategoryDto {
  name: string;
  slug?: string;
  icon?: string;
  image?: string;
  parentId?: string;
  sortOrder?: number;
}

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private catRepo: Repository<Category>,
  ) {}

  async findAll() {
    return this.catRepo.find({
      where: { isActive: true, parentId: IsNull() },
      relations: ['children'],
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: string) {
    const cat = await this.catRepo.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });
    if (!cat) throw new NotFoundException('Kategori tidak ditemukan');
    return cat;
  }

  async findBySlug(slug: string) {
    const cat = await this.catRepo.findOne({
      where: { slug },
      relations: ['children'],
    });
    if (!cat) throw new NotFoundException('Kategori tidak ditemukan');
    return cat;
  }

  async create(dto: CreateCategoryDto) {
    const slug =
      dto.slug ??
      dto.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    const level = dto.parentId ? 2 : 1;
    const cat = this.catRepo.create({ ...dto, slug, level });
    return this.catRepo.save(cat);
  }

  async update(id: string, dto: Partial<CreateCategoryDto>) {
    const cat = await this.findOne(id);
    Object.assign(cat, dto);
    return this.catRepo.save(cat);
  }

  async remove(id: string) {
    const cat = await this.findOne(id);
    cat.isActive = false;
    return this.catRepo.save(cat);
  }
}
