import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractDocument } from '../../common/database/abstract.schema';
import { SchemaTypes } from 'mongoose';
import { Product } from '../../product/schemas/product.schema';
import { Order } from './order.schema';

@Schema({ timestamps: true })
export class OrderItem extends AbstractDocument {
  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Product', required: true })
  product: string | Product;

  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Order', required: true })
  order: string | Order;

  @ApiProperty()
  @Prop({ required: true, min: 1 })
  quantity: number;

  @ApiProperty()
  @Prop({ required: true })
  price: number;

  @ApiProperty()
  @Prop({ required: false })
  notes?: string;
}
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
