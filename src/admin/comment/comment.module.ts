import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopCommentEntity } from 'src/api/goods/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShopCommentEntity])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
