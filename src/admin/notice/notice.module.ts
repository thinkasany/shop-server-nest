import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopNoticeEntity } from './entities/notice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShopNoticeEntity])],
  controllers: [NoticeController],
  providers: [NoticeService],
})
export class NoticeModule {}
