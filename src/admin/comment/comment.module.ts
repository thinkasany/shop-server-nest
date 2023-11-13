import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopCommentEntity } from 'src/api/goods/entities/comment.entity';
import { GoodsEntity } from 'src/api/goods/entities/good.entity';
import { ShopAdEntity } from '../ad/entities/ad.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShopCommentEntity, GoodsEntity, ShopAdEntity]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
