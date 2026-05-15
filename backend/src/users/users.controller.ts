import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  async register(@Body() body: any) {
    const { email, password, name, role } = body;
    return this.usersService.create(
      email,
      password,
      name,
      role,
    );
  }

  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  @Get('admin-test')
  adminOnly() {
    return { message: 'Admin access granted' };
  }
  @Get('me')
  getProfile(@Req() req: any) {
    return req.user;
  }
}
