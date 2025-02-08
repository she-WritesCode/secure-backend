import { Prop, SchemaFactory } from '@nestjs/mongoose';
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
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 }, { unique: true });
