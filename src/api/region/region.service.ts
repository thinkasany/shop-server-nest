import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegionEntity } from './entities/region.entity';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(RegionEntity)
    private readonly regionRepository: Repository<RegionEntity>,
  ) {}
  async listAction(parentId: number): Promise<RegionEntity[]> {
    console.log(parentId);
    return await this.regionRepository.find({ where: { parent_id: parentId } });
  }
}
