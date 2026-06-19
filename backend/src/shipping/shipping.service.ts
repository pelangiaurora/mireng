import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { ShippingCostDto } from './dto/shipping-cost.dto';
import { Store } from '../stores/entities/store.entity';

const COURIER_NAMES: Record<string, string> = {
  jne: 'JNE',
  jnt: 'J&T Express',
  sicepat: 'SiCepat',
  anteraja: 'AnterAja',
  pos: 'Pos Indonesia',
  tiki: 'TIKI',
  ninja: 'Ninja Express',
};

@Injectable()
export class ShippingService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Store)
    private storeRepo: Repository<Store>,
  ) {
    this.apiKey = this.configService.get<string>('RAJAONGKIR_API_KEY') ?? '';
    this.baseUrl =
      this.configService.get<string>('RAJAONGKIR_BASE_URL') ??
      'https://rajaongkir.komerce.id/api/v1';
  }

  private getHeaders() {
    if (!this.apiKey)
      throw new InternalServerErrorException(
        'RAJAONGKIR_API_KEY belum dikonfigurasi',
      );
    return { key: this.apiKey };
  }

  // ─── Cari destinasi (untuk dropdown alamat) ───────────────────────
  async searchDestination(search: string) {
    if (!search || search.length < 3)
      throw new BadRequestException('Minimal 3 karakter');
    try {
      const res = await axios.get(
        `${this.baseUrl}/destination/domestic-destination`,
        {
          headers: this.getHeaders(),
          params: { search, limit: 10, offset: 0 },
        },
      );
      return res.data?.data ?? [];
    } catch (err: any) {
      throw new InternalServerErrorException(
        err?.response?.data?.meta?.message || 'Gagal menghubungi Raja Ongkir',
      );
    }
  }

  // ─── Hitung 1 kurir (internal helper) ────────────────────────────
  private async fetchCost(
    origin: string,
    destination: string,
    weight: number,
    courier: string,
  ) {
    try {
      const res = await axios.post(
        `${this.baseUrl}/calculate/domestic-cost`,
        new URLSearchParams({
          origin,
          destination,
          weight: String(weight),
          courier,
          price: 'lowest',
        }),
        {
          headers: {
            ...this.getHeaders(),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      return (res.data?.data ?? []).map((item: any) => ({
        courier,
        courierName: COURIER_NAMES[courier] ?? courier.toUpperCase(),
        service: item.service,
        description: item.description,
        cost: item.cost,
        etd: item.etd,
      }));
    } catch {
      return []; // Kurir ini gagal → skip, jangan gagalkan semua
    }
  }

  // ─── Hitung ongkir semua kurir aktif toko (dipakai checkout) ─────
  async calculateStoreCost(
    storeId: string,
    destinationId: string,
    weight: number,
  ) {
    const store = await this.storeRepo.findOne({ where: { id: storeId } });
    if (!store) throw new BadRequestException('Toko tidak ditemukan');
    if (!store.rajaongkirDestinationId)
      throw new BadRequestException(
        'Alamat toko belum memiliki destination ID',
      );

    const activeCouriers: string[] = store.activeCouriers ?? [
      'jne',
      'jnt',
      'pos',
    ];
    if (activeCouriers.length === 0) return [];

    // Panggil semua kurir aktif secara paralel
    const results = await Promise.all(
      activeCouriers.map((courier) =>
        this.fetchCost(
          store.rajaongkirDestinationId,
          destinationId,
          weight,
          courier,
        ),
      ),
    );

    return results.flat();
  }

  // ─── Hitung ongkir 1 kurir (endpoint manual, untuk admin/debug) ──
  async calculateCost(dto: ShippingCostDto) {
    const results = await this.fetchCost(
      dto.origin,
      dto.destination,
      dto.weight,
      dto.courier,
    );
    if (!results.length)
      throw new InternalServerErrorException('Gagal menghitung ongkir');
    return results;
  }

  // ─── Update kurir aktif toko ──────────────────────────────────────
  async updateActiveCouriers(storeId: string, couriers: string[]) {
    const valid = ['jne', 'jnt', 'sicepat', 'anteraja', 'pos', 'tiki', 'ninja'];
    const filtered = couriers.filter((c) => valid.includes(c));
    if (filtered.length === 0)
      throw new BadRequestException('Minimal 1 kurir harus aktif');
    await this.storeRepo.update(storeId, { activeCouriers: filtered });
    return { activeCouriers: filtered };
  }

  // ─── Update kurir aktif berdasarkan seller userId ─────────────────
  async updateActiveCouriersByUserId(userId: string, couriers: string[]) {
    const store = await this.storeRepo.findOne({
      where: { sellerId: userId } as any,
    });
    if (!store) throw new BadRequestException('Toko tidak ditemukan');
    return this.updateActiveCouriers(store.id, couriers);
  }

  // ─── Auto-resolve destination ID dari nama kota/kecamatan ────────
  async resolveDestinationId(keyword: string): Promise<string | null> {
    if (!keyword || keyword.length < 3) return null;
    try {
      const res = await axios.get(
        `${this.baseUrl}/destination/domestic-destination`,
        {
          headers: this.getHeaders(),
          params: { search: keyword, limit: 1, offset: 0 },
        },
      );
      const data = res.data?.data ?? [];
      return data[0]?.id ? String(data[0].id) : null;
    } catch {
      return null;
    }
  }
}
