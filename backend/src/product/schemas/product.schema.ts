import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractDocument } from '../../common/database/abstract.schema';

@Schema({ timestamps: true })
export class Product extends AbstractDocument {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  description: string;

  @ApiProperty()
  @Prop({ required: true })
  price: number;

  @ApiProperty()
  @Prop({ required: true })
  quantity: number;

  @ApiProperty()
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty()
  @Prop({ required: false })
  imageUrl: string;

  @ApiProperty()
  @Prop({ required: false })
  category: string;

  @ApiProperty()
  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
