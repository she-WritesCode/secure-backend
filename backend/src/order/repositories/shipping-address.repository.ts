import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { AbstractRepository } from '../../common/database/abstract.repository';
import { ShippingAddress } from '../schemas/shipping-address.schema';

@Injectable()
export class ShippingAddressRepository extends AbstractRepository<ShippingAddress> {
  protected readonly logger = new Logger(ShippingAddressRepository.name);

  constructor(
    @InjectModel(ShippingAddress.name)
    model: Model<ShippingAddress>,
    @InjectConnection() connection: Connection,
  ) {
    super(model, connection);
  }

  // Add custom repository methods here if needed
}
