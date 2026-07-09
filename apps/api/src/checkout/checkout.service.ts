import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StripeService } from '../stripe/stripe.service';
import { CartService } from '../cart/cart.service';
import { CartStatus } from '../cart/cart.entity';

@Injectable()
export class CheckoutService {
  constructor(
    private stripe: StripeService,
    private config: ConfigService,
    private cartService: CartService,
  ) {}

  async createSession(cartId: string) {
    const cart = await this.cartService.getCart(cartId);

    if (cart.status !== CartStatus.OPEN || cart.items.length === 0) {
      throw new BadRequestException(
        'Cart is empty or has already been checked out',
      );
    }

    const frontendUrl = this.config.getOrThrow<string>('FRONTEND_URL');

    const session = await this.stripe.client.checkout.sessions.create({
      mode: 'payment',
      line_items: cart.items.map((item) => ({
        price_data: {
          currency: item.variant.currency,
          product_data: { name: item.variant.product.name },
          unit_amount: item.unitPriceCents,
        },
        quantity: item.quantity,
      })),
      success_url: `${frontendUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/checkout/cancel`,
      // essential: the webhook only ever sees the Stripe session, this is how it finds the cart to fulfill
      metadata: { cartId: cart.id },
    });

    return { url: session.url };
  }
}
