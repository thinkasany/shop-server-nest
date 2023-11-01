import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

// fixme 初学，不确定这种场景下是不是要用拦截器，后续研究一下 先推进项目进展
// 写这个是为了verify 取回 req 中的 user信息，guard会拒绝网络请求，但是我们现在的场景是可选的 user 允许未登录
@Injectable()
export class GetLoginUserIdInterceptor implements NestInterceptor {
  @Inject(JwtService)
  private jwtService: JwtService;
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-xzzshop-token'] || '';
    try {
      const data = await this.jwtService.verify(token);
      request.user = data;
    } catch (e) {
      console.log(e);
    }
    return next.handle();
  }
}
