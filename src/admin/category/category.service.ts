import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/api/catalog/entities/catalog.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  @InjectRepository(CategoryEntity)
  private readonly categoryRepository: Repository<CategoryEntity>;
  async indexAction() {
    const data = await this.categoryRepository.find({
      order: { sort_order: 'ASC' },
    });
    const topCategory = data.filter((item) => item.parent_id === 0);
    const categoryList = [];
    topCategory.map((item: any) => {
      item.level = 1;
      categoryList.push(item);
      data.map((child: any) => {
        if (child.parent_id === item.id) {
          child.level = 2;
          categoryList.push(child);
        }
        if (child.is_show == 1) {
          child.is_show = true;
        } else {
          child.is_show = false;
        }
        if (child.is_channel == 1) {
          child.is_channel = true;
        } else {
          child.is_channel = false;
        }
        if (child.is_category == 1) {
          child.is_category = true;
        } else {
          child.is_category = false;
        }
      });
    });
    return topCategory;
  }
  async topCategoryAction() {
    const data = await this.categoryRepository.find({
      where: { parent_id: 0 },
      order: { id: 'ASC' },
    });
    return data;
  }
  async infoAction(id) {
    const data = await this.categoryRepository.find({
      where: { id },
    });
    return data;
  }
  async categoryStatusAction(payload) {
    const { id, status } = payload;
    let stat = 0;
    if (status === 'true') {
      stat = 1;
    }
    const data = await this.categoryRepository.update(
      { id },
      { is_category: stat },
    );
    return data;
  }
  async showStatusAction(payload) {
    const { id, status } = payload;
    let ele = 0;
    if (status === 'true') {
      ele = 1;
    }
    const data = await this.categoryRepository.update({ id }, { is_show: ele });
    return data;
  }
  async channelStatusAction(payload) {
    const { id, status } = payload;
    let stat = 0;
    if (status == 'true') {
      stat = 1;
    }
    const data = await this.categoryRepository.update(
      { id },
      { is_channel: stat },
    );
    return data;
  }
}
