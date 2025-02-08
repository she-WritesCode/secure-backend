import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { AbstractRepository } from '../common/database/abstract.repository';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductRepository extends AbstractRepository<Product> {
  protected readonly logger = new Logger(ProductRepository.name);

  constructor(
    @InjectModel(Product.name) model: Model<Product>,
    @InjectConnection() connection: Connection,
  ) {
    super(model, connection);
  }

  protected searchableFields: (keyof Product)[] = [
    'name',
    'description',
    'category',
    'tags',
  ];
  protected excludedFields: string[] = [];
  protected populateOnFind: string[] = [];
}
