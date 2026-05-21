import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  Request,
  Query,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import {
  UsersService,
  UpdateProfileDto,
  ChangePasswordDto,
} from './users.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ── PUBLIC ──────────────────────────────────────────────

  @Post('register')
  @ApiOperation({ summary: 'Daftar akun baru' })
  async register(@Body() body: any) {
    const { email, password, name } = body;
    return this.usersService.create(email, password, name);
  }

  // ── PRIVATE (butuh login) ────────────────────────────────

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ambil profil lengkap user yang login' })
  async getMe(@Request() req) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update profil (nama, email, bio, dll)' })
  async updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }

  @Patch('me/avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update foto profil' })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `avatar-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\//)) {
          return cb(new Error('Hanya file gambar yang diperbolehkan'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    }),
  )
  async updateAvatar(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const avatarUrl = `/uploads/avatars/${file.filename}`;
    return this.usersService.updateAvatar(req.user.userId, avatarUrl);
  }

  @Patch('me/password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ubah password' })
  async changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(req.user.userId, dto);
  }

  @Patch('me/upgrade-seller')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upgrade akun buyer menjadi seller' })
  async upgradeToSeller(@Request() req) {
    return this.usersService.upgradeToSeller(req.user.userId);
  }

  // ── ADMIN ────────────────────────────────────────────────

  @Get()
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: daftar semua user' })
  async findAll(
    @Query('role') role?: string,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll({ role, search });
  }

  @Get('admin-test')
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  @ApiBearerAuth()
  adminOnly() {
    return { message: 'Admin access granted' };
  }

  @Patch(':id/suspend')
  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: suspend/aktifkan user' })
  async suspend(@Param('id') id: string) {
    return this.usersService.suspend(id);
  }
}
