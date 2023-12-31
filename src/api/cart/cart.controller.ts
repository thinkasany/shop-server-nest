import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { GetLoginUserIdInterceptor } from 'src/getLoginUserId.interceptor';
import { CartService } from './cart.service';

@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  // 获取购物车商品的总件件数
  @Get('goodsCount')
  @UseInterceptors(GetLoginUserIdInterceptor)
  goodsCountAction(@Req() request) {
    const { id: userId } = request.user || {};
    return this.cartService.goodsCountAction(userId);
  }
  // 获取购物车信息，所有对购物车的增删改操作，都要重新返回购物车的信息
  @Get('index')
  @UseInterceptors(GetLoginUserIdInterceptor)
  indexAction(@Req() request) {
    const { id: userId } = request.user || {};
    return this.cartService.indexAction(userId);
  }
  // 添加商品到购物车
  @Post('add')
  @UseInterceptors(GetLoginUserIdInterceptor)
  addAction(@Body() payload, @Req() request) {
    const { id: userId } = request.user || {};
    return this.cartService.addAction(payload, userId);
  }
  // 更新指定的购物车信息
  @Post('update')
  @UseInterceptors(GetLoginUserIdInterceptor)
  updateAction(@Body() payload, @Req() request) {
    const { id: userId } = request.user || {};
    return this.cartService.updateAction(payload, userId);
  }
  // 删除选中的购物车商品，批量删除
  @Post('delete')
  @UseInterceptors(GetLoginUserIdInterceptor)
  deleteAction(@Body() payload, @Req() request) {
    const { id: userId } = request.user || {};
    return this.cartService.deleteAction(payload, userId);
  }

  // 订单提交前的检验和填写相关订单信息
  @Get('checkout')
  @UseInterceptors(GetLoginUserIdInterceptor)
  checkoutAction(
    @Req() request,
    @Query('addressId') addressId: number,
    @Query('addType') addType: number,
    @Query('type') type: number,
    @Query('orderFrom') orderFrom?: any,
  ) {
    const { id: userId } = request.user || {};
    const payload = { addressId, addType, orderFrom, type };
    return this.cartService.checkoutAction(payload, userId);
  }

  // 是否选择商品，如果已经选择，则取消选择，批量操作
  @Post('checked')
  @UseInterceptors(GetLoginUserIdInterceptor)
  checkedAction(@Body() payload, @Req() request) {
    const { id: userId } = request.user || {};
    return this.cartService.checkedAction(payload, userId);
  }
}
