import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ShopAdminEntity } from './entities/auth.entity';
import * as md5 from 'md5';

@Injectable()
export class AuthService {
  @InjectRepository(ShopAdminEntity)
  private readonly adminRepository: Repository<ShopAdminEntity>;
  @Inject(JwtService)
  private jwtService: JwtService;
  async loginAction(payload, ip) {
    const { username, password } = payload;
    const admin = await this.adminRepository.findOne({
      where: { username },
    });
    if (!admin) {
      throw new HttpException('用户名或密码不正确', 500);
    }
    // console.log(md5(password + admin.password_salt) === admin.password);
    if (md5(password + admin.password_salt) !== admin.password) {
      throw new HttpException('用户名或密码不正确', 500);
    }
    // 更新登录信息
    await this.adminRepository.update(
      { username },
      {
        last_login_time: Number(Date.now() / 1000),
        last_login_ip: ip,
      },
    );
    const userInfo = {
      id: admin.id,
      username: admin.username,
    };
    return {
      token: await this.jwtService.signAsync({ user: userInfo }),
      userInfo,
    };
  }
}
