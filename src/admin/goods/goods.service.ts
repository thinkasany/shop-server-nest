/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from 'src/api/cart/entities/cart.entity';
import { CategoryEntity } from 'src/api/catalog/entities/catalog.entity';
import { GoodsEntity } from 'src/api/goods/entities/good.entity';
import { GoodsGalleryEntity } from 'src/api/goods/entities/goodsGallery.entity';
import { GoodsSpecificationEntity } from 'src/api/goods/entities/goodsSpecification.entity';
import { ProductEntity } from 'src/api/goods/entities/product.entity';
import { SpecificationEntity } from 'src/api/goods/entities/specification.entity';
import { Repository, Like, MoreThan, LessThanOrEqual } from 'typeorm';
import { ShopFreightTemplateEntity } from './entities/freightTemplate.entity';
import * as qiniu from 'qiniu';
import { v4 as uuid } from 'uuid';

@Injectable()
export class GoodsService {
  @InjectRepository(GoodsEntity)
  private readonly goodsRepository: Repository<GoodsEntity>;
  @InjectRepository(CategoryEntity)
  private readonly categoryRepository: Repository<CategoryEntity>;
  @InjectRepository(ProductEntity)
  private readonly productRepository: Repository<ProductEntity>;
  @InjectRepository(GoodsSpecificationEntity)
  private readonly goodsSpecificationRepository: Repository<GoodsSpecificationEntity>;
  @InjectRepository(SpecificationEntity)
  private readonly specificationRepository: Repository<SpecificationEntity>;
  @InjectRepository(CartEntity)
  private readonly cartRepository: Repository<CartEntity>;
  @InjectRepository(GoodsGalleryEntity)
  private readonly goodsGalleryRepository: Repository<GoodsGalleryEntity>;
  @InjectRepository(ShopFreightTemplateEntity)
  private readonly freightTemplateRepository: Repository<ShopFreightTemplateEntity>;
  constructor(private configService: ConfigService) {}
  async indexAction(payload) {
    const { page = 1, size = 10, name = '' } = payload;
    const [data, total] = await this.goodsRepository.findAndCount({
      where: { is_delete: 0, name: Like(`%${name}%`) },
      order: { sort_order: 'ASC' },
      skip: (page - 1) * size,
      take: size,
    });
    for (const item of data) {
      const info = await this.categoryRepository.findOne({
        where: {
          id: item.category_id,
        },
      });
      item.category_name = info.name;
      if (item.is_on_sale === 1) {
        item.is_on_sale = true;
      } else {
        item.is_on_sale = false;
      }
      if (item.is_index === 1) {
        item.is_index = true;
      } else {
        item.is_index = false;
      }
      const product = await this.productRepository.find({
        where: {
          goods_id: item.id,
          is_delete: 0,
        },
      });
      for (const ele of product) {
        const spec = await this.goodsSpecificationRepository.findOne({
          where: {
            id: Number(ele.goods_specification_ids),
            is_delete: 0,
          },
        });

        ele.value = spec.value;
        ele.is_on_sale = ele.is_on_sale ? '1' : '0';
      }
      item.product = product;
    }
    return {
      data,
      count: total,
      currentPage: page,
      pageSize: size,
    };
  }

  async updateSortAction(payload) {
    const { id, sort } = payload;
    const data = await this.goodsRepository.update(
      {
        id,
      },
      { sort_order: sort },
    );
    return data;
  }

  async indexShowStatusAction(payload) {
    const { id, status } = payload;
    let stat = 0;
    if (status === 'true') {
      stat = 1;
    }
    const data = await this.goodsRepository.update(
      {
        id,
      },
      { is_index: stat },
    );
    return data;
  }

  async saleStatusAction(payload) {
    const { id, status } = payload;
    let sale = 0;
    if (status === 'true') {
      sale = 1;
    }
    await this.goodsRepository.update(
      {
        id,
      },
      { is_on_sale: sale },
    );
    await this.cartRepository.update(
      {
        goods_id: id,
      },
      { is_on_sale: sale, checked: sale },
    );
  }
  async getAllSpecificationAction() {
    const specInfo = await this.specificationRepository.find({
      where: {
        id: MoreThan(0),
      },
    });

    const specOptionsData = [];
    for (const spitem of specInfo) {
      const info = {
        value: spitem.id,
        label: spitem.name,
      };
      specOptionsData.push(info);
    }
    return specOptionsData;
  }
  async getAllCategoryAction() {
    const data = await this.categoryRepository.find({
      where: {
        is_show: 1,
        level: 'L1',
      },
      select: ['id', 'name'],
    });
    const newData = [];
    for (const item of data) {
      const children = [];
      const c_data = await this.categoryRepository.find({
        where: {
          is_show: 1,
          level: 'L2',
          parent_id: item.id,
        },
        select: ['id', 'name'],
      });
      for (const c_item of c_data) {
        children.push({
          value: c_item.id,
          label: c_item.name,
        });
      }
      newData.push({
        value: item.id,
        label: item.name,
        children: children,
      });
    }
    return newData;
  }
  async getGalleryListAction(payload) {
    const { goodsId } = payload;
    const data = await this.goodsGalleryRepository.find({
      where: {
        goods_id: goodsId,
        is_delete: 0,
      },
      order: { sort_order: 'ASC' },
    });
    const galleryData = [];
    for (const item of data) {
      const pdata = {
        id: item.id,
        url: item.img_url,
        is_delete: 0,
      };
      galleryData.push(pdata);
    }
    const info = {
      galleryData: galleryData,
    };
    return info;
  }
  async getExpressDataAction() {
    const kd = [];
    const cate = [];
    const kdData = await this.freightTemplateRepository.find({
      where: {
        is_delete: 0,
      },
    });

    for (const item of kdData) {
      kd.push({
        value: item.id,
        label: item.name,
      });
    }
    const cateData = await this.categoryRepository.find({
      where: {
        parent_id: 0,
      },
    });

    for (const item of cateData) {
      cate.push({
        value: item.id,
        label: item.name,
      });
    }
    const infoData = {
      kd: kd,
      cate: cate,
    };
    return infoData;
  }
  async infoAction(payload) {
    const { id } = payload;
    const data = await this.goodsRepository.findOne({
      where: { id },
    });

    const category_id = data.category_id;
    const infoData = {
      info: data,
      category_id: category_id,
    };
    return infoData;
  }
  async onsaleAction(payload) {
    const { page = 1, size } = payload;

    const [data, total] = await this.goodsRepository.findAndCount({
      where: {
        is_delete: 0,
        is_on_sale: 1,
      },
      order: { sort_order: 'asc' },
      skip: (page - 1) * size,
      take: size,
    });
    for (const item of data) {
      const info = await this.categoryRepository.findOne({
        where: {
          id: item.category_id,
        },
      });
      item.category_name = info.name;

      if (item.is_on_sale == 1) {
        item.is_on_sale = true;
      } else {
        item.is_on_sale = false;
      }
      if (item.is_index == 1) {
        item.is_index = true;
      } else {
        item.is_index = false;
      }
      const product = await this.productRepository.find({
        where: {
          goods_id: item.id,
          is_delete: 0,
        },
      });

      for (const ele of product) {
        const spec = await this.goodsSpecificationRepository.findOne({
          where: {
            id: Number(ele.goods_specification_ids),
            is_delete: 0,
          },
        });
        ele.value = spec.value;
        ele.is_on_sale = ele.is_on_sale ? '1' : '0';
      }
      item.product = product;
    }
    return {
      count: total,
      data,
      pageSize: size,
      page,
    };
  }
  async outAction(payload) {
    const { page = 1, size } = payload;

    const [data, total] = await this.goodsRepository.findAndCount({
      where: {
        is_delete: 0,
        goods_number: LessThanOrEqual(0),
      },
      order: { sort_order: 'asc' },
      skip: (page - 1) * size,
      take: size,
    });
    console.log(data);

    for (const item of data) {
      const info = await this.categoryRepository.findOne({
        where: {
          id: item.category_id,
        },
      });

      item.category_name = info.name;
      if (item.is_on_sale == 1) {
        item.is_on_sale = true;
      } else {
        item.is_on_sale = false;
      }
      if (item.is_index == 1) {
        item.is_index = true;
      } else {
        item.is_index = false;
      }
      const product = await this.productRepository.find({
        where: {
          goods_id: item.id,
          is_delete: 0,
        },
      });

      for (const ele of product) {
        const spec = await this.goodsSpecificationRepository.find({
          where: {
            id: Number(ele.goods_specification_ids),
            is_delete: 0,
          },
        });
        console.log(spec);

        // ele.value = spec.value;
        ele.is_on_sale = ele.is_on_sale ? '1' : '0';
      }
      item.product = product;
    }
    return data;
  }
  async dropAction(payload) {
    const { page = 1, size } = payload;
    const data = await this.goodsRepository.find({
      where: {
        is_delete: 0,
        is_on_sale: 0,
      },
      order: { id: 'DESC' },
      skip: (page - 1) * size,
      take: size,
    });

    for (const item of data) {
      const info: any = await this.categoryRepository.find({
        where: {
          id: item.category_id,
        },
      });

      item.category_name = info.name;
      if (item.is_on_sale == 1) {
        item.is_on_sale = true;
      } else {
        item.is_on_sale = false;
      }
      if (item.is_index == 1) {
        item.is_index = true;
      } else {
        item.is_index = false;
      }
      const product = await this.productRepository.find({
        where: {
          goods_id: item.id,
          is_delete: 0,
        },
      });

      for (const ele of product) {
        const spec = await this.goodsSpecificationRepository.find({
          where: {
            id: Number(ele.goods_specification_ids),
            is_delete: 0,
          },
        });

        // ele.value = spec.value;
        ele.is_on_sale = ele.is_on_sale ? '1' : '0';
      }
      item.product = product;
    }
    return data;
  }
  async uploadHttpsImageAction(payload) {
    const { url } = payload;
    const access_key = this.configService.get<string>('qiniu_access_key');
    const secret_key = this.configService.get<string>('qiniu_secret_key');
    const bucket = this.configService.get<string>('qiniu_bucket');
    const domain = this.configService.get<string>('qiniu_domain');
    const mac = new qiniu.auth.digest.Mac(access_key, secret_key);
    let config: any = new qiniu.conf.Config();
    const zoneNum = this.configService.get<number>('zoneNum');
    if (zoneNum == 0) {
      config.zone = qiniu.zone.Zone_z0;
    } else if (zoneNum == 1) {
      config.zone = qiniu.zone.Zone_z1;
    } else if (zoneNum == 2) {
      config.zone = qiniu.zone.Zone_z2;
    } else if (zoneNum == 3) {
      config.zone = qiniu.zone.Zone_na0;
    } else if (zoneNum == 4) {
      config.zone = qiniu.zone.Zone_as0;
    }
    const bucketManager = new qiniu.rs.BucketManager(mac, config);
    const key = uuid(32);
    // 公开空间访问链接

    const uploadQiniu = async () => {
      return new Promise((resolve, reject) => {
        try {
          bucketManager.fetch(
            url,
            bucket,
            key,
            function (err, respBody, respInfo) {
              if (err) {
                console.log('err', err);
                //throw err;
              } else {
                if (respInfo.statusCode == 200) {
                  resolve(respBody.key);
                } else {
                  console.log(respInfo);
                  console.log('respInfo.statusCode', respInfo.statusCode);
                }
              }
            },
          );
        } catch (e) {
          return resolve(null);
        }
      });
    };
    const httpsUrl = await uploadQiniu();
    let lastUrl = domain + httpsUrl;
    console.log('httpsUrl', httpsUrl, lastUrl);
    return {
      lastUrl,
    };
  }
}
