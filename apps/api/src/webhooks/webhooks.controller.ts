import {
  BadRequestException,
  Controller,
  Headers,
  Post,
  Req,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import Stripe from 'stripe';
import { StripeService } from '../stripe/stripe.service';
import { OrdersService } from '../orders/orders.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(
    private stripe: StripeService,
    private config: ConfigService,
    private orders: OrdersService,
  ) {}

  @Post('stripe')
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!req.rawBody) {
      throw new BadRequestException(
        'Missing raw body — is rawBody enabled on the Nest app?',
      );
    }

    let event: Stripe.Event;
    try {
      event = this.stripe.client.webhooks.constructEvent(
        req.rawBody,
        signature,
        this.config.getOrThrow<string>('STRIPE_WEBHOOK_SECRET'),
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      throw new BadRequestException(
        `Webhook signature verification failed: ${message}`,
      );
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const cartId = session.metadata?.cartId;
      if (cartId) {
        await this.orders.fulfill(cartId, session);
      }
    } else if (event.type === 'checkout.session.expired') {
      const session = event.data.object;
      const cartId = session.metadata?.cartId;
      if (cartId) {
        await this.orders.expireCart(cartId);
      }
    }

    return { received: true };
  }
}
