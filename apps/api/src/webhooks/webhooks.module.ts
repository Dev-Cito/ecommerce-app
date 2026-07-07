import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { StripeModule } from '../stripe/stripe.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [StripeModule, OrdersModule],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
