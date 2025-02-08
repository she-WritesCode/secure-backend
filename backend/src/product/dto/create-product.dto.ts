import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  tags: string[];
}
