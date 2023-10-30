import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) { }
  async loginByWeixinAction(fullUserInfo: any) {
    const {
      info: { code },
      userInfo,
    } = fullUserInfo;
    const currentTime = Math.floor(new Date().getTime() / 1000);
    // const clientIp = ""; // 暂时不记录 ip test git
    const APPID = this.configService.get<string>('APPID');
    const SECRET = this.configService.get<string>('SECRET');

    console.log('fullUserInfo', fullUserInfo);

    console.log(code, SECRET, APPID);

    // 获取openid
    const options = {
      method: 'GET',
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      qs: {
        grant_type: 'authorization_code',
        js_code: code,
        secret: SECRET,
        appid: APPID,
      },
    };
    console.log('options', options);

    try {
      const response = await axios(options);
      const sessionData = response.data;
      return sessionData;
    } catch (error) {
      // 处理请求失败的情况
      throw new Error('HTTP请求失败');
    }

    return 'This action adds a new auth';
  }
}
