import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractDocument } from 'src/common/database/abstract.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/enums/role.enum';

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
  @Prop({ required: false })
  password: string;

  @ApiProperty()
  @Prop({ required: true, default: false })
  isActive: boolean;

  @ApiProperty()
  @Prop({ required: true, enum: Role, default: Role.CUSTOMER })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 }, { unique: true });
