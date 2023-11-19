import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopUserEntity } from 'src/admin/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ShowSettingsEntity } from './entities/showSettings.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(ShowSettingsEntity)
    private showSettingsRepository: Repository<ShowSettingsEntity>,
    @InjectRepository(ShopUserEntity)
    private readonly userRepository: Repository<ShopUserEntity>,
  ) {}
  async showSettingsAction() {
    const data = await this.showSettingsRepository.findOne({
      where: { id: 1 },
    });
    return data;
  }

  async userDetailAction(id) {
    const info = await this.userRepository.findOne({
      where: { id },
      select: ['mobile', 'name'],
    });
    return info;
  }
  async saveAction(payload) {
    const { name, mobile, userId } = payload;
    const myreg =
      /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(16[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
    if (mobile.length < 11) {
      throw new HttpException('长度不对', 500);
    } else if (!myreg.test(mobile)) {
      throw new HttpException('手机不对哦', 500);
    }
    if (name === '' || mobile === '') {
      throw new HttpException('手机不能为空哦', 500);
    }
    const data = {
      name,
      mobile,
      name_mobile: 1,
    };
    const info = await this.userRepository.update(
      {
        id: userId,
      },
      data,
    );
    return info;
  }
}
