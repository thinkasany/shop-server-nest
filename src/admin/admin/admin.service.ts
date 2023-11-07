import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { ShopAdminEntity } from './entities/admin.entity';
import { ShopShowSettingsEntity } from './entities/shopShowSettings.entity';

@Injectable()
export class AdminService {
  @InjectRepository(ShopShowSettingsEntity)
  private readonly ShopShowSettingsRepository: Repository<ShopShowSettingsEntity>;
  @InjectRepository(ShopAdminEntity)
  private readonly adminRepository: Repository<ShopAdminEntity>;
  async showsetAction() {
    const data = await this.ShopShowSettingsRepository.find();
    return data[0];
  }
  async showsetStoreAction(payload) {
    const id = 1;
    await this.ShopShowSettingsRepository.update(
      {
        id,
      },
      {
        ...payload,
      },
    );
  }

  async indexAction() {
    const data = await this.adminRepository.find({
      where: {
        is_delete: 0,
      },
    });
    for (const item of data) {
      if (item.last_login_time != 0) {
        item.last_login_time = dayjs
          .unix(item.last_login_time as number)
          .format('YYYY-MM-DD HH:mm:ss');
      } else {
        item.last_login_time = '还没登录过';
      }
      item.password = '';
    }
    return data;
  }
}
