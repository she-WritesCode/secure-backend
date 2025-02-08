import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { AbstractRepository } from '../common/database/abstract.repository';
import { Order } from './schemas/order.schema';

@Injectable()
export class OrderRepository extends AbstractRepository<Order> {
  protected readonly logger = new Logger(OrderRepository.name);

  constructor(
    @InjectModel(Order.name) model: Model<Order>,
    @InjectConnection() connection: Connection,
  ) {
    super(model, connection);
  }

  protected searchableFields: (keyof Order)[] = [
    'status',
    'paymentStatus',
    'trackingNumber',
  ];
  protected excludedFields: string[] = [];
  protected populateOnFind: string[] = ['user', 'items', 'shippingAddress'];
}
