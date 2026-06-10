import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from '../users/users.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ambil profil user yang sedang login' })
  async profile(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) throw new NotFoundException('User tidak ditemukan');

    // Return data lengkap (tanpa password)
    return {
      userId: user.id,
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      bio: user.bio,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      role: user.role,
      kycStatus: user.kycStatus,
      kycVerified: user.kycVerified,
      withdrawBlocked: user.withdrawBlocked,
      sellerRegStatus: user.sellerRegStatus,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}
