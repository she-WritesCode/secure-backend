import { Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractDocument } from 'src/common/database/abstract.schema';
import { Role } from '../types/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

export class User extends AbstractDocument {
  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  email: string;

  @ApiProperty()
  @Prop({ required: true })
  phoneNumber: string;

  @ApiProperty()
  @Prop({ required: true })
  password: string;

  @ApiProperty()
  @Prop({ required: true, enum: Role, default: Role.CUSTOMER })
  role: Role;

  @ApiProperty()
  @Prop({ required: false })
  address: string;

  @ApiProperty()
  @Prop({ required: false })
  city: string;

  @ApiProperty()
  @Prop({ required: false })
  country: string;
}
