import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { AbstractRepository } from '../../common/database/abstract.repository';
import { OrderItem } from '../schemas/order-item.schema';
import { OrderItemDto } from '../dto/create-order.dto';

@Injectable()
export class OrderItemRepository extends AbstractRepository<
  OrderItem,
  OrderItemDto
> {
  protected readonly logger = new Logger(OrderItemRepository.name);

  constructor(
    @InjectModel(OrderItem.name) model: Model<OrderItem>,
    @InjectConnection() connection: Connection,
  ) {
    super(model, connection);
  }

  // Add custom repository methods here if needed
  protected override populateOnFind = ['product'];
}
