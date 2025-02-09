import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractDocument } from '../../common/database/abstract.schema';
import { SchemaTypes } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { OrderItem } from './order-item.schema';
import { ShippingAddress } from './shipping-address.schema';
import { OrderStatus, PaymentStatus } from '../types/status.enum';

@Schema({ timestamps: true })
export class Order extends AbstractDocument {
  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user: string | User;

  @ApiProperty()
  items?: OrderItem[];

  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, ref: 'ShippingAddress', required: true })
  shippingAddress: string | ShippingAddress;

  @ApiProperty()
  @Prop({ required: true })
  totalAmount: number;

  @ApiProperty()
  @Prop({ enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @ApiProperty()
  @Prop({ enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @ApiProperty()
  @Prop({ required: false })
  paymentMethod: string;

  @ApiProperty()
  @Prop({ required: true })
  trackingNumber: string;

  @ApiProperty()
  @Prop({ required: false })
  notes: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ trackingNumber: 1 }, { unique: true });
OrderSchema.virtual('items', {
  ref: 'OrderItem',
  localField: '_id',
  foreignField: 'order',
  justOne: false,
});
