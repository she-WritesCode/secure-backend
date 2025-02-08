import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Request } from 'express';
import { IsPublic } from 'src/common/decorators/public.decorator';

@ApiTags('Order')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Roles('CUSTOMER')
  @Get('/')
  @ApiOperation({ summary: 'Get all current user orders' })
  @ApiResponse({
    status: 200,
    description: 'Return the current order profile.',
  })
  findAllPublished(@Req() req: Request & { user: any }) {
    return this.orderService.findAll({ user: req.user?.userId });
  }

  @Roles('ADMIN')
  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Roles('ADMIN')
  @Get('/all')
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Return all orders.' })
  // TODO Unsecure because of no query validation
  findAll(@Query() query: Record<string, any>) {
    return this.orderService.findAll(query);
  }

  @Roles('ADMIN')
  @Get(':id')
  @ApiOperation({ summary: 'Get a order by id' })
  @ApiResponse({ status: 200, description: 'Return the order.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a order' })
  @ApiResponse({ status: 200, description: 'Order successfully updated.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a order' })
  @ApiResponse({ status: 200, description: 'Order successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }

  @IsPublic()
  @Post('/checkout')
  @ApiOperation({ summary: 'Process order checkout' })
  @ApiResponse({ status: 201, description: 'Order successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  checkout(@Body() checkoutDto: CreateOrderDto) {
    return this.orderService.create(checkoutDto);
  }
}
