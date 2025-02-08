import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from './order.repository';
import { UserService } from '../user/user.service';
import { ProductRepository } from 'src/product/product.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly userService: UserService,
    private readonly productRepository: ProductRepository,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    let user = createOrderDto.user;

    if (!user) {
      const guestUser = await this.userService.createGuestUser({
        email: createOrderDto.shippingAddress.email,
        phoneNumber: createOrderDto.shippingAddress.phoneNumber,
        name: createOrderDto.shippingAddress.fullName,
      });
      user = guestUser._id;
    }

    const products = await this.productRepository.find({
      _id: { $in: createOrderDto.items.map((item) => item.product) },
    });

    const orderItems: OrderItemDto[] = createOrderDto.items.map((item) => ({
      ...item,
      price: products.find((it) => it._id === item.product).price,
    }));

    return this.orderRepository.create({
      ...createOrderDto,
      items: orderItems,
      user,
    });
  }

  async findAll(query: Record<string, any> = {}) {
    return this.orderRepository.find(query);
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({ _id: id });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const updatedOrder = await this.orderRepository.findOneAndUpdate(
      { _id: id },
      updateOrderDto,
    );
    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return updatedOrder;
  }

  async remove(id: string) {
    const deletedOrder = await this.orderRepository.deleteOne({ _id: id });
    if (!deletedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return deletedOrder;
  }

  async findUserOrders(userId: string) {
    return this.orderRepository.find({ userId });
  }
}
