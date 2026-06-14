import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ShippingCostDto } from './dto/shipping-cost.dto';

@Injectable()
export class ShippingService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('RAJAONGKIR_API_KEY') ?? '';
    this.baseUrl =
      this.configService.get<string>('RAJAONGKIR_BASE_URL') ??
      'https://rajaongkir.komerce.id/api/v1';
  }

  private getHeaders() {
    if (!this.apiKey) {
      throw new InternalServerErrorException(
        'RAJAONGKIR_API_KEY belum dikonfigurasi di .env',
      );
    }
    return { key: this.apiKey };
  }

  // ─── Cari kota/kecamatan untuk dropdown asal/tujuan ───────────────
  async searchDestination(search: string) {
    if (!search || search.length < 3) {
      throw new BadRequestException('Minimal 3 karakter untuk pencarian');
    }

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

  // ─── Hitung ongkos kirim ───────────────────────────────────────────
  async calculateCost(dto: ShippingCostDto) {
    try {
      const res = await axios.post(
        `${this.baseUrl}/calculate/domestic-cost`,
        new URLSearchParams({
          origin: dto.origin,
          destination: dto.destination,
          weight: String(dto.weight),
          courier: dto.courier,
          price: 'lowest',
        }),
        {
          headers: {
            ...this.getHeaders(),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const data = res.data?.data ?? [];

      // Normalisasi response
      return data.map((item: any) => ({
        courier: dto.courier,
        service: item.service,
        description: item.description,
        cost: item.cost,
        etd: item.etd,
      }));
    } catch (err: any) {
      throw new InternalServerErrorException(
        err?.response?.data?.meta?.message || 'Gagal menghitung ongkir',
      );
    }
  }
}
