import { IsIn } from 'class-validator';
import { ORDER_STATUSES, OrderStatus } from '../../domain/entities/order.entity';

export class UpdateOrderStatusDto {
  @IsIn(ORDER_STATUSES)
  status: OrderStatus;
}
