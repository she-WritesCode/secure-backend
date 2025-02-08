import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractDocument } from '../../common/database/abstract.schema';

@Schema({ timestamps: true })
export class ShippingAddress extends AbstractDocument {
  @ApiProperty()
  @Prop({ required: true })
  fullName: string;

  @ApiProperty()
  @Prop({ required: true })
  addressLine1: string;

  @ApiProperty()
  @Prop({ required: false })
  addressLine2: string;

  @ApiProperty()
  @Prop({ required: true })
  city: string;

  @ApiProperty()
  @Prop({ required: true })
  state: string;

  @ApiProperty()
  @Prop({ required: true })
  country: string;

  @ApiProperty()
  @Prop({ required: true })
  postalCode: string;

  @ApiProperty()
  @Prop({ required: true })
  phoneNumber: string;

  @ApiProperty()
  @Prop({ required: false })
  deliveryInstructions: string;
}

export const ShippingAddressSchema =
  SchemaFactory.createForClass(ShippingAddress);
