import { Controller, Post, Body, Ip } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  loginAction(@Body() payload, @Ip() ip) {
    return this.authService.loginAction(payload, ip);
  }
}
