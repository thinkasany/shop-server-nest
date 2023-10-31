import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/auth.entity';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private UserRepository: Repository<UserEntity>,
    private configService: ConfigService,
  ) {}
  async loginByWeixinAction(fullUserInfo: any) {
    const {
      info: { code, rawData, signature },
    } = fullUserInfo;
    const userInfo = JSON.parse(rawData);
    const currentTime = Math.floor(new Date().getTime() / 1000);
    const clientIp = ''; // 暂时不记录 ip test git
    const APPID = this.configService.get<string>('APPID');
    const SECRET = this.configService.get<string>('SECRET');

    // 获取openid
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${SECRET}&js_code=${code}&grant_type=authorization_code`;
    try {
      const response = await axios.get(url);
      const sessionData = response.data;
      console.log(sessionData);
      if (!sessionData.openid) {
        throw new HttpException('请求失败', 500);
      }
      // 验证用户信息完整性
      const sha1 = crypto
        .createHash('sha1')
        .update(rawData + sessionData.session_key)
        .digest('hex');

      console.log(signature, sha1);

      if (signature !== sha1) {
        throw new HttpException('请求失败', 500);
      }

      const user = await this.UserRepository.findOne({
        where: {
          weixin_openid: sessionData.openid,
        },
      });

      const userId = user.id;

      console.log('user', userId);
      let is_new = 0;
      if (!userId) {
        // 注册
        const buffer = Buffer.from(userInfo.nickName);
        const nickname = buffer.toString('base64');
        const newUser = new UserEntity();
        newUser.username = '微信用户' + Math.random().toString(36).substring(7);
        newUser.password = sessionData.openid;
        newUser.register_time = currentTime;
        newUser.register_ip = clientIp;
        newUser.last_login_time = currentTime;
        newUser.last_login_ip = clientIp;
        newUser.mobile = '';
        newUser.weixin_openid = sessionData.openid;
        newUser.avatar = userInfo.avatarUrl || '';
        newUser.gender = userInfo.gender || 1;
        newUser.nickname = nickname;
        newUser.country = userInfo.country || '';
        newUser.province = userInfo.province || '';
        newUser.city = userInfo.city || '';
        this.UserRepository.save(newUser);
        is_new = 1;
      }
      sessionData.user_id = userId;
      // 查询用户信息
      const newbuffer = Buffer.from(userInfo.nickName);
      const nickname = newbuffer.toString('base64');
      console.log(is_new, nickname);

      // 更新登录信息
      await this.UserRepository.update(userId, {
        last_login_time: currentTime,
        last_login_ip: clientIp,
        avatar: userInfo.avatarUrl,
        nickname: nickname,
        country: userInfo.country,
        province: userInfo.province,
        city: userInfo.city,
      });

      const newUserInfo = await this.UserRepository.findOne({
        select: ['id', 'username', 'nickname', 'gender', 'avatar'],
        where: {
          id: userId,
        },
      });
      newUserInfo.nickname = Buffer.from(
        newUserInfo.nickname,
        'base64',
      ).toString();

      console.log('newUserInfo', newUserInfo);
      return {
        token: sessionData.session_key,
        userInfo: newUserInfo,
        is_new,
      };
    } catch (error) {
      console.log(error);
      // 处理请求失败的情况
      throw new Error('HTTP请求失败');
    }
  }
}
