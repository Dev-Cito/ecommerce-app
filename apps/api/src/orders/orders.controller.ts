import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Controller('orders')
export class OrdersController {
  constructor(@InjectRepository(Order) private orders: Repository<Order>) {}

  @Get('by-session/:sessionId')
  async findBySession(@Param('sessionId') sessionId: string) {
    const order = await this.orders.findOne({
      where: { stripeSessionId: sessionId },
      relations: { items: true },
    });
    if (!order) {
      throw new NotFoundException(
        'Order not found yet — the webhook may still be processing',
      );
    }
    return order;
  }
}
