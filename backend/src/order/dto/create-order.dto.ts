import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Optional } from '@nestjs/common';

export class OrderItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  product: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  price: number;
}

export class ShippingDetailsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  addressLine1: string;

  @ApiProperty()
  @Optional()
  @IsString()
  addressLine2: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty()
  @Optional()
  deliveryInstructions: string;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ type: ShippingDetailsDto })
  @ValidateNested()
  @Type(() => ShippingDetailsDto)
  shippingAddress: ShippingDetailsDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  user: string;
}
