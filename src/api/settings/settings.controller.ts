import { Controller, Get } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('api/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('showSettings')
  findAll() {
    return this.settingsService.showSettingsAction();
  }
}
