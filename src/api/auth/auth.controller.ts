import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('loginByWeixin')
  async create(@Body() userInfo: any) {
    const response = await this.authService.loginByWeixinAction(userInfo);
    return response;
  }
}
