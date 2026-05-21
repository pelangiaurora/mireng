import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // ── Register ──────────────────────────────────────────
  async create(email: string, password: string, name: string, role?: string) {
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) throw new ConflictException('Email sudah terdaftar');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      name,
      role: role || 'buyer',
    });
    return this.userRepo.save(user);
  }

  // ── Find ──────────────────────────────────────────────
  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User tidak ditemukan');
    return user;
  }

  // ── Get Profile ───────────────────────────────────────
  async getProfile(id: string) {
    const user = await this.findById(id);
    const { password, ...profile } = user as any;
    return profile;
  }

  // ── Update Profile ────────────────────────────────────
  async updateProfile(id: string, dto: UpdateProfileDto) {
    const user = await this.findById(id);

    // Cek email duplikat kalau email diubah
    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepo.findOne({
        where: { email: dto.email },
      });
      if (existing) throw new ConflictException('Email sudah digunakan');
    }

    Object.assign(user, dto);
    const saved = await this.userRepo.save(user);
    const { password, ...result } = saved as any;
    return result;
  }

  // ── Update Avatar ─────────────────────────────────────
  async updateAvatar(id: string, avatarUrl: string) {
    await this.findById(id);
    await this.userRepo.update(id, { avatar: avatarUrl });
    return this.getProfile(id);
  }

  // ── Change Password ───────────────────────────────────
  async changePassword(id: string, dto: ChangePasswordDto) {
    const user = await this.findById(id);

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) throw new BadRequestException('Password lama tidak sesuai');

    if (dto.newPassword.length < 6) {
      throw new BadRequestException('Password baru minimal 6 karakter');
    }
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Konfirmasi password tidak cocok');
    }

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepo.update(id, { password: hashed });
    return { message: 'Password berhasil diubah' };
  }

  // ── Upgrade ke Seller ─────────────────────────────────
  async upgradeToSeller(id: string) {
    const user = await this.findById(id);
    if (user.role === 'seller')
      throw new ConflictException('Kamu sudah menjadi seller');
    if (user.role === 'admin')
      throw new ConflictException('Admin tidak perlu upgrade');
    await this.userRepo.update(id, { role: 'seller' });
    return { message: 'Akun berhasil diupgrade ke seller! Silakan buka toko.' };
  }

  // ── Admin: Get All Users ──────────────────────────────
  async findAll(query?: { role?: string; search?: string }) {
    const qb = this.userRepo.createQueryBuilder('user');

    if (query?.role) qb.andWhere('user.role = :role', { role: query.role });
    if (query?.search) {
      qb.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', {
        search: `%${query.search}%`,
      });
    }

    const users = await qb.orderBy('user.createdAt', 'DESC').getMany();
    return users.map(({ password, ...u }) => u);
  }

  // ── Admin: Suspend User ───────────────────────────────
  async suspend(id: string) {
    const user = await this.findById(id);
    await this.userRepo.update(id, { isActive: !user.isActive });
    return {
      message: `User ${user.isActive ? 'disuspend' : 'diaktifkan'} kembali`,
    };
  }
}

// ── DTOs ─────────────────────────────────────────────────
export class UpdateProfileDto {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  dateOfBirth?: Date;
  gender?: string;
}

export class ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
