import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateOrderUseCase } from '../../application/use-cases/create-order.use-case';
import { GetOrderUseCase } from '../../application/use-cases/get-order.use-case';
import { ListOrdersUseCase } from '../../application/use-cases/list-orders.use-case';
import { UpdateOrderStatusUseCase } from '../../application/use-cases/update-order-status.use-case';
import { DeleteOrderUseCase } from '../../application/use-cases/delete-order.use-case';
import { CreateOrderDto } from '../../application/dto/create-order.dto';
import { UpdateOrderStatusDto } from '../../application/dto/update-order-status.dto';
import { Order } from '../../domain/entities/order.entity';

/**
 * HTTP adapter for orders. Read/update/delete power the private admin
 * dashboard; create is the public checkout.
 */
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly createOrder: CreateOrderUseCase,
    private readonly getOrder: GetOrderUseCase,
    private readonly listOrders: ListOrdersUseCase,
    private readonly updateOrderStatus: UpdateOrderStatusUseCase,
    private readonly deleteOrder: DeleteOrderUseCase,
  ) {}

  @Get()
  async findAll() {
    const orders = await this.listOrders.execute();
    return orders.map(OrdersController.toView);
  }

  @Post()
  async create(@Body() dto: CreateOrderDto) {
    const order = await this.createOrder.execute(dto);
    return OrdersController.toView(order);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.getOrder.execute(id);
    return OrdersController.toView(order);
  }

  @Patch(':id')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    const order = await this.updateOrderStatus.execute(id, dto.status);
    return OrdersController.toView(order);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteOrder.execute(id);
  }

  private static toView(order: Order) {
    return {
      id: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      status: order.status,
      shippingAddress: {
        country: order.shippingAddress.country,
        city: order.shippingAddress.city,
        street: order.shippingAddress.street,
        houseNumber: order.shippingAddress.houseNumber,
        formatted: order.shippingAddress.formatted,
      },
      totalCents: order.totalCents,
      createdAt: order.createdAt,
      items: order.items.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        unitPriceCents: i.unitPriceCents,
        quantity: i.quantity,
        subtotalCents: i.subtotalCents,
      })),
    };
  }
}
