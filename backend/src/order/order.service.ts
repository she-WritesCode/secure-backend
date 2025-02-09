import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from './order.repository';
import { UserService } from '../user/user.service';
import { ProductRepository } from 'src/product/product.repository';
import { OrderItemRepository } from './repositories/order-item.repository';
import { ShippingAddressRepository } from './repositories/shipping-address.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly userService: UserService,
    private readonly productRepository: ProductRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly shippingAddressRepository: ShippingAddressRepository,
  ) {}

  private async processGuestUser(createOrderDto: any) {
    const guestUser = await this.userService.createGuestUser({
      email: createOrderDto.shippingAddress.email,
      phoneNumber: createOrderDto.shippingAddress.phoneNumber,
      name: createOrderDto.shippingAddress.fullName,
    });
    return guestUser._id;
  }

  private async validateProducts(items: OrderItemDto[]) {
    const productIds = items.map((item) => item.product);
    const products = await this.productRepository.find({
      _id: { $in: productIds },
    });

    if (products.length !== productIds.length) {
      const foundProductIds = products.map((p) => p._id.toString());
      const missingProductIds = productIds.filter(
        (id) => !foundProductIds.includes(id.toString()),
      );
      throw new NotFoundException(
        `Products not found: ${missingProductIds.join(', ')}`,
      );
    }

    return products;
  }

  private defineOrderItems(
    items: OrderItemDto[],
    products: any[],
  ): OrderItemDto[] {
    return items.map((item) => {
      const product = products.find(
        (p) => p._id.toString() === item.product.toString(),
      );
      return {
        ...item,
        price: product.price,
      };
    });
  }

  private calculateTotalAmount(orderItems: OrderItemDto[]): number {
    return orderItems.reduce((acc, cur) => acc + cur.quantity * cur.price, 0);
  }

  async create(dto: CreateOrderDto) {
    const { items, ...createOrderDto } = dto;
    let user = createOrderDto.user;

    if (!user) {
      user = await this.processGuestUser(createOrderDto);
    }

    const products = await this.validateProducts(items);
    const [shippingAddress] = await this.shippingAddressRepository.findOrCreate(
      {
        email: createOrderDto.shippingAddress.email,
        addressLine1: createOrderDto.shippingAddress.addressLine1,
      },
      createOrderDto.shippingAddress,
    );

    const orderItems = this.defineOrderItems(items, products);
    const totalAmount = this.calculateTotalAmount(orderItems);
    const trackingNumber = await this.generateTrackingNumber();

    const order = await this.orderRepository.create({
      ...createOrderDto,
      shippingAddress: shippingAddress._id,
      user,
      totalAmount,
      trackingNumber,
    });

    const createOrderItems = orderItems.map((item) => ({
      ...item,
      order: order._id,
    }));

    await this.orderItemRepository.bulkCreate(createOrderItems);

    return this.findOne(order._id);
  }

  async generateTrackingNumber(): Promise<string> {
    const prefix = 'TRK';
    const date = new Date();
    const startOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const timestamp =
      date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0');

    // Count orders for the current day
    const todayOrderCount = await this.orderRepository.count({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    const counter = (todayOrderCount + 1).toString().padStart(4, '0');
    return `${prefix}-${timestamp}-${counter}`;
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
