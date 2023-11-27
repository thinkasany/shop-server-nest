import { Injectable } from '@nestjs/common';

@Injectable()
export class IndexService {
  async preWeixinPayAction(payload) {
    console.log(payload);
  }
}
