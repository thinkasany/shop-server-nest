import { Controller, Get, Req, UseGuards, Post, Body } from '@nestjs/common';
import { LoginGuard } from 'src/login.guard';
import { SettingsService } from './settings.service';

@Controller('api/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('showSettings')
  findAll() {
    return this.settingsService.showSettingsAction();
  }
  @Get('userDetail')
  @UseGuards(LoginGuard)
  userDetailAction(@Req() request) {
    const { id: userId } = request.user;
    return this.settingsService.userDetailAction(userId);
  }
  @Post('save')
  @UseGuards(LoginGuard)
  saveAction(@Body() payload: any, @Req() request) {
    const { id: userId } = request.user;
    return this.settingsService.saveAction({ ...payload, userId });
  }
}
