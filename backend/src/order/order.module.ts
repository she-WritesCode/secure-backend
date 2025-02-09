import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderRepository } from './order.repository';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';
import { OrderItemRepository } from './repositories/order-item.repository';
import { ShippingAddressRepository } from './repositories/shipping-address.repository';
import { OrderItem, OrderItemSchema } from './schemas/order-item.schema';
import {
  ShippingAddress,
  ShippingAddressSchema,
} from './schemas/shipping-address.schema';

@Module({
  imports: [
    UserModule,
    ProductModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderItem.name, schema: OrderItemSchema },
      { name: ShippingAddress.name, schema: ShippingAddressSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    OrderItemRepository,
    ShippingAddressRepository,
  ],
  exports: [
    OrderService,
    OrderRepository,
    OrderItemRepository,
    ShippingAddressRepository,
  ],
})
export class OrderModule {}
